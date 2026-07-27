"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringUtilService {
    constructor() {
        this.leftZero = (value, size) => {
            let s = value + '';
            while (s.length < size)
                s = '0' + s;
            return s;
        };
    }
}
exports.default = new StringUtilService();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyaW5nVXRpbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL1N0cmluZ1V0aWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0saUJBQWlCO0lBQXZCO1FBQ0UsYUFBUSxHQUFHLENBQUMsS0FBVSxFQUFFLElBQVksRUFBRSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDbkIsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUk7Z0JBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDcEMsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUM7SUFDSixDQUFDO0NBQUE7QUFFRCxrQkFBZSxJQUFJLGlCQUFpQixFQUFFLENBQUMifQ==