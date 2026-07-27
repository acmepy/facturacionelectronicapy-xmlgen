declare class JSonDteTransporteService {
    /**
     * E10. Campos que describen el transporte de las mercaderías (E900-E999)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosTransporte(params: any, data: any): any;
    /**
     * E10.1. Campos que identifican el local de salida de las mercaderías (E920-E939)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosSalida;
    /**
     * E10.2. Campos que identifican el local de entrega de las mercaderías (E940-E959)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosEntrega;
    /**
       * E10.3. Campos que identifican el vehículo de traslado de mercaderías (E960-E979)
  
       *
       * @param params
       * @param data
       * @param options
       * @param items Es el item actual del array de items de "data" que se está iterando
       */
    private generateDatosVehiculo;
    /**
     * E10.4. Campos que identifican al transportista (persona física o jurídica) (E980-E999)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    private generateDatosTransportista;
}
declare const _default: JSonDteTransporteService;
export default _default;
