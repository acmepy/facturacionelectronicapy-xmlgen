"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSonDteTotalesService {
    /**
     * F. Campos que describen los subtotales y totales de la transacción documentada (F001-F099)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosTotales(params, data, items, config) {
        let moneda = data['moneda'];
        if (!moneda && config.defaultValues === true) {
            moneda = 'PYG';
        }
        let dSubExe = 0, dSubExo = 0, dSub5 = 0, dSub10 = 0, dTotOpeSinDescuento = 0, dTotOpe = 0, dTotDesc = 0, dTotDescGlotem = 0, dTotAntItem = 0, dTotAnt = 0, dDescTotal = 0, dAnticipo = 0, dTotOpeGs = 0, dIVA5 = 0, dIVA10 = 0, dLiqTotIVA5 = 0, dLiqTotIVA10 = 0, dBaseGrav5 = 0, dBaseGrav10 = 0;
        let agregarDSub = false;
        //Crear las variables
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item['gCamIVA']) {
                //gCamIVA puede ser null (MT150=No informar si D013=2 y C002= 4 o 7)
                //Subtotal (exenta o iva parcial)
                if (item['gCamIVA']['iAfecIVA'] == 3 || item['gCamIVA']['iAfecIVA'] == 4) {
                    //E731==3
                    let sumaExenta = 0;
                    if (item['gCamIVA']['iAfecIVA'] == 3) {
                        sumaExenta += item['gValorItem']['gValorRestaItem']['dTotOpeItem']; //Suma de EA008
                    }
                    if (item['gCamIVA']['iAfecIVA'] == 4) {
                        sumaExenta += item['gCamIVA']['dBasExe']; //Suma de E737
                    }
                    dSubExe += sumaExenta; //Suma de EA008
                }
                //Exenta
                if (item['gCamIVA']['iAfecIVA'] == 2) {
                    //E731==2
                    dSubExo += item['gValorItem']['gValorRestaItem']['dTotOpeItem']; //Suma de EA008
                }
                //Gravadas 5 o 10
                if (item['gCamIVA']['iAfecIVA'] == 1 || item['gCamIVA']['iAfecIVA'] == 4) {
                    //if (!(data['tipoImpuesto'] != 1)) {
                    if (data['tipoImpuesto'] == 1 || data['tipoImpuesto'] == 5) {
                        //Esta condicion se repite en linea 219
                        //No debe existir si D013 != 1
                        if (item['gCamIVA']['dTasaIVA'] == 5) {
                            //E734
                            let sumaGrav5 = 0;
                            if (item['gCamIVA']['iAfecIVA'] == 1) {
                                sumaGrav5 += item['gValorItem']['gValorRestaItem']['dTotOpeItem']; //EA008
                            }
                            if (item['gCamIVA']['iAfecIVA'] == 4) {
                                sumaGrav5 += item['gCamIVA']['dBasGravIVA'] + item['gCamIVA']['dLiqIVAItem']; //E735 + E736. NT 13
                            }
                            dSub5 += sumaGrav5;
                        }
                        if (item['gCamIVA']['dTasaIVA'] == 10) {
                            let sumaGrav10 = 0;
                            if (item['gCamIVA']['iAfecIVA'] == 1) {
                                sumaGrav10 += item['gValorItem']['gValorRestaItem']['dTotOpeItem']; //EA008
                            }
                            if (item['gCamIVA']['iAfecIVA'] == 4) {
                                sumaGrav10 += item['gCamIVA']['dBasGravIVA'] + item['gCamIVA']['dLiqIVAItem']; //E735 + E736. NT 13
                            }
                            dSub10 += sumaGrav10;
                            //dSub10 += item['gValorItem']['gValorRestaItem']['dTotOpeItem'];
                        }
                        agregarDSub = true;
                    }
                }
                //---
                if (!(data['tipoImpuesto'] != 1 && data['tipoImpuesto'] != 5)) {
                    //No debe existir si D013 != 1 o D013 != 5
                    if (item['gCamIVA']['dTasaIVA'] == 5) {
                        //E734
                        dIVA5 += item['gCamIVA']['dLiqIVAItem'];
                        //dLiqTotIVA5 = 0;    //se hace mas adelante, despues de obtener el redondeo
                        dBaseGrav5 += item['gCamIVA']['dBasGravIVA'];
                    }
                    if (item['gCamIVA']['dTasaIVA'] == 10) {
                        dIVA10 += item['gCamIVA']['dLiqIVAItem'];
                        //dLiqTotIVA10 = 0;   //se hace mas adelante, despues de obtener el redondeo
                        dBaseGrav10 += item['gCamIVA']['dBasGravIVA'];
                    }
                }
            }
            //---
            if (data['tipoDocumento'] == 4) {
                dTotOpe += item['gValorItem']['gValorRestaItem']['dTotOpeItem'];
            }
            //Ahora mismo dTotOpeSinDescuento solo es el precio por la cantidad y se usa para calcular mas adelante
            //dPorcDescTotal (OJO: Si dPorcDescTotal solo debe estar relacionado al total, entonces al dPUniProSer
            //hay que restarle el dDescItem antes de multiplicar por la cantidad)
            dTotOpeSinDescuento += item['gValorItem']['dPUniProSer'] * item['dCantProSer'];
            dTotDesc += (item['gValorItem']['gValorRestaItem']['dDescItem'] || 0) * item['dCantProSer'];
            //Este calculo no sale exactamente igual por la diferencia de decimales, entonces usa directo en enviado por el usuario.
            //Ya no suma el descuento global calculado
            //dTotDescGlotem += (item.gValorItem?.gValorRestaItem?.dDescGloItem || 0) * item['dCantProSer'];
            dTotAntItem += (item['gValorItem']['gValorRestaItem']['dAntPreUniIt'] || 0) * item['dCantProSer'];
            dTotAnt += (item['gValorItem']['gValorRestaItem']['dAntGloPreUniIt'] || 0) * item['dCantProSer'];
            //Ya no suma el descuento global calculado
            //dDescTotal = dTotDesc + dTotDescGlotem;
            dAnticipo = dTotAntItem + dTotAnt;
            dTotOpeGs += item['gValorItem']['gValorRestaItem']['dTotOpeGs']; //Suma del monto total en Gs.
        } //end-for
        //Finalmente sobreescribe de vuelta con el que paso el usuario.
        dTotDescGlotem = +data.descuentoGlobal || 0;
        dDescTotal = dTotDesc + dTotDescGlotem;
        if (data['tipoImpuesto'] == 1 ||
            data['tipoImpuesto'] == 3 ||
            data['tipoImpuesto'] == 4 ||
            data['tipoImpuesto'] == 5) {
            if (data['tipoDocumento'] != 4) {
                dTotOpe = dSubExe + dSubExo + dSub5 + dSub10; // Suma (F002, F003, F004 y F005)
            }
        }
        if (data.moneda != 'PYG') {
            dTotOpe = parseFloat(dTotOpe.toFixed(config.decimals));
        }
        let dRedon = 0;
        if (config.redondeoSedeco) {
            if (data.moneda === 'PYG') {
                dRedon = this.redondeoSedeco(dTotOpe);
            }
            else {
                //Observación: Para monedas extranjeras o cualquier otro cálculo que contenga decimales, las reglas de validación
                //aceptarán redondeos de 50 céntimos (por encima o por debajo)
                if (dTotOpe % 1 != 0) {
                    //Es moneda extranjera, en decimal
                    //console.log('Moneda extranjera decimal ' + dTotOpe);
                }
            }
        }
        if (!(data['tipoImpuesto'] != 1 && data['tipoImpuesto'] != 5)) {
            //No debe existir si D013 != 1 o D013 != 5
            if (dIVA5 > 0) {
                /*dLiqTotIVA5 = dRedon / 1.05; //Consultar
                dLiqTotIVA5 = Math.round(dLiqTotIVA5);*/
                dLiqTotIVA5 = dRedon / 1.05; //Consultar
                dLiqTotIVA5 = Math.round(dLiqTotIVA5);
                dLiqTotIVA5 = 0;
            }
            if (dIVA10 > 0) {
                /*dLiqTotIVA10 = dRedon / 1.1;
                dLiqTotIVA10 = Math.round(dLiqTotIVA10);*/
                dLiqTotIVA10 = dRedon / 1.1;
                dLiqTotIVA10 = Math.round(dLiqTotIVA10);
                dLiqTotIVA10 = 0;
            }
        }
        let comisionLiquid = ((data['comision'] || 0) * 10) / 100;
        //---
        //Corresponde al cálculo aritmético F008 - F013 + F025
        let dTotGralOpe = dTotOpe - dRedon + (data['comision'] || 0);
        if (data.moneda != 'PYG') {
            dTotGralOpe = parseFloat(dTotGralOpe.toFixed(config.decimals));
        }
        else {
            dTotGralOpe = parseFloat(dTotGralOpe.toFixed(config.pygDecimals));
        }
        //dTotOpe + dRedon + dComi;
        //Si C002 = 1, 5 o 6, entonces dTotGralOpe(F014) = F008 - F011 - F012 - F013
        /*if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 5 || data['tipoDocumento'] == 6) {
          dTotGralOpe = dTotOpe - dDescTotal - dAnticipo - dRedon;
        }*/
        //---
        //Asignar al JSON DATA
        if (data.moneda != 'PYG') {
            dSubExe = parseFloat(dSubExe.toFixed(config.taxDecimals));
            dSubExo = parseFloat(dSubExo.toFixed(config.taxDecimals));
        }
        else {
            dSubExe = parseFloat(dSubExe.toFixed(config.pygTaxDecimals));
            dSubExo = parseFloat(dSubExo.toFixed(config.pygTaxDecimals));
        }
        let jsonResult = {
            dSubExe: dSubExe,
            dSubExo: dSubExo,
        };
        if (agregarDSub) {
            //if (!(data['tipoImpuesto'] != 1)) {
            if (data['tipoImpuesto'] == 1 || data['tipoImpuesto'] == 5) {
                //Esta condicion se repite en linea 64
                //No debe existir si D013 != 1        if (dSub5 > 0) {
                if (dSub5 > 0) {
                    jsonResult['dSub5'] = dSub5;
                    if (data.moneda !== 'PYG') {
                        jsonResult['dSub5'] = parseFloat(dSub5.toFixed(config.taxDecimals));
                    }
                    else {
                        jsonResult['dSub5'] = parseFloat(dSub5.toFixed(config.pygTaxDecimals));
                    }
                }
                else {
                    jsonResult['dSub5'] = 0;
                }
                if (dSub10 > 0) {
                    jsonResult['dSub10'] = dSub10;
                    if (data.moneda !== 'PYG') {
                        //Redondea el tax, independiente a la moneda
                        jsonResult['dSub10'] = parseFloat(dSub10.toFixed(config.taxDecimals));
                    }
                    else {
                        jsonResult['dSub10'] = parseFloat(dSub10.toFixed(config.pygTaxDecimals));
                    }
                }
                else {
                    jsonResult['dSub10'] = 0;
                }
            }
        }
        if (data.moneda != 'PYG') {
            dTotOpe = parseFloat(dTotOpe.toFixed(config.decimals));
        }
        else {
            dTotOpe = parseFloat(dTotOpe.toFixed(config.pygDecimals));
        }
        if (data.moneda != 'PYG') {
            dTotDesc = parseFloat(dTotDesc.toFixed(config.decimals));
        }
        else {
            dTotDesc = parseFloat(dTotDesc.toFixed(config.pygDecimals));
        }
        if (data.moneda != 'PYG') {
            dTotDescGlotem = parseFloat(dTotDescGlotem.toFixed(config.decimals));
        }
        else {
            dTotDescGlotem = parseFloat(dTotDescGlotem.toFixed(config.pygDecimals));
        }
        if (data.moneda != 'PYG') {
            dDescTotal = parseFloat(dDescTotal.toFixed(config.decimals));
        }
        else {
            dDescTotal = parseFloat(dDescTotal.toFixed(config.pygDecimals));
        }
        if (data.moneda != 'PYG') {
            dTotOpe = parseFloat(dTotOpe.toFixed(config.decimals)); //Este esta repetido en la linea 218, verificar
        }
        else {
            dTotOpe = parseFloat(dTotOpe.toFixed(config.pygDecimals));
        }
        //---
        if (data.moneda != 'PYG') {
            dTotAntItem = parseFloat(dTotAntItem.toFixed(config.decimals));
        }
        else {
            dTotAntItem = parseFloat(dTotAntItem.toFixed(config.pygDecimals));
        }
        if (data.moneda != 'PYG') {
            dTotAnt = parseFloat(dTotAnt.toFixed(config.decimals));
        }
        else {
            dTotAnt = parseFloat(dTotAnt.toFixed(config.pygDecimals));
        }
        if (data.moneda != 'PYG') {
            dAnticipo = parseFloat(dAnticipo.toFixed(config.decimals));
        }
        else {
            dAnticipo = parseFloat(dAnticipo.toFixed(config.pygDecimals));
        }
        jsonResult = Object.assign(jsonResult, {
            dTotOpe: dTotOpe,
            dTotDesc: dTotDesc,
            dTotDescGlotem: dTotDescGlotem,
            dTotAntItem: dTotAntItem,
            dTotAnt: dTotAnt,
            dPorcDescTotal: 0,
            dDescTotal: dDescTotal,
            dAnticipo: dAnticipo,
            dRedon: dRedon,
        });
        if (data['comision'] > 0) {
            jsonResult['dComi'] = data['comision'];
        }
        jsonResult = Object.assign(jsonResult, {
            dTotGralOpe: dTotGralOpe,
        });
        //Redondeo
        //No se por que se puso este pero genera error en los redondeos al calcular, HB
        //Deshabilitado 05 05 23
        //Redondeo
        if (data.moneda !== 'PYG') {
            dIVA5 = parseFloat(dIVA5.toFixed(config.taxDecimals));
            dIVA10 = parseFloat(dIVA10.toFixed(config.taxDecimals));
            dLiqTotIVA5 = parseFloat(dLiqTotIVA5.toFixed(config.taxDecimals));
            dLiqTotIVA10 = parseFloat(dLiqTotIVA10.toFixed(config.taxDecimals));
        }
        else {
            //Si la moneda es PYG, no asignar decimales en los impuestos previos de iva.
            dIVA5 = parseFloat(dIVA5.toFixed(config.pygTaxDecimals));
            dIVA10 = parseFloat(dIVA10.toFixed(config.pygTaxDecimals));
            dLiqTotIVA5 = parseFloat(dLiqTotIVA5.toFixed(config.pygTaxDecimals));
            dLiqTotIVA10 = parseFloat(dLiqTotIVA10.toFixed(config.pygTaxDecimals));
        }
        if (agregarDSub) {
            if (data.tipoImpuesto == 1 || data.tipoImpuesto == 5) {
                //D013
                jsonResult['dIVA5'] = dIVA5;
                jsonResult['dIVA10'] = dIVA10;
                jsonResult['dLiqTotIVA5'] = dLiqTotIVA5;
                jsonResult['dLiqTotIVA10'] = dLiqTotIVA10;
            }
        }
        if (comisionLiquid > 0) {
            jsonResult = Object.assign(jsonResult, {
                dIVAComi: comisionLiquid,
            });
        }
        if (agregarDSub) {
            if (data.tipoImpuesto == 1 || data.tipoImpuesto == 5) {
                //D013
                //dTotIva: No debe existir el campo si D013 ≠ 1 o D013≠5
                if (dIVA5 > 0 || dIVA10 > 0 || dLiqTotIVA5 > 0 || dLiqTotIVA10 > 0 || comisionLiquid > 0) {
                    jsonResult['dTotIVA'] = dIVA5 + dIVA10 - dLiqTotIVA5 - dLiqTotIVA10 + comisionLiquid;
                    //Redondeo
                    if (data.moneda !== 'PYG') {
                        jsonResult['dTotIVA'] = parseFloat(jsonResult['dTotIVA'].toFixed(config.taxDecimals));
                    }
                    else {
                        jsonResult['dTotIVA'] = parseFloat(jsonResult['dTotIVA'].toFixed(config.pygTaxDecimals));
                    }
                }
                else {
                    jsonResult['dTotIVA'] = 0;
                }
                if (dBaseGrav5 > 0) {
                    //Redondeo
                    if (data.moneda !== 'PYG') {
                        dBaseGrav5 = parseFloat(dBaseGrav5.toFixed(config.taxDecimals));
                    }
                    else {
                        dBaseGrav5 = parseFloat(dBaseGrav5.toFixed(config.pygTaxDecimals));
                    }
                    jsonResult['dBaseGrav5'] = dBaseGrav5;
                }
                else {
                    jsonResult['dBaseGrav5'] = 0;
                }
                if (dBaseGrav10 > 0) {
                    //Redondeo
                    if (data.moneda !== 'PYG') {
                        dBaseGrav10 = parseFloat(dBaseGrav10.toFixed(config.taxDecimals));
                    }
                    else {
                        dBaseGrav10 = parseFloat(dBaseGrav10.toFixed(config.pygTaxDecimals));
                    }
                    jsonResult['dBaseGrav10'] = dBaseGrav10;
                }
                else {
                    jsonResult['dBaseGrav10'] = 0;
                }
                if (dBaseGrav5 > 0 || dBaseGrav10 > 0) {
                    let toFixed = config.taxDecimals;
                    if (moneda == 'PYG') {
                        toFixed = config.pygTaxDecimals;
                    }
                    jsonResult['dTBasGraIVA'] = parseFloat(((dBaseGrav5 > 0 ? dBaseGrav5 : 0) + (dBaseGrav10 > 0 ? dBaseGrav10 : 0)).toFixed(toFixed));
                }
                else {
                    jsonResult['dTBasGraIVA'] = 0;
                }
            }
        }
        if (moneda != 'PYG') {
            //Si es en otra moneda que no sea PYG
            //Utiliza el Decimales en Guaranies pygDecimals
            if (data['condicionTipoCambio'] == 1) {
                //Por el Global
                jsonResult['dTotalGs'] = parseFloat((dTotGralOpe * data['cambio']).toFixed(config.pygDecimals));
            }
            else {
                //TODO Este hay que ver la forma de que el totalGS sea por la multiplicacion con el cambio de cada item, al final
                // o ver como seria, hacer pruebas
                jsonResult['dTotalGs'] = parseFloat((dTotGralOpe * data['cambio']).toFixed(config.pygDecimals));
            }
        }
        else {
            //No informar si D015 = PYG
        }
        //Calculo del % de descuento Global
        if (jsonResult['dTotDescGlotem'] > 0) {
            jsonResult['dPorcDescTotal'] = ((dTotDescGlotem * 100) / dTotOpeSinDescuento).toFixed(8); //Maximo permitido
        }
        return jsonResult;
    }
    /**
     * En consideración a la Resolución 347 del 2014 (Secretaría de Defensa del Consumidor-
     * SEDECO). Las reglas de redondeo aplican a múltiplos de 50 guaraníes
     *
     * Obtiene solo la parte del valor de redondeo, para obtener el monto del reondeo hay
     * que restar el valor de éste calculo
     *
     * @param numero
     * @returns
     */
    redondeoSedeco(numero) {
        let parteDecimal = parseFloat((numero / 100).toFixed(2));
        let parteEntera = (numero / 100.0) | 0;
        let resta = parseFloat((parteDecimal - parteEntera).toFixed(2));
        let aComparar = parseFloat((resta * 100).toFixed(2));
        if (aComparar == 50) {
            return 0;
        }
        else if (aComparar > 50) {
            var diferencia = aComparar - 50;
            return diferencia;
        }
        else {
            //Redondear a 000
            var diferencia = 50 - (50 - aComparar);
            return diferencia;
        }
    }
}
exports.default = new JSonDteTotalesService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkR0ZVRvdGFsZXMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9qc29uRHRlVG90YWxlcy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxxQkFBcUI7SUFDekI7Ozs7OztPQU1HO0lBQ0ksb0JBQW9CLENBQUMsTUFBVyxFQUFFLElBQVMsRUFBRSxLQUFZLEVBQUUsTUFBb0I7UUFDcEYsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLGFBQWEsS0FBSyxJQUFJLEVBQUU7WUFDNUMsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUNoQjtRQUVELElBQUksT0FBTyxHQUFHLENBQUMsRUFDYixPQUFPLEdBQUcsQ0FBQyxFQUNYLEtBQUssR0FBRyxDQUFDLEVBQ1QsTUFBTSxHQUFHLENBQUMsRUFDVixtQkFBbUIsR0FBRyxDQUFDLEVBQ3ZCLE9BQU8sR0FBRyxDQUFDLEVBQ1gsUUFBUSxHQUFHLENBQUMsRUFDWixjQUFjLEdBQUcsQ0FBQyxFQUNsQixXQUFXLEdBQUcsQ0FBQyxFQUNmLE9BQU8sR0FBRyxDQUFDLEVBQ1gsVUFBVSxHQUFHLENBQUMsRUFDZCxTQUFTLEdBQUcsQ0FBQyxFQUNiLFNBQVMsR0FBRyxDQUFDLEVBQ2IsS0FBSyxHQUFHLENBQUMsRUFDVCxNQUFNLEdBQUcsQ0FBQyxFQUNWLFdBQVcsR0FBRyxDQUFDLEVBQ2YsWUFBWSxHQUFHLENBQUMsRUFDaEIsVUFBVSxHQUFHLENBQUMsRUFDZCxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN4QixxQkFBcUI7UUFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsTUFBTSxJ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