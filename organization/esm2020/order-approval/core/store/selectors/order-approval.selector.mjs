/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { createSelector, createFeatureSelector, } from '@ngrx/store';
import { StateUtils } from '@spartacus/core';
import { ORDER_APPROVAL_FEATURE, } from '../order-approval-state';
export const getOrderApprovalState = createFeatureSelector(ORDER_APPROVAL_FEATURE);
export const getOrderApprovalManagementState = createSelector(getOrderApprovalState, (state) => state[ORDER_APPROVAL_FEATURE]);
export const getOrderApprovalsState = createSelector(getOrderApprovalManagementState, (state) => state && state.entities);
export const getOrderApproval = (orderApprovalCode) => createSelector(getOrderApprovalsState, (state) => StateUtils.entityLoaderStateSelector(state, orderApprovalCode));
export const getOrderApprovalList = (params) => createSelector(getOrderApprovalManagementState, (state) => StateUtils.denormalizeSearch(state, params));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItYXBwcm92YWwuc2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9mZWF0dXJlLWxpYnMvb3JnYW5pemF0aW9uL29yZGVyLWFwcHJvdmFsL2NvcmUvc3RvcmUvc2VsZWN0b3JzL29yZGVyLWFwcHJvdmFsLnNlbGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEVBQ0wsY0FBYyxFQUVkLHFCQUFxQixHQUN0QixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQStCLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTFFLE9BQU8sRUFFTCxzQkFBc0IsR0FFdkIsTUFBTSx5QkFBeUIsQ0FBQztBQUVqQyxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FHOUIscUJBQXFCLENBQXFCLHNCQUFzQixDQUFDLENBQUM7QUFFdEUsTUFBTSxDQUFDLE1BQU0sK0JBQStCLEdBR3hDLGNBQWMsQ0FDaEIscUJBQXFCLEVBQ3JCLENBQUMsS0FBeUIsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQzdELENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FHL0IsY0FBYyxDQUNoQiwrQkFBK0IsRUFDL0IsQ0FBQyxLQUE4QixFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FDNUQsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLENBQzlCLGlCQUF5QixFQUl6QixFQUFFLENBQ0YsY0FBYyxDQUNaLHNCQUFzQixFQUN0QixDQUFDLEtBQWtELEVBQUUsRUFBRSxDQUNyRCxVQUFVLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQ2pFLENBQUM7QUFFSixNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxDQUNsQyxNQUFvQixFQUlwQixFQUFFLENBQ0YsY0FBYyxDQUNaLCtCQUErQixFQUMvQixDQUFDLEtBQThCLEVBQUUsRUFBRSxDQUNqQyxVQUFVLENBQUMsaUJBQWlCLENBQWdCLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FDN0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDIyIFNBUCBTcGFydGFjdXMgdGVhbSA8c3BhcnRhY3VzLXRlYW1Ac2FwLmNvbT5cbiAqXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbmltcG9ydCB7XG4gIGNyZWF0ZVNlbGVjdG9yLFxuICBNZW1vaXplZFNlbGVjdG9yLFxuICBjcmVhdGVGZWF0dXJlU2VsZWN0b3IsXG59IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCB7IEVudGl0aWVzTW9kZWwsIFNlYXJjaENvbmZpZywgU3RhdGVVdGlscyB9IGZyb20gJ0BzcGFydGFjdXMvY29yZSc7XG5pbXBvcnQgeyBPcmRlckFwcHJvdmFsIH0gZnJvbSAnLi4vLi4vbW9kZWwvb3JkZXItYXBwcm92YWwubW9kZWwnO1xuaW1wb3J0IHtcbiAgT3JkZXJBcHByb3ZhbE1hbmFnZW1lbnQsXG4gIE9SREVSX0FQUFJPVkFMX0ZFQVRVUkUsXG4gIE9yZGVyQXBwcm92YWxTdGF0ZSxcbn0gZnJvbSAnLi4vb3JkZXItYXBwcm92YWwtc3RhdGUnO1xuXG5leHBvcnQgY29uc3QgZ2V0T3JkZXJBcHByb3ZhbFN0YXRlOiBNZW1vaXplZFNlbGVjdG9yPFxuICBPcmRlckFwcHJvdmFsU3RhdGUsXG4gIE9yZGVyQXBwcm92YWxTdGF0ZVxuPiA9IGNyZWF0ZUZlYXR1cmVTZWxlY3RvcjxPcmRlckFwcHJvdmFsU3RhdGU+KE9SREVSX0FQUFJPVkFMX0ZFQVRVUkUpO1xuXG5leHBvcnQgY29uc3QgZ2V0T3JkZXJBcHByb3ZhbE1hbmFnZW1lbnRTdGF0ZTogTWVtb2l6ZWRTZWxlY3RvcjxcbiAgT3JkZXJBcHByb3ZhbFN0YXRlLFxuICBPcmRlckFwcHJvdmFsTWFuYWdlbWVudFxuPiA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRPcmRlckFwcHJvdmFsU3RhdGUsXG4gIChzdGF0ZTogT3JkZXJBcHByb3ZhbFN0YXRlKSA9PiBzdGF0ZVtPUkRFUl9BUFBST1ZBTF9GRUFUVVJFXVxuKTtcblxuZXhwb3J0IGNvbnN0IGdldE9yZGVyQXBwcm92YWxzU3RhdGU6IE1lbW9pemVkU2VsZWN0b3I8XG4gIE9yZGVyQXBwcm92YWxTdGF0ZSxcbiAgU3RhdGVVdGlscy5FbnRpdHlMb2FkZXJTdGF0ZTxPcmRlckFwcHJvdmFsPlxuPiA9IGNyZWF0ZVNlbGVjdG9yKFxuICBnZXRPcmRlckFwcHJvdmFsTWFuYWdlbWVudFN0YXRlLFxuICAoc3RhdGU6IE9yZGVyQXBwcm92YWxNYW5hZ2VtZW50KSA9PiBzdGF0ZSAmJiBzdGF0ZS5lbnRpdGllc1xuKTtcblxuZXhwb3J0IGNvbnN0IGdldE9yZGVyQXBwcm92YWwgPSAoXG4gIG9yZGVyQXBwcm92YWxDb2RlOiBzdHJpbmdcbik6IE1lbW9pemVkU2VsZWN0b3I8XG4gIE9yZGVyQXBwcm92YWxTdGF0ZSxcbiAgU3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxPcmRlckFwcHJvdmFsPlxuPiA9PlxuICBjcmVhdGVTZWxlY3RvcihcbiAgICBnZXRPcmRlckFwcHJvdmFsc1N0YXRlLFxuICAgIChzdGF0ZTogU3RhdGVVdGlscy5FbnRpdHlMb2FkZXJTdGF0ZTxPcmRlckFwcHJvdmFsPikgPT5cbiAgICAgIFN0YXRlVXRpbHMuZW50aXR5TG9hZGVyU3RhdGVTZWxlY3RvcihzdGF0ZSwgb3JkZXJBcHByb3ZhbENvZGUpXG4gICk7XG5cbmV4cG9ydCBjb25zdCBnZXRPcmRlckFwcHJvdmFsTGlzdCA9IChcbiAgcGFyYW1zOiBTZWFyY2hDb25maWdcbik6IE1lbW9pemVkU2VsZWN0b3I8XG4gIE9yZGVyQXBwcm92YWxTdGF0ZSxcbiAgU3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxFbnRpdGllc01vZGVsPE9yZGVyQXBwcm92YWw+PlxuPiA9PlxuICBjcmVhdGVTZWxlY3RvcihcbiAgICBnZXRPcmRlckFwcHJvdmFsTWFuYWdlbWVudFN0YXRlLFxuICAgIChzdGF0ZTogT3JkZXJBcHByb3ZhbE1hbmFnZW1lbnQpID0+XG4gICAgICBTdGF0ZVV0aWxzLmRlbm9ybWFsaXplU2VhcmNoPE9yZGVyQXBwcm92YWw+KHN0YXRlLCBwYXJhbXMpXG4gICk7XG4iXX0=