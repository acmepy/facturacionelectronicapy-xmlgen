"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StringUtil_service_1 = __importDefault(require("./StringUtil.service"));
const FechaUtil_service_1 = __importDefault(require("./FechaUtil.service"));
const constants_service_1 = __importDefault(require("./constants.service"));
const jsonDteItemValidate_service_1 = __importDefault(require("./jsonDteItemValidate.service"));
class JSonDeMainValidateService {
    constructor() {
        this.errors = new Array();
    }
    /**
     * Valida los datos ingresados en el data
     * A. Campos firmados del Documento Electrónico (A001-A099)
     *   1 - Validacion automática
     *   2 - Se realiza en el SIFEN, pero puede ser realizado en la API de integración
     *   3 - Se realiza en el SIFEN, pero puede ser realizado en la API de integración
     *   4 - Validacion automática
     *   5 - Se realiza en el SIFEN, la fecha/hora del servidor debe sincronizarse con el SIFEN
     *   6 - Falta, pero es AO
     *
     * B. Campos inherentes a la operación comercial de los Documentos Electrónicos (B001 -B099)
     *   7 - Falta
     *   8 - Validacion automática, via constante.service
     *
     * C. Campos de datos del Timbrado (C001 - C099)
     *   9 - Validacion automática, via constante.service
     *  10 - Se realiza en el SIFEN, se valida solo la primera vez
     *  11 - Se realiza en el SIFEN, se valida solo la primera vez
     *  12 - Se realiza en el SIFEN, se valida solo la primera vez
     *  13 - Se realiza en el SIFEN, se valida solo la primera vez
     *  14 - Se realiza en el SIFEN, se valida solo la primera vez
     *  15 - Se realiza en el SIFEN, se valida solo la primera vez
     *  16 - Se realiza en el SIFEN, pero puede ser realizado en la API de integración
     *
     * @param data
     */
    validateValues(params, data, config) {
        this.errors = new Array();
        if (constants_service_1.default.tiposDocumentos.filter((um) => um.codigo === +data['tipoDocumento']).length == 0) {
            this.errors.push("Tipo de Documento '" +
                data['tipoDocumento'] +
                "' en data.tipoDocumento no válido. Valores: " +
                constants_service_1.default.tiposDocumentos.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (typeof data['cliente'] == 'undefined') {
            this.errors.push('Debe especificar los datos del Cliente en data.cliente');
        }
        if (data['cliente']) {
            if (typeof data['cliente']['contribuyente'] == 'undefined') {
                this.errors.push('Debe indicar si el Cliente es o no un Contribuyente true|false en data.cliente.contribuyente');
            }
            if (typeof data['cliente']['contribuyente'] == 'undefined') {
                this.errors.push('Debe indicar si el Cliente es o no un Contribuyente true|false en data.cliente.contribuyente');
            }
            if (!(data['cliente']['contribuyente'] === true || data['cliente']['contribuyente'] === false)) {
                this.errors.push('data.cliente.contribuyente debe ser true|false');
            }
        }
        this.generateCodigoControlValidate(params, data);
        this.datosEmisorValidate(params, data);
        this.generateDatosOperacionValidate(params, data);
        this.generateDatosGeneralesValidate(params, data, config);
        this.generateDatosEspecificosPorTipoDEValidate(params, data);
        if (data['tipoDocumento'] == 4) {
            this.generateDatosAutofacturaValidate(params, data);
        }
        if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 4) {
            this.generateDatosCondicionOperacionDEValidate(params, data);
        }
        this.errors = jsonDteItemValidate_service_1.default.generateDatosItemsOperacionValidate(params, data, config, this.errors);
        this.generateDatosComplementariosComercialesDeUsoEspecificosValidate(params, data);
        if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 7) {
            //1 Opcional, 7 Obligatorio
            if (data['tipoDocumento'] == 7) {
                if (!data['detalleTransporte']) {
                    this.errors.push('Debe especificar el detalle de transporte en data.transporte para el Tipo de Documento = 7');
                }
                else {
                    this.generateDatosTransporteValidate(params, data);
                }
            }
            else {
                //Es por que tipoDocumento = 1
                if (data['detalleTransporte']) {
                    this.generateDatosTransporteValidate(params, data);
                }
            }
        }
        if (data['tipoDocumento'] != 7) {
            this.generateDatosTotalesValidate(params, data, config);
        }
        if (data['complementarios']) {
            this.generateDatosComercialesUsoGeneralValidate(params, data);
        }
        if (data['moneda'] != 'PYG' && data['condicionTipoCambio'] == 1) {
            if (!data['cambio']) {
                this.errors.push('Debe especificar el valor del Cambio en data.cambio cuando moneda != PYG y la Cotización es Global');
            }
        }
        if (data['tipoDocumento'] == 4 || data['tipoDocumento'] == 5 || data['tipoDocumento'] == 6) {
            if (!data['documentoAsociado']) {
                this.errors.push('Documento asociado es obligatorio para el tipo de documento electrónico (' +
                    data['tipoDocumento'] +
                    ') seleccionado');
            }
        }
        if (data['tipoDocumento'] == 1 ||
            data['tipoDocumento'] == 4 ||
            data['tipoDocumento'] == 5 ||
            data['tipoDocumento'] == 6 ||
            data['tipoDocumento'] == 7) {
            if (data['documentoAsociado']) {
                if (!Array.isArray(data['documentoAsociado'])) {
                    this.generateDatosDocumentoAsociadoValidate(params, data['documentoAsociado'], data);
                }
                else {
                    //Caso sea un array.
                    for (var i = 0; i < data['documentoAsociado'].length; i++) {
                        const dataDocumentoAsociado = data['documentoAsociado'][i];
                        this.generateDatosDocumentoAsociadoValidate(params, dataDocumentoAsociado, data);
                    }
                }
            }
        }
        //Tratamiento Final, del Envio del Error, no tocar
        if (this.errors.length > 0) {
            let errorExit = new Error();
            let msgErrorExit = '';
            let recorrerHasta = this.errors.length;
            if ((config.errorLimit || 3) < recorrerHasta) {
                recorrerHasta = config.errorLimit || 3;
            }
            for (let i = 0; i < recorrerHasta; i++) {
                const error = this.errors[i];
                msgErrorExit += error;
                if (i < recorrerHasta - 1) {
                    msgErrorExit += config.errorSeparator + '';
                }
            }
            errorExit.message = msgErrorExit;
            /*errorExit.firstMessage = this.errors[0];
            errorExit.errorsArray = this.errors;*/
            throw errorExit;
        }
    }
    generateCodigoControlValidate(params, data) {
        if (data.cdc && (data.cdc + '').length == 44) {
            //Caso ya se le pase el CDC
            //const codigoSeguridad = data.cdc.substring(34, 43);
            const codigoControl = data.cdc;
            //Como se va utilizar el CDC enviado como parametro, va a verificar que todos los datos del XML coincidan con el CDC.
            const tipoDocumentoCDC = codigoControl.substring(0, 2);
            //const rucCDC = this.codigoControl.substring(2, 10);
            //const dvCDC = this.codigoControl.substring(10, 11);
            const establecimientoCDC = codigoControl.substring(11, 14);
            const puntoCDC = codigoControl.substring(14, 17);
            const numeroCDC = codigoControl.substring(17, 24);
            //const tipoContribuyenteCDC = this.codigoControl.substring(24, 25);
            const fechaCDC = codigoControl.substring(25, 33);
            const tipoEmisionCDC = codigoControl.substring(33, 34);
            if (+data['tipoDocumento'] != +tipoDocumentoCDC) {
                this.errors.push("El Tipo de Documento '" +
                    data['tipoDocumento'] +
                    "' en data.tipoDocumento debe coincidir con el CDC re-utilizado (" +
                    +tipoDocumentoCDC +
                    ')');
            }
            const establecimiento = StringUtil_service_1.default.leftZero(data['establecimiento'], 3);
            if (establecimiento != establecimientoCDC) {
                this.errors.push("El Establecimiento '" +
                    establecimiento +
                    "'en data.establecimiento debe coincidir con el CDC reutilizado (" +
                    establecimientoCDC +
                    ')');
            }
            const punto = StringUtil_service_1.default.leftZero(data['punto'], 3);
            if (punto != puntoCDC) {
                this.errors.push("El Punto '" + punto + "' en data.punto debe coincidir con el CDC reutilizado (" + puntoCDC + ')');
            }
            const numero = StringUtil_service_1.default.leftZero(data['numero'], 7);
            if (numero != numeroCDC) {
                this.errors.push("El Numero de Documento '" +
                    numero +
                    "'en data.numero debe coincidir con el CDC reutilizado (" +
                    numeroCDC +
                    ')');
            }
            /*if (+data['tipoContribuyente'] != +tipoContribuyenteCDC) {
              this.errors.push("El Tipo de Contribuyente '" + data['tipoContribuyente'] + "' en data.tipoContribuyente debe coincidir con el CDC reutilizado (" + tipoContribuyenteCDC + ")");
            }*/
            const fecha = (data['fecha'] + '').substring(0, 4) +
                (data['fecha'] + '').substring(5, 7) +
                (data['fecha'] + '').substring(8, 10);
            if (fecha != fechaCDC) {
                this.errors.push("La fecha '" + fecha + "' en data.fecha debe coincidir con el CDC reutilizado (" + fechaCDC + ')');
            }
            if (+data['tipoEmision'] != +tipoEmisionCDC) {
                this.errors.push("El Tipo de Emisión '" +
                    data['tipoEmision'] +
                    "' en data.tipoEmision debe coincidir con el CDC reutilizado (" +
                    tipoEmisionCDC +
                    ')');
            }
        }
    }
    datosEmisorValidate(params, data) {
        if (params['ruc'].indexOf('-') == -1) {
            this.errors.push('RUC debe contener dígito verificador en params.ruc');
        }
        let rucEmisor = params['ruc'].split('-')[0];
        const dvEmisor = params['ruc'].split('-')[1];
        var reg = new RegExp(/^\d+$/);
        /*if (!reg.test(rucEmisor)) {
          this.errors.push("La parte que corresponde al RUC '" + params['ruc'] + "' en params.ruc debe ser numérico");
        }*/
        if (rucEmisor.length > 8) {
            this.errors.push("La parte que corresponde al RUC '" + params['ruc'] + "' en params.ruc debe contener de 1 a 8 caracteres");
        }
        if (!reg.test(dvEmisor)) {
            this.errors.push("La parte que corresponde al DV del RUC '" + params['ruc'] + "' en params.ruc debe ser numérico");
        }
        if (dvEmisor > 9) {
            this.errors.push("La parte que corresponde al DV del RUC '" + params['ruc'] + "' en params.ruc debe ser del 1 al 9");
        }
        if (!((params['timbradoNumero'] + '').length == 8)) {
            this.errors.push('Debe especificar un Timbrado de 8 caracteres en params.timbradoNumero');
        }
        if (!FechaUtil_service_1.default.isIsoDate(params['timbradoFecha'])) {
            this.errors.push("Valor de la Fecha '" + params['timbradoFecha'] + "' en params.fecha no válido. Formato: yyyy-MM-dd");
        }
        if (params['tipoRegimen']) {
            if (constants_service_1.default.tiposRegimenes.filter((um) => um.codigo === params['tipoRegimen']).length == 0) {
                this.errors.push("Tipo de Regimen '" +
                    data['tipoRegimen'] +
                    "' en params.tipoRegimen no válido. Valores: " +
                    constants_service_1.default.tiposRegimenes.map((a) => a.codigo + '-' + a.descripcion));
            }
        }
        if (!params['razonSocial']) {
            this.errors.push('La razon social del emisor en params.razonSocial no puede ser vacio');
        }
        else {
            if (!((params['razonSocial'] + '').length >= 4 && (params['razonSocial'] + '').length <= 250)) {
                this.errors.push("La razon Social del Emisor '" +
                    params['razonSocial'] +
                    "' en params.razonSocial debe tener de 4 a 250 caracteres");
            }
        }
        if (params['nombreFantasia'] && (params['nombreFantasia'] + '').length > 0) {
            if (!((params['nombreFantasia'] + '').length >= 4 && (params['nombreFantasia'] + '').length <= 250)) {
                this.errors.push("El nombre de Fantasia del Emisor '" +
                    params['nombreFantasia'] +
                    "' en params.nombreFantasia debe tener de 4 a 250 caracteres");
            }
        }
        //Aqui hay que verificar los datos de las sucursales
        if (!(params['establecimientos'] && Array.isArray(params['establecimientos']))) {
            this.errors.push('Debe especificar un array de establecimientos en params.establecimientos');
        }
        else {
            for (let i = 0; i < params['establecimientos'].length; i++) {
                const establecimiento = params['establecimientos'][i];
                if (!establecimiento.codigo) {
                    this.errors.push('Debe especificar el código del establecimiento en params.establecimientos[' + i + '].codigo');
                }
                if (establecimiento['telefono']) {
                    if (!(establecimiento['telefono'].length >= 6 && establecimiento['telefono'].length <= 15)) {
                        this.errors.push("El valor '" +
                            establecimiento['telefono'] +
                            "' en params.establecimientos[" +
                            i +
                            '].telefono debe tener una longitud de 6 a 15 caracteres');
                    }
                    else {
                        if ((establecimiento['telefono'] + '').includes('(') ||
                            (establecimiento['telefono'] + '').includes(')') ||
                            (establecimiento['telefono'] + '').includes('[') ||
                            (establecimiento['telefono'] + '').includes(']')) {
                            /*this.errors.push(
                              "El valor '" +
                                establecimiento['telefono'] +
                                "' en params.establecimientos[" +
                                i +
                                '].telefono no puede contener () o []',
                            );*/
                            //Finalmente no da error en SIFEN por esto
                        }
                    }
                }
            }
        }
    }
    generateDatosOperacionValidate(params, data) {
        /*if (params['ruc'].indexOf('-') == -1) { //removido temporalmente, parece que no hace falta
          this.errors.push('RUC debe contener dígito verificador en params.ruc');
        }*/
        if (constants_service_1.default.tiposEmisiones.filter((um) => um.codigo === data['tipoEmision']).length == 0) {
            this.errors.push("Tipo de Emisión '" +
                data['tipoEmision'] +
                "' en data.tipoEmision no válido. Valores: " +
                constants_service_1.default.tiposEmisiones.map((a) => a.codigo + '-' + a.descripcion));
        }
        //Validar aqui "dInfoFisc"
        if (data['tipoDocumento'] == 7) {
            //Nota de Remision
            if (!(data['descripcion'] && (data['descripcion'] + '').trim().length > 0)) {
                //Segun dicen en TDE no es obligatorio, entonces se retira la validacion.
                //this.errors.push('Debe informar la Descripción en data.descripcion para el Documento Electrónico');
            }
        }
    }
    generateDatosGeneralesValidate(params, data, config) {
        this.generateDatosGeneralesInherentesOperacionValidate(params, data);
        this.generateDatosGeneralesEmisorDEValidate(params, data);
        if (config.userObjectRemove == false) {
            //Si está TRUE no crea el objeto usuario
            if (data['usuario']) {
                //No es obligatorio
                this.generateDatosGeneralesResponsableGeneracionDEValidate(params, data);
            }
        }
        this.generateDatosGeneralesReceptorDEValidate(params, data);
    }
    generateDatosGeneralesInherentesOperacionValidate(params, data) {
        if (data['tipoDocumento'] == 7) {
            //C002
            return; //No informa si el tipo de documento es 7
        }
        if (!FechaUtil_service_1.default.isIsoDateTime(data['fecha'])) {
            this.errors.push("Valor de la Fecha '" + data['fecha'] + "' en data.fecha no válido. Formato: yyyy-MM-ddTHH:mm:ss");
        }
        if (!data['tipoImpuesto']) {
            this.errors.push('Debe especificar el Tipo de Impuesto en data.tipoImpuesto');
        }
        else {
            if (constants_service_1.default.tiposImpuestos.filter((um) => um.codigo === +data['tipoImpuesto']).length == 0) {
                this.errors.push("Tipo de Impuesto '" +
                    data['tipoImpuesto'] +
                    "' en data.tipoImpuesto no válido. Valores: " +
                    constants_service_1.default.tiposImpuestos.map((a) => a.codigo + '-' + a.descripcion));
            }
        }
        let moneda = data['moneda'];
        if (!moneda) {
            moneda = 'PYG';
        }
        if (constants_service_1.default.monedas.filter((um) => um.codigo === moneda).length == 0) {
            this.errors.push("Moneda '" +
                moneda +
                "' en data.moneda no válido. Valores: " +
                constants_service_1.default.monedas.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (data['condicionAnticipo']) {
            if (constants_service_1.default.globalPorItem.filter((um) => um.codigo === data['condicionAnticipo']).length == 0) {
                this.errors.push("Condición de Anticipo '" +
                    data['condicionAnticipo'] +
                    "' en data.condicionAnticipo no válido. Valores: " +
                    constants_service_1.default.globalPorItem.map((a) => a.codigo + '-Anticipo ' + a.descripcion));
            }
        }
        else {
            //condicionAnticipo - si no tiene condicion anticipo, pero tipo transaccion es 9, que de un error.
        }
        if (constants_service_1.default.tiposTransacciones.filter((um) => um.codigo === data['tipoTransaccion']).length == 0) {
            this.errors.push("Tipo de Transacción '" +
                data['tipoTransaccion'] +
                "' en data.tipoTransaccion no válido. Valores: " +
                constants_service_1.default.tiposTransacciones.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 4) {
            //Obligatorio informar iTipTra D011
            if (!data['tipoTransaccion']) {
                this.errors.push('Debe proveer el Tipo de Transacción en data.tipoTransaccion');
            }
        }
        if (moneda != 'PYG') {
            if (!data['condicionTipoCambio']) {
                this.errors.push('Debe informar el tipo de Cambio en data.condicionTipoCambio');
            }
        }
        if (data['condicionTipoCambio'] == 1 && moneda != 'PYG') {
            if (!(data['cambio'] && data['cambio'] > 0)) {
                this.errors.push('Debe informar el valor del Cambio en data.cambio');
            }
        }
        if (data['obligaciones']) {
            if (!Array.isArray(data['obligaciones'])) {
                this.errors.push('El valor de data.obligaciones debe ser un Array');
            }
            else {
                for (let i = 0; i < data['obligaciones'].length; i++) {
                    let obligacion = data['obligaciones'][i];
                    if (!obligacion.codigo) {
                        this.errors.push('No fue especificado un código en data.obligaciones[' + i + '].codigo');
                    }
                    else {
                        //Verificar cada item
                        if (constants_service_1.default.obligaciones.filter((um) => um.codigo === +obligacion.codigo).length == 0) {
                            this.errors.push("Obligación '" +
                                obligacion.codigo +
                                "' en data.obligaciones[" +
                                i +
                                '].codigo no válido. Valores: ' +
                                constants_service_1.default.obligaciones.map((a) => a.codigo + '-' + a.descripcion));
                        }
                    }
                }
            }
        }
    }
    generateDatosGeneralesEmisorDEValidate(params, data) {
        const regExpOnlyNumber = new RegExp(/^\d+$/);
        if (!(params && params.establecimientos)) {
            this.errors.push('Debe proveer un Array con la información de los establecimientos en params');
        }
        //Validar si el establecimiento viene en params
        let establecimiento = StringUtil_service_1.default.leftZero(data['establecimiento'], 3);
        //let punto = stringUtilService.leftZero(data['punto'], 3);
        if (params.establecimientos.filter((um) => um.codigo === establecimiento).length == 0) {
            this.errors.push("Establecimiento '" +
                establecimiento +
                "' no encontrado en params.establecimientos*.codigo. Valores: " +
                params.establecimientos.map((a) => a.codigo + '-' + a.denominacion));
        }
        /*if (params['ruc'].indexOf('-') == -1) { //Removido temporalmente, al parecer no hace falta
          this.errors.push('RUC debe contener dígito verificador en params.ruc');
        }*/
        if (!(params['actividadesEconomicas'] && params['actividadesEconomicas'].length > 0)) {
            this.errors.push('Debe proveer el array de actividades económicas en params.actividadesEconomicas');
        }
        //Validacion de algunos datos de la sucursal
        const establecimientoUsado = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0];
        if (!establecimientoUsado) {
            this.errors.push('Debe especificar los datos del Establecimiento "' + establecimiento + '" en params.establecimientos*');
        }
        else {
            if (!establecimientoUsado.ciudad) {
                this.errors.push('Debe proveer la Ciudad del establecimiento en params.establecimientos*.ciudad');
            }
            if (!establecimientoUsado.distrito) {
                this.errors.push('Debe proveer la Distrito del establecimiento en params.establecimientos*.distrito');
            }
            if (!establecimientoUsado.departamento) {
                this.errors.push('Debe proveer la Departamento del establecimiento en params.establecimientos*.departamento');
            }
            constants_service_1.default.validateDepartamentoDistritoCiudad('params.establecimientos*', +establecimientoUsado.departamento, +establecimientoUsado.distrito, +establecimientoUsado.ciudad, this.errors);
            if (establecimientoUsado['numeroCasa']) {
                if (!regExpOnlyNumber.test(establecimientoUsado['numeroCasa'])) {
                    this.errors.push('El Número de Casa en params.establecimientos*.numeroCasa debe ser numérico');
                }
            }
        }
    }
    generateDatosGeneralesResponsableGeneracionDEValidate(params, data) {
        if (constants_service_1.default.tiposDocumentosIdentidades.filter((um) => um.codigo === +data['usuario']['documentoTipo'])
            .length == 0) {
            this.errors.push("Tipo de Documento '" +
                data['usuario']['documentoTipo'] +
                "' no encontrado en data.usuario.documentoTipo. Valores: " +
                constants_service_1.default.tiposDocumentosIdentidades.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (!data['usuario']['documentoNumero']) {
            this.errors.push('El Documento del Responsable en data.usuario.documentoNumero no puede ser vacio');
        }
        if (!data['usuario']['nombre']) {
            this.errors.push('El Nombre del Responsable en data.usuario.nombre no puede ser vacio');
        }
        if (!data['usuario']['cargo']) {
            this.errors.push('El Cargo del Responsable en data.usuario.cargo no puede ser vacio');
        }
    }
    generateDatosGeneralesReceptorDEValidate(params, data) {
        if (!data['cliente']) {
            return; //El error de cliente vacio, ya fue validado arriba
        }
        if (!data['cliente']['tipoOperacion']) {
            this.errors.push('Tipo de Operación del Cliente en data.cliente.tipoOperacion es requerido > 0');
        }
        else {
            if (constants_service_1.default.tiposOperaciones.filter((um) => um.codigo === +data['cliente']['tipoOperacion']).length ==
                0) {
                this.errors.push("Tipo de Operación '" +
                    data['cliente']['tipoOperacion'] +
                    "' del Cliente en data.cliente.tipoOperacion no encontrado. Valores: " +
                    constants_service_1.default.tiposOperaciones.map((a) => a.codigo + '-' + a.descripcion));
            }
        }
        if (!data['cliente']['contribuyente'] && data['cliente']['tipoOperacion'] != 4) {
            if (constants_service_1.default.tiposDocumentosReceptor.filter((um) => um.codigo === +data['cliente']['documentoTipo'])
                .length == 0) {
                this.errors.push("Tipo de Documento '" +
                    data['cliente']['documentoTipo'] +
                    "' del Cliente en data.cliente.documentoTipo no encontrado. Valores: " +
                    constants_service_1.default.tiposDocumentosReceptor.map((a) => a.codigo + '-' + a.descripcion));
                if (+data['cliente']['documentoTipo'] == 9) {
                    if (!data['cliente']['documentoTipoDescripcion']) {
                        this.errors.push('Debe especificar la Descripción para el tipo de Documento en data.cliente.documentoTipoDescripcion para documentoTipo=9');
                    }
                }
            }
        }
        var regExpOnlyNumber = new RegExp(/^\d+$/);
        if (data['cliente']['contribuyente']) {
            if (!data['cliente']['ruc']) {
                this.errors.push('Debe proporcionar el RUC en data.cliente.ruc');
            }
            else {
                if (data['cliente']['ruc'].indexOf('-') == -1) {
                    this.errors.push('RUC debe contener dígito verificador en data.cliente.ruc');
                }
                const rucCliente = data['cliente']['ruc'].split('-');
                //Un RUC puede ser alphanumerico
                /*if (!regExpOnlyNumber.test((rucCliente[0] + '').trim())) {
                  this.errors.push(
                    "La parte del RUC del Cliente '" + data['cliente']['ruc'] + "' en data.cliente.ruc debe ser numérico",
                  );
                }*/
                if (!regExpOnlyNumber.test((rucCliente[1] + '').trim())) {
                    this.errors.push("La parte del DV del RUC del Cliente '" +
                        data['cliente']['ruc'] +
                        "' en data.cliente.ruc debe ser numérico");
                }
                if (!(rucCliente[0].length >= 3 && rucCliente[0].length <= 8)) {
                    this.errors.push("La parte del RUC '" + data['cliente']['ruc'] + "' en data.cliente.ruc debe contener de 3 a 8 caracteres");
                }
                if (rucCliente[1] > 9) {
                    this.errors.push("La parte del DV del RUC '" + data['cliente']['ruc'] + "' en data.cliente.ruc debe ser del 1 al 9");
                }
            }
            if (!data['cliente']['tipoContribuyente']) {
                this.errors.push('Debe proporcionar el Tipo de Contribuyente en data.cliente.tipoContribuyente');
            }
        }
        if (!data['cliente']['razonSocial']) {
            this.errors.push('La razon social del receptor en data.cliente.razonSocial no puede ser vacio');
        }
        else {
            if (!((data['cliente']['razonSocial'] + '').length >= 4 && (data['cliente']['razonSocial'] + '').length <= 250)) {
                this.errors.push("La razon Social del Cliente '" +
                    data['cliente']['razonSocial'] +
                    "' en data.cliente.razonSocial debe tener de 4 a 250 caracteres");
            }
        }
        if (data['cliente']['nombreFantasia'] && (data['cliente']['nombreFantasia'] + '').length > 0) {
            if (!((data['cliente']['nombreFantasia'] + '').length >= 4 && (data['cliente']['nombreFantasia'] + '').length <= 250)) {
                this.errors.push("El nombre de Fantasia del Cliente '" +
                    data['cliente']['nombreFantasia'] +
                    "' en data.cliente.nombreFantasia debe tener de 4 a 250 caracteres");
            }
        }
        if (constants_service_1.default.paises.filter((pais) => pais.codigo === data['cliente']['pais']).length == 0) {
            this.errors.push("Pais '" +
                data['cliente']['pais'] +
                "' del Cliente en data.cliente.pais no encontrado.");
        }
        if (data['tipoDocumento'] == 4) {
            if (data['cliente']['tipoOperacion'] != 2) {
                this.errors.push('El Tipo de Operación debe ser 2-B2C para el Tipo de Documento AutoFactura');
            }
        }
        if (!data['cliente']['contribuyente'] && data['cliente']['tipoOperacion']) {
            //No es contribuyente
            //Obligatorio completar D210
            if (!data['cliente']['contribuyente'] && data['cliente']['tipoOperacion'] != 4) {
                if (!data['cliente']['documentoTipo']) {
                    //Val.: 59
                    this.errors.push('Debe informar el Tipo de Documento del Cliente en data.cliente.documentoTipo');
                }
                else {
                    let documentoTipoDS = constants_service_1.default.tiposDocumentosReceptor.filter((tdr) => tdr.codigo === +data['cliente']['documentoTipo']);
                    if (documentoTipoDS.length <= 0) {
                        this.errors.push('Tipo de Documento del Cliente en data.cliente.documentoTipo no válido');
                    }
                }
                //Cuando el campo puede ser un número, y se admite el valor cero, mejor preguntar de ésta forma
                if (typeof data['cliente']['documentoNumero'] == 'undefined') {
                    //Val.: 65
                    this.errors.push('Debe informar el número de documento en data.cliente.documentoNumero');
                }
                else {
                    //Validar que documentoNumero no tenga .
                    if ((data['cliente']['documentoNumero'] + '').indexOf('.') > -1) {
                        this.errors.push('El valor "' + data['cliente']['documentoNumero'] + '" en data.cliente.documentoNumero no es válido ');
                    }
                    //Validar que documentoNumero no tenga /
                    if ((data['cliente']['documentoNumero'] + '').indexOf('/') > -1) {
                        this.errors.push('El valor "' + data['cliente']['documentoNumero'] + '" en data.cliente.documentoNumero no es válido ');
                    }
                }
            }
        }
        //Este es solo una validacion por si coloca un documentoTipo erróneo, independientemente asi tiene que tener o no el campo
        if (data['cliente']['documentoTipo']) {
            let documentoTipoDS = constants_service_1.default.tiposDocumentosReceptor.filter((tdr) => tdr.codigo === +data['cliente']['documentoTipo']);
            if (documentoTipoDS.length <= 0) {
                this.errors.push('Tipo de Documento del Cliente ' + data['cliente']['documentoTipo'] + ' en data.cliente.documentoTipo no válido');
            }
        }
        if (!data['cliente']['contribuyente'] &&
            data['tipoDocumento'] != 4 &&
            data['cliente']['tipoOperacion'] != 2 &&
            data['cliente']['tipoOperacion'] != 4) {
            //Val.: 46. parrafo 1
            this.errors.push('El tipo de Operación debe ser 2-B2C o 4-B2F para el Receptor "No Contribuyente"');
        }
        if (data['cliente']['tipoOperacion'] == 4 && data['cliente']['contribuyente'] == true) {
            //Val.: 46. parrafo 2
            this.errors.push('La naturaleza del Receptor debe ser "No contribuyente" para el Tipo de Operación = 4-B2F');
        }
        //Temporal Mercosys
        /*if (data['tipoDocumento'] === 7 || data['cliente']['tipoOperacion'] === 4) {
          if (!data['cliente']['direccion']) {
            this.errors.push('data.cliente.direccion es Obligatorio para Tipo de Documento 7 o Tipo de Operación 4');
          }
        }*/
        if (data['tipoDocumento'] === 7) {
            if (!data['cliente']['direccion']) {
                this.errors.push('data.cliente.direccion es Obligatorio para Tipo de Documento 7');
            }
        }
        if (data['cliente']['direccion']) {
            //Si tiene dirección hay que completar numero de casa.
            if (!((data['cliente']['direccion'] + '').trim().length >= 1 &&
                (data['cliente']['direccion'] + '').trim().length <= 255)) {
                this.errors.push("La dirección del Receptor '" +
                    data['cliente']['direccion'] +
                    "' en data.cliente.direccion debe tener de 1 a 255 caracteres");
            }
            if (data['cliente']['numeroCasa'] == null) {
                this.errors.push('Debe informar el Número de casa del Receptor en data.cliente.numeroCasa');
            }
            if (!((data['cliente']['numeroCasa'] + '').length > 0)) {
                this.errors.push('Debe informar el Número de casa del Receptor en data.cliente.numeroCasa');
            }
            //Nueva forma de validar campos numericos
            /*
            if (  ! ( data['cliente']['numeroCasa'] != null &&
                      (data['cliente']['numeroCasa'] + '').length > 0 &&
                      regExpOnlyNumber.test(data['cliente']['numeroCasa']) )
            ) {
              this.errors.push('Debe informar el Número de casa del Receptor en data.cliente.numeroCasa');
            }
            */
        }
        if (data['cliente']['numeroCasa']) {
            if (!regExpOnlyNumber.test(data['cliente']['numeroCasa'])) {
                this.errors.push('El Número de Casa en data.cliente.numeroCasa debe ser numérico');
            }
        }
        if (data['cliente']['direccion'] && data['cliente']['tipoOperacion'] != 4) {
            if (!data['cliente']['ciudad']) {
                this.errors.push('Obligatorio especificar la Ciudad en data.cliente.ciudad para Tipo de Operación != 4');
            }
            else {
                if (constants_service_1.default.ciudades.filter((ciudad) => ciudad.codigo === +data['cliente']['ciudad']).length == 0) {
                    this.errors.push("Ciudad '" +
                        data['cliente']['ciudad'] +
                        "' del Cliente en data.cliente.ciudad no encontrado. Valores: " +
                        constants_service_1.default.ciudades.map((a) => a.codigo + '-' + a.descripcion));
                }
                //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
                //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
                //data['cliente']['distrito'] y data['cliente']['departamento']
                let objCiudad = constants_service_1.default.ciudades.filter((ciu) => ciu.codigo === +data['cliente']['ciudad']);
                if (objCiudad && objCiudad[0]) {
                    let objDistrito = constants_service_1.default.distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);
                    let objDepartamento = constants_service_1.default.departamentos.filter((dep) => dep.codigo === +objDistrito[0]['departamento']);
                    data['cliente']['distrito'] = objDistrito[0]['codigo'];
                    data['cliente']['departamento'] = objDepartamento[0]['codigo'];
                }
            }
            if (!data['cliente']['distrito']) {
                this.errors.push('Obligatorio especificar el Distrito en data.cliente.distrito para Tipo de Operación != 4');
            }
            else if (constants_service_1.default.distritos.filter((distrito) => distrito.codigo === +data['cliente']['distrito']).length ==
                0) {
                this.errors.push("Distrito '" +
                    data['cliente']['distrito'] +
                    "' del Cliente en data.cliente.distrito no encontrado. Valores: " +
                    constants_service_1.default.distritos.map((a) => a.codigo + '-' + a.descripcion));
            }
            if (!data['cliente']['departamento']) {
                this.errors.push('Obligatorio especificar el Departamento en data.cliente.departamento para Tipo de Operación != 4');
            }
            else if (constants_service_1.default.departamentos.filter((departamento) => departamento.codigo === +data['cliente']['departamento']).length == 0) {
                this.errors.push("Departamento '" +
                    data['cliente']['departamento'] +
                    "' del Cliente en data.cliente.departamento no encontrado. Valores: " +
                    constants_service_1.default.departamentos.map((a) => a.codigo + '-' + a.descripcion));
            }
            //console.log("distrito", data['cliente']['distrito'], "ciudad", data['cliente']['ciudad'], "departamento", data['cliente']['departamento']);
            constants_service_1.default.validateDepartamentoDistritoCiudad('data.cliente', +data['cliente']['departamento'], +data['cliente']['distrito'], +data['cliente']['ciudad'], this.errors);
        }
        if (data['cliente']['tipoOperacion'] == 4) {
            if (data['cliente']['pais'] == 'PRY') {
                this.errors.push('El tipo de Operación = 4-B2F requiere un pais diferente a PRY');
            }
        }
        if (data['cliente']['telefono']) {
            if (!(data['cliente']['telefono'].length >= 6 && data['cliente']['telefono'].length <= 15)) {
                this.errors.push("El valor '" +
                    data['cliente']['telefono'] +
                    "' en data.cliente.telefono debe tener una longitud de 6 a 15 caracteres");
            }
            else {
                if ((data['cliente']['telefono'] + '').includes('(') ||
                    (data['cliente']['telefono'] + '').includes(')') ||
                    (data['cliente']['telefono'] + '').includes('[') ||
                    (data['cliente']['telefono'] + '').includes(']')) {
                    /*this.errors.push(
                      "El valor '" + data['cliente']['telefono'] + "' en data.cliente.telefono no puede contener () o []",
                    );*/
                    //Finalmente no da error en SIFEN por esto
                }
            }
        }
        const validateNumeroCelular = (celular, errors) => {
            if (!(celular.length >= 10 && celular.length <= 20)) {
                errors.push("El valor '" + celular + "' en data.cliente.celular debe tener una longitud de 10 a 20 caracteres");
            }
            else {
                if ((celular + '').includes('(') ||
                    (celular + '').includes(')') ||
                    (celular + '').includes('[') ||
                    (celular + '').includes(']') ||
                    (celular + '').includes(';') ||
                    (celular + '').includes('=') ||
                    (celular + '').includes('/') ||
                    (celular + '').includes('\\')) {
                    errors.push("El valor '" + celular + "' en data.cliente.celular no puede contener (), [] o ;");
                }
            }
        };
        if (data['cliente']['celular']) {
            //Primero verificar si el celular tiene comas
            if ((data['cliente']['celular'] + '').includes(',')) {
                let celulares = data['cliente']['celular'].split(',');
                for (let i = 0; i < celulares.lenght; i++) {
                    validateNumeroCelular(celulares[i], this.errors);
                }
            }
            else {
                validateNumeroCelular(data['cliente']['celular'], this.errors);
            }
        }
        if (data['cliente']['email']) {
            let email = new String(data['cliente']['email']); //Hace una copia, para no alterar.
            //Verificar si tiene varios correos.
            if (email.indexOf(',') > -1) {
                //Si el Email tiene , (coma) entonces va enviar solo el primer valor, ya que SIFEN no acepta Comas
                email = email.split(',')[0].trim();
            }
            //Verificar espacios
            if (email.indexOf(' ') > -1) {
                this.errors.push("El valor '" + email + "' en data.cliente.email no puede poseer espacios");
            }
            if (!(email.length >= 3 && email.length <= 80)) {
                this.errors.push("El valor '" + email + "' en data.cliente.email debe tener una longitud de 3 a 80 caracteres");
            }
            //se valida el mail
            var regExEmail = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm);
            if (!regExEmail.test(email + '')) {
                this.errors.push("El valor '" + email + "' en data.cliente.email es inválido");
            }
        }
        if (data['cliente']['codigo']) {
            if (!((data['cliente']['codigo'] + '').length >= 3 && (data['cliente']['codigo'] + '').length <= 15)) {
                this.errors.push("El código del Cliente '" +
                    data['cliente']['codigo'] +
                    "' en data.cliente.codigo debe tener de 3 a 15 caracteres");
            }
        }
    }
    generateDatosEspecificosPorTipoDEValidate(params, data) {
        if (data['tipoDocumento'] === 1) {
            this.generateDatosEspecificosPorTipoDE_FacturaElectronicaValidate(params, data);
        }
        if (data['tipoDocumento'] === 4) {
            this.generateDatosEspecificosPorTipoDE_AutofacturaValidate(params, data);
        }
        if (data['tipoDocumento'] === 5 || data['tipoDocumento'] === 6) {
            this.generateDatosEspecificosPorTipoDE_NotaCreditoDebitoValidate(params, data);
        }
        if (data['tipoDocumento'] === 7) {
            this.generateDatosEspecificosPorTipoDE_RemisionElectronicaValidate(params, data);
        }
    }
    generateDatosEspecificosPorTipoDE_FacturaElectronicaValidate(params, data) {
        if (!data['factura']) {
            this.errors.push('Debe indicar los datos especificos de la Factura en data.factura');
            return; // Termina el metodos
        }
        if (constants_service_1.default.indicadoresPresencias.filter((um) => um.codigo === +data['factura']['presencia']).length ==
            0) {
            this.errors.push("Indicador de Presencia '" +
                data['factura']['presencia'] +
                "' en data.factura.presencia no encontrado. Valores: " +
                constants_service_1.default.indicadoresPresencias.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (data['factura']['fechaEnvio']) {
            let fechaFactura = new Date(data['fecha']);
            let fechaEnvio = new Date(data['factura']['fechaEnvio']);
            if (fechaFactura.getTime() > fechaEnvio.getTime()) {
                this.errors.push("La Fecha de envío '" +
                    data['factura']['fechaEnvio'] +
                    "'en data.factura.fechaEnvio, debe ser despues de la fecha de Factura");
            }
        }
        if (data['cliente']['tipoOperacion'] === 3) {
            this.generateDatosEspecificosPorTipoDE_ComprasPublicasValidate(params, data);
        }
    }
    /**
     * Datos especificos cuando el tipo de operacion del receptor es B2G (Campo D202)
     * Dentro de la factura electronica
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosEspecificosPorTipoDE_ComprasPublicasValidate(params, data) {
        if (!(data['dncp'] && data['dncp']['modalidad'] && (data['dncp']['modalidad'] + '').length == 2)) {
            this.errors.push('Debe informar la modalidad de Contratación DNCP  (2 digitos) en data.dncp.modalidad');
        }
        /*if (
          !(data['dncp'] && data['dncp']['entidad'] && +data['dncp']['entidad'] > 9999 && +data['dncp']['entidad'] < 100000)
        ) {*/
        if (!(data['dncp'] && data['dncp']['entidad'] && (data['dncp']['entidad'] + '').length == 5)) {
            this.errors.push('Debe informar la entidad de Contratación DNCP (5 digitos) en data.dncp.entidad');
        }
        //if (!(data['dncp'] && data['dncp']['año'] && +data['dncp']['año'] > 0 && +data['dncp']['año'] < 100)) {
        if (!(data['dncp'] && data['dncp']['año'] && (data['dncp']['año'] + '').length == 2)) {
            this.errors.push('Debe informar el año de Contratación DNCP (2 digitos) en data.dncp.año');
        }
        /*if (
          !(
            data['dncp'] &&
            data['dncp']['secuencia'] &&
            +data['dncp']['secuencia'] > 999999 &&
            +data['dncp']['secuencia'] < 10000000
          )
        ) {
          this.errors.push('Debe informar la secuencia de Contratación DNCP (7 digitos) en data.dncp.secuencia');
        }*/
        if (!(data['dncp'] && data['dncp']['secuencia'] && (data['dncp']['secuencia'] + '').length == 7)) {
            this.errors.push('Debe informar la secuencia de Contratación DNCP (7 digitos) en data.dncp.secuencia');
        }
        if (!(data['dncp'] && data['dncp']['fecha'] && (data['dncp']['fecha'] + '').length > 0)) {
            this.errors.push('Debe informar la fecha de emisión de código de Contratación DNCP en data.dncp.fecha');
        }
        else {
            if (!FechaUtil_service_1.default.isIsoDate(data['dncp']['fecha'])) {
                this.errors.push("Fecha DNCP '" + data['dncp']['fecha'] + "' en data.dncp.fecha no válida. Formato: yyyy-MM-dd");
            }
        }
    }
    generateDatosEspecificosPorTipoDE_AutofacturaValidate(params, data) {
        if (!data['autoFactura']) {
            this.errors.push('Para tipoDocumento = 4 debe proveer los datos de Autofactura en data.autoFactura');
        }
        if (!data['autoFactura']['ubicacion']) {
            this.errors.push('Para tipoDocumento = 4 debe proveer los datos del Lugar de Transacción de la Autofactura en data.autoFactura.ubicacion');
        }
        if (!data['autoFactura']['tipoVendedor']) {
            this.errors.push('Debe especificar la Naturaleza del Vendedor en data.autoFactura.tipoVendedor');
        }
        if (!data['autoFactura']['documentoTipo']) {
            this.errors.push('Debe especificar el Tipo de Documento del Vendedor en data.autoFactura.documentoTipo');
        }
        if (constants_service_1.default.naturalezaVendedorAutofactura.filter((um) => um.codigo === data['autoFactura']['tipoVendedor']).length == 0) {
            this.errors.push("Tipo de Vendedor '" +
                data['autoFactura']['tipoVendedor'] +
                "' en data.autoFactura.tipoVendedor no encontrado. Valores: " +
                constants_service_1.default.naturalezaVendedorAutofactura.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (constants_service_1.default.tiposDocumentosIdentidades.filter((um) => um.codigo === data['autoFactura']['documentoTipo']).length == 0) {
            this.errors.push("Tipo de Documento '" +
                data['autoFactura']['documentoTipo'] +
                "' en data.autoFactura.documentoTipo no encontrado. Valores: " +
                constants_service_1.default.tiposDocumentosIdentidades.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (!data['autoFactura']['ubicacion']) {
            this.errors.push('Debe especificar la ubicación de la transacción en data.autoFactura.ubicacion');
        }
        if (!data['autoFactura']['documentoNumero']) {
            this.errors.push('Debe especificar el Nro. de Documento del Vendedor en data.autoFactura.documentoNumero');
        }
        if (!data['autoFactura']['nombre']) {
            this.errors.push('Debe especificar el Nombre del Vendedor en data.autoFactura.nombre');
        }
        if (!data['autoFactura']['direccion']) {
            this.errors.push('Debe especificar la Dirección del Vendedor en data.autoFactura.direccion');
        }
        if (!data['autoFactura']['numeroCasa']) {
            this.errors.push('Debe especificar el Número de Casa del Vendedor en data.autoFactura.numeroCasa');
        }
        let errorDepDisCiu = false;
        let errorDepDisCiuUbi = false;
        if (!data['autoFactura']['ciudad']) {
            this.errors.push('Debe especificar la Ciudad del Vendedor en data.autoFactura.ciudad');
            errorDepDisCiu = true;
        }
        else {
            if (constants_service_1.default.ciudades.filter((ciudad) => ciudad.codigo === +data['autoFactura']['ciudad']).length == 0) {
                this.errors.push("Ciudad '" +
                    data['autoFactura']['ciudad'] +
                    "' del Cliente en data.autoFactura.ciudad no encontrado. Valores: " +
                    constants_service_1.default.ciudades.map((a) => a.codigo + '-' + a.descripcion));
                errorDepDisCiu = true;
            }
            //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
            //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
            //data['autoFactura']['ciudad']['distrito'] y data['autoFactura']['ciudad']['departamento']
            let objCiudad = constants_service_1.default.ciudades.filter((ciu) => ciu.codigo === +data['autoFactura']['ciudad']);
            if (objCiudad && objCiudad[0]) {
                let objDistrito = constants_service_1.default.distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);
                let objDepartamento = constants_service_1.default.departamentos.filter((dep) => dep.codigo === +objDistrito[0]['departamento']);
                //Solo actualiza si no tiene valor
                if (!data['autoFactura']['distrito'])
                    data['autoFactura']['distrito'] = objDistrito[0]['codigo'];
                if (!data['autoFactura']['departamento'])
                    data['autoFactura']['departamento'] = objDepartamento[0]['codigo'];
            }
            if (errorDepDisCiu) {
                if (!data['autoFactura']['departamento']) {
                    this.errors.push('Debe especificar el Departamento del Vendedor en data.autoFactura.departamento');
                    errorDepDisCiu = true;
                }
                if (!data['autoFactura']['distrito']) {
                    this.errors.push('Debe especificar el Distrito Vendedor en data.autoFactura.distrito');
                    errorDepDisCiu = true;
                }
            }
        }
        if (!data['autoFactura']['ubicacion']['ciudad']) {
            this.errors.push('Debe especificar la Ciudad del Lugar de la Transacción en data.autoFactura.ubicacion.ciudad');
            errorDepDisCiuUbi = true;
        }
        else {
            if (constants_service_1.default.ciudades.filter((ciudad) => ciudad.codigo === +data['autoFactura']['ubicacion']['ciudad'])
                .length == 0) {
                this.errors.push("Ciudad '" +
                    data['autoFactura']['ubicacion']['ciudad'] +
                    "' del Cliente en data.autoFactura.ubicacion.ciudad no encontrado. Valores: " +
                    constants_service_1.default.ciudades.map((a) => a.codigo + '-' + a.descripcion));
                errorDepDisCiuUbi = true;
            }
            //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
            //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
            //data['autoFactura']['ubicacion']['ciudad']['distrito'] y data['autoFactura']['ubicacion']['ciudad']['departamento']
            let objCiudad = constants_service_1.default.ciudades.filter((ciu) => ciu.codigo === +data['autoFactura']['ubicacion']['ciudad']);
            if (objCiudad && objCiudad[0]) {
                let objDistrito = constants_service_1.default.distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);
                let objDepartamento = constants_service_1.default.departamentos.filter((dep) => dep.codigo === +objDistrito[0]['departamento']);
                //Solo actualiza si no tiene valor
                if (!data['autoFactura']['ubicacion']['distrito'])
                    data['autoFactura']['ubicacion']['distrito'] = objDistrito[0]['codigo'];
                if (!data['autoFactura']['ubicacion']['departamento'])
                    data['autoFactura']['ubicacion']['departamento'] = objDepartamento[0]['codigo'];
            }
            if (errorDepDisCiuUbi) {
                if (!data['autoFactura']['ubicacion']['departamento']) {
                    this.errors.push('Debe especificar el Departamento del Lugar de la Transacción en data.autoFactura.ubicacion.departamento');
                    errorDepDisCiuUbi = true;
                }
                if (!data['autoFactura']['ubicacion']['distrito']) {
                    this.errors.push('Debe especificar el Distrito del Lugar de la Transacciónen data.autoFactura.ubicacion.distrito');
                    errorDepDisCiuUbi = true;
                }
            }
        }
        if (errorDepDisCiu) {
            constants_service_1.default.validateDepartamentoDistritoCiudad('data.autoFactura', +data['autoFactura']['departamento'], +data['autoFactura']['distrito'], +data['autoFactura']['ciudad'], this.errors);
        }
        if (errorDepDisCiuUbi) {
            constants_service_1.default.validateDepartamentoDistritoCiudad('data.autoFactura.ubicacion', +data['autoFactura']['ubicacion']['departamento'], +data['autoFactura']['ubicacion']['distrito'], +data['autoFactura']['ubicacion']['ciudad'], this.errors);
        }
    }
    generateDatosEspecificosPorTipoDE_NotaCreditoDebitoValidate(params, data) {
        if (!(data['notaCreditoDebito'] && data['notaCreditoDebito']['motivo'])) {
            this.errors.push('Debe completar el motivo para la nota de crédito/débito en data.notaCreditoDebito.motivo');
        }
        else {
            if (constants_service_1.default.notasCreditosMotivos.filter((um) => um.codigo === +data['notaCreditoDebito']['motivo'])
                .length == 0) {
                this.errors.push("Motivo de la Nota de Crédito/Débito '" +
                    data['notaCreditoDebito']['motivo'] +
                    "' en data.notaCreditoDebito.motivo no encontrado. Valores: " +
                    constants_service_1.default.notasCreditosMotivos.map((a) => a.codigo + '-' + a.descripcion));
            }
        }
    }
    generateDatosEspecificosPorTipoDE_RemisionElectronicaValidate(params, data) {
        if (!(data['remision'] && data['remision']['motivo'])) {
            this.errors.push('No fue pasado el Motivo de la Remisión en data.remision.motivo.');
        }
        else {
            if (+data['remision']['motivo'] == 99) {
                if (!(data['remision'] && data['remision']['motivoDescripcion'])) {
                    this.errors.push('Debe especificar la Descripción el Motivo de la Remisión en data.remision.motivoDescripcion para el motivo=99.');
                }
            }
            if (constants_service_1.default.remisionesMotivos.filter((um) => um.codigo === +data['remision']['motivo']).length == 0) {
                this.errors.push("Motivo de la Remisión '" +
                    data['remision']['motivo'] +
                    "' en data.remision.motivo no encontrado. Valores: " +
                    constants_service_1.default.remisionesMotivos.map((a) => a.codigo + '-' + a.descripcion));
            }
        }
        if (!(data['remision'] && data['remision']['tipoResponsable'])) {
            this.errors.push('No fue pasado el Tipo de Responsable de la Remisión en data.remision.tipoResponsable.');
        }
        if (!data['remision']['kms']) {
            //analizar por que se puso
            this.errors.push('Debe especificar Kilometros estimado recorrido en data.remision.kms');
        }
        if (data['remision'] && data['remision']['motivo'] == 7) {
            //Motivo=7-Translado entre locales
            if (data['cliente']['ruc'] != params['ruc']) {
                this.errors.push('RUC del receptor debe coincidir con el RUC del emisor');
            }
        }
        if (constants_service_1.default.remisionesResponsables.filter((um) => um.codigo === data['remision']['tipoResponsable'])
            .length == 0) {
            this.errors.push("Tipo de Responsable '" +
                data['remision']['tipoResponsable'] +
                "' en data.remision.tipoResponsable no encontrado. Valores: " +
                constants_service_1.default.remisionesResponsables.map((a) => a.codigo + '-' + a.descripcion));
        }
    }
    generateDatosAutofacturaValidate(params, data) {
        if (!data['autoFactura']) {
            this.errors.push('Debe especificar los datos de Autofactura en data.autoFactura para el Tipo de Documento = 4');
            return;
        }
        if (!data['autoFactura']['documentoNumero']) {
            this.errors.push('Debe especificar el Documento del Vendedor para la AutoFactura en data.autoFactura.documentoNumero');
        }
        else {
            if (!((data['autoFactura']['documentoNumero'] + '').length >= 1 &&
                (data['autoFactura']['documentoNumero'] + '').length <= 20)) {
                this.errors.push('El Numero de Documento del Vendedor en data.autoFactura.numeroDocuemnto debe contener entre 1 y 20 caracteres ');
            }
            if (new RegExp(/[a-zA-Z]/g).test(data['autoFactura']['documentoNumero']) ||
                new RegExp(/\./g).test(data['autoFactura']['documentoNumero'])) {
                this.errors.push('El Numero de Documento del Vendedor "' +
                    data['autoFactura']['documentoNumero'] +
                    '" en data.autoFactura.numeroDocuemnto no puede contener Letras ni puntos');
            }
        }
        if (!data['documentoAsociado']) {
            this.errors.push('Debe indicar el Documento Asociado en data.documentoAsociado para el Tipo de Documento = 4');
        }
        else {
            if (Array.isArray(data['documentoAsociado'])) {
                this.validateAsociadoConstancia(params, data['documentoAsociado'][0], true);
            }
            else {
                this.validateAsociadoConstancia(params, data['documentoAsociado'], false);
            }
            if (data['cliente']['contribuyente'] == false) {
                this.errors.push('El Cliente de una Autofactura debe ser Contribuyente en data.cliente.contribuyente');
            }
        }
    }
    validateAsociadoConstancia(params, documentoAsociado, isArray) {
        if (!(documentoAsociado['constanciaControl'] && documentoAsociado['constanciaControl'].length > 0)) {
            this.errors.push('Debe indicar el Número de Control de la Constancia en data.documentoAsociado.constanciaControl. ' +
                (isArray ? 'En la posicion 0' : ''));
        }
        else {
            if ((documentoAsociado['constanciaControl'] + '').length != 8) {
                this.errors.push('El Numero de Control de la Constancia "' +
                    documentoAsociado['constanciaControl'] +
                    '" en data.documentoAsociado.constanciaControl debe contener 8 caracteres. ' +
                    (isArray ? 'En la posicion 0' : ''));
            }
        }
        if (!(documentoAsociado['constanciaNumero'] && (documentoAsociado['constanciaNumero'] + '').length > 0)) {
            this.errors.push('Debe indicar el Numero de la Constancia en data.documentoAsociado.constanciaNumero. ' +
                (isArray ? 'En la posicion 0' : ''));
        }
        else {
            if (isNaN(documentoAsociado['constanciaNumero'])) {
                this.errors.push('El Numero de la Constancia "' +
                    documentoAsociado['constanciaNumero'] +
                    '" en data.documentoAsociado.constanciaNumero debe ser numérico. ' +
                    (isArray ? 'En la posicion 0' : ''));
            }
            if ((documentoAsociado['constanciaNumero'] + '').length != 11) {
                this.errors.push('El Numero de la Constancia "' +
                    documentoAsociado['constanciaNumero'] +
                    '" en data.documentoAsociado.constanciaNumero debe contener 11 caracteres. ' +
                    (isArray ? 'En la posicion 0' : ''));
            }
        }
    }
    generateDatosCondicionOperacionDEValidate(params, data) {
        const items = data['items'];
        let sumaSubtotales = 0;
        if (true) {
            if (!data['condicion']) {
                this.errors.push('Debe indicar los datos de la Condición de la Operación en data.condicion');
                return; // sale metodo
            }
            else {
                if (constants_service_1.default.condicionesOperaciones.filter((um) => um.codigo === data['condicion']['tipo']).length ==
                    0) {
                    this.errors.push("Condición de la Operación '" +
                        data['condicion']['tipo'] +
                        "' en data.condicion.tipo no encontrado. Valores: " +
                        constants_service_1.default.condicionesOperaciones.map((a) => a.codigo + '-' + a.descripcion));
                }
                this.generateDatosCondicionOperacionDE_ContadoValidate(params, data);
                if (data['condicion']['tipo'] === 2) {
                    this.generateDatosCondicionOperacionDE_CreditoValidate(params, data);
                }
            }
        }
    }
    /**
     * E7.1. Campos que describen la forma de pago de la operación al contado o del monto
     * de la entrega inicial (E605-E619)
     * @param params
     * @param data
     * @param options
     */
    generateDatosCondicionOperacionDE_ContadoValidate(params, data) {
        if (data['condicion']['tipo'] === 1) {
            if (!(data['condicion']['entregas'] && data['condicion']['entregas'].length > 0)) {
                this.errors.push('El Tipo de Condición es 1 en data.condicion.tipo pero no se encontraron entregas en data.condicion.entregas');
            }
        }
        if (data['condicion']['entregas'] && data['condicion']['entregas'].length > 0) {
            for (let i = 0; i < data['condicion']['entregas'].length; i++) {
                const dataEntrega = data['condicion']['entregas'][i];
                if (constants_service_1.default.condicionesTiposPagos.filter((um) => um.codigo === dataEntrega['tipo']).length == 0) {
                    this.errors.push("Condición de Tipo de Pago '" +
                        dataEntrega['tipo'] +
                        "' en data.condicion.entregas[" +
                        i +
                        '].tipo no encontrado. Valores: ' +
                        constants_service_1.default.condicionesTiposPagos.map((a) => a.codigo + '-' + a.descripcion));
                }
                if (dataEntrega['tipo'] == 99 && !dataEntrega['tipoDescripcion']) {
                    this.errors.push('Es obligatorio especificar la Descripción en data.condicion.entregas[' +
                        i +
                        '].tipoDescripcion para el tipo=99');
                }
                else if (dataEntrega['tipo'] == 99) {
                    if (!((dataEntrega['tipoDescripcion'] + '').length >= 4 && (dataEntrega['tipoDescripcion'] + '').length <= 30)) {
                        this.errors.push('La Descripción del Tipo de Entrega en data.condicion.entregas[' +
                            i +
                            '].tipoDescripcion debe tener de 4 a 30 caracteres, para el tipo=99');
                    }
                }
                if (!dataEntrega['moneda']) {
                    this.errors.push('Moneda es obligatorio en data.condicion.entregas[' + i + '].moneda');
                }
                if (constants_service_1.default.monedas.filter((um) => um.codigo === dataEntrega['moneda']).length == 0) {
                    this.errors.push("Moneda '" + dataEntrega['moneda']) +
                        "' data.condicion.entregas[" +
                        i +
                        '].moneda no válido. Valores: ' +
                        constants_service_1.default.monedas.map((a) => a.codigo + '-' + a.descripcion);
                }
                //Verificar si el Pago es con Tarjeta de crédito
                if (dataEntrega['tipo'] === 3 || dataEntrega['tipo'] === 4) {
                    if (!dataEntrega['infoTarjeta']) {
                        this.errors.push('Debe informar los datos de la tarjeta en data.condicion.entregas[' +
                            i +
                            '].infoTarjeta si la forma de Pago es a Tarjeta');
                    }
                    else {
                        if (!dataEntrega['infoTarjeta']['tipo']) {
                            this.errors.push('Debe especificar el tipo de tarjeta en data.condicion.entregas[' +
                                i +
                                '].infoTarjeta.tipo si la forma de Pago es a Tarjeta');
                        }
                        else {
                            if (constants_service_1.default.tarjetasCreditosTipos.filter((um) => um.codigo === dataEntrega['infoTarjeta']['tipo']).length == 0) {
                                this.errors.push("Tipo de Tarjeta '" +
                                    dataEntrega['infoTarjeta']['tipo'] +
                                    "' en data.condicion.entregas[" +
                                    i +
                                    '].infoTarjeta.tipo no encontrado. Valores: ' +
                                    constants_service_1.default.tarjetasCreditosTipos.map((a) => a.codigo + '-' + a.descripcion));
                            }
                            if (dataEntrega['infoTarjeta']['tipoDescripcion']) {
                                if (!((dataEntrega['infoTarjeta']['tipoDescripcion'] + '').length >= 4 &&
                                    (dataEntrega['infoTarjeta']['tipoDescripcion'] + '').length <= 20)) {
                                    this.errors.push('La descripción del Tipo de Tarjeta en data.condicion.entregas[' +
                                        i +
                                        '].infoTarjeta.tipoDescripcion debe tener de 4 a 20 caracteres');
                                }
                            }
                        }
                        if (dataEntrega['infoTarjeta']['ruc']) {
                            if (dataEntrega['infoTarjeta']['ruc'].indexOf('-') == -1) {
                                this.errors.push('RUC de Proveedor de Tarjeta debe contener digito verificador en data.condicion.entregas[' +
                                    i +
                                    '].infoTarjeta.ruc');
                            }
                            var regExpOnlyNumber = new RegExp(/^\d+$/);
                            const rucCliente = dataEntrega['infoTarjeta']['ruc'].split('-');
                            //Un RUC puede ser alphanumerico
                            /*if (!regExpOnlyNumber.test((rucCliente[0] + '').trim())) {
                              this.errors.push(
                                "La parte del RUC del Cliente '" +
                                  dataEntrega['infoTarjeta']['ruc'] +
                                  "' en data.condicion.entregas[" +
                                  i +
                                  '].infoTarjeta.ruc debe ser numérico',
                              );
                            }*/
                            if (!regExpOnlyNumber.test((rucCliente[1] + '').trim())) {
                                this.errors.push("La parte del DV del RUC del Cliente '" +
                                    dataEntrega['infoTarjeta']['ruc'] +
                                    "' en data.condicion.entregas[" +
                                    i +
                                    '].infoTarjeta.ruc debe ser numérico');
                            }
                            if (!(rucCliente[0].length >= 3 && rucCliente[0].length <= 8)) {
                                this.errors.push("La parte del RUC '" +
                                    dataEntrega['infoTarjeta']['ruc'] +
                                    "' en data.condicion.entregas[" +
                                    i +
                                    '].infoTarjeta.ruc debe contener de 1 a 8 caracteres');
                            }
                            if (rucCliente[1] > 9) {
                                this.errors.push("La parte del DV del RUC '" +
                                    dataEntrega['infoTarjeta']['ruc'] +
                                    "' en data.condicion.entregas[" +
                                    i +
                                    '].infoTarjeta.ruc debe ser del 1 al 9');
                            }
                        }
                        if (dataEntrega['infoTarjeta']['codigoAutorizacion']) {
                            if (!((dataEntrega['infoTarjeta']['codigoAutorizacion'] + '').length >= 6 &&
                                (dataEntrega['infoTarjeta']['codigoAutorizacion'] + '').length <= 10)) {
                                this.errors.push('El código de Autorización en data.condicion.entregas[' +
                                    i +
                                    '].infoTarjeta.codigoAutorizacion debe tener de 6 y 10 caracteres');
                            }
                        }
                        if (dataEntrega['infoTarjeta']['titular']) {
                            if (!((dataEntrega['infoTarjeta']['titular'] + '').length >= 4 &&
                                (dataEntrega['infoTarjeta']['titular'] + '').length <= 30)) {
                                this.errors.push('El Titular de la Tarjeta en data.condicion.entregas[' +
                                    i +
                                    '].infoTarjeta.titular debe tener de 4 y 30 caracteres');
                            }
                            //Validar que titular no tenga .
                            if (dataEntrega['infoTarjeta']['titular'].indexOf('.') > -1) {
                                this.errors.push('El valor "' +
                                    dataEntrega['infoTarjeta']['titular'] +
                                    '" en data.condicion.entregas[' +
                                    i +
                                    '].infoTarjeta.titular no es válido ');
                            }
                            //Validar que titular no tenga /
                            if (dataEntrega['infoTarjeta']['titular'].indexOf('/') > -1) {
                                this.errors.push('El valor "' +
                                    dataEntrega['infoTarjeta']['titular'] +
                                    '" en data.condicion.entregas[' +
                                    i +
                                    '].infoTarjeta.titular no es válido ');
                            }
                        }
                        if (dataEntrega['infoTarjeta']['numero']) {
                            if (!((dataEntrega['infoTarjeta']['numero'] + '').length == 4)) {
                                this.errors.push('El código de Autorización en data.condicion.entregas[' +
                                    i +
                                    '].infoTarjeta.numero debe tener de 4 caracteres');
                            }
                        }
                    }
                }
                //Verificar si el Pago es con Cheque
                if (dataEntrega['tipo'] === 2) {
                    if (!dataEntrega['infoCheque']) {
                        this.errors.push('Debe informar sobre el cheque en data.condicion.entregas[' +
                            i +
                            '].infoCheque si la forma de Pago es 2-Cheques');
                    }
                }
                if (dataEntrega['moneda'] !== 'PYG') {
                    if (!dataEntrega['cambio']) {
                        this.errors.push('Debe informar la cotizacion del monto de la Entrega en data.condicion.entregas[' +
                            i +
                            '].cambio si la forma de Pago es diferente a PYG');
                    }
                }
            }
        }
    }
    /**
     * E7.2. Campos que describen la operación a crédito (E640-E649)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosCondicionOperacionDE_CreditoValidate(params, data) {
        if (!data['condicion']['credito']) {
            this.errors.push('Fue especificado Condicion Tipo 2 (Crédito) pero el detalle de Crédito en data.condicion.credito es nulo');
        }
        else {
            if (!data['condicion']['credito']['tipo']) {
                this.errors.push('El tipo de Crédito en data.condicion.credito.tipo es obligatorio si la condición posee créditos');
            }
            else {
                if (constants_service_1.default.condicionesCreditosTipos.filter((um) => um.codigo === data['condicion']['credito']['tipo']).length == 0) {
                    this.errors.push("Tipo de Crédito '" +
                        data['condicion']['credito']['tipo'] +
                        "' en data.condicion.credito.tipo no encontrado. Valores: " +
                        constants_service_1.default.condicionesCreditosTipos.map((a) => a.codigo + '-' + a.descripcion));
                }
            }
            if (+data['condicion']['credito']['tipo'] === 1) {
                //Plazo
                if (!data['condicion']['credito']['plazo']) {
                    this.errors.push('El tipo de Crédito en data.condicion.credito.tipo es 1 entonces data.condicion.credito.plazo es obligatorio');
                }
                else {
                    if (!((data['condicion']['credito']['plazo'] + '').length >= 2 &&
                        (data['condicion']['credito']['plazo'] + '').length <= 15)) {
                        this.errors.push('El Plazo de Crédito en data.condicion.credito.plazo debe contener entre 2 y 15 caracteres ');
                    }
                }
            }
            if (+data['condicion']['credito']['tipo'] === 2) {
                //Cuota
                if (!data['condicion']['credito']['cuotas']) {
                    this.errors.push('El tipo de Crédito en data.condicion.credito.tipo es 2 entonces data.condicion.credito.cuotas es obligatorio');
                }
                else {
                }
                //Si es Cuotas
                //Recorrer array de infoCuotas e informar en el JSON
                if (data['condicion']['credito']['infoCuotas'] && data['condicion']['credito']['infoCuotas'].length > 0) {
                    for (let i = 0; i < data['condicion']['credito']['infoCuotas'].length; i++) {
                        const infoCuota = data['condicion']['credito']['infoCuotas'][i];
                        if (constants_service_1.default.monedas.filter((um) => um.codigo === infoCuota['moneda']).length == 0) {
                            this.errors.push("Moneda '" +
                                infoCuota['moneda'] +
                                "' en data.condicion.credito.infoCuotas[" +
                                i +
                                '].moneda no encontrado. Valores: ' +
                                constants_service_1.default.monedas.map((a) => a.codigo + '-' + a.descripcion));
                        }
                        if (!infoCuota['vencimiento']) {
                            //No es obligatorio
                            //this.errors.push('Obligatorio informar data.transporte.inicioEstimadoTranslado. Formato yyyy-MM-dd');
                        }
                        else {
                            if (!FechaUtil_service_1.default.isIsoDate(infoCuota['vencimiento'])) {
                                this.errors.push("Vencimiento de la Cuota '" +
                                    infoCuota['vencimiento'] +
                                    "' en data.condicion.credito.infoCuotas[" +
                                    i +
                                    '].vencimiento no válido. Formato: yyyy-MM-dd');
                            }
                        }
                    }
                }
                else {
                    this.errors.push('Debe proporcionar data.condicion.credito.infoCuotas[]');
                }
            }
        }
    }
    generateDatosComplementariosComercialesDeUsoEspecificosValidate(params, data) {
        if (data['sectorEnergiaElectrica']) {
            this.generateDatosSectorEnergiaElectricaValidate(params, data);
        }
        if (data['sectorSeguros']) {
            this.generateDatosSectorSegurosValidate(params, data);
        }
        if (data['sectorSupermercados']) {
            this.generateDatosSectorSupermercadosValidate(params, data);
        }
        if (data['sectorAdicional']) {
            this.generateDatosDatosAdicionalesUsoComercialValidate(params, data);
        }
    }
    /**
     * E9.2. Sector Energía Eléctrica (E791-E799)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosSectorEnergiaElectricaValidate(params, data) {
        /*const jsonResult: any = {
          dNroMed: data['sectorEnergiaElectrica']['numeroMedidor'],
          dActiv: data['sectorEnergiaElectrica']['codigoActividad'],
          dCateg: data['sectorEnergiaElectrica']['codigoCategoria'],
          dLecAnt: data['sectorEnergiaElectrica']['lecturaAnterior'],
          dLecAct: data['sectorEnergiaElectrica']['lecturaActual'],
          dConKwh: data['sectorEnergiaElectrica']['lecturaActual'] - data['sectorEnergiaElectrica']['lecturaAnterior'],
        };*/
        if (data['sectorEnergiaElectrica']['lecturaAnterior'] > data['sectorEnergiaElectrica']['lecturaActual']) {
            this.errors.push('Sector Energia Electrica lecturaActual debe ser mayor a lecturaAnterior');
        }
    }
    /**
     * E9.3. Sector de Seguros (E800-E809)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosSectorSegurosValidate(params, data) {
        /*const jsonResult: any = {
          dCodEmpSeg: data['sectorSeguros']['codigoAseguradora'],
          gGrupPolSeg: {
            dPoliza: data['sectorSeguros']['codigoPoliza'],
            dUnidVig: data['sectorSeguros']['vigenciaUnidad'], //horas, dias, año
            dVigencia: data['sectorSeguros']['vigencia'],
            dNumPoliza: data['sectorSeguros']['numeroPoliza'],
            dFecIniVig: data['sectorSeguros']['inicioVigencia'],
            dFecFinVig: data['sectorSeguros']['finVigencia'],
            dCodInt: data['sectorSeguros']['codigoInternoItem'],
          },
        };*/
    }
    /**
     * E9.4. Sector de Supermercados (E810-E819
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosSectorSupermercadosValidate(params, data) {
        /*const jsonResult: any = {
          dNomCaj: data['sectorSupermercados']['nombreCajero'],
          dEfectivo: data['sectorSupermercados']['efectivo'],
          dVuelto: data['sectorSupermercados']['vuelto'],
          dDonac: data['sectorSupermercados']['donacion'],
          dDesDonac: data['sectorSupermercados']['donacionDescripcion'].substring(0, 20),
        };*/
    }
    /**
     * E9.5. Grupo de datos adicionales de uso comercial (E820-E829)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosDatosAdicionalesUsoComercialValidate(params, data) {
        /*const jsonResult: any = {
          dCiclo: data['sectorAdicional']['ciclo'].substring(0, 15),
          dFecIniC: data['sectorAdicional']['inicioCiclo'],
          dFecFinC: data['sectorAdicional']['finCiclo'],
          dVencPag: data['sectorAdicional']['vencimientoPago'],
          dContrato: data['sectorAdicional']['numeroContrato'],
          dSalAnt: data['sectorAdicional']['saldoAnterior'],
        };*/
        if (data['sectorAdicional']['ciclo']) {
            if (!((data['sectorAdicional']['ciclo'] + '').length >= 1 && (data['sectorAdicional']['ciclo'] + '').length <= 15)) {
                this.errors.push('El Ciclo en data.sectorAdicional.ciclo debe contener entre 1 y 15 caracteres ');
            }
        }
        if (data['sectorAdicional']['inicioCiclo']) {
            if (!((data['sectorAdicional']['inicioCiclo'] + '').length == 10)) {
                this.errors.push('El Inicio de Ciclo en data.sectorAdicional.inicioCiclo debe contener 10 caracteres ');
            }
        }
        if (data['sectorAdicional']['finCiclo']) {
            if (!((data['sectorAdicional']['finCiclo'] + '').length == 10)) {
                this.errors.push('El Fin de Ciclo en data.sectorAdicional.finCiclo debe contener 10 caracteres ');
            }
        }
        if (data['sectorAdicional']['vencimientoPago']) {
            if (!((data['sectorAdicional']['vencimientoPago'] + '').length == 10)) {
                this.errors.push('La fecha de Pago en data.sectorAdicional.vencimientoPago debe contener 10 caracteres ');
            }
            let fecha = new Date(data.fecha);
            let fechaPago = new Date(data['sectorAdicional']['vencimientoPago']);
            if (fecha.getTime() > fechaPago.getTime()) {
                this.errors.push("La fecha de pago '" +
                    data['sectorAdicional']['vencimientoPago'] +
                    "' en data.sectorAdicional.vencimientoPago debe ser despues de la Fecha del Documento");
            }
        }
        if (data['sectorAdicional']['numeroContrato']) {
            if (!((data['sectorAdicional']['numeroContrato'] + '').length >= 1 &&
                (data['sectorAdicional']['numeroContrato'] + '').length <= 30)) {
                this.errors.push('El numero de Contrato en data.sectorAdicional.numeroContrato debe contener entre 1 y 30 caracteres ');
            }
        }
        if (data['sectorAdicional']['saldoAnterior']) {
            /*if ( ! ( (data['sectorAdicional']['saldoAnterior']+"").length >= 1 && (data['sectorAdicional']['saldoAnterior']+"").length <= 30 ) ) {
              this.errors.push("El numero de Contrato en data.sectorAdicional.saldoAnterior debe contener entre 1 y 30 caracteres ");
            }*/
        }
    }
    /**
     * E10. Campos que describen el transporte de las mercaderías (E900-E999)
     *
     * Aqui puede entrar si tipoDocumento = 1 (opcional) o tipoDocumento = 7 (obligatorio)
     * @param params
     * @param data
     * @param options
     */
    generateDatosTransporteValidate(params, data) {
        if (data['tipoDocumento'] == 7) {
            if (!(data['detalleTransporte'] && data['detalleTransporte']['tipo'] && data['detalleTransporte']['tipo'] > 0)) {
                this.errors.push('Obligatorio informar transporte.tipo');
            }
        }
        if (data['detalleTransporte'] && data['detalleTransporte']['condicionNegociacion']) {
            if (constants_service_1.default.condicionesNegociaciones.indexOf(data['detalleTransporte']['condicionNegociacion']) < -1) {
                this.errors.push('detalleTransporte.condicionNegociación (' +
                    data['detalleTransporte']['condicionNegociacion'] +
                    ') no válido');
            }
        }
        //Nuevas validaciones
        if (data['detalleTransporte'] && data['detalleTransporte']['paisDestino']) {
            if (constants_service_1.default.paises.filter((pais) => pais.codigo === data['detalleTransporte']['paisDestino']).length == 0) {
                this.errors.push("Pais '" +
                    data['detalleTransporte']['paisDestino'] +
                    "' en detalleTransporte.paisDestino no encontrado.");
            }
        }
        if (data['detalleTransporte'] && data['detalleTransporte']['transportista'] && data['detalleTransporte']['transportista']['pais']) {
            if (constants_service_1.default.paises.filter((pais) => pais.codigo === data['detalleTransporte']['transportista']['pais']).length == 0) {
                this.errors.push("Pais '" +
                    data['detalleTransporte']['transportista']['pais'] +
                    "' en detalleTransporte.transportista.pais no encontrado.");
            }
        }
        if (data['tipoDocumento'] == 7) {
            if (!data['detalleTransporte']['inicioEstimadoTranslado']) {
                this.errors.push('Obligatorio informar data.transporte.inicioEstimadoTranslado. Formato yyyy-MM-dd');
            }
            else {
                if (!FechaUtil_service_1.default.isIsoDate(data['detalleTransporte']['inicioEstimadoTranslado'])) {
                    this.errors.push("Valor de la Fecha '" +
                        data['detalleTransporte']['inicioEstimadoTranslado'] +
                        "' en data.transporte.inicioEstimadoTranslado no válido. Formato: yyyy-MM-dd");
                }
            }
        }
        if (data['tipoDocumento'] == 7) {
            if (!data['detalleTransporte']['finEstimadoTranslado']) {
                this.errors.push('Obligatorio informar data.transporte.finEstimadoTranslado. Formato yyyy-MM-dd');
            }
            else {
                if (!FechaUtil_service_1.default.isIsoDate(data['detalleTransporte']['finEstimadoTranslado'])) {
                    this.errors.push("Valor de la Fecha '" +
                        data['detalleTransporte']['finEstimadoTranslado'] +
                        "' en data.transporte.finEstimadoTranslado no válido. Formato: yyyy-MM-dd");
                }
            }
        }
        if (data['tipoDocumento'] == 7) {
            if (data['detalleTransporte']['inicioEstimadoTranslado'] && data['detalleTransporte']['finEstimadoTranslado']) {
                let fechaInicio = new Date(data['detalleTransporte']['inicioEstimadoTranslado']);
                let fechaFin = new Date(data['detalleTransporte']['finEstimadoTranslado']);
                let fechaHoy = new Date(new Date().toISOString().slice(0, -14));
                fechaHoy.setHours(0);
                fechaHoy.setMinutes(0);
                fechaHoy.setSeconds(0);
                fechaHoy.setMilliseconds(0);
            }
        }
        if (constants_service_1.default.tiposTransportes.filter((um) => um.codigo === data['detalleTransporte']['tipo']).length == 0) {
            this.errors.push("Tipo de Transporte '" +
                data['detalleTransporte']['tipo'] +
                "' en data.transporte.tipo no encontrado. Valores: " +
                constants_service_1.default.tiposTransportes.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (constants_service_1.default.modalidadesTransportes.filter((um) => um.codigo === data['detalleTransporte']['modalidad'])
            .length == 0) {
            this.errors.push("Modalidad de Transporte '" +
                data['detalleTransporte']['modalidad'] +
                "' en data.transporte.modalidad no encontrado. Valores: " +
                constants_service_1.default.modalidadesTransportes.map((a) => a.codigo + '-' + a.descripcion));
        }
        /*if (
          constanteService.condicionesNegociaciones.filter(
            (um) => um.codigo === data['detalleTransporte']['condicionNegociacion'],
          ).length == 0
        ) {
          this.errors.push(
            "Condición de Negociación '" +
              data['detalleTransporte']['condicionNegociacion'] +
              "' en data.transporte.condicionNegociacion no encontrado. Valores: " +
              constanteService.condicionesNegociaciones.map((a) => a.codigo + '-' + a.descripcion),
          );
        }*/
        if (data['detalleTransporte']['salida']) {
            this.generateDatosSalidaValidate(params, data);
        }
        if (data['detalleTransporte']['entrega']) {
            this.generateDatosEntregaValidate(params, data);
        }
        if (data['detalleTransporte']['vehiculo']) {
            this.generateDatosVehiculoValidate(params, data);
        }
        if (data['detalleTransporte']['transportista']) {
            this.generateDatosTransportistaValidate(params, data);
        }
    }
    /**
     * E10.1. Campos que identifican el local de salida de las mercaderías (E920-E939)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosSalidaValidate(params, data) {
        var regExpOnlyNumber = new RegExp(/^\d+$/);
        let errorDepDisCiu = false;
        if (!data['detalleTransporte']['salida']['ciudad']) {
            this.errors.push('Debe especificar la Ciudad del Local de Salida en data.transporte.salida.ciudad');
            errorDepDisCiu = true;
        }
        else {
            if (constants_service_1.default.ciudades.filter((ciudad) => ciudad.codigo === +data['detalleTransporte']['salida']['ciudad']).length == 0) {
                this.errors.push("Ciudad '" +
                    data['detalleTransporte']['salida']['ciudad'] +
                    "' del Cliente en data.transporte.salida.ciudad no encontrado. Valores: " +
                    constants_service_1.default.ciudades.map((a) => a.codigo + '-' + a.descripcion));
                errorDepDisCiu = true;
            }
            //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
            //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
            //data['detalleTransporte']['salida']['distrito'] y data['detalleTransporte']['salida']['departamento']
            let objCiudad = constants_service_1.default.ciudades.filter((ciu) => ciu.codigo === +data['detalleTransporte']['salida']['ciudad']);
            if (objCiudad && objCiudad[0]) {
                let objDistrito = constants_service_1.default.distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);
                let objDepartamento = constants_service_1.default.departamentos.filter((dep) => dep.codigo === +objDistrito[0]['departamento']);
                //Solo actualiza si no tiene valor
                if (!data['detalleTransporte']['salida']['distrito'])
                    data['detalleTransporte']['salida']['distrito'] = objDistrito[0]['codigo'];
                if (!data['detalleTransporte']['salida']['departamento'])
                    data['detalleTransporte']['salida']['departamento'] = objDepartamento[0]['codigo'];
            }
            if (!errorDepDisCiu) {
                if (!data['detalleTransporte']['salida']['departamento']) {
                    this.errors.push('Debe especificar el Departamento del Local de Salida en data.transporte.salida.departamento');
                    errorDepDisCiu = true;
                }
                if (!data['detalleTransporte']['salida']['distrito']) {
                    this.errors.push('Debe especificar el Distrito del Local de Salida en data.transporte.salida.distrito');
                    errorDepDisCiu = true;
                }
            }
        }
        if (!errorDepDisCiu) {
            constants_service_1.default.validateDepartamentoDistritoCiudad('data.transporte.salida', +data['detalleTransporte']['salida']['departamento'], +data['detalleTransporte']['salida']['distrito'], +data['detalleTransporte']['salida']['ciudad'], this.errors);
        }
        if (!data['detalleTransporte']['salida']['direccion']) {
            this.errors.push('Debe especificar la Dirección del Local de Salida en data.transporte.salida.direccion');
        }
        else {
            if (!(data['detalleTransporte']['salida']['direccion'].length >= 1 &&
                data['detalleTransporte']['salida']['direccion'].length <= 255)) {
                this.errors.push("Dirección del Local de Salida '" +
                    data['detalleTransporte']['salida']['direccion'] +
                    "' en data.transporte.salida.direccion debe tener una longitud de 1 a 255 caracteres");
            }
        }
        if (data['detalleTransporte']['salida']['numeroCasa'] == null) {
            this.errors.push('Debe especificar el Número de Casa del Local de Salida en data.transporte.salida.numeroCasa');
        }
        else {
            if (!((data['detalleTransporte']['salida']['numeroCasa'] + '').length > 0)) {
                this.errors.push('Debe especificar el Número de Casa del Local de Salida en data.transporte.salida.numeroCasa');
            }
            else {
                if (data['detalleTransporte']['salida']['numeroCasa']) {
                    if (!regExpOnlyNumber.test(data['detalleTransporte']['salida']['numeroCasa'])) {
                        this.errors.push('El Número de Casa en data.transporte.salida.numeroCasa debe ser numérico');
                    }
                }
                else {
                    if (!((data['detalleTransporte']['salida']['numeroCasa'] + '').length >= 1 &&
                        (data['detalleTransporte']['salida']['numeroCasa'] + '').length <= 6)) {
                        this.errors.push("Número de Casa del Local de Salida '" +
                            data['detalleTransporte']['salida']['numeroCasa'] +
                            "' en data.transporte.salida.numeroCasa debe tener una longitud de 1 a 6 caracteres");
                    }
                }
            }
        }
        /*if (!data['detalleTransporte']['salida']['numeroCasa']) {
          this.errors.push('Debe especificar el Número de Casa del Local de Salida en data.transporte.salida.numeroCasa');
        } else {
          if (
            !(
              (data['detalleTransporte']['salida']['numeroCasa'] + '').length >= 1 &&
              (data['detalleTransporte']['salida']['numeroCasa'] + '').length <= 6
            )
          ) {
            this.errors.push(
              "Número de Casa del Local de Salida '" +
                data['detalleTransporte']['salida']['numeroCasa'] +
                "' en data.transporte.salida.numeroCasa debe tener una longitud de 1 a 6 caracteres",
            );
          }
        }*/
    }
    /**
     * E10.2. Campos que identifican el local de entrega de las mercaderías (E940-E959)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosEntregaValidate(params, data) {
        var regExpOnlyNumber = new RegExp(/^\d+$/);
        let errorDepDisCiu = false;
        if (!data['detalleTransporte']['entrega']['ciudad']) {
            this.errors.push('Debe especificar la Ciudad del Local de Entrega en data.transporte.entrega.ciudad');
            errorDepDisCiu = true;
        }
        else {
            if (constants_service_1.default.ciudades.filter((ciudad) => ciudad.codigo === +data['detalleTransporte']['entrega']['ciudad']).length == 0) {
                this.errors.push("Ciudad '" +
                    data['detalleTransporte']['entrega']['ciudad'] +
                    "' del Cliente en data.transporte.entrega.ciudad no encontrado. Valores: " +
                    constants_service_1.default.ciudades.map((a) => a.codigo + '-' + a.descripcion));
                errorDepDisCiu = true;
            }
            //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
            //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
            //data['detalleTransporte']['entrega']['distrito'] y data['detalleTransporte']['entrega']['departamento']
            let objCiudad = constants_service_1.default.ciudades.filter((ciu) => ciu.codigo === +data['detalleTransporte']['entrega']['ciudad']);
            if (objCiudad && objCiudad[0]) {
                let objDistrito = constants_service_1.default.distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);
                let objDepartamento = constants_service_1.default.departamentos.filter((dep) => dep.codigo === +objDistrito[0]['departamento']);
                //Solo actualiza si no tiene valor
                if (!data['detalleTransporte']['entrega']['distrito'])
                    data['detalleTransporte']['entrega']['distrito'] = objDistrito[0]['codigo'];
                if (!data['detalleTransporte']['entrega']['departamento'])
                    data['detalleTransporte']['entrega']['departamento'] = objDepartamento[0]['codigo'];
            }
            if (!errorDepDisCiu) {
                if (!data['detalleTransporte']['entrega']['departamento']) {
                    this.errors.push('Debe especificar el Departamento del Local de Entrega en data.transporte.entrega.departamento');
                    errorDepDisCiu = true;
                }
                if (!data['detalleTransporte']['entrega']['distrito']) {
                    this.errors.push('Debe especificar el Distrito del Local de Entrega en data.transporte.entrega.distrito');
                    errorDepDisCiu = true;
                }
            }
        }
        if (!errorDepDisCiu) {
            constants_service_1.default.validateDepartamentoDistritoCiudad('data.transporte.entrega', +data['detalleTransporte']['entrega']['departamento'], +data['detalleTransporte']['entrega']['distrito'], +data['detalleTransporte']['entrega']['ciudad'], this.errors);
        }
        /*
          const jsonResult: any = {
            dDirLocEnt: data['detalleTransporte']['entrega']['direccion'],
            dNumCasEnt: data['detalleTransporte']['entrega']['numeroCasa'],
            dComp1Ent: data['detalleTransporte']['entrega']['complementoDireccion1'],
            dComp2Ent: data['detalleTransporte']['entrega']['complementoDireccion1'],
            cDepEnt: data['detalleTransporte']['entrega']['departamento'],
            dDesDepEnt: constanteService.departamentos.filter(
              (td) => td.codigo === data['detalleTransporte']['entrega']['departamento'],
            )[0]['descripcion'],
            cDisEnt: data['detalleTransporte']['entrega']['distrito'],
            dDesDisEnt: constanteService.distritos.filter(
              (td) => td.codigo === data['detalleTransporte']['entrega']['distrito'],
            )[0]['descripcion'],
            cCiuEnt: data['detalleTransporte']['entrega']['ciudad'],
            dDesCiuEnt: constanteService.ciudades.filter(
              (td) => td.codigo === data['detalleTransporte']['entrega']['ciudad'],
            )[0]['descripcion'],
            //dTelEnt : data['detalleTransporte']['entrega']['telefonoContacto'],
          };
        */
        if (!data['detalleTransporte']['entrega']['direccion']) {
            this.errors.push('Debe especificar la Dirección del Local de Entrega en data.transporte.entrega.direccion');
        }
        else {
            if (!(data['detalleTransporte']['entrega']['direccion'].length >= 1 &&
                data['detalleTransporte']['entrega']['direccion'].length <= 255)) {
                this.errors.push("Dirección del Local de Entrega '" +
                    data['detalleTransporte']['entrega']['direccion'] +
                    "' en data.transporte.entrega.direccion debe tener una longitud de 1 a 255 caracteres");
            }
        }
        if (data['detalleTransporte']['entrega']['numeroCasa'] == null) {
            this.errors.push('Debe especificar el Número de Casa del Local de Entrega en data.transporte.entrega.numeroCasa');
        }
        else {
            if (!((data['detalleTransporte']['entrega']['numeroCasa'] + '').length > 0)) {
                this.errors.push('Debe especificar el Número de Casa del Local de Entrega en data.transporte.entrega.numeroCasa');
            }
            else {
                if (data['detalleTransporte']['entrega']['numeroCasa']) {
                    if (!regExpOnlyNumber.test(data['detalleTransporte']['entrega']['numeroCasa'])) {
                        this.errors.push('El Número de Casa en data.transporte.entrega.numeroCasa debe ser numérico');
                    }
                }
                else {
                    if (!((data['detalleTransporte']['entrega']['numeroCasa'] + '').length >= 1 &&
                        (data['detalleTransporte']['entrega']['numeroCasa'] + '').length <= 6)) {
                        this.errors.push("Número de Casa del Local de Entrega '" +
                            data['detalleTransporte']['entrega']['numeroCasa'] +
                            "' en data.transporte.entrega.numeroCasa debe tener una longitud de 1 a 6 caracteres");
                    }
                }
            }
        }
        /*if (!data['detalleTransporte']['entrega']['numeroCasa']) {
          this.errors.push('Debe especificar el Número de Casa del Local de Entrega en data.transporte.entrega.numeroCasa');
        } else {
          if (
            !(
              data['detalleTransporte']['entrega']['numeroCasa'].length >= 1 &&
              data['detalleTransporte']['entrega']['numeroCasa'].length <= 255
            )
          ) {
            this.errors.push(
              "Número de Casa del Local de Entrega '" +
                data['detalleTransporte']['entrega']['numeroCasa'] +
                "' en data.transporte.entrega.numeroCasa debe tener una longitud de 1 a 255 caracteres",
            );
          }
        }*/
    }
    /**
         * E10.3. Campos que identifican el vehículo de traslado de mercaderías (E960-E979)
    
         *
         * @param params
         * @param data
         * @param options
         * @param items Es el item actual del array de items de "data" que se está iterando
         */
    generateDatosVehiculoValidate(params, data) {
        if (!(data['detalleTransporte'] && data['detalleTransporte']['vehiculo'])) {
            this.errors.push('Los datos del Vehiculo en data.transporte.vehiculo no fueron informados');
        }
        else {
            if (!data['detalleTransporte']['vehiculo']['tipo']) {
                this.errors.push('El tipo de Vehiculo en data.transporte.vehiculo.tipo no fue informado');
            }
            else {
                if (!(data['detalleTransporte']['vehiculo']['tipo'].length >= 4 &&
                    data['detalleTransporte']['vehiculo']['tipo'].length <= 10)) {
                    this.errors.push("Tipo de Vehiculo '" +
                        data['detalleTransporte']['vehiculo']['tipo'] +
                        "' en data.transporte.vehiculo.tipo debe tener una longitud de 4 a 10 caracteres ");
                }
            }
            if (!data['detalleTransporte']['vehiculo']['documentoTipo']) {
                this.errors.push('El Tipo de Documento del Vehiculo en data.transporte.vehiculo.documentoTipo no fue informado');
            }
            else {
                if (+data['detalleTransporte']['vehiculo']['documentoTipo'] == 1) {
                    if (!data['detalleTransporte']['vehiculo']['documentoNumero']) {
                        this.errors.push('El numero de identificacion del Vehiculo en data.transporte.vehiculo.documentoNumero no fue informado');
                    }
                    else {
                        if (!(data['detalleTransporte']['vehiculo']['documentoNumero'].length >= 1 &&
                            data['detalleTransporte']['vehiculo']['documentoNumero'].length <= 20)) {
                            this.errors.push("Número de Identificacion del Vehiculo '" +
                                data['detalleTransporte']['vehiculo']['documentoNumero'] +
                                "' en data.transporte.vehiculo.documentoNumero debe tener una longitud de 1 a 20 caracteres ");
                        }
                    }
                }
                if (+data['detalleTransporte']['vehiculo']['documentoTipo'] == 2) {
                    if (!data['detalleTransporte']['vehiculo']['numeroMatricula']) {
                        this.errors.push('El numero de matricula del Vehiculo en data.transporte.vehiculo.numeroMatricula no fue informado');
                    }
                    else {
                        if (!(data['detalleTransporte']['vehiculo']['numeroMatricula'].length >= 6 &&
                            data['detalleTransporte']['vehiculo']['numeroMatricula'].length <= 7)) {
                            this.errors.push("Número de Matricula '" +
                                data['detalleTransporte']['vehiculo']['numeroMatricula'] +
                                "' en data.transporte.vehiculo.numeroMatricula debe tener una longitud de 6 a 7 caracteres ");
                        }
                    }
                }
            }
        }
        if (!data['detalleTransporte']['vehiculo']['marca']) {
            this.errors.push('La marca del Vehiculo en data.transporte.vehiculo.marca no fue informado');
        }
        else {
            if (!(data['detalleTransporte']['vehiculo']['marca'].length >= 1 &&
                data['detalleTransporte']['vehiculo']['marca'].length <= 10)) {
                this.errors.push("Marca del Vehiculo '" +
                    data['detalleTransporte']['vehiculo']['marca'] +
                    "' en data.transporte.vehiculo.marca debe tener una longitud de 1 a 10 caracteres");
            }
        }
    }
    /**
     * E10.4. Campos que identifican al transportista (persona física o jurídica) (E980-E999)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosTransportistaValidate(params, data) {
        let errorEsContribuyente = false;
        if (data['detalleTransporte']['transportista']) {
            if (typeof data['detalleTransporte']['transportista']['contribuyente'] == 'undefined') {
                this.errors.push('Debe indicar si el Transportista es o no un Contribuyente true|false en data.transporte.transportista.contribuyente');
                errorEsContribuyente = true;
            }
            if (typeof data['detalleTransporte']['transportista']['contribuyente'] == 'undefined') {
                this.errors.push('Debe indicar si el Transportista es o no un Contribuyente true|false en data.transporte.transportista.contribuyente');
                errorEsContribuyente = true;
            }
            if (!(data['detalleTransporte']['transportista']['contribuyente'] === true ||
                data['detalleTransporte']['transportista']['contribuyente'] === false)) {
                this.errors.push('data.transporte.transportista.contribuyente debe ser true|false');
                errorEsContribuyente = true;
            }
        }
        if (!errorEsContribuyente) {
            if (data['detalleTransporte'] &&
                data['detalleTransporte']['transportista'] &&
                data['detalleTransporte']['transportista']['contribuyente'] === true) {
                if (!(data['detalleTransporte'] &&
                    data['detalleTransporte']['transportista'] &&
                    data['detalleTransporte']['transportista']['ruc'])) {
                    this.errors.push('Debe especificar el RUC para el Transportista en data.transporte.transportista.ruc');
                }
                else {
                    if (data['detalleTransporte']['transportista']['ruc'].indexOf('-') == -1) {
                        console.log('agregar error');
                        this.errors.push('RUC debe contener dígito verificador en data.transporte.transportista.ruc');
                    }
                    var regExpOnlyNumber = new RegExp(/^\d+$/);
                    const rucCliente = data['detalleTransporte']['transportista']['ruc'].split('-');
                    //Un RUC puede ser alphanumerico
                    /*if (!regExpOnlyNumber.test((rucCliente[0] + '').trim())) {
                      this.errors.push(
                        "La parte del RUC del Cliente '" +
                          data['detalleTransporte']['transportista']['ruc'] +
                          "' en data.transporte.transportista.ruc debe ser numérico",
                      );
                    }*/
                    if (!regExpOnlyNumber.test((rucCliente[1] + '').trim())) {
                        this.errors.push("La parte del DV del RUC del Cliente '" +
                            data['detalleTransporte']['transportista']['ruc'] +
                            "' en data.transporte.transportista.ruc debe ser numérico");
                    }
                    if (!(rucCliente[0].length >= 3 && rucCliente[0].length <= 8)) {
                        this.errors.push("La parte del RUC '" +
                            data['detalleTransporte']['transportista']['ruc'] +
                            "' en data.transporte.transportista.ruc debe contener de 1 a 8 caracteres");
                    }
                    if (rucCliente[1] > 9) {
                        this.errors.push("La parte del DV del RUC '" +
                            data['detalleTransporte']['transportista']['ruc'] +
                            "' data.transporte.transportista.ruc debe ser del 1 al 9");
                    }
                }
            }
            else {
                //No es contribuyente
                if (!data['detalleTransporte']['transportista']['documentoTipo']) {
                    this.errors.push('Debe especificar el Tipo de Documento en data.transporte.transportista.documentoTipo');
                }
                else {
                    if (constants_service_1.default.tiposDocumentosIdentidades.filter((um) => um.codigo === data['detalleTransporte']['transportista']['documentoTipo']).length == 0) {
                        this.errors.push("Tipo de Documento '" +
                            data['detalleTransporte']['transportista']['documentoTipo'] +
                            "' en data.transporte.transportista.documentoTipo no encontrado. Valores: " +
                            constants_service_1.default.tiposDocumentosIdentidades.map((a) => a.codigo + '-' + a.descripcion));
                    }
                }
                if (!data['detalleTransporte']['transportista']['documentoNumero']) {
                    this.errors.push('Es obligatorio especificar el Número de Documento la Empresa transportista en data.transporte.transportista.documentoNumero');
                }
            }
        }
        //Datos obligatorios que no dependen de si es o no contribuyente
        if (!data['detalleTransporte']['transportista']['direccion']) {
            this.errors.push('Es obligatorio especificar la dirección de la Empresa transportista en data.transporte.transportista.direccion');
        }
        else {
            //Validar longitud
            if (!(data['detalleTransporte']['transportista']['direccion'].length >= 1 &&
                data['detalleTransporte']['transportista']['direccion'].length <= 150)) {
                this.errors.push('La direccion de la Empresa Transportista (' +
                    data['detalleTransporte']['transportista']['direccion'] +
                    ') en data.transporte.transportista.direccion debe tener una longitud de 1 a 150 caracteres');
            }
        }
        //Chofer - Obligatorio
        if (!(data['detalleTransporte'] &&
            data['detalleTransporte']['transportista'] &&
            data['detalleTransporte']['transportista']['chofer'])) {
            this.errors.push('Es obligatorio especificar los datos del chofer en data.transporte.transportista.chofer');
        }
        else {
            //Valida los datos del chofer
            if (!data['detalleTransporte']['transportista']['chofer']['documentoNumero']) {
                this.errors.push('Es obligatorio especificar el nombre del chofer en data.transporte.transportista.chofer.documentoNumero');
            }
            else {
                //Validar longitud
                if (!(data['detalleTransporte']['transportista']['chofer']['documentoNumero'].length >= 1 &&
                    data['detalleTransporte']['transportista']['chofer']['documentoNumero'].length <= 20)) {
                    this.errors.push('El número de documento del Chofer (' +
                        data['detalleTransporte']['transportista']['chofer']['documentoNumero'] +
                        ') en data.transporte.transportista.chofer.documentoNumero debe tener una longitud de 1 a 20 caracteres');
                }
                //Validar si tiene puntos
                if ((data['detalleTransporte']['transportista']['chofer']['documentoNumero'] + '').includes('.')) {
                    this.errors.push('El número de documento del Chofer (' +
                        data['detalleTransporte']['transportista']['chofer']['documentoNumero'] +
                        ') en data.transporte.transportista.chofer.documentoNumero debe estar sin puntos');
                }
            }
            if (!data['detalleTransporte']['transportista']['chofer']['nombre']) {
                this.errors.push('Es obligatorio especificar el nombre del chofer en data.transporte.transportista.chofer.nombre');
            }
            else {
                //Validar longitud
                if (!(data['detalleTransporte']['transportista']['chofer']['nombre'].length >= 4 &&
                    data['detalleTransporte']['transportista']['chofer']['nombre'].length <= 60)) {
                    this.errors.push('El nombre del Chofer (' +
                        data['detalleTransporte']['transportista']['chofer']['nombre'] +
                        ') en data.transporte.transportista.chofer.nombre debe tener una longitud de 4 a 60 caracteres');
                }
            }
            if (!data['detalleTransporte']['transportista']['chofer']['direccion']) {
                this.errors.push('Es obligatorio especificar la dirección del chofer en data.transporte.transportista.chofer.direccion');
            }
            else {
                //Validar longitud
                if (!(data['detalleTransporte']['transportista']['chofer']['direccion'].length >= 4 &&
                    data['detalleTransporte']['transportista']['chofer']['direccion'].length <= 60)) {
                    this.errors.push('La direccion del Chofer (' +
                        data['detalleTransporte']['transportista']['chofer']['direccion'] +
                        ') en data.transporte.transportista.chofer.direccion debe tener una longitud de 4 a 60 caracteres');
                }
            }
        }
        if (data['detalleTransporte'] &&
            data['detalleTransporte']['transportista'] &&
            data['detalleTransporte']['transportista']['agente'] &&
            data['detalleTransporte']['transportista']['agente']['ruc']) {
            if (data['detalleTransporte']['transportista']['agente']['ruc'].indexOf('-') == -1) {
                this.errors.push('RUC debe contener dígito verificador en data.transporte.transportista.agente.ruc');
            }
            var regExpOnlyNumber = new RegExp(/^\d+$/);
            const rucCliente = data['detalleTransporte']['transportista']['agente']['ruc'].split('-');
            //Un RUC puede ser alphanumerico
            /*if (!regExpOnlyNumber.test((rucCliente[0] + '').trim())) {
              this.errors.push(
                "La parte del RUC del Cliente '" +
                  data['detalleTransporte']['transportista']['agente']['ruc'] +
                  "' en data.transporte.transportista.agente.ruc debe ser numérico",
              );
            }*/
            if (!regExpOnlyNumber.test((rucCliente[1] + '').trim())) {
                this.errors.push("La parte del DV del RUC del Cliente '" +
                    data['detalleTransporte']['transportista']['agente']['ruc'] +
                    "' en data.transporte.transportista.agente.ruc debe ser numérico");
            }
            if (!(rucCliente[0].length >= 3 && rucCliente[0].length <= 8)) {
                this.errors.push("La parte del RUC '" +
                    data['detalleTransporte']['transportista']['agente']['ruc'] +
                    "' en data.transporte.transportista.agente.ruc debe contener de 3 a 8 caracteres");
            }
            if (rucCliente[1] > 9) {
                this.errors.push("La parte del DV del RUC '" +
                    data['detalleTransporte']['transportista']['agente']['ruc'] +
                    "' data.transporte.transportista.agente.ruc debe ser del 1 al 9");
            }
        }
        if (data['detalleTransporte']['transportista'] && data['detalleTransporte']['transportista']['pais']) {
            if (constants_service_1.default.paises.filter((pais) => pais.codigo === data['detalleTransporte']['transportista']['pais']).length == 0) {
                this.errors.push("Pais '" +
                    data['detalleTransporte']['transportista']['pais'] +
                    "' del Cliente en data.transporte.transportista.pais no encontrado.");
            }
        }
    }
    generateDatosTotalesValidate(params, data, config) {
        /*let temporalTotal = jsonDteTotales.generateDatosTotales(params, data, data.items, config);
        console.log("temporalTotal", temporalTotal);
    
        if (data.descuentoGlobal > 0) {
          console.log("temporalTotal", data.descuentoGlobal);
        }*/
        var _a, _b, _c, _d;
        if (data['moneda'] != 'PYG' && data['condicionTipoCambio'] == 1) {
            if (!data['cambio']) {
                this.errors.push('Debe especificar el valor del Cambio en data.cambio cuando moneda != PYG y la Cotización es Global');
            }
        }
        if (data.moneda == 'PYG') {
            if (((_a = (data['descuentoGlobal'] + '').split('.')[1]) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                this.errors.push('El Descuento Global "' +
                    data['descuentoGlobal'] +
                    '" en "PYG" en data.descuentoGlobal, no puede contener decimales');
            }
        }
        else {
            if (((_b = (data['descuentoGlobal'] + '').split('.')[1]) === null || _b === void 0 ? void 0 : _b.length) > 8) {
                this.errors.push('El Descuento Global "' +
                    data['descuentoGlobal'] +
                    '" en data.descuentoGlobal, no puede contener mas de 8 decimales');
            }
        }
        if (data.moneda == 'PYG') {
            if (((_c = (data['anticipoGlobal'] + '').split('.')[1]) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                this.errors.push('El Anticipo Global "' +
                    data['anticipoGlobal'] +
                    '" en "PYG" en data.anticipoGlobal, no puede contener decimales');
            }
        }
        else {
            if (((_d = (data['anticipoGlobal'] + '').split('.')[1]) === null || _d === void 0 ? void 0 : _d.length) > 8) {
                this.errors.push('El Anticipo Global "' +
                    data['anticipoGlobal'] +
                    '" en data.anticipoGlobal, no puede contener mas de 8 decimales');
            }
        }
    }
    /**
     * G. Campos complementarios comerciales de uso general (G001-G049)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosComercialesUsoGeneralValidate(params, data) {
        const jsonResult = {
        //dOrdCompra : data['complementarios']['ordenCompra'],
        //dOrdVta : data['complementarios']['ordenVenta'],
        //dAsiento : data['complementarios']['numeroAsiento']
        };
        if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 7) {
            //Opcional si 1 o 7
            if ((data['complementarios'] &&
                data['complementarios']['carga'] &&
                data['complementarios']['carga']['volumenTotal']) ||
                (data['complementarios'] && data['complementarios']['carga'] && data['complementarios']['carga']['pesoTotal'])) {
                this.generateDatosCargaValidate(params, data);
            }
        }
    }
    /**
     * G1. Campos generales de la carga (G050 - G099)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosCargaValidate(params, data) {
        //TODO ALL
        /*const jsonResult: any = {
          cUniMedTotVol : data['complementarios']['carga']['unidadMedida'],
                dDesUniMedTotVol : data['complementarios']['carga']['ordenVenta'],
                dTotVolMerc : data['complementarios']['carga']['totalVolumenMercaderia'],
                cUniMedTotPes : data['complementarios']['carga']['numeroAsiento'],
                dDesUniMedTotPes : data['complementarios']['carga']['numeroAsiento'],
                dTotPesMerc : data['complementarios']['carga']['numeroAsiento'],
                iCarCarga : data['complementarios']['carga']['numeroAsiento'],
                dDesCarCarga : data['complementarios']['carga']['numeroAsiento'],
        };*/
        if (data['complementarios'] &&
            data['complementarios']['carga'] &&
            data['complementarios']['carga']['unidadMedidaVolumenTotal']) {
            if (constants_service_1.default.unidadesMedidas.filter((um) => um.codigo === +data['complementarios']['carga']['unidadMedidaVolumenTotal']).length == 0) {
                this.errors.push("Unidad de Medida '" +
                    data['complementarios']['carga']['unidadMedidaVolumenTotal'] +
                    "' en data.complementarios.carga.unidadMedidaVolumenTotal no válido. Valores: " +
                    constants_service_1.default.unidadesMedidas.map((a) => a.codigo + '-' + a.descripcion.trim()));
            }
        }
        if (data['complementarios'] &&
            data['complementarios']['carga'] &&
            data['complementarios']['carga']['unidadMedidaPesoTotal']) {
            if (constants_service_1.default.unidadesMedidas.filter((um) => um.codigo === +data['complementarios']['carga']['unidadMedidaPesoTotal']).length == 0) {
                this.errors.push("Unidad de Medida '" +
                    data['complementarios']['carga']['unidadMedidaPesoTotal'] +
                    "' en data.complementarios.carga.unidadMedidaPesoTotal no válido. Valores: " +
                    constants_service_1.default.unidadesMedidas.map((a) => a.codigo + '-' + a.descripcion.trim()));
            }
        }
        if (data['complementarios'] &&
            data['complementarios']['carga'] &&
            data['complementarios']['carga']['caracteristicaCarga']) {
            if (constants_service_1.default.caracteristicasCargas.filter((um) => um.codigo === +data['complementarios']['carga']['caracteristicaCarga']).length == 0) {
                this.errors.push("Característica de Carga '" +
                    data['complementarios']['carga']['caracteristicaCarga'] +
                    "' en data.complementarios.carga.caracteristicaCarga no válido. Valores: " +
                    constants_service_1.default.caracteristicasCargas.map((a) => a.codigo + '-' + a.descripcion));
            }
            if (data['complementarios']['carga']['caracteristicaCarga'] == 3) {
                if (!data['complementarios']['carga']['caracteristicaCargaDescripcion']) {
                    this.errors.push('Para data.complementarios.carga.caracteristicaCarga = 3 debe informar el campo data.complementarios.carga.caracteristicaCargaDescripcion');
                }
            }
        }
    }
    /**
     * H. Campos que identifican al documento asociado (H001-H049)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosDocumentoAsociadoValidate(params, dataDocumentoAsociado, data) {
        if (data['tipoTransaccion'] == 11 && !dataDocumentoAsociado['resolucionCreditoFiscal']) {
            this.errors.push('Obligatorio informar data.documentoAsociado.resolucionCreditoFiscal');
        }
        //Validaciones
        if (constants_service_1.default.tiposDocumentosAsociados.filter((um) => um.codigo === +dataDocumentoAsociado['formato'])
            .length == 0) {
            this.errors.push("Formato de Documento Asociado '" +
                dataDocumentoAsociado['formato'] +
                "' en data.documentoAsociado.formato no encontrado. Valores: " +
                constants_service_1.default.tiposDocumentosAsociados.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (dataDocumentoAsociado['tipo'] == 2) {
            if (constants_service_1.default.tiposDocumentosImpresos.filter((um) => um.codigo === dataDocumentoAsociado['tipoDocumentoImpreso']).length == 0) {
                this.errors.push("Tipo de Documento impreso '" +
                    dataDocumentoAsociado['tipoDocumentoImpreso'] +
                    "' en data.documentoAsociado.tipoDocumentoImpreso no encontrado. Valores: " +
                    constants_service_1.default.tiposDocumentosImpresos.map((a) => a.codigo + '-' + a.descripcion));
            }
        }
        if (dataDocumentoAsociado['formato'] == 1) {
            //H002 = Electronico
            if (!(dataDocumentoAsociado['cdc'] && dataDocumentoAsociado['cdc'].length >= 44)) {
                this.errors.push('Debe indicar el CDC asociado en data.documentoAsociado.cdc');
            }
            if (dataDocumentoAsociado['rucFusionado']) {
                if (!(dataDocumentoAsociado['rucFusionado'] >= 3 && dataDocumentoAsociado['rucFusionado'].length <= 8)) {
                    this.errors.push('El RUC fusionado debe estar entre 3 y 8 caracteres');
                }
            }
        }
        if (dataDocumentoAsociado['formato'] == 2) {
            //H002 = Impreso
            if (!dataDocumentoAsociado['timbrado']) {
                this.errors.push('Debe especificar el Timbrado del Documento impreso Asociado en data.documentoAsociado.timbrado');
            }
            if (!dataDocumentoAsociado['establecimiento']) {
                this.errors.push('Debe especificar el Establecimiento del Documento impreso Asociado en data.documentoAsociado.establecimiento');
            }
            if (!dataDocumentoAsociado['punto']) {
                this.errors.push('Debe especificar el Punto del Documento impreso Asociado en data.documentoAsociado.punto');
            }
            if (!dataDocumentoAsociado['numero']) {
                this.errors.push('Debe especificar el Número del Documento impreso Asociado en data.documentoAsociado.numero');
            }
            if (!dataDocumentoAsociado['tipoDocumentoImpreso']) {
                this.errors.push('Debe especificar el Tipo del Documento Impreso Asociado en data.documentoAsociado.tipoDocumentoImpreso');
            }
            if (dataDocumentoAsociado['fecha']) {
                if ((dataDocumentoAsociado['fecha'] + '').length != 10) {
                    this.errors.push('La Fecha del Documento impreso Asociado en data.documentoAsociado.fecha debe tener una longitud de 10 caracteres');
                }
            }
            else {
                this.errors.push('Debe especificar la Fecha del Documento impreso Asociado en data.documentoAsociado.fecha');
            }
        }
        if (dataDocumentoAsociado['formato'] == 3) {
            //H002 = Constancia electronica
            if (!dataDocumentoAsociado['constanciaTipo']) {
                this.errors.push('Debe especificar el Tipo de Constancia data.documentoAsociado.constanciaTipo');
            }
            else {
                if (constants_service_1.default.tiposConstancias.filter((um) => um.codigo === dataDocumentoAsociado['constanciaTipo'])
                    .length == 0) {
                    this.errors.push("Tipo de Constancia '" +
                        dataDocumentoAsociado['constanciaTipo'] +
                        "' en data.documentoAsociado.constanciaTipo no encontrado. Valores: " +
                        constants_service_1.default.tiposConstancias.map((a) => a.codigo + '-' + a.descripcion));
                }
            }
        }
    }
}
exports.default = new JSonDeMainValidateService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkRlTWFpblZhbGlkYXRlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvanNvbkRlTWFpblZhbGlkYXRlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4RUFBcUQ7QUFDckQsNEVBQW1EO0FBQ25ELDRFQUFtRDtBQUNuRCxnR0FBZ0U7QUFJaEUsTUFBTSx5QkFBeUI7SUFHN0I7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7SUFDcEMsQ0FBQztJQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BeUJHO0lBQ0ksY0FBYyxDQUFDLE1BQVcsRUFBRSxJQUFTLEVBQUUsTUFBb0I7UUFDaEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBRWxDLElBQUksMkJBQWdCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDckcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2QscUJBQXFCO2dCQUNuQixJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUNyQiw4Q0FBOEM7Z0JBQzlDLDJCQUFnQixDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FDOUUsQ0FBQztTQUNIO1FBRUQsSUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxXQUFXLEVBQUU7WUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0RBQXdELENBQUMsQ0FBQztTQUM1RTtRQUVELElBQUksSUFBSSxDQUFDLFNB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