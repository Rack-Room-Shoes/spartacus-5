/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { OrderEntriesSource, } from '@spartacus/cart/base/root';
import { ICON_TYPE } from '@spartacus/storefront';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@spartacus/storefront";
import * as i3 from "@spartacus/core";
export class ImportEntriesSummaryComponent {
    constructor() {
        this.iconTypes = ICON_TYPE;
        this.orderEntriesSource = OrderEntriesSource;
        this.warningDetailsOpened = false;
        this.errorDetailsOpened = false;
        this.closeEvent = new EventEmitter();
    }
    close(reason) {
        this.closeEvent.emit(reason);
    }
    toggleWarningList() {
        this.warningDetailsOpened = !this.warningDetailsOpened;
    }
    toggleErrorList() {
        this.errorDetailsOpened = !this.errorDetailsOpened;
    }
}
ImportEntriesSummaryComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ImportEntriesSummaryComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ImportEntriesSummaryComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.3", type: ImportEntriesSummaryComponent, selector: "cx-import-entries-summary", inputs: { type: "type", summary: "summary" }, outputs: { closeEvent: "closeEvent" }, ngImport: i0, template: "<div class=\"cx-import-entries-summary-status\">\n  <p *ngIf=\"!summary.loading; else loading\" [ngSwitch]=\"type\">\n    <ng-container *ngSwitchCase=\"orderEntriesSource.QUICK_ORDER\">\n      {{ 'importEntriesDialog.summary.loaded' | cxTranslate: summary }}\n    </ng-container>\n    <ng-container *ngSwitchDefault>\n      {{ 'importEntriesDialog.summary.loadedToCart' | cxTranslate: summary }}\n    </ng-container>\n  </p>\n  <ng-template #loading>\n    <p>\n      {{ 'importEntriesDialog.summary.loading' | cxTranslate: summary }}\n    </p>\n  </ng-template>\n</div>\n<p\n  *ngIf=\"summary.successesCount > 0\"\n  class=\"cx-import-entries-summary-successes\"\n>\n  <cx-icon class=\"success\" [type]=\"iconTypes.SUCCESS\"></cx-icon>\n  {{ 'importEntriesDialog.summary.successes' | cxTranslate: summary }}\n</p>\n<div\n  *ngIf=\"summary.warningMessages.length > 0\"\n  class=\"cx-import-entries-summary-warnings\"\n>\n  <p>\n    <cx-icon class=\"warning\" [type]=\"iconTypes.ERROR\"></cx-icon>\n    {{\n      'importEntriesDialog.summary.warning'\n        | cxTranslate: { count: summary.warningMessages.length }\n    }}\n    <button class=\"link cx-action-link\" (click)=\"toggleWarningList()\">\n      {{\n        (warningDetailsOpened\n          ? 'importEntriesDialog.summary.hide'\n          : 'importEntriesDialog.summary.show'\n        ) | cxTranslate\n      }}\n    </button>\n  </p>\n  <ul *ngIf=\"warningDetailsOpened\">\n    <li *ngFor=\"let message of summary.warningMessages\">\n      {{\n        'importEntriesDialog.summary.messages.' + message.statusCode\n          | cxTranslate: message\n      }}\n    </li>\n  </ul>\n</div>\n<div\n  *ngIf=\"summary.errorMessages.length > 0\"\n  class=\"cx-import-entries-summary-errors\"\n>\n  <p>\n    <cx-icon class=\"error\" [type]=\"iconTypes.RESET\"></cx-icon>\n    {{\n      'importEntriesDialog.summary.error'\n        | cxTranslate: { count: summary.errorMessages.length }\n    }}\n    <button class=\"link cx-action-link\" (click)=\"toggleErrorList()\">\n      {{\n        (errorDetailsOpened\n          ? 'importEntriesDialog.summary.hide'\n          : 'importEntriesDialog.summary.show'\n        ) | cxTranslate\n      }}\n    </button>\n  </p>\n  <ul *ngIf=\"errorDetailsOpened\">\n    <li *ngFor=\"let message of summary.errorMessages\">\n      {{\n        'importEntriesDialog.summary.messages.' + message.statusCode\n          | cxTranslate: message\n      }}\n    </li>\n  </ul>\n</div>\n<div class=\"cx-import-entries-summary-footer\">\n  <button\n    *ngIf=\"!summary.loading; else info\"\n    (click)=\"close('Close Import Products Dialog')\"\n    class=\"btn btn-action\"\n    type=\"button\"\n  >\n    {{ 'importEntriesDialog.close' | cxTranslate }}\n  </button>\n  <ng-template #info>\n    <p>{{ 'importEntriesDialog.summary.info' | cxTranslate }}</p>\n  </ng-template>\n</div>\n", dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i1.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "component", type: i2.IconComponent, selector: "cx-icon,[cxIcon]", inputs: ["cxIcon", "type"] }, { kind: "pipe", type: i3.TranslatePipe, name: "cxTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ImportEntriesSummaryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cx-import-entries-summary', changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"cx-import-entries-summary-status\">\n  <p *ngIf=\"!summary.loading; else loading\" [ngSwitch]=\"type\">\n    <ng-container *ngSwitchCase=\"orderEntriesSource.QUICK_ORDER\">\n      {{ 'importEntriesDialog.summary.loaded' | cxTranslate: summary }}\n    </ng-container>\n    <ng-container *ngSwitchDefault>\n      {{ 'importEntriesDialog.summary.loadedToCart' | cxTranslate: summary }}\n    </ng-container>\n  </p>\n  <ng-template #loading>\n    <p>\n      {{ 'importEntriesDialog.summary.loading' | cxTranslate: summary }}\n    </p>\n  </ng-template>\n</div>\n<p\n  *ngIf=\"summary.successesCount > 0\"\n  class=\"cx-import-entries-summary-successes\"\n>\n  <cx-icon class=\"success\" [type]=\"iconTypes.SUCCESS\"></cx-icon>\n  {{ 'importEntriesDialog.summary.successes' | cxTranslate: summary }}\n</p>\n<div\n  *ngIf=\"summary.warningMessages.length > 0\"\n  class=\"cx-import-entries-summary-warnings\"\n>\n  <p>\n    <cx-icon class=\"warning\" [type]=\"iconTypes.ERROR\"></cx-icon>\n    {{\n      'importEntriesDialog.summary.warning'\n        | cxTranslate: { count: summary.warningMessages.length }\n    }}\n    <button class=\"link cx-action-link\" (click)=\"toggleWarningList()\">\n      {{\n        (warningDetailsOpened\n          ? 'importEntriesDialog.summary.hide'\n          : 'importEntriesDialog.summary.show'\n        ) | cxTranslate\n      }}\n    </button>\n  </p>\n  <ul *ngIf=\"warningDetailsOpened\">\n    <li *ngFor=\"let message of summary.warningMessages\">\n      {{\n        'importEntriesDialog.summary.messages.' + message.statusCode\n          | cxTranslate: message\n      }}\n    </li>\n  </ul>\n</div>\n<div\n  *ngIf=\"summary.errorMessages.length > 0\"\n  class=\"cx-import-entries-summary-errors\"\n>\n  <p>\n    <cx-icon class=\"error\" [type]=\"iconTypes.RESET\"></cx-icon>\n    {{\n      'importEntriesDialog.summary.error'\n        | cxTranslate: { count: summary.errorMessages.length }\n    }}\n    <button class=\"link cx-action-link\" (click)=\"toggleErrorList()\">\n      {{\n        (errorDetailsOpened\n          ? 'importEntriesDialog.summary.hide'\n          : 'importEntriesDialog.summary.show'\n        ) | cxTranslate\n      }}\n    </button>\n  </p>\n  <ul *ngIf=\"errorDetailsOpened\">\n    <li *ngFor=\"let message of summary.errorMessages\">\n      {{\n        'importEntriesDialog.summary.messages.' + message.statusCode\n          | cxTranslate: message\n      }}\n    </li>\n  </ul>\n</div>\n<div class=\"cx-import-entries-summary-footer\">\n  <button\n    *ngIf=\"!summary.loading; else info\"\n    (click)=\"close('Close Import Products Dialog')\"\n    class=\"btn btn-action\"\n    type=\"button\"\n  >\n    {{ 'importEntriesDialog.close' | cxTranslate }}\n  </button>\n  <ng-template #info>\n    <p>{{ 'importEntriesDialog.summary.info' | cxTranslate }}</p>\n  </ng-template>\n</div>\n" }]
        }], propDecorators: { type: [{
                type: Input
            }], summary: [{
                type: Input
            }], closeEvent: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0LWVudHJpZXMtc3VtbWFyeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9mZWF0dXJlLWxpYnMvY2FydC9pbXBvcnQtZXhwb3J0L2NvbXBvbmVudHMvaW1wb3J0LXRvLWNhcnQvaW1wb3J0LWVudHJpZXMtZGlhbG9nL2ltcG9ydC1lbnRyaWVzLXN1bW1hcnkvaW1wb3J0LWVudHJpZXMtc3VtbWFyeS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9mZWF0dXJlLWxpYnMvY2FydC9pbXBvcnQtZXhwb3J0L2NvbXBvbmVudHMvaW1wb3J0LXRvLWNhcnQvaW1wb3J0LWVudHJpZXMtZGlhbG9nL2ltcG9ydC1lbnRyaWVzLXN1bW1hcnkvaW1wb3J0LWVudHJpZXMtc3VtbWFyeS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLGtCQUFrQixHQUVuQixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7Ozs7QUFPbEQsTUFBTSxPQUFPLDZCQUE2QjtJQUwxQztRQU1FLGNBQVMsR0FBRyxTQUFTLENBQUM7UUFDdEIsdUJBQWtCLEdBQUcsa0JBQWtCLENBQUM7UUFFeEMseUJBQW9CLEdBQVksS0FBSyxDQUFDO1FBQ3RDLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQVNwQyxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztLQWF6QztJQVhDLEtBQUssQ0FBQyxNQUFjO1FBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxpQkFBaUI7UUFDZixJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDekQsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDckQsQ0FBQzs7MEhBMUJVLDZCQUE2Qjs4R0FBN0IsNkJBQTZCLHNKQ3hCMUMsMHlGQTJGQTsyRkRuRWEsNkJBQTZCO2tCQUx6QyxTQUFTOytCQUNFLDJCQUEyQixtQkFFcEIsdUJBQXVCLENBQUMsTUFBTTs4QkFVL0MsSUFBSTtzQkFESCxLQUFLO2dCQUlOLE9BQU87c0JBRE4sS0FBSztnQkFJTixVQUFVO3NCQURULE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyMiBTQVAgU3BhcnRhY3VzIHRlYW0gPHNwYXJ0YWN1cy10ZWFtQHNhcC5jb20+XG4gKlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgT3JkZXJFbnRyaWVzU291cmNlLFxuICBQcm9kdWN0SW1wb3J0U3VtbWFyeSxcbn0gZnJvbSAnQHNwYXJ0YWN1cy9jYXJ0L2Jhc2Uvcm9vdCc7XG5pbXBvcnQgeyBJQ09OX1RZUEUgfSBmcm9tICdAc3BhcnRhY3VzL3N0b3JlZnJvbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjeC1pbXBvcnQtZW50cmllcy1zdW1tYXJ5JyxcbiAgdGVtcGxhdGVVcmw6ICcuL2ltcG9ydC1lbnRyaWVzLXN1bW1hcnkuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgSW1wb3J0RW50cmllc1N1bW1hcnlDb21wb25lbnQge1xuICBpY29uVHlwZXMgPSBJQ09OX1RZUEU7XG4gIG9yZGVyRW50cmllc1NvdXJjZSA9IE9yZGVyRW50cmllc1NvdXJjZTtcblxuICB3YXJuaW5nRGV0YWlsc09wZW5lZDogYm9vbGVhbiA9IGZhbHNlO1xuICBlcnJvckRldGFpbHNPcGVuZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICB0eXBlOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc3VtbWFyeTogUHJvZHVjdEltcG9ydFN1bW1hcnk7XG5cbiAgQE91dHB1dCgpXG4gIGNsb3NlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBjbG9zZShyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuY2xvc2VFdmVudC5lbWl0KHJlYXNvbik7XG4gIH1cblxuICB0b2dnbGVXYXJuaW5nTGlzdCgpOiB2b2lkIHtcbiAgICB0aGlzLndhcm5pbmdEZXRhaWxzT3BlbmVkID0gIXRoaXMud2FybmluZ0RldGFpbHNPcGVuZWQ7XG4gIH1cblxuICB0b2dnbGVFcnJvckxpc3QoKTogdm9pZCB7XG4gICAgdGhpcy5lcnJvckRldGFpbHNPcGVuZWQgPSAhdGhpcy5lcnJvckRldGFpbHNPcGVuZWQ7XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJjeC1pbXBvcnQtZW50cmllcy1zdW1tYXJ5LXN0YXR1c1wiPlxuICA8cCAqbmdJZj1cIiFzdW1tYXJ5LmxvYWRpbmc7IGVsc2UgbG9hZGluZ1wiIFtuZ1N3aXRjaF09XCJ0eXBlXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwib3JkZXJFbnRyaWVzU291cmNlLlFVSUNLX09SREVSXCI+XG4gICAgICB7eyAnaW1wb3J0RW50cmllc0RpYWxvZy5zdW1tYXJ5LmxvYWRlZCcgfCBjeFRyYW5zbGF0ZTogc3VtbWFyeSB9fVxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgKm5nU3dpdGNoRGVmYXVsdD5cbiAgICAgIHt7ICdpbXBvcnRFbnRyaWVzRGlhbG9nLnN1bW1hcnkubG9hZGVkVG9DYXJ0JyB8IGN4VHJhbnNsYXRlOiBzdW1tYXJ5IH19XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvcD5cbiAgPG5nLXRlbXBsYXRlICNsb2FkaW5nPlxuICAgIDxwPlxuICAgICAge3sgJ2ltcG9ydEVudHJpZXNEaWFsb2cuc3VtbWFyeS5sb2FkaW5nJyB8IGN4VHJhbnNsYXRlOiBzdW1tYXJ5IH19XG4gICAgPC9wPlxuICA8L25nLXRlbXBsYXRlPlxuPC9kaXY+XG48cFxuICAqbmdJZj1cInN1bW1hcnkuc3VjY2Vzc2VzQ291bnQgPiAwXCJcbiAgY2xhc3M9XCJjeC1pbXBvcnQtZW50cmllcy1zdW1tYXJ5LXN1Y2Nlc3Nlc1wiXG4+XG4gIDxjeC1pY29uIGNsYXNzPVwic3VjY2Vzc1wiIFt0eXBlXT1cImljb25UeXBlcy5TVUNDRVNTXCI+PC9jeC1pY29uPlxuICB7eyAnaW1wb3J0RW50cmllc0RpYWxvZy5zdW1tYXJ5LnN1Y2Nlc3NlcycgfCBjeFRyYW5zbGF0ZTogc3VtbWFyeSB9fVxuPC9wPlxuPGRpdlxuICAqbmdJZj1cInN1bW1hcnkud2FybmluZ01lc3NhZ2VzLmxlbmd0aCA+IDBcIlxuICBjbGFzcz1cImN4LWltcG9ydC1lbnRyaWVzLXN1bW1hcnktd2FybmluZ3NcIlxuPlxuICA8cD5cbiAgICA8Y3gtaWNvbiBjbGFzcz1cIndhcm5pbmdcIiBbdHlwZV09XCJpY29uVHlwZXMuRVJST1JcIj48L2N4LWljb24+XG4gICAge3tcbiAgICAgICdpbXBvcnRFbnRyaWVzRGlhbG9nLnN1bW1hcnkud2FybmluZydcbiAgICAgICAgfCBjeFRyYW5zbGF0ZTogeyBjb3VudDogc3VtbWFyeS53YXJuaW5nTWVzc2FnZXMubGVuZ3RoIH1cbiAgICB9fVxuICAgIDxidXR0b24gY2xhc3M9XCJsaW5rIGN4LWFjdGlvbi1saW5rXCIgKGNsaWNrKT1cInRvZ2dsZVdhcm5pbmdMaXN0KClcIj5cbiAgICAgIHt7XG4gICAgICAgICh3YXJuaW5nRGV0YWlsc09wZW5lZFxuICAgICAgICAgID8gJ2ltcG9ydEVudHJpZXNEaWFsb2cuc3VtbWFyeS5oaWRlJ1xuICAgICAgICAgIDogJ2ltcG9ydEVudHJpZXNEaWFsb2cuc3VtbWFyeS5zaG93J1xuICAgICAgICApIHwgY3hUcmFuc2xhdGVcbiAgICAgIH19XG4gICAgPC9idXR0b24+XG4gIDwvcD5cbiAgPHVsICpuZ0lmPVwid2FybmluZ0RldGFpbHNPcGVuZWRcIj5cbiAgICA8bGkgKm5nRm9yPVwibGV0IG1lc3NhZ2Ugb2Ygc3VtbWFyeS53YXJuaW5nTWVzc2FnZXNcIj5cbiAgICAgIHt7XG4gICAgICAgICdpbXBvcnRFbnRyaWVzRGlhbG9nLnN1bW1hcnkubWVzc2FnZXMuJyArIG1lc3NhZ2Uuc3RhdHVzQ29kZVxuICAgICAgICAgIHwgY3hUcmFuc2xhdGU6IG1lc3NhZ2VcbiAgICAgIH19XG4gICAgPC9saT5cbiAgPC91bD5cbjwvZGl2PlxuPGRpdlxuICAqbmdJZj1cInN1bW1hcnkuZXJyb3JNZXNzYWdlcy5sZW5ndGggPiAwXCJcbiAgY2xhc3M9XCJjeC1pbXBvcnQtZW50cmllcy1zdW1tYXJ5LWVycm9yc1wiXG4+XG4gIDxwPlxuICAgIDxjeC1pY29uIGNsYXNzPVwiZXJyb3JcIiBbdHlwZV09XCJpY29uVHlwZXMuUkVTRVRcIj48L2N4LWljb24+XG4gICAge3tcbiAgICAgICdpbXBvcnRFbnRyaWVzRGlhbG9nLnN1bW1hcnkuZXJyb3InXG4gICAgICAgIHwgY3hUcmFuc2xhdGU6IHsgY291bnQ6IHN1bW1hcnkuZXJyb3JNZXNzYWdlcy5sZW5ndGggfVxuICAgIH19XG4gICAgPGJ1dHRvbiBjbGFzcz1cImxpbmsgY3gtYWN0aW9uLWxpbmtcIiAoY2xpY2spPVwidG9nZ2xlRXJyb3JMaXN0KClcIj5cbiAgICAgIHt7XG4gICAgICAgIChlcnJvckRldGFpbHNPcGVuZWRcbiAgICAgICAgICA/ICdpbXBvcnRFbnRyaWVzRGlhbG9nLnN1bW1hcnkuaGlkZSdcbiAgICAgICAgICA6ICdpbXBvcnRFbnRyaWVzRGlhbG9nLnN1bW1hcnkuc2hvdydcbiAgICAgICAgKSB8IGN4VHJhbnNsYXRlXG4gICAgICB9fVxuICAgIDwvYnV0dG9uPlxuICA8L3A+XG4gIDx1bCAqbmdJZj1cImVycm9yRGV0YWlsc09wZW5lZFwiPlxuICAgIDxsaSAqbmdGb3I9XCJsZXQgbWVzc2FnZSBvZiBzdW1tYXJ5LmVycm9yTWVzc2FnZXNcIj5cbiAgICAgIHt7XG4gICAgICAgICdpbXBvcnRFbnRyaWVzRGlhbG9nLnN1bW1hcnkubWVzc2FnZXMuJyArIG1lc3NhZ2Uuc3RhdHVzQ29kZVxuICAgICAgICAgIHwgY3hUcmFuc2xhdGU6IG1lc3NhZ2VcbiAgICAgIH19XG4gICAgPC9saT5cbiAgPC91bD5cbjwvZGl2PlxuPGRpdiBjbGFzcz1cImN4LWltcG9ydC1lbnRyaWVzLXN1bW1hcnktZm9vdGVyXCI+XG4gIDxidXR0b25cbiAgICAqbmdJZj1cIiFzdW1tYXJ5LmxvYWRpbmc7IGVsc2UgaW5mb1wiXG4gICAgKGNsaWNrKT1cImNsb3NlKCdDbG9zZSBJbXBvcnQgUHJvZHVjdHMgRGlhbG9nJylcIlxuICAgIGNsYXNzPVwiYnRuIGJ0bi1hY3Rpb25cIlxuICAgIHR5cGU9XCJidXR0b25cIlxuICA+XG4gICAge3sgJ2ltcG9ydEVudHJpZXNEaWFsb2cuY2xvc2UnIHwgY3hUcmFuc2xhdGUgfX1cbiAgPC9idXR0b24+XG4gIDxuZy10ZW1wbGF0ZSAjaW5mbz5cbiAgICA8cD57eyAnaW1wb3J0RW50cmllc0RpYWxvZy5zdW1tYXJ5LmluZm8nIHwgY3hUcmFuc2xhdGUgfX08L3A+XG4gIDwvbmctdGVtcGxhdGU+XG48L2Rpdj5cbiJdfQ==