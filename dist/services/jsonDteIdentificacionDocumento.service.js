"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_service_1 = __importDefault(require("./constants.service"));
const StringUtil_service_1 = __importDefault(require("./StringUtil.service"));
class JSonDteIdentificacionDocumentoService {
    /**
     * H. Campos que identifican al documento asociado (H001-H049)
     *
     * @param params
     * @param data
     * @param options
     */
    generateDatosDocumentoAsociado(params, dataDocumentoAsociado, data) {
        const jsonResult = {
            iTipDocAso: dataDocumentoAsociado['formato'],
            dDesTipDocAso: constants_service_1.default.tiposDocumentosAsociados.filter((td) => td.codigo === +dataDocumentoAsociado['formato'])[0]['descripcion'],
        };
        if (dataDocumentoAsociado['formato'] == 1) {
            //H002 = Electronico
            if (dataDocumentoAsociado['cdc'] && dataDocumentoAsociado['cdc'].length >= 44) {
                jsonResult['dCdCDERef'] = dataDocumentoAsociado['cdc'];
            }
            if (data['tipoDocumento'] == 5 || data['tipoDocumento'] == 6 || data['tipoDocumento'] == 7) {
                if (dataDocumentoAsociado['rucFusionado'] && dataDocumentoAsociado['rucFusionado'].length >= 3) {
                    jsonResult['dRucFus'] = dataDocumentoAsociado['rucFusionado'];
                }
            }
        }
        if (dataDocumentoAsociado['formato'] == 2) {
            //H002 = Impreso
            if (dataDocumentoAsociado['timbrado']) {
                jsonResult['dNTimDI'] = dataDocumentoAsociado['timbrado'];
            }
            if (dataDocumentoAsociado['establecimiento']) {
                jsonResult['dEstDocAso'] = StringUtil_service_1.default.leftZero(dataDocumentoAsociado['establecimiento'] + '', 3);
            }
            if (dataDocumentoAsociado['punto']) {
                jsonResult['dPExpDocAso'] = StringUtil_service_1.default.leftZero(dataDocumentoAsociado['punto'] + '', 3);
            }
            if (dataDocumentoAsociado['numero']) {
                jsonResult['dNumDocAso'] = StringUtil_service_1.default.leftZero(dataDocumentoAsociado['numero'] + '', 7);
            }
            if (dataDocumentoAsociado['tipoDocumentoImpreso']) {
                jsonResult['iTipoDocAso'] = +dataDocumentoAsociado['tipoDocumentoImpreso'];
                jsonResult['dDTipoDocAso'] = constants_service_1.default.tiposDocumentosImpresos.filter((td) => td.codigo === +dataDocumentoAsociado['tipoDocumentoImpreso'])[0]['descripcion'];
            }
            if (dataDocumentoAsociado['fecha']) {
                jsonResult['dFecEmiDI'] = dataDocumentoAsociado['fecha'];
            }
        }
        if (dataDocumentoAsociado &&
            dataDocumentoAsociado['numeroRetencion'] &&
            dataDocumentoAsociado['numeroRetencion'].length >= 15) {
            jsonResult['dNumComRet'] = dataDocumentoAsociado['numeroRetencion'].substring(0, 15);
        }
        if (dataDocumentoAsociado &&
            dataDocumentoAsociado['resolucionCreditoFiscal'] &&
            dataDocumentoAsociado['resolucionCreditoFiscal'].length >= 15) {
            jsonResult['dNumResCF'] = dataDocumentoAsociado['resolucionCreditoFiscal'].substring(0, 15);
        }
        if (dataDocumentoAsociado['formato'] == 3) {
            //H002 = Constancia electronica
            if (dataDocumentoAsociado['constanciaTipo']) {
                jsonResult['iTipCons'] = dataDocumentoAsociado['constanciaTipo'];
                jsonResult['dDesTipCons'] = constants_service_1.default.tiposConstancias.filter((tc) => tc.codigo === dataDocumentoAsociado['constanciaTipo'])[0]['descripcion'];
                jsonResult['dNumCons'] = +dataDocumentoAsociado['constanciaNumero'];
                jsonResult['dNumControl'] = dataDocumentoAsociado['constanciaControl'];
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
        const jsonResult = {
            cUniMedTotVol: data['complementarios']['carga']['unidadMedida'],
            dDesUniMedTotVol: data['complementarios']['carga']['ordenVenta'],
            dTotVolMerc: data['complementarios']['carga']['numeroAsiento'],
            cUniMedTotPes: data['complementarios']['carga']['numeroAsiento'],
            dDesUniMedTotPes: data['complementarios']['carga']['numeroAsiento'],
            dTotPesMerc: data['complementarios']['carga']['numeroAsiento'],
            iCarCarga: data['complementarios']['carga']['numeroAsiento'],
            dDesCarCarga: data['complementarios']['carga']['numeroAsiento'],
        };
        return jsonResult;
    }
}
exports.default = new JSonDteIdentificacionDocumentoService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkR0ZUlkZW50aWZpY2FjaW9uRG9jdW1lbnRvLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvanNvbkR0ZUlkZW50aWZpY2FjaW9uRG9jdW1lbnRvLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0RUFBbUQ7QUFDbkQsOEVBQXFEO0FBRXJELE1BQU0scUNBQXFDO0lBQ3pDOzs7Ozs7T0FNRztJQUNJLDhCQUE4QixDQUFDLE1BQVcsRUFBRSxxQkFBMEIsRUFBRSxJQUFTO1FBQ3RGLE1BQU0sVUFBVSxHQUFRO1lBQ3RCLFVBQVUsRUFBRSxxQkFBcUIsQ0FBQyxTQUFTLENBQUM7WUFDNUMsYUFBYSxFQUFFLDJCQUFnQixDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FDN0QsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FDeEQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7U0FDcEIsQ0FBQztRQUVGLElBQUkscUJBQXFCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pDLG9CQUFvQjtZQUNwQixJQUFJLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxJQUFJLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxFQUFFLEVBQUU7Z0JBQzdFLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN4RDtZQUNELElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFGLElBQUkscUJBQXFCLENBQUMsY0FBYyxDQUFDLElBQUkscUJBQXFCLENBQUMsY0FBYyxDQUFD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