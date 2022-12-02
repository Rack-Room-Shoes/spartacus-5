/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { queueScheduler } from 'rxjs';
import { filter, map, observeOn, pairwise } from 'rxjs/operators';
import { LoadStatus, } from '../model/organization-item-status';
export function getItemStatus(itemState) {
    return itemState.pipe(observeOn(queueScheduler), pairwise(), filter(([previousState]) => previousState.loading ?? false), map(([_previousState, currentState]) => ({
        status: currentState.success
            ? LoadStatus.SUCCESS
            : currentState.error
                ? LoadStatus.ERROR
                : null,
        item: currentState.value,
    })));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWl0ZW0tc3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL29yZ2FuaXphdGlvbi9hZG1pbmlzdHJhdGlvbi9jb3JlL3V0aWxzL2dldC1pdGVtLXN0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBR0gsT0FBTyxFQUFjLGNBQWMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRCxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUNMLFVBQVUsR0FFWCxNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE1BQU0sVUFBVSxhQUFhLENBQzNCLFNBQWdEO0lBRWhELE9BQU8sU0FBUyxDQUFDLElBQUksQ0FDbkIsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUN6QixRQUFRLEVBQUUsRUFDVixNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxFQUMzRCxHQUFHLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2QyxNQUFNLEVBQUUsWUFBWSxDQUFDLE9BQU87WUFDMUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPO1lBQ3BCLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSztnQkFDcEIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLO2dCQUNsQixDQUFDLENBQUMsSUFBSTtRQUNSLElBQUksRUFBRSxZQUFZLENBQUMsS0FBSztLQUN6QixDQUFDLENBQUMsQ0FDSixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDIyIFNBUCBTcGFydGFjdXMgdGVhbSA8c3BhcnRhY3VzLXRlYW1Ac2FwLmNvbT5cbiAqXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbmltcG9ydCB7IFN0YXRlVXRpbHMgfSBmcm9tICdAc3BhcnRhY3VzL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgcXVldWVTY2hlZHVsZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgbWFwLCBvYnNlcnZlT24sIHBhaXJ3aXNlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgTG9hZFN0YXR1cyxcbiAgT3JnYW5pemF0aW9uSXRlbVN0YXR1cyxcbn0gZnJvbSAnLi4vbW9kZWwvb3JnYW5pemF0aW9uLWl0ZW0tc3RhdHVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEl0ZW1TdGF0dXM8VD4oXG4gIGl0ZW1TdGF0ZTogT2JzZXJ2YWJsZTxTdGF0ZVV0aWxzLkxvYWRlclN0YXRlPFQ+PlxuKTogT2JzZXJ2YWJsZTxPcmdhbml6YXRpb25JdGVtU3RhdHVzPFQ+PiB7XG4gIHJldHVybiBpdGVtU3RhdGUucGlwZShcbiAgICBvYnNlcnZlT24ocXVldWVTY2hlZHVsZXIpLFxuICAgIHBhaXJ3aXNlKCksXG4gICAgZmlsdGVyKChbcHJldmlvdXNTdGF0ZV0pID0+IHByZXZpb3VzU3RhdGUubG9hZGluZyA/PyBmYWxzZSksXG4gICAgbWFwKChbX3ByZXZpb3VzU3RhdGUsIGN1cnJlbnRTdGF0ZV0pID0+ICh7XG4gICAgICBzdGF0dXM6IGN1cnJlbnRTdGF0ZS5zdWNjZXNzXG4gICAgICAgID8gTG9hZFN0YXR1cy5TVUNDRVNTXG4gICAgICAgIDogY3VycmVudFN0YXRlLmVycm9yXG4gICAgICAgID8gTG9hZFN0YXR1cy5FUlJPUlxuICAgICAgICA6IG51bGwsXG4gICAgICBpdGVtOiBjdXJyZW50U3RhdGUudmFsdWUsXG4gICAgfSkpXG4gICk7XG59XG4iXX0=