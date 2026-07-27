"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js = __importStar(require("xml2js"));
const StringUtil_service_1 = __importDefault(require("./StringUtil.service"));
const FechaUtil_service_1 = __importDefault(require("./FechaUtil.service"));
const constants_service_1 = __importDefault(require("./constants.service"));
const jsonDteItem_service_1 = __importDefault(require("./jsonDteItem.service"));
const jsonDteAlgoritmos_service_1 = __importDefault(require("./jsonDteAlgoritmos.service"));
const jsonDteComplementario_service_1 = __importDefault(require("./jsonDteComplementario.service"));
const jsonDteTransporte_service_1 = __importDefault(require("./jsonDteTransporte.service"));
const jsonDteTotales_service_1 = __importDefault(require("./jsonDteTotales.service"));
const jsonDteComplementariosComerciales_service_1 = __importDefault(require("./jsonDteComplementariosComerciales.service"));
const jsonDteIdentificacionDocumento_service_1 = __importDefault(require("./jsonDteIdentificacionDocumento.service"));
const jsonDeMainValidate_service_1 = __importDefault(require("./jsonDeMainValidate.service"));
class JSonDeMainService {
    constructor() {
        this.codigoSeguridad = null;
        this.codigoControl = null;
        this.json = {};
        this.validateError = true;
    }
    generateXMLDE(params, data, config) {
        return new Promise((resolve, reject) => {
            try {
                let defaultConfig = {
                    defaultValues: true,
                    //arrayValuesSeparator : ', ',
                    errorSeparator: '; ',
                    errorLimit: 10,
                    redondeoSedeco: true,
                    decimals: 2,
                    taxDecimals: 2,
                    pygDecimals: 0,
                    partialTaxDecimals: 8,
                    pygTaxDecimals: 0,
                    userObjectRemove: false,
                    test: false,
                    sum0_000001SuffixBeforeToFixed: false,
                };
                defaultConfig = Object.assign(defaultConfig, config);
                resolve(this.generateXMLDeService(params, data, defaultConfig));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    /**
     * Metodo principal de generacion de XML del DE
     * @param params
     * @param data
     * @returns
     */
    generateXMLDeService(params, data, config) {
        this.removeUnderscoreAndPutCamelCase(data);
        this.addDefaultValues(data);
        if (this.validateError) {
            jsonDeMainValidate_service_1.default.validateValues(Object.assign({}, params), Object.assign({}, data), config);
        }
        this.json = {};
        this.generateCodigoControl(params, data); //Luego genera el código de Control
        this.generateRte(params);
        this.json['rDE']['DE'] = this.generateDe(params, data);
        //---
        this.generateDatosOperacion(params, data);
        this.generateDatosTimbrado(params, data);
        this.generateDatosGenerales(params, data, config);
        //---
        this.generateDatosEspecificosPorTipoDE(params, data, config);
        if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 4) {
            this.generateDatosCondicionOperacionDE(params, data, config);
        }
        //['gDtipDE']=E001
        this.json['rDE']['DE']['gDtipDE']['gCamItem'] = jsonDteItem_service_1.default.generateDatosItemsOperacion(params, data, config);
        let gCamEsp = jsonDteComplementario_service_1.default.generateDatosComplementariosComercialesDeUsoEspecificos(params, data);
        if (gCamEsp) {
            this.json['rDE']['DE']['gDtipDE']['gCamEsp'] = gCamEsp;
        }
        if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 7) {
            //1 Opcional, 7 Obligatorio
            if (data['detalleTransporte']) {
                this.json['rDE']['DE']['gDtipDE']['gTransp'] = jsonDteTransporte_service_1.default.generateDatosTransporte(params, data);
            }
        }
        if (data['tipoDocumento'] != 7) {
            const items = this.json['rDE']['DE']['gDtipDE']['gCamItem'];
            this.json['rDE']['DE']['gTotSub'] = jsonDteTotales_service_1.default.generateDatosTotales(params, data, items, config);
        }
        if (data['complementarios']) {
            this.json['rDE']['DE']['gCamGen'] = jsonDteComplementariosComerciales_service_1.default.generateDatosComercialesUsoGeneral(params, data);
        }
        if (data['tipoDocumento'] == 4 || data['tipoDocumento'] == 5 || data['tipoDocumento'] == 6) {
            if (!data['documentoAsociado']) {
                /*throw new Error(
                  'Documento asociado es obligatorio para el tipo de documento electrónico (' +
                    data['tipoDocumento'] +
                    ') seleccionado',
                );*/
            }
        }
        if (data['tipoDocumento'] == 1 ||
            data['tipoDocumento'] == 4 ||
            data['tipoDocumento'] == 5 ||
            data['tipoDocumento'] == 6 ||
            data['tipoDocumento'] == 7) {
            if (data['documentoAsociado']) {
                if (!Array.isArray(data['documentoAsociado'])) {
                    this.json['rDE']['DE']['gCamDEAsoc'] = jsonDteIdentificacionDocumento_service_1.default.generateDatosDocumentoAsociado(params, data['documentoAsociado'], data);
                }
                else {
                    //Caso sea un array.
                    this.json['rDE']['DE']['gCamDEAsoc'] = new Array();
                    for (var i = 0; i < data['documentoAsociado'].length; i++) {
                        const dataDocumentoAsociado = data['documentoAsociado'][i];
                        this.json['rDE']['DE']['gCamDEAsoc'].push(jsonDteIdentificacionDocumento_service_1.default.generateDatosDocumentoAsociado(params, dataDocumentoAsociado, data));
                    }
                }
            }
        }
        var builder = new xml2js.Builder({
            xmldec: {
                version: '1.0',
                encoding: 'UTF-8',
                standalone: false,
            },
        });
        var xml = builder.buildObject(this.json);
        return this.normalizeXML(xml); //Para firmar tiene que estar normalizado
    }
    /**
     * Genera el CDC para la Factura
     * Corresponde al Id del DE
     *
     * @param params
     * @param data
     */
    generateCodigoControl(params, data) {
        if (data.cdc && (data.cdc + '').length == 44) {
            //Caso ya se le pase el CDC
            this.codigoSeguridad = data.cdc.substring(34, 43);
            this.codigoControl = data.cdc;
            //Como se va utilizar el CDC enviado como parametro, va a verificar que todos los datos del XML coincidan con el CDC.
            const tipoDocumentoCDC = this.codigoControl.substring(0, 2);
            const establecimientoCDC = this.codigoControl.substring(11, 14);
            const puntoCDC = this.codigoControl.substring(14, 17);
            const numeroCDC = this.codigoControl.substring(17, 24);
            const fechaCDC = this.codigoControl.substring(25, 33);
            const tipoEmisionCDC = this.codigoControl.substring(33, 34);
            const establecimiento = StringUtil_service_1.default.leftZero(data['establecimiento'], 3);
            const punto = StringUtil_service_1.default.leftZero(data['punto'], 3);
            const numero = StringUtil_service_1.default.leftZero(data['numero'], 7);
            const fecha = (data['fecha'] + '').substring(0, 4) +
                (data['fecha'] + '').substring(5, 7) +
                (data['fecha'] + '').substring(8, 10);
        }
        else {
            this.validateCamposDelCDC(params, data);
            this.codigoSeguridad = StringUtil_service_1.default.leftZero(data.codigoSeguridadAleatorio, 9);
            this.codigoControl = jsonDteAlgoritmos_service_1.default.generateCodigoControl(params, data, this.codigoSeguridad);
        }
    }
    validateCamposDelCDC(params, data) {
        //Validar campos básicos para el código de control
        if (!params.ruc) {
            throw new Error('Debe completar Tipo de Documento en params.ruc');
        }
        if (!data.tipoDocumento) {
            throw new Error('Debe completar Tipo de Documento en data.tipoDocumento');
        }
        if (!data.establecimiento) {
            throw new Error('Debe completar Establecimiento de la Emisión en data.establecimiento');
        }
        if (!data.punto) {
            throw new Error('Debe completar el Punto de emisión en data.punto');
        }
        if (!data.numero) {
            throw new Error('Debe completar el Número de Documento en data.numero');
        }
        if (!data.fecha) {
            throw new Error('Debe completar la Fecha de Emisión en data.fecha');
        }
        if (!(params.ruc.indexOf('-') >= 0)) {
            throw new Error('El RUC del Emisor debe contener el DV en params.ruc');
        }
        let rucEmisor = params['ruc'].split('-')[0];
        let dvEmisor = params['ruc'].split('-')[1];
        if ((rucEmisor + '').length > 8) {
            throw new Error('La parte del RUC del Emisor no puede superar los 8 caracteres');
        }
        if ((dvEmisor + '').length > 1) {
            throw new Error('El DV del RUC del Emisor no puede superar 1 caracter');
        }
        if ((data.tipoDocumento + '').length > 1) {
            throw new Error('El Tipo de Documento no puede superar 1 digito en data.tipoDocumento');
        }
        if ((data.establecimiento + '').length > 3) {
            throw new Error('El Establecimiento no puede superar 3 digitos en data.establecimiento');
        }
        if ((data.punto + '').length > 3) {
            throw new Error('El Punto de Emisión no puede superar 3 digitos en data.punto');
        }
        if ((data.numero + '').length > 7) {
            throw new Error('El Número de Documento no puede superar 7 digitos en data.numero');
        }
        if ((data.fecha + '').length > 19) {
            throw new Error('La Fecha de Emisión no puede superar los 19 caracteres en data.fecha');
        }
    }
    /**
     * Si los valores vienen en underscore, crea los valores en formato variableJava que
     * sera utilizado dentro del proceso,
     *
     * Ej. si viene tipo_documento crea una variable tipoDocumento, con el mismo valor.
     *
     * @param data
     */
    removeUnderscoreAndPutCamelCase(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90;
        const regExpOnlyNumber = new RegExp(/^\d+$/);
        if (data.tipo_documento) {
            data.tipoDocumento = data.tipo_documento;
        }
        if (data.tipo_contribuyente) {
            data.tipoContribuyente = data.tipo_contribuyente;
        }
        if (data.tipo_emision) {
            data.tipoEmision = data.tipo_emision;
        }
        if (data.tipo_transaccion) {
            data.tipoTransaccion = data.tipo_transaccion;
        }
        if (data.tipo_impuesto) {
            data.tipoImpuesto = data.tipo_impuesto;
        }
        if (data.condicion_anticipo) {
            data.condicionAnticipo = data.condicion_anticipo;
        }
        if (data.anticipo_global) {
            data.anticipoGlobal = data.anticipo_global;
        }
        if (data.condicion_tipo_cambio) {
            data.condicionTipoCambio = data.condicion_tipo_cambio;
        }
        if (data.descuento_global) {
            data.descuentoGlobal = data.descuento_global;
        }
        //Objeto Cliente
        if ((_a = data.cliente) === null || _a === void 0 ? void 0 : _a.razon_social) {
            data.cliente.razonSocial = data.cliente.razon_social;
        }
        if ((_b = data.cliente) === null || _b === void 0 ? void 0 : _b.nombre_fantasia) {
            data.cliente.nombreFantasia = data.cliente.nombre_fantasia;
        }
        if ((_c = data.cliente) === null || _c === void 0 ? void 0 : _c.tipo_operacion) {
            data.cliente.tipoOperacion = data.cliente.tipo_operacion;
        }
        if (((_d = data.cliente) === null || _d === void 0 ? void 0 : _d.tipoOperacion) == 3) {
            //B2G
            //Completar los datos de la DNCP de forma predeterminada.
            if (!data.dncp) {
                data.dncp = {};
                data.dncp.modalidad = '11';
                data.dncp.entidad = '11111';
                data.dncp.secuencia = '1111111';
                data.dncp.año = '11';
                let fechaContratacion = new Date();
                fechaContratacion.setDate(fechaContratacion.getDate() - 30); //1 mes antes
                data.dncp.fecha = FechaUtil_service_1.default.convertToAAAA_MM_DD(fechaContratacion);
            }
            else {
                if ((_e = data.dncp) === null || _e === void 0 ? void 0 : _e.ano) {
                    data.dncp.año = data.dncp.ano;
                }
            }
        }
        else {
            if ((_f = data.dncp) === null || _f === void 0 ? void 0 : _f.ano) {
                data.dncp.año = data.dncp.ano;
            }
        }
        //Campo que puede ser un numero = 0, hay que validar de esta forma
        if (typeof data.cliente != 'undefined' && typeof data.cliente.numero_casa != 'undefined') {
            if (data.cliente.numero_casa != null) {
                data.cliente.numeroCasa = data.cliente.numero_casa + '';
            }
        }
        if ((_g = data.cliente) === null || _g === void 0 ? void 0 : _g.tipo_contribuyente) {
            data.cliente.tipoContribuyente = data.cliente.tipo_contribuyente;
        }
        if ((_h = data.cliente) === null || _h === void 0 ? void 0 : _h.documento_tipo) {
            data.cliente.documentoTipo = data.cliente.documento_tipo;
        }
        if ((_j = data.cliente) === null || _j === void 0 ? void 0 : _j.documento_tipo_descripcion) {
            data.cliente.documentoTipoDescripcion = data.cliente.documento_tipo_descripcion;
        }
        if ((_k = data.cliente) === null || _k === void 0 ? void 0 : _k.documento_numero) {
            data.cliente.documentoNumero = data.cliente.documento_numero;
        }
        //Usuario
        if ((_l = data.usuario) === null || _l === void 0 ? void 0 : _l.documento_tipo) {
            data.usuario.documentoTipo = data.usuario.documento_tipo;
        }
        if ((_m = data.usuario) === null || _m === void 0 ? void 0 : _m.documento_tipo_descripcion) {
            data.usuario.documentoTipoDescripcion = data.usuario.documento_tipo_descripcion;
        }
        if ((_o = data.usuario) === null || _o === void 0 ? void 0 : _o.documento_numero) {
            data.usuario.documentoNumero = data.usuario.documento_numero;
        }
        //Factura
        if ((_p = data.factura) === null || _p === void 0 ? void 0 : _p.fecha_envio) {
            data.factura.fechaEnvio = data.usuario.fecha_envio;
        }
        //AutoFactura
        if (data.auto_factura) {
            data.autoFactura = Object.assign({}, data.auto_factura);
        }
        if ((_q = data.autoFactura) === null || _q === void 0 ? void 0 : _q.tipo_vendedor) {
            data.autoFactura.tipoVendedor = data.autoFactura.tipo_vendedor;
        }
        if ((_r = data.autoFactura) === null || _r === void 0 ? void 0 : _r.documento_tipo) {
            data.autoFactura.documentoTipo = data.autoFactura.documento_tipo;
        }
        if ((_s = data.autoFactura) === null || _s === void 0 ? void 0 : _s.documento_numero) {
            data.autoFactura.documentoNumero = data.autoFactura.documento_numero;
        }
        if (data.autoFactura != null &&
            typeof data.autoFactura != 'undefined' &&
            data.autoFactura.numero_casa != null &&
            typeof data.autoFactura.numero_casa != 'undefined') {
            if (data.autoFactura.numero_casa != null) {
                data.autoFactura.numeroCasa = data.autoFactura.numero_casa + '';
            }
        }
        /*if (data.autoFactura?.numero_casa) {
          data.autoFactura.numeroCasa = data.autoFactura.numero_casa;
        }*/
        //Remision
        if (data.nota_credito_debito) {
            data.notaCreditoDebito = data.nota_credito_debito;
        }
        //Remision
        if ((_t = data.remision) === null || _t === void 0 ? void 0 : _t.tipo_responsable) {
            data.remision.tipoResponsable = data.remision.tipo_responsable;
        }
        if ((_u = data.remision) === null || _u === void 0 ? void 0 : _u.fecha_factura) {
            data.remision.fechaFactura = data.remision.fecha_factura;
        }
        if ((_v = data.remision) === null || _v === void 0 ? void 0 : _v.costo_flete) {
            data.remision.costoFlete = data.remision.costo_flete;
        }
        //Documento Asociado
        if (data.documento_asociado) {
            data.documentoAsociado = Object.assign({}, data.documento_asociado);
        }
        if ((_w = data.documentoAsociado) === null || _w === void 0 ? void 0 : _w.numero_retencion) {
            data.documentoAsociado.numeroRetencion = data.documentoAsociado.numero_retencion;
        }
        if ((_x = data.documentoAsociado) === null || _x === void 0 ? void 0 : _x.resolucion_credito_fiscal) {
            data.documentoAsociado.resolucionCreditoFiscal = data.documentoAsociado.resolucion_credito_fiscal;
        }
        if ((_y = data.documentoAsociado) === null || _y === void 0 ? void 0 : _y.tipo_documento_impreso) {
            data.documentoAsociado.tipoDocumentoImpreso = data.documentoAsociado.tipo_documento_impreso;
        }
        if ((_z = data.documentoAsociado) === null || _z === void 0 ? void 0 : _z.constancia_tipo) {
            data.documentoAsociado.constanciaTipo = data.documentoAsociado.constancia_tipo;
        }
        if ((_0 = data.documentoAsociado) === null || _0 === void 0 ? void 0 : _0.constancia_numero) {
            data.documentoAsociado.constanciaNumero = data.documentoAsociado.constancia_numero;
        }
        if ((_1 = data.documentoAsociado) === null || _1 === void 0 ? void 0 : _1.constancia_control) {
            data.documentoAsociado.constanciaControl = data.documentoAsociado.constancia_control;
        }
        if ((_2 = data.documentoAsociado) === null || _2 === void 0 ? void 0 : _2.ruc_fusionado) {
            data.documentoAsociado.rucFusionado = data.documentoAsociado.ruc_fusionado;
        }
        //Condicion entregas
        if (((_3 = data.condicion) === null || _3 === void 0 ? void 0 : _3.entregas) && ((_4 = data.condicion) === null || _4 === void 0 ? void 0 : _4.entregas.length) > 0) {
            for (let i = 0; i < data.condicion.entregas.length; i++) {
                const entrega = data.condicion.entregas[i];
                if (entrega.info_tarjeta) {
                    entrega.infoTarjeta = Object.assign({}, entrega.info_tarjeta);
                }
                if ((_5 = entrega.infoTarjeta) === null || _5 === void 0 ? void 0 : _5.razon_social) {
                    entrega.infoTarjeta.razonSocial = entrega.infoTarjeta.razon_social;
                }
                if ((_6 = entrega.infoTarjeta) === null || _6 === void 0 ? void 0 : _6.medio_pago) {
                    entrega.infoTarjeta.medioPago = entrega.infoTarjeta.medio_pago;
                }
                if ((_7 = entrega.infoTarjeta) === null || _7 === void 0 ? void 0 : _7.codigo_autorizacion) {
                    entrega.infoTarjeta.codigoAutorizacion = entrega.infoTarjeta.codigo_autorizacion;
                }
                if (entrega.info_cheque) {
                    entrega.infoCheque = Object.assign({}, entrega.info_cheque);
                }
                if ((_8 = entrega.infoCheque) === null || _8 === void 0 ? void 0 : _8.numero_cheque) {
                    entrega.infoCheque.numeroCheque = entrega.infoCheque.numero_cheque;
                }
            }
        }
        if ((_9 = data.condicion) === null || _9 === void 0 ? void 0 : _9.monto_entrega) {
            data.condicion.montoEntrega = data.condicion.monto_entrega;
        }
        if ((_10 = data.condicion) === null || _10 === void 0 ? void 0 : _10.credito) {
            if (data.condicion.credito.info_cuotas) {
                data.condicion.credito.infoCuotas = [...data.condicion.credito.info_cuotas];
            }
        }
        //Items
        if (data.items && ((_11 = data.items) === null || _11 === void 0 ? void 0 : _11.length) > 0) {
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                if (item.partida_arancelaria) {
                    item.partidaArancelaria = item.partida_arancelaria;
                }
                if (item.unidad_medida) {
                    item.unidadMedida = item.unidad_medida;
                }
                //if (item.precio_unitario) {
                //Los valores numericos que pueden aceptar 0 hay que validar de esta manera.
                if (item['precio_unitario'] != null && (item['precio_unitario'] + '').length > 0) {
                    item.precioUnitario = item.precio_unitario;
                }
                if (item.tolerancia_cantidad) {
                    item.toleranciaCantidad = item.tolerancia_cantidad;
                }
                if (item.tolerancia_porcentaje) {
                    item.toleranciaPorcentaje = item.tolerancia_porcentaje;
                }
                if (item.cdc_anticipo) {
                    item.cdcAnticipo = item.cdc_anticipo;
                }
                //if (item.iva_tipo) {
                if (typeof item.iva_tipo != 'undefined') {
                    item.ivaTipo = item.iva_tipo;
                }
                //if (item.iva_base) {
                if (typeof item.iva_base != 'undefined') {
                    item.ivaBase = item.iva_base;
                }
                if (typeof item.iva_proporcional != 'undefined') {
                    item.ivaProporcion = item.iva_proporcional;
                    delete item.iva_proporcional;
                }
                if (item.numero_serie) {
                    item.numeroSerie = item.numero_serie;
                }
                if (item.numero_pedido) {
                    item.numeroPedido = item.numero_pedido;
                }
                if (item.numero_seguimiento) {
                    item.numeroSeguimiento = item.numero_seguimiento;
                }
                //DNCP
                if (item.dncp) {
                    if (item.dncp.codigo_nivel_general) {
                        item.dncp.codigoNivelGeneral = item.dncp.codigo_nivel_general;
                    }
                    if (item.dncp.codigo_nivel_especifico) {
                        item.dncp.codigoNivelEspecifico = item.dncp.codigo_nivel_especifico;
                    }
                    if (item.dncp.codigo_gtin_producto) {
                        item.dncp.codigoGtinProducto = item.dncp.codigo_gtin_producto;
                    }
                    if (item.dncp.codigo_nivel_paquete) {
                        item.dncp.codigoNivelPaquete = item.dncp.codigo_nivel_paquete;
                    }
                }
                //Datos predeterminados para DNCP, si no se le pasa
                if (((_12 = data.cliente) === null || _12 === void 0 ? void 0 : _12.tipoOperacion) == 3) {
                    //B2G - NT20
                    if (!item.dncp) {
                        item.dncp = {};
                        item.dncp.codigoNivelGeneral = '00000000';
                        item.dncp.codigoNivelEspecifico = '000';
                        item.dncp.codigoGtinProducto = '11111111'; //Numerico
                        item.dncp.codigoNivelPaquete = '11111111'; //Numerico
                    }
                }
                //Importador
                if (item.importador) {
                    if (item.importador.registro_importador) {
                        item.importador.registroImportador = item.importador.registro_importador;
                    }
                    if (item.registro_senave) {
                        item.registroSenave = item.registro_senave;
                    }
                    if (item.registro_entidad_comercial) {
                        item.registroEntidadComercial = item.registro_entidad_comercial;
                    }
                }
                //Sector Automotor
                if (item.sector_automotor) {
                    if (item.sector_automotor.capacidad_motor) {
                        item.sector_automotor.capacidadMotor = item.sector_automotor.capacidad_motor;
                    }
                    if (item.sector_automotor.capacidad_pasajeros) {
                        item.sector_automotor.capacidadPasajeros = item.sector_automotor.capacidad_pasajeros;
                    }
                    if (item.sector_automotor.peso_bruto) {
                        item.sector_automotor.pesoBruto = item.sector_automotor.peso_bruto;
                    }
                    if (item.sector_automotor.peso_neto) {
                        item.sector_automotor.pesoNeto = item.sector_automotor.peso_neto;
                    }
                    if (item.sector_automotor.tipo_combustible) {
                        item.sector_automotor.tipoCombustible = item.sector_automotor.tipo_combustible;
                    }
                    if (item.sector_automotor.numero_motor) {
                        item.sector_automotor.numeroMotor = item.sector_automotor.numero_motor;
                    }
                    if (item.sector_automotor.capacidad_traccion) {
                        item.sector_automotor.capacidadTraccion = item.sector_automotor.capacidad_traccion;
                    }
                    if (item.sector_automotor.tipo_vehiculo) {
                        item.sector_automotor.tipoVehiculo = item.sector_automotor.tipo_vehiculo;
                    }
                }
            }
        }
        //Detalle de Tranposte
        if (data.detalle_transporte) {
            data.detalleTransporte = Object.assign({}, data.detalle_transporte);
        }
        if (data.transporte) {
            //Nueva version quedara solamente data.trasnsporte
            data.detalleTransporte = Object.assign({}, data.transporte);
        }
        if ((_13 = data.detalleTransporte) === null || _13 === void 0 ? void 0 : _13.tipo_responsable) {
            data.detalleTransporte.tipoResponsable = data.detalleTransporte.tipo_responsable;
        }
        if ((_14 = data.detalleTransporte) === null || _14 === void 0 ? void 0 : _14.condicion_negociacion) {
            data.detalleTransporte.condicionNegociacion = data.detalleTransporte.condicion_negociacion;
        }
        if ((_15 = data.detalleTransporte) === null || _15 === void 0 ? void 0 : _15.numero_manifiesto) {
            data.detalleTransporte.numeroManifiesto = data.detalleTransporte.numero_manifiesto;
        }
        if ((_16 = data.detalleTransporte) === null || _16 === void 0 ? void 0 : _16.numero_despacho_importacion) {
            data.detalleTransporte.numeroDespachoImportacion = data.detalleTransporte.numero_despacho_importacion;
        }
        if ((_17 = data.detalleTransporte) === null || _17 === void 0 ? void 0 : _17.inicio_estimado_translado) {
            data.detalleTransporte.inicioEstimadoTranslado = data.detalleTransporte.inicio_estimado_translado;
        }
        if ((_18 = data.detalleTransporte) === null || _18 === void 0 ? void 0 : _18.fin_estimado_translado) {
            data.detalleTransporte.finEstimadoTranslado = data.detalleTransporte.fin_estimado_translado;
        }
        if ((_19 = data.detalleTransporte) === null || _19 === void 0 ? void 0 : _19.pais_destino) {
            data.detalleTransporte.paisDestino = data.detalleTransporte.pais_destino;
        }
        if ((_20 = data.detalleTransporte) === null || _20 === void 0 ? void 0 : _20.pais_destino_nombre) {
            data.detalleTransporte.paisDestinoNombre = data.detalleTransporte.pais_destino_nombre;
        }
        //Falta los de salida, entrega, etc.
        //Detalle de Transporte Salida
        if ((_22 = (_21 = data.detalleTransporte) === null || _21 === void 0 ? void 0 : _21.salida) === null || _22 === void 0 ? void 0 : _22.numero_casa) {
            //Nueva version quedara solamente data.trasnsporte
            data.detalleTransporte.salida.numeroCasa = data.detalleTransporte.salida.numero_casa;
        }
        if ((_24 = (_23 = data.detalleTransporte) === null || _23 === void 0 ? void 0 : _23.salida) === null || _24 === void 0 ? void 0 : _24.complemento_direccion1) {
            data.detalleTransporte.salida.complementoDireccion1 = data.detalleTransporte.salida.complemento_direccion1;
        }
        if ((_26 = (_25 = data.detalleTransporte) === null || _25 === void 0 ? void 0 : _25.salida) === null || _26 === void 0 ? void 0 : _26.complemento_direccion2) {
            data.detalleTransporte.salida.complementoDireccion2 = data.detalleTransporte.salida.complemento_direccion2;
        }
        if ((_28 = (_27 = data.detalleTransporte) === null || _27 === void 0 ? void 0 : _27.salida) === null || _28 === void 0 ? void 0 : _28.departamento_descripcion) {
            data.detalleTransporte.salida.departamentoDescripcion = data.detalleTransporte.salida.departamento_descripcion;
        }
        if ((_30 = (_29 = data.detalleTransporte) === null || _29 === void 0 ? void 0 : _29.salida) === null || _30 === void 0 ? void 0 : _30.distrito_descripcion) {
            data.detalleTransporte.salida.distritoDescripcion = data.detalleTransporte.salida.distrito_descripcion;
        }
        if ((_32 = (_31 = data.detalleTransporte) === null || _31 === void 0 ? void 0 : _31.salida) === null || _32 === void 0 ? void 0 : _32.ciudad_descripcion) {
            data.detalleTransporte.salida.ciudadDescripcion = data.detalleTransporte.salida.ciudad_descripcion;
        }
        if ((_34 = (_33 = data.detalleTransporte) === null || _33 === void 0 ? void 0 : _33.salida) === null || _34 === void 0 ? void 0 : _34.pais_descripcion) {
            data.detalleTransporte.salida.paisDescripcion = data.detalleTransporte.salida.pais_descripcion;
        }
        if ((_36 = (_35 = data.detalleTransporte) === null || _35 === void 0 ? void 0 : _35.salida) === null || _36 === void 0 ? void 0 : _36.telefono_contacto) {
            data.detalleTransporte.salida.telefonoContacto = data.detalleTransporte.salida.telefono_contacto;
        }
        //Detalle de Transporte Entrega
        if ((_38 = (_37 = data.detalleTransporte) === null || _37 === void 0 ? void 0 : _37.entrega) === null || _38 === void 0 ? void 0 : _38.numero_casa) {
            //Nueva version quedara solamente data.trasnsporte
            data.detalleTransporte.entrega.numeroCasa = data.detalleTransporte.entrega.numero_casa;
        }
        if ((_40 = (_39 = data.detalleTransporte) === null || _39 === void 0 ? void 0 : _39.entrega) === null || _40 === void 0 ? void 0 : _40.complemento_direccion1) {
            data.detalleTransporte.entrega.complementoDireccion1 = data.detalleTransporte.entrega.complemento_direccion1;
        }
        if ((_42 = (_41 = data.detalleTransporte) === null || _41 === void 0 ? void 0 : _41.entrega) === null || _42 === void 0 ? void 0 : _42.complemento_direccion2) {
            data.detalleTransporte.entrega.complementoDireccion2 = data.detalleTransporte.entrega.complemento_direccion2;
        }
        if ((_44 = (_43 = data.detalleTransporte) === null || _43 === void 0 ? void 0 : _43.entrega) === null || _44 === void 0 ? void 0 : _44.departamento_descripcion) {
            data.detalleTransporte.entrega.departamentoDescripcion = data.detalleTransporte.entrega.departamento_descripcion;
        }
        if ((_46 = (_45 = data.detalleTransporte) === null || _45 === void 0 ? void 0 : _45.entrega) === null || _46 === void 0 ? void 0 : _46.distrito_descripcion) {
            data.detalleTransporte.entrega.distritoDescripcion = data.detalleTransporte.entrega.distrito_descripcion;
        }
        if ((_48 = (_47 = data.detalleTransporte) === null || _47 === void 0 ? void 0 : _47.entrega) === null || _48 === void 0 ? void 0 : _48.ciudad_descripcion) {
            data.detalleTransporte.entrega.ciudadDescripcion = data.detalleTransporte.entrega.ciudad_descripcion;
        }
        if ((_50 = (_49 = data.detalleTransporte) === null || _49 === void 0 ? void 0 : _49.entrega) === null || _50 === void 0 ? void 0 : _50.pais_descripcion) {
            data.detalleTransporte.entrega.paisDescripcion = data.detalleTransporte.entrega.pais_descripcion;
        }
        if ((_52 = (_51 = data.detalleTransporte) === null || _51 === void 0 ? void 0 : _51.entrega) === null || _52 === void 0 ? void 0 : _52.telefono_contacto) {
            data.detalleTransporte.entrega.telefonoContacto = data.detalleTransporte.entrega.telefono_contacto;
        }
        // Detalle de Transporte Vehiculo
        if ((_54 = (_53 = data.detalleTransporte) === null || _53 === void 0 ? void 0 : _53.vehiculo) === null || _54 === void 0 ? void 0 : _54.documento_tipo) {
            data.detalleTransporte.vehiculo.documentoTipo = data.detalleTransporte.vehiculo.documento_tipo;
        }
        if ((_56 = (_55 = data.detalleTransporte) === null || _55 === void 0 ? void 0 : _55.vehiculo) === null || _56 === void 0 ? void 0 : _56.documento_numero) {
            data.detalleTransporte.vehiculo.documentoNumero = data.detalleTransporte.vehiculo.documento_numero;
        }
        if ((_58 = (_57 = data.detalleTransporte) === null || _57 === void 0 ? void 0 : _57.vehiculo) === null || _58 === void 0 ? void 0 : _58.numero_matricula) {
            data.detalleTransporte.vehiculo.numeroMatricula = data.detalleTransporte.vehiculo.numero_matricula;
        }
        if ((_60 = (_59 = data.detalleTransporte) === null || _59 === void 0 ? void 0 : _59.vehiculo) === null || _60 === void 0 ? void 0 : _60.numero_vuelo) {
            data.detalleTransporte.vehiculo.numeroVuelo = data.detalleTransporte.vehiculo.numero_vuelo;
        }
        // Detalle de Transporte Transportista
        if ((_62 = (_61 = data.detalleTransporte) === null || _61 === void 0 ? void 0 : _61.transportista) === null || _62 === void 0 ? void 0 : _62.documento_tipo) {
            data.detalleTransporte.transportista.documentoTipo = data.detalleTransporte.transportista.documento_tipo;
        }
        if ((_64 = (_63 = data.detalleTransporte) === null || _63 === void 0 ? void 0 : _63.transportista) === null || _64 === void 0 ? void 0 : _64.documento_numero) {
            data.detalleTransporte.transportista.documentoNumero = data.detalleTransporte.transportista.documento_numero;
        }
        if ((_66 = (_65 = data.detalleTransporte) === null || _65 === void 0 ? void 0 : _65.transportista) === null || _66 === void 0 ? void 0 : _66.pais_descripcion) {
            data.detalleTransporte.transportista.paisDescripcion = data.detalleTransporte.transportista.pais_descripcion;
        }
        // Detalle de Transporte Transportista Chofer
        if ((_69 = (_68 = (_67 = data.detalleTransporte) === null || _67 === void 0 ? void 0 : _67.transportista) === null || _68 === void 0 ? void 0 : _68.chofer) === null || _69 === void 0 ? void 0 : _69.documento_numero) {
            data.detalleTransporte.transportista.chofer.documentoNumero =
                data.detalleTransporte.transportista.chofer.documento_numero;
        }
        // Data Complementarios
        if ((_70 = data.complementarios) === null || _70 === void 0 ? void 0 : _70.orden_compra) {
            data.complementarios.ordenCompra = data.complementarios.orden_compra;
        }
        if ((_71 = data.complementarios) === null || _71 === void 0 ? void 0 : _71.orden_venta) {
            data.complementarios.ordenVenta = data.complementarios.orden_venta;
        }
        if ((_72 = data.complementarios) === null || _72 === void 0 ? void 0 : _72.numero_asiento) {
            data.complementarios.numeroAsiento = data.complementarios.numero_asiento;
        }
        // Data complementarios carga
        if ((_74 = (_73 = data.complementarios) === null || _73 === void 0 ? void 0 : _73.carga) === null || _74 === void 0 ? void 0 : _74.orden_compra) {
            data.complementarios.carga.ordenCompra = data.complementarios.carga.orden_compra;
        }
        if ((_76 = (_75 = data.complementarios) === null || _75 === void 0 ? void 0 : _75.carga) === null || _76 === void 0 ? void 0 : _76.orden_venta) {
            data.complementarios.carga.ordenVenta = data.complementarios.carga.orden_venta;
        }
        if ((_78 = (_77 = data.complementarios) === null || _77 === void 0 ? void 0 : _77.carga) === null || _78 === void 0 ? void 0 : _78.numero_asiento) {
            data.complementarios.carga.numeroAsiento = data.complementarios.carga.numero_asiento;
        }
        //Sector Energia
        if (data.sector_energia_electrica) {
            data.sectorEnergiaElectrica = Object.assign({}, data.sector_energia_electrica);
        }
        if ((_79 = data.sectorEnergiaElectrica) === null || _79 === void 0 ? void 0 : _79.numero_medidor) {
            data.sectorEnergiaElectrica.numeroMedidor = data.sectorEnergiaElectrica.numero_medidor;
        }
        if ((_80 = data.sectorEnergiaElectrica) === null || _80 === void 0 ? void 0 : _80.codigo_actividad) {
            data.sectorEnergiaElectrica.codigoActividad = data.sectorEnergiaElectrica.codigo_actividad;
        }
        if ((_81 = data.sectorEnergiaElectrica) === null || _81 === void 0 ? void 0 : _81.codigo_categoria) {
            data.sectorEnergiaElectrica.codigoCategoria = data.sectorEnergiaElectrica.codigo_categoria;
        }
        if ((_82 = data.sectorEnergiaElectrica) === null || _82 === void 0 ? void 0 : _82.lectura_anterior) {
            data.sectorEnergiaElectrica.lecturaAnterior = data.sectorEnergiaElectrica.lectura_anterior;
        }
        if ((_83 = data.sectorEnergiaElectrica) === null || _83 === void 0 ? void 0 : _83.lectura_actual) {
            data.sectorEnergiaElectrica.lecturaActual = data.sectorEnergiaElectrica.lectura_actual;
        }
        //Sector Seguros
        if (data.sector_seguros) {
            data.sectorSeguros = Object.assign({}, data.sector_seguros);
        }
        if ((_84 = data.sectorSeguros) === null || _84 === void 0 ? void 0 : _84.codigo_aseguradora) {
            data.sectorSeguros.codigoAseguradora = data.sectorSeguros.codigo_aseguradora;
        }
        if ((_85 = data.sectorSeguros) === null || _85 === void 0 ? void 0 : _85.codigo_poliza) {
            data.sectorSeguros.codigoPoliza = data.sectorSeguros.codigo_poliza;
        }
        if ((_86 = data.sectorSeguros) === null || _86 === void 0 ? void 0 : _86.numero_poliza) {
            data.sectorSeguros.numeroPoliza = data.sectorSeguros.numero_poliza;
        }
        if ((_87 = data.sectorSeguros) === null || _87 === void 0 ? void 0 : _87.vigencia_unidad) {
            data.sectorSeguros.vigenciaUnidad = data.sectorSeguros.vigencia_unidad;
        }
        if ((_88 = data.sectorSeguros) === null || _88 === void 0 ? void 0 : _88.inicio_vigencia) {
            data.sectorSeguros.inicioVigencia = data.sectorSeguros.inicio_vigencia;
        }
        if ((_89 = data.sectorSeguros) === null || _89 === void 0 ? void 0 : _89.fin_vigencia) {
            data.sectorSeguros.finVigencia = data.sectorSeguros.fin_vigencia;
        }
        if ((_90 = data.sectorSeguros) === null || _90 === void 0 ? void 0 : _90.codigo_interno_item) {
            data.sectorSeguros.codigoInternoItem = data.sectorSeguros.codigo_interno_item;
        }
    }
    /**
     * Añade algunos valores por defecto al JSON de entrada, valido para
     * todas las operaciones
     * @param data
     */
    addDefaultValues(data) {
        if (constants_service_1.default.tiposDocumentos.filter((um) => um.codigo === +data['tipoDocumento']).length == 0) {
            //No quitar este throw
            throw new Error("Tipo de Documento '" +
                data['tipoDocumento'] +
                "' en data.tipoDocumento no válido. Valores: " +
                constants_service_1.default.tiposDocumentos.map((a) => a.codigo + '-' + a.descripcion));
        }
        data['tipoDocumentoDescripcion'] = constants_service_1.default.tiposDocumentos.filter((td) => td.codigo == +data['tipoDocumento'])[0]['descripcion'];
        if (!data['tipoEmision']) {
            data['tipoEmision'] = 1;
        }
        if (!data['tipoTransaccion']) {
            data['tipoTransaccion'] = 1;
        }
        if (!data['moneda']) {
            data['moneda'] = 'PYG';
        }
        if (data['moneda'] != 'PYG') {
            if (!data['condicionTipoCambio']) {
                data['condicionTipoCambio'] = 1; //Por el Global
            }
        }
        //Valores por defecto para los items
        if (data['items'] && data['items'].length > 0) {
            for (let i = 0; i < data['items'].length; i++) {
                const item = data['items'][i];
                if (!item['unidadMedida']) {
                    item['unidadMedida'] = 77;
                }
            }
        }
    }
    generateRte(params) {
        this.json = {
            rDE: {
                $: {
                    xmlns: 'http://ekuatia.set.gov.py/sifen/xsd',
                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    'xsi:schemaLocation': 'http://ekuatia.set.gov.py/sifen/xsd siRecepDE_v150.xsd',
                },
                dVerFor: params.version,
            },
        };
    }
    generateDe(params, data) {
        if (params['ruc'].indexOf('-') == -1) {
            //throw new Error('RUC debe contener dígito verificador en params.ruc');
        }
        const rucEmisor = params['ruc'].split('-')[0];
        const dvEmisor = params['ruc'].split('-')[1];
        const id = this.codigoControl;
        let fechaFirmaDigital = new Date();
        if (data.fechaFirmaDigital) {
            fechaFirmaDigital = new Date(data.fechaFirmaDigital);
        }
        let digitoVerificadorString = this.codigoControl + '';
        const jsonResult = {
            $: {
                Id: id,
            },
            dDVId: digitoVerificadorString.substring(digitoVerificadorString.length - 1, digitoVerificadorString.length),
            dFecFirma: FechaUtil_service_1.default.convertToJSONFormat(fechaFirmaDigital),
            dSisFact: 1,
        };
        return jsonResult;
    }
    /**
       * Datos inerentes a la operacion
       * <gOpeDE>
              <iTipEmi>1</iTipEmi>
              <dDesTipEmi>Normal</dDesTipEmi>
              <dCodSeg>000000023</dCodSeg>
              <dInfoEmi>1</dInfoEmi>
              <dInfoFisc>Información de interés del Fisco respecto al DE</dInfoFisc>
          </gOpeDE>
  
       * @param params
       * @param data
       * @param options
       */
    generateDatosOperacion(params, data) {
        if (params['ruc'].indexOf('-') == -1) {
            //throw new Error('RUC debe contener dígito verificador en params.ruc');
        }
        const rucEmisor = params['ruc'].split('-')[0];
        const dvEmisor = params['ruc'].split('-')[1];
        const id = jsonDteAlgoritmos_service_1.default.generateCodigoControl(params, data, this.codigoSeguridad);
        const digitoVerificador = jsonDteAlgoritmos_service_1.default.calcularDigitoVerificador(rucEmisor, 11);
        if (id.length != 44) {
        }
        const codigoSeguridadAleatorio = this.codigoSeguridad;
        if (constants_service_1.default.tiposEmisiones.filter((um) => um.codigo === data['tipoEmision']).length == 0) {
            /*throw new Error(
              "Tipo de Emisión '" +
                data['tipoEmision'] +
                "' en data.tipoEmision no válido. Valores: " +
                constanteService.tiposEmisiones.map((a) => a.codigo + '-' + a.descripcion),
            );*/
        }
        this.json['rDE']['DE']['gOpeDE'] = {
            iTipEmi: data['tipoEmision'],
            dDesTipEmi: constants_service_1.default.tiposEmisiones.filter((td) => td.codigo == data['tipoEmision'])[0]['descripcion'],
            dCodSeg: codigoSeguridadAleatorio,
        };
        if (data['observacion'] && data['observacion'].length > 0) {
            this.json['rDE']['DE']['gOpeDE']['dInfoEmi'] = data['observacion'];
        }
        if (data['descripcion'] && data['descripcion'].length > 0) {
            this.json['rDE']['DE']['gOpeDE']['dInfoFisc'] = data['descripcion'];
        }
    }
    /**
       * Genera los datos del timbrado
       *
       * <gTimb>
              <iTiDE>1</iTiDE>
              <dDesTiDE>Factura electrónica</dDesTiDE>
              <dNumTim>12345678</dNumTim>
              <dEst>001</dEst>
              <dPunExp>001</dPunExp>
              <dNumDoc>1000050</dNumDoc>
              <dSerieNum>AB</dSerieNum>
              <dFeIniT>2019-08-13</dFeIniT>
          </gTimb>
  
       * @param params
       * @param data
       * @param options
       */
    generateDatosTimbrado(params, data) {
        this.json['rDE']['DE']['gTimb'] = {
            iTiDE: data['tipoDocumento'],
            dDesTiDE: data['tipoDocumentoDescripcion'],
            dNumTim: params['timbradoNumero'],
            dEst: StringUtil_service_1.default.leftZero(data['establecimiento'], 3),
            dPunExp: StringUtil_service_1.default.leftZero(data['punto'], 3),
            dNumDoc: StringUtil_service_1.default.leftZero(data['numero'], 7),
        };
        if (data['numeroSerie']) {
            this.json['rDE']['DE']['gTimb']['dSerieNum'] = data['numeroSerie'];
        }
        if (data['serie']) {
            this.json['rDE']['DE']['gTimb']['dSerieNum'] = data['serie'];
        }
        //if (data['numeroSerie']) {
        this.json['rDE']['DE']['gTimb']['dFeIniT'] = params['timbradoFecha'].substring(0, 10);
        //}
    }
    /**
       * Genera los campos generales, divide las actividades en diferentes metodos
       *
       *  <gDatGralOpe>
              <dFeEmiDE>2020-05-07T15:03:57</dFeEmiDE>
          </gDatGralOpe>
       *
       * @param params
       * @param data
       * @param options
       */
    generateDatosGenerales(params, data, config) {
        this.json['rDE']['DE']['gDatGralOpe'] = {
            dFeEmiDE: data['fecha'],
        };
        this.generateDatosGeneralesInherentesOperacion(params, data, config);
        this.generateDatosGeneralesEmisorDE(params, data);
        if (config.userObjectRemove == false) {
            //Si está TRUE no crea el objeto usuario
            if (data['usuario']) {
                //No es obligatorio
                this.generateDatosGeneralesResponsableGeneracionDE(params, data);
            }
        }
        this.generateDatosGeneralesReceptorDE(params, data);
    }
    /**
       * D1. Campos inherentes a la operación comercial (D010-D099)
       * Pertenece al grupo de datos generales
       *
       * <gOpeCom>
              <iTipTra>1</iTipTra>
              <dDesTipTra>Venta de mercadería</dDesTipTra>
              <iTImp>1</iTImp>
              <dDesTImp>IVA</dDesTImp>
              <cMoneOpe>PYG</cMoneOpe>
              <dDesMoneOpe>Guarani</dDesMoneOpe>
          </gOpeCom>
       * @param params
       * @param data
       * @param options
       */
    generateDatosGeneralesInherentesOperacion(params, data, config) {
        if (data['tipoDocumento'] == 7) {
            //C002
            return; //No informa si el tipo de documento es 7
        }
        let moneda = data['moneda'];
        if (!moneda && config.defaultValues === true) {
            moneda = 'PYG';
        }
        this.json['rDE']['DE']['gDatGralOpe']['gOpeCom'] = {};
        if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 4) {
            //Obligatorio informar iTipTra D011
            if (!data['tipoTransaccion']) {
                //throw new Error('Debe proveer el Tipo de Transacción en data.tipoTransaccion');
            }
            this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['iTipTra'] = data['tipoTransaccion'];
            this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['dDesTipTra'] = constants_service_1.default.tiposTransacciones.filter((tt) => tt.codigo == data['tipoTransaccion'])[0]['descripcion'];
        }
        this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['iTImp'] = data['tipoImpuesto']; //D013
        this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['dDesTImp'] = constants_service_1.default.tiposImpuestos.filter((ti) => ti.codigo == data['tipoImpuesto'])[0]['descripcion']; //D013
        this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['cMoneOpe'] = moneda; //D015
        this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['dDesMoneOpe'] = constants_service_1.default.monedas.filter((m) => m.codigo == moneda)[0]['descripcion'];
        if (moneda != 'PYG') {
            if (!data['condicionTipoCambio']) {
                //throw new Error('Debe informar el tipo de Cambio en data.condicionTipoCambio');
            }
            //Obligatorio informar dCondTiCam D017
            this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['dCondTiCam'] = data['condicionTipoCambio'];
        }
        if (data['condicionTipoCambio'] == 1 && moneda != 'PYG') {
            if (!(data['cambio'] && data['cambio'] > 0)) {
                //throw new Error('Debe informar el valor del Cambio en data.cambio');
            }
            //Obligatorio informar dCondTiCam D018
            this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['dTiCam'] = data['cambio'];
        }
        if (data['condicionAnticipo']) {
            this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['iCondAnt'] = data['condicionAnticipo'];
            this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['dDesCondAnt'] =
                'Anticipo ' +
                    constants_service_1.default.globalPorItem.filter((ca) => ca.codigo == data['condicionAnticipo'])[0]['descripcion'];
        }
        if (data['obligaciones'] && Array.isArray(data['obligaciones'])) {
            let gOblAfe = new Array();
            for (let i = 0; i < data['obligaciones'].length; i++) {
                let gOblAfeItem = {};
                gOblAfeItem['cOblAfe'] = data['obligaciones'][i]['codigo'];
                //gOblAfeItem['dDesOblAfe'] = params['obligaciones'][i]['descripcion'];
                gOblAfeItem['dDesOblAfe'] = constants_service_1.default.obligaciones.filter((ca) => ca.codigo == +data['obligaciones'][i]['codigo'])[0]['descripcion'];
                gOblAfe.push(gOblAfeItem);
            }
            this.json['rDE']['DE']['gDatGralOpe']['gOpeCom']['gOblAfe'] = gOblAfe;
        }
    }
    /**
     * D2. Campos que identifican al emisor del Documento Electrónico DE (D100-D129)
     * Pertenece al grupo de datos generales
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosGeneralesEmisorDE(params, data) {
        if (!(params && params.establecimientos)) {
            //throw new Error('Debe proveer un Array con la información de los establecimientos en params');
        }
        //Validar si el establecimiento viene en params
        let establecimiento = StringUtil_service_1.default.leftZero(data['establecimiento'], 3);
        //let punto = stringUtilService.leftZero(data['punto'], 3);
        if (params.establecimientos.filter((um) => um.codigo === establecimiento).length == 0) {
            /*throw new Error(
              "Establecimiento '" +
                establecimiento +
                "' no encontrado en params.establecimientos*.codigo. Valores: " +
                params.establecimientos.map((a: any) => a.codigo + '-' + a.denominacion),
            );*/
        }
        if (params['ruc'].indexOf('-') == -1) {
            //throw new Error('RUC debe contener dígito verificador en params.ruc');
        }
        this.json['rDE']['DE']['gDatGralOpe']['gEmis'] = {};
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dRucEm'] = params['ruc'].split('-')[0];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dDVEmi'] = params['ruc'].split('-')[1];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['iTipCont'] = params['tipoContribuyente'];
        if (typeof params['tipoRegimen'] != undefined) {
            this.json['rDE']['DE']['gDatGralOpe']['gEmis']['cTipReg'] = params['tipoRegimen'];
        }
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dNomEmi'] = params['razonSocial'];
        if (params['nombreFantasia'] && (params['nombreFantasia'] + '').length > 0) {
            this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dNomFanEmi'] = params['nombreFantasia'];
        }
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dDirEmi'] = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['direccion'];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dNumCas'] = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['numeroCasa'];
        let dCompDir1 = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['complementoDireccion1'];
        if (dCompDir1 && (dCompDir1 + '').length > 1) {
            this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dCompDir1'] = dCompDir1;
        }
        let dCompDir2 = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['complementoDireccion2'];
        if (dCompDir2 && (dCompDir2 + '').length > 1) {
            this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dCompDir2'] = dCompDir2;
        }
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['cDepEmi'] = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['departamento'];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dDesDepEmi'] = constants_service_1.default.departamentos.filter((td) => td.codigo === params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['departamento'])[0]['descripcion'];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['cDisEmi'] = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['distrito'];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dDesDisEmi'] = constants_service_1.default.distritos.filter((td) => td.codigo === params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['distrito'])[0]['descripcion'];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['cCiuEmi'] = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['ciudad'];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dDesCiuEmi'] = constants_service_1.default.ciudades.filter((td) => td.codigo === params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['ciudad'])[0]['descripcion'];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dTelEmi'] = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['telefono'];
        if (params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['email']) {
            let email = new String(params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['email']); //Hace una copia, para no alterar.
            //Verificar si tiene varios correos.
            if (email.indexOf(',') > -1) {
                //Si el Email tiene , (coma) entonces va enviar solo el primer valor, ya que SIFEN no acepta Comas
                email = email.split(',')[0].trim();
            }
            this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dEmailE'] = email.trim();
        }
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['dDenSuc'] = params['establecimientos'].filter((e) => e.codigo === establecimiento)[0]['denominacion'];
        if (params['actividadesEconomicas'] && params['actividadesEconomicas'].length > 0) {
            this.json['rDE']['DE']['gDatGralOpe']['gEmis']['gActEco'] = [];
            for (let i = 0; i < params['actividadesEconomicas'].length; i++) {
                const actividadEconomica = params['actividadesEconomicas'][i];
                const gActEco = {
                    cActEco: actividadEconomica.codigo,
                    dDesActEco: actividadEconomica.descripcion,
                };
                this.json['rDE']['DE']['gDatGralOpe']['gEmis']['gActEco'].push(gActEco);
            }
        }
        else {
            //throw new Error('Debe proveer el array de actividades económicas en params.actividadesEconomicas');
        }
    }
    /**
     * Datos generales del responsable de generacion del DE
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosGeneralesResponsableGeneracionDE(params, data) {
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['gRespDE'] = {
            iTipIDRespDE: data['usuario']['documentoTipo'],
            dDTipIDRespDE: constants_service_1.default.tiposDocumentosIdentidades.filter((td) => td.codigo === +data['usuario']['documentoTipo'])[0]['descripcion'],
        };
        if (data['usuario']['documentoTipo'] == 9) {
            this.json['rDE']['DE']['gDatGralOpe']['gEmis']['gRespDE']['dDTipIDRespDE'] =
                data['usuario']['documentoTipoDescripcion'];
        }
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['gRespDE']['dNumIDRespDE'] = data['usuario']['documentoNumero'];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['gRespDE']['dNomRespDE'] = data['usuario']['nombre'];
        this.json['rDE']['DE']['gDatGralOpe']['gEmis']['gRespDE']['dCarRespDE'] = data['usuario']['cargo'];
    }
    /**
       * Datos generales del receptor del documento electrónico
       * Pertenece al grupo de datos generales
       *
       * <gDatRec>
                  <iNatRec>1</iNatRec>
                  <iTiOpe>1</iTiOpe>
                  <cPaisRec>PRY</cPaisRec>
                  <dDesPaisRe>Paraguay</dDesPaisRe>
                  <iTiContRec>2</iTiContRec>
                  <dRucRec>00000002</dRucRec>
                  <dDVRec>7</dDVRec>
                  <dNomRec>RECEPTOR DEL DOCUMENTO</dNomRec>
                  <dDirRec>CALLE 1 ENTRE CALLE 2 Y CALLE 3</dDirRec>
                  <dNumCasRec>123</dNumCasRec>
                  <cDepRec>1</cDepRec>
                  <dDesDepRec>CAPITAL</dDesDepRec>
                  <cDisRec>1</cDisRec>
                  <dDesDisRec>ASUNCION (DISTRITO)</dDesDisRec>
                  <cCiuRec>1</cCiuRec>
                  <dDesCiuRec>ASUNCION (DISTRITO)</dDesCiuRec>
                  <dTelRec>012123456</dTelRec>
                  <dCodCliente>AAA</dCodCliente>
              </gDatRec>
       *
       * @param params
       * @param data
       * @param options
       */
    generateDatosGeneralesReceptorDE(params, data) {
        this.json['rDE']['DE']['gDatGralOpe']['gDatRec'] = {
            iNatRec: data['cliente']['contribuyente'] ? 1 : 2,
            iTiOpe: +data['cliente']['tipoOperacion'],
            cPaisRec: data['cliente']['pais'],
            dDesPaisRe: constants_service_1.default.paises.filter((pais) => pais.codigo === data['cliente']['pais'])[0]['descripcion'],
        };
        if (data['cliente']['contribuyente']) {
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['iTiContRec'] = data['cliente']['tipoContribuyente'];
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dRucRec'] = (data['cliente']['ruc'].split('-')[0] + '').trim();
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dDVRec'] = (data['cliente']['ruc'].split('-')[1] + '').trim();
        }
        //if (!data['cliente']['contribuyente'] && data['cliente']['tipoOperacion']) { 2024-09-03
        if (!data['cliente']['contribuyente']) {
            //Obligatorio completar D210
            if (data['cliente']['documentoTipo']) {
                this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['iTipIDRec'] = +data['cliente']['documentoTipo'];
                this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dDTipIDRec'] =
                    constants_service_1.default.tiposDocumentosReceptor.filter((tdr) => tdr.codigo === +data['cliente']['documentoTipo'])[0]['descripcion'];
            }
            if (+data['cliente']['documentoTipo'] == 9) {
                this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dDTipIDRec'] = data['cliente']['documentoTipoDescripcion'];
            }
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dNumIDRec'] = (data['cliente']['documentoNumero'] + '').trim();
            if (+data['cliente']['documentoTipo'] === 5) {
                //Si es innominado completar con cero
                this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dNumIDRec'] = '0';
                this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dNomRec'] = 'Sin Nombre';
            }
        }
        this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dNomRec'] = data['cliente']['razonSocial'].trim();
        if (data['cliente']['nombreFantasia']) {
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dNomFanRec'] = data['cliente']['nombreFantasia'].trim();
        }
        if (data['cliente']['direccion']) {
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dDirRec'] = data['cliente']['direccion'].trim();
        }
        if (data['cliente']['numeroCasa']) {
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dNumCasRec'] = (data['cliente']['numeroCasa'] + '').trim();
        }
        //
        if (data['cliente']['direccion'] && +data['cliente']['tipoOperacion'] != 4) {
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['cDepRec'] = +data['cliente']['departamento'];
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dDesDepRec'] = constants_service_1.default.departamentos.filter((td) => td.codigo === +data['cliente']['departamento'])[0]['descripcion'];
        }
        if (data['cliente']['direccion'] && +data['cliente']['tipoOperacion'] != 4) {
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['cDisRec'] = +data['cliente']['distrito'];
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dDesDisRec'] = constants_service_1.default.distritos.filter((td) => td.codigo === +data['cliente']['distrito'])[0]['descripcion'];
        }
        if (data['cliente']['direccion'] && +data['cliente']['tipoOperacion'] != 4) {
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['cCiuRec'] = +data['cliente']['ciudad'];
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dDesCiuRec'] = constants_service_1.default.ciudades.filter((td) => td.codigo === +data['cliente']['ciudad'])[0]['descripcion'];
        }
        //Asignar null a departamento, distrito y ciudad si tipoOperacion = 4
        if (data['cliente']['telefono']) {
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec'].dTelRec = (data['cliente']['telefono'] + '').trim();
        }
        /*    if (data['cliente']['celular']) {
          this.json['rDE']['DE']['gDatGralOpe']['gDatRec'].dCelRec = (data['cliente']['celular'] + '').trim();
        }*/
        if (data['cliente']['celular']) {
            let celular = data['cliente']['celular'].trim();
            if (celular.indexOf(',') > -1) {
                //Si el Celular tiene , (coma) entonces va enviar solo el primer valor, ya que SIFEN no acepta Comas
                celular = celular.split(',')[0].trim();
            }
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec'].dCelRec = celular;
        }
        if (data['cliente']['email']) {
            let email = new String(data['cliente']['email']); //Hace una copia, para no alterar.
            //Verificar si tiene varios correos.
            if (email.indexOf(',') > -1) {
                //Si el Email tiene , (coma) entonces va enviar solo el primer valor, ya que SIFEN no acepta Comas
                email = email.split(',')[0].trim();
            }
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec'].dEmailRec = email.trim();
        }
        if (data['cliente']['codigo']) {
            this.json['rDE']['DE']['gDatGralOpe']['gDatRec']['dCodCliente'] = (data['cliente']['codigo'] + '').trim();
        }
    }
    /**
     * Campos que seran especificos de acuerdo a cada tipo de documento electronico
     * Se dividiran en diferentes métodos por cada tipo de factura.
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosEspecificosPorTipoDE(params, data, config) {
        this.json['rDE']['DE']['gDtipDE'] = {};
        if (+data['tipoDocumento'] === 1) {
            this.generateDatosEspecificosPorTipoDE_FacturaElectronica(params, data, config);
        }
        if (+data['tipoDocumento'] === 4) {
            this.generateDatosEspecificosPorTipoDE_Autofactura(params, data);
        }
        if (+data['tipoDocumento'] === 5 || data['tipoDocumento'] === 6) {
            this.generateDatosEspecificosPorTipoDE_NotaCreditoDebito(params, data);
        }
        if (+data['tipoDocumento'] === 7) {
            this.generateDatosEspecificosPorTipoDE_RemisionElectronica(params, data);
        }
    }
    /**
     * Datos especificos para la factura electronica
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosEspecificosPorTipoDE_FacturaElectronica(params, data, config) {
        if (constants_service_1.default.indicadoresPresencias.filter((um) => um.codigo === +data['factura']['presencia']).length ==
            0) {
            /*throw new Error(
              "Indicador de Presencia '" +
                data['factura']['presencia'] +
                "' en data.factura.presencia no encontrado. Valores: " +
                constanteService.indicadoresPresencias.map((a: any) => a.codigo + '-' + a.descripcion),
            );*/
        }
        this.json['rDE']['DE']['gDtipDE']['gCamFE'] = {
            iIndPres: data['factura']['presencia'],
            dDesIndPres: constants_service_1.default.indicadoresPresencias.filter((ip) => ip.codigo === +data['factura']['presencia'])[0]['descripcion'],
        };
        if (data['factura']['fechaEnvio']) {
            let fechaFactura = new Date(data['fecha']);
            let fechaEnvio = new Date(data['factura']['fechaEnvio']);
            if (fechaFactura.getTime() > fechaEnvio.getTime()) {
                /*throw new Error(
                  "La Fecha de envío '" +
                    data['factura']['fechaEnvio'] +
                    "'en data.factura.fechaEnvio, debe ser despues de la fecha de Factura",
                );*/
            }
            this.json['rDE']['DE']['gDtipDE']['gCamFE']['dFecEmNR'] = data['factura']['fechaEnvio'];
        }
        if (data['cliente']['tipoOperacion'] === 3) {
            this.generateDatosEspecificosPorTipoDE_ComprasPublicas(params, data);
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
    generateDatosEspecificosPorTipoDE_ComprasPublicas(params, data) {
        if (data['dncp'] &&
            data['dncp']['modalidad'] &&
            data['dncp']['entidad'] &&
            data['dncp']['año'] &&
            data['dncp']['secuencia'] &&
            data['dncp']['fecha']) {
            this.json['rDE']['DE']['gDtipDE']['gCamFE']['gCompPub'] = {
                dModCont: data['dncp']['modalidad'],
                dEntCont: data['dncp']['entidad'],
                dAnoCont: data['dncp']['año'],
                dSecCont: data['dncp']['secuencia'],
                dFeCodCont: data['dncp']['fecha'],
            };
        }
    }
    generateDatosEspecificosPorTipoDE_Autofactura(params, data) {
        this.json['rDE']['DE']['gDtipDE']['gCamAE'] = {
            iNatVen: data['autoFactura']['tipoVendedor'],
            dDesNatVen: constants_service_1.default.naturalezaVendedorAutofactura.filter((nv) => nv.codigo === data['autoFactura']['tipoVendedor'])[0]['descripcion'],
            iTipIDVen: data['autoFactura']['documentoTipo'],
            dDTipIDVen: constants_service_1.default.tiposDocumentosIdentidades.filter((td) => td.codigo === data['autoFactura']['documentoTipo'])[0]['descripcion'],
            dNumIDVen: data['autoFactura']['documentoNumero'],
            dNomVen: data['autoFactura']['nombre'],
            dDirVen: data['autoFactura']['direccion'],
            dNumCasVen: data['autoFactura']['numeroCasa'],
            cDepVen: +data['autoFactura']['departamento'],
            dDesDepVen: constants_service_1.default.departamentos.filter((td) => td.codigo === +data['autoFactura']['departamento'])[0]['descripcion'],
            cDisVen: +data['autoFactura']['distrito'],
            dDesDisVen: constants_service_1.default.distritos.filter((td) => td.codigo === +data['autoFactura']['distrito'])[0]['descripcion'],
            cCiuVen: +data['autoFactura']['ciudad'],
            dDesCiuVen: constants_service_1.default.ciudades.filter((td) => td.codigo === +data['autoFactura']['ciudad'])[0]['descripcion'],
            dDirProv: data['autoFactura']['ubicacion']['lugar'],
            cDepProv: +data['autoFactura']['ubicacion']['departamento'],
            dDesDepProv: constants_service_1.default.departamentos.filter((td) => td.codigo === +data['autoFactura']['ubicacion']['departamento'])[0]['descripcion'],
            cDisProv: +data['autoFactura']['ubicacion']['distrito'],
            dDesDisProv: constants_service_1.default.distritos.filter((td) => td.codigo === +data['autoFactura']['ubicacion']['distrito'])[0]['descripcion'],
            cCiuProv: +data['autoFactura']['ubicacion']['ciudad'],
            dDesCiuProv: constants_service_1.default.ciudades.filter((td) => td.codigo === +data['autoFactura']['ubicacion']['ciudad'])[0]['descripcion'],
        };
    }
    generateDatosEspecificosPorTipoDE_NotaCreditoDebito(params, data) {
        this.json['rDE']['DE']['gDtipDE']['gCamNCDE'] = {
            iMotEmi: +data['notaCreditoDebito']['motivo'],
            dDesMotEmi: constants_service_1.default.notasCreditosMotivos.filter((nv) => nv.codigo === +data['notaCreditoDebito']['motivo'])[0]['descripcion'],
        };
    }
    generateDatosEspecificosPorTipoDE_RemisionElectronica(params, data) {
        this.json['rDE']['DE']['gDtipDE']['gCamNRE'] = {
            iMotEmiNR: +data['remision']['motivo'],
            dDesMotEmiNR: constants_service_1.default.remisionesMotivos.filter((nv) => nv.codigo === +data['remision']['motivo'])[0]['descripcion'],
            iRespEmiNR: +data['remision']['tipoResponsable'],
            dDesRespEmiNR: constants_service_1.default.remisionesResponsables.filter((nv) => nv.codigo === +data['remision']['tipoResponsable'])[0]['descripcion'],
        };
        if (+data['remision']['motivo'] == 99) {
            this.json['rDE']['DE']['gDtipDE']['gCamNRE']['dDesMotEmiNR'] = data['remision']['motivoDescripcion'];
        }
        //if (data['remision']['kms']) {
        //NT009 pasa a ser obligatorio
        this.json['rDE']['DE']['gDtipDE']['gCamNRE']['dKmR'] = data['remision']['kms'];
        //}
        if (data['remision']['fechaFactura']) {
            this.json['rDE']['DE']['gDtipDE']['gCamNRE']['dFecEm'] = data['remision']['fechaFactura'];
        }
        if (data['remision']['costoFlete']) {
            this.json['rDE']['DE']['gDtipDE']['gCamNRE']['cPreFle'] = data['remision']['costoFlete'];
        }
    }
    /**
     * E7. Campos que describen la condición de la operación (E600-E699)
     * @param params
     * @param data
     * @param options
     */
    generateDatosCondicionOperacionDE(params, data, config) {
        if (!data['condicion']) {
            return;
        }
        if (constants_service_1.default.condicionesOperaciones.filter((um) => um.codigo === data['condicion']['tipo']).length == 0) {
            /*throw new Error(
              "Condición de la Operación '" +
                data['condicion']['tipo'] +
                "' en data.condicion.tipo no encontrado. Valores: " +
                constanteService.condicionesOperaciones.map((a: any) => a.codigo + '-' + a.descripcion),
            );*/
        }
        this.json['rDE']['DE']['gDtipDE']['gCamCond'] = {
            iCondOpe: data['condicion']['tipo'],
            dDCondOpe: constants_service_1.default.condicionesOperaciones.filter((co) => co.codigo === data['condicion']['tipo'])[0]['descripcion'],
        };
        //if (data['condicion']['tipo'] === 1) {
        this.generateDatosCondicionOperacionDE_Contado(params, data, config);
        //}
        if (data['condicion']['tipo'] === 2) {
            this.generateDatosCondicionOperacionDE_Credito(params, data, config);
        }
    }
    /**
     * E7.1. Campos que describen la forma de pago de la operación al contado o del monto
     * de la entrega inicial (E605-E619)
     * @param params
     * @param data
     * @param options
     */
    generateDatosCondicionOperacionDE_Contado(params, data, config) {
        if (data['condicion']['entregas'] && data['condicion']['entregas'].length > 0) {
            const entregas = [];
            for (let i = 0; i < data['condicion']['entregas'].length; i++) {
                const dataEntrega = data['condicion']['entregas'][i];
                const cuotaInicialEntrega = {
                    iTiPago: dataEntrega['tipo'],
                    dDesTiPag: constants_service_1.default.condicionesTiposPagos.filter((co) => co.codigo === dataEntrega['tipo'])[0]['descripcion'],
                };
                cuotaInicialEntrega['dMonTiPag'] = parseFloat(dataEntrega['monto']).toFixed(4);
                /*if (data.moneda === 'PYG') {
                  //Maximo 4 decimales
                  let cantDecimalesMontoTipoPago = config.pygDecimals;
                  if (cantDecimalesMontoTipoPago > 4) {
                    cantDecimalesMontoTipoPago = 4;
                  }
                  cuotaInicialEntrega['dMonTiPag'] = parseFloat(dataEntrega['monto']).toFixed(cantDecimalesMontoTipoPago);
                }*/
                if (dataEntrega['tipo'] == 99) {
                    cuotaInicialEntrega['dDesTiPag'] = dataEntrega['tipoDescripcion'];
                }
                cuotaInicialEntrega['cMoneTiPag'] = dataEntrega['moneda'];
                cuotaInicialEntrega['dDMoneTiPag'] = constants_service_1.default.monedas.filter((m) => m.codigo == dataEntrega['moneda'])[0]['descripcion'];
                if (dataEntrega['moneda'] != 'PYG') {
                    if (dataEntrega['cambio']) {
                        cuotaInicialEntrega['dTiCamTiPag'] = dataEntrega['cambio'];
                    }
                }
                //Verificar si el Pago es con Tarjeta de crédito
                if (dataEntrega['tipo'] === 3 || dataEntrega['tipo'] === 4) {
                    cuotaInicialEntrega['gPagTarCD'] = {
                        iDenTarj: dataEntrega['infoTarjeta']['tipo'],
                        dDesDenTarj: +dataEntrega['infoTarjeta']['tipo'] === 99
                            ? dataEntrega['infoTarjeta']['tipoDescripcion']
                            : constants_service_1.default.tarjetasCreditosTipos.filter((co) => co.codigo === dataEntrega['infoTarjeta']['tipo'])[0]['descripcion'],
                    };
                    if (dataEntrega['infoTarjeta']['razonSocial'] && dataEntrega['infoTarjeta']['ruc']) {
                        //Solo si se envia éste dato
                        cuotaInicialEntrega['gPagTarCD']['dRSProTar'] = dataEntrega['infoTarjeta']['razonSocial'];
                        cuotaInicialEntrega['gPagTarCD']['dRUCProTar'] = dataEntrega['infoTarjeta']['ruc'].split('-')[0];
                        cuotaInicialEntrega['gPagTarCD']['dDVProTar'] = dataEntrega['infoTarjeta']['ruc'].split('-')[1];
                    }
                    cuotaInicialEntrega['gPagTarCD']['iForProPa'] = dataEntrega['infoTarjeta']['medioPago'];
                    if (dataEntrega['infoTarjeta']['codigoAutorizacion']) {
                        if (!((dataEntrega['infoTarjeta']['codigoAutorizacion'] + '').length >= 6 &&
                            (dataEntrega['infoTarjeta']['codigoAutorizacion'] + '').length <= 10)) {
                            /*throw new Error(
                              'El código de Autorización en data.condicion.entregas[' +
                                i +
                                '].infoTarjeta.codigoAutorizacion debe tener de 6 y 10 caracteres',
                            );*/
                        }
                        cuotaInicialEntrega['gPagTarCD']['dCodAuOpe'] = +dataEntrega['infoTarjeta']['codigoAutorizacion'];
                    }
                    if (dataEntrega['infoTarjeta']['titular']) {
                        cuotaInicialEntrega['gPagTarCD']['dNomTit'] = dataEntrega['infoTarjeta']['titular'];
                    }
                    if (dataEntrega['infoTarjeta']['numero']) {
                        cuotaInicialEntrega['gPagTarCD']['dNumTarj'] = dataEntrega['infoTarjeta']['numero'];
                    }
                }
                //Verificar si el Pago es con Cheque
                if (dataEntrega['tipo'] === 2) {
                    if (!dataEntrega['infoCheque']) {
                        /*throw new Error(
                          'Debe informar sobre el cheque en data.condicion.entregas[' +
                            i +
                            '].infoCheque si la forma de Pago es 2-Cheques',
                        );*/
                    }
                    cuotaInicialEntrega['gPagCheq'] = {
                        dNumCheq: StringUtil_service_1.default.leftZero(dataEntrega['infoCheque']['numeroCheque'], 8),
                        dBcoEmi: dataEntrega['infoCheque']['banco'],
                    };
                }
                entregas.push(cuotaInicialEntrega);
            }
            this.json['rDE']['DE']['gDtipDE']['gCamCond']['gPaConEIni'] = entregas; //Array de Entregas
        }
    }
    /**
     * E7.2. Campos que describen la operación a crédito (E640-E649)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosCondicionOperacionDE_Credito(params, data, config) {
        if (!data['condicion']['credito']['tipo']) {
            /*throw new Error(
              'El tipo de Crédito en data.condicion.credito.tipo es obligatorio si la condición posee créditos',
            );*/
        }
        if (constants_service_1.default.condicionesCreditosTipos.filter((um) => um.codigo === data['condicion']['credito']['tipo'])
            .length == 0) {
            /*throw new Error(
              "Tipo de Crédito '" +
                data['condicion']['credito']['tipo'] +
                "' en data.condicion.credito.tipo no encontrado. Valores: " +
                constanteService.condicionesCreditosTipos.map((a: any) => a.codigo + '-' + a.descripcion),
            );*/
        }
        this.json['rDE']['DE']['gDtipDE']['gCamCond']['gPagCred'] = {
            iCondCred: data['condicion']['credito']['tipo'],
            dDCondCred: constants_service_1.default.condicionesCreditosTipos.filter((co) => co.codigo === +data['condicion']['credito']['tipo'])[0]['descripcion'],
        };
        if (+data['condicion']['credito']['tipo'] === 1) {
            //Plazo
            this.json['rDE']['DE']['gDtipDE']['gCamCond']['gPagCred']['dPlazoCre'] = data['condicion']['credito']['plazo'];
        }
        if (+data['condicion']['credito']['tipo'] === 2) {
            //Cuota
            if (!data['condicion']['credito']['cuotas']) {
                /*throw new Error(
                  'El tipo de Crédito en data.condicion.credito.tipo es 2 entonces data.condicion.credito.cuotas es obligatorio',
                );*/
            }
            this.json['rDE']['DE']['gDtipDE']['gCamCond']['gPagCred']['dCuotas'] = +data['condicion']['credito']['cuotas'];
        }
        if (data['condicion']['entregas'] && data['condicion']['entregas'].length > 0) {
            let sumaEntregas = 0;
            //Obtiene la sumatoria
            for (let i = 0; i < data['condicion']['entregas'].length; i++) {
                const entrega = data['condicion']['entregas'][i];
                sumaEntregas += entrega['monto']; //Y cuando es de moneda diferente ? como hace?
            }
            this.json['rDE']['DE']['gDtipDE']['gCamCond']['gPagCred']['dMonEnt'] = sumaEntregas;
        }
        //Recorrer array de infoCuotas e informar en el JSON
        if (data['condicion']['credito']['tipo'] === 2) {
            this.json['rDE']['DE']['gDtipDE']['gCamCond']['gPagCred']['gCuotas'] = [];
            //A Cuotas
            if (data['condicion']['credito']['infoCuotas'] && data['condicion']['credito']['infoCuotas'].length > 0) {
                for (let i = 0; i < data['condicion']['credito']['infoCuotas'].length; i++) {
                    const infoCuota = data['condicion']['credito']['infoCuotas'][i];
                    if (constants_service_1.default.monedas.filter((um) => um.codigo === infoCuota['moneda']).length == 0) {
                        /*throw new Error(
                          "Moneda '" +
                            infoCuota['moneda'] +
                            "' en data.condicion.credito.infoCuotas[" +
                            i +
                            '].moneda no encontrado. Valores: ' +
                            constanteService.monedas.map((a: any) => a.codigo + '-' + a.descripcion),
                        );*/
                    }
                    const gCuotas = {
                        cMoneCuo: infoCuota['moneda'],
                        dDMoneCuo: constants_service_1.default.monedas.filter((co) => co.codigo === infoCuota['moneda'])[0]['descripcion'],
                        dMonCuota: infoCuota['monto'],
                    };
                    if (infoCuota['vencimiento']) {
                        gCuotas['dVencCuo'] = infoCuota['vencimiento'];
                    }
                    this.json['rDE']['DE']['gDtipDE']['gCamCond']['gPagCred']['gCuotas'].push(gCuotas);
                }
            }
            else {
                //throw new Error('Debe proporcionar data.condicion.credito.infoCuotas[]');
            }
        }
    }
    normalizeXML(xml) {
        xml = xml.split('\r\n').join('');
        xml = xml.split('\n').join('');
        xml = xml.split('\t').join('');
        xml = xml.split('    ').join('');
        xml = xml.split('>    <').join('><');
        xml = xml.split('>  <').join('><');
        xml = xml.replace(/\r?\n|\r/g, '');
        return xml;
    }
    getPaises() {
        return constants_service_1.default.paises;
    }
    getDepartamentos() {
        return constants_service_1.default.departamentos;
    }
    getDistritos(departamento) {
        if (departamento) {
            return constants_service_1.default.distritos.filter((dis) => dis.departamento === departamento);
        }
        else {
            return constants_service_1.default.distritos;
        }
    }
    getCiudades(distrito) {
        if (distrito) {
            return constants_service_1.default.ciudades.filter((ciu) => ciu.distrito === distrito);
        }
        else {
            return constants_service_1.default.ciudades;
        }
    }
    getTiposRegimenes() {
        return constants_service_1.default.tiposRegimenes;
    }
    getDepartamento(departamentoId) {
        return constants_service_1.default.departamentos.filter((dis) => dis.codigo === departamentoId);
    }
    getDistrito(distritoId) {
        return constants_service_1.default.distritos.filter((dis) => dis.codigo === distritoId);
    }
    getCiudad(ciudadId) {
        return constants_service_1.default.ciudades.filter((ciu) => ciu.codigo === ciudadId);
    }
}
exports.default = new JSonDeMainService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkRlTWFpbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2pzb25EZU1haW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBaUM7QUFFakMsOEVBQXFEO0FBQ3JELDRFQUFtRDtBQUNuRCw0RUFBbUQ7QUFDbkQsZ0ZBQWdEO0FBQ2hELDRGQUE0RDtBQUM1RCxvR0FBcUU7QUFDckUsNEZBQTREO0FBQzVELHNGQUFzRDtBQUN0RCw0SEFBeUY7QUFDekYsc0hBQXNGO0FBQ3RGLDhGQUE4RDtBQUc5RCxNQUFNLGlCQUFpQjtJQUF2QjtRQUNFLG9CQUFlLEdBQVEsSUFBSSxDQUFDO1FBQzVCLGtCQUFhLEdBQVEsSUFBSSxDQUFDO1FBQzFCLFNBQUksR0FBUSxFQUFFLENBQUM7UUFDZixrQkFBYSxHQUFHLElBQUksQ0FBQztJQSt6RHZCLENBQUM7SUE3ekRRLGFBQWEsQ0FBQyxNQUFXLEVBQUUsSUFBUyxFQUFFLE1BQXFCO1FBQ2hFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSTtnQkFDRixJQUFJLGFBQWEsR0FBaUI7b0JBQ2hDLGFBQWEsRUFBRSxJQUFJO29CQUNuQiw4QkFBOEI7b0JBQzlCLGNBQWMsRUFBRSxJQUFJO29CQUNwQixVQUFVLEVBQUUsRUFBRTtvQkFDZCxjQUFjLEVBQUUsSUFBSTtvQkFDcEIsUUFBUSxFQUFFLENBQUM7b0JBQ1gsV0FBVyxFQUFFLENBQUM7b0JBQ2QsV0FBVyxFQUFFLENBQUM7b0JBQ2Qsa0JBQWtCLEVBQUUsQ0FBQztvQkFDckIsY0FBYyxFQUFFLENBQUM7b0JBQ2pCLGdCQUFnQixFQUFFLEtBQUs7b0JBQ3ZCLElBQUksRUFBRSxLQUFLO29CQUNYLDhCQUE4QixFQUFFLEtBQUs7aUJBQ3RDLENBQUM7Z0JBRUYsYUFBYSxHQUFHLE1B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