/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonConfigurator } from '../../core/model/common-configurator.model';
import { ConfiguratorProductScope } from '../../core/model/configurator-product-scope';
import * as i0 from "@angular/core";
import * as i1 from "@spartacus/storefront";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
import * as i4 from "@spartacus/core";
export class ConfigureProductComponent {
    constructor(productListItemContext, // when on PLP
    currentProductService // when on PDP
    ) {
        this.productListItemContext = productListItemContext;
        this.currentProductService = currentProductService;
        this.nonConfigurable = { configurable: false };
        this.product$ = (this.productListItemContext
            ? this.productListItemContext.product$
            : this.currentProductService
                ? this.currentProductService.getProduct(ConfiguratorProductScope.CONFIGURATOR)
                : of(null)).pipe(
        //needed because also currentProductService might return null
        map((product) => (product ? product : this.nonConfigurable)));
        this.ownerTypeProduct = CommonConfigurator.OwnerType.PRODUCT;
    }
}
ConfigureProductComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigureProductComponent, deps: [{ token: i1.ProductListItemContext, optional: true }, { token: i1.CurrentProductService, optional: true }], target: i0.ɵɵFactoryTarget.Component });
ConfigureProductComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.3", type: ConfigureProductComponent, selector: "cx-configure-product", ngImport: i0, template: "<ng-container *ngIf=\"product$ | async as product\">\n  <ng-container *ngIf=\"product.configurable\">\n    <a\n      [routerLink]=\"\n        {\n          cxRoute: 'configure' + product.configuratorType,\n          params: {\n            ownerType: ownerTypeProduct,\n            entityKey: product.code\n          }\n        } | cxUrl\n      \"\n      class=\"btn btn-primary btn-block\"\n      cxAutoFocus\n      [attr.aria-label]=\"'configurator.a11y.configureProduct' | cxTranslate\"\n      >{{ 'configurator.header.toconfig' | cxTranslate }}</a\n    >\n  </ng-container>\n</ng-container>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.RouterLinkWithHref, selector: "a[routerLink],area[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }, { kind: "pipe", type: i4.UrlPipe, name: "cxUrl" }, { kind: "pipe", type: i4.TranslatePipe, name: "cxTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigureProductComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cx-configure-product', changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-container *ngIf=\"product$ | async as product\">\n  <ng-container *ngIf=\"product.configurable\">\n    <a\n      [routerLink]=\"\n        {\n          cxRoute: 'configure' + product.configuratorType,\n          params: {\n            ownerType: ownerTypeProduct,\n            entityKey: product.code\n          }\n        } | cxUrl\n      \"\n      class=\"btn btn-primary btn-block\"\n      cxAutoFocus\n      [attr.aria-label]=\"'configurator.a11y.configureProduct' | cxTranslate\"\n      >{{ 'configurator.header.toconfig' | cxTranslate }}</a\n    >\n  </ng-container>\n</ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: i1.ProductListItemContext, decorators: [{
                    type: Optional
                }] }, { type: i1.CurrentProductService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJlLXByb2R1Y3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL3Byb2R1Y3QtY29uZmlndXJhdG9yL2NvbW1vbi9jb21wb25lbnRzL2NvbmZpZ3VyZS1wcm9kdWN0L2NvbmZpZ3VyZS1wcm9kdWN0LmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL2ZlYXR1cmUtbGlicy9wcm9kdWN0LWNvbmZpZ3VyYXRvci9jb21tb24vY29tcG9uZW50cy9jb25maWd1cmUtcHJvZHVjdC9jb25maWd1cmUtcHJvZHVjdC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFNN0UsT0FBTyxFQUFjLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDckMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDaEYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7Ozs7OztBQU92RixNQUFNLE9BQU8seUJBQXlCO0lBaUJwQyxZQUN3QixzQkFBOEMsRUFBRSxjQUFjO0lBQzlELHFCQUE0QyxDQUFDLGNBQWM7O1FBRDNELDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7UUFDOUMsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQWxCcEUsb0JBQWUsR0FBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNuRCxhQUFRLEdBQXdCLENBQUMsSUFBSSxDQUFDLHNCQUFzQjtZQUMxRCxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVE7WUFDdEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUI7Z0JBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUNuQyx3QkFBd0IsQ0FBQyxZQUFZLENBQ3RDO2dCQUNILENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQ1gsQ0FBQyxJQUFJO1FBQ0osNkRBQTZEO1FBQzdELEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQzdELENBQUM7UUFFRixxQkFBZ0IsR0FDZCxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBS3BDLENBQUM7O3NIQXBCTyx5QkFBeUI7MEdBQXpCLHlCQUF5Qiw0REN0QnRDLG9sQkFtQkE7MkZER2EseUJBQXlCO2tCQUxyQyxTQUFTOytCQUNFLHNCQUFzQixtQkFFZix1QkFBdUIsQ0FBQyxNQUFNOzswQkFvQjVDLFFBQVE7OzBCQUNSLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyMiBTQVAgU3BhcnRhY3VzIHRlYW0gPHNwYXJ0YWN1cy10ZWFtQHNhcC5jb20+XG4gKlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcbiAqL1xuXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJvZHVjdCB9IGZyb20gJ0BzcGFydGFjdXMvY29yZSc7XG5pbXBvcnQge1xuICBDdXJyZW50UHJvZHVjdFNlcnZpY2UsXG4gIFByb2R1Y3RMaXN0SXRlbUNvbnRleHQsXG59IGZyb20gJ0BzcGFydGFjdXMvc3RvcmVmcm9udCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ29tbW9uQ29uZmlndXJhdG9yIH0gZnJvbSAnLi4vLi4vY29yZS9tb2RlbC9jb21tb24tY29uZmlndXJhdG9yLm1vZGVsJztcbmltcG9ydCB7IENvbmZpZ3VyYXRvclByb2R1Y3RTY29wZSB9IGZyb20gJy4uLy4uL2NvcmUvbW9kZWwvY29uZmlndXJhdG9yLXByb2R1Y3Qtc2NvcGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjeC1jb25maWd1cmUtcHJvZHVjdCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb25maWd1cmUtcHJvZHVjdC5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBDb25maWd1cmVQcm9kdWN0Q29tcG9uZW50IHtcbiAgbm9uQ29uZmlndXJhYmxlOiBQcm9kdWN0ID0geyBjb25maWd1cmFibGU6IGZhbHNlIH07XG4gIHByb2R1Y3QkOiBPYnNlcnZhYmxlPFByb2R1Y3Q+ID0gKHRoaXMucHJvZHVjdExpc3RJdGVtQ29udGV4dFxuICAgID8gdGhpcy5wcm9kdWN0TGlzdEl0ZW1Db250ZXh0LnByb2R1Y3QkXG4gICAgOiB0aGlzLmN1cnJlbnRQcm9kdWN0U2VydmljZVxuICAgID8gdGhpcy5jdXJyZW50UHJvZHVjdFNlcnZpY2UuZ2V0UHJvZHVjdChcbiAgICAgICAgQ29uZmlndXJhdG9yUHJvZHVjdFNjb3BlLkNPTkZJR1VSQVRPUlxuICAgICAgKVxuICAgIDogb2YobnVsbClcbiAgKS5waXBlKFxuICAgIC8vbmVlZGVkIGJlY2F1c2UgYWxzbyBjdXJyZW50UHJvZHVjdFNlcnZpY2UgbWlnaHQgcmV0dXJuIG51bGxcbiAgICBtYXAoKHByb2R1Y3QpID0+IChwcm9kdWN0ID8gcHJvZHVjdCA6IHRoaXMubm9uQ29uZmlndXJhYmxlKSlcbiAgKTtcblxuICBvd25lclR5cGVQcm9kdWN0OiBDb21tb25Db25maWd1cmF0b3IuT3duZXJUeXBlID1cbiAgICBDb21tb25Db25maWd1cmF0b3IuT3duZXJUeXBlLlBST0RVQ1Q7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIHByb2R1Y3RMaXN0SXRlbUNvbnRleHQ6IFByb2R1Y3RMaXN0SXRlbUNvbnRleHQsIC8vIHdoZW4gb24gUExQXG4gICAgQE9wdGlvbmFsKCkgcHJvdGVjdGVkIGN1cnJlbnRQcm9kdWN0U2VydmljZTogQ3VycmVudFByb2R1Y3RTZXJ2aWNlIC8vIHdoZW4gb24gUERQXG4gICkge31cbn1cbiIsIjxuZy1jb250YWluZXIgKm5nSWY9XCJwcm9kdWN0JCB8IGFzeW5jIGFzIHByb2R1Y3RcIj5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInByb2R1Y3QuY29uZmlndXJhYmxlXCI+XG4gICAgPGFcbiAgICAgIFtyb3V0ZXJMaW5rXT1cIlxuICAgICAgICB7XG4gICAgICAgICAgY3hSb3V0ZTogJ2NvbmZpZ3VyZScgKyBwcm9kdWN0LmNvbmZpZ3VyYXRvclR5cGUsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBvd25lclR5cGU6IG93bmVyVHlwZVByb2R1Y3QsXG4gICAgICAgICAgICBlbnRpdHlLZXk6IHByb2R1Y3QuY29kZVxuICAgICAgICAgIH1cbiAgICAgICAgfSB8IGN4VXJsXG4gICAgICBcIlxuICAgICAgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLWJsb2NrXCJcbiAgICAgIGN4QXV0b0ZvY3VzXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIidjb25maWd1cmF0b3IuYTExeS5jb25maWd1cmVQcm9kdWN0JyB8IGN4VHJhbnNsYXRlXCJcbiAgICAgID57eyAnY29uZmlndXJhdG9yLmhlYWRlci50b2NvbmZpZycgfCBjeFRyYW5zbGF0ZSB9fTwvYVxuICAgID5cbiAgPC9uZy1jb250YWluZXI+XG48L25nLWNvbnRhaW5lcj5cbiJdfQ==