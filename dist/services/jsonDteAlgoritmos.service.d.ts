declare class JSonDteAlgoritmosService {
    /**
     * Calcula Digito Verificador numérico con entrada alfanumérica y basemax 11
     */
    calcularDigitoVerificador(cdc: String, baseMax?: number): number;
    /**
     * Generacion del codigo de control de 44 digitos
     *
     * Conformacion del CDC
     * 1. Tipo de Documento, iTiDE, 2, Completar con left zero hasta alcanzar 2 digit.
     * 2. Ruc Emisor, dRucEm, 8, Completar con left zero hasta 8
     * 3. DV del Emisor, dDVEmi, 1, Digito verificador del emisor.
     * 4. Establecimiento, dEst, 3, Establecimiento
     * 5. Punto de Expedicion, dPunExp, 3, Punto de Expe.
     * 6. Numero de Docummento, dNumDoc, 7, Numero de DE, completar con left zero hasta 7
     * 7. Tipo de Contribuyente, iTipCon, 1, Codigo del tipo de contribuyente
     * 8. Fecha Emision, dFeEmiDE, 8, en formato AAAAMMDD
     * 9. Tipo de Emision, iTipEmi, 1, Tipo de Emision
     * 10. Codigo de Seguridad, dCodSeg, 9, Num. Aleatorio
     * 11. Digito Verificador, dDVId, 1, Resultado del Algoritmo M. 11
     *
     * @param data
     * @returns
     */
    generateCodigoControl(params: any, data: any, codigoSeguridad: any): string;
}
declare const _default: JSonDteAlgoritmosService;
export default _default;
