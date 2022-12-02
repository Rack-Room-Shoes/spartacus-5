/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { EntityScopedLoaderActions } from '../../../state/utils/scoped-loader/entity-scoped-loader.actions';
import { PRODUCT_DETAIL_ENTITY } from '../product-state';
export const LOAD_PRODUCT = '[Product] Load Product Data';
export const LOAD_PRODUCT_FAIL = '[Product] Load Product Data Fail';
export const LOAD_PRODUCT_SUCCESS = '[Product] Load Product Data Success';
export const CLEAR_PRODUCT_PRICE = '[Product] Clear Product PRICE';
export class LoadProduct extends EntityScopedLoaderActions.EntityScopedLoadAction {
    constructor(payload, scope = '') {
        super(PRODUCT_DETAIL_ENTITY, payload, scope);
        this.payload = payload;
        this.type = LOAD_PRODUCT;
    }
}
export class LoadProductFail extends EntityScopedLoaderActions.EntityScopedFailAction {
    constructor(productCode, payload, scope = '') {
        super(PRODUCT_DETAIL_ENTITY, productCode, scope, payload);
        this.payload = payload;
        this.type = LOAD_PRODUCT_FAIL;
    }
}
export class LoadProductSuccess extends EntityScopedLoaderActions.EntityScopedSuccessAction {
    constructor(payload, scope = '') {
        super(PRODUCT_DETAIL_ENTITY, payload.code ?? '', scope);
        this.payload = payload;
        this.type = LOAD_PRODUCT_SUCCESS;
    }
}
export class ClearProductPrice extends EntityScopedLoaderActions.EntityScopedResetAction {
    constructor() {
        super(PRODUCT_DETAIL_ENTITY, undefined, "price" /* ProductScope.PRICE */);
        this.type = CLEAR_PRODUCT_PRICE;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC5hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jb3JlL3NyYy9wcm9kdWN0L3N0b3JlL2FjdGlvbnMvcHJvZHVjdC5hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUtILE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGlFQUFpRSxDQUFDO0FBRTVHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXpELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyw2QkFBNkIsQ0FBQztBQUMxRCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxrQ0FBa0MsQ0FBQztBQUNwRSxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxxQ0FBcUMsQ0FBQztBQUMxRSxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQztBQVduRSxNQUFNLE9BQU8sV0FBWSxTQUFRLHlCQUF5QixDQUFDLHNCQUFzQjtJQUUvRSxZQUFtQixPQUFlLEVBQUUsS0FBSyxHQUFHLEVBQUU7UUFDNUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUQ1QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBRHpCLFNBQUksR0FBRyxZQUFZLENBQUM7SUFHN0IsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLGVBQWdCLFNBQVEseUJBQXlCLENBQUMsc0JBQXNCO0lBRW5GLFlBQVksV0FBbUIsRUFBUyxPQUFZLEVBQUUsS0FBSyxHQUFHLEVBQUU7UUFDOUQsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFEcEIsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUQzQyxTQUFJLEdBQUcsaUJBQWlCLENBQUM7SUFHbEMsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLGtCQUFtQixTQUFRLHlCQUF5QixDQUFDLHlCQUF5QjtJQUV6RixZQUFtQixPQUFnQixFQUFFLEtBQUssR0FBRyxFQUFFO1FBQzdDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUR2QyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBRDFCLFNBQUksR0FBRyxvQkFBb0IsQ0FBQztJQUdyQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8saUJBQWtCLFNBQVEseUJBQXlCLENBQUMsdUJBQXVCO0lBRXRGO1FBQ0UsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFNBQVMsbUNBQXFCLENBQUM7UUFGckQsU0FBSSxHQUFHLG1CQUFtQixDQUFDO0lBR3BDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDIyIFNBUCBTcGFydGFjdXMgdGVhbSA8c3BhcnRhY3VzLXRlYW1Ac2FwLmNvbT5cbiAqXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IFByb2R1Y3QgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9wcm9kdWN0Lm1vZGVsJztcbmltcG9ydCB7IEVudGl0eUxvYWRlck1ldGEgfSBmcm9tICcuLi8uLi8uLi9zdGF0ZS91dGlscy9lbnRpdHktbG9hZGVyL2VudGl0eS1sb2FkZXIuYWN0aW9uJztcbmltcG9ydCB7IEVudGl0eVNjb3BlZExvYWRlckFjdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9zdGF0ZS91dGlscy9zY29wZWQtbG9hZGVyL2VudGl0eS1zY29wZWQtbG9hZGVyLmFjdGlvbnMnO1xuaW1wb3J0IHsgUHJvZHVjdFNjb3BlIH0gZnJvbSAnLi4vLi4vbW9kZWwvcHJvZHVjdC1zY29wZSc7XG5pbXBvcnQgeyBQUk9EVUNUX0RFVEFJTF9FTlRJVFkgfSBmcm9tICcuLi9wcm9kdWN0LXN0YXRlJztcblxuZXhwb3J0IGNvbnN0IExPQURfUFJPRFVDVCA9ICdbUHJvZHVjdF0gTG9hZCBQcm9kdWN0IERhdGEnO1xuZXhwb3J0IGNvbnN0IExPQURfUFJPRFVDVF9GQUlMID0gJ1tQcm9kdWN0XSBMb2FkIFByb2R1Y3QgRGF0YSBGYWlsJztcbmV4cG9ydCBjb25zdCBMT0FEX1BST0RVQ1RfU1VDQ0VTUyA9ICdbUHJvZHVjdF0gTG9hZCBQcm9kdWN0IERhdGEgU3VjY2Vzcyc7XG5leHBvcnQgY29uc3QgQ0xFQVJfUFJPRFVDVF9QUklDRSA9ICdbUHJvZHVjdF0gQ2xlYXIgUHJvZHVjdCBQUklDRSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvZHVjdE1ldGEgZXh0ZW5kcyBFbnRpdHlMb2FkZXJNZXRhIHtcbiAgc2NvcGU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5U2NvcGVkTG9hZGVyQWN0aW9uIGV4dGVuZHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgcGF5bG9hZD86IGFueTtcbiAgcmVhZG9ubHkgbWV0YT86IFByb2R1Y3RNZXRhO1xufVxuXG5leHBvcnQgY2xhc3MgTG9hZFByb2R1Y3QgZXh0ZW5kcyBFbnRpdHlTY29wZWRMb2FkZXJBY3Rpb25zLkVudGl0eVNjb3BlZExvYWRBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTE9BRF9QUk9EVUNUO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogc3RyaW5nLCBzY29wZSA9ICcnKSB7XG4gICAgc3VwZXIoUFJPRFVDVF9ERVRBSUxfRU5USVRZLCBwYXlsb2FkLCBzY29wZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExvYWRQcm9kdWN0RmFpbCBleHRlbmRzIEVudGl0eVNjb3BlZExvYWRlckFjdGlvbnMuRW50aXR5U2NvcGVkRmFpbEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBMT0FEX1BST0RVQ1RfRkFJTDtcbiAgY29uc3RydWN0b3IocHJvZHVjdENvZGU6IHN0cmluZywgcHVibGljIHBheWxvYWQ6IGFueSwgc2NvcGUgPSAnJykge1xuICAgIHN1cGVyKFBST0RVQ1RfREVUQUlMX0VOVElUWSwgcHJvZHVjdENvZGUsIHNjb3BlLCBwYXlsb2FkKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTG9hZFByb2R1Y3RTdWNjZXNzIGV4dGVuZHMgRW50aXR5U2NvcGVkTG9hZGVyQWN0aW9ucy5FbnRpdHlTY29wZWRTdWNjZXNzQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IExPQURfUFJPRFVDVF9TVUNDRVNTO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogUHJvZHVjdCwgc2NvcGUgPSAnJykge1xuICAgIHN1cGVyKFBST0RVQ1RfREVUQUlMX0VOVElUWSwgcGF5bG9hZC5jb2RlID8/ICcnLCBzY29wZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENsZWFyUHJvZHVjdFByaWNlIGV4dGVuZHMgRW50aXR5U2NvcGVkTG9hZGVyQWN0aW9ucy5FbnRpdHlTY29wZWRSZXNldEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBDTEVBUl9QUk9EVUNUX1BSSUNFO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihQUk9EVUNUX0RFVEFJTF9FTlRJVFksIHVuZGVmaW5lZCwgUHJvZHVjdFNjb3BlLlBSSUNFKTtcbiAgfVxufVxuXG4vLyBhY3Rpb24gdHlwZXNcbmV4cG9ydCB0eXBlIFByb2R1Y3RBY3Rpb24gPVxuICB8IExvYWRQcm9kdWN0XG4gIHwgTG9hZFByb2R1Y3RGYWlsXG4gIHwgTG9hZFByb2R1Y3RTdWNjZXNzXG4gIHwgQ2xlYXJQcm9kdWN0UHJpY2U7XG4iXX0=