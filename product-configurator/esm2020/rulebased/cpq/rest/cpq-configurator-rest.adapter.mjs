/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Injectable } from '@angular/core';
import { Configurator, } from '@spartacus/product-configurator/rulebased';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./cpq-configurator-rest.service";
import * as i2 from "./../occ/cpq-configurator-occ.service";
export class CpqConfiguratorRestAdapter {
    constructor(cpqRestService, cpqOccService) {
        this.cpqRestService = cpqRestService;
        this.cpqOccService = cpqOccService;
    }
    getConfiguratorType() {
        return "CLOUDCPQCONFIGURATOR" /* ConfiguratorType.CPQ */;
    }
    createConfiguration(owner) {
        // no error handling for missing owner id needed, as it's a
        // mandatory attribute in owner
        return this.cpqRestService.createConfiguration(owner.id).pipe(map((configResponse) => {
            configResponse.owner = owner;
            return configResponse;
        }));
    }
    readConfiguration(configId, groupId, owner) {
        return this.cpqRestService.readConfiguration(configId, groupId).pipe(map((configResponse) => {
            configResponse.owner = owner;
            return configResponse;
        }));
    }
    updateConfiguration(configuration) {
        const updateMethod = configuration.updateType === Configurator.UpdateType.VALUE_QUANTITY
            ? this.cpqRestService.updateValueQuantity
            : this.cpqRestService.updateAttribute;
        return updateMethod.call(this.cpqRestService, configuration).pipe(map((configResponse) => {
            configResponse.owner = configuration.owner;
            return configResponse;
        }));
    }
    addToCart(parameters) {
        return this.cpqOccService.addToCart(parameters);
    }
    readConfigurationForCartEntry(parameters) {
        return this.cpqOccService.getConfigIdForCartEntry(parameters).pipe(switchMap((configId) => {
            return this.cpqRestService.readConfiguration(configId).pipe(map((configResponse) => {
                configResponse.owner = parameters.owner;
                return configResponse;
            }));
        }));
    }
    updateConfigurationForCartEntry(parameters) {
        return this.cpqOccService.updateCartEntry(parameters);
    }
    readConfigurationForOrderEntry(parameters) {
        return this.cpqOccService.getConfigIdForOrderEntry(parameters).pipe(switchMap((configId) => {
            return this.cpqRestService.readConfiguration(configId).pipe(map((configResponse) => {
                configResponse.owner = parameters.owner;
                return configResponse;
            }));
        }));
    }
    readPriceSummary(configuration) {
        return of(configuration); // so that UI does not run into exception
    }
    getConfigurationOverview(configId) {
        return this.cpqRestService.readConfigurationOverview(configId);
    }
}
CpqConfiguratorRestAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CpqConfiguratorRestAdapter, deps: [{ token: i1.CpqConfiguratorRestService }, { token: i2.CpqConfiguratorOccService }], target: i0.ɵɵFactoryTarget.Injectable });
CpqConfiguratorRestAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CpqConfiguratorRestAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CpqConfiguratorRestAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CpqConfiguratorRestService }, { type: i2.CpqConfiguratorOccService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3BxLWNvbmZpZ3VyYXRvci1yZXN0LmFkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9mZWF0dXJlLWxpYnMvcHJvZHVjdC1jb25maWd1cmF0b3IvcnVsZWJhc2VkL2NwcS9yZXN0L2NwcS1jb25maWd1cmF0b3ItcmVzdC5hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTTNDLE9BQU8sRUFDTCxZQUFZLEdBRWIsTUFBTSwyQ0FBMkMsQ0FBQztBQUNuRCxPQUFPLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFLaEQsTUFBTSxPQUFPLDBCQUEwQjtJQUdyQyxZQUNZLGNBQTBDLEVBQzFDLGFBQXdDO1FBRHhDLG1CQUFjLEdBQWQsY0FBYyxDQUE0QjtRQUMxQyxrQkFBYSxHQUFiLGFBQWEsQ0FBMkI7SUFDakQsQ0FBQztJQUVKLG1CQUFtQjtRQUNqQix5REFBNEI7SUFDOUIsQ0FBQztJQUVELG1CQUFtQixDQUNqQixLQUErQjtRQUUvQiwyREFBMkQ7UUFDM0QsK0JBQStCO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUMzRCxHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUNyQixjQUFjLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUM3QixPQUFPLGNBQWMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELGlCQUFpQixDQUNmLFFBQWdCLEVBQ2hCLE9BQWUsRUFDZixLQUErQjtRQUUvQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDbEUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDckIsY0FBYyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDN0IsT0FBTyxjQUFjLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCxtQkFBbUIsQ0FDakIsYUFBeUM7UUFFekMsTUFBTSxZQUFZLEdBQ2hCLGFBQWEsQ0FBQyxVQUFVLEtBQUssWUFBWSxDQUFDLFVBQVUsQ0FBQyxjQUFjO1lBQ2pFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQjtZQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUM7UUFDMUMsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUMvRCxHQUFHLENBQUMsQ0FBQyxjQUEwQyxFQUFFLEVBQUU7WUFDakQsY0FBYyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQzNDLE9BQU8sY0FBYyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxDQUNQLFVBQTRDO1FBRTVDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELDZCQUE2QixDQUMzQixVQUF1RTtRQUV2RSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUNoRSxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNyQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUN6RCxHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDckIsY0FBYyxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUN4QyxPQUFPLGNBQWMsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FDSCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCwrQkFBK0IsQ0FDN0IsVUFBa0U7UUFFbEUsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsOEJBQThCLENBQzVCLFVBQXdFO1FBRXhFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQ2pFLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQ3pELEdBQUcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUNyQixjQUFjLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7Z0JBQ3hDLE9BQU8sY0FBYyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUNILENBQUM7UUFDSixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELGdCQUFnQixDQUNkLGFBQXlDO1FBRXpDLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMseUNBQXlDO0lBQ3JFLENBQUM7SUFFRCx3QkFBd0IsQ0FDdEIsUUFBZ0I7UUFFaEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7O3VIQXpHVSwwQkFBMEI7MkhBQTFCLDBCQUEwQjsyRkFBMUIsMEJBQTBCO2tCQUR0QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjIgU0FQIFNwYXJ0YWN1cyB0ZWFtIDxzcGFydGFjdXMtdGVhbUBzYXAuY29tPlxuICpcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FydE1vZGlmaWNhdGlvbiB9IGZyb20gJ0BzcGFydGFjdXMvY2FydC9iYXNlL3Jvb3QnO1xuaW1wb3J0IHtcbiAgQ29tbW9uQ29uZmlndXJhdG9yLFxuICBDb25maWd1cmF0b3JUeXBlLFxufSBmcm9tICdAc3BhcnRhY3VzL3Byb2R1Y3QtY29uZmlndXJhdG9yL2NvbW1vbic7XG5pbXBvcnQge1xuICBDb25maWd1cmF0b3IsXG4gIFJ1bGViYXNlZENvbmZpZ3VyYXRvckFkYXB0ZXIsXG59IGZyb20gJ0BzcGFydGFjdXMvcHJvZHVjdC1jb25maWd1cmF0b3IvcnVsZWJhc2VkJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IENwcUNvbmZpZ3VyYXRvck9jY1NlcnZpY2UgfSBmcm9tICcuLy4uL29jYy9jcHEtY29uZmlndXJhdG9yLW9jYy5zZXJ2aWNlJztcbmltcG9ydCB7IENwcUNvbmZpZ3VyYXRvclJlc3RTZXJ2aWNlIH0gZnJvbSAnLi9jcHEtY29uZmlndXJhdG9yLXJlc3Quc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDcHFDb25maWd1cmF0b3JSZXN0QWRhcHRlclxuICBpbXBsZW1lbnRzIFJ1bGViYXNlZENvbmZpZ3VyYXRvckFkYXB0ZXJcbntcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGNwcVJlc3RTZXJ2aWNlOiBDcHFDb25maWd1cmF0b3JSZXN0U2VydmljZSxcbiAgICBwcm90ZWN0ZWQgY3BxT2NjU2VydmljZTogQ3BxQ29uZmlndXJhdG9yT2NjU2VydmljZVxuICApIHt9XG5cbiAgZ2V0Q29uZmlndXJhdG9yVHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBDb25maWd1cmF0b3JUeXBlLkNQUTtcbiAgfVxuXG4gIGNyZWF0ZUNvbmZpZ3VyYXRpb24oXG4gICAgb3duZXI6IENvbW1vbkNvbmZpZ3VyYXRvci5Pd25lclxuICApOiBPYnNlcnZhYmxlPENvbmZpZ3VyYXRvci5Db25maWd1cmF0aW9uPiB7XG4gICAgLy8gbm8gZXJyb3IgaGFuZGxpbmcgZm9yIG1pc3Npbmcgb3duZXIgaWQgbmVlZGVkLCBhcyBpdCdzIGFcbiAgICAvLyBtYW5kYXRvcnkgYXR0cmlidXRlIGluIG93bmVyXG4gICAgcmV0dXJuIHRoaXMuY3BxUmVzdFNlcnZpY2UuY3JlYXRlQ29uZmlndXJhdGlvbihvd25lci5pZCkucGlwZShcbiAgICAgIG1hcCgoY29uZmlnUmVzcG9uc2UpID0+IHtcbiAgICAgICAgY29uZmlnUmVzcG9uc2Uub3duZXIgPSBvd25lcjtcbiAgICAgICAgcmV0dXJuIGNvbmZpZ1Jlc3BvbnNlO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcmVhZENvbmZpZ3VyYXRpb24oXG4gICAgY29uZmlnSWQ6IHN0cmluZyxcbiAgICBncm91cElkOiBzdHJpbmcsXG4gICAgb3duZXI6IENvbW1vbkNvbmZpZ3VyYXRvci5Pd25lclxuICApOiBPYnNlcnZhYmxlPENvbmZpZ3VyYXRvci5Db25maWd1cmF0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMuY3BxUmVzdFNlcnZpY2UucmVhZENvbmZpZ3VyYXRpb24oY29uZmlnSWQsIGdyb3VwSWQpLnBpcGUoXG4gICAgICBtYXAoKGNvbmZpZ1Jlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbmZpZ1Jlc3BvbnNlLm93bmVyID0gb3duZXI7XG4gICAgICAgIHJldHVybiBjb25maWdSZXNwb25zZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbmZpZ3VyYXRpb24oXG4gICAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb25cbiAgKTogT2JzZXJ2YWJsZTxDb25maWd1cmF0b3IuQ29uZmlndXJhdGlvbj4ge1xuICAgIGNvbnN0IHVwZGF0ZU1ldGhvZCA9XG4gICAgICBjb25maWd1cmF0aW9uLnVwZGF0ZVR5cGUgPT09IENvbmZpZ3VyYXRvci5VcGRhdGVUeXBlLlZBTFVFX1FVQU5USVRZXG4gICAgICAgID8gdGhpcy5jcHFSZXN0U2VydmljZS51cGRhdGVWYWx1ZVF1YW50aXR5XG4gICAgICAgIDogdGhpcy5jcHFSZXN0U2VydmljZS51cGRhdGVBdHRyaWJ1dGU7XG4gICAgcmV0dXJuIHVwZGF0ZU1ldGhvZC5jYWxsKHRoaXMuY3BxUmVzdFNlcnZpY2UsIGNvbmZpZ3VyYXRpb24pLnBpcGUoXG4gICAgICBtYXAoKGNvbmZpZ1Jlc3BvbnNlOiBDb25maWd1cmF0b3IuQ29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICBjb25maWdSZXNwb25zZS5vd25lciA9IGNvbmZpZ3VyYXRpb24ub3duZXI7XG4gICAgICAgIHJldHVybiBjb25maWdSZXNwb25zZTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGFkZFRvQ2FydChcbiAgICBwYXJhbWV0ZXJzOiBDb25maWd1cmF0b3IuQWRkVG9DYXJ0UGFyYW1ldGVyc1xuICApOiBPYnNlcnZhYmxlPENhcnRNb2RpZmljYXRpb24+IHtcbiAgICByZXR1cm4gdGhpcy5jcHFPY2NTZXJ2aWNlLmFkZFRvQ2FydChwYXJhbWV0ZXJzKTtcbiAgfVxuXG4gIHJlYWRDb25maWd1cmF0aW9uRm9yQ2FydEVudHJ5KFxuICAgIHBhcmFtZXRlcnM6IENvbW1vbkNvbmZpZ3VyYXRvci5SZWFkQ29uZmlndXJhdGlvbkZyb21DYXJ0RW50cnlQYXJhbWV0ZXJzXG4gICk6IE9ic2VydmFibGU8Q29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb24+IHtcbiAgICByZXR1cm4gdGhpcy5jcHFPY2NTZXJ2aWNlLmdldENvbmZpZ0lkRm9yQ2FydEVudHJ5KHBhcmFtZXRlcnMpLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKGNvbmZpZ0lkKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNwcVJlc3RTZXJ2aWNlLnJlYWRDb25maWd1cmF0aW9uKGNvbmZpZ0lkKS5waXBlKFxuICAgICAgICAgIG1hcCgoY29uZmlnUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbmZpZ1Jlc3BvbnNlLm93bmVyID0gcGFyYW1ldGVycy5vd25lcjtcbiAgICAgICAgICAgIHJldHVybiBjb25maWdSZXNwb25zZTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgdXBkYXRlQ29uZmlndXJhdGlvbkZvckNhcnRFbnRyeShcbiAgICBwYXJhbWV0ZXJzOiBDb25maWd1cmF0b3IuVXBkYXRlQ29uZmlndXJhdGlvbkZvckNhcnRFbnRyeVBhcmFtZXRlcnNcbiAgKTogT2JzZXJ2YWJsZTxDYXJ0TW9kaWZpY2F0aW9uPiB7XG4gICAgcmV0dXJuIHRoaXMuY3BxT2NjU2VydmljZS51cGRhdGVDYXJ0RW50cnkocGFyYW1ldGVycyk7XG4gIH1cblxuICByZWFkQ29uZmlndXJhdGlvbkZvck9yZGVyRW50cnkoXG4gICAgcGFyYW1ldGVyczogQ29tbW9uQ29uZmlndXJhdG9yLlJlYWRDb25maWd1cmF0aW9uRnJvbU9yZGVyRW50cnlQYXJhbWV0ZXJzXG4gICk6IE9ic2VydmFibGU8Q29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb24+IHtcbiAgICByZXR1cm4gdGhpcy5jcHFPY2NTZXJ2aWNlLmdldENvbmZpZ0lkRm9yT3JkZXJFbnRyeShwYXJhbWV0ZXJzKS5waXBlKFxuICAgICAgc3dpdGNoTWFwKChjb25maWdJZCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jcHFSZXN0U2VydmljZS5yZWFkQ29uZmlndXJhdGlvbihjb25maWdJZCkucGlwZShcbiAgICAgICAgICBtYXAoKGNvbmZpZ1Jlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBjb25maWdSZXNwb25zZS5vd25lciA9IHBhcmFtZXRlcnMub3duZXI7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnUmVzcG9uc2U7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHJlYWRQcmljZVN1bW1hcnkoXG4gICAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdG9yLkNvbmZpZ3VyYXRpb25cbiAgKTogT2JzZXJ2YWJsZTxDb25maWd1cmF0b3IuQ29uZmlndXJhdGlvbj4ge1xuICAgIHJldHVybiBvZihjb25maWd1cmF0aW9uKTsgLy8gc28gdGhhdCBVSSBkb2VzIG5vdCBydW4gaW50byBleGNlcHRpb25cbiAgfVxuXG4gIGdldENvbmZpZ3VyYXRpb25PdmVydmlldyhcbiAgICBjb25maWdJZDogc3RyaW5nXG4gICk6IE9ic2VydmFibGU8Q29uZmlndXJhdG9yLk92ZXJ2aWV3PiB7XG4gICAgcmV0dXJuIHRoaXMuY3BxUmVzdFNlcnZpY2UucmVhZENvbmZpZ3VyYXRpb25PdmVydmlldyhjb25maWdJZCk7XG4gIH1cbn1cbiJdfQ==