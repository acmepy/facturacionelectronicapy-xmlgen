declare class FechaUtilService {
    convertToAAAAMMDD(fecha: Date): string;
    convertToAAAA_MM_DD(fecha: Date): string;
    convertToJSONFormat(fecha: Date): string;
    isIsoDateTime(str: string): boolean;
    isIsoDate(str: string): boolean;
}
declare const _default: FechaUtilService;
export default _default;
