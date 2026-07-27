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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js = __importStar(require("xml2js"));
const FechaUtil_service_1 = __importDefault(require("./FechaUtil.service"));
const constants_service_1 = __importDefault(require("./constants.service"));
const StringUtil_service_1 = __importDefault(require("./StringUtil.service"));
class JSonEventoMainService {
    constructor() {
        this.codigoSeguridad = null;
        this.codigoControl = null;
        this.json = {};
    }
    generateXMLEventoCancelacion(id, params, data, config) {
        data.tipoEvento = 1; //Cancelacion
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let xml = yield this.generateXMLEventoService(params, data);
                xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
                let soapXMLData = this.envelopeEvent(id, xml);
                resolve(soapXMLData);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    generateXMLEventoInutilizacion(id, params, data, config) {
        data.tipoEvento = 2; //Inutilizacion
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let xml = yield this.generateXMLEventoService(params, data);
                xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
                let soapXMLData = this.envelopeEvent(id, xml);
                /*if (config && config.debug === true) {
                  console.log("generateXMLEventoInutilizacion", soapXMLData); //TODO Agregar esto a todos los demas
                }*/
                resolve(soapXMLData);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    generateXMLEventoConformidad(id, params, data, config) {
        data.tipoEvento = 11; //Conformidad
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let xml = yield this.generateXMLEventoService(params, data);
                xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
                let soapXMLData = this.envelopeEvent(id, xml);
                resolve(soapXMLData);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    generateXMLEventoDisconformidad(id, params, data, config) {
        data.tipoEvento = 12; //Disconformidad
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let xml = yield this.generateXMLEventoService(params, data);
                xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
                let soapXMLData = this.envelopeEvent(id, xml);
                resolve(soapXMLData);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    generateXMLEventoDesconocimiento(id, params, data, config) {
        data.tipoEvento = 13; //Desconocimiento
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let xml = yield this.generateXMLEventoService(params, data);
                xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
                let soapXMLData = this.envelopeEvent(id, xml);
                resolve(soapXMLData);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    generateXMLEventoNotificacion(id, params, data, config) {
        data.tipoEvento = 14; //Notificacion
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let xml = yield this.generateXMLEventoService(params, data);
                xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
                let soapXMLData = this.envelopeEvent(id, xml);
                resolve(soapXMLData);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    generateXMLEventoNominacion(id, params, data, config) {
        data.tipoEvento = 15; //Nominacion
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let xml = yield this.generateXMLEventoService(params, data);
                xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
                let soapXMLData = this.envelopeEvent(id, xml);
                resolve(soapXMLData);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    generateXMLEventoActualizacionDatosTransporte(id, params, data, config) {
        data.tipoEvento = 16; //ActualizacionDatosTransporte
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let xml = yield this.generateXMLEventoService(params, data);
                xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');
                let soapXMLData = this.envelopeEvent(id, xml);
                resolve(soapXMLData);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    envelopeEvent(id, xml) {
        return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
                <env:Header/>\n\
                <env:Body>\n\
                    <rEnviEventoDe xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                      <dId>${id}</dId>\n\
                      <dEvReg>${xml}</dEvReg>\n\
                    </rEnviEventoDe>\n\
                </env:Body>\n\
            </env:Envelope>\n`;
    }
    /**
     * Metodo principal de generacion de XML del Evento
     * @param params
     * @param data
     * @returns
     */
    generateXMLEventoService(params, data) {
        this.addUnderscore(data);
        this.validateValues(data);
        this.addDefaultValues(data);
        this.json = {};
        //this.generateCodigoSeguridad(params, data); //Primero genera el codigo de seguridad aleatorio único
        //this.generateCodigoControl(params, data); //Luego genera el código de Control
        //this.generateRte(params);
        this.json['gGroupGesEve'] = {};
        this.json['gGroupGesEve']['rGesEve'] = {};
        this.json['gGroupGesEve']['$'] = {};
        this.json['gGroupGesEve']['$']['xmlns:xsi'] = 'http://www.w3.org/2001/XMLSchema-instance';
        this.json['gGroupGesEve']['$']['xsi:schemaLocation'] = 'http://ekuatia.set.gov.py/sifen/xsd siRecepEvento_v150.xsd';
        this.json['gGroupGesEve']['rGesEve']['rEve'] = {};
        this.json['gGroupGesEve']['rGesEve']['rEve']['$'] = {};
        this.json['gGroupGesEve']['rGesEve']['rEve']['$']['Id'] = 1;
        let fechaFirmaDigital = new Date();
        if (data.fechaFirmaDigital) {
            fechaFirmaDigital = new Date(data.fechaFirmaDigital);
        }
        this.json['gGroupGesEve']['rGesEve']['rEve']['dFecFirma'] = FechaUtil_service_1.default.convertToJSONFormat(fechaFirmaDigital);
        this.json['gGroupGesEve']['rGesEve']['rEve']['dVerFor'] = params.version;
        this.json['gGroupGesEve']['rGesEve']['rEve']['gGroupTiEvt'] = {};
        //Emisor
        if (data.tipoEvento == 1) {
            this.json['gGroupGesEve']['rGesEve']['rEve']['gGroupTiEvt'] = this.eventosEmisorCancelacion(params, data);
        }
        if (data.tipoEvento == 2) {
            this.json['gGroupGesEve']['rGesEve']['rEve']['gGroupTiEvt'] = this.eventosEmisorInutilizacion(params, data);
        }
        //if (data.tipoEvento == 3) {
        //this.json['gGroupGesEve']['rGesEve']['gGroupTiEvt'] = this.eventos(params, data);
        //}
        //Receptor (empieza en 11)
        if (data.tipoEvento == 11) {
            this.json['gGroupGesEve']['rGesEve']['rEve']['gGroupTiEvt'] = this.eventosReceptorConformidad(params, data);
        }
        if (data.tipoEvento == 12) {
            this.json['gGroupGesEve']['rGesEve']['rEve']['gGroupTiEvt'] = this.eventosReceptorDisconformidad(params, data);
        }
        if (data.tipoEvento == 13) {
            this.json['gGroupGesEve']['rGesEve']['rEve']['gGroupTiEvt'] = this.eventosReceptorDesconocimiento(params, data);
        }
        if (data.tipoEvento == 14) {
            this.json['gGroupGesEve']['rGesEve']['rEve']['gGroupTiEvt'] = this.eventosReceptorNotificacionRecepcion(params, data);
        }
        if (data.tipoEvento == 15) {
            this.json['gGroupGesEve']['rGesEve']['rEve']['gGroupTiEvt'] = this.eventoEmisorNominacion(params, data);
        }
        if (data.tipoEvento == 16) {
            this.json['gGroupGesEve']['rGesEve']['rEve']['gGroupTiEvt'] = this.eventoEmisorActualizacionDatosTransporte(params, data);
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
     * Valida los datos ingresados en el data del req.body
     * @param data
     */
    validateValues(data) { }
    /**
     * Añade algunos valores por defecto al JSON de entrada, valido para
     * todas las operaciones
     * @param data
     */
    addDefaultValues(data) { }
    /**
     * Si los valores vienen en underscore, crea los valores en formato variableJava que
     * sera utilizado dentro del proceso,
     *
     * Ej. si viene tipo_documento crea una variable tipoDocumento, con el mismo valor.
     *
     * @param data
     */
    addUnderscore(data) {
        if (data.tipo_documento) {
            data.tipoDocumento = data.tipo_documento;
        }
        if (data.tipo_evento) {
            data.tipoEvento = data.tipo_evento;
        }
    }
    eventosEmisorCancelacion(params, data) {
        if (!data['cdc']) {
            throw new Error('Debe proporcionar el CDC en data.cdc');
        }
        if (!(data['cdc'].length == 44)) {
            throw new Error('El CDC en data.cdc debe tener 44 caracteres');
        }
        if (!data['motivo']) {
            throw new Error('Debe proporcionar el Motivo de la Cancelación en data.motivo');
        }
        if (!((data['motivo'] + '').length >= 5 && (data['motivo'] + '').length <= 500)) {
            throw new Error('El Motivo de la Cancelación en data.motivo debe contener de [5-500] caracteres');
        }
        const jsonResult = {};
        jsonResult['rGeVeCan'] = {
            Id: data['cdc'],
            mOtEve: data['motivo'],
        };
        return jsonResult;
    }
    eventosEmisorInutilizacion(params, data) {
        if (!data['timbrado']) {
            throw new Error('Falta el Timbrado en data.timbrado');
        }
        if (!data['establecimiento']) {
            throw new Error('Falta el Establecimiento en data.establecimiento');
        }
        if (new String(data['establecimiento']).length != 3) {
            throw new Error('El establecimiento debe tener una longitud de 3 caracteres');
        }
        if (!data['punto']) {
            throw new Error('Falta el Punto en data.punto');
        }
        if (new String(data['punto']).length != 3) {
            throw new Error('El punto debe tener una longitud de 3 caracteres');
        }
        if (!data['desde']) {
            throw new Error('Falta el valor inicial Desde en data.desde');
        }
        if (!data['hasta']) {
            throw new Error('Falta el valor final hasta en data.hasta');
        }
        if (+data['desde'] > +data['hasta']) {
            throw new Error('El valor inicial en data.desde debe ser inferior o igual al valor final en data.hasta');
        }
        if (!data['tipoDocumento']) {
            throw new Error('Falta el Tipo de Documento en data.tipoDocumento');
        }
        if (new String(data['timbrado']).length != 8) {
            throw new Error('El timbrado debe tener una longitud de 8 caracteres');
        }
        if (!data['motivo']) {
            throw new Error('Falta el Motivo de la Inutilización en data.motivo');
        }
        if (!((data['motivo'] + '').length >= 5 && (data['motivo'] + '').length <= 500)) {
            throw new Error('El Motivo de la Inutilización en data.motivo debe contener de [5-500] caracteres');
        }
        if (data['serie']) {
            if ((data['serie'] + '').length != 2) {
                throw new Error('El número de serie en data.serie debe contener [2] caracteres');
            }
        }
        const jsonResult = {};
        jsonResult['rGeVeInu'] = {
            dNumTim: StringUtil_service_1.default.leftZero(data['timbrado'], 8),
            dEst: StringUtil_service_1.default.leftZero(data['establecimiento'], 3),
            dPunExp: StringUtil_service_1.default.leftZero(data['punto'], 3),
            dNumIn: StringUtil_service_1.default.leftZero(data['desde'], 7),
            dNumFin: StringUtil_service_1.default.leftZero(data['hasta'], 7),
            iTiDE: data['tipoDocumento'],
            mOtEve: data['motivo'],
        };
        if (data['serie']) {
            jsonResult['rGeVeInu']['dSerieNum'] = data['serie'];
        }
        return jsonResult;
    }
    //---
    //---
    //---
    eventosReceptorConformidad(params, data) {
        const jsonResult = {};
        if (constants_service_1.default.eventoConformidadTipo.filter((um) => um.codigo === data['tipoConformidad']).length == 0) {
            throw new Error("Tipo de Conformidad '" +
                data['tipoConformidad'] +
                "' en data.tipoConformidad no encontrado. Valores: " +
                constants_service_1.default.eventoConformidadTipo.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (!data['cdc']) {
            throw new Error('Debe proporcionar el CDC en data.cdc');
        }
        if (new String(data['cdc']).length != 44) {
            throw new Error('El CDC en data.cdc debe tener una longitud de 44 caracteres');
        }
        jsonResult['rGeVeConf'] = {
            /*$: {
              ,
            },*/
            Id: data['cdc'],
            iTipConf: data['tipoConformidad'],
        };
        if (data['tipoConformidad'] == 2) {
            if (!data['fechaRecepcion']) {
                throw new Error('Obligatorio proporcionar Fecha estimada de recepción en data.fechaRecepcion');
            }
            if (new String(data['fechaRecepcion']).length != 19) {
                throw new Error('La fecha de recepción debe tener una longitud de 19 caracteres en data.fechaRecepcion');
            }
            jsonResult['rGeVeConf']['dFecRecep'] = data['fechaRecepcion'];
        }
        return jsonResult;
    }
    eventosReceptorDisconformidad(params, data) {
        const jsonResult = {};
        if (!data['cdc']) {
            throw new Error('Debe proporcionar el CDC en data.cdc');
        }
        if (!(data['cdc'].length == 44)) {
            throw new Error('El CDC en data.cdc debe tener 44 caracteres');
        }
        if (!data['motivo']) {
            throw new Error('Debe proporcionar el Motivo de la Disconformidad en data.motivo');
        }
        if (!((data['motivo'] + '').length >= 5 && (data['motivo'] + '').length <= 500)) {
            throw new Error('El Motivo de la Disconformidad en data.motivo debe contener de [5-500] caracteres');
        }
        jsonResult['rGeVeDisconf'] = {
            Id: data['cdc'],
            mOtEve: data['motivo'],
        };
        return jsonResult;
    }
    eventosReceptorDesconocimiento(params, data) {
        const jsonResult = {};
        if (!data['cdc']) {
            throw new Error('Debe proporcionar el CDC en data.cdc');
        }
        if (!(data['cdc'].length == 44)) {
            throw new Error('El CDC en data.cdc debe tener 44 caracteres');
        }
        if (!data['motivo']) {
            throw new Error('Debe proporcionar el Motivo del Desconocimiento en data.motivo');
        }
        if (!((data['motivo'] + '').length >= 5 && (data['motivo'] + '').length <= 500)) {
            throw new Error('El Motivo del Desconocimiento en data.motivo debe contener de [5-500] caracteres');
        }
        if (constants_service_1.default.tipoReceptor.filter((um) => um.codigo === +data['tipoReceptor']).length == 0) {
            throw new Error("Tipo de Receptor '" +
                data['tipoReceptor'] +
                "' en data.tipoReceptor no encontrado. Valores: " +
                constants_service_1.default.tipoReceptor.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (!data['nombre']) {
            throw new Error('Debe especificar el Nombre/Razón Social del receptor en data.nombre');
        }
        if (!(data['nombre'].length >= 4)) {
            throw new Error('El Nombre del Cliente en data.nombre debe tener una longitud mínima de 4 caracteres');
        }
        if (new String(data['fechaRecepcion']).length != 19) {
            throw new Error('La fecha de emisión debe tener una longitud de 19 caracteres en data.fechaRecepcion');
        }
        if (new String(data['fechaRecepcion']).length != 19) {
            throw new Error('La fecha de recepción debe tener una longitud de 19 caracteres en data.fechaRecepcion');
        }
        jsonResult['rGeVeDescon'] = {
            Id: data['cdc'],
            dFecEmi: data['fechaEmision'],
            dFecRecep: data['fechaRecepcion'],
            iTipRec: +data['tipoReceptor'],
            dNomRec: data['nombre'],
        };
        if (+data['tipoReceptor'] == 1) {
            if (data['ruc'].indexOf('-') == -1) {
                throw new Error('RUC del Receptor debe contener dígito verificador en data.ruc');
            }
            const rucEmisor = data['ruc'].split('-')[0];
            const dvEmisor = data['ruc'].split('-')[1];
            jsonResult['rGeVeDescon']['dRucRec'] = rucEmisor;
            jsonResult['rGeVeDescon']['dDVRec'] = dvEmisor;
        }
        if (+data['tipoReceptor'] == 2) {
            if (constants_service_1.default.tiposDocumentosIdentidades.filter((um) => um.codigo === data['documentoTipo']).length == 0) {
                throw new Error("Tipo de Documento '" +
                    data['documentoTipo'] +
                    "' en data.documentoTipo no encontrado. Valores: " +
                    constants_service_1.default.tiposDocumentosIdentidades.map((a) => a.codigo + '-' + a.descripcion));
            }
            jsonResult['rGeVeDescon']['dTipIDRec'] = data['documentoTipo'];
            if (!data['documentoNumero']) {
                throw new Error('Debe especificar el Número de Documento del receptor en data.documentoNumero');
            }
            jsonResult['rGeVeDescon']['dNumID'] = data['documentoNumero'];
        }
        jsonResult['rGeVeDescon']['mOtEve'] = data['motivo'];
        return jsonResult;
    }
    eventosReceptorNotificacionRecepcion(params, data) {
        const jsonResult = {};
        if (!data['cdc']) {
            throw new Error('Debe proporcionar el CDC en data.cdc');
        }
        if (!(data['cdc'].length == 44)) {
            throw new Error('El CDC en data.cdc debe tener 44 caracteres');
        }
        if (constants_service_1.default.tipoReceptor.filter((um) => um.codigo === +data['tipoReceptor']).length == 0) {
            throw new Error("Tipo de Receptor '" +
                data['tipoReceptor'] +
                "' en data.tipoReceptor no encontrado. Valores: " +
                constants_service_1.default.tipoReceptor.map((a) => a.codigo + '-' + a.descripcion));
        }
        if (!data['nombre']) {
            throw new Error('Debe especificar el Nombre/Razón Social del receptor en data.nombre');
        }
        if (!(data['nombre'].length >= 4)) {
            throw new Error('El Nombre del Cliente en data.nombre debe tener una longitud mínima de 4 caracteres');
        }
        if (new String(data['fechaRecepcion']).length != 19) {
            throw new Error('La fecha de emisión debe tener una longitud de 19 caracteres en data.fechaRecepcion');
        }
        if (new String(data['fechaRecepcion']).length != 19) {
            throw new Error('La fecha de recepción debe tener una longitud de 19 caracteres en data.fechaRecepcion');
        }
        jsonResult['rGeVeNotRec'] = {
            Id: data['cdc'],
            dFecEmi: data['fechaEmision'],
            dFecRecep: data['fechaRecepcion'],
            iTipRec: +data['tipoReceptor'],
            dNomRec: data['nombre'],
        };
        if (+data['tipoReceptor'] == 1) {
            if (data['ruc'].indexOf('-') == -1) {
                throw new Error('RUC del Receptor debe contener dígito verificador en data.ruc');
            }
            const rucEmisor = data['ruc'].split('-')[0];
            const dvEmisor = data['ruc'].split('-')[1];
            jsonResult['rGeVeNotRec']['dRucRec'] = rucEmisor;
            jsonResult['rGeVeNotRec']['dDVRec'] = dvEmisor;
        }
        if (+data['tipoReceptor'] == 2) {
            if (constants_service_1.default.tiposDocumentosIdentidades.filter((um) => um.codigo === data['documentoTipo']).length == 0) {
                throw new Error("Tipo de Documento '" +
                    data['documentoTipo'] +
                    "' en data.documentoTipo no encontrado. Valores: " +
                    constants_service_1.default.tiposDocumentosIdentidades.map((a) => a.codigo + '-' + a.descripcion));
            }
            jsonResult['rGeVeNotRec']['dTipIDRec'] = data['documentoTipo'];
            if (!data['documentoNumero']) {
                throw new Error('Debe especificar el Número de Documento del receptor en data.documentoNumero');
            }
            jsonResult['rGeVeNotRec']['dNumID'] = data['documentoNumero'];
        }
        jsonResult['rGeVeNotRec']['dTotalGs'] = data['totalPYG'];
        return jsonResult;
    }
    eventoEmisorNominacion(params, data) {
        const jsonResult = {};
        if (!data['cdc']) {
            throw new Error('Debe proporcionar el CDC en data.cdc');
        }
        if (!(data['cdc'].length == 44)) {
            throw new Error('El CDC en data.cdc debe tener 44 caracteres');
        }
        if (!data['motivo']) {
            throw new Error('Debe especificar el Motivo del evento de nominación en data.motivo');
        }
        if (!(data['motivo'].length >= 5 && data['motivo'].length <= 500)) {
            throw new Error('El Motivo del Evento en data.motivo debe tener una longitud entre 5 y 500 caracteres');
        }
        if (!data['pais']) {
            throw new Error('Debe especificar el Pais del Receptor en data.pais');
        }
        if (!(data['pais'].length >= 3 && data['pais'].length <= 3)) {
            throw new Error('El Pais del Receptor en data.pais debe tener una longitud de 3 caracteres');
        }
        let paisDescripcion = undefined;
        let paisEncontrado = constants_service_1.default.paises.filter((pais) => pais.codigo === data['pais']);
        if (paisEncontrado && paisEncontrado[0]) {
            paisDescripcion = paisEncontrado[0].descripcion;
        }
        if (!paisDescripcion) {
            paisDescripcion = data['paisDescripcion'];
        }
        if (!data['tipoOperacion']) {
            throw new Error('Debe especificar el Tipo de Operación en data.tipoOperacion 1-B2B, 2-B2C o 4-B2F');
        }
        else {
            if (!(data['tipoOperacion'] == 1 || data['tipoOperacion'] == 2 || data['tipoOperacion'] == 4)) {
                throw new Error('El Tipo de Operación en data.tipoOperacion debe ser 1-B2B, 2-B2C o 4-B2F');
            }
            else {
                if (!data['contribuyente']) {
                    if (data['tipoOperacion'] == 1) {
                        throw new Error('Tipo de Operación 1-B2B incorrecto para Receptor No Contribuyente');
                    }
                }
            }
        }
        if (data['contribuyente']) {
            if (!data['tipoReceptor']) {
                throw new Error('Debe especificar el Tipo de Contribuyente en data.tipoReceptor 1-Persona Física o 2-Persona Jurídica');
            }
        }
        if (!data['contribuyente']) {
            if (!data['documentoTipo']) {
                throw new Error('Debe especificar el Tipo de Documento en data.documentoTipo');
            }
            else {
                if (!(data['documentoTipo'] == 1 ||
                    data['documentoTipo'] == 2 ||
                    data['documentoTipo'] == 3 ||
                    data['documentoTipo'] == 4 ||
                    data['documentoTipo'] == 5)) {
                    throw new Error('El Tipo de Operación en data.documentoTipo debe ser 1-Cédula paraguaya, 2-Pasaporte, 3-Cédula Extranjera, 4-Carnet de residencia, 5-Tarjeta Diplomatica');
                }
            }
            if (!data['documentoNumero']) {
                throw new Error('Debe especificar el Número de Documento en data.documentoNumero');
            }
        }
        if (!data['razonSocial']) {
            throw new Error('Debe especificar el Nombre/Razón Social del receptor en data.razonSocial');
        }
        if (!(data['razonSocial'].length >= 4 && data['razonSocial'].length <= 255)) {
            throw new Error('El Nombre del Cliente en data.razonSocial debe tener una longitud entre 4 y 255 caracteres');
        }
        if (data['nombreFantasia']) {
            if (!(data['nombreFantasia'].length >= 4 && data['nombreFantasia'].length <= 255)) {
                throw new Error('El Nombre de Fantasía del Cliente en data.nombreFantasia debe tener una longitud entre 4 y 255 caracteres');
            }
        }
        if (data['direccion']) {
            if (!(data['direccion'].length >= 1 && data['direccion'].length <= 255)) {
                throw new Error('La dirección del Cliente en data.direccion debe tener una longitud entre 1 y 255 caracteres');
            }
        }
        if (data['direccion']) {
            if (!data['numeroCasa']) {
                throw new Error('Debe especificar el numero de casa en data.numeroCasa');
            }
            else {
                if (!((data['numeroCasa'] + '').length >= 1 && (data['numeroCasa'] + '').length <= 6)) {
                    throw new Error('El Número de Casa del Cliente en data.numeroCasa debe tener una longitud entre 1 y 6 caracteres');
                }
            }
        }
        let departamentoDescripcion = null;
        let distritoDescripcion = null;
        let ciudadDescripcion = null;
        if (data['departamento']) {
            let objDepartamento = constants_service_1.default.departamentos.filter((dep) => dep.codigo === +data['departamento']);
            if (objDepartamento.length <= 0) {
                throw new Error("No se encontro el Departamento '" + data['departamento'] + "'");
            }
            let errorsDepDisCiu = new Array();
            constants_service_1.default.validateDepartamentoDistritoCiudad('data', +data['departamento'], +data['distrito'], +data['ciudad'], errorsDepDisCiu);
            if (errorsDepDisCiu.length > 0) {
                throw new Error(errorsDepDisCiu[0]);
            }
            departamentoDescripcion = objDepartamento[0].descripcion;
            distritoDescripcion = constants_service_1.default.distritos.filter((dep) => dep.codigo === +data['distrito'])[0].descripcion;
            ciudadDescripcion = constants_service_1.default.ciudades.filter((dep) => dep.codigo === +data['ciudad'])[0].descripcion;
        }
        if (data['telefono']) {
            if (!(data['telefono'].length >= 6 && data['telefono'].length <= 65)) {
                throw new Error('El Telefono del Cliente en data.telefono debe tener una longitud entre 6 y 15 caracteres');
            }
        }
        if (data['celular']) {
            if (!(data['celular'].length >= 10 && data['celular'].length <= 20)) {
                throw new Error('El Celular del Cliente en data.celular debe tener una longitud entre 10 y 20 caracteres');
            }
        }
        if (data['codigo']) {
            if (!(data['codigo'].length >= 3 && data['codigo'].length <= 15)) {
                throw new Error('El Código del Cliente en data.codigo debe tener una longitud entre 3 y 15 caracteres');
            }
        }
        jsonResult['rGEveNom'] = {
            Id: data['cdc'],
            mOtEve: data['motivo'],
            iNatRec: data['contribuyente'] ? 1 : 2,
            iTiOpe: +data['tipoOperacion'],
            cPaisRec: data['pais'],
            dDesPaisRe: paisDescripcion,
        };
        if (data['tipoReceptor']) {
            if (data['contribuyente']) {
                jsonResult['rGEveNom']['iTiContRec'] = data['tipoReceptor'];
            }
        }
        if (data['contribuyente']) {
            if (data['ruc'].indexOf('-') == -1) {
                throw new Error('RUC del Receptor debe contener dígito verificador en data.ruc');
            }
            const rucEmisor = data['ruc'].split('-')[0];
            const dvEmisor = data['ruc'].split('-')[1];
            if (!(rucEmisor && (rucEmisor + '').length >= 3 && (rucEmisor + '').length <= 8)) {
                throw new Error('RUC del Receptor debe estar compuesto de 3 a 8 caracteres');
            }
            jsonResult['rGEveNom']['dRucRec'] = rucEmisor;
            jsonResult['rGEveNom']['dDVRec'] = dvEmisor;
        }
        if (!data['contribuyente']) {
            if (constants_service_1.default.tiposDocumentosReceptorInnominado.filter((um) => um.codigo === data['documentoTipo'])
                .length == 0) {
                throw new Error("Tipo de Documento '" +
                    data['documentoTipo'] +
                    "' en data.documentoTipo no encontrado. Valores: " +
                    constants_service_1.default.tiposDocumentosReceptorInnominado.map((a) => a.codigo + '-' + a.descripcion));
            }
            jsonResult['rGEveNom']['iTipIDRec'] = data['documentoTipo'];
            jsonResult['rGEveNom']['dDTipIDRec'] = constants_service_1.default.tiposDocumentosReceptorInnominado.filter((um) => um.codigo === data['documentoTipo'])[0].descripcion;
            if (data['documentoTipo'] == 9) {
                jsonResult['rGEveNom']['dDTipIDRec'] = data['documentoTipoDescripcion'];
            }
            //jsonResult['rGEveNom']['dTipIDRec'] = data['tipoContribuyente'];
            if (!data['documentoNumero']) {
                throw new Error('Debe especificar el Número de Documento del receptor en data.documentoNumero');
            }
            jsonResult['rGEveNom']['dNumIDRec'] = data['documentoNumero'];
        }
        jsonResult['rGEveNom']['dNomRec'] = data['razonSocial'];
        if (data['nombreFantasia']) {
            jsonResult['rGEveNom']['dNomFanRec'] = data['nombreFantasia'];
        }
        if (data['direccion']) {
            jsonResult['rGEveNom']['dDirRec'] = data['direccion'];
        }
        if (data['numeroCasa']) {
            jsonResult['rGEveNom']['dNumCasRec'] = data['numeroCasa'];
        }
        if (data['departamento']) {
            jsonResult['rGEveNom']['cDepRec'] = data['departamento'];
        }
        if (data['departamento']) {
            jsonResult['rGEveNom']['dDesDepRec'] = departamentoDescripcion;
        }
        if (data['distrito']) {
            jsonResult['rGEveNom']['cDisRec'] = data['distrito'];
        }
        if (data['distrito']) {
            jsonResult['rGEveNom']['dDesDisRec'] = distritoDescripcion;
        }
        if (data['ciudad']) {
            jsonResult['rGEveNom']['cCiuRec'] = data['ciudad'];
        }
        if (data['ciudad']) {
            jsonResult['rGEveNom']['dDesCiuRec'] = ciudadDescripcion;
        }
        if (data['telefono']) {
            jsonResult['rGEveNom']['dTelRec'] = data['telefono'];
        }
        if (data['celular']) {
            jsonResult['rGEveNom']['dCelRec'] = data['celular'];
        }
        if (data['email']) {
            jsonResult['rGEveNom']['dEmailRec'] = data['email'];
        }
        if (data['codigo']) {
            jsonResult['rGEveNom']['dCodCliente'] = data['codigo'];
        }
        return jsonResult;
    }
    eventoEmisorActualizacionDatosTransporte(params, data) {
        const jsonResult = {};
        if (!data['cdc']) {
            throw new Error('Debe proporcionar el CDC en data.cdc');
        }
        if (!(data['cdc'].length == 44)) {
            throw new Error('El CDC en data.cdc debe tener 44 caracteres');
        }
        if (!data['motivo']) {
            throw new Error('Debe proporcionar el Motivo en data.motivo');
        }
        /*
        if (constanteService.tipoReceptor.filter((um: any) => um.codigo === +data['tipoReceptor']).length == 0) {
          throw new Error(
            "Tipo de Receptor '" +
              data['tipoReceptor'] +
              "' en data.tipoReceptor no encontrado. Valores: " +
              constanteService.tipoReceptor.map((a: any) => a.codigo + '-' + a.descripcion),
          );
        }
    */
        if (data['motivo'] == 1) {
            let errors = new Array();
            var regExpOnlyNumber = new RegExp(/^\d+$/);
            let errorDepDisCiu = false;
            if (!data['entrega']['ciudad']) {
                errors.push('Debe especificar la Ciudad del Local de Entrega en data.entrega.ciudad');
                errorDepDisCiu = true;
            }
            else {
                if (constants_service_1.default.ciudades.filter((ciudad) => ciudad.codigo === +data['entrega']['ciudad']).length == 0) {
                    errors.push("Ciudad '" +
                        data['entrega']['ciudad'] +
                        "' del Cliente en data.entrega.ciudad no encontrado. Valores: " +
                        constants_service_1.default.ciudades.map((a) => a.codigo + '-' + a.descripcion));
                    errorDepDisCiu = true;
                }
                //De acuerdo a la Ciudad pasada como parametro, buscar el distrito y departamento y asignar dichos
                //valores de forma predeterminada, aunque este valor sera sobre-escrito caso el usuario envie
                //data['entrega']['distrito'] y data['entrega']['departamento']
                let objCiudad = constants_service_1.default.ciudades.filter((ciu) => ciu.codigo === +data['entrega']['ciudad']);
                if (objCiudad && objCiudad[0]) {
                    let objDistrito = constants_service_1.default.distritos.filter((dis) => dis.codigo === +objCiudad[0]['distrito']);
                    let objDepartamento = constants_service_1.default.departamentos.filter((dep) => dep.codigo === +objDistrito[0]['departamento']);
                    //Solo actualiza si no tiene valor
                    if (!data['entrega']['distrito'])
                        data['entrega']['distrito'] = objDistrito[0]['codigo'];
                    if (!data['entrega']['departamento'])
                        data['entrega']['departamento'] = objDepartamento[0]['codigo'];
                }
                if (!errorDepDisCiu) {
                    if (!data['entrega']['departamento']) {
                        errors.push('Debe especificar el Departamento del Local de Entrega en data.entrega.departamento');
                        errorDepDisCiu = true;
                    }
                    if (!data['entrega']['distrito']) {
                        errors.push('Debe especificar el Distrito del Local de Entrega en data.entrega.distrito');
                        errorDepDisCiu = true;
                    }
                }
            }
            if (!errorDepDisCiu) {
                constants_service_1.default.validateDepartamentoDistritoCiudad('data.entrega', +data['entrega']['departamento'], +data['entrega']['distrito'], +data['entrega']['ciudad'], errors);
            }
            if (errors.length > 0) {
                throw new Error(errors.join(','));
            }
            if (data['entrega']['direccion']) {
                throw new Error('Debe especificar la Dirección de Entrega en data.entrega.direccion');
            }
            if (data['entrega']['numeroCasa']) {
                throw new Error('Debe especificar el Número de Casa de Entrega en data.entrega.numeroCasa');
            }
        }
        if (data['motivo'] == 2) {
            if (!data['transportista']['chofer']['nombre']) {
                throw new Error('Debe especificar el Nombre del chofer en data.transportista.chofer.nombre');
            }
            if (!data['transportista']['chofer']['documentoNumero']) {
                throw new Error('Debe especificar el Documento del chofer en data.transportista.chofer.documentoNumero');
            }
        }
        if (data['motivo'] == 3) {
        }
        /*    if (!(data['nombre'].length >= 4)) {
          throw new Error('El Nombre del Cliente en data.nombre debe tener una longitud mínima de 4 caracteres');
        }*/
        jsonResult['rGeVeTr'] = {
            Id: data['cdc'],
            dMotEv: data['motivo'],
        };
        if (data['entrega'] && data['entrega']['departamento']) {
            jsonResult['rGeVeTr']['cDepEnt'] = data['entrega']['departamento'];
            jsonResult['rGeVeTr']['dDesDepEnt'] = constants_service_1.default.departamentos.filter((td) => td.codigo === data['entrega']['departamento'])[0]['descripcion'];
        }
        if (data['entrega'] && data['entrega']['distrito']) {
            jsonResult['rGeVeTr']['cDisEnt'] = data['entrega']['distrito'];
            jsonResult['rGeVeTr']['dDesDisEnt'] = constants_service_1.default.distritos.filter((td) => td.codigo === data['entrega']['distrito'])[0]['descripcion'];
        }
        if (data['entrega'] && data['entrega']['ciudad']) {
            jsonResult['rGeVeTr']['cCiuEnt'] = data['entrega']['ciudad'];
            jsonResult['rGeVeTr']['dDesCiuEnt'] = constants_service_1.default.ciudades.filter((td) => td.codigo === data['entrega']['ciudad'])[0]['descripcion'];
        }
        if (data['entrega'] && data['entrega']['direccion']) {
            jsonResult['rGeVeTr']['dDirEnt'] = data['entrega']['direccion'];
        }
        if (data['entrega'] && data['entrega']['dNumCas']) {
            jsonResult['rGeVeTr']['dDirEnt'] = data['entrega']['dNumCas'];
        }
        if (data['entrega'] && data['entrega']['dCompDir1']) {
            jsonResult['rGeVeTr']['dDirEnt'] = data['entrega']['dCompDir1'];
        }
        if (data['motivo'] == 2) {
            jsonResult['rGeVeTr']['dNomChof'] = data['entrega']['transportista']['chofer']['nombre'];
            jsonResult['rGeVeTr']['dNumIDChof'] = data['entrega']['transportista']['chofer']['documentoNumero'];
        }
        if (data['motivo'] == 3) {
            jsonResult['rGeVeTr']['iNatTrans'] = data['entrega']['transportista']['contribuyente'] ? 1 : 0;
            if (data['entrega']['transportista']['contribuyente']) {
                if (data['ruc'].indexOf('-') == -1) {
                    throw new Error('RUC del Receptor debe contener dígito verificador en data.ruc');
                }
                const rucEmisor = data['ruc'].split('-')[0];
                const dvEmisor = data['ruc'].split('-')[1];
                jsonResult['rGeVeTr']['dRucRec'] = rucEmisor;
                jsonResult['rGeVeTr']['dDVRec'] = dvEmisor;
                jsonResult['rGeVeTr']['nombre'] = data['entrega']['transportista']['nombre'];
            }
            if (!data['entrega']['transportista']['contribuyente']) {
                jsonResult['rGeVeTr']['dDTipIDTrans'] = data['entrega']['transportista']['documentoTipo'];
                if (constants_service_1.default.tiposDocumentosIdentidadesTransportistas.filter((um) => um.codigo === +data['entrega']['transportista']['documentoTipo']).length == 0) {
                    throw new Error("Tipo de Documento '" +
                        data['entrega']['transportista']['documentoTipo'] +
                        "' en data.entrega.transportista.documentoTipo no encontrado. Valores: " +
                        constants_service_1.default.tiposDocumentosIdentidadesTransportistas.map((a) => a.codigo + '-' + a.descripcion));
                }
                if (!data['documentoNumero']) {
                    throw new Error('Debe especificar el Número de Documento del transportista en data.entrega.transportista.documentoNumero');
                }
                jsonResult['rGeVeTr']['dNumIDTrans'] = data['entrega']['transportista']['documentoNumero'];
            }
        }
        if (data['motivo'] == 4) {
            if (data['entrega'] && data['entrega']['tipoTransporte']) {
                jsonResult['rGeVeTr']['iTipTrans'] = data['entrega']['tipoTransporte'];
                jsonResult['rGeVeTr']['dDesTipTrans'] = constants_service_1.default.tiposTransportes.filter((td) => td.codigo === data['entrega']['tipoTransporte'])[0]['descripcion'];
            }
            if (data['entrega'] && data['entrega']['modalidadTransporte']) {
                jsonResult['rGeVeTr']['iModTrans'] = data['entrega']['modalidadTransporte'];
                jsonResult['rGeVeTr']['dDesModTrans'] = constants_service_1.default.modalidadesTransportes.filter((td) => td.codigo === data['entrega']['modalidadTransporte'])[0]['descripcion'];
            }
            if (data['entrega'] && data['entrega']['vehiculo']['tipo']) {
                jsonResult['rGeVeTr']['dTiVehTras'] = data['entrega']['vehiculo']['tipo'];
            }
            if (data['entrega'] && data['entrega']['vehiculo']['marca']) {
                jsonResult['rGeVeTr']['dMarVeh'] = data['entrega']['vehiculo']['marca'];
            }
            if (data['entrega'] && data['entrega']['vehiculo']['documentoTipo']) {
                jsonResult['rGeVeTr']['dTipIdenVeh'] = data['entrega']['vehiculo']['documentoTipo'];
                /*jsonResult['rGeVeTr']['dDesTipTrans'] = constanteService.tiposIdentificacionesVehiculos.filter(
                  (td) => td.codigo === data['entrega']['vehiculo']['documentoTipo']
                )[0]['descripcion'];*/
            }
            if (data['entrega'] && data['entrega']['vehiculo']['documentoNumero']) {
                jsonResult['rGeVeTr']['dNroIDVeh'] = data['entrega']['vehiculo']['documentoNumero'];
            }
            if (data['entrega'] && data['entrega']['vehiculo']['numeroMatricula']) {
                jsonResult['rGeVeTr']['dNroMatVeh'] = data['entrega']['vehiculo']['numeroMatricula'];
            }
        }
        return jsonResult;
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
}
exports.default = new JSonEventoMainService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkV2ZW50b01haW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9qc29uRXZlbnRvTWFpbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtDQUFpQztBQUNqQyw0RUFBbUQ7QUFDbkQsNEVBQW1EO0FBQ25ELDhFQUFxRDtBQUdyRCxNQUFNLHFCQUFxQjtJQUEzQjtRQUNFLG9CQUFlLEdBQVEsSUFBSSxDQUFDO1FBQzVCLGtCQUFhLEdBQVEsSUFBSSxDQUFDO1FBQzFCLFNBQUksR0FBUSxFQUFFLENBQUM7SUFnbENqQixDQUFDO0lBOWtDUSw0QkFBNEIsQ0FBQyxFQUFVLEVBQUUsTUFBVyxFQUFFLElBQVMsRUFBRSxNQUFxQjtRQUMzRixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWE7UUFDbEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUMzQyxJQUFJO2dCQUNGLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDNUQsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0RBQXdELEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRWhGLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDdEI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDZjtRQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sOEJBQThCLENBQUMsRUFBVSxFQUFFLE1BQVcsRUFBRSxJQUFTLEVBQUUsTUFBcUI7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