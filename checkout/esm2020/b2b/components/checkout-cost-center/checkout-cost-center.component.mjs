/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component, HostBinding, } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@spartacus/core";
import * as i2 from "@spartacus/checkout/b2b/root";
import * as i3 from "@angular/common";
export class CheckoutCostCenterComponent {
    constructor(userCostCenterService, checkoutCostCenterFacade, checkoutPaymentTypeFacade) {
        this.userCostCenterService = userCostCenterService;
        this.checkoutCostCenterFacade = checkoutCostCenterFacade;
        this.checkoutPaymentTypeFacade = checkoutPaymentTypeFacade;
        this.subscription = new Subscription();
        this.userCostCenters$ = this.userCostCenterService
            .getActiveCostCenters()
            .pipe(filter((costCenters) => !!costCenters));
    }
    get disabled() {
        return !this.isAccountPayment;
    }
    ngOnInit() {
        this.subscription.add(this.checkoutPaymentTypeFacade
            .isAccountPayment()
            .pipe(distinctUntilChanged())
            .subscribe((isAccountPayment) => {
            this.isAccountPayment = isAccountPayment;
        }));
        this.costCenters$ = combineLatest([
            this.userCostCenters$,
            this.checkoutCostCenterFacade.getCostCenterState().pipe(filter((state) => !state.loading), map((state) => state.data), distinctUntilChanged()),
        ]).pipe(take(1), tap(([costCenters, costCenter]) => {
            if (!costCenter) {
                this.setCostCenter(costCenters[0].code);
            }
            else {
                this.costCenterId = costCenter.code;
            }
        }), map(([costCenters]) => costCenters));
    }
    setCostCenter(selectCostCenter) {
        this.costCenterId = selectCostCenter;
        this.checkoutCostCenterFacade.setCostCenter(this.costCenterId);
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
CheckoutCostCenterComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CheckoutCostCenterComponent, deps: [{ token: i1.UserCostCenterService }, { token: i2.CheckoutCostCenterFacade }, { token: i2.CheckoutPaymentTypeFacade }], target: i0.ɵɵFactoryTarget.Component });
CheckoutCostCenterComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.3", type: CheckoutCostCenterComponent, selector: "cx-cost-center", host: { properties: { "class.hidden": "this.disabled" } }, ngImport: i0, template: "<ng-container *ngIf=\"isAccountPayment\">\n  <div class=\"row\">\n    <div class=\"col-md-12 col-xl-10\">\n      <ng-container *ngIf=\"costCenters$ | async as costCenters\">\n        <div *ngIf=\"costCenters.length !== 0\">\n          <label>\n            <span class=\"label-content required\">{{\n              'checkoutB2B.costCenter' | cxTranslate\n            }}</span>\n            <select (change)=\"setCostCenter($event.target.value)\">\n              <option\n                *ngFor=\"let costCenter of costCenters\"\n                value=\"{{ costCenter.code }}\"\n                [selected]=\"costCenterId === costCenter.code\"\n              >\n                {{ costCenter.name }}\n              </option>\n            </select>\n            <span class=\"label-content\">{{\n              'checkoutB2B.availableLabel' | cxTranslate\n            }}</span>\n          </label>\n        </div>\n      </ng-container>\n    </div>\n  </div>\n</ng-container>\n", dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }, { kind: "pipe", type: i1.TranslatePipe, name: "cxTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CheckoutCostCenterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cx-cost-center', changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-container *ngIf=\"isAccountPayment\">\n  <div class=\"row\">\n    <div class=\"col-md-12 col-xl-10\">\n      <ng-container *ngIf=\"costCenters$ | async as costCenters\">\n        <div *ngIf=\"costCenters.length !== 0\">\n          <label>\n            <span class=\"label-content required\">{{\n              'checkoutB2B.costCenter' | cxTranslate\n            }}</span>\n            <select (change)=\"setCostCenter($event.target.value)\">\n              <option\n                *ngFor=\"let costCenter of costCenters\"\n                value=\"{{ costCenter.code }}\"\n                [selected]=\"costCenterId === costCenter.code\"\n              >\n                {{ costCenter.name }}\n              </option>\n            </select>\n            <span class=\"label-content\">{{\n              'checkoutB2B.availableLabel' | cxTranslate\n            }}</span>\n          </label>\n        </div>\n      </ng-container>\n    </div>\n  </div>\n</ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: i1.UserCostCenterService }, { type: i2.CheckoutCostCenterFacade }, { type: i2.CheckoutPaymentTypeFacade }]; }, propDecorators: { disabled: [{
                type: HostBinding,
                args: ['class.hidden']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tvdXQtY29zdC1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL2NoZWNrb3V0L2IyYi9jb21wb25lbnRzL2NoZWNrb3V0LWNvc3QtY2VudGVyL2NoZWNrb3V0LWNvc3QtY2VudGVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL2ZlYXR1cmUtbGlicy9jaGVja291dC9iMmIvY29tcG9uZW50cy9jaGVja291dC1jb3N0LWNlbnRlci9jaGVja291dC1jb3N0LWNlbnRlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsV0FBVyxHQUdaLE1BQU0sZUFBZSxDQUFDO0FBTXZCLE9BQU8sRUFBRSxhQUFhLEVBQWMsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFPOUUsTUFBTSxPQUFPLDJCQUEyQjtJQWdCdEMsWUFDWSxxQkFBNEMsRUFDNUMsd0JBQWtELEVBQ2xELHlCQUFvRDtRQUZwRCwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQWxCdEQsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2xDLHFCQUFnQixHQUN4QixJQUFJLENBQUMscUJBQXFCO2FBQ3ZCLG9CQUFvQixFQUFFO2FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBZS9DLENBQUM7SUFUSixJQUNJLFFBQVE7UUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ2hDLENBQUM7SUFRRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQ25CLElBQUksQ0FBQyx5QkFBeUI7YUFDM0IsZ0JBQWdCLEVBQUU7YUFDbEIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7YUFDNUIsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtZQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQ0wsQ0FBQztRQUVGLElBQUksQ0FBQyxZQUFZLEdBQUcsYUFBYSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxnQkFBZ0I7WUFDckIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGtCQUFrQixFQUFFLENBQUMsSUFBSSxDQUNyRCxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUNqQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFDMUIsb0JBQW9CLEVBQUUsQ0FDdkI7U0FDRixDQUFDLENBQUMsSUFBSSxDQUNMLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBYyxDQUFDLENBQUM7YUFDbkQ7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO2FBQ3JDO1FBQ0gsQ0FBQyxDQUFDLEVBQ0YsR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQ3BDLENBQUM7SUFDSixDQUFDO0lBRUQsYUFBYSxDQUFDLGdCQUF3QjtRQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLGdCQUFnQixDQUFDO1FBQ3JDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDOzt3SEEzRFUsMkJBQTJCOzRHQUEzQiwyQkFBMkIsaUhDMUJ4Qyw0OEJBMkJBOzJGRERhLDJCQUEyQjtrQkFMdkMsU0FBUzsrQkFDRSxnQkFBZ0IsbUJBRVQsdUJBQXVCLENBQUMsTUFBTTsyTEFjM0MsUUFBUTtzQkFEWCxXQUFXO3VCQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyMiBTQVAgU3BhcnRhY3VzIHRlYW0gPHNwYXJ0YWN1cy10ZWFtQHNhcC5jb20+XG4gKlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBIb3N0QmluZGluZyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2hlY2tvdXRDb3N0Q2VudGVyRmFjYWRlLFxuICBDaGVja291dFBheW1lbnRUeXBlRmFjYWRlLFxufSBmcm9tICdAc3BhcnRhY3VzL2NoZWNrb3V0L2IyYi9yb290JztcbmltcG9ydCB7IENvc3RDZW50ZXIsIFVzZXJDb3N0Q2VudGVyU2VydmljZSB9IGZyb20gJ0BzcGFydGFjdXMvY29yZSc7XG5pbXBvcnQgeyBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBmaWx0ZXIsIG1hcCwgdGFrZSwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjeC1jb3N0LWNlbnRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9jaGVja291dC1jb3N0LWNlbnRlci5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBDaGVja291dENvc3RDZW50ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByb3RlY3RlZCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gIHByb3RlY3RlZCB1c2VyQ29zdENlbnRlcnMkOiBPYnNlcnZhYmxlPENvc3RDZW50ZXJbXT4gPVxuICAgIHRoaXMudXNlckNvc3RDZW50ZXJTZXJ2aWNlXG4gICAgICAuZ2V0QWN0aXZlQ29zdENlbnRlcnMoKVxuICAgICAgLnBpcGUoZmlsdGVyKChjb3N0Q2VudGVycykgPT4gISFjb3N0Q2VudGVycykpO1xuXG4gIGNvc3RDZW50ZXJJZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBjb3N0Q2VudGVycyQ6IE9ic2VydmFibGU8Q29zdENlbnRlcltdPjtcbiAgaXNBY2NvdW50UGF5bWVudDogYm9vbGVhbjtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmhpZGRlbicpXG4gIGdldCBkaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNBY2NvdW50UGF5bWVudDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCB1c2VyQ29zdENlbnRlclNlcnZpY2U6IFVzZXJDb3N0Q2VudGVyU2VydmljZSxcbiAgICBwcm90ZWN0ZWQgY2hlY2tvdXRDb3N0Q2VudGVyRmFjYWRlOiBDaGVja291dENvc3RDZW50ZXJGYWNhZGUsXG4gICAgcHJvdGVjdGVkIGNoZWNrb3V0UGF5bWVudFR5cGVGYWNhZGU6IENoZWNrb3V0UGF5bWVudFR5cGVGYWNhZGVcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChcbiAgICAgIHRoaXMuY2hlY2tvdXRQYXltZW50VHlwZUZhY2FkZVxuICAgICAgICAuaXNBY2NvdW50UGF5bWVudCgpXG4gICAgICAgIC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKGlzQWNjb3VudFBheW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzLmlzQWNjb3VudFBheW1lbnQgPSBpc0FjY291bnRQYXltZW50O1xuICAgICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLmNvc3RDZW50ZXJzJCA9IGNvbWJpbmVMYXRlc3QoW1xuICAgICAgdGhpcy51c2VyQ29zdENlbnRlcnMkLFxuICAgICAgdGhpcy5jaGVja291dENvc3RDZW50ZXJGYWNhZGUuZ2V0Q29zdENlbnRlclN0YXRlKCkucGlwZShcbiAgICAgICAgZmlsdGVyKChzdGF0ZSkgPT4gIXN0YXRlLmxvYWRpbmcpLFxuICAgICAgICBtYXAoKHN0YXRlKSA9PiBzdGF0ZS5kYXRhKSxcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKVxuICAgICAgKSxcbiAgICBdKS5waXBlKFxuICAgICAgdGFrZSgxKSxcbiAgICAgIHRhcCgoW2Nvc3RDZW50ZXJzLCBjb3N0Q2VudGVyXSkgPT4ge1xuICAgICAgICBpZiAoIWNvc3RDZW50ZXIpIHtcbiAgICAgICAgICB0aGlzLnNldENvc3RDZW50ZXIoY29zdENlbnRlcnNbMF0uY29kZSBhcyBzdHJpbmcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY29zdENlbnRlcklkID0gY29zdENlbnRlci5jb2RlO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIG1hcCgoW2Nvc3RDZW50ZXJzXSkgPT4gY29zdENlbnRlcnMpXG4gICAgKTtcbiAgfVxuXG4gIHNldENvc3RDZW50ZXIoc2VsZWN0Q29zdENlbnRlcjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5jb3N0Q2VudGVySWQgPSBzZWxlY3RDb3N0Q2VudGVyO1xuICAgIHRoaXMuY2hlY2tvdXRDb3N0Q2VudGVyRmFjYWRlLnNldENvc3RDZW50ZXIodGhpcy5jb3N0Q2VudGVySWQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIiwiPG5nLWNvbnRhaW5lciAqbmdJZj1cImlzQWNjb3VudFBheW1lbnRcIj5cbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTIgY29sLXhsLTEwXCI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29zdENlbnRlcnMkIHwgYXN5bmMgYXMgY29zdENlbnRlcnNcIj5cbiAgICAgICAgPGRpdiAqbmdJZj1cImNvc3RDZW50ZXJzLmxlbmd0aCAhPT0gMFwiPlxuICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwtY29udGVudCByZXF1aXJlZFwiPnt7XG4gICAgICAgICAgICAgICdjaGVja291dEIyQi5jb3N0Q2VudGVyJyB8IGN4VHJhbnNsYXRlXG4gICAgICAgICAgICB9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxzZWxlY3QgKGNoYW5nZSk9XCJzZXRDb3N0Q2VudGVyKCRldmVudC50YXJnZXQudmFsdWUpXCI+XG4gICAgICAgICAgICAgIDxvcHRpb25cbiAgICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgY29zdENlbnRlciBvZiBjb3N0Q2VudGVyc1wiXG4gICAgICAgICAgICAgICAgdmFsdWU9XCJ7eyBjb3N0Q2VudGVyLmNvZGUgfX1cIlxuICAgICAgICAgICAgICAgIFtzZWxlY3RlZF09XCJjb3N0Q2VudGVySWQgPT09IGNvc3RDZW50ZXIuY29kZVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7eyBjb3N0Q2VudGVyLm5hbWUgfX1cbiAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwtY29udGVudFwiPnt7XG4gICAgICAgICAgICAgICdjaGVja291dEIyQi5hdmFpbGFibGVMYWJlbCcgfCBjeFRyYW5zbGF0ZVxuICAgICAgICAgICAgfX08L3NwYW4+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L25nLWNvbnRhaW5lcj5cbiJdfQ==