/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ConfiguratorAttributeBaseComponent } from '../base/configurator-attribute-base.component';
import * as i0 from "@angular/core";
import * as i1 from "@spartacus/storefront";
import * as i2 from "@angular/forms";
import * as i3 from "@spartacus/core";
import * as i4 from "../../../price/configurator-price.component";
export class ConfiguratorAttributeCheckBoxComponent extends ConfiguratorAttributeBaseComponent {
    constructor() {
        super(...arguments);
        this.selectionChange = new EventEmitter();
        this.attributeCheckBoxForm = new UntypedFormControl('');
    }
    ngOnInit() {
        this.attributeCheckBoxForm.setValue(this.attribute.selectedSingleValue);
    }
    /**
     * Fired when a check box has been selected i.e. when a value has been set
     */
    onSelect() {
        const selectedValues = this.assembleSingleValue();
        const event = {
            ownerKey: this.ownerKey,
            changedAttribute: {
                ...this.attribute,
                values: selectedValues,
            },
        };
        this.selectionChange.emit(event);
    }
    assembleSingleValue() {
        const localAssembledValues = [];
        const value = this.attribute.values ? this.attribute.values[0] : undefined;
        //we can assume that for this component, value is always present
        if (value) {
            const localAttributeValue = {
                valueCode: value.valueCode,
            };
            localAttributeValue.name = value.name;
            localAttributeValue.selected = this.attributeCheckBoxForm.value;
            localAssembledValues.push(localAttributeValue);
        }
        return localAssembledValues;
    }
    /**
     * Extract corresponding value price formula parameters.
     * For the multi-selection attribute types the complete price formula should be displayed at the value level.
     *
     * @param {Configurator.Value} value - Configurator value
     * @return {ConfiguratorPriceComponentOptions} - New price formula
     */
    extractValuePriceFormulaParameters(value) {
        return {
            quantity: value.quantity,
            price: value.valuePrice,
            priceTotal: value.valuePriceTotal,
            isLightedUp: value.selected,
        };
    }
}
ConfiguratorAttributeCheckBoxComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfiguratorAttributeCheckBoxComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
ConfiguratorAttributeCheckBoxComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.3", type: ConfiguratorAttributeCheckBoxComponent, selector: "cx-configurator-attribute-checkbox", inputs: { attribute: "attribute", group: "group", ownerKey: "ownerKey" }, outputs: { selectionChange: "selectionChange" }, usesInheritance: true, ngImport: i0, template: "<ng-container *cxFeatureLevel=\"'!4.1'\">\n  <div id=\"{{ createAttributeIdForConfigurator(attribute) }}\">\n    <div class=\"form-check\">\n      <input\n        id=\"{{\n          createAttributeValueIdForConfigurator(\n            attribute,\n            attribute?.values[0].valueCode\n          )\n        }}\"\n        type=\"checkbox\"\n        class=\"form-check-input\"\n        [value]=\"attribute?.values[0].valueCode\"\n        [cxFocus]=\"{ key: attribute.name + '-' + attribute?.values[0].name }\"\n        (change)=\"onSelect()\"\n        [formControl]=\"attributeCheckBoxForm\"\n        name=\"{{ createAttributeIdForConfigurator(attribute) }}\"\n        [attr.aria-label]=\"\n          'configurator.a11y.valueOfAttributeFull'\n            | cxTranslate\n              : {\n                  value: attribute?.values[0].valueDisplay,\n                  attribute: attribute.label\n                }\n        \"\n        [attr.aria-describedby]=\"createAttributeUiKey('label', attribute.name)\"\n      />\n      <label\n        id=\"{{\n          createValueUiKey(\n            'label',\n            attribute.name,\n            attribute?.values[0].valueCode\n          )\n        }}\"\n        for=\"{{\n          createAttributeValueIdForConfigurator(\n            attribute,\n            attribute?.values[0].valueCode\n          )\n        }}\"\n        aria-hidden=\"true\"\n        class=\"form-check-label\"\n        >{{ attribute?.values[0].valueDisplay }}</label\n      >\n    </div>\n  </div>\n</ng-container>\n\n<ng-container *cxFeatureLevel=\"'4.1'\">\n  <fieldset>\n    <legend style=\"display: none\">{{ attribute.label }}</legend>\n    <div id=\"{{ createAttributeIdForConfigurator(attribute) }}\">\n      <div class=\"form-check\">\n        <div class=\"cx-value-label-pair\">\n          <input\n            id=\"{{\n              createAttributeValueIdForConfigurator(\n                attribute,\n                attribute?.values[0].valueCode\n              )\n            }}\"\n            type=\"checkbox\"\n            class=\"form-check-input\"\n            [value]=\"attribute?.values[0].valueCode\"\n            [cxFocus]=\"{\n              key: attribute.name + '-' + attribute?.values[0].name\n            }\"\n            (change)=\"onSelect()\"\n            [formControl]=\"attributeCheckBoxForm\"\n            name=\"{{ createAttributeIdForConfigurator(attribute) }}\"\n            [attr.aria-label]=\"\n              attribute?.values[0].valuePrice &&\n              attribute?.values[0].valuePrice?.value !== 0\n                ? ('configurator.a11y.valueOfAttributeFullWithPrice'\n                  | cxTranslate\n                    : {\n                        value: attribute?.values[0].valueDisplay,\n                        attribute: attribute.label,\n                        price: attribute?.values[0].valuePrice.formattedValue\n                      })\n                : ('configurator.a11y.valueOfAttributeFull'\n                  | cxTranslate\n                    : {\n                        value: attribute?.values[0].valueDisplay,\n                        attribute: attribute.label\n                      })\n            \"\n            [attr.aria-describedby]=\"\n              createAttributeUiKey('label', attribute.name) +\n              ' ' +\n              createAttributeUiKey('attribute-msg', attribute.name)\n            \"\n          />\n          <label\n            id=\"{{\n              createValueUiKey(\n                'label',\n                attribute.name,\n                attribute?.values[0].valueCode\n              )\n            }}\"\n            for=\"{{\n              createAttributeValueIdForConfigurator(\n                attribute,\n                attribute?.values[0].valueCode\n              )\n            }}\"\n            aria-hidden=\"true\"\n            class=\"form-check-label\"\n            >{{ attribute?.values[0].valueDisplay }}</label\n          >\n        </div>\n        <div class=\"cx-value-price\">\n          <cx-configurator-price\n            [formula]=\"extractValuePriceFormulaParameters(attribute?.values[0])\"\n          ></cx-configurator-price>\n        </div>\n      </div>\n    </div>\n  </fieldset>\n</ng-container>\n", dependencies: [{ kind: "directive", type: i1.FocusDirective, selector: "[cxFocus]", inputs: ["cxFocus"] }, { kind: "directive", type: i2.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "directive", type: i3.FeatureLevelDirective, selector: "[cxFeatureLevel]", inputs: ["cxFeatureLevel"] }, { kind: "component", type: i4.ConfiguratorPriceComponent, selector: "cx-configurator-price", inputs: ["formula"] }, { kind: "pipe", type: i3.TranslatePipe, name: "cxTranslate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfiguratorAttributeCheckBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cx-configurator-attribute-checkbox', changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-container *cxFeatureLevel=\"'!4.1'\">\n  <div id=\"{{ createAttributeIdForConfigurator(attribute) }}\">\n    <div class=\"form-check\">\n      <input\n        id=\"{{\n          createAttributeValueIdForConfigurator(\n            attribute,\n            attribute?.values[0].valueCode\n          )\n        }}\"\n        type=\"checkbox\"\n        class=\"form-check-input\"\n        [value]=\"attribute?.values[0].valueCode\"\n        [cxFocus]=\"{ key: attribute.name + '-' + attribute?.values[0].name }\"\n        (change)=\"onSelect()\"\n        [formControl]=\"attributeCheckBoxForm\"\n        name=\"{{ createAttributeIdForConfigurator(attribute) }}\"\n        [attr.aria-label]=\"\n          'configurator.a11y.valueOfAttributeFull'\n            | cxTranslate\n              : {\n                  value: attribute?.values[0].valueDisplay,\n                  attribute: attribute.label\n                }\n        \"\n        [attr.aria-describedby]=\"createAttributeUiKey('label', attribute.name)\"\n      />\n      <label\n        id=\"{{\n          createValueUiKey(\n            'label',\n            attribute.name,\n            attribute?.values[0].valueCode\n          )\n        }}\"\n        for=\"{{\n          createAttributeValueIdForConfigurator(\n            attribute,\n            attribute?.values[0].valueCode\n          )\n        }}\"\n        aria-hidden=\"true\"\n        class=\"form-check-label\"\n        >{{ attribute?.values[0].valueDisplay }}</label\n      >\n    </div>\n  </div>\n</ng-container>\n\n<ng-container *cxFeatureLevel=\"'4.1'\">\n  <fieldset>\n    <legend style=\"display: none\">{{ attribute.label }}</legend>\n    <div id=\"{{ createAttributeIdForConfigurator(attribute) }}\">\n      <div class=\"form-check\">\n        <div class=\"cx-value-label-pair\">\n          <input\n            id=\"{{\n              createAttributeValueIdForConfigurator(\n                attribute,\n                attribute?.values[0].valueCode\n              )\n            }}\"\n            type=\"checkbox\"\n            class=\"form-check-input\"\n            [value]=\"attribute?.values[0].valueCode\"\n            [cxFocus]=\"{\n              key: attribute.name + '-' + attribute?.values[0].name\n            }\"\n            (change)=\"onSelect()\"\n            [formControl]=\"attributeCheckBoxForm\"\n            name=\"{{ createAttributeIdForConfigurator(attribute) }}\"\n            [attr.aria-label]=\"\n              attribute?.values[0].valuePrice &&\n              attribute?.values[0].valuePrice?.value !== 0\n                ? ('configurator.a11y.valueOfAttributeFullWithPrice'\n                  | cxTranslate\n                    : {\n                        value: attribute?.values[0].valueDisplay,\n                        attribute: attribute.label,\n                        price: attribute?.values[0].valuePrice.formattedValue\n                      })\n                : ('configurator.a11y.valueOfAttributeFull'\n                  | cxTranslate\n                    : {\n                        value: attribute?.values[0].valueDisplay,\n                        attribute: attribute.label\n                      })\n            \"\n            [attr.aria-describedby]=\"\n              createAttributeUiKey('label', attribute.name) +\n              ' ' +\n              createAttributeUiKey('attribute-msg', attribute.name)\n            \"\n          />\n          <label\n            id=\"{{\n              createValueUiKey(\n                'label',\n                attribute.name,\n                attribute?.values[0].valueCode\n              )\n            }}\"\n            for=\"{{\n              createAttributeValueIdForConfigurator(\n                attribute,\n                attribute?.values[0].valueCode\n              )\n            }}\"\n            aria-hidden=\"true\"\n            class=\"form-check-label\"\n            >{{ attribute?.values[0].valueDisplay }}</label\n          >\n        </div>\n        <div class=\"cx-value-price\">\n          <cx-configurator-price\n            [formula]=\"extractValuePriceFormulaParameters(attribute?.values[0])\"\n          ></cx-configurator-price>\n        </div>\n      </div>\n    </div>\n  </fieldset>\n</ng-container>\n" }]
        }], propDecorators: { attribute: [{
                type: Input
            }], group: [{
                type: Input
            }], ownerKey: [{
                type: Input
            }], selectionChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJhdG9yLWF0dHJpYnV0ZS1jaGVja2JveC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9mZWF0dXJlLWxpYnMvcHJvZHVjdC1jb25maWd1cmF0b3IvcnVsZWJhc2VkL2NvbXBvbmVudHMvYXR0cmlidXRlL3R5cGVzL2NoZWNrYm94L2NvbmZpZ3VyYXRvci1hdHRyaWJ1dGUtY2hlY2tib3guY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vZmVhdHVyZS1saWJzL3Byb2R1Y3QtY29uZmlndXJhdG9yL3J1bGViYXNlZC9jb21wb25lbnRzL2F0dHJpYnV0ZS90eXBlcy9jaGVja2JveC9jb25maWd1cmF0b3ItYXR0cmlidXRlLWNoZWNrYm94LmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFFSCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUlwRCxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQzs7Ozs7O0FBT25HLE1BQU0sT0FBTyxzQ0FDWCxTQUFRLGtDQUFrQztJQU41Qzs7UUFZWSxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUF5QixDQUFDO1FBRXRFLDBCQUFxQixHQUFHLElBQUksa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7S0F3RHBEO0lBdERDLFFBQVE7UUFDTixJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxRQUFRO1FBQ04sTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFbEQsTUFBTSxLQUFLLEdBQTBCO1lBQ25DLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixnQkFBZ0IsRUFBRTtnQkFDaEIsR0FBRyxJQUFJLENBQUMsU0FBUztnQkFDakIsTUFBTSxFQUFFLGNBQWM7YUFDdkI7U0FDRixDQUFDO1FBQ0YsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVTLG1CQUFtQjtRQUMzQixNQUFNLG9CQUFvQixHQUF5QixFQUFFLENBQUM7UUFDdEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDM0UsZ0VBQWdFO1FBQ2hFLElBQUksS0FBSyxFQUFFO1lBQ1QsTUFBTSxtQkFBbUIsR0FBdUI7Z0JBQzlDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUzthQUMzQixDQUFDO1lBRUYsbUJBQW1CLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDdEMsbUJBQW1CLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUM7WUFDaEUsb0JBQW9CLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDaEQ7UUFFRCxPQUFPLG9CQUFvQixDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxrQ0FBa0MsQ0FDaEMsS0FBeUI7UUFFekIsT0FBTztZQUNMLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixLQUFLLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDdkIsVUFBVSxFQUFFLEtBQUssQ0FBQyxlQUFlO1lBQ2pDLFdBQVcsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUM1QixDQUFDO0lBQ0osQ0FBQzs7bUlBaEVVLHNDQUFzQzt1SEFBdEMsc0NBQXNDLDROQ3pCbkQsNnBJQTBIQTsyRkRqR2Esc0NBQXNDO2tCQUxsRCxTQUFTOytCQUNFLG9DQUFvQyxtQkFFN0IsdUJBQXVCLENBQUMsTUFBTTs4QkFNdEMsU0FBUztzQkFBakIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDSSxlQUFlO3NCQUF4QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFNQRFgtRmlsZUNvcHlyaWdodFRleHQ6IDIwMjIgU0FQIFNwYXJ0YWN1cyB0ZWFtIDxzcGFydGFjdXMtdGVhbUBzYXAuY29tPlxuICpcbiAqIFNQRFgtTGljZW5zZS1JZGVudGlmaWVyOiBBcGFjaGUtMi4wXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVW50eXBlZEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQ29uZmlndXJhdG9yIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29yZS9tb2RlbC9jb25maWd1cmF0b3IubW9kZWwnO1xuaW1wb3J0IHsgQ29uZmlnRm9ybVVwZGF0ZUV2ZW50IH0gZnJvbSAnLi4vLi4vLi4vZm9ybS9jb25maWd1cmF0b3ItZm9ybS5ldmVudCc7XG5pbXBvcnQgeyBDb25maWd1cmF0b3JQcmljZUNvbXBvbmVudE9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9wcmljZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0b3JBdHRyaWJ1dGVCYXNlQ29tcG9uZW50IH0gZnJvbSAnLi4vYmFzZS9jb25maWd1cmF0b3ItYXR0cmlidXRlLWJhc2UuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY3gtY29uZmlndXJhdG9yLWF0dHJpYnV0ZS1jaGVja2JveCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb25maWd1cmF0b3ItYXR0cmlidXRlLWNoZWNrYm94LmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRvckF0dHJpYnV0ZUNoZWNrQm94Q29tcG9uZW50XG4gIGV4dGVuZHMgQ29uZmlndXJhdG9yQXR0cmlidXRlQmFzZUNvbXBvbmVudFxuICBpbXBsZW1lbnRzIE9uSW5pdFxue1xuICBASW5wdXQoKSBhdHRyaWJ1dGU6IENvbmZpZ3VyYXRvci5BdHRyaWJ1dGU7XG4gIEBJbnB1dCgpIGdyb3VwOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG93bmVyS2V5OiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBzZWxlY3Rpb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENvbmZpZ0Zvcm1VcGRhdGVFdmVudD4oKTtcblxuICBhdHRyaWJ1dGVDaGVja0JveEZvcm0gPSBuZXcgVW50eXBlZEZvcm1Db250cm9sKCcnKTtcblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmF0dHJpYnV0ZUNoZWNrQm94Rm9ybS5zZXRWYWx1ZSh0aGlzLmF0dHJpYnV0ZS5zZWxlY3RlZFNpbmdsZVZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlZCB3aGVuIGEgY2hlY2sgYm94IGhhcyBiZWVuIHNlbGVjdGVkIGkuZS4gd2hlbiBhIHZhbHVlIGhhcyBiZWVuIHNldFxuICAgKi9cbiAgb25TZWxlY3QoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZWN0ZWRWYWx1ZXMgPSB0aGlzLmFzc2VtYmxlU2luZ2xlVmFsdWUoKTtcblxuICAgIGNvbnN0IGV2ZW50OiBDb25maWdGb3JtVXBkYXRlRXZlbnQgPSB7XG4gICAgICBvd25lcktleTogdGhpcy5vd25lcktleSxcbiAgICAgIGNoYW5nZWRBdHRyaWJ1dGU6IHtcbiAgICAgICAgLi4udGhpcy5hdHRyaWJ1dGUsXG4gICAgICAgIHZhbHVlczogc2VsZWN0ZWRWYWx1ZXMsXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdChldmVudCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXNzZW1ibGVTaW5nbGVWYWx1ZSgpOiBDb25maWd1cmF0b3IuVmFsdWVbXSB7XG4gICAgY29uc3QgbG9jYWxBc3NlbWJsZWRWYWx1ZXM6IENvbmZpZ3VyYXRvci5WYWx1ZVtdID0gW107XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmF0dHJpYnV0ZS52YWx1ZXMgPyB0aGlzLmF0dHJpYnV0ZS52YWx1ZXNbMF0gOiB1bmRlZmluZWQ7XG4gICAgLy93ZSBjYW4gYXNzdW1lIHRoYXQgZm9yIHRoaXMgY29tcG9uZW50LCB2YWx1ZSBpcyBhbHdheXMgcHJlc2VudFxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgY29uc3QgbG9jYWxBdHRyaWJ1dGVWYWx1ZTogQ29uZmlndXJhdG9yLlZhbHVlID0ge1xuICAgICAgICB2YWx1ZUNvZGU6IHZhbHVlLnZhbHVlQ29kZSxcbiAgICAgIH07XG5cbiAgICAgIGxvY2FsQXR0cmlidXRlVmFsdWUubmFtZSA9IHZhbHVlLm5hbWU7XG4gICAgICBsb2NhbEF0dHJpYnV0ZVZhbHVlLnNlbGVjdGVkID0gdGhpcy5hdHRyaWJ1dGVDaGVja0JveEZvcm0udmFsdWU7XG4gICAgICBsb2NhbEFzc2VtYmxlZFZhbHVlcy5wdXNoKGxvY2FsQXR0cmlidXRlVmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBsb2NhbEFzc2VtYmxlZFZhbHVlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IGNvcnJlc3BvbmRpbmcgdmFsdWUgcHJpY2UgZm9ybXVsYSBwYXJhbWV0ZXJzLlxuICAgKiBGb3IgdGhlIG11bHRpLXNlbGVjdGlvbiBhdHRyaWJ1dGUgdHlwZXMgdGhlIGNvbXBsZXRlIHByaWNlIGZvcm11bGEgc2hvdWxkIGJlIGRpc3BsYXllZCBhdCB0aGUgdmFsdWUgbGV2ZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29uZmlndXJhdG9yLlZhbHVlfSB2YWx1ZSAtIENvbmZpZ3VyYXRvciB2YWx1ZVxuICAgKiBAcmV0dXJuIHtDb25maWd1cmF0b3JQcmljZUNvbXBvbmVudE9wdGlvbnN9IC0gTmV3IHByaWNlIGZvcm11bGFcbiAgICovXG4gIGV4dHJhY3RWYWx1ZVByaWNlRm9ybXVsYVBhcmFtZXRlcnMoXG4gICAgdmFsdWU6IENvbmZpZ3VyYXRvci5WYWx1ZVxuICApOiBDb25maWd1cmF0b3JQcmljZUNvbXBvbmVudE9wdGlvbnMgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB7XG4gICAgICBxdWFudGl0eTogdmFsdWUucXVhbnRpdHksXG4gICAgICBwcmljZTogdmFsdWUudmFsdWVQcmljZSxcbiAgICAgIHByaWNlVG90YWw6IHZhbHVlLnZhbHVlUHJpY2VUb3RhbCxcbiAgICAgIGlzTGlnaHRlZFVwOiB2YWx1ZS5zZWxlY3RlZCxcbiAgICB9O1xuICB9XG59XG4iLCI8bmctY29udGFpbmVyICpjeEZlYXR1cmVMZXZlbD1cIichNC4xJ1wiPlxuICA8ZGl2IGlkPVwie3sgY3JlYXRlQXR0cmlidXRlSWRGb3JDb25maWd1cmF0b3IoYXR0cmlidXRlKSB9fVwiPlxuICAgIDxkaXYgY2xhc3M9XCJmb3JtLWNoZWNrXCI+XG4gICAgICA8aW5wdXRcbiAgICAgICAgaWQ9XCJ7e1xuICAgICAgICAgIGNyZWF0ZUF0dHJpYnV0ZVZhbHVlSWRGb3JDb25maWd1cmF0b3IoXG4gICAgICAgICAgICBhdHRyaWJ1dGUsXG4gICAgICAgICAgICBhdHRyaWJ1dGU/LnZhbHVlc1swXS52YWx1ZUNvZGVcbiAgICAgICAgICApXG4gICAgICAgIH19XCJcbiAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgY2xhc3M9XCJmb3JtLWNoZWNrLWlucHV0XCJcbiAgICAgICAgW3ZhbHVlXT1cImF0dHJpYnV0ZT8udmFsdWVzWzBdLnZhbHVlQ29kZVwiXG4gICAgICAgIFtjeEZvY3VzXT1cInsga2V5OiBhdHRyaWJ1dGUubmFtZSArICctJyArIGF0dHJpYnV0ZT8udmFsdWVzWzBdLm5hbWUgfVwiXG4gICAgICAgIChjaGFuZ2UpPVwib25TZWxlY3QoKVwiXG4gICAgICAgIFtmb3JtQ29udHJvbF09XCJhdHRyaWJ1dGVDaGVja0JveEZvcm1cIlxuICAgICAgICBuYW1lPVwie3sgY3JlYXRlQXR0cmlidXRlSWRGb3JDb25maWd1cmF0b3IoYXR0cmlidXRlKSB9fVwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiXG4gICAgICAgICAgJ2NvbmZpZ3VyYXRvci5hMTF5LnZhbHVlT2ZBdHRyaWJ1dGVGdWxsJ1xuICAgICAgICAgICAgfCBjeFRyYW5zbGF0ZVxuICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyaWJ1dGU/LnZhbHVlc1swXS52YWx1ZURpc3BsYXksXG4gICAgICAgICAgICAgICAgICBhdHRyaWJ1dGU6IGF0dHJpYnV0ZS5sYWJlbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXCJcbiAgICAgICAgW2F0dHIuYXJpYS1kZXNjcmliZWRieV09XCJjcmVhdGVBdHRyaWJ1dGVVaUtleSgnbGFiZWwnLCBhdHRyaWJ1dGUubmFtZSlcIlxuICAgICAgLz5cbiAgICAgIDxsYWJlbFxuICAgICAgICBpZD1cInt7XG4gICAgICAgICAgY3JlYXRlVmFsdWVVaUtleShcbiAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICBhdHRyaWJ1dGUubmFtZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZT8udmFsdWVzWzBdLnZhbHVlQ29kZVxuICAgICAgICAgIClcbiAgICAgICAgfX1cIlxuICAgICAgICBmb3I9XCJ7e1xuICAgICAgICAgIGNyZWF0ZUF0dHJpYnV0ZVZhbHVlSWRGb3JDb25maWd1cmF0b3IoXG4gICAgICAgICAgICBhdHRyaWJ1dGUsXG4gICAgICAgICAgICBhdHRyaWJ1dGU/LnZhbHVlc1swXS52YWx1ZUNvZGVcbiAgICAgICAgICApXG4gICAgICAgIH19XCJcbiAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgY2xhc3M9XCJmb3JtLWNoZWNrLWxhYmVsXCJcbiAgICAgICAgPnt7IGF0dHJpYnV0ZT8udmFsdWVzWzBdLnZhbHVlRGlzcGxheSB9fTwvbGFiZWxcbiAgICAgID5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L25nLWNvbnRhaW5lcj5cblxuPG5nLWNvbnRhaW5lciAqY3hGZWF0dXJlTGV2ZWw9XCInNC4xJ1wiPlxuICA8ZmllbGRzZXQ+XG4gICAgPGxlZ2VuZCBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj57eyBhdHRyaWJ1dGUubGFiZWwgfX08L2xlZ2VuZD5cbiAgICA8ZGl2IGlkPVwie3sgY3JlYXRlQXR0cmlidXRlSWRGb3JDb25maWd1cmF0b3IoYXR0cmlidXRlKSB9fVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImZvcm0tY2hlY2tcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImN4LXZhbHVlLWxhYmVsLXBhaXJcIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGlkPVwie3tcbiAgICAgICAgICAgICAgY3JlYXRlQXR0cmlidXRlVmFsdWVJZEZvckNvbmZpZ3VyYXRvcihcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlPy52YWx1ZXNbMF0udmFsdWVDb2RlXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH19XCJcbiAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICBjbGFzcz1cImZvcm0tY2hlY2staW5wdXRcIlxuICAgICAgICAgICAgW3ZhbHVlXT1cImF0dHJpYnV0ZT8udmFsdWVzWzBdLnZhbHVlQ29kZVwiXG4gICAgICAgICAgICBbY3hGb2N1c109XCJ7XG4gICAgICAgICAgICAgIGtleTogYXR0cmlidXRlLm5hbWUgKyAnLScgKyBhdHRyaWJ1dGU/LnZhbHVlc1swXS5uYW1lXG4gICAgICAgICAgICB9XCJcbiAgICAgICAgICAgIChjaGFuZ2UpPVwib25TZWxlY3QoKVwiXG4gICAgICAgICAgICBbZm9ybUNvbnRyb2xdPVwiYXR0cmlidXRlQ2hlY2tCb3hGb3JtXCJcbiAgICAgICAgICAgIG5hbWU9XCJ7eyBjcmVhdGVBdHRyaWJ1dGVJZEZvckNvbmZpZ3VyYXRvcihhdHRyaWJ1dGUpIH19XCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZT8udmFsdWVzWzBdLnZhbHVlUHJpY2UgJiZcbiAgICAgICAgICAgICAgYXR0cmlidXRlPy52YWx1ZXNbMF0udmFsdWVQcmljZT8udmFsdWUgIT09IDBcbiAgICAgICAgICAgICAgICA/ICgnY29uZmlndXJhdG9yLmExMXkudmFsdWVPZkF0dHJpYnV0ZUZ1bGxXaXRoUHJpY2UnXG4gICAgICAgICAgICAgICAgICB8IGN4VHJhbnNsYXRlXG4gICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHJpYnV0ZT8udmFsdWVzWzBdLnZhbHVlRGlzcGxheSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZTogYXR0cmlidXRlLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGF0dHJpYnV0ZT8udmFsdWVzWzBdLnZhbHVlUHJpY2UuZm9ybWF0dGVkVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIDogKCdjb25maWd1cmF0b3IuYTExeS52YWx1ZU9mQXR0cmlidXRlRnVsbCdcbiAgICAgICAgICAgICAgICAgIHwgY3hUcmFuc2xhdGVcbiAgICAgICAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0cmlidXRlPy52YWx1ZXNbMF0udmFsdWVEaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlOiBhdHRyaWJ1dGUubGFiZWxcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXCJcbiAgICAgICAgICAgIFthdHRyLmFyaWEtZGVzY3JpYmVkYnldPVwiXG4gICAgICAgICAgICAgIGNyZWF0ZUF0dHJpYnV0ZVVpS2V5KCdsYWJlbCcsIGF0dHJpYnV0ZS5uYW1lKSArXG4gICAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICAgIGNyZWF0ZUF0dHJpYnV0ZVVpS2V5KCdhdHRyaWJ1dGUtbXNnJywgYXR0cmlidXRlLm5hbWUpXG4gICAgICAgICAgICBcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGxhYmVsXG4gICAgICAgICAgICBpZD1cInt7XG4gICAgICAgICAgICAgIGNyZWF0ZVZhbHVlVWlLZXkoXG4gICAgICAgICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUubmFtZSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGU/LnZhbHVlc1swXS52YWx1ZUNvZGVcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfX1cIlxuICAgICAgICAgICAgZm9yPVwie3tcbiAgICAgICAgICAgICAgY3JlYXRlQXR0cmlidXRlVmFsdWVJZEZvckNvbmZpZ3VyYXRvcihcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlPy52YWx1ZXNbMF0udmFsdWVDb2RlXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH19XCJcbiAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgICBjbGFzcz1cImZvcm0tY2hlY2stbGFiZWxcIlxuICAgICAgICAgICAgPnt7IGF0dHJpYnV0ZT8udmFsdWVzWzBdLnZhbHVlRGlzcGxheSB9fTwvbGFiZWxcbiAgICAgICAgICA+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY3gtdmFsdWUtcHJpY2VcIj5cbiAgICAgICAgICA8Y3gtY29uZmlndXJhdG9yLXByaWNlXG4gICAgICAgICAgICBbZm9ybXVsYV09XCJleHRyYWN0VmFsdWVQcmljZUZvcm11bGFQYXJhbWV0ZXJzKGF0dHJpYnV0ZT8udmFsdWVzWzBdKVwiXG4gICAgICAgICAgPjwvY3gtY29uZmlndXJhdG9yLXByaWNlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2ZpZWxkc2V0PlxuPC9uZy1jb250YWluZXI+XG4iXX0=