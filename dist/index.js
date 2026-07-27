"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConstantes = void 0;
const jsonDeMain_service_1 = __importDefault(require("./services/jsonDeMain.service"));
const jsonEventoMain_service_1 = __importDefault(require("./services/jsonEventoMain.service"));
const constants_service_1 = __importDefault(require("./services/constants.service"));
class DE {
    constructor() {
        this.generateXMLDE = (params, data, config) => {
            return jsonDeMain_service_1.default.generateXMLDE(params, data, config);
        };
        this.generateXMLEventoCancelacion = (id, params, data, config) => {
            return jsonEventoMain_service_1.default.generateXMLEventoCancelacion(id, params, data, config);
        };
        this.generateXMLEventoInutilizacion = (id, params, data, config) => {
            return jsonEventoMain_service_1.default.generateXMLEventoInutilizacion(id, params, data, config);
        };
        this.generateXMLEventoConformidad = (id, params, data, config) => {
            return jsonEventoMain_service_1.default.generateXMLEventoConformidad(id, params, data, config);
        };
        this.generateXMLEventoDisconformidad = (id, params, data, config) => {
            return jsonEventoMain_service_1.default.generateXMLEventoDisconformidad(id, params, data, config);
        };
        this.generateXMLEventoDesconocimiento = (id, params, data, config) => {
            return jsonEventoMain_service_1.default.generateXMLEventoDesconocimiento(id, params, data, config);
        };
        this.generateXMLEventoNotificacion = (id, params, data, config) => {
            return jsonEventoMain_service_1.default.generateXMLEventoNotificacion(id, params, data, config);
        };
        this.generateXMLEventoNominacion = (id, params, data, config) => {
            return jsonEventoMain_service_1.default.generateXMLEventoNominacion(id, params, data, config);
        };
        this.generateXMLEventoActualizacionDatosTransporte = (id, params, data, config) => {
            return jsonEventoMain_service_1.default.generateXMLEventoActualizacionDatosTransporte(id, params, data, config);
        };
        this.consultarPaises = () => {
            return new Promise((resolve, reject) => {
                //Enviar Copia
                let paises = [];
                for (let index = 0; index < jsonDeMain_service_1.default.getPaises().length; index++) {
                    const pais = jsonDeMain_service_1.default.getPaises()[index];
                    paises.push(Object.assign({}, pais));
                }
                resolve(paises);
            });
        };
        this.consultarDepartamentos = () => {
            return new Promise((resolve, reject) => {
                //Enviar Copia
                let departamentos = [];
                for (let index = 0; index < jsonDeMain_service_1.default.getDepartamentos().length; index++) {
                    const dep = jsonDeMain_service_1.default.getDepartamentos()[index];
                    departamentos.push(Object.assign({}, dep));
                }
                resolve(departamentos);
            });
        };
        this.consultarDistritos = (departamento) => {
            return new Promise((resolve, reject) => {
                //Enviar Copia
                let distritos = [];
                for (let index = 0; index < jsonDeMain_service_1.default.getDistritos(departamento).length; index++) {
                    const dis = jsonDeMain_service_1.default.getDistritos(departamento)[index];
                    distritos.push(Object.assign({}, dis));
                }
                resolve(distritos);
            });
        };
        this.consultarCiudades = (distrito) => {
            return new Promise((resolve, reject) => {
                //Enviar Copia
                let ciudades = [];
                for (let index = 0; index < jsonDeMain_service_1.default.getCiudades(distrito).length; index++) {
                    const ciu = jsonDeMain_service_1.default.getCiudades(distrito)[index];
                    ciudades.push(Object.assign({}, ciu));
                }
                resolve(ciudades);
            });
        };
        this.consultarTiposRegimenes = () => {
            return new Promise((resolve, reject) => {
                let tiposRegimenes = [];
                for (let index = 0; index < jsonDeMain_service_1.default.getTiposRegimenes().length; index++) {
                    const tip = jsonDeMain_service_1.default.getTiposRegimenes()[index];
                    tiposRegimenes.push(Object.assign({}, tip));
                }
                resolve(tiposRegimenes);
            });
        };
        this.getDepartamento = (departamentoId) => {
            let departamentos = jsonDeMain_service_1.default.getDepartamento(departamentoId);
            if (departamentos.length > 0) {
                return Object.assign({}, departamentos[0]);
            }
            else {
                return null;
            }
        };
        this.getDistrito = (distritoId) => {
            let distritos = jsonDeMain_service_1.default.getDistrito(distritoId);
            if (distritos.length > 0) {
                return Object.assign({}, distritos[0]);
            }
            else {
                return null;
            }
        };
        this.getCiudad = (ciudadId) => {
            let ciudades = jsonDeMain_service_1.default.getCiudad(ciudadId);
            if (ciudades.length > 0) {
                return Object.assign({}, ciudades[0]);
            }
            else {
                return null;
            }
        };
        this.getConstantes = () => {
            return constants_service_1.default;
        };
    }
}
exports.default = new DE();
function getConstantes() {
    return constants_service_1.default;
}
exports.getConstantes = getConstantes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsdUZBQXNEO0FBQ3RELCtGQUE4RDtBQUU5RCxxRkFBNEQ7QUFFNUQsTUFBTSxFQUFFO0lBQVI7UUFDRSxrQkFBYSxHQUFHLENBQUMsTUFBVyxFQUFFLElBQVMsRUFBRSxNQUFxQixFQUFnQixFQUFFO1lBQzlFLE9BQU8sNEJBQVMsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUM7UUFFRixpQ0FBNEIsR0FBRyxDQUFDLEVBQVUsRUFBRSxNQUFXLEVBQUUsSUFBUyxFQUFFLE1BQXFCLEVBQWdCLEVBQUU7WUFDekcsT0FBTyxnQ0FBYSxDQUFDLDRCQUE0QixDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQztRQUVGLG1DQUE4QixHQUFHLENBQUMsRUFBVSxFQUFFLE1BQVcsRUFBRSxJQUFTLEVBQUUsTUFBcUIsRUFBZ0IsRUFBRTtZQUMzRyxPQUFPLGdDQUFhLENBQUMsOEJBQThCLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDO1FBRUYsaUNBQTRCLEdBQUcsQ0FBQyxFQUFVLEVBQUUsTUFBVyxFQUFFLElBQVMsRUFBRSxNQUFxQixFQUFnQixFQUFFO1lBQ3pHLE9BQU8sZ0NBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQUM7UUFFRixvQ0FBK0IsR0FBRyxDQUFDLEVBQVUsRUFBRSxNQUFXLEVBQUUsSUFBUyxFQUFFLE1BQXFCLEVBQWdCLEVBQUU7WUFDNUcsT0FBTyxnQ0FBYSxDQUFDLCtCQUErQixDQUFD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