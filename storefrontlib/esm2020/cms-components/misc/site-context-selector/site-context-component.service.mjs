/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Injectable, Optional } from '@angular/core';
import { CURRENCY_CONTEXT_ID, isNotUndefined, LANGUAGE_CONTEXT_ID, } from '@spartacus/core';
import { of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { SiteContextType } from './site-context.model';
import * as i0 from "@angular/core";
import * as i1 from "../../../cms-structure/page/model/cms-component-data";
import * as i2 from "@spartacus/core";
const LABELS = {
    [LANGUAGE_CONTEXT_ID]: 'Language',
    [CURRENCY_CONTEXT_ID]: 'Currency',
};
export class SiteContextComponentService {
    constructor(componentData, contextServiceMap, injector) {
        this.componentData = componentData;
        this.contextServiceMap = contextServiceMap;
        this.injector = injector;
    }
    getItems(context) {
        return this.getService(context).pipe(switchMap((service) => service.getAll()), switchMap((items) => this.getContext(context).pipe(switchMap((ctx) => {
            const itemsCopy = [];
            for (const item of items) {
                itemsCopy.push({
                    ...item,
                    label: this.getOptionLabel(item, ctx),
                });
            }
            return of(itemsCopy);
        }))));
    }
    getActiveItem(context) {
        return this.getService(context).pipe(switchMap((service) => service.getActive()));
    }
    getLabel(context) {
        return this.getContext(context).pipe(map((ctx) => {
            if (ctx) {
                return LABELS[ctx];
            }
        }));
    }
    setActive(value, context) {
        this.getService(context)
            .pipe(take(1))
            .subscribe((service) => {
            service.setActive(value);
        });
    }
    getService(context) {
        return this.getContext(context).pipe(map((ctx) => ctx ? this.getInjectedService(ctx) : undefined), filter(isNotUndefined));
    }
    getContext(context) {
        if (context) {
            if (context === SiteContextType.CURRENCY) {
                return of(CURRENCY_CONTEXT_ID);
            }
            else if (context === SiteContextType.LANGUAGE) {
                return of(LANGUAGE_CONTEXT_ID);
            }
            else {
                return of(context);
            }
        }
        else if (this.componentData) {
            return this.componentData.data$.pipe(map((data) => data.context), map((ctx) => {
                switch (ctx) {
                    case 'LANGUAGE':
                        return LANGUAGE_CONTEXT_ID;
                    case 'CURRENCY':
                        return CURRENCY_CONTEXT_ID;
                    default:
                        return ctx;
                }
            }));
        }
        return of(undefined);
    }
    getInjectedService(context) {
        return this.injector.get(this.contextServiceMap[context], undefined);
    }
    getOptionLabel(item, context) {
        switch (context) {
            case LANGUAGE_CONTEXT_ID:
                return item.nativeName;
            case CURRENCY_CONTEXT_ID:
                return item.symbol + ' ' + item.isocode;
            default:
                return item.isocode;
        }
    }
}
SiteContextComponentService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextComponentService, deps: [{ token: i1.CmsComponentData, optional: true }, { token: i2.ContextServiceMap }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
SiteContextComponentService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextComponentService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextComponentService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CmsComponentData, decorators: [{
                    type: Optional
                }] }, { type: i2.ContextServiceMap }, { type: i0.Injector }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0ZS1jb250ZXh0LWNvbXBvbmVudC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc3RvcmVmcm9udGxpYi9jbXMtY29tcG9uZW50cy9taXNjL3NpdGUtY29udGV4dC1zZWxlY3Rvci9zaXRlLWNvbnRleHQtY29tcG9uZW50LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQVksUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9ELE9BQU8sRUFHTCxtQkFBbUIsRUFDbkIsY0FBYyxFQUNkLG1CQUFtQixHQUVwQixNQUFNLGlCQUFpQixDQUFDO0FBQ3pCLE9BQU8sRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7OztBQUV2RCxNQUFNLE1BQU0sR0FBOEI7SUFDeEMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLFVBQVU7SUFDakMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLFVBQVU7Q0FDbEMsQ0FBQztBQUdGLE1BQU0sT0FBTywyQkFBMkI7SUFDdEMsWUFFWSxhQUFnRSxFQUNsRSxpQkFBb0MsRUFDbEMsUUFBa0I7UUFGbEIsa0JBQWEsR0FBYixhQUFhLENBQW1EO1FBQ2xFLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDbEMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUMzQixDQUFDO0lBRUosUUFBUSxDQUFDLE9BQXlCO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQ2xDLFNBQVMsQ0FBQyxDQUFDLE9BQXlCLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FB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Q0gsQ0FBQyxDQUFDLENBQ0gsQ0FBQztTQUNIO1FBQ0QsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUVTLGtCQUFrQixDQUFDLE9BQWU7UUFDMUMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDdEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxFQUMvQixTQUFTLENBQ1YsQ0FBQztJQUNKLENBQUM7SUFFUyxjQUFjLENBQUMsSUFBUyxFQUFFLE9BQWdCO1FBQ2xELFFBQVEsT0FBTyxFQUFFO1lBQ2YsS0FBSyxtQkFBbUI7Z0JBQ3RCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN6QixLQUFLLG1CQUFtQjtnQkFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQzFDO2dCQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUN2QjtJQUNILENBQUM7O3dIQTVHVSwyQkFBMkI7NEhBQTNCLDJCQUEyQjsyRkFBM0IsMkJBQTJCO2tCQUR2QyxVQUFVOzswQkFHTixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjIgU0FQIFNwYXJ0YWN1cyB0ZWFtIDxzcGFydGFjdXMtdGVhbUBzYXAuY29tPlxuICpcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDbXNTaXRlQ29udGV4dFNlbGVjdG9yQ29tcG9uZW50LFxuICBDb250ZXh0U2VydmljZU1hcCxcbiAgQ1VSUkVOQ1lfQ09OVEVYVF9JRCxcbiAgaXNOb3RVbmRlZmluZWQsXG4gIExBTkdVQUdFX0NPTlRFWFRfSUQsXG4gIFNpdGVDb250ZXh0LFxufSBmcm9tICdAc3BhcnRhY3VzL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgbWFwLCBzd2l0Y2hNYXAsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDbXNDb21wb25lbnREYXRhIH0gZnJvbSAnLi4vLi4vLi4vY21zLXN0cnVjdHVyZS9wYWdlL21vZGVsL2Ntcy1jb21wb25lbnQtZGF0YSc7XG5pbXBvcnQgeyBTaXRlQ29udGV4dFR5cGUgfSBmcm9tICcuL3NpdGUtY29udGV4dC5tb2RlbCc7XG5cbmNvbnN0IExBQkVMUzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgW0xBTkdVQUdFX0NPTlRFWFRfSURdOiAnTGFuZ3VhZ2UnLFxuICBbQ1VSUkVOQ1lfQ09OVEVYVF9JRF06ICdDdXJyZW5jeScsXG59O1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2l0ZUNvbnRleHRDb21wb25lbnRTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKClcbiAgICBwcm90ZWN0ZWQgY29tcG9uZW50RGF0YTogQ21zQ29tcG9uZW50RGF0YTxDbXNTaXRlQ29udGV4dFNlbGVjdG9yQ29tcG9uZW50PixcbiAgICBwcml2YXRlIGNvbnRleHRTZXJ2aWNlTWFwOiBDb250ZXh0U2VydmljZU1hcCxcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge31cblxuICBnZXRJdGVtcyhjb250ZXh0PzogU2l0ZUNvbnRleHRUeXBlKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRTZXJ2aWNlKGNvbnRleHQpLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKHNlcnZpY2U6IFNpdGVDb250ZXh0PGFueT4pID0+IHNlcnZpY2UuZ2V0QWxsKCkpLFxuICAgICAgc3dpdGNoTWFwKChpdGVtcykgPT5cbiAgICAgICAgdGhpcy5nZXRDb250ZXh0KGNvbnRleHQpLnBpcGUoXG4gICAgICAgICAgc3dpdGNoTWFwKChjdHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zQ29weSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgICAgICAgIGl0ZW1zQ29weS5wdXNoKHtcbiAgICAgICAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgICAgICAgIGxhYmVsOiB0aGlzLmdldE9wdGlvbkxhYmVsKGl0ZW0sIGN0eCksXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9mKGl0ZW1zQ29weSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBnZXRBY3RpdmVJdGVtKGNvbnRleHQ/OiBTaXRlQ29udGV4dFR5cGUpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmdldFNlcnZpY2UoY29udGV4dCkucGlwZShcbiAgICAgIHN3aXRjaE1hcCgoc2VydmljZTogU2l0ZUNvbnRleHQ8YW55PikgPT4gc2VydmljZS5nZXRBY3RpdmUoKSlcbiAgICApO1xuICB9XG5cbiAgZ2V0TGFiZWwoY29udGV4dD86IFNpdGVDb250ZXh0VHlwZSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29udGV4dChjb250ZXh0KS5waXBlKFxuICAgICAgbWFwKChjdHgpID0+IHtcbiAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgIHJldHVybiBMQUJFTFNbY3R4XTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgc2V0QWN0aXZlKHZhbHVlOiBzdHJpbmcsIGNvbnRleHQ/OiBTaXRlQ29udGV4dFR5cGUpOiB2b2lkIHtcbiAgICB0aGlzLmdldFNlcnZpY2UoY29udGV4dClcbiAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAuc3Vic2NyaWJlKChzZXJ2aWNlKSA9PiB7XG4gICAgICAgIHNlcnZpY2Uuc2V0QWN0aXZlKHZhbHVlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFNlcnZpY2UoXG4gICAgY29udGV4dD86IFNpdGVDb250ZXh0VHlwZVxuICApOiBPYnNlcnZhYmxlPFNpdGVDb250ZXh0PGFueT4+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb250ZXh0KGNvbnRleHQpLnBpcGUoXG4gICAgICBtYXAoKGN0eDogc3RyaW5nIHwgdW5kZWZpbmVkKSA9PlxuICAgICAgICBjdHggPyB0aGlzLmdldEluamVjdGVkU2VydmljZShjdHgpIDogdW5kZWZpbmVkXG4gICAgICApLFxuICAgICAgZmlsdGVyKGlzTm90VW5kZWZpbmVkKVxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q29udGV4dChcbiAgICBjb250ZXh0PzogU2l0ZUNvbnRleHRUeXBlXG4gICk6IE9ic2VydmFibGU8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gICAgaWYgKGNvbnRleHQpIHtcbiAgICAgIGlmIChjb250ZXh0ID09PSBTaXRlQ29udGV4dFR5cGUuQ1VSUkVOQ1kpIHtcbiAgICAgICAgcmV0dXJuIG9mKENVUlJFTkNZX0NPTlRFWFRfSUQpO1xuICAgICAgfSBlbHNlIGlmIChjb250ZXh0ID09PSBTaXRlQ29udGV4dFR5cGUuTEFOR1VBR0UpIHtcbiAgICAgICAgcmV0dXJuIG9mKExBTkdVQUdFX0NPTlRFWFRfSUQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG9mKGNvbnRleHQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5jb21wb25lbnREYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21wb25lbnREYXRhLmRhdGEkLnBpcGUoXG4gICAgICAgIG1hcCgoZGF0YSkgPT4gZGF0YS5jb250ZXh0KSxcbiAgICAgICAgbWFwKChjdHgpID0+IHtcbiAgICAgICAgICBzd2l0Y2ggKGN0eCkge1xuICAgICAgICAgICAgY2FzZSAnTEFOR1VBR0UnOlxuICAgICAgICAgICAgICByZXR1cm4gTEFOR1VBR0VfQ09OVEVYVF9JRDtcbiAgICAgICAgICAgIGNhc2UgJ0NVUlJFTkNZJzpcbiAgICAgICAgICAgICAgcmV0dXJuIENVUlJFTkNZX0NPTlRFWFRfSUQ7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gY3R4O1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBvZih1bmRlZmluZWQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldEluamVjdGVkU2VydmljZShjb250ZXh0OiBzdHJpbmcpOiBTaXRlQ29udGV4dDxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5pbmplY3Rvci5nZXQ8U2l0ZUNvbnRleHQ8YW55Pj4oXG4gICAgICB0aGlzLmNvbnRleHRTZXJ2aWNlTWFwW2NvbnRleHRdLFxuICAgICAgdW5kZWZpbmVkXG4gICAgKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRPcHRpb25MYWJlbChpdGVtOiBhbnksIGNvbnRleHQ/OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHN3aXRjaCAoY29udGV4dCkge1xuICAgICAgY2FzZSBMQU5HVUFHRV9DT05URVhUX0lEOlxuICAgICAgICByZXR1cm4gaXRlbS5uYXRpdmVOYW1lO1xuICAgICAgY2FzZSBDVVJSRU5DWV9DT05URVhUX0lEOlxuICAgICAgICByZXR1cm4gaXRlbS5zeW1ib2wgKyAnICcgKyBpdGVtLmlzb2NvZGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gaXRlbS5pc29jb2RlO1xuICAgIH1cbiAgfVxufVxuIl19