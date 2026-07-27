"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StringUtil_service_1 = __importDefault(require("./StringUtil.service"));
const constants_service_1 = __importDefault(require("./constants.service"));
class JSonDteItemService {
    /**
     * E8. Campos que describen los ítems de la operación (E700-E899)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosItemsOperacion(params, data, config) {
        const jsonResult = [];
        //Recorrer array de infoCuotas e informar en el JSON
        if (data['items'] && data['items'].length > 0) {
            for (let i = 0; i < data['items'].length; i++) {
                const item = data['items'][i];
                const gCamItem = {
                    dCodInt: item['codigo'],
                };
                if (item['partidaArancelaria']) {
                    gCamItem['dParAranc'] = item['partidaArancelaria'];
                }
                if (item['ncm']) {
                    gCamItem['dNCM'] = item['ncm'];
                }
                //
                if (item['dncp'] && item['dncp']['codigoGtinProducto']) {
                    gCamItem['dGtin'] = item['dncp']['codigoGtinProducto'];
                }
                //
                if (data['cliente']['tipoOperacion'] && data['cliente']['tipoOperacion'] === 3) {
                    if (item['dncp'] && item['dncp']['codigoNivelGeneral']) {
                        gCamItem['dDncpG'] = StringUtil_service_1.default.leftZero(item['dncp']['codigoNivelGeneral'], 8);
                    }
                    if (item['dncp'] && item['dncp']['codigoNivelEspecifico']) {
                        gCamItem['dDncpE'] = item['dncp']['codigoNivelEspecifico'];
                    }
                    //}
                    //if (data['cliente']['tipoOperacion'] && data['cliente']['tipoOperacion'] === 3) {
                    if (item['dncp'] && item['dncp']['codigoGtinProducto']) {
                        gCamItem['dGtin'] = item['dncp']['codigoGtinProducto'];
                    }
                    if (item['dncp'] && item['dncp']['codigoNivelPaquete']) {
                        gCamItem['dGtinPq'] = item['dncp']['codigoNivelPaquete'];
                    }
                }
                gCamItem['dDesProSer'] = item['descripcion']; // RG 24/2019
                gCamItem['cUniMed'] = item['unidadMedida'];
                gCamItem['dDesUniMed'] = constants_service_1.default.unidadesMedidas
                    .filter((um) => um.codigo === +item['unidadMedida'])[0]['representacion'].trim();
                gCamItem['dCantProSer'] = item['cantidad'];
                if (item['pais']) {
                    gCamItem['cPaisOrig'] = item['pais'];
                    gCamItem['dDesPaisOrig'] = constants_service_1.default.paises.filter((pais) => pais.codigo === item['pais'])[0]['descripcion'];
                }
                if (item['observacion'] && (item['observacion'] + '').trim().length > 0) {
                    gCamItem['dInfItem'] = (item['observacion'] + '').trim();
                }
                if (data['tipoDocumento'] === 7) {
                    if (item['tolerancia']) {
                        gCamItem['cRelMerc'] = +item['tolerancia'];
                        if (constants_service_1.default.relevanciasMercaderias.filter((um) => um.codigo === +item['tolerancia']).length > 0) {
                            gCamItem['dDesRelMerc'] = constants_service_1.default.relevanciasMercaderias.filter((um) => um.codigo === +item['tolerancia'])[0]['descripcion'];
                        }
                        if (item['toleranciaCantidad']) {
                            gCamItem['dCanQuiMer'] = item['toleranciaCantidad'];
                        }
                        if (item['toleranciaPorcentaje']) {
                            gCamItem['dPorQuiMer'] = item['toleranciaPorcentaje'];
                        }
                    }
                }
                //Tratamiento E719. Tiene relacion con generateDatosGeneralesInherentesOperacion
                if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 4) {
                    //if (data['tipoTransaccion'] === 9) {
                    if (item['cdcAnticipo']) {
                        gCamItem['dCDCAnticipo'] = item['cdcAnticipo'];
                    }
                    //}
                }
                if (data['tipoDocumento'] != 7) {
                    //Oblitatorio informar
                    gCamItem['gValorItem'] = this.generateDatosItemsOperacionPrecioTipoCambioTotal(params, data, item, i, config);
                }
                if (data['tipoImpuesto'] == 1 ||
                    data['tipoImpuesto'] == 3 ||
                    data['tipoImpuesto'] == 4 ||
                    data['tipoImpuesto'] == 5) {
                    if (data['tipoDocumento'] != 4 && data['tipoDocumento'] != 7) {
                        gCamItem['gCamIVA'] = this.generateDatosItemsOperacionIVA(params, data, item, i, Object.assign({}, gCamItem), config);
                    }
                }
                //Rastreo
                if (item['lote'] ||
                    item['vencimiento'] ||
                    item['numeroSerie'] ||
                    item['numeroPedido'] ||
                    item['numeroSeguimiento'] ||
                    item['registroSenave'] ||
                    item['registroEntidadComercial']) {
                    gCamItem['gRasMerc'] = this.generateDatosItemsOperacionRastreoMercaderias(params, data, item, i);
                }
                //Automotores
                if (item['sectorAutomotor'] && item['sectorAutomotor']['tipo']) {
                    gCamItem['gVehNuevo'] = this.generateDatosItemsOperacionSectorAutomotores(params, data, item, i);
                }
                jsonResult.push(gCamItem);
            } //end-for
            //Verificacion de Totales de Descuento Global y Anticipo
            //Con los prorrateos pueden haber diferencias
            //Las diferencias se corrigen en el ultimo item
            let totalDescuentoGlobal = 0;
            let totalAnticipoGlobal = 0;
            if (data['descuentoGlobal'] > 0 || data['anticipoGlobal'] > 0) {
                for (let i = 0; i < jsonResult.length; i++) {
                    const gCamItem = jsonResult[i];
                    if (data['descuentoGlobal']) {
                        totalDescuentoGlobal += gCamItem['dCantProSer'] * gCamItem['gValorItem']['gValorRestaItem']['dDescGloItem'];
                    }
                    if (data['anticipoGlobal']) {
                        totalAnticipoGlobal +=
                            gCamItem['dCantProSer'] * gCamItem['gValorItem']['gValorRestaItem']['dAntGloPreUniIt'];
                    }
                }
                if (data['descuentoGlobal'] > 0) {
                    if (data['descuentoGlobal'] != totalDescuentoGlobal) {
                        console.log('hay una diferencia', data['descuentoGlobal'], totalDescuentoGlobal);
                        //throw new Error("hay una diferencia", data['descuentoGlobal'], totalDescuentoGlobal);
                    }
                }
                if (data['anticipoGlobal'] > 0) {
                    if (data['anticipoGlobal'] != totalDescuentoGlobal) {
                        console.log('hay una diferencia', data['anticipoGlobal'], totalAnticipoGlobal);
                        //throw new Error("hay una diferencia", data['anticipoGlobal'], totalDescuentoGlobal);
                    }
                }
            }
        }
        return jsonResult;
    }
    /**
     * E8.1. Campos que describen el precio, tipo de cambio y valor total de la operación por ítem (E720-E729)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosItemsOperacionPrecioTipoCambioTotal(params, data, item, i, config) {
        const jsonResult = {};
        //Mejor no tocar como el usuario envia desde el JSON
        jsonResult['dPUniProSer'] = item['precioUnitario'];
        jsonResult['dTotBruOpeItem'] = parseFloat(jsonResult['dPUniProSer']) * parseFloat(item['cantidad']);
        //console.log("dTotBruOpeItem 1", jsonResult['dTotBruOpeItem']);
        if (config.sum0_000001SuffixBeforeToFixed == true) {
            jsonResult['dTotBruOpeItem'] += 0.000001;
        }
        jsonResult['dTotBruOpeItem'] = parseFloat(jsonResult['dTotBruOpeItem'].toFixed(config.decimals));
        //console.log("dTotBruOpeItem 2", jsonResult['dTotBruOpeItem']);
        if (data.moneda === 'PYG') {
            jsonResult['dTotBruOpeItem'] = parseFloat(jsonResult['dTotBruOpeItem'].toFixed(config.pygDecimals));
        }
        if (data['condicionTipoCambio'] && data['condicionTipoCambio'] == 2) {
            jsonResult['dTiCamIt'] = item['cambio'];
        }
        jsonResult['gValorRestaItem'] = this.generateDatosItemsOperacionDescuentoAnticipoValorTotal(params, data, item, i, config);
        return jsonResult;
    }
    /**
     * E8.1.1 Campos que describen los descuentos, anticipos y valor total por ítem (EA001-EA050)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosItemsOperacionDescuentoAnticipoValorTotal(params, data, item, i, config) {
        const jsonResult = {};
        jsonResult['dDescItem'] = 0;
        if (item['descuento'] && +item['descuento'] > 0) {
            //El descuento por item se pasa asi mismo como viene en el JSON, sin redondeos, igual al precio
            jsonResult['dDescItem'] = item['descuento'];
            /*      //Validar que si el descuento es mayor al precio
            jsonResult['dDescItem'] = parseFloat(item['descuento']).toFixed(config.decimals);
      
            if (data.moneda === 'PYG') {
              jsonResult['dDescItem'] = parseFloat(jsonResult['dDescItem']).toFixed(config.pygDecimals);
            }
      */
            //FacturaSend calcula solo el % Descuento, no hace falta informar
            jsonResult['dPorcDesIt'] = Math.round((parseFloat(item['descuento']) * 100) / parseFloat(item['precioUnitario']));
        }
        let totalGeneral = 0;
        for (let i = 0; i < data['items'].length; i++) {
            const item2 = data['items'][i];
            totalGeneral += item2['cantidad'] * item2['precioUnitario'];
        }
        jsonResult['dDescGloItem'] = 0;
        if (data['descuentoGlobal'] && +data['descuentoGlobal'] > 0) {
            let subtotal = item['cantidad'] * item['precioUnitario'];
            let pesoPorc = (100 * subtotal) / totalGeneral;
            let descuentoGlobalAplicado = (data['descuentoGlobal'] * pesoPorc) / 100;
            let descuentoGlobalUnitario = descuentoGlobalAplicado / item['cantidad'];
            jsonResult['dDescGloItem'] = parseFloat(descuentoGlobalUnitario + '').toFixed(8); //Deja en el maximo permitido para que el calculo al final salga exacto
            if (data.moneda === 'PYG') {
                //jsonResult['dDescGloItem'] = parseFloat(jsonResult['dDescGloItem']).toFixed(config.pygDecimals);
            }
        }
        jsonResult['dAntPreUniIt'] = 0;
        if (item['anticipo'] && +item['anticipo'] > 0) {
            //jsonResult['dAntPreUniIt'] = parseFloat(item['anticipo']).toFixed(config.decimals);  //2026-05-29
            if (data.moneda === 'PYG') {
                //jsonResult['dAntPreUniIt'] = parseFloat(jsonResult['dAntPreUniIt']).toFixed(config.pygDecimals);  //2026-05-29
                jsonResult['dAntPreUniIt'] = parseFloat(item['anticipo']).toFixed(config.pygDecimals);
            }
            else {
                //Otras monedas
                jsonResult['dAntPreUniIt'] = parseFloat(item['anticipo']).toFixed(config.decimals);
            }
        }
        /*
        if (data['anticipoGlobal'] && +data['anticipoGlobal'] > 0) {
          jsonResult['dAntGloPreUniIt'] = parseFloat(data['anticipoGlobal']).toFixed(config.decimals);
        }*/
        jsonResult['dAntGloPreUniIt'] = 0;
        if (data['anticipoGlobal'] && +data['anticipoGlobal'] > 0) {
            let subtotal = item['cantidad'] * item['precioUnitario'];
            let pesoPorc = (100 * subtotal) / totalGeneral;
            let anticipoGlobalAplicado = (data['anticipoGlobal'] * pesoPorc) / 100;
            let anticipoGlobalUnitario = anticipoGlobalAplicado / item['cantidad'];
            /*jsonResult['dAntGloPreUniIt'] = parseFloat(anticipoGlobalUnitario + '').toFixed(8); //Analizar si no es mejor dejar config.decimals
                                                                                                //o si da error, se puede hacer de la misma forma como hacen los otros
            if (data.moneda === 'PYG') {
              jsonResult['dAntGloPreUniIt'] = parseFloat(jsonResult['dAntGloPreUniIt']).toFixed(config.pygDecimals);
            }*/
            if (data.moneda === 'PYG') {
                jsonResult['dAntGloPreUniIt'] = parseFloat(anticipoGlobalUnitario + '').toFixed(config.pygDecimals);
            }
            else {
                jsonResult['dAntGloPreUniIt'] = parseFloat(anticipoGlobalUnitario + '').toFixed(8);
            }
        }
        /* dTotOpeItem (EA008)
                Si D013 = 1, 3, 4 o 5 (afectado al IVA, Renta, ninguno, IVA - Renta),
                    entonces EA008 corresponde al cálculo aritmético:
                        (E721 (Precio unitario) –
                        EA002 (Descuento particular) –
                        EA004 (Descuento global) –
                        EA006 (Anticipo particular) –
                        EA007 (Anticipo global)) * E711(cantidad)
    
                Cálculo para Autofactura (C002=4): E721 * E711
            */
        if (data['tipoImpuesto'] == 1 ||
            data['tipoImpuesto'] == 3 ||
            data['tipoImpuesto'] == 4 ||
            data['tipoImpuesto'] == 5) {
            const precioUnitarioConDescuentoAplicado = parseFloat(item['precioUnitario']) -
                parseFloat(jsonResult['dDescItem'] || 0) -
                parseFloat(jsonResult['dDescGloItem'] || 0) -
                parseFloat(jsonResult['dAntPreUniIt'] || 0) -
                parseFloat(jsonResult['dAntGloPreUniIt'] || 0);
            jsonResult['dTotOpeItem'] = parseFloat(precioUnitarioConDescuentoAplicado + '') * parseFloat(item['cantidad']);
            if (config.sum0_000001SuffixBeforeToFixed == true) {
                jsonResult['dTotOpeItem'] += 0.000001;
            }
            if (jsonResult['dDescGloItem'] == 0) {
                // Cuando no hay descuento Global por item, entonces utiliza los redondeos establecidos en config, para el dTotOpeItem
                //jsonResult['dTotOpeItem'] = parseFloat(jsonResult['dTotOpeItem'].toFixed(config.decimals));
                if (data.moneda === 'PYG') {
                    jsonResult['dTotOpeItem'] = parseFloat(jsonResult['dTotOpeItem'].toFixed(config.pygDecimals));
                }
                else {
                    //Otras monedas
                    jsonResult['dTotOpeItem'] = parseFloat(jsonResult['dTotOpeItem'].toFixed(config.decimals));
                }
            }
            else {
                // Cuando hay descuento Global por item, entonces utiliza el maximo permitido para que el calculo al final salga exacto.
                jsonResult['dTotOpeItem'] = parseFloat(jsonResult['dTotOpeItem'].toFixed(8));
            }
        }
        if (data['tipoDocumento'] == 4) {
            //Si es Autofactura
            jsonResult['dTotOpeItem'] = parseFloat(item['precioUnitario']) * parseFloat(item['cantidad']);
            //jsonResult['dTotOpeItem'] = parseFloat(jsonResult['dTotOpeItem'].toFixed(config.decimals));
            if (data.moneda === 'PYG') {
                jsonResult['dTotOpeItem'] = parseFloat(jsonResult['dTotOpeItem'].toFixed(config.pygDecimals));
            }
            else {
                //Otras monedas
                jsonResult['dTotOpeItem'] = parseFloat(jsonResult['dTotOpeItem'].toFixed(config.decimals));
            }
        }
        if (data['condicionTipoCambio'] == 2) {
            jsonResult['dTotOpeGs'] = jsonResult['dTotOpeItem'] * item['cambio'];
        }
        return jsonResult;
    }
    /**
     * E8.2. Campos que describen el IVA de la operación por ítem (E730-E739)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosItemsOperacionIVA(params, data, item, i, gCamItem, config) {
        let ivaProporcion = item['ivaBase'];
        if (typeof item.ivaProporcion != 'undefined') {
            ivaProporcion = item.ivaProporcion;
        }
        const jsonResult = {
            iAfecIVA: item['ivaTipo'],
            dDesAfecIVA: constants_service_1.default.codigosAfectaciones.filter((ca) => ca.codigo === +item['ivaTipo'])[0]['descripcion'],
            dPropIVA: ivaProporcion,
            dTasaIVA: item['iva'],
        };
        /*  Calculo para E735
            Si E731 = 1 o 4 este campo es igual al resultado del cálculo
                [EA008 * (E733/100)] / 1,1 si la tasa es del 10%
                [EA008 * (E733/100)] / 1,05 si la tasa es del 5%
            Si E731 = 2 o 3 este campo es igual 0
        */
        jsonResult['dBasGravIVA'] = 0; //Valor por defecto
        if (item['ivaTipo'] == 1 || item['ivaTipo'] == 4) {
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Antes de NT13 -- esta opcion esta deprecada, valida solo hasta el 21/05/2023
            if (item['iva'] == 10) {
                jsonResult['dBasGravIVA'] =
                    (gCamItem['gValorItem']['gValorRestaItem']['dTotOpeItem'] * (ivaProporcion / 100)) / 1.1;
            }
            if (item['iva'] == 5) {
                jsonResult['dBasGravIVA'] =
                    (gCamItem['gValorItem']['gValorRestaItem']['dTotOpeItem'] * (ivaProporcion / 100)) / 1.05;
            }
            if (config.test == true) {
                // En ambiente de test desde 21/04/2023 hasta 21/05/2023
                // Aplicando NT13
                //-------------------------------------------------------------
                /**
                * Cambios en NT13
                  Si E731 = 1 o 4 este campo es igual al resultado del cálculo:
                    [100 * EA008 * E733] / [10000 + (E734 * E733)]
        
                  Si E731 = 2 o 3 este campo es igual 0
                */
                if (new Date().getTime() >= new Date('2023-04-21').getTime()) {
                    jsonResult['dBasGravIVA'] =
                        (100 * gCamItem['gValorItem']['gValorRestaItem']['dTotOpeItem'] * ivaProporcion) /
                            (10000 + item['iva'] * ivaProporcion);
                }
            }
            //Vigencia en Test y Produccion
            if (new Date().getTime() >= new Date('2023-06-17').getTime()) {
                //Si la fecha de hoy ya supera el plazo de entrada en vigor ya no importa, utiliza la nueva forma.
                /**
                * Cambios en NT13
                  Si E731 = 1 o 4 este campo es igual al resultado del cálculo:
                    [100 * EA008 * E733] / [10000 + (E734 * E733)]
        
                  Si E731 = 2 o 3 este campo es igual 0
                */
                jsonResult['dBasGravIVA'] =
                    (100 * gCamItem['gValorItem']['gValorRestaItem']['dTotOpeItem'] * ivaProporcion) /
                        (10000 + item['iva'] * ivaProporcion);
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            //Redondeo inicial a 2 decimales
            if (jsonResult['dBasGravIVA']) {
                jsonResult['dBasGravIVA'] = parseFloat(jsonResult['dBasGravIVA'].toFixed(config.partialTaxDecimals)); //Calculo intermedio, usa max decimales de SIFEN.
            }
        }
        /*
          Calculo para E736
          Corresponde al cálculo aritmético:
          E735 * ( E734 / 100 )
          Si E731 = 2 o 3 este campo es igual 0
        */
        jsonResult['dLiqIVAItem'] = 0;
        if (item['ivaTipo'] == 1 || item['ivaTipo'] == 4) {
            jsonResult['dLiqIVAItem'] = (jsonResult['dBasGravIVA'] * item['iva']) / 100;
            //Redondeo
            jsonResult['dLiqIVAItem'] = parseFloat(jsonResult['dLiqIVAItem'].toFixed(config.partialTaxDecimals));
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (config.test == true) {
            //Ambiente de test de SIFEN
            if (new Date().getTime() >= new Date('2023-04-21').getTime()) {
                //Esta parte debe entrar en vigor en produccion a partir de 21/05/2023
                //Calculo para E737, aparecio en la NT13
                jsonResult['dBasExe'] = 0; //Valor por defecto E737
                if (item['ivaTipo'] == 4) {
                    //E731 == 4
                    // Aplicando NT13
                    //-------------------------------------------------------------
                    /**
                      Si E731 = 4 este campo es igual al resultado del cálculo:
                      [100 * EA008 * (100 – E733)] / [10000 + (E734 * E733)]
                      Si E731 = 1 , 2 o 3 este campo es igual 0
                    */
                    jsonResult['dBasExe'] =
                        (100 * gCamItem['gValorItem']['gValorRestaItem']['dTotOpeItem'] * (100 - ivaProporcion)) /
                            (10000 + item['iva'] * ivaProporcion);
                    //Redondeo inicial a 2 decimales
                    if (jsonResult['dBasExe']) {
                        jsonResult['dBasExe'] = parseFloat(jsonResult['dBasExe'].toFixed(config.partialTaxDecimals)); //Calculo intermedio, usa max decimales de SIFEN.
                    }
                }
            }
        }
        //Vigencia en test y produccion
        if (new Date().getTime() >= new Date('2023-06-17').getTime()) {
            //No importando si es test o produccion, luego del plazo de entrada en vigor en produccion ya aplica igualmente.
            jsonResult['dBasExe'] = 0; //Valor por defecto E737
            if (item['ivaTipo'] == 4) {
                //E731 == 4
                // Aplicando NT13
                //-------------------------------------------------------------
                /**
                  Si E731 = 4 este campo es igual al resultado del cálculo:
                  [100 * EA008 * (100 – E733)] / [10000 + (E734 * E733)]
                  Si E731 = 1 , 2 o 3 este campo es igual 0
                */
                jsonResult['dBasExe'] =
                    (100 * gCamItem['gValorItem']['gValorRestaItem']['dTotOpeItem'] * (100 - ivaProporcion)) /
                        (10000 + item['iva'] * ivaProporcion);
                //Redondeo inicial a 2 decimales
                if (jsonResult['dBasExe']) {
                    jsonResult['dBasExe'] = parseFloat(jsonResult['dBasExe'].toFixed(config.partialTaxDecimals)); //Calculo intermedio, usa max decimales de SIFEN.
                }
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        return jsonResult;
    }
    /**
     * E8.4. Grupo de rastreo de la mercadería (E750-E760)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosItemsOperacionRastreoMercaderias(params, data, item, i) {
        const jsonResult = {};
        if (item['lote']) {
            jsonResult['dNumLote'] = item['lote'];
        }
        if (item['vencimiento']) {
            jsonResult['dVencMerc'] = item['vencimiento'];
        }
        if (item['numeroSerie']) {
            jsonResult['dNSerie'] = item['numeroSerie'];
        }
        if (item['numeroPedido']) {
            jsonResult['dNumPedi'] = item['numeroPedido'];
        }
        if (item['numeroSeguimiento']) {
            jsonResult['dNumSegui'] = item['numeroSeguimiento'];
        }
        if (item['importador'] && item['importador']['nombre']) {
            //nt009 se retira estos campo
            //jsonResult['dNomImp'] = item['importador']['nombre'].substring(0, 60);
            //jsonResult['dDirImp'] = item['importador']['direccion'].substring(0, 255);
            //jsonResult['dNumFir'] = item['importador']['registroImportador'].substring(0, 20);
            //nt009 se retira estos campo
        }
        if (item['registroSenave']) {
            jsonResult['dNumReg'] = item['registroSenave'];
        }
        if (item['registroEntidadComercial']) {
            jsonResult['dNumRegEntCom'] = item['registroEntidadComercial'];
        }
        if (item['nombreProducto']) {
            jsonResult['dNomPro'] = item['nombreProducto']; //E761
        }
        return jsonResult;
    }
    /**
     * E8.5. Sector de automotores nuevos y usados (E770-E789)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosItemsOperacionSectorAutomotores(params, data, item, i) {
        if (!item['sectorAutomotor']) {
            //Como no indica que este campo es obligatorio, si no se informa sale con vacio
            return null;
        }
        /*if (
          constanteService.tiposOperacionesVehiculos.filter((um) => um.codigo === item['sectorAutomotor']['tipo']).length ==
          0
        ) {
          throw new Error(
            "Tipo de Operación de Venta de Automotor '" +
              item['sectorAutomotor']['tipo'] +
              "' en data.items[" +
              i +
              '].sectorAutomotor.tipo no encontrado. Valores: ' +
              constanteService.tiposOperacionesVehiculos.map((a) => a.codigo + '-' + a.descripcion),
          );
        }
        if (
          constanteService.tiposCombustibles.filter((um) => um.codigo === item['sectorAutomotor']['tipoCombustible'])
            .length == 0
        ) {
          throw new Error(
            "Tipo de Combustible '" +
              item['sectorAutomotor']['tipoCombustible'] +
              "' en data.items[" +
              i +
              '].sectorAutomotor.tipoCombustible no encontrado. Valores: ' +
              constanteService.tiposCombustibles.map((a) => a.codigo + '-' + a.descripcion),
          );
        }*/
        /*if (item['sectorAutomotor']['chasis']) {
          if (item['sectorAutomotor']['chasis'].length != 17) {
            throw new Error(
              "El Chasis '" + item['sectorAutomotor']['chasis'] + "' en data.items[" + i + '] debe tener 17 caracteres',
            );
          }
        }*/
        /*if (item['sectorAutomotor']['cilindradas']) {
          if ((item['sectorAutomotor']['cilindradas'] + '').length != 4) {
            throw new Error(
              "La Cilindradas '" +
                item['sectorAutomotor']['cilindradas'] +
                "' en data.items[" +
                i +
                '] debe tener 4 caracteres',
            );
          }
        }*/
        const jsonResult = {
            iTipOpVN: item['sectorAutomotor']['tipo'],
            dDesTipOpVN: constants_service_1.default.tiposOperacionesVehiculos.filter((ov) => ov.codigo === item['sectorAutomotor']['tipo'])[0]['descripcion'],
            dChasis: item['sectorAutomotor']['chasis'],
            dColor: item['sectorAutomotor']['color'],
            dPotencia: item['sectorAutomotor']['potencia'],
            dCapMot: item['sectorAutomotor']['capacidadMotor'],
            dPNet: item['sectorAutomotor']['pesoNeto'],
            dPBruto: item['sectorAutomotor']['pesoBruto'],
            iTipCom: item['sectorAutomotor']['tipoCombustible'],
            dDesTipCom: constants_service_1.default.tiposCombustibles.filter((tc) => tc.codigo === item['sectorAutomotor']['tipoCombustible'])[0]['descripcion'],
            dNroMotor: item['sectorAutomotor']['numeroMotor'],
            dCapTracc: item['sectorAutomotor']['capacidadTraccion'],
            dAnoFab: item['sectorAutomotor']['año'],
            cTipVeh: item['sectorAutomotor']['tipoVehiculo'],
            dCapac: item['sectorAutomotor']['capacidadPasajeros'],
        };
        if (item['sectorAutomotor']['cilindradas']) {
            jsonResult['dCilin'] = item['sectorAutomotor']['cilindradas'] + '';
        }
        //Se puede hacer todo por if, para no enviar null
        return jsonResult;
    }
}
exports.default = new JSonDteItemService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkR0ZUl0ZW0uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9qc29uRHRlSXRlbS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOEVBQXFEO0FBQ3JELDRFQUFtRDtBQUduRCxNQUFNLGtCQUFrQjtJQUN0Qjs7Ozs7O09BTUc7SUFDSSwyQkFBMkIsQ0FBQyxNQUFXLEVBQUUsSUFBUyxFQUFFLE1BQW9CO1FBQzdFLE1BQU0sVUFBVSxHQUFRLEVBQUUsQ0FBQztRQUUzQixvREFBb0Q7UUFDcEQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDN0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzdDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFOUIsTUFBTSxRQUFRLEdBQVE7b0JBQ3BCLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO2lCQUN4QixDQUFDO2dCQUVGLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7b0JBQzlCLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDcEQ7Z0JBRUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2YsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDaEM7Z0JBQ0QsRUFBRTtnQkFDRixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRTtvQkFDcEQs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