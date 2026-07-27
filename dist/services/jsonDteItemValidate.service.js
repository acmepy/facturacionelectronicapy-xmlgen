"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StringUtil_service_1 = __importDefault(require("./StringUtil.service"));
const constants_service_1 = __importDefault(require("./constants.service"));
class JSonDteItemValidateService {
    constructor() {
        this.errors = new Array();
    }
    /**
     * E8. Campos que describen los ítems de la operación (E700-E899)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosItemsOperacionValidate(params, data, config, errors) {
        var _a, _b, _c, _d, _e;
        this.errors = errors;
        const regExpOnlyNumber = new RegExp(/^\d+$/);
        const jsonResult = [];
        if (!(data['items'] && data['items'].length > 0)) {
            this.errors.push('Debe especificar los items del documento en data.items');
        }
        //Recorrer array de items e informar en el JSON
        if (data['items'] && data['items'].length > 0) {
            for (let i = 0; i < data['items'].length; i++) {
                const item = data['items'][i];
                let unidadMedida = +item['unidadMedida'];
                //Validaciones
                if (!((item['codigo'] + '').length >= 1 && (item['codigo'] + '').length <= 50)) {
                    this.errors.push('El código del item (' +
                        item['codigo'] +
                        ') en data.items[' +
                        i +
                        '].codigo debe tener una longitud de 1 a 50 caracteres');
                }
                if (!item['ncm']) {
                    //this.errors.push('La descripción del item en data.items[' + i + '].ncm no puede ser null');
                }
                else {
                    if (!(item['ncm'].length >= 6 && item['ncm'].length <= 8)) {
                        this.errors.push('El valor del campo NCM (' +
                            item['ncm'] +
                            ') en data.items[' +
                            i +
                            '].ncm debe tener una longitud de 6 a 8 caracteres');
                    }
                }
                if (constants_service_1.default.unidadesMedidas.filter((um) => um.codigo === +unidadMedida).length == 0) {
                    this.errors.push("Unidad de Medida '" +
                        unidadMedida +
                        "' en data.items[" +
                        i +
                        '].unidadMedida no encontrado. Valores: ' +
                        constants_service_1.default.unidadesMedidas.map((a) => a.codigo + '-' + a.descripcion.trim()));
                }
                if (data['tipoDocumento'] === 7) {
                    if (!item['tolerancia']) {
                        /*this.errors.push(
                          'La Tolerancia es opcional para el Tipo de Documento = 7 en data.items[' + i + '].tolerancia',
                        );*/
                        //No es obligatorio
                    }
                    else {
                        //Si tiene tolerancia, entonces valida
                        if (constants_service_1.default.relevanciasMercaderias.filter((um) => um.codigo === +item['tolerancia']).length == 0) {
                            this.errors.push("Tolerancia de Mercaderia '" +
                                item['tolerancia'] +
                                "' en data.items[" +
                                i +
                                '].tolerancia no encontrado. Valores: ' +
                                constants_service_1.default.relevanciasMercaderias.map((a) => a.codigo + '-' + a.descripcion));
                        }
                        if (!(item['toleranciaCantidad'] && item['toleranciaPorcentaje'])) {
                            this.errors.push('La Tolerancia require especificar la cantidad y porcentaje de quiebra o merma en data.items[' +
                                i +
                                '].toleranciaCantidad y data.items[' +
                                i +
                                '].toleranciaPorcenaje');
                        }
                    }
                }
                let regexp = new RegExp('<[^>]*>'); //HTML/XML TAGS
                if (!item['descripcion']) {
                    this.errors.push('La descripción del item en data.items[' + i + '].descripcion no puede ser null');
                }
                else {
                    if (!((item['descripcion'] + '').length >= 1 && (item['descripcion'] + '').length <= 2000)) {
                        this.errors.push('La descripción del item (' +
                            item['descripcion'] +
                            ') en data.items[' +
                            i +
                            '].descripcion debe tener una longitud de 1 a 2000 caracteres');
                    }
                    if (regexp.test(item['descripcion'])) {
                        this.errors.push('La descripción del item (' +
                            item['descripcion'] +
                            ') en data.items[' +
                            i +
                            '].descripcion contiene valores inválidos');
                    }
                }
                if (((_a = (item['cantidad'] + '').split('.')[1]) === null || _a === void 0 ? void 0 : _a.length) > 8) {
                    this.errors.push('La Cantidad del item "' +
                        item['cantidad'] +
                        '" en data.items[' +
                        i +
                        '].cantidad, no puede contener mas de 8 decimales');
                }
                if (data.moneda == 'PYG') {
                    /*if ((item['precioUnitario'] + '').split('.')[1]?.length > (config.pygDecimals || 0)) {
                      this.errors.push(
                        'El Precio Unitario del item "' +
                          item['precioUnitario'] +
                          '" en "PYG" en data.items[' +
                          i +
                          '].precioUnitario, no puede contener mas de ' +
                          (config.pygDecimals || 0) +
                          ' decimales',
                      );
                    }*/
                    if (((_b = (item['precioUnitario'] + '').split('.')[1]) === null || _b === void 0 ? void 0 : _b.length) > 8) {
                        this.errors.push('El Precio Unitario del item "' +
                            item['precioUnitario'] +
                            '" en "PYG" en data.items[' +
                            i +
                            '].precioUnitario, no puede contener más de 8 decimales');
                    }
                }
                else {
                    if (((_c = (item['precioUnitario'] + '').split('.')[1]) === null || _c === void 0 ? void 0 : _c.length) > 8) {
                        this.errors.push('El Precio Unitario del item "' +
                            item['precioUnitario'] +
                            '" en data.items[' +
                            i +
                            '].precioUnitario, no puede contener más de 8 decimales');
                    }
                }
                if (data.moneda == 'PYG') {
                    /*if ((item['descuento'] + '').split('.')[1]?.length > (config.pygDecimals || 0)) {
                      this.errors.push(
                        'El Descuento del item "' +
                          item['descuento'] +
                          '" en "PYG" en data.items[' +
                          i +
                          '].descuento, no puede contener mas de ' +
                          (config.pygDecimals || 0) +
                          ' decimales',
                      );
                    }*/
                    if (((_d = (item['descuento'] + '').split('.')[1]) === null || _d === void 0 ? void 0 : _d.length) > 8) {
                        this.errors.push('El Descuento del item "' +
                            item['descuento'] +
                            '" en "PYG" en data.items[' +
                            i +
                            '].descuento, no puede contener más de 8 decimales');
                    }
                }
                else {
                    if (((_e = (item['descuento'] + '').split('.')[1]) === null || _e === void 0 ? void 0 : _e.length) > 8) {
                        this.errors.push('El Descuento del item "' +
                            item['descuento'] +
                            '" en data.items[' +
                            i +
                            '].descuento, no puede contener más de 8 decimales');
                    }
                }
                //se comenta por que este tien problemas con los decimales regExpOnlyNumber
                /*if (
                  !(item['cantidad'] != null && (item['cantidad'] + '').length > 0 && regExpOnlyNumber.test(item['cantidad']))
                ) {
                  this.errors.push('Debe especificar la cantidad del item en data.items[' + i + '].cantidad');
                } else {*/
                if (+item['cantidad'] <= 0) {
                    this.errors.push('La cantidad del item en data.items[' + i + '].cantidad debe ser mayor a cero');
                }
                //}
                /*if (
                  !(
                    item['precioUnitario'] != null &&
                    (item['precioUnitario'] + '').length > 0 &&
                    regExpOnlyNumber.test(item['precioUnitario'])
                  )
                ) {
                  this.errors.push('Debe especificar la precio unitario del item en data.items[' + i + '].precioUnitario');
                } else {*/
                if (+item['precioUnitario'] < 0) {
                    this.errors.push('El precio unitario del item en data.items[' + i + '].precioUnitario debe ser mayor o igual a cero');
                }
                //}
                if (item['descuento']) {
                    if (+item['descuento'] < 0) {
                        this.errors.push('El Descuento del item en data.items[' + i + '].descuento debe ser mayor o igual Anticipo cero');
                    }
                }
                if (item['anticipo']) {
                    if (+item['anticipo'] < 0) {
                        this.errors.push('El Anticipo del item en data.items[' + i + '].anticipo debe ser mayor o igual a cero');
                    }
                }
                if (item['cambio']) {
                    if (+item['cambio'] < 0) {
                        this.errors.push('El Cambio del item en data.items[' + i + '].cambio debe ser mayor o igual a cero');
                    }
                }
                if (item['cdcAnticipo']) {
                    if (item['cdcAnticipo'].length != 44) {
                        this.errors.push('El Valor (' +
                            item['cdcAnticipo'] +
                            ') del CDC del Anticipo en data.items[' +
                            i +
                            '].cdcAnticipo debe tener 44 caracteres');
                    }
                }
                if (item['pais']) {
                    if (constants_service_1.default.paises.filter((pais) => pais.codigo === item['pais']).length == 0) {
                        this.errors.push("Pais '" +
                            item['pais'] +
                            "' del Producto en data.items[" +
                            i +
                            '].pais no encontrado.');
                    }
                }
                if (item['observacion'] && (item['observacion'] + '').trim().length > 0) {
                    if (!((item['observacion'] + '').trim().length >= 1 && (item['observacion'] + '').trim().length <= 500)) {
                        this.errors.push('La observación del item (' +
                            item['observacion'] +
                            ') en data.items[' +
                            i +
                            '].observacion debe tener una longitud de 1 a 500 caracteres');
                    }
                    if (regexp.test(item['observacion'])) {
                        this.errors.push('La observación del item (' +
                            item['observacion'] +
                            ') en data.items[' +
                            i +
                            '].observacion contiene valores inválidos');
                    }
                }
                //Tratamiento E719. Tiene relacion con generateDatosGeneralesInherentesOperacion
                if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 4) {
                    if (data['tipoTransaccion'] !== 9) {
                        /*if (data['documentoAsociado'] != null && tiene que ser tipo 9) {
                          if (!item['cdcAnticipo']) {
                            this.errors.push('Debe informar data.items*.cdcAnticipo');
                          }
                        }*/
                    }
                }
                if (data['tipoDocumento'] != 7) {
                    //Oblitatorio informar
                    this.generateDatosItemsOperacionDescuentoAnticipoValorTotalValidate(params, data, item, i);
                }
                if (data['tipoImpuesto'] == 1 ||
                    data['tipoImpuesto'] == 3 ||
                    data['tipoImpuesto'] == 4 ||
                    data['tipoImpuesto'] == 5) {
                    if (data['tipoDocumento'] != 4 && data['tipoDocumento'] != 7) {
                        this.generateDatosItemsOperacionIVAValidate(params, data, item, i);
                    }
                }
                //Rastreo
                if (item['lote'] ||
                    item['vencimiento'] ||
                    item['numeroSerie'] ||
                    item['numeroPedido'] ||
                    item['numeroSeguimiento']) {
                    this.generateDatosItemsOperacionRastreoMercaderiasValidate(params, data, item, i);
                }
                //Automotores
                if (item['sectorAutomotor'] && item['sectorAutomotor']['tipo']) {
                    this.generateDatosItemsOperacionSectorAutomotoresValidate(params, data, item, i);
                }
                if (data['cliente']['tipoOperacion'] && data['cliente']['tipoOperacion'] === 3) {
                    if (!item['dncp']) {
                        this.errors.push('Debe especificar los datos de la DNCP en ' +
                            'data.items[' +
                            i +
                            '].dncp para el tipo de operación 3-B2G');
                    }
                    else {
                        if (!(item['dncp']['codigoNivelGeneral'] &&
                            (item['dncp']['codigoNivelGeneral'] + '').length > 0 &&
                            (item['dncp']['codigoNivelGeneral'] + '').length <= 8)) {
                            this.errors.push('Debe especificar los datos de la DNCP en ' +
                                'data.items[' +
                                i +
                                '].dncp.codigoNivelGeneral (hasta 8 digitos) para el tipo de operación 3-B2G');
                        }
                        else {
                            item['dncp']['codigoNivelGeneral'] = StringUtil_service_1.default.leftZero(item['dncp']['codigoNivelGeneral'], 8);
                        }
                        if (!(item['dncp']['codigoNivelEspecifico'] &&
                            (item['dncp']['codigoNivelEspecifico'] + '').length >= 3 &&
                            (item['dncp']['codigoNivelEspecifico'] + '').length <= 4)) {
                            this.errors.push('Debe especificar los datos de la DNCP en ' +
                                'data.items[' +
                                i +
                                '].dncp.codigoNivelEspecifico (3 o 4 digitos) para el tipo de operación 3-B2G');
                        }
                        else {
                            //item['dncp']['codigoNivelEspecifico'] = stringUtilService.leftZero( item['dncp']['codigoNivelEspecifico'], 8);
                        }
                    }
                }
            } //end-for
        }
        return this.errors;
    }
    /**
     * E8.1.1 Campos que describen los descuentos, anticipos y valor total por ítem (EA001-EA050)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosItemsOperacionDescuentoAnticipoValorTotalValidate(params, data, item, i) {
        const jsonResult = {};
        if (item['descuento'] && +item['descuento'] > 0) {
            //Validar que si el descuento es mayor al precio
            if (+item['descuento'] > +item['precioUnitario']) {
                this.errors.push("Descuento '" +
                    item['descuento'] +
                    "' del Producto en data.items[" +
                    i +
                    "].descuento supera al Precio Unitario '" +
                    item['precioUnitario']);
            }
            /*
            if (+item['descuento'] == +item['precioUnitario']) {
              //Validar IVA
              //Quiere decir que no va a ir nada en exenta, gravada5 y gravada10, para este item.
              if (item['ivaTipo'] != 3) {
                this.errors.push(
                  'Descuento igual a Precio Unitario corresponde tener Tipo de Iva = 3-Exento en data.items[' +
                    i +
                    '].ivaTipo',
                );
              }
            }*/
        }
    }
    /**
     * E8.2. Campos que describen el IVA de la operación por ítem (E730-E739)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosItemsOperacionIVAValidate(params, data, item, i) {
        if (constants_service_1.default.codigosAfectaciones.filter((um) => um.codigo === +item['ivaTipo']).length == 0) {
            this.errors.push("Tipo de IVA '" +
                item['ivaTipo'] +
                "' en data.items[" +
                i +
                '].ivaTipo no encontrado. Valores: ' +
                constants_service_1.default.codigosAfectaciones.map((a) => a.codigo + '-' + a.descripcion));
        }
        let ivaProporcion = item['ivaBase'];
        if (typeof item.ivaProporcion != 'undefined') {
            ivaProporcion = item.ivaProporcion;
        }
        if (item['ivaTipo'] == 1) {
            if (ivaProporcion != 100) {
                this.errors.push('Valor de "ivaProporcion"=' +
                    ivaProporcion +
                    ' debe ser igual a 100 para "ivaTipo" = 1 en data.items[' +
                    i +
                    '].ivaProporcion');
            }
        }
        if (item['ivaTipo'] == 2 || item['ivaTipo'] == 3) {
            //Exento
            if (ivaProporcion != 0) {
                this.errors.push('Valor de "ivaProporcion"=' +
                    ivaProporcion +
                    ' debe ser igual a 0 para "ivaTipo" = ' +
                    item['ivaTipo'] +
                    ' en data.items[' +
                    i +
                    '].ivaProporcion');
            }
            if (item['iva'] != 0) {
                this.errors.push('Valor de "iva"=' +
                    item['iva'] +
                    ' debe ser igual a 0 para "ivaTipo" = ' +
                    item['ivaTipo'] +
                    ' en data.items[' +
                    i +
                    '].iva');
            }
        }
        if (item['iva'] == 0) {
            if (item['ivaTipo'] != 2 && item['ivaTipo'] != 3) {
                this.errors.push('"Iva" = 0 no se admite para "ivaTipo"=' + item['ivaTipo'] + ' proporcionado en data.items[' + i + '].iva');
            }
        }
        if (item['iva'] == 5) {
            if (item['ivaTipo'] != 1 && item['ivaTipo'] != 4) {
                this.errors.push('"Iva" = 5 no se admite para "ivaTipo"=' + item['ivaTipo'] + ' proporcionado en data.items[' + i + '].iva');
            }
        }
        if (item['iva'] == 10) {
            if (item['ivaTipo'] != 1 && item['ivaTipo'] != 4) {
                this.errors.push('"Iva" = 10 no se admite para "ivaTipo"=' + item['ivaTipo'] + ' proporcionado en data.items[' + i + '].iva');
            }
        }
        if (!(item['iva'] == 0 || item['iva'] == 5 || item['iva'] == 10)) {
            this.errors.push('Valor invalido "iva"=' + item['iva'] + ' proporcionado en data.items[' + i + '].iva');
        }
        if (!(ivaProporcion >= 0 && ivaProporcion <= 100)) {
            this.errors.push('Valor invalido "ivaProporcion"=' + item['iva'] + ' proporcionado en data.items[' + i + '].ivaProporcion');
        }
    }
    /**
     * E8.4. Grupo de rastreo de la mercadería (E750-E760)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosItemsOperacionRastreoMercaderiasValidate(params, data, item, i) {
        let regexpXMLHTML = new RegExp('<[^>]*>'); //HTML/XML TAGS
        if (item['registroEntidadComercial'] && (item['registroEntidadComercial'] + '').trim().length > 0) {
            if (!((item['registroEntidadComercial'] + '').trim().length >= 1 &&
                (item['registroEntidadComercial'] + '').trim().length <= 20)) {
                this.errors.push('El Número de Registro de la Entidad Comercial del item (' +
                    item['registroEntidadComercial'] +
                    ') en data.items[' +
                    i +
                    '].registroEntidadComercial debe tener una longitud entre 1 y 20 caracteres');
            }
            if (regexpXMLHTML.test(item['registroEntidadComercial'])) {
                this.errors.push('El Número de Registro de la Entidad Comercial del item (' +
                    item['registroEntidadComercial'] +
                    ') en data.items[' +
                    i +
                    '].registroEntidadComercial contiene valores inválidos');
            }
        }
    }
    /**
     * E8.5. Sector de automotores nuevos y usados (E770-E789)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosItemsOperacionSectorAutomotoresValidate(params, data, item, i) {
        if (!item['sectorAutomotor']) {
            //Como no indica que este campo es obligatorio, si no se informa sale con vacio
            return null;
        }
        if (constants_service_1.default.tiposOperacionesVehiculos.filter((um) => um.codigo === item['sectorAutomotor']['tipo']).length ==
            0) {
            this.errors.push("Tipo de Operación de Venta de Automotor '" +
                item['sectorAutomotor']['tipo'] +
                "' en data.items[" +
                i +
                '].sectorAutomotor.tipo no encontrado. Valores: ' +
                constants_service_1.default.tiposOperacionesVehiculos.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (constants_service_1.default.tiposCombustibles.filter((um) => um.codigo === item['sectorAutomotor']['tipoCombustible'])
            .length == 0) {
            this.errors.push("Tipo de Combustible '" +
                item['sectorAutomotor']['tipoCombustible'] +
                "' en data.items[" +
                i +
                '].sectorAutomotor.tipoCombustible no encontrado. Valores: ' +
                constants_service_1.default.tiposCombustibles.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (item['sectorAutomotor']['chasis']) {
            if (item['sectorAutomotor']['chasis'].length != 17) {
                this.errors.push("El Chassis '" + item['sectorAutomotor']['chasis'] + "' en data.items[" + i + '] debe tener 17 caracteres');
            }
        }
        if (item['sectorAutomotor']['cilindradas']) {
            if ((item['sectorAutomotor']['cilindradas'] + '').length != 4) {
                this.errors.push("La Cilindradas '" +
                    item['sectorAutomotor']['cilindradas'] +
                    "' en data.items[" +
                    i +
                    '] debe tener 4 caracteres');
            }
        }
    }
}
exports.default = new JSonDteItemValidateService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkR0ZUl0ZW1WYWxpZGF0ZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2pzb25EdGVJdGVtVmFsaWRhdGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhFQUFxRDtBQUNyRCw0RUFBbUQ7QUFHbkQsTUFBTSwwQkFBMEI7SUFHOUI7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLG1DQUFtQyxDQUFDLE1BQVcsRUFBRSxJQUFTLEVBQUUsTUFBb0IsRUFBRSxNQUFxQjs7UUFDNUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU3QyxNQUFNLFVBQVUsR0FBUSxFQUFFLENBQUM7UUFFM0IsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0RBQXdELENBQUMsQ0FBQztTQUM1RTtRQUVELCtDQUErQztRQUMvQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM3QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU5QixJQUFJLFlBQVksR0FBVyxDQUFDLElBQUksQ0FBQyxj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