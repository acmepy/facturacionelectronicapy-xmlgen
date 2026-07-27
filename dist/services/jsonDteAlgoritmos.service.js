"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StringUtil_service_1 = __importDefault(require("./StringUtil.service"));
const FechaUtil_service_1 = __importDefault(require("./FechaUtil.service"));
class JSonDteAlgoritmosService {
    /**
     * Calcula Digito Verificador numérico con entrada alfanumérica y basemax 11
     */
    calcularDigitoVerificador(cdc, baseMax = 11) {
        let v_total = 0;
        let v_resto = 0;
        let k = 0;
        let v_numero_aux = 0;
        let v_numero_al = '';
        let v_caracter = '';
        let v_digit = 0;
        // Cambia la ultima letra por ascii en caso que la cedula termine en letra
        for (let i = 0; i < cdc.length; i++) {
            v_caracter = cdc.toUpperCase().substring(i, i + 1);
            if (!(v_caracter.charCodeAt(0) >= 48 && v_caracter.charCodeAt(0) <= 57)) {
                v_numero_al = v_numero_al + v_caracter.charCodeAt(0);
            }
            else {
                v_numero_al = v_numero_al + v_caracter;
            }
        }
        // Calcula el DV
        k = 2;
        v_total = 0;
        //FOR i IN REVERSE 1 .. LENGTH(v_numero_al) LOOP
        for (let i = v_numero_al.length; i > 0; i--) {
            if (k > baseMax) {
                k = 2;
            }
            v_numero_aux = parseInt(v_numero_al.substring(i - 1, i));
            v_total = v_total + v_numero_aux * k;
            k = k + 1;
        }
        v_resto = v_total % 11;
        if (v_resto > 1) {
            v_digit = 11 - v_resto;
        }
        else {
            v_digit = 0;
        }
        return v_digit;
    }
    /**
     * Generacion del codigo de control de 44 digitos
     *
     * Conformacion del CDC
     * 1. Tipo de Documento, iTiDE, 2, Completar con left zero hasta alcanzar 2 digit.
     * 2. Ruc Emisor, dRucEm, 8, Completar con left zero hasta 8
     * 3. DV del Emisor, dDVEmi, 1, Digito verificador del emisor.
     * 4. Establecimiento, dEst, 3, Establecimiento
     * 5. Punto de Expedicion, dPunExp, 3, Punto de Expe.
     * 6. Numero de Docummento, dNumDoc, 7, Numero de DE, completar con left zero hasta 7
     * 7. Tipo de Contribuyente, iTipCon, 1, Codigo del tipo de contribuyente
     * 8. Fecha Emision, dFeEmiDE, 8, en formato AAAAMMDD
     * 9. Tipo de Emision, iTipEmi, 1, Tipo de Emision
     * 10. Codigo de Seguridad, dCodSeg, 9, Num. Aleatorio
     * 11. Digito Verificador, dDVId, 1, Resultado del Algoritmo M. 11
     *
     * @param data
     * @returns
     */
    generateCodigoControl(params, data, codigoSeguridad) {
        if (params['ruc'].indexOf('-') == -1) {
            throw new Error('RUC debe contener dígito verificador en params.ruc');
        }
        const tipoDocumento = data['tipoDocumento'];
        let rucEmisor = params['ruc'].split('-')[0];
        rucEmisor = StringUtil_service_1.default.leftZero(rucEmisor, 8);
        const dvEmisor = params['ruc'].split('-')[1];
        const establecimiento = StringUtil_service_1.default.leftZero(data['establecimiento'], 3);
        const punto = StringUtil_service_1.default.leftZero(data['punto'], 3);
        const numero = StringUtil_service_1.default.leftZero(data['numero'], 7);
        const tipoContribuyente = params['tipoContribuyente'];
        const fechaEmision = FechaUtil_service_1.default.convertToAAAAMMDD(new Date(data['fecha']));
        const tipoEmision = data['tipoEmision']; //1=Normal 2=Contingencia
        const codigoSeguridadAleatorio = codigoSeguridad;
        let cdc = StringUtil_service_1.default.leftZero(tipoDocumento, 2) +
            rucEmisor +
            dvEmisor +
            establecimiento +
            punto +
            numero +
            tipoContribuyente +
            fechaEmision +
            tipoEmision +
            codigoSeguridadAleatorio;
        let rucEmisorParaCalculoDV = params['ruc'].split('-')[0];
        //Si el RUC tiene letras A, B o C, esas letras hay que reemplazar con el código ASCII
        rucEmisorParaCalculoDV = rucEmisorParaCalculoDV.replace('A', '65');
        rucEmisorParaCalculoDV = rucEmisorParaCalculoDV.replace('B', '66');
        rucEmisorParaCalculoDV = rucEmisorParaCalculoDV.replace('C', '67');
        rucEmisorParaCalculoDV = rucEmisorParaCalculoDV.replace('a', '97');
        rucEmisorParaCalculoDV = rucEmisorParaCalculoDV.replace('b', '98');
        rucEmisorParaCalculoDV = rucEmisorParaCalculoDV.replace('c', '99');
        rucEmisorParaCalculoDV = StringUtil_service_1.default.leftZero(rucEmisorParaCalculoDV, 8);
        const dvEmisorParaCalculoDV = params['ruc'].split('-')[1];
        let cdcParaCalculoDV = StringUtil_service_1.default.leftZero(tipoDocumento, 2) +
            rucEmisorParaCalculoDV +
            dvEmisorParaCalculoDV +
            establecimiento +
            punto +
            numero +
            tipoContribuyente +
            fechaEmision +
            tipoEmision +
            codigoSeguridadAleatorio;
        //const digitoVerificador = this.calcularDigitoVerificador(cdcParaCalculoDV, 11);
        const digitoVerificador = this.calcularDigitoVerificador(cdc, 11);
        cdc += digitoVerificador;
        return cdc;
    }
}
exports.default = new JSonDteAlgoritmosService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkR0ZUFsZ29yaXRtb3Muc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9qc29uRHRlQWxnb3JpdG1vcy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOEVBQXFEO0FBQ3JELDRFQUFtRDtBQUVuRCxNQUFNLHdCQUF3QjtJQUM1Qjs7T0FFRztJQUNJLHlCQUF5QixDQUFDLEdBQVcsRUFBRSxVQUFrQixFQUFFO1FBQ2hFLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBRWhCLDBFQUEwRTtRQUMxRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7Z0JBQ3ZFLFdBQVcsR0FBRyxXQUFXLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0RDtpQkFBTTtnQkFDTCxXQUFXLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQzthQUN4QztTQUNGO1FBRUQsZ0JBQWdCO1FBQ2hCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDTixPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osZ0RBQWdEO1FBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxHQUFHLE9BQU8sRUFBRTtnQkFDZixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1A7WUFDRCxZQUFZLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELE9BQU8sR0FBRyxPQUFPLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUNyQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNYO1FBQ0QsT0FBTyxHQUFHLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO1lBQ2YsT0FBTyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7U0FDeEI7YUFBTTtZQUNMLE9BQU8sR0FBRyxDQUFDLENBQUM7U0FDYjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Ba0JHO0lBQ0kscUJBQXFCLENBQUMsTUFBVyxFQUFFLElBQVMsRUFBRSxlQUFvQjtRQUN2RSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDcEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTVDLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsU0FBUyxHQUFHLDRCQUFpQixDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFckQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxNQUFNLGVBQWUsR0FBRyw0QkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0UsTUFBTSxLQUFLLEdBQUcsNEJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLE1BQU0sR0FBRyw0QkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdELE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDdEQsTUFBTSxZQUFZLEdBQUcsMkJBQWdCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyx5QkFBeUI7UUFDbEUsTUFBTSx3QkFBd0IsR0FBRyxlQUFlLENBQUM7UUFFakQsSUFBSSxHQUFHLEdBQ0wsNEJBQWlCLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDNUMsU0FBUztZQUNULFFBQVE7WUFDUixlQUFlO1lBQ2YsS0FBSztZQUNMLE1BQU07WUFDTixpQkFBaUI7WUFDakIsWUFBWTtZQUNaLFdBQVc7WUFDWCx3QkFBd0IsQ0FBQztRQUUzQixJQUFJLHNCQUFzQixHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQscUZBQXFGO1FBQ3JGLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkUsc0JBQXNCLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRSxzQkFBc0IsR0FBRyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25FLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkUsc0JBQXNCLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRSxzQkFBc0IsR0FBRyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25FLHNCQUFzQixHQUFHLDRCQUFpQixDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvRSxNQUFNLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUQsSUFBSSxnQkFBZ0IsR0FDbEIsNEJBQWlCLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDNUMsc0JBQXNCO1lBQ3RCLHFCQUFxQjtZQUNyQixlQUFlO1lBQ2YsS0FBSztZQUNMLE1BQU07WUFDTixpQkFBaUI7WUFDakIsWUFBWTtZQUNaLFdBQVc7WUFDWCx3QkFBd0IsQ0FBQztRQUUzQixpRkFBaUY7UUFDakYsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQztRQUN6QixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Q0FDRjtBQUVELGtCQUFlLElBQUksd0JBQXdCLEVBQUUsQ0FBQyJ9