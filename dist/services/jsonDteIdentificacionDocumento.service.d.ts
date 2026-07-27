declare class JSonDteIdentificacionDocumentoService {
    /**
     * H. Campos que identifican al documento asociado (H001-H049)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosDocumentoAsociado(params: any, dataDocumentoAsociado: any, data: any): any;
    /**
     * G1. Campos generales de la carga (G050 - G099)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosCarga(params: any, data: any): any;
}
declare const _default: JSonDteIdentificacionDocumentoService;
export default _default;
