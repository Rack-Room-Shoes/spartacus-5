import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, Optional, Input, NgModule } from '@angular/core';
import * as i5 from '@angular/forms';
import { UntypedFormGroup, UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import * as i2 from '@spartacus/cart/base/root';
import { CartUiEventAddToCart } from '@spartacus/cart/base/root';
import * as i3 from '@spartacus/core';
import { isNotNullable, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { map, filter, take } from 'rxjs/operators';
import * as i1 from '@spartacus/storefront';
import { ItemCounterModule } from '@spartacus/storefront';
import * as i4 from '@angular/common';
import { CommonModule } from '@angular/common';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AddToCartComponent {
    constructor(currentProductService, cd, activeCartService, component, eventService, productListItemContext) {
        var _a;
        this.currentProductService = currentProductService;
        this.cd = cd;
        this.activeCartService = activeCartService;
        this.component = component;
        this.eventService = eventService;
        this.productListItemContext = productListItemContext;
        this.showQuantity = true;
        this.hasStock = false;
        this.inventoryThreshold = false;
        this.showInventory$ = (_a = this.component) === null || _a === void 0 ? void 0 : _a.data$.pipe(map((data) => data.inventoryDisplay));
        this.quantity = 1;
        this.addToCartForm = new UntypedFormGroup({
            quantity: new UntypedFormControl(1, { updateOn: 'blur' }),
        });
    }
    ngOnInit() {
        var _a;
        if (this.product) {
            this.productCode = (_a = this.product.code) !== null && _a !== void 0 ? _a : '';
            this.setStockInfo(this.product);
            this.cd.markForCheck();
        }
        else if (this.productCode) {
            // force hasStock and quantity for the time being, as we do not have more info:
            this.quantity = 1;
            this.hasStock = true;
            this.cd.markForCheck();
        }
        else {
            this.subscription = (this.productListItemContext
                ? this.productListItemContext.product$
                : this.currentProductService.getProduct())
                .pipe(filter(isNotNullable))
                .subscribe((product) => {
                var _a;
                this.productCode = (_a = product.code) !== null && _a !== void 0 ? _a : '';
                this.setStockInfo(product);
                this.cd.markForCheck();
            });
        }
    }
    setStockInfo(product) {
        var _a, _b, _c, _d;
        this.quantity = 1;
        this.hasStock = Boolean(((_a = product.stock) === null || _a === void 0 ? void 0 : _a.stockLevelStatus) !== 'outOfStock');
        this.inventoryThreshold = (_c = (_b = product.stock) === null || _b === void 0 ? void 0 : _b.isValueRounded) !== null && _c !== void 0 ? _c : false;
        if (this.hasStock && ((_d = product.stock) === null || _d === void 0 ? void 0 : _d.stockLevel)) {
            this.maxQuantity = product.stock.stockLevel;
        }
        if (this.productListItemContext) {
            this.showQuantity = false;
        }
    }
    /**
     * In specific scenarios, we need to omit displaying the stock level or append a plus to the value.
     * When backoffice forces a product to be in stock, omit showing the stock level.
     * When product stock level is limited by a threshold value, append '+' at the end.
     * When out of stock, display no numerical value.
     */
    getInventory() {
        if (this.hasStock) {
            const quantityDisplay = this.maxQuantity
                ? this.maxQuantity.toString()
                : '';
            return this.inventoryThreshold ? quantityDisplay + '+' : quantityDisplay;
        }
        else {
            return '';
        }
    }
    updateCount(value) {
        this.quantity = value;
    }
    addToCart() {
        var _a;
        const quantity = (_a = this.addToCartForm.get('quantity')) === null || _a === void 0 ? void 0 : _a.value;
        if (!this.productCode || quantity <= 0) {
            return;
        }
        this.activeCartService
            .getEntries()
            .pipe(take(1))
            .subscribe((cartEntries) => {
            this.activeCartService.addEntry(this.productCode, quantity);
            // A CartUiEventAddToCart is dispatched.  This event is intended for the UI
            // responsible to provide feedback about what was added to the cart, like
            // the added to cart dialog.
            //
            // Because we call activeCartService.getEntries() before, we can be sure the
            // cart library is loaded already and that the event listener exists.
            this.eventService.dispatch(this.createCartUiEventAddToCart(this.productCode, quantity, cartEntries.length));
        });
    }
    createCartUiEventAddToCart(productCode, quantity, numberOfEntriesBeforeAdd) {
        const newEvent = new CartUiEventAddToCart();
        newEvent.productCode = productCode;
        newEvent.quantity = quantity;
        newEvent.numberOfEntriesBeforeAdd = numberOfEntriesBeforeAdd;
        return newEvent;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
AddToCartComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AddToCartComponent, deps: [{ token: i1.CurrentProductService }, { token: i0.ChangeDetectorRef }, { token: i2.ActiveCartFacade }, { token: i1.CmsComponentData }, { token: i3.EventService }, { token: i1.ProductListItemContext, optional: true }], target: i0.ɵɵFactoryTarget.Component });
AddToCartComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.3", type: AddToCartComponent, selector: "cx-add-to-cart", inputs: { productCode: "productCode", showQuantity: "showQuantity", options: "options", product: "product" }, ngImport: i0, template: "<form *ngIf=\"productCode\" [formGroup]=\"addToCartForm\" (submit)=\"addToCart()\">\n  <div class=\"quantity\" *ngIf=\"showQuantity\">\n    <label>{{ 'addToCart.quantity' | cxTranslate }}</label>\n    <div class=\"cx-counter-stock\">\n      <cx-item-counter\n        *ngIf=\"hasStock\"\n        [max]=\"maxQuantity\"\n        [control]=\"addToCartForm.get('quantity')\"\n      ></cx-item-counter>\n\n      <span class=\"info\">\n        <span *ngIf=\"showInventory$ | async\">{{ getInventory() }}</span>\n        {{\n          hasStock\n            ? ('addToCart.inStock' | cxTranslate)\n            : ('addToCart.outOfStock' | cxTranslate)\n        }}</span\n      >\n    </div>\n  </div>\n\n  <button\n    *ngIf=\"hasStock\"\n    [ngClass]=\"\n      options?.displayAddToCart\n        ? 'link cx-action-link'\n        : 'btn btn-primary btn-block'\n    \"\n    type=\"submit\"\n    [disabled]=\"quantity <= 0 || quantity > maxQuantity\"\n  >\n    {{ options?.addToCartString ?? ('addToCart.addToCart' | cxTranslate) }}\n  </button>\n</form>\n", dependencies: [{ kind: "directive", type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i5.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i5.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "component", type: i1.ItemCounterComponent, selector: "cx-item-counter", inputs: ["control", "min", "max", "step", "allowZero", "readonly"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i3.TranslatePipe, name: "cxTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AddToCartComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cx-add-to-cart', changeDetection: ChangeDetectionStrategy.OnPush, template: "<form *ngIf=\"productCode\" [formGroup]=\"addToCartForm\" (submit)=\"addToCart()\">\n  <div class=\"quantity\" *ngIf=\"showQuantity\">\n    <label>{{ 'addToCart.quantity' | cxTranslate }}</label>\n    <div class=\"cx-counter-stock\">\n      <cx-item-counter\n        *ngIf=\"hasStock\"\n        [max]=\"maxQuantity\"\n        [control]=\"addToCartForm.get('quantity')\"\n      ></cx-item-counter>\n\n      <span class=\"info\">\n        <span *ngIf=\"showInventory$ | async\">{{ getInventory() }}</span>\n        {{\n          hasStock\n            ? ('addToCart.inStock' | cxTranslate)\n            : ('addToCart.outOfStock' | cxTranslate)\n        }}</span\n      >\n    </div>\n  </div>\n\n  <button\n    *ngIf=\"hasStock\"\n    [ngClass]=\"\n      options?.displayAddToCart\n        ? 'link cx-action-link'\n        : 'btn btn-primary btn-block'\n    \"\n    type=\"submit\"\n    [disabled]=\"quantity <= 0 || quantity > maxQuantity\"\n  >\n    {{ options?.addToCartString ?? ('addToCart.addToCart' | cxTranslate) }}\n  </button>\n</form>\n" }]
        }], ctorParameters: function () {
        return [{ type: i1.CurrentProductService }, { type: i0.ChangeDetectorRef }, { type: i2.ActiveCartFacade }, { type: i1.CmsComponentData }, { type: i3.EventService }, { type: i1.ProductListItemContext, decorators: [{
                        type: Optional
                    }] }];
    }, propDecorators: { productCode: [{
                type: Input
            }], showQuantity: [{
                type: Input
            }], options: [{
                type: Input
            }], product: [{
                type: Input
            }] } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AddToCartModule {
}
AddToCartModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AddToCartModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AddToCartModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: AddToCartModule, declarations: [AddToCartComponent], imports: [CommonModule, ReactiveFormsModule, I18nModule, ItemCounterModule], exports: [AddToCartComponent] });
AddToCartModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AddToCartModule, providers: [
        provideDefaultConfig({
            cmsComponents: {
                ProductAddToCartComponent: {
                    component: AddToCartComponent,
                    data: {
                        inventoryDisplay: false,
                    },
                },
            },
        }),
    ], imports: [CommonModule, ReactiveFormsModule, I18nModule, ItemCounterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AddToCartModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ReactiveFormsModule, I18nModule, ItemCounterModule],
                    providers: [
                        provideDefaultConfig({
                            cmsComponents: {
                                ProductAddToCartComponent: {
                                    component: AddToCartComponent,
                                    data: {
                                        inventoryDisplay: false,
                                    },
                                },
                            },
                        }),
                    ],
                    declarations: [AddToCartComponent],
                    exports: [AddToCartComponent],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AddToCartComponent, AddToCartModule };
//# sourceMappingURL=spartacus-cart-base-components-add-to-cart.mjs.map
