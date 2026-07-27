/**
 * Contiene la codificacion del XML desde E790-E899
 * E9. Campos complementarios comerciales de uso específico (E790-E899)
 *
 */
declare class JSonDteComplementariosService {
    /**
     * E9. Campos complementarios comerciales de uso específico (E790-E899)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosComplementariosComercialesDeUsoEspecificos(params: any, data: any): any;
    /**
     * E9.2. Sector Energía Eléctrica (E791-E799)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosSectorEnergiaElectrica;
    /**
     * E9.3. Sector de Seguros (E800-E809)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosSectorSeguros;
    /**
     * E9.4. Sector de Supermercados (E810-E819
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosSectorSupermercados;
    /**
     * E9.5. Grupo de datos adicionales de uso comercial (E820-E829)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosAdicionalesUsoComercial;
}
declare const _default: JSonDteComplementariosService;
export default _default;
