"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Contiene la codificacion del XML desde E790-E899
 * E9. Campos complementarios comerciales de uso específico (E790-E899)
 *
 */
class JSonDteComplementariosService {
    /**
     * E9. Campos complementarios comerciales de uso específico (E790-E899)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosComplementariosComercialesDeUsoEspecificos(params, data) {
        const jsonResult = {};
        let entro = false;
        if (data['sectorEnergiaElectrica']) {
            entro = true;
            jsonResult['gGrupEner'] = this.generateDatosSectorEnergiaElectrica(params, data);
        }
        if (data['sectorSeguros']) {
            entro = true;
            jsonResult['gGrupSeg'] = this.generateDatosSectorSeguros(params, data);
        }
        if (data['sectorSupermercados']) {
            entro = true;
            jsonResult['gGrupSup'] = this.generateDatosSectorSupermercados(params, data);
        }
        if (data['sectorAdicional']) {
            entro = true;
            jsonResult['gGrupAdi'] = this.generateDatosAdicionalesUsoComercial(params, data);
        }
        if (entro) {
            return jsonResult;
        }
        else {
            return null;
        }
    }
    /**
     * E9.2. Sector Energía Eléctrica (E791-E799)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosSectorEnergiaElectrica(params, data) {
        const jsonResult = {
            dNroMed: data['sectorEnergiaElectrica']['numeroMedidor'],
            dActiv: data['sectorEnergiaElectrica']['codigoActividad'],
            dCateg: data['sectorEnergiaElectrica']['codigoCategoria'],
            dLecAnt: data['sectorEnergiaElectrica']['lecturaAnterior'],
            dLecAct: data['sectorEnergiaElectrica']['lecturaActual'],
            dConKwh: data['sectorEnergiaElectrica']['lecturaActual'] - data['sectorEnergiaElectrica']['lecturaAnterior'],
        };
        /*if (data['lecturaAnterior'] > data['lecturaActual']) {
          throw new Error('Sector Energia Electrica lecturaActual debe ser mayor a lecturaAnterior');
        }*/
        return jsonResult;
    }
    /**
     * E9.3. Sector de Seguros (E800-E809)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosSectorSeguros(params, data) {
        const jsonResult = {
            dCodEmpSeg: data['sectorSeguros']['codigoAseguradora'],
            gGrupPolSeg: {
                dPoliza: data['sectorSeguros']['codigoPoliza'],
                dUnidVig: data['sectorSeguros']['vigenciaUnidad'],
                dVigencia: data['sectorSeguros']['vigencia'],
                dNumPoliza: data['sectorSeguros']['numeroPoliza'],
                dFecIniVig: data['sectorSeguros']['inicioVigencia'],
                dFecFinVig: data['sectorSeguros']['finVigencia'],
                dCodInt: data['sectorSeguros']['codigoInternoItem'],
            },
        };
        return jsonResult;
    }
    /**
     * E9.4. Sector de Supermercados (E810-E819
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosSectorSupermercados(params, data) {
        const jsonResult = {
            dNomCaj: data['sectorSupermercados']['nombreCajero'],
            dEfectivo: data['sectorSupermercados']['efectivo'],
            dVuelto: data['sectorSupermercados']['vuelto'],
            dDonac: data['sectorSupermercados']['donacion'],
            dDesDonac: data['sectorSupermercados']['donacionDescripcion'].substring(0, 20),
        };
        return jsonResult;
    }
    /**
     * E9.5. Grupo de datos adicionales de uso comercial (E820-E829)
     *
     * @param params
     * @param data
     * @param options
     * @param items Es el item actual del array de items de "data" que se está iterando
     */
    generateDatosAdicionalesUsoComercial(params, data) {
        const jsonResult = {};
        if (data['sectorAdicional']['ciclo']) {
            jsonResult['dCiclo'] = data['sectorAdicional']['ciclo'];
        }
        if (data['sectorAdicional']['inicioCiclo']) {
            jsonResult['dFecIniC'] = data['sectorAdicional']['inicioCiclo'];
        }
        if (data['sectorAdicional']['finCiclo']) {
            jsonResult['dFecFinC'] = data['sectorAdicional']['finCiclo'];
        }
        if (data['sectorAdicional']['vencimientoPago']) {
            let fecha = new Date(data.fecha);
            let fechaPago = new Date(data['sectorAdicional']['vencimientoPago']);
            jsonResult['dVencPag'] = data['sectorAdicional']['vencimientoPago'];
        }
        if (data['sectorAdicional']['numeroContrato']) {
            jsonResult['dContrato'] = data['sectorAdicional']['numeroContrato'];
        }
        if (data['sectorAdicional']['saldoAnterior']) {
            jsonResult['dSalAnt'] = data['sectorAdicional']['saldoAnterior'];
        }
        if (data['sectorAdicional']['codigoContratacionDNCP']) {
            jsonResult['dCodConDncp'] = data['sectorAdicional']['codigoContratacionDNCP']; //NT20
        }
        return jsonResult;
    }
}
exports.default = new JSonDteComplementariosService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbkR0ZUNvbXBsZW1lbnRhcmlvLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvanNvbkR0ZUNvbXBsZW1lbnRhcmlvLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztHQUlHO0FBQ0gsTUFBTSw2QkFBNkI7SUFDakM7Ozs7Ozs7T0FPRztJQUNJLHVEQUF1RCxDQUFDLE1BQVcsRUFBRSxJQUFTO1FBQ25GLE1BQU0sVUFBVSxHQUFRLEVBQUUsQ0FBQztRQUMzQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbEIsSUFBSSxJQUFJLENBQUMsd0JBQXdCLENBQUMsRUFBRTtZQUNsQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2IsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDbEY7UUFFRCxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUN6QixLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDeEU7UUFFRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1lBQy9CLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDYixVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM5RTtRQUVELElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7WUFDM0IsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNiLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsb0NBQW9DLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2xGO1FBRUQsSUFBSSxLQUFL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