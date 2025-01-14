import { AfterViewChecked, ChangeDetectorRef, ComponentRef, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRef } from '@spartacus/core';
import { Subject, Subscription } from 'rxjs';
import { ICON_TYPE } from '../../../cms-components/misc/icon/icon.model';
import { FocusConfig } from '../../../layout/a11y/keyboard-focus/keyboard-focus.model';
import { PositioningService } from '../../services/positioning/positioning.service';
import { PopoverEvent, PopoverPosition } from './popover.model';
import * as i0 from "@angular/core";
export declare class PopoverComponent implements OnInit, OnDestroy, AfterViewChecked {
    protected positioningService: PositioningService;
    protected winRef: WindowRef;
    protected changeDetectionRef: ChangeDetectorRef;
    protected renderer: Renderer2;
    protected router: Router;
    /**
     * String or template to be rendered inside popover wrapper component.
     */
    content: string | TemplateRef<any>;
    /**
     * Element which triggers displaying popover component.
     * This property is needed to calculate valid position for popover.
     */
    triggerElement: ElementRef;
    /**
     * Current initiated popover instance.
     */
    popoverInstance: ComponentRef<PopoverComponent>;
    /**
     * Flag which informs positioning service if popover component
     * should be appended to body. Otherwise popover is displayed right after
     * trigger element in DOM.
     */
    appendToBody?: boolean;
    /**
     * The preferred placement of the popover. Default popover position is 'top'.
     *
     * Allowed popover positions: 'auto', 'top', 'bottom', 'left', 'right',
     * 'top-left', 'top-right', 'bottom-left', 'bottom-right',
     * 'left-top', 'left-bottom', 'right-top', 'right-bottom'.
     */
    position?: PopoverPosition;
    /**
     * Flag used to define if popover should look for the best placement
     * in case if there is not enough space in viewport for preferred position.
     *
     * By default this property is set to `true`.
     *
     * Value of this flag is omitted if preferred position is set to `auto`.
     */
    autoPositioning?: boolean;
    /**
     * Custom class name passed to popover component.
     *
     * If this property is not set the default popover class is `cx-popover`.
     */
    customClass?: string;
    /**
     * Flag used to show/hide close button in popover component.
     */
    displayCloseButton?: boolean;
    /**
     * After popover component is initialized position needs to be changing dynamically
     * in case if any viewport changes happened.
     */
    resizeSub: Subscription;
    /**
     * After popover component is initialized popover should be closed in case
     * if current route has been changed.
     */
    routeChangeSub: Subscription;
    /**
     * Class name generated by positioning service indicating position of popover.
     */
    popoverClass: PopoverPosition;
    /**
     * Configuration for a11y improvements.
     */
    focusConfig: FocusConfig;
    /**
     * Flag indicates if popover should be re-positioned on scroll event.
     */
    positionOnScroll?: boolean;
    /**
     * Icon types for close button icon.
     */
    iconTypes: typeof ICON_TYPE;
    /**
     * Subject which emits specific type of `PopoverEvent`.
     */
    eventSubject: Subject<PopoverEvent>;
    /**
     * Scroll event unlistener.
     */
    scrollEventUnlistener: () => void;
    /**
     * Binding class name property.
     */
    baseClass: string;
    /**
     * Listens for click inside popover component wrapper.
     */
    insideClick(): void;
    /**
     * Listens for every document click and ignores clicks
     * inside component.
     */
    outsideClick(event: MouseEvent): void;
    /**
     * Listens for `escape` keydown event.
     */
    escapeKeydown(): void;
    protected isClickedOnPopover(event: MouseEvent): any;
    protected isClickedOnDirective(event: MouseEvent): any;
    /**
     * Emits close event trigger.
     */
    close(event: MouseEvent | KeyboardEvent | Event): void;
    /**
     * Method uses `Renderer2` service to listen window scroll event.
     *
     * Registered only if property `positionOnScroll` is set to `true`.
     */
    triggerScrollEvent(): void;
    /**
     * Method uses positioning service calculation and based on that
     * updates class name for popover component instance.
     */
    positionPopover(): void;
    ngOnInit(): void;
    /**
     * indicates if passed content is a TemplateRef or string.
     */
    isTemplate(content: string | TemplateRef<any>): content is TemplateRef<any>;
    isString(content: string | TemplateRef<any>): content is string;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    constructor(positioningService: PositioningService, winRef: WindowRef, changeDetectionRef: ChangeDetectorRef, renderer: Renderer2, router: Router);
    static ɵfac: i0.ɵɵFactoryDeclaration<PopoverComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PopoverComponent, "cx-popover", never, {}, {}, never, never, false>;
}
