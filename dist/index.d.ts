import { XmlgenConfig } from './services/type.interface.';
declare class DE {
    generateXMLDE: (params: any, data: any, config?: XmlgenConfig | undefined) => Promise<any>;
    generateXMLEventoCancelacion: (id: number, params: any, data: any, config?: XmlgenConfig | undefined) => Promise<any>;
    generateXMLEventoInutilizacion: (id: number, params: any, data: any, config?: XmlgenConfig | undefined) => Promise<any>;
    generateXMLEventoConformidad: (id: number, params: any, data: any, config?: XmlgenConfig | undefined) => Promise<any>;
    generateXMLEventoDisconformidad: (id: number, params: any, data: any, config?: XmlgenConfig | undefined) => Promise<any>;
    generateXMLEventoDesconocimiento: (id: number, params: any, data: any, config?: XmlgenConfig | undefined) => Promise<any>;
    generateXMLEventoNotificacion: (id: number, params: any, data: any, config?: XmlgenConfig | undefined) => Promise<any>;
    generateXMLEventoNominacion: (id: number, params: any, data: any, config?: XmlgenConfig | undefined) => Promise<any>;
    generateXMLEventoActualizacionDatosTransporte: (id: number, params: any, data: any, config?: XmlgenConfig | undefined) => Promise<any>;
    consultarPaises: () => Promise<any>;
    consultarDepartamentos: () => Promise<any>;
    consultarDistritos: (departamento: number | null) => Promise<any>;
    consultarCiudades: (distrito: number | null) => Promise<any>;
    consultarTiposRegimenes: () => Promise<any>;
    getDepartamento: (departamentoId: number) => any;
    getDistrito: (distritoId: number) => any;
    getCiudad: (ciudadId: number) => any;
    getConstantes: () => any;
}
declare const _default: DE;
export default _default;
export declare function getConstantes(): any;
