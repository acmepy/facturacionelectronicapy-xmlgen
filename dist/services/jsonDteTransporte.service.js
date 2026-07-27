"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_service_1 = __importDefault(require("./constants.service"));
class JSonDteTransporteService {
    /**
     * E10. Campos que describen el transporte de las mercaderías (E900-E999)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosTransporte(params, data) {
        const jsonResult = {
            iTipTrans: data['detalleTransporte']['tipo'],
            dDesTipTrans: constants_service_1.default.tiposTransportes.filter((tt) => tt.codigo == data['detalleTransporte']['tipo'])[0]['descripcion'],
            iModTrans: data['detalleTransporte']['modalidad'],
            dDesModTrans: constants_service_1.default.modalidadesTransportes.filter((mt) => mt.codigo == data['detalleTransporte']['modalidad'])[0]['descripcion'],
            iRespFlete: data['detalleTransporte']['tipoResponsable'],
        };
        if (data['detalleTransporte']['condicionNegociacion']) {
            jsonResult['cCondNeg'] = data['detalleTransporte']['condicionNegociacion'];
        }
        if (data['detalleTransporte']['numeroManifiesto']) {
            jsonResult['dNuManif'] = data['detalleTransporte']['numeroManifiesto'];
        }
        if (data['detalleTransporte'] && data['detalleTransporte']['numeroDespachoImportacion']) {
            if (data['detalleTransporte']['numeroDespachoImportacion'].length >= 16) {
                jsonResult['dNuDespImp'] = data['detalleTransporte']['numeroDespachoImportacion'].substring(0, 16);
            }
        }
        if (data['detalleTransporte']['inicioEstimadoTranslado']) {
            jsonResult['dIniTras'] = (data['detalleTransporte']['inicioEstimadoTranslado'] + '').substring(0, 10);
        }
        if (data['detalleTransporte']['finEstimadoTranslado']) {
            jsonResult['dFinTras'] = (data['detalleTransporte']['finEstimadoTranslado'] + '').substring(0, 10);
        }
        if (data['detalleTransporte']['paisDestino']) {
            jsonResult['cPaisDest'] = data['detalleTransporte']['paisDestino'];
            jsonResult['dDesPaisDest'] = constants_service_1.default.paises.filter((pais) => pais.codigo === data['detalleTransporte']['paisDestino'])[0]['descripcion'];
        }
        if (data['detalleTransporte']['salida']) {
            jsonResult['gCamSal'] = this.generateDatosSalida(params, data);
        }
        if (data['detalleTransporte']['entrega']) {
            jsonResult['gCamEnt'] = this.generateDatosEntrega(params, data);
        }
        if (data['detalleTransporte']['vehiculo']) {
            jsonResult['gVehTras'] = this.generateDatosVehiculo(params, data);
        }
        if (data['detalleTransporte']['transportista']) {
            jsonResult['gCamTrans'] = this.generateDatosTransportista(params, data);
        }
        return jsonResult;
    }
    /**
     * E10.1. Campos que identifican el local de salida de las mercaderías (E920-E939)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosSalida(params, data) {
        const jsonResult = {
            dDirLocSal: data['detalleTransporte']['salida']['direccion'],
        };
        if (!data['detalleTransporte']['salida']['numeroCasa']) {
            data['detalleTransporte']['salida']['numeroCasa'] = '0';
        }
        jsonResult['dNumCasSal'] = data['detalleTransporte']['salida']['numeroCasa'];
        if (data['detalleTransporte']['salida']['complementoDireccion1']) {
            jsonResult['dComp1Sal'] = data['detalleTransporte']['salida']['complementoDireccion1'];
        }
        if (data['detalleTransporte']['salida']['complementoDireccion2']) {
            jsonResult['dComp2Sal'] = data['detalleTransporte']['salida']['complementoDireccion2'];
        }
        jsonResult['cDepSal'] = +data['detalleTransporte']['salida']['departamento'];
        jsonResult['dDesDepSal'] = constants_service_1.default.departamentos.filter((td) => td.codigo === +data['detalleTransporte']['salida']['departamento'])[0]['descripcion'];
        jsonResult['cDisSal'] = data['detalleTransporte']['salida']['distrito'];
        jsonResult['dDesDisSal'] = constants_service_1.default.distritos.filter((td) => td.codigo === +data['detalleTransporte']['salida']['distrito'])[0]['descripcion'];
        jsonResult['cCiuSal'] = +data['detalleTransporte']['salida']['ciudad'];
        jsonResult['dDesCiuSal'] = constants_service_1.default.ciudades.filter((td) => td.codigo === +data['detalleTransporte']['salida']['ciudad'])[0]['descripcion'];
        if (data['detalleTransporte'] &&
            data['detalleTransporte']['salida'] &&
            data['detalleTransporte']['salida']['telefonoContacto']) {
            if (data['detalleTransporte']['salida']['telefonoContacto'].length >= 6) {
                jsonResult['dTelSal'] = data['detalleTransporte']['salida']['telefonoContacto'];
            }
        }
        return jsonResult;
    }
    /**
     * E10.2. Campos que identifican el local de entrega de las mercaderías (E940-E959)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosEntrega(params, data) {
        const jsonResult = {
            dDirLocEnt: data['detalleTransporte']['entrega']['direccion'],
        };
        if (!data['detalleTransporte']['entrega']['numeroCasa']) {
            data['detalleTransporte']['entrega']['numeroCasa'] = '0';
        }
        jsonResult['dNumCasEnt'] = data['detalleTransporte']['entrega']['numeroCasa'];
        if (data['detalleTransporte']['entrega']['complementoDireccion1']) {
            jsonResult['dComp1Ent'] = data['detalleTransporte']['entrega']['complementoDireccion1'];
        }
        if (data['detalleTransporte']['entrega']['complementoDireccion2']) {
            jsonResult['dComp2Ent'] = data['detalleTransporte']['entrega']['complementoDireccion2'];
        }
        if (data['detalleTransporte']['entrega']['departamento']) {
            jsonResult['cDepEnt'] = +data['detalleTransporte']['entrega']['departamento'];
            jsonResult['dDesDepEnt'] = constants_service_1.default.departamentos.filter((td) => td.codigo === +data['detalleTransporte']['entrega']['departamento'])[0]['descripcion'];
        }
        if (data['detalleTransporte']['entrega']['distrito']) {
            jsonResult['cDisEnt'] = +data['detalleTransporte']['entrega']['distrito'];
            jsonResult['dDesDisEnt'] = constants_service_1.default.distritos.filter((td) => td.codigo === +data['detalleTransporte']['entrega']['distrito'])[0]['descripcion'];
        }
        if (data['detalleTransporte']['entrega']['ciudad']) {
            jsonResult['cCiuEnt'] = +data['detalleTransporte']['entrega']['ciudad'];
            jsonResult['dDesCiuEnt'] = constants_service_1.default.ciudades.filter((td) => td.codigo === +data['detalleTransporte']['entrega']['ciudad'])[0]['descripcion'];
        }
        if (data['detalleTransporte'] &&
            data['detalleTransporte']['entrega'] &&
            data['detalleTransporte']['entrega']['telefonoContacto']) {
            if (data['detalleTransporte']['entrega']['telefonoContacto'].length >= 6) {
                jsonResult['dTelEnt'] = data['detalleTransporte']['entrega']['telefonoContacto'];
            }
        }
        return jsonResult;
    }
    /**
       * E10.3. Campos que identifican el vehículo de traslado de mercaderías (E960-E979)
  
       *
       * @param params
       * @param data
       * @param options
       * @param items Es el item actual del array de items de "data" que se está iterando
       */
    generateDatosVehiculo(params, data) {
        const jsonResult = {
            dTiVehTras: data['detalleTransporte']['vehiculo']['tipo'],
            dMarVeh: data['detalleTransporte']['vehiculo']['marca'],
        };
        if (data['detalleTransporte']['vehiculo']['documentoTipo']) {
            jsonResult['dTipIdenVeh'] = data['detalleTransporte']['vehiculo']['documentoTipo'];
        }
        if (data['detalleTransporte']['vehiculo']['documentoNumero']) {
            jsonResult['dNroIDVeh'] = data['detalleTransporte']['vehiculo']['documentoNumero'];
        }
        if (data['detalleTransporte'] &&
            data['detalleTransporte']['vehiculo'] &&
            data['detalleTransporte']['vehiculo']['obs']) {
            jsonResult['dAdicVeh'] = data['detalleTransporte']['vehiculo']['obs'];
        }
        if (data['detalleTransporte']['vehiculo']['numeroMatricula']) {
            jsonResult['dNroMatVeh'] = data['detalleTransporte']['vehiculo']['numeroMatricula'];
        }
        if (data['detalleTransporte']['vehiculo']['numeroVuelo']) {
            if (data['detalleTransporte']['vehiculo']['numeroVuelo'].length >= 6) {
                jsonResult['dNroVuelo'] = data['detalleTransporte']['vehiculo']['numeroVuelo'].substring(0, 6);
            }
        }
        return jsonResult;
    }
    /**
     * E10.4. Campos que identifican al transportista (persona física o jurídica) (E980-E999)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosTransportista(params, data) {
        const jsonResult = {
            iNatTrans: data['detalleTransporte']['transportista']['contribuyente'] ? 1 : 2,
            dNomTrans: data['detalleTransporte']['transportista']['nombre'],
        };
        if (data['detalleTransporte']['transportista']['contribuyente']) {
            jsonResult['dRucTrans'] = data['detalleTransporte']['transportista']['ruc'].split('-')[0];
            jsonResult['dDVTrans'] = data['detalleTransporte']['transportista']['ruc'].split('-')[1];
        }
        if (!data['detalleTransporte']['transportista']['contribuyente']) {
            jsonResult['iTipIDTrans'] = data['detalleTransporte']['transportista']['documentoTipo'];
            jsonResult['dDTipIDTrans'] = constants_service_1.default.tiposDocumentosIdentidades.filter((td) => td.codigo === data['detalleTransporte']['transportista']['documentoTipo'])[0]['descripcion'];
            jsonResult['dNumIDTrans'] = data['detalleTransporte']['transportista']['documentoNumero'].substring(0, 20);
        }
        if (data['detalleTransporte']['transportista'] && data['detalleTransporte']['transportista']['pais']) {
            jsonResult['cNacTrans'] = data['detalleTransporte']['transportista']['pais'];
            jsonResult['dDesNacTrans'] = constants_service_1.default.paises.filter((pais) => pais.codigo === data['detalleTransporte']['transportista']['pais'])[0]['descripcion'];
        }
        if (data['detalleTransporte']['transportista']['chofer']['documentoNumero']) {
            jsonResult['dNumIDChof'] = data['detalleTransporte']['transportista']['chofer']['documentoNumero'].substring(0, 20);
        }
        jsonResult['dNomChof'] = data['detalleTransporte']['transportista']['chofer']['nombre'];
        //if (data['detalleTransporte']['transportista']['direccion']) {
        //MT010 - pasa a ser obligatorio
        jsonResult['dDomFisc'] = data['detalleTransporte']['transportista']['direccion'];
        //}
        //if (data['detalleTransporte']['transportista']['chofer']['direccion']) {
        //MT010 - pasa a ser obligatorio
        jsonResult['dDirChof'] = data['detalleTransporte']['transportista']['chofer']['direccion'];
        //}
        if (data['detalleTransporte']['transportista']['agente'] &&
            data['detalleTransporte']['transportista']['agente']['ruc']) {
            jsonResult['dNombAg'] = data['detalleTransporte']['transportista']['agente']['nombre'];
            jsonResult['dRucAg'] = data['detalleTransporte']['transportista']['agente']['ruc'].split('-')[0];
            jsonResult['dDVAg'] = data['detalleTransporte']['transportista']['agente']['ruc'].split('-')[1];
            jsonResult['dDirAge'] = data['detalleTransporte']['transportista']['agente']['direccion'];
        }
        return jsonResult;
    }
}
exports.default = new JSonDteTransporteService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkR0ZVRyYW5zcG9ydGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9qc29uRHRlVHJhbnNwb3J0ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNEVBQW1EO0FBR25ELE1BQU0sd0JBQXdCO0lBQzVCOzs7Ozs7T0FNRztJQUNJLHVCQUF1QixDQUFDLE1BQVcsRUFBRSxJQUFTO1FBQ25ELE1BQU0sVUFBVSxHQUFRO1lBQ3RCLFNBQVMsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDNUMsWUFBWSxFQUFFLDJCQUFnQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUMvRyxhQUFhLENBQ2Q7WUFDRCxTQUFTLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxDQUFDO1lBQ2pELFlBQVksRUFBRSwyQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQzFELENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUM1RCxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztZQUNuQixVQUFVLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsaUJBQWlCLENBQUM7U0FFekQsQ0FBQztRQUVGLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBRTtZQUNyRCxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUM1RTtR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