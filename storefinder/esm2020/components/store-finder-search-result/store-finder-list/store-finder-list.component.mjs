/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { LocationDisplayMode } from './store-finder-list.model';
import * as i0 from "@angular/core";
import * as i1 from "@spartacus/storefinder/core";
import * as i2 from "@angular/common";
import * as i3 from "@spartacus/storefront";
import * as i4 from "../../store-finder-map/store-finder-map.component";
import * as i5 from "../../store-finder-list-item/store-finder-list-item.component";
import * as i6 from "../../store-finder-store-description/store-finder-store-description.component";
import * as i7 from "../../store-finder-pagination-details/store-finder-pagination-details.component";
import * as i8 from "@spartacus/core";
export class StoreFinderListComponent {
    constructor(storeFinderService, document) {
        this.storeFinderService = storeFinderService;
        this.document = document;
        this.iconTypes = ICON_TYPE;
        this.displayModes = LocationDisplayMode;
        this.activeDisplayMode = LocationDisplayMode.LIST_VIEW;
        this.isDetailsModeVisible = false;
    }
    centerStoreOnMapByIndex(index, location) {
        this.showStoreDetails(location);
        this.selectedStoreIndex = index;
        this.selectedStore = location;
        this.storeMap.centerMap(this.storeFinderService.getStoreLatitude(this.locations.stores[index]), this.storeFinderService.getStoreLongitude(this.locations.stores[index]));
    }
    selectStoreItemList(index) {
        this.selectedStoreIndex = index;
        const storeListItem = this.document.getElementById('item-' + index);
        storeListItem.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }
    showStoreDetails(location) {
        this.isDetailsModeVisible = true;
        this.storeDetails = location;
    }
    hideStoreDetails() {
        this.isDetailsModeVisible = false;
        this.selectedStoreIndex = undefined;
        this.selectedStore = undefined;
        this.storeMap.renderMap();
    }
    setDisplayMode(mode) {
        this.activeDisplayMode = mode;
    }
    isDisplayModeActive(mode) {
        return this.activeDisplayMode === mode;
    }
}
StoreFinderListComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StoreFinderListComponent, deps: [{ token: i1.StoreFinderService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
StoreFinderListComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.3", type: StoreFinderListComponent, selector: "cx-store-finder-list", inputs: { locations: "locations", useMylocation: "useMylocation" }, viewQueries: [{ propertyName: "storeMap", first: true, predicate: ["storeMap"], descendants: true }], ngImport: i0, template: "<ng-container *ngIf=\"locations\">\n  <div class=\"container mb-2\" aria-atomic=\"true\" aria-live=\"assertive\">\n    <div class=\"row\" *ngIf=\"locations?.pagination\">\n      <div class=\"col-md-12\">\n        <cx-store-finder-pagination-details\n          [pagination]=\"locations.pagination\"\n        ></cx-store-finder-pagination-details>\n      </div>\n      <div class=\"text-left cx-back-wrapper\">\n        <div class=\"cx-visually-hidden\">\n          {{ storeDetails?.displayName }}\n        </div>\n        <button\n          class=\"btn btn-block btn-action cx-back\"\n          *ngIf=\"isDetailsModeVisible\"\n          (click)=\"hideStoreDetails()\"\n        >\n          <cx-icon [type]=\"iconTypes.CARET_LEFT\"></cx-icon>\n          {{ 'storeFinder.back' | cxTranslate }}\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"locations?.stores\" class=\"row cx-columns\">\n      <div class=\"col-md-4 cx-address-col\">\n        <div class=\"cx-store-details\" *ngIf=\"isDetailsModeVisible\">\n          <cx-store-finder-store-description\n            [location]=\"storeDetails\"\n            [disableMap]=\"true\"\n          ></cx-store-finder-store-description>\n        </div>\n        <ol class=\"cx-list\" *ngIf=\"!isDetailsModeVisible\">\n          <li\n            *ngFor=\"let location of locations?.stores; let i = index\"\n            id=\"{{ 'item-' + i }}\"\n            [ngClass]=\"{\n              'cx-selected-item': selectedStoreIndex === i\n            }\"\n            class=\"cx-list-items\"\n          >\n            <cx-store-finder-list-item\n              [location]=\"location\"\n              [locationIndex]=\"i\"\n              [displayDistance]=\"useMylocation\"\n              [useClickEvent]=\"true\"\n              (storeItemClick)=\"centerStoreOnMapByIndex($event, location)\"\n              [listOrderLabel]=\"\n                i +\n                locations.pagination.currentPage *\n                  locations.pagination.pageSize +\n                1\n              \"\n            ></cx-store-finder-list-item>\n          </li>\n        </ol>\n      </div>\n      <div class=\"col-md-8 cx-map-col\">\n        <cx-store-finder-map\n          #storeMap\n          [locations]=\"locations.stores\"\n          (selectedStoreItem)=\"selectStoreItemList($event)\"\n        ></cx-store-finder-map>\n      </div>\n    </div>\n\n    <!-- mobile tabs for column set only -->\n    <div *ngIf=\"locations?.stores\" class=\"cx-columns-mobile\">\n      <ul class=\"nav cx-nav\" role=\"tablist\">\n        <li\n          class=\"nav-item cx-nav-item\"\n          *ngFor=\"let mode of displayModes | keyvalue\"\n        >\n          <button\n            [id]=\"'tab-' + mode?.value\"\n            role=\"tab\"\n            [ngClass]=\"{\n              'nav-link': true,\n              active: isDisplayModeActive(mode?.value)\n            }\"\n            [attr.aria-controls]=\"'tab-' + mode?.value + '-panel'\"\n            [attr.aria-selected]=\"isDisplayModeActive(mode?.value)\"\n            aria-disabled=\"false\"\n            (click)=\"setDisplayMode(mode?.value)\"\n          >\n            {{ 'storeFinder.' + mode?.value | cxTranslate }}\n          </button>\n        </li>\n      </ul>\n      <div class=\"tab-content\">\n        <div [ngSwitch]=\"activeDisplayMode\">\n          <ng-template [ngSwitchCase]=\"displayModes.LIST_VIEW\">\n            <div\n              id=\"tab-listView-panel\"\n              role=\"tabpanel\"\n              aria-labelledby=\"tab-listView\"\n            >\n              <div class=\"cx-address-col\">\n                <div class=\"cx-store-details\" *ngIf=\"isDetailsModeVisible\">\n                  <cx-store-finder-store-description\n                    [location]=\"storeDetails\"\n                    [disableMap]=\"true\"\n                  ></cx-store-finder-store-description>\n                </div>\n                <ol class=\"cx-list\" *ngIf=\"!isDetailsModeVisible\">\n                  <li\n                    *ngFor=\"let location of locations?.stores; let i = index\"\n                    id=\"{{ 'item-' + i }}\"\n                    [ngClass]=\"{\n                      'cx-selected-item': selectedStoreIndex === i\n                    }\"\n                    class=\"cx-list-items\"\n                  >\n                    <cx-store-finder-list-item\n                      [location]=\"location\"\n                      [locationIndex]=\"i\"\n                      [displayDistance]=\"useMylocation\"\n                      [useClickEvent]=\"true\"\n                      (storeItemClick)=\"\n                        centerStoreOnMapByIndex($event, location)\n                      \"\n                      [listOrderLabel]=\"\n                        i +\n                        locations.pagination.currentPage *\n                          locations.pagination.pageSize +\n                        1\n                      \"\n                    ></cx-store-finder-list-item>\n                  </li>\n                </ol>\n              </div>\n            </div>\n          </ng-template>\n          <ng-template [ngSwitchCase]=\"displayModes.MAP_VIEW\">\n            <div\n              id=\"tab-mapView-panel\"\n              role=\"tabpanel\"\n              aria-labelledby=\"tab-mapView\"\n            >\n              <div class=\"cx-map-col\">\n                <cx-store-finder-map\n                  #storeMap\n                  [locations]=\"\n                    selectedStore ? [selectedStore] : locations.stores\n                  \"\n                  (selectedStoreItem)=\"selectStoreItemList($event)\"\n                ></cx-store-finder-map>\n              </div>\n            </div>\n          </ng-template>\n        </div>\n      </div>\n    </div>\n    <!-- mobile tabs end -->\n\n    <div *ngIf=\"!locations?.stores\" class=\"row\">\n      <div class=\"col-md-12 cx-not-found\">\n        {{ 'storeFinder.noStoreFound' | cxTranslate }}\n      </div>\n    </div>\n  </div>\n</ng-container>\n", dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i2.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "component", type: i3.IconComponent, selector: "cx-icon,[cxIcon]", inputs: ["cxIcon", "type"] }, { kind: "component", type: i4.StoreFinderMapComponent, selector: "cx-store-finder-map", inputs: ["locations"], outputs: ["selectedStoreItem"] }, { kind: "component", type: i5.StoreFinderListItemComponent, selector: "cx-store-finder-list-item", inputs: ["locationIndex", "listOrderLabel", "displayDistance", "useClickEvent"], outputs: ["storeItemClick"] }, { kind: "component", type: i6.StoreFinderStoreDescriptionComponent, selector: "cx-store-finder-store-description", inputs: ["location", "disableMap"] }, { kind: "component", type: i7.StoreFinderPaginationDetailsComponent, selector: "cx-store-finder-pagination-details", inputs: ["pagination"] }, { kind: "pipe", type: i2.KeyValuePipe, name: "keyvalue" }, { kind: "pipe", type: i8.TranslatePipe, name: "cxTranslate" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StoreFinderListComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cx-store-finder-list', template: "<ng-container *ngIf=\"locations\">\n  <div class=\"container mb-2\" aria-atomic=\"true\" aria-live=\"assertive\">\n    <div class=\"row\" *ngIf=\"locations?.pagination\">\n      <div class=\"col-md-12\">\n        <cx-store-finder-pagination-details\n          [pagination]=\"locations.pagination\"\n        ></cx-store-finder-pagination-details>\n      </div>\n      <div class=\"text-left cx-back-wrapper\">\n        <div class=\"cx-visually-hidden\">\n          {{ storeDetails?.displayName }}\n        </div>\n        <button\n          class=\"btn btn-block btn-action cx-back\"\n          *ngIf=\"isDetailsModeVisible\"\n          (click)=\"hideStoreDetails()\"\n        >\n          <cx-icon [type]=\"iconTypes.CARET_LEFT\"></cx-icon>\n          {{ 'storeFinder.back' | cxTranslate }}\n        </button>\n      </div>\n    </div>\n    <div *ngIf=\"locations?.stores\" class=\"row cx-columns\">\n      <div class=\"col-md-4 cx-address-col\">\n        <div class=\"cx-store-details\" *ngIf=\"isDetailsModeVisible\">\n          <cx-store-finder-store-description\n            [location]=\"storeDetails\"\n            [disableMap]=\"true\"\n          ></cx-store-finder-store-description>\n        </div>\n        <ol class=\"cx-list\" *ngIf=\"!isDetailsModeVisible\">\n          <li\n            *ngFor=\"let location of locations?.stores; let i = index\"\n            id=\"{{ 'item-' + i }}\"\n            [ngClass]=\"{\n              'cx-selected-item': selectedStoreIndex === i\n            }\"\n            class=\"cx-list-items\"\n          >\n            <cx-store-finder-list-item\n              [location]=\"location\"\n              [locationIndex]=\"i\"\n              [displayDistance]=\"useMylocation\"\n              [useClickEvent]=\"true\"\n              (storeItemClick)=\"centerStoreOnMapByIndex($event, location)\"\n              [listOrderLabel]=\"\n                i +\n                locations.pagination.currentPage *\n                  locations.pagination.pageSize +\n                1\n              \"\n            ></cx-store-finder-list-item>\n          </li>\n        </ol>\n      </div>\n      <div class=\"col-md-8 cx-map-col\">\n        <cx-store-finder-map\n          #storeMap\n          [locations]=\"locations.stores\"\n          (selectedStoreItem)=\"selectStoreItemList($event)\"\n        ></cx-store-finder-map>\n      </div>\n    </div>\n\n    <!-- mobile tabs for column set only -->\n    <div *ngIf=\"locations?.stores\" class=\"cx-columns-mobile\">\n      <ul class=\"nav cx-nav\" role=\"tablist\">\n        <li\n          class=\"nav-item cx-nav-item\"\n          *ngFor=\"let mode of displayModes | keyvalue\"\n        >\n          <button\n            [id]=\"'tab-' + mode?.value\"\n            role=\"tab\"\n            [ngClass]=\"{\n              'nav-link': true,\n              active: isDisplayModeActive(mode?.value)\n            }\"\n            [attr.aria-controls]=\"'tab-' + mode?.value + '-panel'\"\n            [attr.aria-selected]=\"isDisplayModeActive(mode?.value)\"\n            aria-disabled=\"false\"\n            (click)=\"setDisplayMode(mode?.value)\"\n          >\n            {{ 'storeFinder.' + mode?.value | cxTranslate }}\n          </button>\n        </li>\n      </ul>\n      <div class=\"tab-content\">\n        <div [ngSwitch]=\"activeDisplayMode\">\n          <ng-template [ngSwitchCase]=\"displayModes.LIST_VIEW\">\n            <div\n              id=\"tab-listView-panel\"\n              role=\"tabpanel\"\n              aria-labelledby=\"tab-listView\"\n            >\n              <div class=\"cx-address-col\">\n                <div class=\"cx-store-details\" *ngIf=\"isDetailsModeVisible\">\n                  <cx-store-finder-store-description\n                    [location]=\"storeDetails\"\n                    [disableMap]=\"true\"\n                  ></cx-store-finder-store-description>\n                </div>\n                <ol class=\"cx-list\" *ngIf=\"!isDetailsModeVisible\">\n                  <li\n                    *ngFor=\"let location of locations?.stores; let i = index\"\n                    id=\"{{ 'item-' + i }}\"\n                    [ngClass]=\"{\n                      'cx-selected-item': selectedStoreIndex === i\n                    }\"\n                    class=\"cx-list-items\"\n                  >\n                    <cx-store-finder-list-item\n                      [location]=\"location\"\n                      [locationIndex]=\"i\"\n                      [displayDistance]=\"useMylocation\"\n                      [useClickEvent]=\"true\"\n                      (storeItemClick)=\"\n                        centerStoreOnMapByIndex($event, location)\n                      \"\n                      [listOrderLabel]=\"\n                        i +\n                        locations.pagination.currentPage *\n                          locations.pagination.pageSize +\n                        1\n                      \"\n                    ></cx-store-finder-list-item>\n                  </li>\n                </ol>\n              </div>\n            </div>\n          </ng-template>\n          <ng-template [ngSwitchCase]=\"displayModes.MAP_VIEW\">\n            <div\n              id=\"tab-mapView-panel\"\n              role=\"tabpanel\"\n              aria-labelledby=\"tab-mapView\"\n            >\n              <div class=\"cx-map-col\">\n                <cx-store-finder-map\n                  #storeMap\n                  [locations]=\"\n                    selectedStore ? [selectedStore] : locations.stores\n                  \"\n                  (selectedStoreItem)=\"selectStoreItemList($event)\"\n                ></cx-store-finder-map>\n              </div>\n            </div>\n          </ng-template>\n        </div>\n      </div>\n    </div>\n    <!-- mobile tabs end -->\n\n    <div *ngIf=\"!locations?.stores\" class=\"row\">\n      <div class=\"col-md-12 cx-not-found\">\n        {{ 'storeFinder.noStoreFound' | cxTranslate }}\n      </div>\n    </div>\n  </div>\n</ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: i1.StoreFinderService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { locations: [{
                type: Input
            }], useMylocation: [{
                type: Input
            }], storeMap: [{
                type: ViewChild,
                args: ['storeMap']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmUtZmluZGVyLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL3N0b3JlZmluZGVyL2NvbXBvbmVudHMvc3RvcmUtZmluZGVyLXNlYXJjaC1yZXN1bHQvc3RvcmUtZmluZGVyLWxpc3Qvc3RvcmUtZmluZGVyLWxpc3QuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL3N0b3JlZmluZGVyL2NvbXBvbmVudHMvc3RvcmUtZmluZGVyLXNlYXJjaC1yZXN1bHQvc3RvcmUtZmluZGVyLWxpc3Qvc3RvcmUtZmluZGVyLWxpc3QuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3BFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUVsRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7Ozs7Ozs7OztBQU1oRSxNQUFNLE9BQU8sd0JBQXdCO0lBZ0JuQyxZQUNVLGtCQUFzQyxFQUNwQixRQUFhO1FBRC9CLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFDcEIsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQU56QyxjQUFTLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLGlCQUFZLEdBQUcsbUJBQW1CLENBQUM7UUFDbkMsc0JBQWlCLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDO1FBTWhELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7SUFDcEMsQ0FBQztJQUVELHVCQUF1QixDQUFDLEtBQWEsRUFBRSxRQUF3QjtRQUM3RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztRQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FDckIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ3RFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUN4RSxDQUFDO0lBQ0osQ0FBQztJQUVELG1CQUFtQixDQUFDLEtBQWE7UUFDL0IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztRQUNoQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDcEUsYUFBYSxDQUFDLGNBQWMsQ0FBQztZQUMzQixRQUFRLEVBQUUsUUFBUTtZQUNsQixLQUFLLEVBQUUsUUFBUTtTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsUUFBd0I7UUFDdkMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztJQUMvQixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztRQUNsQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGNBQWMsQ0FBQyxJQUF5QjtRQUN0QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxJQUF5QjtRQUMzQyxPQUFPLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxJQUFJLENBQUM7SUFDekMsQ0FBQzs7cUhBNURVLHdCQUF3QixvREFrQnpCLFFBQVE7eUdBbEJQLHdCQUF3QixzT0NsQnJDLHE1TEFnS0E7MkZEOUlhLHdCQUF3QjtrQkFKcEMsU0FBUzsrQkFDRSxzQkFBc0I7OzBCQXFCN0IsTUFBTTsyQkFBQyxRQUFROzRDQWhCbEIsU0FBUztzQkFEUixLQUFLO2dCQUdOLGFBQWE7c0JBRFosS0FBSztnQkFHTixRQUFRO3NCQURQLFNBQVM7dUJBQUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDIyIFNBUCBTcGFydGFjdXMgdGVhbSA8c3BhcnRhY3VzLXRlYW1Ac2FwLmNvbT5cbiAqXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0LCBJbnB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQb2ludE9mU2VydmljZSB9IGZyb20gJ0BzcGFydGFjdXMvY29yZSc7XG5pbXBvcnQgeyBTdG9yZUZpbmRlck1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3N0b3JlLWZpbmRlci1tYXAvc3RvcmUtZmluZGVyLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSUNPTl9UWVBFIH0gZnJvbSAnQHNwYXJ0YWN1cy9zdG9yZWZyb250JztcbmltcG9ydCB7IFN0b3JlRmluZGVyU2VydmljZSB9IGZyb20gJ0BzcGFydGFjdXMvc3RvcmVmaW5kZXIvY29yZSc7XG5pbXBvcnQgeyBMb2NhdGlvbkRpc3BsYXlNb2RlIH0gZnJvbSAnLi9zdG9yZS1maW5kZXItbGlzdC5tb2RlbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2N4LXN0b3JlLWZpbmRlci1saXN0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3N0b3JlLWZpbmRlci1saXN0LmNvbXBvbmVudC5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgU3RvcmVGaW5kZXJMaXN0Q29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgbG9jYXRpb25zOiBhbnk7XG4gIEBJbnB1dCgpXG4gIHVzZU15bG9jYXRpb246IGJvb2xlYW47XG4gIEBWaWV3Q2hpbGQoJ3N0b3JlTWFwJylcbiAgc3RvcmVNYXA6IFN0b3JlRmluZGVyTWFwQ29tcG9uZW50O1xuXG4gIHNlbGVjdGVkU3RvcmU6IFBvaW50T2ZTZXJ2aWNlO1xuICBzZWxlY3RlZFN0b3JlSW5kZXg6IG51bWJlcjtcbiAgaXNEZXRhaWxzTW9kZVZpc2libGU6IGJvb2xlYW47XG4gIHN0b3JlRGV0YWlsczogUG9pbnRPZlNlcnZpY2U7XG4gIGljb25UeXBlcyA9IElDT05fVFlQRTtcbiAgZGlzcGxheU1vZGVzID0gTG9jYXRpb25EaXNwbGF5TW9kZTtcbiAgYWN0aXZlRGlzcGxheU1vZGUgPSBMb2NhdGlvbkRpc3BsYXlNb2RlLkxJU1RfVklFVztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JlRmluZGVyU2VydmljZTogU3RvcmVGaW5kZXJTZXJ2aWNlLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueVxuICApIHtcbiAgICB0aGlzLmlzRGV0YWlsc01vZGVWaXNpYmxlID0gZmFsc2U7XG4gIH1cblxuICBjZW50ZXJTdG9yZU9uTWFwQnlJbmRleChpbmRleDogbnVtYmVyLCBsb2NhdGlvbjogUG9pbnRPZlNlcnZpY2UpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dTdG9yZURldGFpbHMobG9jYXRpb24pO1xuICAgIHRoaXMuc2VsZWN0ZWRTdG9yZUluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy5zZWxlY3RlZFN0b3JlID0gbG9jYXRpb247XG4gICAgdGhpcy5zdG9yZU1hcC5jZW50ZXJNYXAoXG4gICAgICB0aGlzLnN0b3JlRmluZGVyU2VydmljZS5nZXRTdG9yZUxhdGl0dWRlKHRoaXMubG9jYXRpb25zLnN0b3Jlc1tpbmRleF0pLFxuICAgICAgdGhpcy5zdG9yZUZpbmRlclNlcnZpY2UuZ2V0U3RvcmVMb25naXR1ZGUodGhpcy5sb2NhdGlvbnMuc3RvcmVzW2luZGV4XSlcbiAgICApO1xuICB9XG5cbiAgc2VsZWN0U3RvcmVJdGVtTGlzdChpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3RlZFN0b3JlSW5kZXggPSBpbmRleDtcbiAgICBjb25zdCBzdG9yZUxpc3RJdGVtID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXRlbS0nICsgaW5kZXgpO1xuICAgIHN0b3JlTGlzdEl0ZW0uc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuICAgICAgYmxvY2s6ICdjZW50ZXInLFxuICAgIH0pO1xuICB9XG5cbiAgc2hvd1N0b3JlRGV0YWlscyhsb2NhdGlvbjogUG9pbnRPZlNlcnZpY2UpIHtcbiAgICB0aGlzLmlzRGV0YWlsc01vZGVWaXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLnN0b3JlRGV0YWlscyA9IGxvY2F0aW9uO1xuICB9XG5cbiAgaGlkZVN0b3JlRGV0YWlscygpIHtcbiAgICB0aGlzLmlzRGV0YWlsc01vZGVWaXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy5zZWxlY3RlZFN0b3JlSW5kZXggPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZWxlY3RlZFN0b3JlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc3RvcmVNYXAucmVuZGVyTWFwKCk7XG4gIH1cblxuICBzZXREaXNwbGF5TW9kZShtb2RlOiBMb2NhdGlvbkRpc3BsYXlNb2RlKTogdm9pZCB7XG4gICAgdGhpcy5hY3RpdmVEaXNwbGF5TW9kZSA9IG1vZGU7XG4gIH1cblxuICBpc0Rpc3BsYXlNb2RlQWN0aXZlKG1vZGU6IExvY2F0aW9uRGlzcGxheU1vZGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVEaXNwbGF5TW9kZSA9PT0gbW9kZTtcbiAgfVxufVxuIiwiPG5nLWNvbnRhaW5lciAqbmdJZj1cImxvY2F0aW9uc1wiPlxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIG1iLTJcIiBhcmlhLWF0b21pYz1cInRydWVcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIj5cbiAgICA8ZGl2IGNsYXNzPVwicm93XCIgKm5nSWY9XCJsb2NhdGlvbnM/LnBhZ2luYXRpb25cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgPGN4LXN0b3JlLWZpbmRlci1wYWdpbmF0aW9uLWRldGFpbHNcbiAgICAgICAgICBbcGFnaW5hdGlvbl09XCJsb2NhdGlvbnMucGFnaW5hdGlvblwiXG4gICAgICAgID48L2N4LXN0b3JlLWZpbmRlci1wYWdpbmF0aW9uLWRldGFpbHM+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWxlZnQgY3gtYmFjay13cmFwcGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjeC12aXN1YWxseS1oaWRkZW5cIj5cbiAgICAgICAgICB7eyBzdG9yZURldGFpbHM/LmRpc3BsYXlOYW1lIH19XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJidG4gYnRuLWJsb2NrIGJ0bi1hY3Rpb24gY3gtYmFja1wiXG4gICAgICAgICAgKm5nSWY9XCJpc0RldGFpbHNNb2RlVmlzaWJsZVwiXG4gICAgICAgICAgKGNsaWNrKT1cImhpZGVTdG9yZURldGFpbHMoKVwiXG4gICAgICAgID5cbiAgICAgICAgICA8Y3gtaWNvbiBbdHlwZV09XCJpY29uVHlwZXMuQ0FSRVRfTEVGVFwiPjwvY3gtaWNvbj5cbiAgICAgICAgICB7eyAnc3RvcmVGaW5kZXIuYmFjaycgfCBjeFRyYW5zbGF0ZSB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgKm5nSWY9XCJsb2NhdGlvbnM/LnN0b3Jlc1wiIGNsYXNzPVwicm93IGN4LWNvbHVtbnNcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNCBjeC1hZGRyZXNzLWNvbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY3gtc3RvcmUtZGV0YWlsc1wiICpuZ0lmPVwiaXNEZXRhaWxzTW9kZVZpc2libGVcIj5cbiAgICAgICAgICA8Y3gtc3RvcmUtZmluZGVyLXN0b3JlLWRlc2NyaXB0aW9uXG4gICAgICAgICAgICBbbG9jYXRpb25dPVwic3RvcmVEZXRhaWxzXCJcbiAgICAgICAgICAgIFtkaXNhYmxlTWFwXT1cInRydWVcIlxuICAgICAgICAgID48L2N4LXN0b3JlLWZpbmRlci1zdG9yZS1kZXNjcmlwdGlvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxvbCBjbGFzcz1cImN4LWxpc3RcIiAqbmdJZj1cIiFpc0RldGFpbHNNb2RlVmlzaWJsZVwiPlxuICAgICAgICAgIDxsaVxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGxvY2F0aW9uIG9mIGxvY2F0aW9ucz8uc3RvcmVzOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgICAgIGlkPVwie3sgJ2l0ZW0tJyArIGkgfX1cIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAnY3gtc2VsZWN0ZWQtaXRlbSc6IHNlbGVjdGVkU3RvcmVJbmRleCA9PT0gaVxuICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICBjbGFzcz1cImN4LWxpc3QtaXRlbXNcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxjeC1zdG9yZS1maW5kZXItbGlzdC1pdGVtXG4gICAgICAgICAgICAgIFtsb2NhdGlvbl09XCJsb2NhdGlvblwiXG4gICAgICAgICAgICAgIFtsb2NhdGlvbkluZGV4XT1cImlcIlxuICAgICAgICAgICAgICBbZGlzcGxheURpc3RhbmNlXT1cInVzZU15bG9jYXRpb25cIlxuICAgICAgICAgICAgICBbdXNlQ2xpY2tFdmVudF09XCJ0cnVlXCJcbiAgICAgICAgICAgICAgKHN0b3JlSXRlbUNsaWNrKT1cImNlbnRlclN0b3JlT25NYXBCeUluZGV4KCRldmVudCwgbG9jYXRpb24pXCJcbiAgICAgICAgICAgICAgW2xpc3RPcmRlckxhYmVsXT1cIlxuICAgICAgICAgICAgICAgIGkgK1xuICAgICAgICAgICAgICAgIGxvY2F0aW9ucy5wYWdpbmF0aW9uLmN1cnJlbnRQYWdlICpcbiAgICAgICAgICAgICAgICAgIGxvY2F0aW9ucy5wYWdpbmF0aW9uLnBhZ2VTaXplICtcbiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICA+PC9jeC1zdG9yZS1maW5kZXItbGlzdC1pdGVtPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvb2w+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtOCBjeC1tYXAtY29sXCI+XG4gICAgICAgIDxjeC1zdG9yZS1maW5kZXItbWFwXG4gICAgICAgICAgI3N0b3JlTWFwXG4gICAgICAgICAgW2xvY2F0aW9uc109XCJsb2NhdGlvbnMuc3RvcmVzXCJcbiAgICAgICAgICAoc2VsZWN0ZWRTdG9yZUl0ZW0pPVwic2VsZWN0U3RvcmVJdGVtTGlzdCgkZXZlbnQpXCJcbiAgICAgICAgPjwvY3gtc3RvcmUtZmluZGVyLW1hcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPCEtLSBtb2JpbGUgdGFicyBmb3IgY29sdW1uIHNldCBvbmx5IC0tPlxuICAgIDxkaXYgKm5nSWY9XCJsb2NhdGlvbnM/LnN0b3Jlc1wiIGNsYXNzPVwiY3gtY29sdW1ucy1tb2JpbGVcIj5cbiAgICAgIDx1bCBjbGFzcz1cIm5hdiBjeC1uYXZcIiByb2xlPVwidGFibGlzdFwiPlxuICAgICAgICA8bGlcbiAgICAgICAgICBjbGFzcz1cIm5hdi1pdGVtIGN4LW5hdi1pdGVtXCJcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgbW9kZSBvZiBkaXNwbGF5TW9kZXMgfCBrZXl2YWx1ZVwiXG4gICAgICAgID5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBbaWRdPVwiJ3RhYi0nICsgbW9kZT8udmFsdWVcIlxuICAgICAgICAgICAgcm9sZT1cInRhYlwiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAgICduYXYtbGluayc6IHRydWUsXG4gICAgICAgICAgICAgIGFjdGl2ZTogaXNEaXNwbGF5TW9kZUFjdGl2ZShtb2RlPy52YWx1ZSlcbiAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCIndGFiLScgKyBtb2RlPy52YWx1ZSArICctcGFuZWwnXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwiaXNEaXNwbGF5TW9kZUFjdGl2ZShtb2RlPy52YWx1ZSlcIlxuICAgICAgICAgICAgYXJpYS1kaXNhYmxlZD1cImZhbHNlXCJcbiAgICAgICAgICAgIChjbGljayk9XCJzZXREaXNwbGF5TW9kZShtb2RlPy52YWx1ZSlcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt7ICdzdG9yZUZpbmRlci4nICsgbW9kZT8udmFsdWUgfCBjeFRyYW5zbGF0ZSB9fVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2xpPlxuICAgICAgPC91bD5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudFwiPlxuICAgICAgICA8ZGl2IFtuZ1N3aXRjaF09XCJhY3RpdmVEaXNwbGF5TW9kZVwiPlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdTd2l0Y2hDYXNlXT1cImRpc3BsYXlNb2Rlcy5MSVNUX1ZJRVdcIj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgaWQ9XCJ0YWItbGlzdFZpZXctcGFuZWxcIlxuICAgICAgICAgICAgICByb2xlPVwidGFicGFuZWxcIlxuICAgICAgICAgICAgICBhcmlhLWxhYmVsbGVkYnk9XCJ0YWItbGlzdFZpZXdcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY3gtYWRkcmVzcy1jb2xcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY3gtc3RvcmUtZGV0YWlsc1wiICpuZ0lmPVwiaXNEZXRhaWxzTW9kZVZpc2libGVcIj5cbiAgICAgICAgICAgICAgICAgIDxjeC1zdG9yZS1maW5kZXItc3RvcmUtZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgW2xvY2F0aW9uXT1cInN0b3JlRGV0YWlsc1wiXG4gICAgICAgICAgICAgICAgICAgIFtkaXNhYmxlTWFwXT1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgPjwvY3gtc3RvcmUtZmluZGVyLXN0b3JlLWRlc2NyaXB0aW9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxvbCBjbGFzcz1cImN4LWxpc3RcIiAqbmdJZj1cIiFpc0RldGFpbHNNb2RlVmlzaWJsZVwiPlxuICAgICAgICAgICAgICAgICAgPGxpXG4gICAgICAgICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBsb2NhdGlvbiBvZiBsb2NhdGlvbnM/LnN0b3JlczsgbGV0IGkgPSBpbmRleFwiXG4gICAgICAgICAgICAgICAgICAgIGlkPVwie3sgJ2l0ZW0tJyArIGkgfX1cIlxuICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAgICAgICAgICAgJ2N4LXNlbGVjdGVkLWl0ZW0nOiBzZWxlY3RlZFN0b3JlSW5kZXggPT09IGlcbiAgICAgICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiY3gtbGlzdC1pdGVtc1wiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxjeC1zdG9yZS1maW5kZXItbGlzdC1pdGVtXG4gICAgICAgICAgICAgICAgICAgICAgW2xvY2F0aW9uXT1cImxvY2F0aW9uXCJcbiAgICAgICAgICAgICAgICAgICAgICBbbG9jYXRpb25JbmRleF09XCJpXCJcbiAgICAgICAgICAgICAgICAgICAgICBbZGlzcGxheURpc3RhbmNlXT1cInVzZU15bG9jYXRpb25cIlxuICAgICAgICAgICAgICAgICAgICAgIFt1c2VDbGlja0V2ZW50XT1cInRydWVcIlxuICAgICAgICAgICAgICAgICAgICAgIChzdG9yZUl0ZW1DbGljayk9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbnRlclN0b3JlT25NYXBCeUluZGV4KCRldmVudCwgbG9jYXRpb24pXG4gICAgICAgICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICAgICAgICBbbGlzdE9yZGVyTGFiZWxdPVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9ucy5wYWdpbmF0aW9uLmN1cnJlbnRQYWdlICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25zLnBhZ2luYXRpb24ucGFnZVNpemUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgICAgID48L2N4LXN0b3JlLWZpbmRlci1saXN0LWl0ZW0+XG4gICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvb2w+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nU3dpdGNoQ2FzZV09XCJkaXNwbGF5TW9kZXMuTUFQX1ZJRVdcIj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgaWQ9XCJ0YWItbWFwVmlldy1wYW5lbFwiXG4gICAgICAgICAgICAgIHJvbGU9XCJ0YWJwYW5lbFwiXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWxsZWRieT1cInRhYi1tYXBWaWV3XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImN4LW1hcC1jb2xcIj5cbiAgICAgICAgICAgICAgICA8Y3gtc3RvcmUtZmluZGVyLW1hcFxuICAgICAgICAgICAgICAgICAgI3N0b3JlTWFwXG4gICAgICAgICAgICAgICAgICBbbG9jYXRpb25zXT1cIlxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFN0b3JlID8gW3NlbGVjdGVkU3RvcmVdIDogbG9jYXRpb25zLnN0b3Jlc1xuICAgICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICAgIChzZWxlY3RlZFN0b3JlSXRlbSk9XCJzZWxlY3RTdG9yZUl0ZW1MaXN0KCRldmVudClcIlxuICAgICAgICAgICAgICAgID48L2N4LXN0b3JlLWZpbmRlci1tYXA+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8IS0tIG1vYmlsZSB0YWJzIGVuZCAtLT5cblxuICAgIDxkaXYgKm5nSWY9XCIhbG9jYXRpb25zPy5zdG9yZXNcIiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMiBjeC1ub3QtZm91bmRcIj5cbiAgICAgICAge3sgJ3N0b3JlRmluZGVyLm5vU3RvcmVGb3VuZCcgfCBjeFRyYW5zbGF0ZSB9fVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uZy1jb250YWluZXI+XG4iXX0=