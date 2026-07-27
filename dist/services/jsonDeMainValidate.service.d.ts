import { XmlgenConfig } from './type.interface.';
declare class JSonDeMainValidateService {
    errors: Array<string>;
    constructor();
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
    validateValues(params: any, data: any, config: XmlgenConfig): void;
    generateCodigoControlValidate(params: any, data: any): void;
    private datosEmisorValidate;
    private generateDatosOperacionValidate;
    private generateDatosGeneralesValidate;
    private generateDatosGeneralesInherentesOperacionValidate;
    private generateDatosGeneralesEmisorDEValidate;
    private generateDatosGeneralesResponsableGeneracionDEValidate;
    private generateDatosGeneralesReceptorDEValidate;
    private generateDatosEspecificosPorTipoDEValidate;
    private generateDatosEspecificosPorTipoDE_FacturaElectronicaValidate;
    /**
     * Datos especificos cuando el tipo de operacion del receptor es B2G (Campo D202)
     * Dentro de la factura electronica
     *
     * @param params
     * @param data
     * @param options
     */
    private generateDatosEspecificosPorTipoDE_ComprasPublicasValidate;
    private generateDatosEspecificosPorTipoDE_AutofacturaValidate;
    private generateDatosEspecificosPorTipoDE_NotaCreditoDebitoValidate;
    private generateDatosEspecificosPorTipoDE_RemisionElectronicaValidate;
    private generateDatosAutofacturaValidate;
    private validateAsociadoConstancia;
    private generateDatosCondicionOperacionDEValidate;
    /**
     * E7.1. Campos que describen la forma de pago de la operación al contado o del monto
     * de la entrega inicial (E605-E619)
     * @param params
     * @param data
     * @param options
     */
    private generateDatosCondicionOperacionDE_ContadoValidate;
    /**
     * E7.2. Campos que describen la operación a crédito (E640-E649)
     *
     * @param params
     * @param data
     * @param options
     */
    private generateDatosCondicionOperacionDE_CreditoValidate;
    generateDatosComplementariosComercialesDeUsoEspecificosValidate(params: any, data: any): void;
    /**
     * E9.2. Sector Energía Eléctrica (E791-E799)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosSectorEnergiaElectricaValidate;
    /**
     * E9.3. Sector de Seguros (E800-E809)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosSectorSegurosValidate;
    /**
     * E9.4. Sector de Supermercados (E810-E819
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosSectorSupermercadosValidate;
    /**
     * E9.5. Grupo de datos adicionales de uso comercial (E820-E829)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosDatosAdicionalesUsoComercialValidate;
    /**
     * E10. Campos que describen el transporte de las mercaderías (E900-E999)
     *
     * Aqui puede entrar si tipoDocumento = 1 (opcional) o tipoDocumento = 7 (obligatorio)
     * @param params
     * @param data
     * @param options
     */
    generateDatosTransporteValidate(params: any, data: any): void;
    /**
     * E10.1. Campos que identifican el local de salida de las mercaderías (E920-E939)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosSalidaValidate;
    /**
     * E10.2. Campos que identifican el local de entrega de las mercaderías (E940-E959)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosEntregaValidate;
    /**
         * E10.3. Campos que identifican el vehículo de traslado de mercaderías (E960-E979)
    
         *
         * @param params
         * @param data
         * @param options
         * @param items Es el item actual del array de items de "data" que se está iterando
         */
    private generateDatosVehiculoValidate;
    /**
     * E10.4. Campos que identifican al transportista (persona física o jurídica) (E980-E999)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosTransportistaValidate;
    generateDatosTotalesValidate(params: any, data: any, config: XmlgenConfig): void;
    /**
     * G. Campos complementarios comerciales de uso general (G001-G049)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosComercialesUsoGeneralValidate(params: any, data: any): void;
    /**
     * G1. Campos generales de la carga (G050 - G099)
     *
     * @param params
     * @param data
     * @param options
     */
    private generateDatosCargaValidate;
    /**
     * H. Campos que identifican al documento asociado (H001-H049)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosDocumentoAsociadoValidate(params: any, dataDocumentoAsociado: any, data: any): void;
}
declare const _default: JSonDeMainValidateService;
export default _default;
