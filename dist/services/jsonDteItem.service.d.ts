import { XmlgenConfig } from './type.interface.';
declare class JSonDteItemService {
    /**
     * E8. Campos que describen los ítems de la operación (E700-E899)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosItemsOperacion(params: any, data: any, config: XmlgenConfig): any;
    /**
     * E8.1. Campos que describen el precio, tipo de cambio y valor total de la operación por ítem (E720-E729)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosItemsOperacionPrecioTipoCambioTotal;
    /**
     * E8.1.1 Campos que describen los descuentos, anticipos y valor total por ítem (EA001-EA050)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosItemsOperacionDescuentoAnticipoValorTotal;
    /**
     * E8.2. Campos que describen el IVA de la operación por ítem (E730-E739)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosItemsOperacionIVA;
    /**
     * E8.4. Grupo de rastreo de la mercadería (E750-E760)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosItemsOperacionRastreoMercaderias;
    /**
     * E8.5. Sector de automotores nuevos y usados (E770-E789)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosItemsOperacionSectorAutomotores;
}
declare const _default: JSonDteItemService;
export default _default;
