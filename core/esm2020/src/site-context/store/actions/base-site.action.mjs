/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
export const LOAD_BASE_SITE = '[Site-context] Load BaseSite';
export const LOAD_BASE_SITE_FAIL = '[Site-context] Load BaseSite Fail';
export const LOAD_BASE_SITE_SUCCESS = '[Site-context] Load BaseSite Success';
export const LOAD_BASE_SITES = '[Site-context] Load BaseSites';
export const LOAD_BASE_SITES_FAIL = '[Site-context] Load BaseSites Fail';
export const LOAD_BASE_SITES_SUCCESS = '[Site-context] Load BaseSites Success';
export const SET_ACTIVE_BASE_SITE = '[Site-context] Set Active BaseSite';
export const BASE_SITE_CHANGE = '[Site-context] BaseSite Change';
export class LoadBaseSite {
    constructor() {
        this.type = LOAD_BASE_SITE;
    }
}
export class LoadBaseSiteFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BASE_SITE_FAIL;
    }
}
export class LoadBaseSiteSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BASE_SITE_SUCCESS;
    }
}
export class LoadBaseSites {
    constructor() {
        this.type = LOAD_BASE_SITES;
    }
}
export class LoadBaseSitesFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BASE_SITES_FAIL;
    }
}
export class LoadBaseSitesSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BASE_SITES_SUCCESS;
    }
}
export class SetActiveBaseSite {
    constructor(payload) {
        this.payload = payload;
        this.type = SET_ACTIVE_BASE_SITE;
    }
}
export class BaseSiteChange {
    constructor() {
        this.type = BASE_SITE_CHANGE;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1zaXRlLmFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2NvcmUvc3JjL3NpdGUtY29udGV4dC9zdG9yZS9hY3Rpb25zL2Jhc2Utc2l0ZS5hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUtILE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyw4QkFBOEIsQ0FBQztBQUM3RCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxtQ0FBbUMsQ0FBQztBQUN2RSxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxzQ0FBc0MsQ0FBQztBQUU3RSxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsK0JBQStCLENBQUM7QUFDL0QsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsb0NBQW9DLENBQUM7QUFDekUsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsdUNBQXVDLENBQUM7QUFFL0UsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsb0NBQW9DLENBQUM7QUFDekUsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsZ0NBQWdDLENBQUM7QUFFakUsTUFBTSxPQUFPLFlBQVk7SUFBekI7UUFDVyxTQUFJLEdBQUcsY0FBYyxDQUFDO0lBQ2pDLENBQUM7Q0FBQTtBQUVELE1BQU0sT0FBTyxnQkFBZ0I7SUFFM0IsWUFBbUIsT0FBWTtRQUFaLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFEdEIsU0FBSSxHQUFHLG1CQUFtQixDQUFDO0lBQ0YsQ0FBQztDQUNwQztBQUVELE1BQU0sT0FBTyxtQkFBbUI7SUFFOUIsWUFBbUIsT0FBaUI7UUFBakIsWUFBTyxHQUFQLE9BQU8sQ0FBVTtRQUQzQixTQUFJLEdBQUcsc0JBQXNCLENBQUM7SUFDQSxDQUFDO0NBQ3pDO0FBRUQsTUFBTSxPQUFPLGFBQWE7SUFBMUI7UUFDVyxTQUFJLEdBQUcsZUFBZSxDQUFDO0lBQ2xDLENBQUM7Q0FBQTtBQUVELE1BQU0sT0FBTyxpQkFBaUI7SUFFNUIsWUFBbUIsT0FBWTtRQUFaLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFEdEIsU0FBSSxHQUFHLG9CQUFvQixDQUFDO0lBQ0gsQ0FBQztDQUNwQztBQUVELE1BQU0sT0FBTyxvQkFBb0I7SUFFL0IsWUFBbUIsT0FBbUI7UUFBbkIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUQ3QixTQUFJLEdBQUcsdUJBQXVCLENBQUM7SUFDQyxDQUFDO0NBQzNDO0FBRUQsTUFBTSxPQUFPLGlCQUFpQjtJQUU1QixZQUFtQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUR6QixTQUFJLEdBQUcsb0JBQW9CLENBQUM7SUFDQSxDQUFDO0NBQ3ZDO0FBRUQsTUFBTSxPQUFPLGNBQWM7SUFBM0I7UUFDVyxTQUFJLEdBQUcsZ0JBQWdCLENBQUM7SUFDbkMsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjIgU0FQIFNwYXJ0YWN1cyB0ZWFtIDxzcGFydGFjdXMtdGVhbUBzYXAuY29tPlxuICpcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG4gKi9cblxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQmFzZVNpdGUgfSBmcm9tICcuLi8uLi8uLi9tb2RlbC9taXNjLm1vZGVsJztcblxuZXhwb3J0IGNvbnN0IExPQURfQkFTRV9TSVRFID0gJ1tTaXRlLWNvbnRleHRdIExvYWQgQmFzZVNpdGUnO1xuZXhwb3J0IGNvbnN0IExPQURfQkFTRV9TSVRFX0ZBSUwgPSAnW1NpdGUtY29udGV4dF0gTG9hZCBCYXNlU2l0ZSBGYWlsJztcbmV4cG9ydCBjb25zdCBMT0FEX0JBU0VfU0lURV9TVUNDRVNTID0gJ1tTaXRlLWNvbnRleHRdIExvYWQgQmFzZVNpdGUgU3VjY2Vzcyc7XG5cbmV4cG9ydCBjb25zdCBMT0FEX0JBU0VfU0lURVMgPSAnW1NpdGUtY29udGV4dF0gTG9hZCBCYXNlU2l0ZXMnO1xuZXhwb3J0IGNvbnN0IExPQURfQkFTRV9TSVRFU19GQUlMID0gJ1tTaXRlLWNvbnRleHRdIExvYWQgQmFzZVNpdGVzIEZhaWwnO1xuZXhwb3J0IGNvbnN0IExPQURfQkFTRV9TSVRFU19TVUNDRVNTID0gJ1tTaXRlLWNvbnRleHRdIExvYWQgQmFzZVNpdGVzIFN1Y2Nlc3MnO1xuXG5leHBvcnQgY29uc3QgU0VUX0FDVElWRV9CQVNFX1NJVEUgPSAnW1NpdGUtY29udGV4dF0gU2V0IEFjdGl2ZSBCYXNlU2l0ZSc7XG5leHBvcnQgY29uc3QgQkFTRV9TSVRFX0NIQU5HRSA9ICdbU2l0ZS1jb250ZXh0XSBCYXNlU2l0ZSBDaGFuZ2UnO1xuXG5leHBvcnQgY2xhc3MgTG9hZEJhc2VTaXRlIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IExPQURfQkFTRV9TSVRFO1xufVxuXG5leHBvcnQgY2xhc3MgTG9hZEJhc2VTaXRlRmFpbCBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBMT0FEX0JBU0VfU0lURV9GQUlMO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogYW55KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTG9hZEJhc2VTaXRlU3VjY2VzcyBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBMT0FEX0JBU0VfU0lURV9TVUNDRVNTO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogQmFzZVNpdGUpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2FkQmFzZVNpdGVzIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IExPQURfQkFTRV9TSVRFUztcbn1cblxuZXhwb3J0IGNsYXNzIExvYWRCYXNlU2l0ZXNGYWlsIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IExPQURfQkFTRV9TSVRFU19GQUlMO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogYW55KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTG9hZEJhc2VTaXRlc1N1Y2Nlc3MgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTE9BRF9CQVNFX1NJVEVTX1NVQ0NFU1M7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBCYXNlU2l0ZVtdKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU2V0QWN0aXZlQmFzZVNpdGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gU0VUX0FDVElWRV9CQVNFX1NJVEU7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBCYXNlU2l0ZUNoYW5nZSBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBCQVNFX1NJVEVfQ0hBTkdFO1xufVxuXG4vLyBhY3Rpb24gdHlwZXNcbmV4cG9ydCB0eXBlIEJhc2VTaXRlQWN0aW9uID1cbiAgfCBMb2FkQmFzZVNpdGVcbiAgfCBMb2FkQmFzZVNpdGVGYWlsXG4gIHwgTG9hZEJhc2VTaXRlU3VjY2Vzc1xuICB8IExvYWRCYXNlU2l0ZXNcbiAgfCBMb2FkQmFzZVNpdGVzRmFpbFxuICB8IExvYWRCYXNlU2l0ZXNTdWNjZXNzXG4gIHwgU2V0QWN0aXZlQmFzZVNpdGVcbiAgfCBCYXNlU2l0ZUNoYW5nZTtcbiJdfQ==