/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { ProductListItemContext, ProductListItemContextSource, } from '@spartacus/storefront';
import * as i0 from "@angular/core";
import * as i1 from "@spartacus/storefront";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
import * as i4 from "@spartacus/core";
export class WishListItemComponent {
    constructor(productListItemContextSource) {
        this.productListItemContextSource = productListItemContextSource;
        this.isLoading = false;
        this.remove = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes?.cartEntry) {
            this.productListItemContextSource.product$.next(this.cartEntry.product);
        }
    }
    removeEntry(item) {
        this.remove.emit(item);
    }
}
WishListItemComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: WishListItemComponent, deps: [{ token: i1.ProductListItemContextSource }], target: i0.ɵɵFactoryTarget.Component });
WishListItemComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.3", type: WishListItemComponent, selector: "[cx-wish-list-item], cx-wish-list-item", inputs: { isLoading: "isLoading", cartEntry: "cartEntry" }, outputs: { remove: "remove" }, providers: [
        ProductListItemContextSource,
        {
            provide: ProductListItemContext,
            useExisting: ProductListItemContextSource,
        },
    ], usesOnChanges: true, ngImport: i0, template: "<td role=\"cell\">\n  <div class=\"cx-table-item-container\">\n    <!-- Item Image -->\n    <a\n      [routerLink]=\"{ cxRoute: 'product', params: cartEntry.product } | cxUrl\"\n      tabindex=\"-1\"\n    >\n      <cx-media\n        [container]=\"cartEntry.product?.images?.PRIMARY\"\n        format=\"thumbnail\"\n      ></cx-media>\n    </a>\n    <div class=\"cx-info\">\n      <div *ngIf=\"cartEntry.product?.name\" class=\"cx-name\">\n        <a\n          class=\"cx-link\"\n          [routerLink]=\"\n            { cxRoute: 'product', params: cartEntry.product } | cxUrl\n          \"\n          >{{ cartEntry.product?.name }}</a\n        >\n      </div>\n      <div *ngIf=\"cartEntry.product?.code\" class=\"cx-code\">\n        {{ 'cartItems.id' | cxTranslate }} {{ cartEntry.product?.code }}\n      </div>\n    </div>\n  </div>\n  <!-- Variants -->\n  <ng-container *ngIf=\"cartEntry.product?.baseOptions?.length\">\n    <div\n      *ngFor=\"\n        let variant of cartEntry.product?.baseOptions[0]?.selected\n          ?.variantOptionQualifiers\n      \"\n      class=\"cx-property\"\n    >\n      <div class=\"cx-label\" *ngIf=\"variant.name && variant.value\">\n        {{ variant.name }}: {{ variant.value }}\n      </div>\n    </div>\n  </ng-container>\n</td>\n<!-- Item Price -->\n<td role=\"cell\" *ngIf=\"cartEntry.basePrice\" class=\"cx-price\">\n  <div class=\"cx-mobile-header\">\n    {{ 'cartItems.itemPrice' | cxTranslate }}\n  </div>\n  <div *ngIf=\"cartEntry.basePrice\" class=\"cx-value\">\n    {{ cartEntry.basePrice?.formattedValue }}\n  </div>\n</td>\n<!-- Action -->\n<td role=\"cell\" class=\"cx-actions\">\n  <ng-container\n    *ngIf=\"cartEntry.updateable\"\n    cxInnerComponentsHost\n  ></ng-container>\n  <ng-template #outOfStock>\n    <span class=\"cx-out-of-stock\">\n      {{ 'addToCart.outOfStock' | cxTranslate }}\n    </span>\n  </ng-template>\n  <button\n    *ngIf=\"cartEntry.updateable\"\n    (click)=\"removeEntry(cartEntry)\"\n    [cxAtMessage]=\"'wishlist.itemRemoved' | cxTranslate\"\n    [disabled]=\"isLoading\"\n    class=\"link cx-action-link cx-remove-btn\"\n  >\n    {{ 'common.remove' | cxTranslate }}\n  </button>\n</td>\n", dependencies: [{ kind: "directive", type: i1.AtMessageDirective, selector: "[cxAtMessage]", inputs: ["cxAtMessage"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i1.MediaComponent, selector: "cx-media", inputs: ["container", "format", "alt", "role", "loading"], outputs: ["loaded"] }, { kind: "directive", type: i1.InnerComponentsHostDirective, selector: "[cxInnerComponentsHost]" }, { kind: "directive", type: i3.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "pipe", type: i4.TranslatePipe, name: "cxTranslate" }, { kind: "pipe", type: i4.UrlPipe, name: "cxUrl" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: WishListItemComponent, decorators: [{
            type: Component,
            args: [{ selector: '[cx-wish-list-item], cx-wish-list-item', changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        ProductListItemContextSource,
                        {
                            provide: ProductListItemContext,
                            useExisting: ProductListItemContextSource,
                        },
                    ], template: "<td role=\"cell\">\n  <div class=\"cx-table-item-container\">\n    <!-- Item Image -->\n    <a\n      [routerLink]=\"{ cxRoute: 'product', params: cartEntry.product } | cxUrl\"\n      tabindex=\"-1\"\n    >\n      <cx-media\n        [container]=\"cartEntry.product?.images?.PRIMARY\"\n        format=\"thumbnail\"\n      ></cx-media>\n    </a>\n    <div class=\"cx-info\">\n      <div *ngIf=\"cartEntry.product?.name\" class=\"cx-name\">\n        <a\n          class=\"cx-link\"\n          [routerLink]=\"\n            { cxRoute: 'product', params: cartEntry.product } | cxUrl\n          \"\n          >{{ cartEntry.product?.name }}</a\n        >\n      </div>\n      <div *ngIf=\"cartEntry.product?.code\" class=\"cx-code\">\n        {{ 'cartItems.id' | cxTranslate }} {{ cartEntry.product?.code }}\n      </div>\n    </div>\n  </div>\n  <!-- Variants -->\n  <ng-container *ngIf=\"cartEntry.product?.baseOptions?.length\">\n    <div\n      *ngFor=\"\n        let variant of cartEntry.product?.baseOptions[0]?.selected\n          ?.variantOptionQualifiers\n      \"\n      class=\"cx-property\"\n    >\n      <div class=\"cx-label\" *ngIf=\"variant.name && variant.value\">\n        {{ variant.name }}: {{ variant.value }}\n      </div>\n    </div>\n  </ng-container>\n</td>\n<!-- Item Price -->\n<td role=\"cell\" *ngIf=\"cartEntry.basePrice\" class=\"cx-price\">\n  <div class=\"cx-mobile-header\">\n    {{ 'cartItems.itemPrice' | cxTranslate }}\n  </div>\n  <div *ngIf=\"cartEntry.basePrice\" class=\"cx-value\">\n    {{ cartEntry.basePrice?.formattedValue }}\n  </div>\n</td>\n<!-- Action -->\n<td role=\"cell\" class=\"cx-actions\">\n  <ng-container\n    *ngIf=\"cartEntry.updateable\"\n    cxInnerComponentsHost\n  ></ng-container>\n  <ng-template #outOfStock>\n    <span class=\"cx-out-of-stock\">\n      {{ 'addToCart.outOfStock' | cxTranslate }}\n    </span>\n  </ng-template>\n  <button\n    *ngIf=\"cartEntry.updateable\"\n    (click)=\"removeEntry(cartEntry)\"\n    [cxAtMessage]=\"'wishlist.itemRemoved' | cxTranslate\"\n    [disabled]=\"isLoading\"\n    class=\"link cx-action-link cx-remove-btn\"\n  >\n    {{ 'common.remove' | cxTranslate }}\n  </button>\n</td>\n" }]
        }], ctorParameters: function () { return [{ type: i1.ProductListItemContextSource }]; }, propDecorators: { isLoading: [{
                type: Input
            }], cartEntry: [{
                type: Input
            }], remove: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lzaC1saXN0LWl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL2NhcnQvd2lzaC1saXN0L2NvbXBvbmVudHMvd2lzaC1saXN0LWl0ZW0vd2lzaC1saXN0LWl0ZW0uY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL2NhcnQvd2lzaC1saXN0L2NvbXBvbmVudHMvd2lzaC1saXN0LWl0ZW0vd2lzaC1saXN0LWl0ZW0uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxHQUVQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFDTCxzQkFBc0IsRUFDdEIsNEJBQTRCLEdBQzdCLE1BQU0sdUJBQXVCLENBQUM7Ozs7OztBQWMvQixNQUFNLE9BQU8scUJBQXFCO0lBUWhDLFlBQ1ksNEJBQTBEO1FBQTFELGlDQUE0QixHQUE1Qiw0QkFBNEIsQ0FBOEI7UUFQdEUsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUlsQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztJQUlyQyxDQUFDO0lBRUosV0FBVyxDQUFDLE9BQXVCO1FBQ2pDLElBQUksT0FBTyxFQUFFLFNBQVMsRUFBRTtZQUN0QixJQUFJLENBQUMsNEJBQTRCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3pFO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFnQjtRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QixDQUFDOztrSEFwQlUscUJBQXFCO3NHQUFyQixxQkFBcUIsNEpBUnJCO1FBQ1QsNEJBQTRCO1FBQzVCO1lBQ0UsT0FBTyxFQUFFLHNCQUFzQjtZQUMvQixXQUFXLEVBQUUsNEJBQTRCO1NBQzFDO0tBQ0YsK0NDL0JILHFvRUF3RUE7MkZEdkNhLHFCQUFxQjtrQkFaakMsU0FBUzsrQkFDRSx3Q0FBd0MsbUJBRWpDLHVCQUF1QixDQUFDLE1BQU0sYUFDcEM7d0JBQ1QsNEJBQTRCO3dCQUM1Qjs0QkFDRSxPQUFPLEVBQUUsc0JBQXNCOzRCQUMvQixXQUFXLEVBQUUsNEJBQTRCO3lCQUMxQztxQkFDRjttSEFJRCxTQUFTO3NCQURSLEtBQUs7Z0JBRUcsU0FBUztzQkFBakIsS0FBSztnQkFHTixNQUFNO3NCQURMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyMiBTQVAgU3BhcnRhY3VzIHRlYW0gPHNwYXJ0YWN1cy10ZWFtQHNhcC5jb20+XG4gKlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPcmRlckVudHJ5IH0gZnJvbSAnQHNwYXJ0YWN1cy9jYXJ0L2Jhc2Uvcm9vdCc7XG5pbXBvcnQge1xuICBQcm9kdWN0TGlzdEl0ZW1Db250ZXh0LFxuICBQcm9kdWN0TGlzdEl0ZW1Db250ZXh0U291cmNlLFxufSBmcm9tICdAc3BhcnRhY3VzL3N0b3JlZnJvbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbY3gtd2lzaC1saXN0LWl0ZW1dLCBjeC13aXNoLWxpc3QtaXRlbScsXG4gIHRlbXBsYXRlVXJsOiAnLi93aXNoLWxpc3QtaXRlbS5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtcbiAgICBQcm9kdWN0TGlzdEl0ZW1Db250ZXh0U291cmNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IFByb2R1Y3RMaXN0SXRlbUNvbnRleHQsXG4gICAgICB1c2VFeGlzdGluZzogUHJvZHVjdExpc3RJdGVtQ29udGV4dFNvdXJjZSxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBXaXNoTGlzdEl0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKVxuICBpc0xvYWRpbmcgPSBmYWxzZTtcbiAgQElucHV0KCkgY2FydEVudHJ5OiBPcmRlckVudHJ5O1xuXG4gIEBPdXRwdXQoKVxuICByZW1vdmUgPSBuZXcgRXZlbnRFbWl0dGVyPE9yZGVyRW50cnk+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHByb2R1Y3RMaXN0SXRlbUNvbnRleHRTb3VyY2U6IFByb2R1Y3RMaXN0SXRlbUNvbnRleHRTb3VyY2VcbiAgKSB7fVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM/OiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXM/LmNhcnRFbnRyeSkge1xuICAgICAgdGhpcy5wcm9kdWN0TGlzdEl0ZW1Db250ZXh0U291cmNlLnByb2R1Y3QkLm5leHQodGhpcy5jYXJ0RW50cnkucHJvZHVjdCk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRW50cnkoaXRlbTogT3JkZXJFbnRyeSkge1xuICAgIHRoaXMucmVtb3ZlLmVtaXQoaXRlbSk7XG4gIH1cbn1cbiIsIjx0ZCByb2xlPVwiY2VsbFwiPlxuICA8ZGl2IGNsYXNzPVwiY3gtdGFibGUtaXRlbS1jb250YWluZXJcIj5cbiAgICA8IS0tIEl0ZW0gSW1hZ2UgLS0+XG4gICAgPGFcbiAgICAgIFtyb3V0ZXJMaW5rXT1cInsgY3hSb3V0ZTogJ3Byb2R1Y3QnLCBwYXJhbXM6IGNhcnRFbnRyeS5wcm9kdWN0IH0gfCBjeFVybFwiXG4gICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICA+XG4gICAgICA8Y3gtbWVkaWFcbiAgICAgICAgW2NvbnRhaW5lcl09XCJjYXJ0RW50cnkucHJvZHVjdD8uaW1hZ2VzPy5QUklNQVJZXCJcbiAgICAgICAgZm9ybWF0PVwidGh1bWJuYWlsXCJcbiAgICAgID48L2N4LW1lZGlhPlxuICAgIDwvYT5cbiAgICA8ZGl2IGNsYXNzPVwiY3gtaW5mb1wiPlxuICAgICAgPGRpdiAqbmdJZj1cImNhcnRFbnRyeS5wcm9kdWN0Py5uYW1lXCIgY2xhc3M9XCJjeC1uYW1lXCI+XG4gICAgICAgIDxhXG4gICAgICAgICAgY2xhc3M9XCJjeC1saW5rXCJcbiAgICAgICAgICBbcm91dGVyTGlua109XCJcbiAgICAgICAgICAgIHsgY3hSb3V0ZTogJ3Byb2R1Y3QnLCBwYXJhbXM6IGNhcnRFbnRyeS5wcm9kdWN0IH0gfCBjeFVybFxuICAgICAgICAgIFwiXG4gICAgICAgICAgPnt7IGNhcnRFbnRyeS5wcm9kdWN0Py5uYW1lIH19PC9hXG4gICAgICAgID5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiAqbmdJZj1cImNhcnRFbnRyeS5wcm9kdWN0Py5jb2RlXCIgY2xhc3M9XCJjeC1jb2RlXCI+XG4gICAgICAgIHt7ICdjYXJ0SXRlbXMuaWQnIHwgY3hUcmFuc2xhdGUgfX0ge3sgY2FydEVudHJ5LnByb2R1Y3Q/LmNvZGUgfX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPCEtLSBWYXJpYW50cyAtLT5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNhcnRFbnRyeS5wcm9kdWN0Py5iYXNlT3B0aW9ucz8ubGVuZ3RoXCI+XG4gICAgPGRpdlxuICAgICAgKm5nRm9yPVwiXG4gICAgICAgIGxldCB2YXJpYW50IG9mIGNhcnRFbnRyeS5wcm9kdWN0Py5iYXNlT3B0aW9uc1swXT8uc2VsZWN0ZWRcbiAgICAgICAgICA/LnZhcmlhbnRPcHRpb25RdWFsaWZpZXJzXG4gICAgICBcIlxuICAgICAgY2xhc3M9XCJjeC1wcm9wZXJ0eVwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cImN4LWxhYmVsXCIgKm5nSWY9XCJ2YXJpYW50Lm5hbWUgJiYgdmFyaWFudC52YWx1ZVwiPlxuICAgICAgICB7eyB2YXJpYW50Lm5hbWUgfX06IHt7IHZhcmlhbnQudmFsdWUgfX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L25nLWNvbnRhaW5lcj5cbjwvdGQ+XG48IS0tIEl0ZW0gUHJpY2UgLS0+XG48dGQgcm9sZT1cImNlbGxcIiAqbmdJZj1cImNhcnRFbnRyeS5iYXNlUHJpY2VcIiBjbGFzcz1cImN4LXByaWNlXCI+XG4gIDxkaXYgY2xhc3M9XCJjeC1tb2JpbGUtaGVhZGVyXCI+XG4gICAge3sgJ2NhcnRJdGVtcy5pdGVtUHJpY2UnIHwgY3hUcmFuc2xhdGUgfX1cbiAgPC9kaXY+XG4gIDxkaXYgKm5nSWY9XCJjYXJ0RW50cnkuYmFzZVByaWNlXCIgY2xhc3M9XCJjeC12YWx1ZVwiPlxuICAgIHt7IGNhcnRFbnRyeS5iYXNlUHJpY2U/LmZvcm1hdHRlZFZhbHVlIH19XG4gIDwvZGl2PlxuPC90ZD5cbjwhLS0gQWN0aW9uIC0tPlxuPHRkIHJvbGU9XCJjZWxsXCIgY2xhc3M9XCJjeC1hY3Rpb25zXCI+XG4gIDxuZy1jb250YWluZXJcbiAgICAqbmdJZj1cImNhcnRFbnRyeS51cGRhdGVhYmxlXCJcbiAgICBjeElubmVyQ29tcG9uZW50c0hvc3RcbiAgPjwvbmctY29udGFpbmVyPlxuICA8bmctdGVtcGxhdGUgI291dE9mU3RvY2s+XG4gICAgPHNwYW4gY2xhc3M9XCJjeC1vdXQtb2Ytc3RvY2tcIj5cbiAgICAgIHt7ICdhZGRUb0NhcnQub3V0T2ZTdG9jaycgfCBjeFRyYW5zbGF0ZSB9fVxuICAgIDwvc3Bhbj5cbiAgPC9uZy10ZW1wbGF0ZT5cbiAgPGJ1dHRvblxuICAgICpuZ0lmPVwiY2FydEVudHJ5LnVwZGF0ZWFibGVcIlxuICAgIChjbGljayk9XCJyZW1vdmVFbnRyeShjYXJ0RW50cnkpXCJcbiAgICBbY3hBdE1lc3NhZ2VdPVwiJ3dpc2hsaXN0Lml0ZW1SZW1vdmVkJyB8IGN4VHJhbnNsYXRlXCJcbiAgICBbZGlzYWJsZWRdPVwiaXNMb2FkaW5nXCJcbiAgICBjbGFzcz1cImxpbmsgY3gtYWN0aW9uLWxpbmsgY3gtcmVtb3ZlLWJ0blwiXG4gID5cbiAgICB7eyAnY29tbW9uLnJlbW92ZScgfCBjeFRyYW5zbGF0ZSB9fVxuICA8L2J1dHRvbj5cbjwvdGQ+XG4iXX0=