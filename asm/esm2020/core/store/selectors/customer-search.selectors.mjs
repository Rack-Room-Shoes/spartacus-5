/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { createSelector } from '@ngrx/store';
import { StateUtils } from '@spartacus/core';
import { getAsmState } from './feature.selector';
export const getCustomerSearchResultsLoaderState = createSelector(getAsmState, (state) => state.customerSearchResult);
export const getCustomerSearchResults = createSelector(getCustomerSearchResultsLoaderState, (state) => StateUtils.loaderValueSelector(state));
export const getCustomerSearchResultsLoading = createSelector(getCustomerSearchResultsLoaderState, (state) => StateUtils.loaderLoadingSelector(state));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItc2VhcmNoLnNlbGVjdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2ZlYXR1cmUtbGlicy9hc20vY29yZS9zdG9yZS9zZWxlY3RvcnMvY3VzdG9tZXItc2VhcmNoLnNlbGVjdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsT0FBTyxFQUFFLGNBQWMsRUFBb0IsTUFBTSxhQUFhLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRzdDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVqRCxNQUFNLENBQUMsTUFBTSxtQ0FBbUMsR0FHNUMsY0FBYyxDQUNoQixXQUFXLEVBQ1gsQ0FBQyxLQUFlLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FDaEQsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLHdCQUF3QixHQUdqQyxjQUFjLENBQ2hCLG1DQUFtQyxFQUNuQyxDQUFDLEtBQWlELEVBQUUsRUFBRSxDQUNwRCxVQUFVLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQ3hDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FHeEMsY0FBYyxDQUNoQixtQ0FBbUMsRUFDbkMsQ0FBQyxLQUFpRCxFQUFFLEVBQUUsQ0FDcEQsVUFBVSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUMxQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjIgU0FQIFNwYXJ0YWN1cyB0ZWFtIDxzcGFydGFjdXMtdGVhbUBzYXAuY29tPlxuICpcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlU2VsZWN0b3IsIE1lbW9pemVkU2VsZWN0b3IgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyBTdGF0ZVV0aWxzIH0gZnJvbSAnQHNwYXJ0YWN1cy9jb3JlJztcbmltcG9ydCB7IEN1c3RvbWVyU2VhcmNoUGFnZSB9IGZyb20gJy4uLy4uL21vZGVscy9hc20ubW9kZWxzJztcbmltcG9ydCB7IEFzbVN0YXRlLCBTdGF0ZVdpdGhBc20gfSBmcm9tICcuLi9hc20tc3RhdGUnO1xuaW1wb3J0IHsgZ2V0QXNtU3RhdGUgfSBmcm9tICcuL2ZlYXR1cmUuc2VsZWN0b3InO1xuXG5leHBvcnQgY29uc3QgZ2V0Q3VzdG9tZXJTZWFyY2hSZXN1bHRzTG9hZGVyU3RhdGU6IE1lbW9pemVkU2VsZWN0b3I8XG4gIFN0YXRlV2l0aEFzbSxcbiAgU3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxDdXN0b21lclNlYXJjaFBhZ2U+XG4+ID0gY3JlYXRlU2VsZWN0b3IoXG4gIGdldEFzbVN0YXRlLFxuICAoc3RhdGU6IEFzbVN0YXRlKSA9PiBzdGF0ZS5jdXN0b21lclNlYXJjaFJlc3VsdFxuKTtcblxuZXhwb3J0IGNvbnN0IGdldEN1c3RvbWVyU2VhcmNoUmVzdWx0czogTWVtb2l6ZWRTZWxlY3RvcjxcbiAgU3RhdGVXaXRoQXNtLFxuICBDdXN0b21lclNlYXJjaFBhZ2Vcbj4gPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q3VzdG9tZXJTZWFyY2hSZXN1bHRzTG9hZGVyU3RhdGUsXG4gIChzdGF0ZTogU3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxDdXN0b21lclNlYXJjaFBhZ2U+KSA9PlxuICAgIFN0YXRlVXRpbHMubG9hZGVyVmFsdWVTZWxlY3RvcihzdGF0ZSlcbik7XG5cbmV4cG9ydCBjb25zdCBnZXRDdXN0b21lclNlYXJjaFJlc3VsdHNMb2FkaW5nOiBNZW1vaXplZFNlbGVjdG9yPFxuICBTdGF0ZVdpdGhBc20sXG4gIGJvb2xlYW5cbj4gPSBjcmVhdGVTZWxlY3RvcihcbiAgZ2V0Q3VzdG9tZXJTZWFyY2hSZXN1bHRzTG9hZGVyU3RhdGUsXG4gIChzdGF0ZTogU3RhdGVVdGlscy5Mb2FkZXJTdGF0ZTxDdXN0b21lclNlYXJjaFBhZ2U+KSA9PlxuICAgIFN0YXRlVXRpbHMubG9hZGVyTG9hZGluZ1NlbGVjdG9yKHN0YXRlKVxuKTtcbiJdfQ==