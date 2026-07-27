declare class ConstanteService {
    tiposDocumentos: {
        codigo: number;
        descripcion: string;
        situacion: number;
    }[];
    tiposEmisiones: {
        codigo: number;
        descripcion: string;
    }[];
    tiposTransacciones: {
        codigo: number;
        descripcion: string;
        situacion: number;
    }[];
    tiposImpuestos: {
        codigo: number;
        descripcion: string;
        situacion: number;
    }[];
    obligaciones: {
        codigo: number;
        descripcion: string;
    }[];
    monedas: {
        codigo: string;
        descripcion: string;
    }[];
    globalPorItem: {
        codigo: number;
        descripcion: string;
    }[];
    tiposRegimenes: {
        codigo: number;
        descripcion: string;
    }[];
    tiposDocumentosIdentidades: {
        codigo: number;
        descripcion: string;
    }[];
    tiposDocumentosIdentidadesTransportistas: {
        codigo: number;
        descripcion: string;
    }[];
    tiposDocumentosReceptor: {
        codigo: number;
        descripcion: string;
    }[];
    tiposDocumentosReceptorInnominado: {
        codigo: number;
        descripcion: string;
    }[];
    tiposOperaciones: {
        codigo: number;
        descripcion: string;
    }[];
    indicadoresPresencias: {
        codigo: number;
        descripcion: string;
    }[];
    tipoReceptor: {
        codigo: number;
        descripcion: string;
    }[];
    naturalezaVendedorAutofactura: {
        codigo: number;
        descripcion: string;
    }[];
    notasCreditosMotivos: {
        codigo: number;
        descripcion: string;
    }[];
    remisionesMotivos: {
        codigo: number;
        descripcion: string;
    }[];
    remisionesResponsables: {
        codigo: number;
        descripcion: string;
    }[];
    condicionesOperaciones: {
        codigo: number;
        descripcion: string;
    }[];
    condicionesTiposPagos: {
        codigo: number;
        descripcion: string;
    }[];
    condicionesCreditosTipos: {
        codigo: number;
        descripcion: string;
    }[];
    tarjetasCreditosTipos: {
        codigo: number;
        descripcion: string;
    }[];
    tarjetasCreditosFormasProcesamiento: {
        codigo: number;
        descripcion: string;
    }[];
    unidadesMedidas: {
        codigo: number;
        representacion: string;
        descripcion: string;
    }[];
    codigosAfectaciones: {
        codigo: number;
        descripcion: string;
    }[];
    categoriasIsc: {
        codigo: number;
        descripcion: string;
    }[];
    tasasIsc: {
        codigo: number;
        porcentaje: number;
    }[];
    condicionesNegociaciones: {
        codigo: string;
        descripcion: string;
    }[];
    relevanciasMercaderias: {
        codigo: number;
        descripcion: string;
    }[];
    tiposOperacionesVehiculos: {
        codigo: number;
        descripcion: string;
    }[];
    tiposIdentificacionesVehiculos: {
        codigo: number;
        descripcion: string;
    }[];
    tiposCombustibles: {
        codigo: number;
        descripcion: string;
    }[];
    tiposTransportes: {
        codigo: number;
        descripcion: string;
    }[];
    modalidadesTransportes: {
        codigo: number;
        descripcion: string;
    }[];
    responsablesFletes: {
        codigo: number;
        descripcion: string;
    }[];
    tiposDocumentosAsociados: {
        codigo: number;
        descripcion: string;
    }[];
    tiposDocumentosImpresos: {
        codigo: number;
        descripcion: string;
    }[];
    tiposConstancias: {
        codigo: number;
        descripcion: string;
    }[];
    caracteristicasCargas: {
        codigo: number;
        descripcion: string;
    }[];
    eventoConformidadTipo: {
        codigo: number;
        descripcion: string;
    }[];
    paises: {
        codigo: string;
        descripcion: string;
    }[];
    ciudades: {
        codigo: number;
        descripcion: string;
        distrito: number;
    }[];
    distritos: {
        codigo: number;
        descripcion: string;
        departamento: number;
    }[];
    departamentos: {
        codigo: number;
        descripcion: string;
    }[];
    validateDepartamentoDistritoCiudad(field: string, departamentoId: number, distritoId: number, ciudadId: number, errores: Array<string>): void;
}
declare const _default: ConstanteService;
export default _default;
