/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { CartActions } from '@spartacus/cart/base/core';
import { normalizeHttpError } from '@spartacus/core';
import { CommonConfigurator, ConfiguratorModelUtils, } from '@spartacus/product-configurator/common';
import { of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { ConfiguratorActions } from '../actions/index';
import { ConfiguratorSelectors } from '../selectors/index';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/effects";
import * as i2 from "../../connectors/rulebased-configurator.connector";
import * as i3 from "@spartacus/product-configurator/common";
import * as i4 from "../../facade/utils/configurator-utils.service";
import * as i5 from "@ngrx/store";
export const ERROR_MESSAGE_NO_ENTRY_NUMBER_FOUND = 'Entry number is required in addToCart response';
/**
 * Common configurator effects related to cart handling
 */
export class ConfiguratorCartEffects {
    constructor(actions$, configuratorCommonsConnector, commonConfigUtilsService, configuratorGroupUtilsService, store) {
        this.actions$ = actions$;
        this.configuratorCommonsConnector = configuratorCommonsConnector;
        this.commonConfigUtilsService = commonConfigUtilsService;
        this.configuratorGroupUtilsService = configuratorGroupUtilsService;
        this.store = store;
        this.addToCart$ = createEffect(() => this.actions$.pipe(ofType(ConfiguratorActions.ADD_TO_CART), map((action) => action.payload), switchMap((payload) => {
            return this.configuratorCommonsConnector.addToCart(payload).pipe(switchMap((entry) => {
                const entryNumber = entry.entry?.entryNumber;
                if (entryNumber === undefined) {
                    throw Error(ERROR_MESSAGE_NO_ENTRY_NUMBER_FOUND);
                }
                else {
                    return [
                        new ConfiguratorActions.AddNextOwner({
                            ownerKey: payload.owner.key,
                            cartEntryNo: entryNumber.toString(),
                        }),
                        new CartActions.CartAddEntrySuccess({
                            ...entry,
                            userId: payload.userId,
                            cartId: payload.cartId,
                            productCode: payload.productCode,
                            quantity: payload.quantity,
                            deliveryModeChanged: entry.deliveryModeChanged,
                            entry: entry.entry,
                            quantityAdded: entry.quantityAdded,
                            statusCode: entry.statusCode,
                            statusMessage: entry.statusMessage,
                        }),
                    ];
                }
            }), catchError((error) => of(new CartActions.CartAddEntryFail({
                userId: payload.userId,
                cartId: payload.cartId,
                productCode: payload.productCode,
                quantity: payload.quantity,
                error: error instanceof HttpErrorResponse
                    ? normalizeHttpError(error)
                    : error,
            }))));
        })));
        this.updateCartEntry$ = createEffect(() => this.actions$.pipe(ofType(ConfiguratorActions.UPDATE_CART_ENTRY), map((action) => action.payload), switchMap((payload) => {
            return this.configuratorCommonsConnector
                .updateConfigurationForCartEntry(payload)
                .pipe(switchMap((cartModification) => {
                return [
                    new CartActions.CartUpdateEntrySuccess({
                        userId: payload.userId,
                        cartId: payload.cartId,
                        entryNumber: payload.cartEntryNumber,
                        quantity: cartModification.quantity,
                    }),
                ];
            }), catchError((error) => of(new CartActions.CartUpdateEntryFail({
                userId: payload.userId,
                cartId: payload.cartId,
                entryNumber: payload.cartEntryNumber,
                error: normalizeHttpError(error),
            }))));
        })));
        this.readConfigurationForCartEntry$ = createEffect(() => this.actions$.pipe(ofType(ConfiguratorActions.READ_CART_ENTRY_CONFIGURATION), switchMap((action) => {
            const parameters = action.payload;
            return this.configuratorCommonsConnector
                .readConfigurationForCartEntry(parameters)
                .pipe(switchMap((result) => [
                new ConfiguratorActions.ReadCartEntryConfigurationSuccess(result),
                new ConfiguratorActions.UpdatePriceSummary(result),
            ]), catchError((error) => [
                new ConfiguratorActions.ReadCartEntryConfigurationFail({
                    ownerKey: action.payload.owner.key,
                    error: normalizeHttpError(error),
                }),
            ]));
        })));
        this.readConfigurationForOrderEntry$ = createEffect(() => this.actions$.pipe(ofType(ConfiguratorActions.READ_ORDER_ENTRY_CONFIGURATION), switchMap((action) => {
            const parameters = action.payload;
            return this.configuratorCommonsConnector
                .readConfigurationForOrderEntry(parameters)
                .pipe(switchMap((result) => [
                new ConfiguratorActions.ReadOrderEntryConfigurationSuccess(result),
            ]), catchError((error) => [
                new ConfiguratorActions.ReadOrderEntryConfigurationFail({
                    ownerKey: action.payload.owner.key,
                    error: normalizeHttpError(error),
                }),
            ]));
        })));
        this.removeCartBoundConfigurations$ = createEffect(() => this.actions$.pipe(ofType(ConfiguratorActions.REMOVE_CART_BOUND_CONFIGURATIONS), switchMap(() => {
            return this.store.pipe(select(ConfiguratorSelectors.getConfigurationsState), take(1), map((configuratorState) => {
                const entities = configuratorState.configurations.entities;
                const ownerKeysToRemove = [];
                const ownerKeysProductBound = [];
                for (const ownerKey in entities) {
                    if (ownerKey.includes(CommonConfigurator.OwnerType.CART_ENTRY)) {
                        ownerKeysToRemove.push(ownerKey);
                    }
                    else if (ownerKey.includes(CommonConfigurator.OwnerType.PRODUCT)) {
                        ownerKeysProductBound.push(ownerKey);
                    }
                }
                ownerKeysProductBound.forEach((ownerKey) => {
                    const configuration = entities[ownerKey];
                    if (configuration.value?.nextOwner !== undefined) {
                        ownerKeysToRemove.push(ownerKey);
                    }
                });
                return new ConfiguratorActions.RemoveConfiguration({
                    ownerKey: ownerKeysToRemove,
                });
            }));
        })));
        this.addOwner$ = createEffect(() => this.actions$.pipe(ofType(ConfiguratorActions.ADD_NEXT_OWNER), switchMap((action) => {
            return this.store.pipe(select(ConfiguratorSelectors.getConfigurationFactory(action.payload.ownerKey)), take(1), switchMap((configuration) => {
                const newOwner = ConfiguratorModelUtils.createOwner(CommonConfigurator.OwnerType.CART_ENTRY, action.payload.cartEntryNo);
                this.commonConfigUtilsService.setOwnerKey(newOwner);
                return [
                    new ConfiguratorActions.SetNextOwnerCartEntry({
                        configuration: configuration,
                        cartEntryNo: action.payload.cartEntryNo,
                    }),
                    new ConfiguratorActions.SetInteractionState({
                        entityKey: newOwner.key,
                        interactionState: configuration.interactionState,
                    }),
                ];
            }));
        })));
    }
}
ConfiguratorCartEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfiguratorCartEffects, deps: [{ token: i1.Actions }, { token: i2.RulebasedConfiguratorConnector }, { token: i3.CommonConfiguratorUtilsService }, { token: i4.ConfiguratorUtilsService }, { token: i5.Store }], target: i0.ɵɵFactoryTarget.Injectable });
ConfiguratorCartEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfiguratorCartEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfiguratorCartEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Actions }, { type: i2.RulebasedConfiguratorConnector }, { type: i3.CommonConfiguratorUtilsService }, { type: i4.ConfiguratorUtilsService }, { type: i5.Store }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdG9yLWNhcnQuZWZmZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL3Byb2R1Y3QtY29uZmlndXJhdG9yL3J1bGViYXNlZC9jb3JlL3N0YXRlL2VmZmVjdHMvY29uZmlndXJhdG9yLWNhcnQuZWZmZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBVyxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxNQUFNLEVBQVMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXhELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3JELE9BQU8sRUFDTCxrQkFBa0IsRUFFbEIsc0JBQXNCLEdBQ3ZCLE1BQU0sd0NBQXdDLENBQUM7QUFDaEQsT0FBTyxFQUFjLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJbEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFdkQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7Ozs7Ozs7QUFFM0QsTUFBTSxDQUFDLE1BQU0sbUNBQW1DLEdBQzlDLGdEQUFnRCxDQUFDO0FBRW5EOztHQUVHO0FBQ0gsTUFBTSxPQUFPLHVCQUF1QjtJQWtPbEMsWUFDWSxRQUFpQixFQUNqQiw0QkFBNEQsRUFDNUQsd0JBQXdELEVBQ3hELDZCQUF1RCxF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ICogU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyMiBTQVAgU3BhcnRhY3VzIHRlYW0gPHNwYXJ0YWN1cy10ZWFtQHNhcC5jb20+XG4gKlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcbiAqL1xuXG5pbXBvcnQgeyBIdHRwRXJyb3JSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGlvbnMsIGNyZWF0ZUVmZmVjdCwgb2ZUeXBlIH0gZnJvbSAnQG5ncngvZWZmZWN0cyc7XG5pbXBvcnQgeyBzZWxlY3QsIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQ2FydEFjdGlvbnMgfSBmcm9tICdAc3BhcnRhY3VzL2NhcnQvYmFzZS9jb3JlJztcbmltcG9ydCB7IENhcnRNb2RpZmljYXRpb24gfSBmcm9tICdAc3BhcnRhY3VzL2NhcnQvYmFzZS9yb290JztcbmltcG9ydCB7IG5vcm1hbGl6ZUh0dHBFcnJvciB9IGZyb20gJ0BzcGFydGFjdXMvY29yZSc7XG5pbXBvcnQge1xuICBDb21tb25Db25maWd1cmF0b3IsXG4gIENvbW1vbkNvbmZpZ3VyYXRvclV0aWxzU2VydmljZSxcbiAgQ29uZmlndXJhdG9yTW9kZWxVdGlscyxcbn0gZnJvbSAnQHNwYXJ0YWN1cy9wcm9kdWN0LWNvbmZpZ3VyYXRvci9jb21tb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCwgc3dpdGNoTWFwLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgUnVsZWJhc2VkQ29uZmlndXJhdG9yQ29ubmVjdG9yIH0gZnJvbSAnLi4vLi4vY29ubmVjdG9ycy9ydWxlYmFzZWQtY29uZmlndXJhdG9yLmNvbm5lY3Rvcic7XG5pbXBvcnQgeyBDb25maWd1cmF0b3JVdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9mYWNhZGUvdXRpbHMvY29uZmlndXJhdG9yLXV0aWxzLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29uZmlndXJhdG9yIH0gZnJvbSAnLi4vLi4vbW9kZWwvY29uZmlndXJhdG9yLm1vZGVsJztcbmltcG9ydCB7IENvbmZpZ3VyYXRvckFjdGlvbnMgfSBmcm9tICcuLi9hY3Rpb25zL2luZGV4JztcbmltcG9ydCB7IFN0YXRlV2l0aENvbmZpZ3VyYXRvciB9IGZyb20gJy4uL2NvbmZpZ3VyYXRvci1zdGF0ZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0b3JTZWxlY3RvcnMgfSBmcm9tICcuLi9zZWxlY3RvcnMvaW5kZXgnO1xuXG5leHBvcnQgY29uc3QgRVJST1JfTUVTU0FHRV9OT19FTlRSWV9OVU1CRVJfRk9VTkQgPVxuICAnRW50cnkgbnVtYmVyIGlzIHJlcXVpcmVkIGluIGFkZFRvQ2FydCByZXNwb25zZSc7XG5ASW5qZWN0YWJsZSgpXG4vKipcbiAqIENvbW1vbiBjb25maWd1cmF0b3IgZWZmZWN0cyByZWxhdGVkIHRvIGNhcnQgaGFuZGxpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRvckNhcnRFZmZlY3RzIHtcbiAgYWRkVG9DYXJ0JDogT2JzZXJ2YWJsZTxcbiAgICB8IENvbmZpZ3VyYXRvckFjdGlvbnMuQWRkTmV4dE93bmVyXG4gICAgfCBDYXJ0QWN0aW9ucy5DYXJ0QWRkRW50cnlTdWNjZXNzXG4gICAgfCBDYXJ0QWN0aW9ucy5DYXJ0QWRkRW50cnlGYWlsXG4gID4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gICAgICBvZlR5cGUoQ29uZmlndXJhdG9yQWN0aW9ucy5BRERfVE9fQ0FSVCksXG4gICAgICBtYXAoKGFjdGlvbjogQ29uZmlndXJhdG9yQWN0aW9ucy5BZGRUb0NhcnQpID0+IGFjdGlvbi5wYXlsb2FkKSxcbiAgICAgIHN3aXRjaE1hcCgocGF5bG9hZDogQ29uZmlndXJhdG9yLkFkZFRvQ2FydFBhcmFtZXRlcnMpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdG9yQ29tbW9uc0Nvbm5lY3Rvci5hZGRUb0NhcnQocGF5bG9hZCkucGlwZShcbiAgICAgICAgICBzd2l0Y2hNYXAoKGVudHJ5OiBDYXJ0TW9kaWZpY2F0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnRyeU51bWJlciA9IGVudHJ5LmVudHJ5Py5lbnRyeU51bWJlcjtcbiAgICAgICAgICAgIGlmIChlbnRyeU51bWJlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHRocm93IEVycm9yKEVSUk9SX01FU1NBR0VfTk9fRU5UUllfTlVNQkVSX0ZPVU5EKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbmV3IENvbmZpZ3VyYXRvckFjdGlvbnMuQWRkTmV4dE93bmVyKHtcbiAgICAgICAgICAgICAgICAgIG93bmVyS2V5OiBwYXlsb2FkLm93bmVyLmtleSxcbiAgICAgICAgICAgICAgICAgIGNhcnRFbnRyeU5vOiBlbnRyeU51bWJlci50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAgICAgbmV3IENhcnRBY3Rpb25zLkNhcnRBZGRFbnRyeVN1Y2Nlc3Moe1xuICAgICAgICAgICAgICAgICAgLi4uZW50cnksXG4gICAgICAgICAgICAgICAgICB1c2VySWQ6IHBheWxvYWQudXNlcklkLFxuICAgICAgICAgICAgICAgICAgY2FydElkOiBwYXlsb2FkLmNhcnRJZCxcbiAgICAgICAgICAgICAgICAgIHByb2R1Y3RDb2RlOiBwYXlsb2FkLnByb2R1Y3RDb2RlLFxuICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IHBheWxvYWQucXVhbnRpdHksXG4gICAgICAgICAgICAgICAgICBkZWxpdmVyeU1vZGVDaGFuZ2VkOiBlbnRyeS5kZWxpdmVyeU1vZGVDaGFuZ2VkLFxuICAgICAgICAgICAgICAgICAgZW50cnk6IGVudHJ5LmVudHJ5LFxuICAgICAgICAgICAgICAgICAgcXVhbnRpdHlBZGRlZDogZW50cnkucXVhbnRpdHlBZGRlZCxcbiAgICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IGVudHJ5LnN0YXR1c0NvZGUsXG4gICAgICAgICAgICAgICAgICBzdGF0dXNNZXNzYWdlOiBlbnRyeS5zdGF0dXNNZXNzYWdlLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PlxuICAgICAgICAgICAgb2YoXG4gICAgICAgICAgICAgIG5ldyBDYXJ0QWN0aW9ucy5DYXJ0QWRkRW50cnlGYWlsKHtcbiAgICAgICAgICAgICAgICB1c2VySWQ6IHBheWxvYWQudXNlcklkLFxuICAgICAgICAgICAgICAgIGNhcnRJZDogcGF5bG9hZC5jYXJ0SWQsXG4gICAgICAgICAgICAgICAgcHJvZHVjdENvZGU6IHBheWxvYWQucHJvZHVjdENvZGUsXG4gICAgICAgICAgICAgICAgcXVhbnRpdHk6IHBheWxvYWQucXVhbnRpdHksXG4gICAgICAgICAgICAgICAgZXJyb3I6XG4gICAgICAgICAgICAgICAgICBlcnJvciBpbnN0YW5jZW9mIEh0dHBFcnJvclJlc3BvbnNlXG4gICAgICAgICAgICAgICAgICAgID8gbm9ybWFsaXplSHR0cEVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICA6IGVycm9yLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgKVxuICApO1xuXG4gIHVwZGF0ZUNhcnRFbnRyeSQ6IE9ic2VydmFibGU8XG4gICAgQ2FydEFjdGlvbnMuQ2FydFVwZGF0ZUVudHJ5U3VjY2VzcyB8IENhcnRBY3Rpb25zLkNhcnRVcGRhdGVFbnRyeUZhaWxcbiAgPiA9IGNyZWF0ZUVmZmVjdCgoKSA9PlxuICAgIHRoaXMuYWN0aW9ucyQucGlwZShcbiAgICAgIG9mVHlwZShDb25maWd1cmF0b3JBY3Rpb25zLlVQREFURV9DQVJUX0VOVFJZKSxcbiAgICAgIG1hcCgoYWN0aW9uOiBDb25maWd1cmF0b3JBY3Rpb25zLlVwZGF0ZUNhcnRFbnRyeSkgPT4gYWN0aW9uLnBheWxvYWQpLFxuICAgICAgc3dpdGNoTWFwKFxuICAgICAgICAocGF5bG9hZDogQ29uZmlndXJhdG9yLlVwZGF0ZUNvbmZpZ3VyYXRpb25Gb3JDYXJ0RW50cnlQYXJhbWV0ZXJzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdG9yQ29tbW9uc0Nvbm5lY3RvclxuICAgICAgICAgICAgLnVwZGF0ZUNvbmZpZ3VyYXRpb25Gb3JDYXJ0RW50cnkocGF5bG9hZClcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICBzd2l0Y2hNYXAoKGNhcnRNb2RpZmljYXRpb246IENhcnRNb2RpZmljYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgbmV3IENhcnRBY3Rpb25zLkNhcnRVcGRhdGVFbnRyeVN1Y2Nlc3Moe1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHBheWxvYWQudXNlcklkLFxuICAgICAgICAgICAgICAgICAgICBjYXJ0SWQ6IHBheWxvYWQuY2FydElkLFxuICAgICAgICAgICAgICAgICAgICBlbnRyeU51bWJlcjogcGF5bG9hZC5jYXJ0RW50cnlOdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiBjYXJ0TW9kaWZpY2F0aW9uLnF1YW50aXR5LFxuICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PlxuICAgICAgICAgICAgICAgIG9mKFxuICAgICAgICAgICAgICAgICAgbmV3IENhcnRBY3Rpb25zLkNhcnRVcGRhdGVFbnRyeUZhaWwoe1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHBheWxvYWQudXNlcklkLFxuICAgICAgICAgICAgICAgICAgICBjYXJ0SWQ6IHBheWxvYWQuY2FydElkLFxuICAgICAgICAgICAgICAgICAgICBlbnRyeU51bWJlcjogcGF5bG9hZC5jYXJ0RW50cnlOdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBub3JtYWxpemVIdHRwRXJyb3IoZXJyb3IpLFxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIClcbiAgICApXG4gICk7XG5cbiAgcmVhZENvbmZpZ3VyYXRpb25Gb3JDYXJ0RW50cnkkOiBPYnNlcnZhYmxlPFxuICAgIHwgQ29uZmlndXJhdG9yQWN0aW9ucy5SZWFkQ2FydEVudHJ5Q29uZmlndXJhdGlvblN1Y2Nlc3NcbiAgICB8IENvbmZpZ3VyYXRvckFjdGlvbnMuVXBkYXRlUHJpY2VTdW1tYXJ5XG4gICAgfCBDb25maWd1cmF0b3JBY3Rpb25zLlJlYWRDYXJ0RW50cnlDb25maWd1cmF0aW9uRmFpbFxuICA+ID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgdGhpcy5hY3Rpb25zJC5waXBlKFxuICAgICAgb2ZUeXBlKENvbmZpZ3VyYXRvckFjdGlvbnMuUkVBRF9DQVJUX0VOVFJZX0NPTkZJR1VSQVRJT04pLFxuICAgICAgc3dpdGNoTWFwKChhY3Rpb246IENvbmZpZ3VyYXRvckFjdGlvbnMuUmVhZENhcnRFbnRyeUNvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgICAgY29uc3QgcGFyYW1ldGVyczogQ29tbW9uQ29uZmlndXJhdG9yLlJlYWRDb25maWd1cmF0aW9uRnJvbUNhcnRFbnRyeVBhcmFtZXRlcnMgPVxuICAgICAgICAgIGFjdGlvbi5wYXlsb2FkO1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0b3JDb21tb25zQ29ubmVjdG9yXG4gICAgICAgICAgLnJlYWRDb25maWd1cmF0aW9uRm9yQ2FydEVudHJ5KHBhcmFtZXRlcnMpXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKHJlc3VsdDogQ29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb24pID0+IFtcbiAgICAgICAgICAgICAgbmV3IENvbmZpZ3VyYXRvckFjdGlvbnMuUmVhZENhcnRFbnRyeUNvbmZpZ3VyYXRpb25TdWNjZXNzKHJlc3VsdCksXG4gICAgICAgICAgICAgIG5ldyBDb25maWd1cmF0b3JBY3Rpb25zLlVwZGF0ZVByaWNlU3VtbWFyeShyZXN1bHQpLFxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgICBjYXRjaEVycm9yKChlcnJvcikgPT4gW1xuICAgICAgICAgICAgICBuZXcgQ29uZmlndXJhdG9yQWN0aW9ucy5SZWFkQ2FydEVudHJ5Q29uZmlndXJhdGlvbkZhaWwoe1xuICAgICAgICAgICAgICAgIG93bmVyS2V5OiBhY3Rpb24ucGF5bG9hZC5vd25lci5rZXksXG4gICAgICAgICAgICAgICAgZXJyb3I6IG5vcm1hbGl6ZUh0dHBFcnJvcihlcnJvciksXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSlcbiAgICAgICAgICApO1xuICAgICAgfSlcbiAgICApXG4gICk7XG5cbiAgcmVhZENvbmZpZ3VyYXRpb25Gb3JPcmRlckVudHJ5JDogT2JzZXJ2YWJsZTxcbiAgICB8IENvbmZpZ3VyYXRvckFjdGlvbnMuUmVhZE9yZGVyRW50cnlDb25maWd1cmF0aW9uU3VjY2Vzc1xuICAgIHwgQ29uZmlndXJhdG9yQWN0aW9ucy5SZWFkT3JkZXJFbnRyeUNvbmZpZ3VyYXRpb25GYWlsXG4gID4gPSBjcmVhdGVFZmZlY3QoKCkgPT5cbiAgICB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gICAgICBvZlR5cGUoQ29uZmlndXJhdG9yQWN0aW9ucy5SRUFEX09SREVSX0VOVFJZX0NPTkZJR1VSQVRJT04pLFxuICAgICAgc3dpdGNoTWFwKChhY3Rpb246IENvbmZpZ3VyYXRvckFjdGlvbnMuUmVhZE9yZGVyRW50cnlDb25maWd1cmF0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcnM6IENvbW1vbkNvbmZpZ3VyYXRvci5SZWFkQ29uZmlndXJhdGlvbkZyb21PcmRlckVudHJ5UGFyYW1ldGVycyA9XG4gICAgICAgICAgYWN0aW9uLnBheWxvYWQ7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRvckNvbW1vbnNDb25uZWN0b3JcbiAgICAgICAgICAucmVhZENvbmZpZ3VyYXRpb25Gb3JPcmRlckVudHJ5KHBhcmFtZXRlcnMpXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKHJlc3VsdDogQ29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb24pID0+IFtcbiAgICAgICAgICAgICAgbmV3IENvbmZpZ3VyYXRvckFjdGlvbnMuUmVhZE9yZGVyRW50cnlDb25maWd1cmF0aW9uU3VjY2VzcyhcbiAgICAgICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IFtcbiAgICAgICAgICAgICAgbmV3IENvbmZpZ3VyYXRvckFjdGlvbnMuUmVhZE9yZGVyRW50cnlDb25maWd1cmF0aW9uRmFpbCh7XG4gICAgICAgICAgICAgICAgb3duZXJLZXk6IGFjdGlvbi5wYXlsb2FkLm93bmVyLmtleSxcbiAgICAgICAgICAgICAgICBlcnJvcjogbm9ybWFsaXplSHR0cEVycm9yKGVycm9yKSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdKVxuICAgICAgICAgICk7XG4gICAgICB9KVxuICAgIClcbiAgKTtcblxuICByZW1vdmVDYXJ0Qm91bmRDb25maWd1cmF0aW9ucyQ6IE9ic2VydmFibGU8Q29uZmlndXJhdG9yQWN0aW9ucy5SZW1vdmVDb25maWd1cmF0aW9uPiA9XG4gICAgY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgICB0aGlzLmFjdGlvbnMkLnBpcGUoXG4gICAgICAgIG9mVHlwZShDb25maWd1cmF0b3JBY3Rpb25zLlJFTU9WRV9DQVJUX0JPVU5EX0NPTkZJR1VSQVRJT05TKSxcbiAgICAgICAgc3dpdGNoTWFwKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdG9yZS5waXBlKFxuICAgICAgICAgICAgc2VsZWN0KENvbmZpZ3VyYXRvclNlbGVjdG9ycy5nZXRDb25maWd1cmF0aW9uc1N0YXRlKSxcbiAgICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgICBtYXAoKGNvbmZpZ3VyYXRvclN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVudGl0aWVzID0gY29uZmlndXJhdG9yU3RhdGUuY29uZmlndXJhdGlvbnMuZW50aXRpZXM7XG5cbiAgICAgICAgICAgICAgY29uc3Qgb3duZXJLZXlzVG9SZW1vdmU6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICAgIGNvbnN0IG93bmVyS2V5c1Byb2R1Y3RCb3VuZDogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgICAgICAgZm9yIChjb25zdCBvd25lcktleSBpbiBlbnRpdGllcykge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIG93bmVyS2V5LmluY2x1ZGVzKENvbW1vbkNvbmZpZ3VyYXRvci5Pd25lclR5cGUuQ0FSVF9FTlRSWSlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIG93bmVyS2V5c1RvUmVtb3ZlLnB1c2gob3duZXJLZXkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICBvd25lcktleS5pbmNsdWRlcyhDb21tb25Db25maWd1cmF0b3IuT3duZXJUeXBlLlBST0RVQ1QpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICBvd25lcktleXNQcm9kdWN0Qm91bmQucHVzaChvd25lcktleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgb3duZXJLZXlzUHJvZHVjdEJvdW5kLmZvckVhY2goKG93bmVyS2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlndXJhdGlvbiA9IGVudGl0aWVzW293bmVyS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlndXJhdGlvbi52YWx1ZT8ubmV4dE93bmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIG93bmVyS2V5c1RvUmVtb3ZlLnB1c2gob3duZXJLZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgQ29uZmlndXJhdG9yQWN0aW9ucy5SZW1vdmVDb25maWd1cmF0aW9uKHtcbiAgICAgICAgICAgICAgICBvd25lcktleTogb3duZXJLZXlzVG9SZW1vdmUsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICk7XG5cbiAgYWRkT3duZXIkOiBPYnNlcnZhYmxlPFxuICAgIHwgQ29uZmlndXJhdG9yQWN0aW9ucy5TZXROZXh0T3duZXJDYXJ0RW50cnlcbiAgICB8IENvbmZpZ3VyYXRvckFjdGlvbnMuU2V0SW50ZXJhY3Rpb25TdGF0ZVxuICA+ID0gY3JlYXRlRWZmZWN0KCgpID0+XG4gICAgdGhpcy5hY3Rpb25zJC5waXBlKFxuICAgICAgb2ZUeXBlKENvbmZpZ3VyYXRvckFjdGlvbnMuQUREX05FWFRfT1dORVIpLFxuICAgICAgc3dpdGNoTWFwKChhY3Rpb246IENvbmZpZ3VyYXRvckFjdGlvbnMuQWRkTmV4dE93bmVyKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlLnBpcGUoXG4gICAgICAgICAgc2VsZWN0KFxuICAgICAgICAgICAgQ29uZmlndXJhdG9yU2VsZWN0b3JzLmdldENvbmZpZ3VyYXRpb25GYWN0b3J5KFxuICAgICAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5vd25lcktleVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksXG4gICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICBzd2l0Y2hNYXAoKGNvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5ld093bmVyID0gQ29uZmlndXJhdG9yTW9kZWxVdGlscy5jcmVhdGVPd25lcihcbiAgICAgICAgICAgICAgQ29tbW9uQ29uZmlndXJhdG9yLk93bmVyVHlwZS5DQVJUX0VOVFJZLFxuICAgICAgICAgICAgICBhY3Rpb24ucGF5bG9hZC5jYXJ0RW50cnlOb1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuY29tbW9uQ29uZmlnVXRpbHNTZXJ2aWNlLnNldE93bmVyS2V5KG5ld093bmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgbmV3IENvbmZpZ3VyYXRvckFjdGlvbnMuU2V0TmV4dE93bmVyQ2FydEVudHJ5KHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uOiBjb25maWd1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGNhcnRFbnRyeU5vOiBhY3Rpb24ucGF5bG9hZC5jYXJ0RW50cnlObyxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIG5ldyBDb25maWd1cmF0b3JBY3Rpb25zLlNldEludGVyYWN0aW9uU3RhdGUoe1xuICAgICAgICAgICAgICAgIGVudGl0eUtleTogbmV3T3duZXIua2V5LFxuICAgICAgICAgICAgICAgIGludGVyYWN0aW9uU3RhdGU6IGNvbmZpZ3VyYXRpb24uaW50ZXJhY3Rpb25TdGF0ZSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgIClcbiAgKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgYWN0aW9ucyQ6IEFjdGlvbnMsXG4gICAgcHJvdGVjdGVkIGNvbmZpZ3VyYXRvckNvbW1vbnNDb25uZWN0b3I6IFJ1bGViYXNlZENvbmZpZ3VyYXRvckNvbm5lY3RvcixcbiAgICBwcm90ZWN0ZWQgY29tbW9uQ29uZmlnVXRpbHNTZXJ2aWNlOiBDb21tb25Db25maWd1cmF0b3JVdGlsc1NlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGNvbmZpZ3VyYXRvckdyb3VwVXRpbHNTZXJ2aWNlOiBDb25maWd1cmF0b3JVdGlsc1NlcnZpY2UsXG4gICAgcHJvdGVjdGVkIHN0b3JlOiBTdG9yZTxTdGF0ZVdpdGhDb25maWd1cmF0b3I+XG4gICkge31cbn1cbiJdfQ==