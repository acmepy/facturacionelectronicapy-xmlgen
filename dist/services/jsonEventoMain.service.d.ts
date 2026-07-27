import { XmlgenConfig } from './type.interface.';
declare class JSonEventoMainService {
    codigoSeguridad: any;
    codigoControl: any;
    json: any;
    generateXMLEventoCancelacion(id: number, params: any, data: any, config?: XmlgenConfig): Promise<any>;
    generateXMLEventoInutilizacion(id: number, params: any, data: any, config?: XmlgenConfig): Promise<any>;
    generateXMLEventoConformidad(id: number, params: any, data: any, config?: XmlgenConfig): Promise<any>;
    generateXMLEventoDisconformidad(id: number, params: any, data: any, config?: XmlgenConfig): Promise<any>;
    generateXMLEventoDesconocimiento(id: number, params: any, data: any, config?: XmlgenConfig): Promise<any>;
    generateXMLEventoNotificacion(id: number, params: any, data: any, config?: XmlgenConfig): Promise<any>;
    generateXMLEventoNominacion(id: number, params: any, data: any, config?: XmlgenConfig): Promise<any>;
    generateXMLEventoActualizacionDatosTransporte(id: number, params: any, data: any, config?: XmlgenConfig): Promise<any>;
    private envelopeEvent;
    /**
     * Metodo principal de generacion de XML del Evento
     * @param params
     * @param data
     * @returns
     */
    private generateXMLEventoService;
    /**
     * Valida los datos ingresados en el data del req.body
     * @param data
     */
    private validateValues;
    /**
     * Añade algunos valores por defecto al JSON de entrada, valido para
     * todas las operaciones
     * @param data
     */
    private addDefaultValues;
    /**
     * Si los valores vienen en underscore, crea los valores en formato variableJava que
     * sera utilizado dentro del proceso,
     *
     * Ej. si viene tipo_documento crea una variable tipoDocumento, con el mismo valor.
     *
     * @param data
     */
    private addUnderscore;
    private eventosEmisorCancelacion;
    private eventosEmisorInutilizacion;
    private eventosReceptorConformidad;
    private eventosReceptorDisconformidad;
    private eventosReceptorDesconocimiento;
    private eventosReceptorNotificacionRecepcion;
    private eventoEmisorNominacion;
    private eventoEmisorActualizacionDatosTransporte;
    private normalizeXML;
}
declare const _default: JSonEventoMainService;
export default _default;
