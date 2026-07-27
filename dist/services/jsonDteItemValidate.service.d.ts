import { XmlgenConfig } from './type.interface.';
declare class JSonDteItemValidateService {
    errors: Array<string>;
    constructor();
    /**
     * E8. Campos que describen los ítems de la operación (E700-E899)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosItemsOperacionValidate(params: any, data: any, config: XmlgenConfig, errors: Array<string>): string[];
    /**
     * E8.1.1 Campos que describen los descuentos, anticipos y valor total por ítem (EA001-EA050)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosItemsOperacionDescuentoAnticipoValorTotalValidate;
    /**
     * E8.2. Campos que describen el IVA de la operación por ítem (E730-E739)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosItemsOperacionIVAValidate;
    /**
     * E8.4. Grupo de rastreo de la mercadería (E750-E760)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosItemsOperacionRastreoMercaderiasValidate;
    /**
     * E8.5. Sector de automotores nuevos y usados (E770-E789)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosItemsOperacionSectorAutomotoresValidate;
}
declare const _default: JSonDteItemValidateService;
export default _default;
