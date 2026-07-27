import { XmlgenConfig } from './type.interface.';
declare class JSonDteTotalesService {
    /**
     * F. Campos que describen los subtotales y totales de la transacción documentada (F001-F099)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosTotales(params: any, data: any, items: any[], config: XmlgenConfig): any;
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
    redondeoSedeco(numero: any): number;
}
declare const _default: JSonDteTotalesService;
export default _default;
