/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CART_MODIFICATION_NORMALIZER, } from '@spartacus/cart/base/root';
import { ConfiguratorModelUtils, } from '@spartacus/product-configurator/common';
import { map } from 'rxjs/operators';
import { VARIANT_CONFIGURATOR_ADD_TO_CART_SERIALIZER, VARIANT_CONFIGURATOR_NORMALIZER, VARIANT_CONFIGURATOR_OVERVIEW_NORMALIZER, VARIANT_CONFIGURATOR_PRICE_NORMALIZER, VARIANT_CONFIGURATOR_SERIALIZER, VARIANT_CONFIGURATOR_UPDATE_CART_ENTRY_SERIALIZER, } from './variant-configurator-occ.converters';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@spartacus/core";
export class VariantConfiguratorOccAdapter {
    constructor(http, occEndpointsService, converterService) {
        this.http = http;
        this.occEndpointsService = occEndpointsService;
        this.converterService = converterService;
    }
    getConfiguratorType() {
        return "CPQCONFIGURATOR" /* ConfiguratorType.VARIANT */;
    }
    createConfiguration(owner) {
        const productCode = owner.id;
        return this.http
            .get(this.occEndpointsService.buildUrl('createVariantConfiguration', {
            urlParams: { productCode },
        }))
            .pipe(this.converterService.pipeable(VARIANT_CONFIGURATOR_NORMALIZER), map((resultConfiguration) => {
            return {
                ...resultConfiguration,
                owner: owner,
            };
        }));
    }
    readConfiguration(configId, groupId, configurationOwner) {
        return this.http
            .get(this.occEndpointsService.buildUrl('readVariantConfiguration', {
            urlParams: { configId },
            queryParams: { groupId },
        }))
            .pipe(this.converterService.pipeable(VARIANT_CONFIGURATOR_NORMALIZER), map((resultConfiguration) => {
            return {
                ...resultConfiguration,
                owner: configurationOwner,
            };
        }));
    }
    updateConfiguration(configuration) {
        const configId = configuration.configId;
        const url = this.occEndpointsService.buildUrl('updateVariantConfiguration', {
            urlParams: { configId },
        });
        const occConfiguration = this.converterService.convert(configuration, VARIANT_CONFIGURATOR_SERIALIZER);
        return this.http
            .patch(url, occConfiguration)
            .pipe(this.converterService.pipeable(VARIANT_CONFIGURATOR_NORMALIZER), map((resultConfiguration) => {
            return {
                ...resultConfiguration,
                owner: configuration.owner,
            };
        }));
    }
    addToCart(parameters) {
        const url = this.occEndpointsService.buildUrl('addVariantConfigurationToCart', { urlParams: { userId: parameters.userId, cartId: parameters.cartId } });
        const occAddToCartParameters = this.converterService.convert(parameters, VARIANT_CONFIGURATOR_ADD_TO_CART_SERIALIZER);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http
            .post(url, occAddToCartParameters, { headers })
            .pipe(this.converterService.pipeable(CART_MODIFICATION_NORMALIZER));
    }
    readConfigurationForCartEntry(parameters) {
        const url = this.occEndpointsService.buildUrl('readVariantConfigurationForCartEntry', {
            urlParams: {
                userId: parameters.userId,
                cartId: parameters.cartId,
                cartEntryNumber: parameters.cartEntryNumber,
            },
        });
        return this.http.get(url).pipe(this.converterService.pipeable(VARIANT_CONFIGURATOR_NORMALIZER), map((resultConfiguration) => {
            return {
                ...resultConfiguration,
                owner: parameters.owner,
            };
        }));
    }
    updateConfigurationForCartEntry(parameters) {
        const url = this.occEndpointsService.buildUrl('updateVariantConfigurationForCartEntry', {
            urlParams: {
                userId: parameters.userId,
                cartId: parameters.cartId,
                cartEntryNumber: parameters.cartEntryNumber,
            },
        });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        const occUpdateCartEntryParameters = this.converterService.convert(parameters, VARIANT_CONFIGURATOR_UPDATE_CART_ENTRY_SERIALIZER);
        return this.http
            .put(url, occUpdateCartEntryParameters, { headers })
            .pipe(this.converterService.pipeable(CART_MODIFICATION_NORMALIZER));
    }
    readConfigurationForOrderEntry(parameters) {
        const url = this.occEndpointsService.buildUrl('readVariantConfigurationOverviewForOrderEntry', {
            urlParams: {
                userId: parameters.userId,
                orderId: parameters.orderId,
                orderEntryNumber: parameters.orderEntryNumber,
            },
        });
        return this.http.get(url).pipe(this.converterService.pipeable(VARIANT_CONFIGURATOR_OVERVIEW_NORMALIZER), map((overview) => {
            const configuration = {
                configId: overview.configId,
                productCode: overview.productCode,
                groups: [],
                flatGroups: [],
                interactionState: {},
                overview: overview,
                owner: ConfiguratorModelUtils.createInitialOwner(),
            };
            return configuration;
        }), map((resultConfiguration) => {
            return {
                ...resultConfiguration,
                owner: parameters.owner,
            };
        }));
    }
    readPriceSummary(configuration) {
        const url = this.occEndpointsService.buildUrl('readVariantConfigurationPriceSummary', {
            urlParams: {
                configId: configuration.configId,
            },
            queryParams: { groupId: configuration.interactionState.currentGroup },
        });
        return this.http.get(url).pipe(this.converterService.pipeable(VARIANT_CONFIGURATOR_PRICE_NORMALIZER), map((configResult) => {
            const result = {
                ...configuration,
                priceSummary: configResult.priceSummary,
                priceSupplements: configResult.priceSupplements,
            };
            return result;
        }));
    }
    getConfigurationOverview(configId) {
        const url = this.occEndpointsService.buildUrl('getVariantConfigurationOverview', { urlParams: { configId } });
        return this.http
            .get(url)
            .pipe(this.converterService.pipeable(VARIANT_CONFIGURATOR_OVERVIEW_NORMALIZER));
    }
}
VariantConfiguratorOccAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: VariantConfiguratorOccAdapter, deps: [{ token: i1.HttpClient }, { token: i2.OccEndpointsService }, { token: i2.ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
VariantConfiguratorOccAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: VariantConfiguratorOccAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: VariantConfiguratorOccAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.HttpClient }, { type: i2.OccEndpointsService }, { type: i2.ConverterService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFudC1jb25maWd1cmF0b3Itb2NjLmFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9mZWF0dXJlLWxpYnMvcHJvZHVjdC1jb25maWd1cmF0b3IvcnVsZWJhc2VkL29jYy92YXJpYW50L3ZhcmlhbnQtY29uZmlndXJhdG9yLW9jYy5hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEVBQWMsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBRUwsNEJBQTRCLEdBQzdCLE1BQU0sMkJBQTJCLENBQUM7QUFFbkMsT0FBTyxFQUVMLHNCQUFzQixHQUV2QixNQUFNLHdDQUF3QyxDQUFDO0FBRWhELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUdyQyxPQUFPLEVBQ0wsMkNBQTJDLEVBQzNDLCtCQUErQixFQUMvQix3Q0FBd0MsRUFDeEMscUNBQXFDLEVBQ3JDLCtCQUErQixFQUMvQixpREFBaUQsR0FDbEQsTUFBTSx1Q0FBdUMsQ0FBQzs7OztBQUkvQyxNQUFNLE9BQU8sNkJBQTZCO0lBR3hDLFlBQ1ksSUFBZ0IsRUFDaEIsbUJBQXdDLEVBQ3hDLGdCQUFrQztRQUZsQyxTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtJQUMzQyxDQUFDO0lBRUosbUJBQW1CO1FBQ2pCLHdEQUFnQztJQUNsQyxDQUFDO0lBRUQsbUJBQW1CLENBQ2pCLEtBQStCO1FBRS9CLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUMsSUFBSTthQUNiLEdBQUcsQ0FDRixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFB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RTtnQkFDVCxRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVE7YUFDakM7WUFDRCxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsYUFBYSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRTtTQUN0RSxDQUNGLENBQUM7UUFFRixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FDNUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxxQ0FBcUMsQ0FBQyxFQUNyRSxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUNuQixNQUFNLE1BQU0sR0FBK0I7Z0JBQ3pDLEdBQUcsYUFBYTtnQkFDaEIsWUFBWSxFQUFFLFlBQVksQ0FBQyxZQUFZO2dCQUN2QyxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsZ0JBQWdCO2FBQ2hELENBQUM7WUFDRixPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELHdCQUF3QixDQUN0QixRQUFnQjtRQUVoQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUMzQyxpQ0FBaUMsRUFDakMsRUFBRSxTQUFTLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUM1QixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsSUFBSTthQUNiLEdBQUcsQ0FBMkIsR0FBRyxDQUFDO2FBQ2xDLElBQUksQ0FDSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLHdDQUF3QyxDQUFDLENBQ3pFLENBQUM7SUFDTixDQUFDOzswSEE1T1UsNkJBQTZCOzhIQUE3Qiw2QkFBNkI7MkZBQTdCLDZCQUE2QjtrQkFEekMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDIyIFNBUCBTcGFydGFjdXMgdGVhbSA8c3BhcnRhY3VzLXRlYW1Ac2FwLmNvbT5cbiAqXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FydE1vZGlmaWNhdGlvbixcbiAgQ0FSVF9NT0RJRklDQVRJT05fTk9STUFMSVpFUixcbn0gZnJvbSAnQHNwYXJ0YWN1cy9jYXJ0L2Jhc2Uvcm9vdCc7XG5pbXBvcnQgeyBDb252ZXJ0ZXJTZXJ2aWNlLCBPY2NFbmRwb2ludHNTZXJ2aWNlIH0gZnJvbSAnQHNwYXJ0YWN1cy9jb3JlJztcbmltcG9ydCB7XG4gIENvbW1vbkNvbmZpZ3VyYXRvcixcbiAgQ29uZmlndXJhdG9yTW9kZWxVdGlscyxcbiAgQ29uZmlndXJhdG9yVHlwZSxcbn0gZnJvbSAnQHNwYXJ0YWN1cy9wcm9kdWN0LWNvbmZpZ3VyYXRvci9jb21tb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgUnVsZWJhc2VkQ29uZmlndXJhdG9yQWRhcHRlciB9IGZyb20gJy4uLy4uL2NvcmUvY29ubmVjdG9ycy9ydWxlYmFzZWQtY29uZmlndXJhdG9yLmFkYXB0ZXInO1xuaW1wb3J0IHsgQ29uZmlndXJhdG9yIH0gZnJvbSAnLi4vLi4vY29yZS9tb2RlbC9jb25maWd1cmF0b3IubW9kZWwnO1xuaW1wb3J0IHtcbiAgVkFSSUFOVF9DT05GSUdVUkFUT1JfQUREX1RPX0NBUlRfU0VSSUFMSVpFUixcbiAgVkFSSUFOVF9DT05GSUdVUkFUT1JfTk9STUFMSVpFUixcbiAgVkFSSUFOVF9DT05GSUdVUkFUT1JfT1ZFUlZJRVdfTk9STUFMSVpFUixcbiAgVkFSSUFOVF9DT05GSUdVUkFUT1JfUFJJQ0VfTk9STUFMSVpFUixcbiAgVkFSSUFOVF9DT05GSUdVUkFUT1JfU0VSSUFMSVpFUixcbiAgVkFSSUFOVF9DT05GSUdVUkFUT1JfVVBEQVRFX0NBUlRfRU5UUllfU0VSSUFMSVpFUixcbn0gZnJvbSAnLi92YXJpYW50LWNvbmZpZ3VyYXRvci1vY2MuY29udmVydGVycyc7XG5pbXBvcnQgeyBPY2NDb25maWd1cmF0b3IgfSBmcm9tICcuL3ZhcmlhbnQtY29uZmlndXJhdG9yLW9jYy5tb2RlbHMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVmFyaWFudENvbmZpZ3VyYXRvck9jY0FkYXB0ZXJcbiAgaW1wbGVtZW50cyBSdWxlYmFzZWRDb25maWd1cmF0b3JBZGFwdGVyXG57XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByb3RlY3RlZCBvY2NFbmRwb2ludHNTZXJ2aWNlOiBPY2NFbmRwb2ludHNTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBjb252ZXJ0ZXJTZXJ2aWNlOiBDb252ZXJ0ZXJTZXJ2aWNlXG4gICkge31cblxuICBnZXRDb25maWd1cmF0b3JUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIENvbmZpZ3VyYXRvclR5cGUuVkFSSUFOVDtcbiAgfVxuXG4gIGNyZWF0ZUNvbmZpZ3VyYXRpb24oXG4gICAgb3duZXI6IENvbW1vbkNvbmZpZ3VyYXRvci5Pd25lclxuICApOiBPYnNlcnZhYmxlPENvbmZpZ3VyYXRvci5Db25maWd1cmF0aW9uPiB7XG4gICAgY29uc3QgcHJvZHVjdENvZGUgPSBvd25lci5pZDtcbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAuZ2V0PE9jY0NvbmZpZ3VyYXRvci5Db25maWd1cmF0aW9uPihcbiAgICAgICAgdGhpcy5vY2NFbmRwb2ludHNTZXJ2aWNlLmJ1aWxkVXJsKCdjcmVhdGVWYXJpYW50Q29uZmlndXJhdGlvbicsIHtcbiAgICAgICAgICB1cmxQYXJhbXM6IHsgcHJvZHVjdENvZGUgfSxcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5waXBlKFxuICAgICAgICB0aGlzLmNvbnZlcnRlclNlcnZpY2UucGlwZWFibGUoVkFSSUFOVF9DT05GSUdVUkFUT1JfTk9STUFMSVpFUiksXG4gICAgICAgIG1hcCgocmVzdWx0Q29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5yZXN1bHRDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgIH07XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgcmVhZENvbmZpZ3VyYXRpb24oXG4gICAgY29uZmlnSWQ6IHN0cmluZyxcbiAgICBncm91cElkOiBzdHJpbmcsXG4gICAgY29uZmlndXJhdGlvbk93bmVyOiBDb21tb25Db25maWd1cmF0b3IuT3duZXJcbiAgKTogT2JzZXJ2YWJsZTxDb25maWd1cmF0b3IuQ29uZmlndXJhdGlvbj4ge1xuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5nZXQ8T2NjQ29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb24+KFxuICAgICAgICB0aGlzLm9jY0VuZHBvaW50c1NlcnZpY2UuYnVpbGRVcmwoJ3JlYWRWYXJpYW50Q29uZmlndXJhdGlvbicsIHtcbiAgICAgICAgICB1cmxQYXJhbXM6IHsgY29uZmlnSWQgfSxcbiAgICAgICAgICBxdWVyeVBhcmFtczogeyBncm91cElkIH0sXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgdGhpcy5jb252ZXJ0ZXJTZXJ2aWNlLnBpcGVhYmxlKFZBUklBTlRfQ09ORklHVVJBVE9SX05PUk1BTElaRVIpLFxuICAgICAgICBtYXAoKHJlc3VsdENvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucmVzdWx0Q29uZmlndXJhdGlvbixcbiAgICAgICAgICAgIG93bmVyOiBjb25maWd1cmF0aW9uT3duZXIsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICB1cGRhdGVDb25maWd1cmF0aW9uKFxuICAgIGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRvci5Db25maWd1cmF0aW9uXG4gICk6IE9ic2VydmFibGU8Q29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb24+IHtcbiAgICBjb25zdCBjb25maWdJZCA9IGNvbmZpZ3VyYXRpb24uY29uZmlnSWQ7XG4gICAgY29uc3QgdXJsID0gdGhpcy5vY2NFbmRwb2ludHNTZXJ2aWNlLmJ1aWxkVXJsKFxuICAgICAgJ3VwZGF0ZVZhcmlhbnRDb25maWd1cmF0aW9uJyxcbiAgICAgIHtcbiAgICAgICAgdXJsUGFyYW1zOiB7IGNvbmZpZ0lkIH0sXG4gICAgICB9XG4gICAgKTtcbiAgICBjb25zdCBvY2NDb25maWd1cmF0aW9uID0gdGhpcy5jb252ZXJ0ZXJTZXJ2aWNlLmNvbnZlcnQoXG4gICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgVkFSSUFOVF9DT05GSUdVUkFUT1JfU0VSSUFMSVpFUlxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAucGF0Y2g8T2NjQ29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb24+KHVybCwgb2NjQ29uZmlndXJhdGlvbilcbiAgICAgIC5waXBlKFxuICAgICAgICB0aGlzLmNvbnZlcnRlclNlcnZpY2UucGlwZWFibGUoVkFSSUFOVF9DT05GSUdVUkFUT1JfTk9STUFMSVpFUiksXG4gICAgICAgIG1hcCgocmVzdWx0Q29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5yZXN1bHRDb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgb3duZXI6IGNvbmZpZ3VyYXRpb24ub3duZXIsXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICBhZGRUb0NhcnQoXG4gICAgcGFyYW1ldGVyczogQ29uZmlndXJhdG9yLkFkZFRvQ2FydFBhcmFtZXRlcnNcbiAgKTogT2JzZXJ2YWJsZTxDYXJ0TW9kaWZpY2F0aW9uPiB7XG4gICAgY29uc3QgdXJsID0gdGhpcy5vY2NFbmRwb2ludHNTZXJ2aWNlLmJ1aWxkVXJsKFxuICAgICAgJ2FkZFZhcmlhbnRDb25maWd1cmF0aW9uVG9DYXJ0JyxcbiAgICAgIHsgdXJsUGFyYW1zOiB7IHVzZXJJZDogcGFyYW1ldGVycy51c2VySWQsIGNhcnRJZDogcGFyYW1ldGVycy5jYXJ0SWQgfSB9XG4gICAgKTtcblxuICAgIGNvbnN0IG9jY0FkZFRvQ2FydFBhcmFtZXRlcnMgPSB0aGlzLmNvbnZlcnRlclNlcnZpY2UuY29udmVydChcbiAgICAgIHBhcmFtZXRlcnMsXG4gICAgICBWQVJJQU5UX0NPTkZJR1VSQVRPUl9BRERfVE9fQ0FSVF9TRVJJQUxJWkVSXG4gICAgKTtcblxuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5wb3N0PENhcnRNb2RpZmljYXRpb24+KHVybCwgb2NjQWRkVG9DYXJ0UGFyYW1ldGVycywgeyBoZWFkZXJzIH0pXG4gICAgICAucGlwZSh0aGlzLmNvbnZlcnRlclNlcnZpY2UucGlwZWFibGUoQ0FSVF9NT0RJRklDQVRJT05fTk9STUFMSVpFUikpO1xuICB9XG5cbiAgcmVhZENvbmZpZ3VyYXRpb25Gb3JDYXJ0RW50cnkoXG4gICAgcGFyYW1ldGVyczogQ29tbW9uQ29uZmlndXJhdG9yLlJlYWRDb25maWd1cmF0aW9uRnJvbUNhcnRFbnRyeVBhcmFtZXRlcnNcbiAgKTogT2JzZXJ2YWJsZTxDb25maWd1cmF0b3IuQ29uZmlndXJhdGlvbj4ge1xuICAgIGNvbnN0IHVybCA9IHRoaXMub2NjRW5kcG9pbnRzU2VydmljZS5idWlsZFVybChcbiAgICAgICdyZWFkVmFyaWFudENvbmZpZ3VyYXRpb25Gb3JDYXJ0RW50cnknLFxuICAgICAge1xuICAgICAgICB1cmxQYXJhbXM6IHtcbiAgICAgICAgICB1c2VySWQ6IHBhcmFtZXRlcnMudXNlcklkLFxuICAgICAgICAgIGNhcnRJZDogcGFyYW1ldGVycy5jYXJ0SWQsXG4gICAgICAgICAgY2FydEVudHJ5TnVtYmVyOiBwYXJhbWV0ZXJzLmNhcnRFbnRyeU51bWJlcixcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8T2NjQ29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb24+KHVybCkucGlwZShcbiAgICAgIHRoaXMuY29udmVydGVyU2VydmljZS5waXBlYWJsZShWQVJJQU5UX0NPTkZJR1VSQVRPUl9OT1JNQUxJWkVSKSxcbiAgICAgIG1hcCgocmVzdWx0Q29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnJlc3VsdENvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgb3duZXI6IHBhcmFtZXRlcnMub3duZXIsXG4gICAgICAgIH07XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICB1cGRhdGVDb25maWd1cmF0aW9uRm9yQ2FydEVudHJ5KFxuICAgIHBhcmFtZXRlcnM6IENvbmZpZ3VyYXRvci5VcGRhdGVDb25maWd1cmF0aW9uRm9yQ2FydEVudHJ5UGFyYW1ldGVyc1xuICApOiBPYnNlcnZhYmxlPENhcnRNb2RpZmljYXRpb24+IHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLm9jY0VuZHBvaW50c1NlcnZpY2UuYnVpbGRVcmwoXG4gICAgICAndXBkYXRlVmFyaWFudENvbmZpZ3VyYXRpb25Gb3JDYXJ0RW50cnknLFxuICAgICAge1xuICAgICAgICB1cmxQYXJhbXM6IHtcbiAgICAgICAgICB1c2VySWQ6IHBhcmFtZXRlcnMudXNlcklkLFxuICAgICAgICAgIGNhcnRJZDogcGFyYW1ldGVycy5jYXJ0SWQsXG4gICAgICAgICAgY2FydEVudHJ5TnVtYmVyOiBwYXJhbWV0ZXJzLmNhcnRFbnRyeU51bWJlcixcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb2NjVXBkYXRlQ2FydEVudHJ5UGFyYW1ldGVycyA9IHRoaXMuY29udmVydGVyU2VydmljZS5jb252ZXJ0KFxuICAgICAgcGFyYW1ldGVycyxcbiAgICAgIFZBUklBTlRfQ09ORklHVVJBVE9SX1VQREFURV9DQVJUX0VOVFJZX1NFUklBTElaRVJcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnB1dDxDYXJ0TW9kaWZpY2F0aW9uPih1cmwsIG9jY1VwZGF0ZUNhcnRFbnRyeVBhcmFtZXRlcnMsIHsgaGVhZGVycyB9KVxuICAgICAgLnBpcGUodGhpcy5jb252ZXJ0ZXJTZXJ2aWNlLnBpcGVhYmxlKENBUlRfTU9ESUZJQ0FUSU9OX05PUk1BTElaRVIpKTtcbiAgfVxuXG4gIHJlYWRDb25maWd1cmF0aW9uRm9yT3JkZXJFbnRyeShcbiAgICBwYXJhbWV0ZXJzOiBDb21tb25Db25maWd1cmF0b3IuUmVhZENvbmZpZ3VyYXRpb25Gcm9tT3JkZXJFbnRyeVBhcmFtZXRlcnNcbiAgKTogT2JzZXJ2YWJsZTxDb25maWd1cmF0b3IuQ29uZmlndXJhdGlvbj4ge1xuICAgIGNvbnN0IHVybCA9IHRoaXMub2NjRW5kcG9pbnRzU2VydmljZS5idWlsZFVybChcbiAgICAgICdyZWFkVmFyaWFudENvbmZpZ3VyYXRpb25PdmVydmlld0Zvck9yZGVyRW50cnknLFxuICAgICAge1xuICAgICAgICB1cmxQYXJhbXM6IHtcbiAgICAgICAgICB1c2VySWQ6IHBhcmFtZXRlcnMudXNlcklkLFxuICAgICAgICAgIG9yZGVySWQ6IHBhcmFtZXRlcnMub3JkZXJJZCxcbiAgICAgICAgICBvcmRlckVudHJ5TnVtYmVyOiBwYXJhbWV0ZXJzLm9yZGVyRW50cnlOdW1iZXIsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PE9jY0NvbmZpZ3VyYXRvci5PdmVydmlldz4odXJsKS5waXBlKFxuICAgICAgdGhpcy5jb252ZXJ0ZXJTZXJ2aWNlLnBpcGVhYmxlKFZBUklBTlRfQ09ORklHVVJBVE9SX09WRVJWSUVXX05PUk1BTElaRVIpLFxuICAgICAgbWFwKChvdmVydmlldykgPT4ge1xuICAgICAgICBjb25zdCBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0b3IuQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgICAgICBjb25maWdJZDogb3ZlcnZpZXcuY29uZmlnSWQsXG4gICAgICAgICAgcHJvZHVjdENvZGU6IG92ZXJ2aWV3LnByb2R1Y3RDb2RlLFxuICAgICAgICAgIGdyb3VwczogW10sXG4gICAgICAgICAgZmxhdEdyb3VwczogW10sXG4gICAgICAgICAgaW50ZXJhY3Rpb25TdGF0ZToge30sXG4gICAgICAgICAgb3ZlcnZpZXc6IG92ZXJ2aWV3LFxuICAgICAgICAgIG93bmVyOiBDb25maWd1cmF0b3JNb2RlbFV0aWxzLmNyZWF0ZUluaXRpYWxPd25lcigpLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbjtcbiAgICAgIH0pLFxuICAgICAgbWFwKChyZXN1bHRDb25maWd1cmF0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4ucmVzdWx0Q29uZmlndXJhdGlvbixcbiAgICAgICAgICBvd25lcjogcGFyYW1ldGVycy5vd25lcixcbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHJlYWRQcmljZVN1bW1hcnkoXG4gICAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb25cbiAgKTogT2JzZXJ2YWJsZTxDb25maWd1cmF0b3IuQ29uZmlndXJhdGlvbj4ge1xuICAgIGNvbnN0IHVybCA9IHRoaXMub2NjRW5kcG9pbnRzU2VydmljZS5idWlsZFVybChcbiAgICAgICdyZWFkVmFyaWFudENvbmZpZ3VyYXRpb25QcmljZVN1bW1hcnknLFxuICAgICAge1xuICAgICAgICB1cmxQYXJhbXM6IHtcbiAgICAgICAgICBjb25maWdJZDogY29uZmlndXJhdGlvbi5jb25maWdJZCxcbiAgICAgICAgfSxcbiAgICAgICAgcXVlcnlQYXJhbXM6IHsgZ3JvdXBJZDogY29uZmlndXJhdGlvbi5pbnRlcmFjdGlvblN0YXRlLmN1cnJlbnRHcm91cCB9LFxuICAgICAgfVxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLmdldCh1cmwpLnBpcGUoXG4gICAgICB0aGlzLmNvbnZlcnRlclNlcnZpY2UucGlwZWFibGUoVkFSSUFOVF9DT05GSUdVUkFUT1JfUFJJQ0VfTk9STUFMSVpFUiksXG4gICAgICBtYXAoKGNvbmZpZ1Jlc3VsdCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQ6IENvbmZpZ3VyYXRvci5Db25maWd1cmF0aW9uID0ge1xuICAgICAgICAgIC4uLmNvbmZpZ3VyYXRpb24sXG4gICAgICAgICAgcHJpY2VTdW1tYXJ5OiBjb25maWdSZXN1bHQucHJpY2VTdW1tYXJ5LFxuICAgICAgICAgIHByaWNlU3VwcGxlbWVudHM6IGNvbmZpZ1Jlc3VsdC5wcmljZVN1cHBsZW1lbnRzLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZ2V0Q29uZmlndXJhdGlvbk92ZXJ2aWV3KFxuICAgIGNvbmZpZ0lkOiBzdHJpbmdcbiAgKTogT2JzZXJ2YWJsZTxDb25maWd1cmF0b3IuT3ZlcnZpZXc+IHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLm9jY0VuZHBvaW50c1NlcnZpY2UuYnVpbGRVcmwoXG4gICAgICAnZ2V0VmFyaWFudENvbmZpZ3VyYXRpb25PdmVydmlldycsXG4gICAgICB7IHVybFBhcmFtczogeyBjb25maWdJZCB9IH1cbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLmdldDxPY2NDb25maWd1cmF0b3IuT3ZlcnZpZXc+KHVybClcbiAgICAgIC5waXBlKFxuICAgICAgICB0aGlzLmNvbnZlcnRlclNlcnZpY2UucGlwZWFibGUoVkFSSUFOVF9DT05GSUdVUkFUT1JfT1ZFUlZJRVdfTk9STUFMSVpFUilcbiAgICAgICk7XG4gIH1cbn1cbiJdfQ==