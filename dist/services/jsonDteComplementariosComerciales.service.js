"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_service_1 = __importDefault(require("./constants.service"));
class JSonDteComplementariosComercialesService {
    /**
     * G. Campos complementarios comerciales de uso general (G001-G049)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosComercialesUsoGeneral(params, data) {
        const jsonResult = {
        //dOrdCompra : data['complementarios']['ordenCompra'],
        //dOrdVta : data['complementarios']['ordenVenta'],
        //dAsiento : data['complementarios']['numeroAsiento']
        };
        if (data['complementarios'] && data['complementarios']['ordenCompra']) {
            jsonResult['dOrdCompra'] = data['complementarios']['ordenCompra'];
        }
        if (data['complementarios'] && data['complementarios']['ordenVenta']) {
            jsonResult['dOrdVta'] = data['complementarios']['ordenVenta'];
        }
        if (data['complementarios'] && data['complementarios']['numeroAsiento']) {
            jsonResult['dAsiento'] = data['complementarios']['numeroAsiento'];
        }
        if (data['tipoDocumento'] == 1 || data['tipoDocumento'] == 7) {
            //Opcional si 1 o 7
            if ((data['complementarios'] &&
                data['complementarios']['carga'] &&
                data['complementarios']['carga']['volumenTotal']) ||
                (data['complementarios'] && data['complementarios']['carga'] && data['complementarios']['carga']['pesoTotal'])) {
                jsonResult['gCamCarg'] = this.generateDatosCarga(params, data);
            }
        }
        return jsonResult;
    }
    /**
     * G1. Campos generales de la carga (G050 - G099)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosCarga(params, data) {
        //TODO ALL
        const jsonResult = {
        /*cUniMedTotVol : data['complementarios']['carga']['unidadMedida'],
              dDesUniMedTotVol : data['complementarios']['carga']['ordenVenta'],
              dTotVolMerc : data['complementarios']['carga']['totalVolumenMercaderia'],
              cUniMedTotPes : data['complementarios']['carga']['numeroAsiento'],
              dDesUniMedTotPes : data['complementarios']['carga']['numeroAsiento'],
              dTotPesMerc : data['complementarios']['carga']['numeroAsiento'],
              iCarCarga : data['complementarios']['carga']['numeroAsiento'],
              dDesCarCarga : data['complementarios']['carga']['numeroAsiento'],*/
        };
        if (data['complementarios'] &&
            data['complementarios']['carga'] &&
            data['complementarios']['carga']['unidadMedidaVolumenTotal']) {
            /*if (
              constanteService.unidadesMedidas.filter(
                (um) => um.codigo === data['complementarios']['carga']['unidadMedidaVolumenTotal'],
              ).length == 0
            ) {
              throw new Error(
                "Unidad de Medida '" +
                  data['complementarios']['carga']['unidadMedidaVolumenTotal'] +
                  "' en data.complementarios.carga.unidadMedidaVolumenTotal no válido. Valores: " +
                  constanteService.unidadesMedidas.map((a) => a.codigo + '-' + a.descripcion.trim()),
              );
            }*/
            jsonResult['cUniMedTotVol'] = data['complementarios']['carga']['unidadMedidaVolumenTotal'];
            jsonResult['dDesUniMedTotVol'] = constants_service_1.default.unidadesMedidas.filter((td) => td.codigo == data['complementarios']['carga']['unidadMedidaVolumenTotal'])[0]['representacion'];
        }
        if (data['complementarios'] &&
            data['complementarios']['carga'] &&
            data['complementarios']['carga']['volumenTotal']) {
            jsonResult['dTotVolMerc'] = data['complementarios']['carga']['volumenTotal'];
        }
        if (data['complementarios'] &&
            data['complementarios']['carga'] &&
            data['complementarios']['carga']['unidadMedidaPesoTotal']) {
            /*if (
              constanteService.unidadesMedidas.filter(
                (um) => um.codigo === data['complementarios']['carga']['unidadMedidaPesoTotal'],
              ).length == 0
            ) {
              throw new Error(
                "Unidad de Medida '" +
                  data['complementarios']['carga']['unidadMedidaPesoTotal'] +
                  "' en data.complementarios.carga.unidadMedidaPesoTotal no válido. Valores: " +
                  constanteService.unidadesMedidas.map((a) => a.codigo + '-' + a.descripcion.trim()),
              );
            }*/
            jsonResult['cUniMedTotPes'] = data['complementarios']['carga']['unidadMedidaPesoTotal'];
            jsonResult['dDesUniMedTotPes'] = constants_service_1.default.unidadesMedidas.filter((td) => td.codigo == data['complementarios']['carga']['unidadMedidaPesoTotal'])[0]['representacion'];
        }
        if (data['complementarios'] && data['complementarios']['carga'] && data['complementarios']['carga']['pesoTotal']) {
            jsonResult['dTotPesMerc'] = data['complementarios']['carga']['pesoTotal'];
        }
        if (data['complementarios'] &&
            data['complementarios']['carga'] &&
            data['complementarios']['carga']['caracteristicaCarga']) {
            /*if (
              constanteService.caracteristicasCargas.filter(
                (um) => um.codigo === data['complementarios']['carga']['caracteristicaCarga'],
              ).length == 0
            ) {
              throw new Error(
                "Característica de Carga '" +
                  data['complementarios']['carga']['caracteristicaCarga'] +
                  "' en data.complementarios.carga.caracteristicaCarga no válido. Valores: " +
                  constanteService.caracteristicasCargas.map((a) => a.codigo + '-' + a.descripcion),
              );
            }*/
            jsonResult['iCarCarga'] = data['complementarios']['carga']['caracteristicaCarga'];
            jsonResult['dDesCarCarga'] = constants_service_1.default.caracteristicasCargas.filter((td) => td.codigo == data['complementarios']['carga']['caracteristicaCarga'])[0]['descripcion'];
            if (data['complementarios']['carga']['caracteristicaCarga'] == 3) {
                if (data['complementarios']['carga']['caracteristicaCargaDescripcion']) {
                    jsonResult['dDesCarCarga'] = data['complementarios']['carga']['caracteristicaCargaDescripcion'];
                    /*} else {
                    throw new Error(
                      'Para data.complementarios.carga.caracteristicaCarga = 3 debe informar el campo data.complementarios.carga.caracteristicaCargaDescripcion',
                    );*/
                }
            }
        }
        return jsonResult;
    }
}
exports.default = new JSonDteComplementariosComercialesService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkR0ZUNvbXBsZW1lbnRhcmlvc0NvbWVyY2lhbGVzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvanNvbkR0ZUNvbXBsZW1lbnRhcmlvc0NvbWVyY2lhbGVzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0RUFBbUQ7QUFFbkQsTUFBTSx3Q0FBd0M7SUFDNUM7Ozs7OztPQU1HO0lBQ0ksa0NBQWtDLENBQUMsTUFBVyxFQUFFLElBQVM7UUFDOUQsTUFBTSxVQUFVLEdBQVE7UUFDdEIsc0RBQXNEO1FBQ3RELGtEQUFrRDtRQUNsRCxxREFBcUQ7U0FDdEQsQ0FBQztRQUVGLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDckUsVUFBVSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUNwRSxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDL0Q7UUFDRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3ZFLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNuRTtRQUVELElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVELG1C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