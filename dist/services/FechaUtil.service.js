"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StringUtil_service_1 = __importDefault(require("./StringUtil.service"));
class FechaUtilService {
    convertToAAAAMMDD(fecha) {
        return (fecha.getFullYear() +
            StringUtil_service_1.default.leftZero(fecha.getMonth() + 1, 2) +
            StringUtil_service_1.default.leftZero(fecha.getDate(), 2));
    }
    convertToAAAA_MM_DD(fecha) {
        return (fecha.getFullYear() +
            '-' +
            StringUtil_service_1.default.leftZero(fecha.getMonth() + 1, 2) +
            '-' +
            StringUtil_service_1.default.leftZero(fecha.getDate(), 2));
    }
    convertToJSONFormat(fecha) {
        return (fecha.getFullYear() +
            '-' +
            StringUtil_service_1.default.leftZero(fecha.getMonth() + 1, 2) +
            '-' +
            StringUtil_service_1.default.leftZero(fecha.getDate(), 2) +
            'T' +
            StringUtil_service_1.default.leftZero(fecha.getHours(), 2) +
            ':' +
            StringUtil_service_1.default.leftZero(fecha.getMinutes(), 2) +
            ':' +
            StringUtil_service_1.default.leftZero(fecha.getSeconds(), 2));
    }
    isIsoDateTime(str) {
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(str))
            return false;
        try {
            const d = new Date(str + '.000Z');
            return d.toISOString() === str + '.000Z';
        }
        catch (error) {
            const errorAny = error;
            throw new Error('Error en campo ' + str + ': ' + (errorAny === null || errorAny === void 0 ? void 0 : errorAny.message));
        }
    }
    isIsoDate(str) {
        if (!/\d{4}-\d{2}-\d{2}/.test(str))
            return false;
        return true;
    }
}
exports.default = new FechaUtilService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmVjaGFVdGlsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2VydmljZXMvRmVjaGFVdGlsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4RUFBcUQ7QUFFckQsTUFBTSxnQkFBZ0I7SUFDcEIsaUJBQWlCLENBQUMsS0FBVztRQUMzQixPQUFPLENBQ0wsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUNuQiw0QkFBaUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkQsNEJBQWlCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FDL0MsQ0FBQztJQUNKLENBQUM7SUFDRCxtQkFBbUIsQ0FBQyxLQUFXO1FBQzdCLE9BQU8sQ0FDTCxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ25CLEdBQUc7WUFDSCw0QkFBaUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkQsR0FBRztZQUNILDRCQUFpQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQy9DLENBQUM7SUFDSixDQUFDO0lBQ0QsbUJBQW1CLENBQUMsS0FBVztRQUM3QixPQUFPLENBQ0wsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUNuQixHQUFHO1lBQ0gsNEJBQWlCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELEdBQUc7WUFDSCw0QkFBaUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QyxHQUFHO1lBQ0gsNEJBQWlCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDL0MsR0FBRztZQUNILDRCQUFpQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELEdBQUc7WUFDSCw0QkFBaUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUNsRCxDQUFDO0lBQ0osQ0FBQztJQUVELGFBQWEsQ0FBQyxHQUFXO1FBQ3ZCLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFbkUsSUFBSTtZQUNGLE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQztZQUNsQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxHQUFHLEdBQUcsT0FBTyxDQUFDO1NBQzFDO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLFFBQVEsR0FBUSxLQUFLLENBQUM7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLEdBQUcsSUFBSSxJQUFHLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxPQUFPLENBQUEsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFXO1FBQ25CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFDakQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxJQUFJLGdCQUFnQixFQUFFLENBQUMifQ==