/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Injectable } from '@angular/core';
import { queueScheduler, using } from 'rxjs';
import { auditTime, filter, map, observeOn, tap } from 'rxjs/operators';
import { UserGroupActions } from '../store/actions/index';
import { getAvailableOrderApprovalPermissions, getAvailableOrgCustomers, getUserGroup, getUserGroupList, getUserGroupState, getUserGroupValue, } from '../store/selectors/user-group.selector';
import { getItemStatus } from '../utils/get-item-status';
import * as i0 from "@angular/core";
import * as i1 from "@ngrx/store";
import * as i2 from "@spartacus/core";
export class UserGroupService {
    constructor(store, userIdService) {
        this.store = store;
        this.userIdService = userIdService;
    }
    load(userGroupId) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.LoadUserGroup({
            userId,
            userGroupId,
        })), () => {
            // TODO: for future releases, refactor this part to thrown errors
        });
    }
    loadList(params) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.LoadUserGroups({ userId, params })), () => {
            // TODO: for future releases, refactor this part to thrown errors
        });
    }
    getUserGroup(userGroupId) {
        return this.store.select(getUserGroup(userGroupId));
    }
    getUserGroupValue(userGroupId) {
        return this.store
            .select(getUserGroupValue(userGroupId))
            .pipe(filter((userGroup) => Boolean(userGroup)));
    }
    getUserGroupList(params) {
        return this.store.select(getUserGroupList(params));
    }
    getAvailableOrgCustomersList(userGroupId, params) {
        return this.store.select(getAvailableOrgCustomers(userGroupId, params));
    }
    getAvailableOrderApprovalPermissionsList(userGroupId, params) {
        return this.store.select(getAvailableOrderApprovalPermissions(userGroupId, params));
    }
    get(userGroupUid) {
        const loading$ = this.getUserGroup(userGroupUid).pipe(auditTime(0), tap((state) => {
            if (!(state.loading || state.success || state.error)) {
                this.load(userGroupUid);
            }
        }));
        return using(() => loading$.subscribe(), () => this.getUserGroupValue(userGroupUid));
    }
    getList(params) {
        return this.getUserGroupList(params).pipe(observeOn(queueScheduler), tap((process) => {
            if (!(process.loading || process.success || process.error)) {
                this.loadList(params);
            }
        }), filter((process) => Boolean(process.success || process.error)), map((result) => result.value));
    }
    create(userGroup) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.CreateUserGroup({
            userId,
            userGroup,
        })), () => {
            // TODO: for future releases, refactor this part to thrown errors
        });
    }
    update(userGroupId, userGroup) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.UpdateUserGroup({
            userId,
            userGroupId,
            userGroup,
        })), () => {
            // TODO: for future releases, refactor this part to thrown errors
        });
    }
    getLoadingStatus(budgetCode) {
        return getItemStatus(this.getUserGroup(budgetCode));
    }
    delete(userGroupId) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.DeleteUserGroup({
            userId,
            userGroupId,
        })), () => {
            // TODO: for future releases, refactor this part to thrown errors
        });
    }
    loadAvailableOrgCustomers(userGroupId, params) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.LoadAvailableOrgCustomers({
            userId,
            userGroupId,
            params,
        })), () => {
            // TODO: for future releases, refactor this part to thrown errors
        });
    }
    loadAvailableOrderApprovalPermissions(userGroupId, params) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.LoadPermissions({
            userId,
            userGroupId,
            params,
        })), () => {
            // TODO: for future releases, refactor this part to thrown errors
        });
    }
    getAvailableOrgCustomers(userGroupId, params) {
        return this.getAvailableOrgCustomersList(userGroupId, params).pipe(observeOn(queueScheduler), tap((process) => {
            if (!(process.loading || process.success || process.error)) {
                this.loadAvailableOrgCustomers(userGroupId, params);
            }
        }), filter((process) => Boolean(process.success || process.error)), map((result) => result.value));
    }
    getAvailableOrderApprovalPermissions(userGroupId, params) {
        return this.getAvailableOrderApprovalPermissionsList(userGroupId, params).pipe(observeOn(queueScheduler), tap((process) => {
            if (!(process.loading || process.success || process.error)) {
                this.loadAvailableOrderApprovalPermissions(userGroupId, params);
            }
        }), filter((process) => Boolean(process.success || process.error)), map((result) => result.value));
    }
    assignMember(userGroupId, customerId) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.AssignMember({
            userId,
            userGroupId,
            customerId,
        })), () => {
            // TODO: for future releases, refactor this part to thrown errors
        });
    }
    unassignMember(userGroupId, customerId) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.UnassignMember({
            userId,
            userGroupId,
            customerId,
        })), () => {
            // Intentional empty arrow function
        });
    }
    unassignAllMembers(userGroupId) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.UnassignAllMembers({
            userId,
            userGroupId,
        })), () => {
            // Intentional empty arrow function
        });
    }
    assignPermission(userGroupId, permissionUid) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.AssignPermission({
            userId,
            userGroupId,
            permissionUid,
        })), () => {
            // Intentional empty arrow function
        });
    }
    unassignPermission(userGroupId, permissionUid) {
        this.userIdService.takeUserId(true).subscribe((userId) => this.store.dispatch(new UserGroupActions.UnassignPermission({
            userId,
            userGroupId,
            permissionUid,
        })), () => {
            // Intentional empty arrow function
        });
    }
    getUserGroupState(code) {
        return this.store.select(getUserGroupState(code));
    }
    getErrorState(code) {
        return this.getUserGroupState(code).pipe(map((state) => state.error ?? false));
    }
}
UserGroupService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserGroupService, deps: [{ token: i1.Store }, { token: i2.UserIdService }], target: i0.ɵɵFactoryTarget.Injectable });
UserGroupService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserGroupService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserGroupService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Store }, { type: i2.UserIdService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1ncm91cC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL29yZ2FuaXphdGlvbi9hZG1pbmlzdHJhdGlvbi9jb3JlL3NlcnZpY2VzL3VzZXItZ3JvdXAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVMzQyxPQUFPLEVBQWMsY0FBYyxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN6RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXhFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTFELE9BQU8sRUFDTCxvQ0FBb0MsRUFDcEMsd0JBQXdCLEVBQ3hCLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGlCQUFpQixHQUNsQixNQUFNLHdDQUF3QyxDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7OztBQUd6RCxNQUFNLE9BQU8sZ0JBQWdCO0lBQzNCLFlBQ1ksS0FBbUMsRUFDbkMsYUFBNEI7UUFENUIsVUFBSyxHQUFMLEtBQUssQ0FBOEI7UUFDbkMsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFDckMsQ0FBQztJQUVKLElBQUksQ0FBQyxXQUFtQjtRQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQzNDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDVCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FDakIsSUFBSSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7WUFDakMsTUFBTTtZQUNOLFdBQVc7U0FDWixDQUFDLENBQ0gsRUFD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QUFHLEVBQUU7WUFDSCxtQ0FBbUM7UUFDckMsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDO0lBRUQsa0JBQWtCLENBQUMsV0FBbUIsRUFBRSxhQUFxQjtRQUMzRCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQzNDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FDVCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FDakIsSUFBSSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztZQUN0QyxNQUFNO1lBQ04sV0FBVztZQUNYLGFBQWE7U0FDZCxDQUFDLENBQ0gsRUFDSCxHQUFHLEVBQUU7WUFDSCxtQ0FBbUM7UUFDckMsQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDO0lBRU8saUJBQWlCLENBQ3ZCLElBQVk7UUFFWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFZO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDdEMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUNyQyxDQUFDO0lBQ0osQ0FBQzs7NkdBM1RVLGdCQUFnQjtpSEFBaEIsZ0JBQWdCLGNBREgsTUFBTTsyRkFDbkIsZ0JBQWdCO2tCQUQ1QixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDIyIFNBUCBTcGFydGFjdXMgdGVhbSA8c3BhcnRhY3VzLXRlYW1Ac2FwLmNvbT5cbiAqXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgQjJCVXNlcixcbiAgRW50aXRpZXNNb2RlbCxcbiAgU2VhcmNoQ29uZmlnLFxuICBTdGF0ZVV0aWxzLFxuICBVc2VySWRTZXJ2aWNlLFxufSBmcm9tICdAc3BhcnRhY3VzL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgcXVldWVTY2hlZHVsZXIsIHVzaW5nIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBhdWRpdFRpbWUsIGZpbHRlciwgbWFwLCBvYnNlcnZlT24sIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE9yZ2FuaXphdGlvbkl0ZW1TdGF0dXMgfSBmcm9tICcuLi9tb2RlbC9vcmdhbml6YXRpb24taXRlbS1zdGF0dXMnO1xuaW1wb3J0IHsgUGVybWlzc2lvbiB9IGZyb20gJy4uL21vZGVsL3Blcm1pc3Npb24ubW9kZWwnO1xuaW1wb3J0IHsgVXNlckdyb3VwIH0gZnJvbSAnLi4vbW9kZWwvdXNlci1ncm91cC5tb2RlbCc7XG5pbXBvcnQgeyBVc2VyR3JvdXBBY3Rpb25zIH0gZnJvbSAnLi4vc3RvcmUvYWN0aW9ucy9pbmRleCc7XG5pbXBvcnQgeyBTdGF0ZVdpdGhPcmdhbml6YXRpb24gfSBmcm9tICcuLi9zdG9yZS9vcmdhbml6YXRpb24tc3RhdGUnO1xuaW1wb3J0IHtcbiAgZ2V0QXZhaWxhYmxlT3JkZXJBcHByb3ZhbFBlcm1pc3Npb25zLFxuICBnZXRBdmFpbGFibGVPcmdDdXN0b21lcnMsXG4gIGdldFVzZXJHcm91cCxcbiAgZ2V0VXNlckdyb3VwTGlzdCxcbiAgZ2V0VXNlckdyb3VwU3RhdGUsXG4gIGdldFVzZXJHcm91cFZhbHVlLFxufSBmcm9tICcuLi9zdG9yZS9zZWxlY3RvcnMvdXNlci1ncm91cC5zZWxlY3Rvcic7XG5pbXBvcnQgeyBnZXRJdGVtU3RhdHVzIH0gZnJvbSAnLi4vdXRpbHMvZ2V0LWl0ZW0tc3RhdHVzJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBVc2VyR3JvdXBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHN0b3JlOiBTdG9yZTxTdGF0ZVdpdGhPcmdhbml6YXRpb24+LFxuICAgIHByb3RlY3RlZCB1c2VySWRTZXJ2aWNlOiBVc2VySWRTZXJ2aWNlXG4gICkge31cblxuICBsb2FkKHVzZXJHcm91cElkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnVzZXJJZFNlcnZpY2UudGFrZVVzZXJJZCh0cnVlKS5zdWJzY3JpYmUoXG4gICAgICAodXNlcklkKSA9PlxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgIG5ldyBVc2VyR3JvdXBBY3Rpb25zLkxvYWRVc2VyR3JvdXAoe1xuICAgICAgICAgICAgdXNlcklkLFxuICAgICAgICAgICAgdXNlckdyb3VwSWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgLy8gVE9ETzogZm9yIGZ1dHVyZSByZWxlYXNlcywgcmVmYWN0b3IgdGhpcyBwYXJ0IHRvIHRocm93biBlcnJvcnNcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgbG9hZExpc3QocGFyYW1zOiBTZWFyY2hDb25maWcpIHtcbiAgICB0aGlzLnVzZXJJZFNlcnZpY2UudGFrZVVzZXJJZCh0cnVlKS5zdWJzY3JpYmUoXG4gICAgICAodXNlcklkKSA9PlxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgIG5ldyBVc2VyR3JvdXBBY3Rpb25zLkxvYWRVc2VyR3JvdXBzKHsgdXNlcklkLCBwYXJhbXMgfSlcbiAgICAgICAgKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgLy8gVE9ETzogZm9yIGZ1dHVyZSByZWxlYXNlcywgcmVmYWN0b3IgdGhpcyBwYXJ0IHRvIHRocm93biBlcnJvcnNcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRVc2VyR3JvdXAoXG4gICAgdXNlckdyb3VwSWQ6IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFN0YXRlVXRpbHMuTG9hZGVyU3RhdGU8VXNlckdyb3VwPj4ge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLnNlbGVjdChnZXRVc2VyR3JvdXAodXNlckdyb3VwSWQpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0VXNlckdyb3VwVmFsdWUodXNlckdyb3VwSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8VXNlckdyb3VwPiB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmVcbiAgICAgIC5zZWxlY3QoZ2V0VXNlckdyb3VwVmFsdWUodXNlckdyb3VwSWQpKVxuICAgICAgLnBpcGUoZmlsdGVyKCh1c2VyR3JvdXApID0+IEJvb2xlYW4odXNlckdyb3VwKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRVc2VyR3JvdXBMaXN0KFxuICAgIHBhcmFtczogU2VhcmNoQ29uZmlnXG4gICk6IE9ic2VydmFibGU8U3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxFbnRpdGllc01vZGVsPFVzZXJHcm91cD4+PiB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmUuc2VsZWN0KGdldFVzZXJHcm91cExpc3QocGFyYW1zKSk7XG4gIH1cblxuICBwcml2YXRlIGdldEF2YWlsYWJsZU9yZ0N1c3RvbWVyc0xpc3QoXG4gICAgdXNlckdyb3VwSWQ6IHN0cmluZyxcbiAgICBwYXJhbXM6IFNlYXJjaENvbmZpZ1xuICApOiBPYnNlcnZhYmxlPFN0YXRlVXRpbHMuTG9hZGVyU3RhdGU8RW50aXRpZXNNb2RlbDxCMkJVc2VyPj4+IHtcbiAgICByZXR1cm4gdGhpcy5zdG9yZS5zZWxlY3QoZ2V0QXZhaWxhYmxlT3JnQ3VzdG9tZXJzKHVzZXJHcm91cElkLCBwYXJhbXMpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0QXZhaWxhYmxlT3JkZXJBcHByb3ZhbFBlcm1pc3Npb25zTGlzdChcbiAgICB1c2VyR3JvdXBJZDogc3RyaW5nLFxuICAgIHBhcmFtczogU2VhcmNoQ29uZmlnXG4gICk6IE9ic2VydmFibGU8U3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxFbnRpdGllc01vZGVsPFBlcm1pc3Npb24+Pj4ge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLnNlbGVjdChcbiAgICAgIGdldEF2YWlsYWJsZU9yZGVyQXBwcm92YWxQZXJtaXNzaW9ucyh1c2VyR3JvdXBJZCwgcGFyYW1zKVxuICAgICk7XG4gIH1cblxuICBnZXQodXNlckdyb3VwVWlkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFVzZXJHcm91cD4ge1xuICAgIGNvbnN0IGxvYWRpbmckID0gdGhpcy5nZXRVc2VyR3JvdXAodXNlckdyb3VwVWlkKS5waXBlKFxuICAgICAgYXVkaXRUaW1lKDApLFxuICAgICAgdGFwKChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIShzdGF0ZS5sb2FkaW5nIHx8IHN0YXRlLnN1Y2Nlc3MgfHwgc3RhdGUuZXJyb3IpKSB7XG4gICAgICAgICAgdGhpcy5sb2FkKHVzZXJHcm91cFVpZCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiB1c2luZyhcbiAgICAgICgpID0+IGxvYWRpbmckLnN1YnNjcmliZSgpLFxuICAgICAgKCkgPT4gdGhpcy5nZXRVc2VyR3JvdXBWYWx1ZSh1c2VyR3JvdXBVaWQpXG4gICAgKTtcbiAgfVxuXG4gIGdldExpc3QoXG4gICAgcGFyYW1zOiBTZWFyY2hDb25maWdcbiAgKTogT2JzZXJ2YWJsZTxFbnRpdGllc01vZGVsPFVzZXJHcm91cD4gfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRVc2VyR3JvdXBMaXN0KHBhcmFtcykucGlwZShcbiAgICAgIG9ic2VydmVPbihxdWV1ZVNjaGVkdWxlciksXG4gICAgICB0YXAoKHByb2Nlc3M6IFN0YXRlVXRpbHMuTG9hZGVyU3RhdGU8RW50aXRpZXNNb2RlbDxVc2VyR3JvdXA+PikgPT4ge1xuICAgICAgICBpZiAoIShwcm9jZXNzLmxvYWRpbmcgfHwgcHJvY2Vzcy5zdWNjZXNzIHx8IHByb2Nlc3MuZXJyb3IpKSB7XG4gICAgICAgICAgdGhpcy5sb2FkTGlzdChwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGZpbHRlcigocHJvY2VzczogU3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxFbnRpdGllc01vZGVsPFVzZXJHcm91cD4+KSA9PlxuICAgICAgICBCb29sZWFuKHByb2Nlc3Muc3VjY2VzcyB8fCBwcm9jZXNzLmVycm9yKVxuICAgICAgKSxcbiAgICAgIG1hcCgocmVzdWx0KSA9PiByZXN1bHQudmFsdWUpXG4gICAgKTtcbiAgfVxuXG4gIGNyZWF0ZSh1c2VyR3JvdXA6IFVzZXJHcm91cCkge1xuICAgIHRoaXMudXNlcklkU2VydmljZS50YWtlVXNlcklkKHRydWUpLnN1YnNjcmliZShcbiAgICAgICh1c2VySWQpID0+XG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goXG4gICAgICAgICAgbmV3IFVzZXJHcm91cEFjdGlvbnMuQ3JlYXRlVXNlckdyb3VwKHtcbiAgICAgICAgICAgIHVzZXJJZCxcbiAgICAgICAgICAgIHVzZXJHcm91cCxcbiAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgICAgKCkgPT4ge1xuICAgICAgICAvLyBUT0RPOiBmb3IgZnV0dXJlIHJlbGVhc2VzLCByZWZhY3RvciB0aGlzIHBhcnQgdG8gdGhyb3duIGVycm9yc1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICB1cGRhdGUodXNlckdyb3VwSWQ6IHN0cmluZywgdXNlckdyb3VwOiBVc2VyR3JvdXApIHtcbiAgICB0aGlzLnVzZXJJZFNlcnZpY2UudGFrZVVzZXJJZCh0cnVlKS5zdWJzY3JpYmUoXG4gICAgICAodXNlcklkKSA9PlxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgIG5ldyBVc2VyR3JvdXBBY3Rpb25zLlVwZGF0ZVVzZXJHcm91cCh7XG4gICAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgICB1c2VyR3JvdXBJZCxcbiAgICAgICAgICAgIHVzZXJHcm91cCxcbiAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgICAgKCkgPT4ge1xuICAgICAgICAvLyBUT0RPOiBmb3IgZnV0dXJlIHJlbGVhc2VzLCByZWZhY3RvciB0aGlzIHBhcnQgdG8gdGhyb3duIGVycm9yc1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBnZXRMb2FkaW5nU3RhdHVzKFxuICAgIGJ1ZGdldENvZGU6IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPE9yZ2FuaXphdGlvbkl0ZW1TdGF0dXM8VXNlckdyb3VwPj4ge1xuICAgIHJldHVybiBnZXRJdGVtU3RhdHVzKHRoaXMuZ2V0VXNlckdyb3VwKGJ1ZGdldENvZGUpKTtcbiAgfVxuXG4gIGRlbGV0ZSh1c2VyR3JvdXBJZDogc3RyaW5nKSB7XG4gICAgdGhpcy51c2VySWRTZXJ2aWNlLnRha2VVc2VySWQodHJ1ZSkuc3Vic2NyaWJlKFxuICAgICAgKHVzZXJJZCkgPT5cbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICBuZXcgVXNlckdyb3VwQWN0aW9ucy5EZWxldGVVc2VyR3JvdXAoe1xuICAgICAgICAgICAgdXNlcklkLFxuICAgICAgICAgICAgdXNlckdyb3VwSWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgLy8gVE9ETzogZm9yIGZ1dHVyZSByZWxlYXNlcywgcmVmYWN0b3IgdGhpcyBwYXJ0IHRvIHRocm93biBlcnJvcnNcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgbG9hZEF2YWlsYWJsZU9yZ0N1c3RvbWVycyh1c2VyR3JvdXBJZDogc3RyaW5nLCBwYXJhbXM6IFNlYXJjaENvbmZpZykge1xuICAgIHRoaXMudXNlcklkU2VydmljZS50YWtlVXNlcklkKHRydWUpLnN1YnNjcmliZShcbiAgICAgICh1c2VySWQpID0+XG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goXG4gICAgICAgICAgbmV3IFVzZXJHcm91cEFjdGlvbnMuTG9hZEF2YWlsYWJsZU9yZ0N1c3RvbWVycyh7XG4gICAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgICB1c2VyR3JvdXBJZCxcbiAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgICAgKCkgPT4ge1xuICAgICAgICAvLyBUT0RPOiBmb3IgZnV0dXJlIHJlbGVhc2VzLCByZWZhY3RvciB0aGlzIHBhcnQgdG8gdGhyb3duIGVycm9yc1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBsb2FkQXZhaWxhYmxlT3JkZXJBcHByb3ZhbFBlcm1pc3Npb25zKFxuICAgIHVzZXJHcm91cElkOiBzdHJpbmcsXG4gICAgcGFyYW1zOiBTZWFyY2hDb25maWdcbiAgKSB7XG4gICAgdGhpcy51c2VySWRTZXJ2aWNlLnRha2VVc2VySWQodHJ1ZSkuc3Vic2NyaWJlKFxuICAgICAgKHVzZXJJZCkgPT5cbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICBuZXcgVXNlckdyb3VwQWN0aW9ucy5Mb2FkUGVybWlzc2lvbnMoe1xuICAgICAgICAgICAgdXNlcklkLFxuICAgICAgICAgICAgdXNlckdyb3VwSWQsXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgfSlcbiAgICAgICAgKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgLy8gVE9ETzogZm9yIGZ1dHVyZSByZWxlYXNlcywgcmVmYWN0b3IgdGhpcyBwYXJ0IHRvIHRocm93biBlcnJvcnNcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgZ2V0QXZhaWxhYmxlT3JnQ3VzdG9tZXJzKFxuICAgIHVzZXJHcm91cElkOiBzdHJpbmcsXG4gICAgcGFyYW1zOiBTZWFyY2hDb25maWdcbiAgKTogT2JzZXJ2YWJsZTxFbnRpdGllc01vZGVsPEIyQlVzZXI+IHwgdW5kZWZpbmVkPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXZhaWxhYmxlT3JnQ3VzdG9tZXJzTGlzdCh1c2VyR3JvdXBJZCwgcGFyYW1zKS5waXBlKFxuICAgICAgb2JzZXJ2ZU9uKHF1ZXVlU2NoZWR1bGVyKSxcbiAgICAgIHRhcCgocHJvY2VzczogU3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxFbnRpdGllc01vZGVsPEIyQlVzZXI+PikgPT4ge1xuICAgICAgICBpZiAoIShwcm9jZXNzLmxvYWRpbmcgfHwgcHJvY2Vzcy5zdWNjZXNzIHx8IHByb2Nlc3MuZXJyb3IpKSB7XG4gICAgICAgICAgdGhpcy5sb2FkQXZhaWxhYmxlT3JnQ3VzdG9tZXJzKHVzZXJHcm91cElkLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGZpbHRlcigocHJvY2VzczogU3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxFbnRpdGllc01vZGVsPEIyQlVzZXI+PikgPT5cbiAgICAgICAgQm9vbGVhbihwcm9jZXNzLnN1Y2Nlc3MgfHwgcHJvY2Vzcy5lcnJvcilcbiAgICAgICksXG4gICAgICBtYXAoKHJlc3VsdCkgPT4gcmVzdWx0LnZhbHVlKVxuICAgICk7XG4gIH1cblxuICBnZXRBdmFpbGFibGVPcmRlckFwcHJvdmFsUGVybWlzc2lvbnMoXG4gICAgdXNlckdyb3VwSWQ6IHN0cmluZyxcbiAgICBwYXJhbXM6IFNlYXJjaENvbmZpZ1xuICApOiBPYnNlcnZhYmxlPEVudGl0aWVzTW9kZWw8UGVybWlzc2lvbj4gfCB1bmRlZmluZWQ+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdmFpbGFibGVPcmRlckFwcHJvdmFsUGVybWlzc2lvbnNMaXN0KFxuICAgICAgdXNlckdyb3VwSWQsXG4gICAgICBwYXJhbXNcbiAgICApLnBpcGUoXG4gICAgICBvYnNlcnZlT24ocXVldWVTY2hlZHVsZXIpLFxuICAgICAgdGFwKChwcm9jZXNzOiBTdGF0ZVV0aWxzLkxvYWRlclN0YXRlPEVudGl0aWVzTW9kZWw8UGVybWlzc2lvbj4+KSA9PiB7XG4gICAgICAgIGlmICghKHByb2Nlc3MubG9hZGluZyB8fCBwcm9jZXNzLnN1Y2Nlc3MgfHwgcHJvY2Vzcy5lcnJvcikpIHtcbiAgICAgICAgICB0aGlzLmxvYWRBdmFpbGFibGVPcmRlckFwcHJvdmFsUGVybWlzc2lvbnModXNlckdyb3VwSWQsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgZmlsdGVyKChwcm9jZXNzOiBTdGF0ZVV0aWxzLkxvYWRlclN0YXRlPEVudGl0aWVzTW9kZWw8UGVybWlzc2lvbj4+KSA9PlxuICAgICAgICBCb29sZWFuKHByb2Nlc3Muc3VjY2VzcyB8fCBwcm9jZXNzLmVycm9yKVxuICAgICAgKSxcbiAgICAgIG1hcCgocmVzdWx0KSA9PiByZXN1bHQudmFsdWUpXG4gICAgKTtcbiAgfVxuXG4gIGFzc2lnbk1lbWJlcih1c2VyR3JvdXBJZDogc3RyaW5nLCBjdXN0b21lcklkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnVzZXJJZFNlcnZpY2UudGFrZVVzZXJJZCh0cnVlKS5zdWJzY3JpYmUoXG4gICAgICAodXNlcklkKSA9PlxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgIG5ldyBVc2VyR3JvdXBBY3Rpb25zLkFzc2lnbk1lbWJlcih7XG4gICAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgICB1c2VyR3JvdXBJZCxcbiAgICAgICAgICAgIGN1c3RvbWVySWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgLy8gVE9ETzogZm9yIGZ1dHVyZSByZWxlYXNlcywgcmVmYWN0b3IgdGhpcyBwYXJ0IHRvIHRocm93biBlcnJvcnNcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgdW5hc3NpZ25NZW1iZXIodXNlckdyb3VwSWQ6IHN0cmluZywgY3VzdG9tZXJJZDogc3RyaW5nKSB7XG4gICAgdGhpcy51c2VySWRTZXJ2aWNlLnRha2VVc2VySWQodHJ1ZSkuc3Vic2NyaWJlKFxuICAgICAgKHVzZXJJZCkgPT5cbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICBuZXcgVXNlckdyb3VwQWN0aW9ucy5VbmFzc2lnbk1lbWJlcih7XG4gICAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgICB1c2VyR3JvdXBJZCxcbiAgICAgICAgICAgIGN1c3RvbWVySWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgLy8gSW50ZW50aW9uYWwgZW1wdHkgYXJyb3cgZnVuY3Rpb25cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgdW5hc3NpZ25BbGxNZW1iZXJzKHVzZXJHcm91cElkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnVzZXJJZFNlcnZpY2UudGFrZVVzZXJJZCh0cnVlKS5zdWJzY3JpYmUoXG4gICAgICAodXNlcklkKSA9PlxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKFxuICAgICAgICAgIG5ldyBVc2VyR3JvdXBBY3Rpb25zLlVuYXNzaWduQWxsTWVtYmVycyh7XG4gICAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgICB1c2VyR3JvdXBJZCxcbiAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgICAgKCkgPT4ge1xuICAgICAgICAvLyBJbnRlbnRpb25hbCBlbXB0eSBhcnJvdyBmdW5jdGlvblxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBhc3NpZ25QZXJtaXNzaW9uKHVzZXJHcm91cElkOiBzdHJpbmcsIHBlcm1pc3Npb25VaWQ6IHN0cmluZykge1xuICAgIHRoaXMudXNlcklkU2VydmljZS50YWtlVXNlcklkKHRydWUpLnN1YnNjcmliZShcbiAgICAgICh1c2VySWQpID0+XG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goXG4gICAgICAgICAgbmV3IFVzZXJHcm91cEFjdGlvbnMuQXNzaWduUGVybWlzc2lvbih7XG4gICAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgICB1c2VyR3JvdXBJZCxcbiAgICAgICAgICAgIHBlcm1pc3Npb25VaWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgKSxcbiAgICAgICgpID0+IHtcbiAgICAgICAgLy8gSW50ZW50aW9uYWwgZW1wdHkgYXJyb3cgZnVuY3Rpb25cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgdW5hc3NpZ25QZXJtaXNzaW9uKHVzZXJHcm91cElkOiBzdHJpbmcsIHBlcm1pc3Npb25VaWQ6IHN0cmluZykge1xuICAgIHRoaXMudXNlcklkU2VydmljZS50YWtlVXNlcklkKHRydWUpLnN1YnNjcmliZShcbiAgICAgICh1c2VySWQpID0+XG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goXG4gICAgICAgICAgbmV3IFVzZXJHcm91cEFjdGlvbnMuVW5hc3NpZ25QZXJtaXNzaW9uKHtcbiAgICAgICAgICAgIHVzZXJJZCxcbiAgICAgICAgICAgIHVzZXJHcm91cElkLFxuICAgICAgICAgICAgcGVybWlzc2lvblVpZCxcbiAgICAgICAgICB9KVxuICAgICAgICApLFxuICAgICAgKCkgPT4ge1xuICAgICAgICAvLyBJbnRlbnRpb25hbCBlbXB0eSBhcnJvdyBmdW5jdGlvblxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIGdldFVzZXJHcm91cFN0YXRlKFxuICAgIGNvZGU6IHN0cmluZ1xuICApOiBPYnNlcnZhYmxlPFN0YXRlVXRpbHMuTG9hZGVyU3RhdGU8VXNlckdyb3VwPj4ge1xuICAgIHJldHVybiB0aGlzLnN0b3JlLnNlbGVjdChnZXRVc2VyR3JvdXBTdGF0ZShjb2RlKSk7XG4gIH1cblxuICBnZXRFcnJvclN0YXRlKGNvZGU6IHN0cmluZyk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmdldFVzZXJHcm91cFN0YXRlKGNvZGUpLnBpcGUoXG4gICAgICBtYXAoKHN0YXRlKSA9PiBzdGF0ZS5lcnJvciA/PyBmYWxzZSlcbiAgICApO1xuICB9XG59XG4iXX0=