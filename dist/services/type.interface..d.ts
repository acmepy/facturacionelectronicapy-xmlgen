interface XmlgenConfig {
    defaultValues?: boolean;
    arrayValuesSeparator?: string;
    errorSeparator?: string;
    errorLimit?: number;
    redondeoSedeco?: boolean;
    decimals?: number;
    taxDecimals?: number;
    pygDecimals?: number;
    pygTaxDecimals?: number;
    /**
     * Cantidad de decimales para resultados parciales de base de impuestos (dBasExe, dBasGravIva, dLiqIVAItem)
     */
    partialTaxDecimals?: number;
    userObjectRemove?: boolean;
    test: boolean;
    sum0_000001SuffixBeforeToFixed: boolean;
}
export { XmlgenConfig };
