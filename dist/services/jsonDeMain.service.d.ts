import { XmlgenConfig } from './type.interface.';
declare class JSonDeMainService {
    codigoSeguridad: any;
    codigoControl: any;
    json: any;
    validateError: boolean;
    generateXMLDE(params: any, data: any, config?: XmlgenConfig): Promise<any>;
    /**
     * Metodo principal de generacion de XML del DE
     * @param params
     * @param data
     * @returns
     */
    private generateXMLDeService;
    /**
     * Genera el CDC para la Factura
     * Corresponde al Id del DE
     *
     * @param params
     * @param data
     */
    generateCodigoControl(params: any, data: any): void;
    private validateCamposDelCDC;
    /**
     * Si los valores vienen en underscore, crea los valores en formato variableJava que
     * sera utilizado dentro del proceso,
     *
     * Ej. si viene tipo_documento crea una variable tipoDocumento, con el mismo valor.
     *
     * @param data
     */
    private removeUnderscoreAndPutCamelCase;
    /**
     * Añade algunos valores por defecto al JSON de entrada, valido para
     * todas las operaciones
     * @param data
     */
    private addDefaultValues;
    private generateRte;
    private generateDe;
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
    private generateDatosOperacion;
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
    private generateDatosTimbrado;
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
    private generateDatosGenerales;
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
    private generateDatosGeneralesInherentesOperacion;
    /**
     * D2. Campos que identifican al emisor del Documento Electrónico DE (D100-D129)
     * Pertenece al grupo de datos generales
     *
     * @param params
     * @param data
     * @param options
     */
    private generateDatosGeneralesEmisorDE;
    /**
     * Datos generales del responsable de generacion del DE
     *
     * @param params
     * @param data
     * @param options
     */
    private generateDatosGeneralesResponsableGeneracionDE;
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
    private generateDatosGeneralesReceptorDE;
    /**
     * Campos que seran especificos de acuerdo a cada tipo de documento electronico
     * Se dividiran en diferentes métodos por cada tipo de factura.
     *
     * @param params
     * @param data
     * @param options
     */
    private generateDatosEspecificosPorTipoDE;
    /**
     * Datos especificos para la factura electronica
     *
     * @param params
     * @param data
     * @param options
     */
    private generateDatosEspecificosPorTipoDE_FacturaElectronica;
    /**
     * Datos especificos cuando el tipo de operacion del receptor es B2G (Campo D202)
     * Dentro de la factura electronica
     *
     * @param params
     * @param data
     * @param options
     */
    private generateDatosEspecificosPorTipoDE_ComprasPublicas;
    private generateDatosEspecificosPorTipoDE_Autofactura;
    private generateDatosEspecificosPorTipoDE_NotaCreditoDebito;
    private generateDatosEspecificosPorTipoDE_RemisionElectronica;
    /**
     * E7. Campos que describen la condición de la operación (E600-E699)
     * @param params
     * @param data
     * @param options
     */
    private generateDatosCondicionOperacionDE;
    /**
     * E7.1. Campos que describen la forma de pago de la operación al contado o del monto
     * de la entrega inicial (E605-E619)
     * @param params
     * @param data
     * @param options
     */
    private generateDatosCondicionOperacionDE_Contado;
    /**
     * E7.2. Campos que describen la operación a crédito (E640-E649)
     *
     * @param params
     * @param data
     * @param options
     */
    private generateDatosCondicionOperacionDE_Credito;
    private normalizeXML;
    getPaises(): {
        codigo: string;
        descripcion: string;
    }[];
    getDepartamentos(): {
        codigo: number;
        descripcion: string;
    }[];
    getDistritos(departamento: number | null): {
        codigo: number;
        descripcion: string;
        departamento: number;
    }[];
    getCiudades(distrito: number | null): {
        codigo: number;
        descripcion: string;
        distrito: number;
    }[];
    getTiposRegimenes(): {
        codigo: number;
        descripcion: string;
    }[];
    getDepartamento(departamentoId: number): {
        codigo: number;
        descripcion: string;
    }[];
    getDistrito(distritoId: number): {
        codigo: number;
        descripcion: string;
        departamento: number;
    }[];
    getCiudad(ciudadId: number): {
        codigo: number;
        descripcion: string;
        distrito: number;
    }[];
}
declare const _default: JSonDeMainService;
export default _default;
