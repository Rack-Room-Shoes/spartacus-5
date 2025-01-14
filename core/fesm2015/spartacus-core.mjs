import * as i0 from '@angular/core';
import { inject, Injectable, InjectFlags, InjectionToken, isDevMode, PLATFORM_ID, Inject, Optional, NgModule, APP_INITIALIZER, Directive, Input, NgModuleFactory, Pipe } from '@angular/core';
import * as i1$2 from '@ngrx/store';
import { createFeatureSelector, createSelector, select, INIT, META_REDUCERS, StoreModule, combineReducers } from '@ngrx/store';
import { ReplaySubject, of, fromEvent, BehaviorSubject, iif, combineLatest, queueScheduler, throwError, Subscription, Observable, Subject, using, EMPTY, defer, from, zip, asapScheduler, forkJoin, merge, isObservable, range, timer } from 'rxjs';
import { take, map, debounceTime, startWith, distinctUntilChanged, filter, shareReplay, withLatestFrom, tap, switchMap, observeOn, catchError, exhaustMap, mapTo, share, pairwise, skipWhile, concatMap, mergeMap, publishReplay, switchMapTo, scan, skip, bufferCount, pluck, groupBy, audit, delay, retry, finalize, takeUntil, retryWhen } from 'rxjs/operators';
import { __awaiter, __rest, __decorate } from 'tslib';
import * as i1 from 'angular-oauth2-oidc';
import { OAuthStorage, OAuthModule } from 'angular-oauth2-oidc';
import * as i6 from '@angular/common';
import { isPlatformBrowser, DOCUMENT, isPlatformServer, CommonModule, LOCATION_INITIALIZED, Location, DatePipe, getLocaleId, DecimalPipe } from '@angular/common';
import * as i1$1 from '@angular/router';
import { PRIMARY_OUTLET, NavigationEnd, DefaultUrlSerializer, Router, NavigationStart, NavigationError, NavigationCancel, UrlSerializer, RouterModule } from '@angular/router';
import * as i1$3 from '@angular/common/http';
import { HttpHeaders, HttpParams, HttpErrorResponse, HTTP_INTERCEPTORS, HttpClientModule, HttpResponse, HttpClient } from '@angular/common/http';
import * as i1$4 from '@ngrx/effects';
import { createEffect, ofType, EffectsModule, Effect } from '@ngrx/effects';
import { makeStateKey, TransferState, Meta } from '@angular/platform-browser';
import * as fromNgrxRouter from '@ngrx/router-store';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import i18nextHttpBackend from 'i18next-http-backend';
import i18next from 'i18next';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
function deepMerge(target = {}, ...sources) {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift() || {};
    if (isObject(source)) {
        for (const key in source) {
            if (source[key] instanceof Date) {
                target[key] = source[key];
            }
            else if (isObject(source[key])) {
                if (!target[key] || !isObject(target[key])) {
                    target[key] = {};
                }
                deepMerge(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
    }
    return deepMerge(target, ...sources);
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function configFactory() {
    return deepMerge({}, inject(DefaultConfig), inject(RootConfig));
}
/**
 * Global Configuration, can be used to inject configuration to any part of the app
 */
class Config {
}
Config.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: Config, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
Config.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: Config, providedIn: 'root', useFactory: configFactory });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: Config, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useFactory: configFactory,
                }]
        }] });
function defaultConfigFactory() {
    var _a;
    return deepMerge({}, ...((_a = inject(DefaultConfigChunk, InjectFlags.Optional)) !== null && _a !== void 0 ? _a : []));
}
/**
 * Default Configuration token, used to build Global Configuration, built from DefaultConfigChunks
 */
const DefaultConfig = new InjectionToken('DefaultConfiguration', {
    providedIn: 'root',
    factory: defaultConfigFactory,
});
function rootConfigFactory() {
    var _a;
    return deepMerge({}, ...((_a = inject(ConfigChunk, InjectFlags.Optional)) !== null && _a !== void 0 ? _a : []));
}
/**
 * Root Configuration token, used to build Global Configuration, built from ConfigChunks
 */
const RootConfig = new InjectionToken('RootConfiguration', {
    providedIn: 'root',
    factory: rootConfigFactory,
});
/**
 * Config chunk token, can be used to provide configuration chunk and contribute to the global configuration object.
 * Should not be used directly, use `provideConfig` or import `ConfigModule.withConfig` instead.
 */
const ConfigChunk = new InjectionToken('ConfigurationChunk');
/**
 * Config chunk token, can be used to provide configuration chunk and contribute to the default configuration.
 * Should not be used directly, use `provideDefaultConfig` or `provideDefaultConfigFactory` instead.
 *
 * General rule is, that all config provided in libraries should be provided as default config.
 */
const DefaultConfigChunk = new InjectionToken('DefaultConfigurationChunk');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Helper function to provide configuration chunk using ConfigChunk token
 *
 * To provide default configuration in libraries provideDefaultConfig should be used instead.
 *
 * @param config Config object to merge with the global configuration
 */
function provideConfig(config = {}, defaultConfig = false) {
    return {
        provide: defaultConfig ? DefaultConfigChunk : ConfigChunk,
        useValue: config,
        multi: true,
    };
}
/**
 * Helper function to provide configuration with factory function, using ConfigChunk token
 *
 * To provide default configuration in libraries provideDefaultConfigFactory should be used instead.
 *
 * @param configFactory Factory Function that will generate config object
 * @param deps Optional dependencies to a factory function
 */
function provideConfigFactory(configFactory, deps, defaultConfig = false) {
    return {
        provide: defaultConfig ? DefaultConfigChunk : ConfigChunk,
        useFactory: configFactory,
        multi: true,
        deps: deps,
    };
}
/**
 * Helper function to provide default configuration chunk using DefaultConfigChunk token
 *
 * @param config Config object to merge with the default configuration
 */
function provideDefaultConfig(config = {}) {
    return {
        provide: DefaultConfigChunk,
        useValue: config,
        multi: true,
    };
}
/**
 * Helper function to provide default configuration with factory function, using DefaultConfigChunk token
 *
 * @param configFactory Factory Function that will generate config object
 * @param deps Optional dependencies to a factory function
 */
function provideDefaultConfigFactory(configFactory, deps) {
    return {
        provide: DefaultConfigChunk,
        useFactory: configFactory,
        multi: true,
        deps: deps,
    };
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultAnonymousConsentsConfig = {
    anonymousConsents: {
        registerConsent: 'MARKETING_NEWSLETTER',
        showLegalDescriptionInDialog: true,
        requiredConsents: [],
        consentManagementPage: {
            showAnonymousConsents: true,
            hideConsents: [],
        },
    },
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var CountryType;
(function (CountryType) {
    CountryType["BILLING"] = "BILLING";
    CountryType["SHIPPING"] = "SHIPPING";
})(CountryType || (CountryType = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var PageType;
(function (PageType) {
    PageType["CONTENT_PAGE"] = "ContentPage";
    PageType["PRODUCT_PAGE"] = "ProductPage";
    PageType["CATEGORY_PAGE"] = "CategoryPage";
    PageType["CATALOG_PAGE"] = "CatalogPage";
})(PageType || (PageType = {}));
var ScrollBehavior;
(function (ScrollBehavior) {
    ScrollBehavior["AUTO"] = "auto";
    ScrollBehavior["SMOOTH"] = "smooth";
})(ScrollBehavior || (ScrollBehavior = {}));
var CmsBannerCarouselEffect;
(function (CmsBannerCarouselEffect) {
    CmsBannerCarouselEffect["FADE"] = "FADE";
    CmsBannerCarouselEffect["ZOOM"] = "ZOOM";
    CmsBannerCarouselEffect["CURTAIN"] = "CURTAINX";
    CmsBannerCarouselEffect["TURNDOWN"] = "TURNDOWN";
})(CmsBannerCarouselEffect || (CmsBannerCarouselEffect = {}));
var ContainerBackgroundOptions;
(function (ContainerBackgroundOptions) {
    ContainerBackgroundOptions["NO_BACKGROUND"] = "NO_BACKGROUND";
    ContainerBackgroundOptions["UPLOAD_RESPONSIVE_IMAGE"] = "UPLOAD_RESPONSIVE_IMAGE";
})(ContainerBackgroundOptions || (ContainerBackgroundOptions = {}));
var ContainerSizeOptions;
(function (ContainerSizeOptions) {
    ContainerSizeOptions["FIT_TO_CONTENT_SIZE"] = "FIT_TO_CONTENT_SIZE";
    ContainerSizeOptions["DEFINE_CONTAINER_HEIGHT"] = "DEFINE_CONTAINER_HEIGHT";
})(ContainerSizeOptions || (ContainerSizeOptions = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var ANONYMOUS_CONSENT_STATUS;
(function (ANONYMOUS_CONSENT_STATUS) {
    ANONYMOUS_CONSENT_STATUS["GIVEN"] = "GIVEN";
    ANONYMOUS_CONSENT_STATUS["WITHDRAWN"] = "WITHDRAWN";
})(ANONYMOUS_CONSENT_STATUS || (ANONYMOUS_CONSENT_STATUS = {}));
const ANONYMOUS_CONSENTS_HEADER = 'X-Anonymous-Consents';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var ImageType;
(function (ImageType) {
    ImageType["PRIMARY"] = "PRIMARY";
    ImageType["GALLERY"] = "GALLERY";
})(ImageType || (ImageType = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class HttpErrorModel {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var B2BUserRole;
(function (B2BUserRole) {
    B2BUserRole["ADMIN"] = "b2badmingroup";
    B2BUserRole["CUSTOMER"] = "b2bcustomergroup";
    B2BUserRole["MANAGER"] = "b2bmanagergroup";
    B2BUserRole["APPROVER"] = "b2bapprovergroup";
})(B2BUserRole || (B2BUserRole = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["BACK_IN_STOCK"] = "BACK_IN_STOCK";
})(NotificationType || (NotificationType = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var VariantType;
(function (VariantType) {
    VariantType["SIZE"] = "ApparelSizeVariantProduct";
    VariantType["STYLE"] = "ApparelStyleVariantProduct";
    VariantType["COLOR"] = "ElectronicsColorVariantProduct";
})(VariantType || (VariantType = {}));
var PriceType;
(function (PriceType) {
    PriceType["BUY"] = "BUY";
    PriceType["FROM"] = "FROM";
})(PriceType || (PriceType = {}));
var VariantQualifier;
(function (VariantQualifier) {
    VariantQualifier["SIZE"] = "size";
    VariantQualifier["STYLE"] = "style";
    VariantQualifier["COLOR"] = "color";
    VariantQualifier["THUMBNAIL"] = "thumbnail";
    VariantQualifier["PRODUCT"] = "product";
    VariantQualifier["ROLLUP_PROPERTY"] = "rollupProperty";
})(VariantQualifier || (VariantQualifier = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ENTITY_REMOVE_ACTION = '[ENTITY] REMOVE';
const ENTITY_REMOVE_ALL_ACTION = '[ENTITY] REMOVE ALL';
function entityMeta(type, id) {
    return {
        entityType: type,
        entityId: id,
    };
}
function entityRemoveMeta(type, id) {
    return {
        entityId: id,
        entityType: type,
        entityRemove: true,
    };
}
function entityRemoveAllMeta(type) {
    return {
        entityId: null,
        entityType: type,
        entityRemove: true,
    };
}
class EntityRemoveAction {
    constructor(entityType, id) {
        this.type = ENTITY_REMOVE_ACTION;
        this.meta = entityRemoveMeta(entityType, id);
    }
}
class EntityRemoveAllAction {
    constructor(entityType) {
        this.type = ENTITY_REMOVE_ALL_ACTION;
        this.meta = entityRemoveAllMeta(entityType);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOADER_LOAD_ACTION = '[LOADER] LOAD';
const LOADER_FAIL_ACTION = '[LOADER] FAIL';
const LOADER_SUCCESS_ACTION = '[LOADER] SUCCESS';
const LOADER_RESET_ACTION = '[LOADER] RESET';
function loadMeta(entityType) {
    return {
        entityType: entityType,
        loader: {
            load: true,
        },
    };
}
function failMeta(entityType, error) {
    return {
        entityType: entityType,
        loader: {
            error: error ? error : true,
        },
    };
}
function successMeta(entityType) {
    return {
        entityType: entityType,
        loader: {
            success: true,
        },
    };
}
function resetMeta(entityType) {
    return {
        entityType: entityType,
        loader: {},
    };
}
class LoaderLoadAction {
    constructor(entityType) {
        this.type = LOADER_LOAD_ACTION;
        this.meta = loadMeta(entityType);
    }
}
class LoaderFailAction {
    constructor(entityType, error) {
        this.type = LOADER_FAIL_ACTION;
        this.meta = failMeta(entityType, error);
    }
}
class LoaderSuccessAction {
    constructor(entityType) {
        this.type = LOADER_SUCCESS_ACTION;
        this.meta = successMeta(entityType);
    }
}
class LoaderResetAction {
    constructor(entityType) {
        this.type = LOADER_RESET_ACTION;
        this.meta = resetMeta(entityType);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ENTITY_LOAD_ACTION = '[ENTITY] LOAD';
const ENTITY_FAIL_ACTION = '[ENTITY] LOAD FAIL';
const ENTITY_SUCCESS_ACTION = '[ENTITY] LOAD SUCCESS';
const ENTITY_RESET_ACTION = '[ENTITY] RESET';
function entityLoadMeta(entityType, id) {
    return Object.assign(Object.assign({}, loadMeta(entityType)), entityMeta(entityType, id));
}
function entityFailMeta(entityType, id, error) {
    return Object.assign(Object.assign({}, failMeta(entityType, error)), entityMeta(entityType, id));
}
function entitySuccessMeta(entityType, id) {
    return Object.assign(Object.assign({}, successMeta(entityType)), entityMeta(entityType, id));
}
function entityResetMeta(entityType, id) {
    return Object.assign(Object.assign({}, resetMeta(entityType)), entityMeta(entityType, id));
}
class EntityLoadAction {
    constructor(entityType, id) {
        this.type = ENTITY_LOAD_ACTION;
        this.meta = entityLoadMeta(entityType, id);
    }
}
class EntityFailAction {
    constructor(entityType, id, error) {
        this.type = ENTITY_FAIL_ACTION;
        this.meta = entityFailMeta(entityType, id, error);
    }
}
class EntitySuccessAction {
    constructor(entityType, id, payload) {
        this.payload = payload;
        this.type = ENTITY_SUCCESS_ACTION;
        this.meta = entitySuccessMeta(entityType, id);
    }
}
class EntityLoaderResetAction {
    constructor(entityType, id) {
        this.type = ENTITY_RESET_ACTION;
        this.meta = entityResetMeta(entityType, id);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function loaderValueSelector(state) {
    return state.value;
}
function loaderLoadingSelector(state) {
    var _a;
    return (_a = state.loading) !== null && _a !== void 0 ? _a : false;
}
function loaderErrorSelector(state) {
    var _a;
    return (_a = state.error) !== null && _a !== void 0 ? _a : false;
}
function loaderSuccessSelector(state) {
    var _a;
    return (_a = state.success) !== null && _a !== void 0 ? _a : false;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialLoaderState = {
    loading: false,
    error: false,
    success: false,
    value: undefined,
};
/**
 * Higher order reducer that adds generic loading flag to chunk of the state
 *
 * Utilizes "loader" meta field of actions to set specific flags for specific
 * action (LOAD, SUCCESS, FAIL, RESET)
 */
function loaderReducer(entityType, reducer) {
    return (state = initialLoaderState, action) => {
        if (action.meta &&
            action.meta.loader &&
            action.meta.entityType === entityType) {
            const entity = action.meta.loader;
            if (entity.load) {
                return Object.assign(Object.assign({}, state), { loading: true, value: reducer ? reducer(state.value, action) : state.value });
            }
            else if (entity.error) {
                return Object.assign(Object.assign({}, state), { loading: false, error: true, success: false, value: reducer ? reducer(state.value, action) : undefined });
            }
            else if (entity.success) {
                return Object.assign(Object.assign({}, state), { value: reducer ? reducer(state.value, action) : action.payload, loading: false, error: false, success: true });
            }
            else {
                // reset state action
                return Object.assign(Object.assign({}, initialLoaderState), { value: reducer
                        ? reducer(initialLoaderState.value, action)
                        : initialLoaderState.value });
            }
        }
        if (reducer) {
            const newValue = reducer(state.value, action);
            if (newValue !== state.value) {
                return Object.assign(Object.assign({}, state), { value: newValue });
            }
        }
        return state;
    };
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function entityLoaderStateSelector(state, id) {
    return state.entities[id] || initialLoaderState;
}
function entityValueSelector(state, id) {
    const entityState = entityLoaderStateSelector(state, id);
    return loaderValueSelector(entityState);
}
function entityLoadingSelector(state, id) {
    const entityState = entityLoaderStateSelector(state, id);
    return loaderLoadingSelector(entityState);
}
function entityErrorSelector(state, id) {
    const entityState = entityLoaderStateSelector(state, id);
    return loaderErrorSelector(entityState);
}
function entitySuccessSelector(state, id) {
    const entityState = entityLoaderStateSelector(state, id);
    return loaderSuccessSelector(entityState);
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialEntityState = { entities: {} };
/**
 * Higher order reducer for reusing reducer logic for multiple entities
 *
 * Utilizes entityId meta field to target entity by id in actions
 */
function entityReducer(entityType, reducer) {
    return (state = initialEntityState, action) => {
        let ids = [];
        let partitionPayload = false;
        if (action.meta &&
            action.meta.entityType === entityType &&
            action.meta.entityId !== undefined) {
            if (action.meta.entityId !== null) {
                ids = [].concat(action.meta.entityId);
            }
            // remove selected entities
            if (action.meta.entityRemove) {
                if (action.meta.entityId === null) {
                    return initialEntityState;
                }
                else {
                    let removed = false;
                    const newEntities = Object.keys(state.entities).reduce((acc, cur) => {
                        if (ids.includes(cur)) {
                            removed = true;
                        }
                        else {
                            acc[cur] = state.entities[cur];
                        }
                        return acc;
                    }, {});
                    return removed ? { entities: newEntities } : state;
                }
            }
            partitionPayload =
                Array.isArray(action.meta.entityId) && Array.isArray(action.payload);
        }
        else {
            ids = Object.keys(state.entities);
        }
        const entityUpdates = {};
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const subAction = partitionPayload
                ? Object.assign(Object.assign({}, action), { payload: action.payload[i] }) : action;
            const newState = reducer(state.entities[id], subAction);
            if (newState) {
                entityUpdates[id] = newState;
            }
        }
        if (Object.keys(entityUpdates).length > 0) {
            return Object.assign(Object.assign({}, state), { entities: Object.assign(Object.assign({}, state.entities), entityUpdates) });
        }
        return state;
    };
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Higher order reducer that wraps LoaderReducer and EntityReducer enhancing
 * single state reducer to support multiple entities with generic loading flags
 */
function entityLoaderReducer(entityType, reducer) {
    return entityReducer(entityType, loaderReducer(entityType, reducer));
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PROCESSES_INCREMENT_ACTION = '[PROCESSES LOADER] INCREMENT';
const PROCESSES_DECREMENT_ACTION = '[PROCESSES LOADER] DECREMENT';
const PROCESSES_LOADER_RESET_ACTION = '[PROCESSES LOADER] RESET';
function processesIncrementMeta(entityType) {
    return {
        entityType: entityType,
        loader: undefined,
        processesCountDiff: 1,
    };
}
function processesDecrementMeta(entityType) {
    return {
        entityType: entityType,
        loader: undefined,
        processesCountDiff: -1,
    };
}
function processesLoaderResetMeta(entityType) {
    // processes reset action is a reset action for loader reducer, but not the other way around
    return Object.assign(Object.assign({}, resetMeta(entityType)), { processesCountDiff: null });
}
class ProcessesLoaderResetAction {
    constructor(entityType) {
        this.type = PROCESSES_LOADER_RESET_ACTION;
        this.meta = processesLoaderResetMeta(entityType);
    }
}
class ProcessesIncrementAction {
    constructor(entityType) {
        this.type = PROCESSES_INCREMENT_ACTION;
        this.meta = processesIncrementMeta(entityType);
    }
}
class ProcessesDecrementAction {
    constructor(entityType) {
        this.type = PROCESSES_DECREMENT_ACTION;
        this.meta = processesDecrementMeta(entityType);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ENTITY_PROCESSES_LOADER_RESET_ACTION = '[ENTITY] PROCESSES LOADER RESET';
const ENTITY_PROCESSES_INCREMENT_ACTION = '[ENTITY] PROCESSES INCREMENT';
const ENTITY_PROCESSES_DECREMENT_ACTION = '[ENTITY] PROCESSES DECREMENT';
function entityProcessesLoaderResetMeta(entityType, id) {
    return Object.assign(Object.assign({}, processesLoaderResetMeta(entityType)), entityMeta(entityType, id));
}
function entityProcessesIncrementMeta(entityType, id) {
    return Object.assign(Object.assign({}, processesIncrementMeta(entityType)), entityMeta(entityType, id));
}
function entityProcessesDecrementMeta(entityType, id) {
    return Object.assign(Object.assign({}, processesDecrementMeta(entityType)), entityMeta(entityType, id));
}
class EntityProcessesLoaderResetAction {
    constructor(entityType, id) {
        this.type = ENTITY_PROCESSES_LOADER_RESET_ACTION;
        this.meta = entityProcessesLoaderResetMeta(entityType, id);
    }
}
class EntityProcessesIncrementAction {
    constructor(entityType, id) {
        this.type = ENTITY_PROCESSES_INCREMENT_ACTION;
        this.meta = entityProcessesIncrementMeta(entityType, id);
    }
}
class EntityProcessesDecrementAction {
    constructor(entityType, id) {
        this.type = ENTITY_PROCESSES_DECREMENT_ACTION;
        this.meta = entityProcessesDecrementMeta(entityType, id);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function isStableSelector(state) {
    return !state.processesCount && !state.loading;
}
function hasPendingProcessesSelector(state) {
    return state.processesCount !== undefined && state.processesCount > 0;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialProcessesState = {
    processesCount: 0,
};
/**
 * Higher order reducer that adds processes count
 */
function processesLoaderReducer(entityType, reducer) {
    return (state = Object.assign(Object.assign({}, initialProcessesState), initialLoaderState), action) => {
        const loaderState = loaderReducer(entityType, reducer)(state, action);
        if (action.meta && action.meta.entityType === entityType) {
            const processesCountDiff = action.meta.processesCountDiff;
            if (isDevMode() &&
                state.processesCount &&
                processesCountDiff &&
                state.processesCount + processesCountDiff < 0) {
                console.error(`Action '${action.type}' sets processesCount to value < 0!\n` +
                    'Make sure to keep processesCount in sync.\n' +
                    'There should always be only one decrement action for each increment action.\n' +
                    "Make sure that you don't reset state in between those actions.\n", action);
            }
            if (processesCountDiff) {
                return Object.assign(Object.assign({}, loaderState), { processesCount: state.processesCount
                        ? state.processesCount + processesCountDiff
                        : processesCountDiff });
            }
            else if (processesCountDiff === null) {
                // reset action
                return Object.assign(Object.assign({}, loaderState), initialProcessesState);
            }
        }
        return loaderState;
    };
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialProcessesLoaderState = Object.assign(Object.assign({}, initialLoaderState), initialProcessesState);
function entityHasPendingProcessesSelector(state, id) {
    const entityState = entityLoaderStateSelector(state, id);
    return hasPendingProcessesSelector(entityState);
}
function entityIsStableSelector(state, id) {
    const entityState = entityLoaderStateSelector(state, id);
    return isStableSelector(entityState);
}
function entityProcessesLoaderStateSelector(state, id) {
    return state.entities[id] || initialProcessesLoaderState;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Higher order reducer that wraps ProcessesLoaderReducer and EntityReducer enhancing
 * single state reducer to support multiple entities with generic processesCount flag
 */
function entityProcessesLoaderReducer(entityType, reducer) {
    return entityReducer(entityType, processesLoaderReducer(entityType, reducer));
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function entitySelector(state, id) {
    return state.entities[id] || undefined;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const OBJECT_SEPARATOR = '.';
function getStateSliceValue(keys, state) {
    const stateSliceValue = keys
        .split(OBJECT_SEPARATOR)
        .reduce((previous, current) => (previous ? previous[current] : undefined), state);
    return stateSliceValue;
}
function createShellObject(key, excludeKeys, value) {
    if (!key || !value || Object.keys(value).length === 0) {
        return {};
    }
    const shell = key.split(OBJECT_SEPARATOR).reduceRight((acc, previous) => {
        return { [previous]: acc };
    }, value);
    return handleExclusions(key, excludeKeys, shell);
}
function getStateSlice(keys, excludeKeys, state) {
    if (keys && keys.length === 0) {
        return {};
    }
    let stateSlices = {};
    for (const currentKey of keys) {
        const stateValue = getStateSliceValue(currentKey, state);
        const shell = createShellObject(currentKey, excludeKeys, stateValue);
        stateSlices = deepMerge(stateSlices, shell);
    }
    return stateSlices;
}
function handleExclusions(key, excludeKeys, value) {
    const exclusionKeys = getExclusionKeys(key, excludeKeys);
    if (exclusionKeys.length === 0) {
        return value;
    }
    const finalValue = deepMerge({}, value);
    for (const currentExclusionKey of exclusionKeys) {
        const exclusionChunksSplit = currentExclusionKey.split(OBJECT_SEPARATOR);
        let nestedTemp = finalValue;
        for (let i = 0; i < exclusionChunksSplit.length; i++) {
            const currentChunk = exclusionChunksSplit[i];
            // last iteration
            if (i === exclusionChunksSplit.length - 1) {
                if (nestedTemp && nestedTemp[currentChunk]) {
                    delete nestedTemp[currentChunk];
                }
            }
            else {
                nestedTemp = nestedTemp[currentChunk];
            }
        }
    }
    return finalValue;
}
function getExclusionKeys(key, excludeKeys) {
    if (!key || !excludeKeys) {
        return [];
    }
    const exclusionKeys = [];
    for (const exclusionKey of excludeKeys) {
        if (exclusionKey.includes(key)) {
            exclusionKeys.push(exclusionKey);
        }
    }
    return exclusionKeys;
}
function filterKeysByType(keys, type) {
    if (!keys) {
        return [];
    }
    return Object.keys(keys).filter((key) => keys[key] === type);
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ALL = 'all';
function serializeSearchConfig(config, id) {
    var _a, _b, _c;
    return `${id !== null && id !== void 0 ? id : ''}?pageSize=${(_a = config.pageSize) !== null && _a !== void 0 ? _a : ''}&currentPage=${(_b = config.currentPage) !== null && _b !== void 0 ? _b : ''}&sort=${(_c = config.sort) !== null && _c !== void 0 ? _c : ''}`;
}
function denormalizeSearch(state, params) {
    return denormalizeCustomB2BSearch(state.list, state.entities, params);
}
function denormalizeCustomB2BSearch(list, entities, params, id) {
    const serializedList = entityLoaderStateSelector(list, params ? serializeSearchConfig(params, id) : id !== null && id !== void 0 ? id : ALL);
    if (!serializedList.value || !serializedList.value.ids) {
        return serializedList;
    }
    const res = Object.assign({}, serializedList, {
        value: {
            values: serializedList.value.ids.map((code) => entityLoaderStateSelector(entities, code).value),
        },
    });
    if (params && res.value) {
        res.value.pagination = serializedList.value.pagination;
        res.value.sorts = serializedList.value.sorts;
    }
    return res;
}
function normalizeListPage(list, id) {
    const values = list.values || [];
    const page = {
        ids: values.map((data) => data[id]),
    };
    if (list.pagination) {
        page.pagination = list.pagination;
    }
    if (list.sorts) {
        page.sorts = list.sorts;
    }
    return { values, page };
}
function serializeParams(params, searchConfig) {
    return [params, serializeSearchConfig(searchConfig)].toString();
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var utilsGroup = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getStateSlice: getStateSlice,
    ENTITY_LOAD_ACTION: ENTITY_LOAD_ACTION,
    ENTITY_FAIL_ACTION: ENTITY_FAIL_ACTION,
    ENTITY_SUCCESS_ACTION: ENTITY_SUCCESS_ACTION,
    ENTITY_RESET_ACTION: ENTITY_RESET_ACTION,
    entityLoadMeta: entityLoadMeta,
    entityFailMeta: entityFailMeta,
    entitySuccessMeta: entitySuccessMeta,
    entityResetMeta: entityResetMeta,
    EntityLoadAction: EntityLoadAction,
    EntityFailAction: EntityFailAction,
    EntitySuccessAction: EntitySuccessAction,
    EntityLoaderResetAction: EntityLoaderResetAction,
    entityLoaderStateSelector: entityLoaderStateSelector,
    entityValueSelector: entityValueSelector,
    entityLoadingSelector: entityLoadingSelector,
    entityErrorSelector: entityErrorSelector,
    entitySuccessSelector: entitySuccessSelector,
    entityLoaderReducer: entityLoaderReducer,
    ENTITY_PROCESSES_LOADER_RESET_ACTION: ENTITY_PROCESSES_LOADER_RESET_ACTION,
    ENTITY_PROCESSES_INCREMENT_ACTION: ENTITY_PROCESSES_INCREMENT_ACTION,
    ENTITY_PROCESSES_DECREMENT_ACTION: ENTITY_PROCESSES_DECREMENT_ACTION,
    entityProcessesLoaderResetMeta: entityProcessesLoaderResetMeta,
    entityProcessesIncrementMeta: entityProcessesIncrementMeta,
    entityProcessesDecrementMeta: entityProcessesDecrementMeta,
    EntityProcessesLoaderResetAction: EntityProcessesLoaderResetAction,
    EntityProcessesIncrementAction: EntityProcessesIncrementAction,
    EntityProcessesDecrementAction: EntityProcessesDecrementAction,
    entityHasPendingProcessesSelector: entityHasPendingProcessesSelector,
    entityIsStableSelector: entityIsStableSelector,
    entityProcessesLoaderStateSelector: entityProcessesLoaderStateSelector,
    entityProcessesLoaderReducer: entityProcessesLoaderReducer,
    ENTITY_REMOVE_ACTION: ENTITY_REMOVE_ACTION,
    ENTITY_REMOVE_ALL_ACTION: ENTITY_REMOVE_ALL_ACTION,
    entityMeta: entityMeta,
    entityRemoveMeta: entityRemoveMeta,
    entityRemoveAllMeta: entityRemoveAllMeta,
    EntityRemoveAction: EntityRemoveAction,
    EntityRemoveAllAction: EntityRemoveAllAction,
    entitySelector: entitySelector,
    initialEntityState: initialEntityState,
    entityReducer: entityReducer,
    LOADER_LOAD_ACTION: LOADER_LOAD_ACTION,
    LOADER_FAIL_ACTION: LOADER_FAIL_ACTION,
    LOADER_SUCCESS_ACTION: LOADER_SUCCESS_ACTION,
    LOADER_RESET_ACTION: LOADER_RESET_ACTION,
    loadMeta: loadMeta,
    failMeta: failMeta,
    successMeta: successMeta,
    resetMeta: resetMeta,
    LoaderLoadAction: LoaderLoadAction,
    LoaderFailAction: LoaderFailAction,
    LoaderSuccessAction: LoaderSuccessAction,
    LoaderResetAction: LoaderResetAction,
    loaderValueSelector: loaderValueSelector,
    loaderLoadingSelector: loaderLoadingSelector,
    loaderErrorSelector: loaderErrorSelector,
    loaderSuccessSelector: loaderSuccessSelector,
    initialLoaderState: initialLoaderState,
    loaderReducer: loaderReducer,
    PROCESSES_INCREMENT_ACTION: PROCESSES_INCREMENT_ACTION,
    PROCESSES_DECREMENT_ACTION: PROCESSES_DECREMENT_ACTION,
    PROCESSES_LOADER_RESET_ACTION: PROCESSES_LOADER_RESET_ACTION,
    processesIncrementMeta: processesIncrementMeta,
    processesDecrementMeta: processesDecrementMeta,
    processesLoaderResetMeta: processesLoaderResetMeta,
    ProcessesLoaderResetAction: ProcessesLoaderResetAction,
    ProcessesIncrementAction: ProcessesIncrementAction,
    ProcessesDecrementAction: ProcessesDecrementAction,
    isStableSelector: isStableSelector,
    hasPendingProcessesSelector: hasPendingProcessesSelector,
    initialProcessesState: initialProcessesState,
    processesLoaderReducer: processesLoaderReducer,
    serializeSearchConfig: serializeSearchConfig,
    denormalizeSearch: denormalizeSearch,
    denormalizeCustomB2BSearch: denormalizeCustomB2BSearch,
    normalizeListPage: normalizeListPage,
    serializeParams: serializeParams
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ANONYMOUS_CONSENTS_STORE_FEATURE = 'anonymous-consents';
const ANONYMOUS_CONSENTS = '[Anonymous Consents] Anonymous Consents';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_ANONYMOUS_CONSENT_TEMPLATES = '[Anonymous Consents] Load Anonymous Consent Templates';
const LOAD_ANONYMOUS_CONSENT_TEMPLATES_SUCCESS = '[Anonymous Consents] Load Anonymous Consent Templates Success';
const LOAD_ANONYMOUS_CONSENT_TEMPLATES_FAIL = '[Anonymous Consents] Load Anonymous Consent Templates Fail';
const RESET_LOAD_ANONYMOUS_CONSENT_TEMPLATES = '[Anonymous Consents] Reset Load Anonymous Consent Templates';
const GET_ALL_ANONYMOUS_CONSENTS = '[Anonymous Consents] Get All Anonymous Consents';
const GET_ANONYMOUS_CONSENT = '[Anonymous Consents] Get Anonymous Consent';
const SET_ANONYMOUS_CONSENTS = '[Anonymous Consents] Set Anonymous Consents';
const GIVE_ANONYMOUS_CONSENT = '[Anonymous Consents] Give Anonymous Consent';
const WITHDRAW_ANONYMOUS_CONSENT = '[Anonymous Consents] Withdraw Anonymous Consent';
const TOGGLE_ANONYMOUS_CONSENTS_BANNER_DISMISSED = '[Anonymous Consents] Toggle Anonymous Consents Banner Dismissed';
const TOGGLE_ANONYMOUS_CONSENT_TEMPLATES_UPDATED = '[Anonymous Consents] Anonymous Consent Templates Updated';
const ANONYMOUS_CONSENT_CHECK_UPDATED_VERSIONS = '[Anonymous Consents] Check Updated Versions';
class LoadAnonymousConsentTemplates extends LoaderLoadAction {
    constructor() {
        super(ANONYMOUS_CONSENTS);
        this.type = LOAD_ANONYMOUS_CONSENT_TEMPLATES;
    }
}
class LoadAnonymousConsentTemplatesSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(ANONYMOUS_CONSENTS);
        this.payload = payload;
        this.type = LOAD_ANONYMOUS_CONSENT_TEMPLATES_SUCCESS;
    }
}
class LoadAnonymousConsentTemplatesFail extends LoaderFailAction {
    constructor(payload) {
        super(ANONYMOUS_CONSENTS, payload);
        this.type = LOAD_ANONYMOUS_CONSENT_TEMPLATES_FAIL;
    }
}
class ResetLoadAnonymousConsentTemplates extends LoaderResetAction {
    constructor() {
        super(ANONYMOUS_CONSENTS);
        this.type = RESET_LOAD_ANONYMOUS_CONSENT_TEMPLATES;
    }
}
class GetAllAnonymousConsents {
    constructor() {
        this.type = GET_ALL_ANONYMOUS_CONSENTS;
        // Intentional empty constructor
    }
}
class GetAnonymousConsent {
    constructor(templateCode) {
        this.templateCode = templateCode;
        this.type = GET_ANONYMOUS_CONSENT;
    }
}
class SetAnonymousConsents {
    constructor(payload) {
        this.payload = payload;
        this.type = SET_ANONYMOUS_CONSENTS;
    }
}
class GiveAnonymousConsent {
    constructor(templateCode) {
        this.templateCode = templateCode;
        this.type = GIVE_ANONYMOUS_CONSENT;
    }
}
class WithdrawAnonymousConsent {
    constructor(templateCode) {
        this.templateCode = templateCode;
        this.type = WITHDRAW_ANONYMOUS_CONSENT;
    }
}
class ToggleAnonymousConsentsBannerDissmissed {
    constructor(dismissed) {
        this.dismissed = dismissed;
        this.type = TOGGLE_ANONYMOUS_CONSENTS_BANNER_DISMISSED;
    }
}
class ToggleAnonymousConsentTemplatesUpdated {
    constructor(updated) {
        this.updated = updated;
        this.type = TOGGLE_ANONYMOUS_CONSENT_TEMPLATES_UPDATED;
    }
}
class AnonymousConsentCheckUpdatedVersions {
    constructor() {
        this.type = ANONYMOUS_CONSENT_CHECK_UPDATED_VERSIONS;
        // Intentional empty constructor
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var anonymousConsentsGroup = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LOAD_ANONYMOUS_CONSENT_TEMPLATES: LOAD_ANONYMOUS_CONSENT_TEMPLATES,
    LOAD_ANONYMOUS_CONSENT_TEMPLATES_SUCCESS: LOAD_ANONYMOUS_CONSENT_TEMPLATES_SUCCESS,
    LOAD_ANONYMOUS_CONSENT_TEMPLATES_FAIL: LOAD_ANONYMOUS_CONSENT_TEMPLATES_FAIL,
    RESET_LOAD_ANONYMOUS_CONSENT_TEMPLATES: RESET_LOAD_ANONYMOUS_CONSENT_TEMPLATES,
    GET_ALL_ANONYMOUS_CONSENTS: GET_ALL_ANONYMOUS_CONSENTS,
    GET_ANONYMOUS_CONSENT: GET_ANONYMOUS_CONSENT,
    SET_ANONYMOUS_CONSENTS: SET_ANONYMOUS_CONSENTS,
    GIVE_ANONYMOUS_CONSENT: GIVE_ANONYMOUS_CONSENT,
    WITHDRAW_ANONYMOUS_CONSENT: WITHDRAW_ANONYMOUS_CONSENT,
    TOGGLE_ANONYMOUS_CONSENTS_BANNER_DISMISSED: TOGGLE_ANONYMOUS_CONSENTS_BANNER_DISMISSED,
    TOGGLE_ANONYMOUS_CONSENT_TEMPLATES_UPDATED: TOGGLE_ANONYMOUS_CONSENT_TEMPLATES_UPDATED,
    ANONYMOUS_CONSENT_CHECK_UPDATED_VERSIONS: ANONYMOUS_CONSENT_CHECK_UPDATED_VERSIONS,
    LoadAnonymousConsentTemplates: LoadAnonymousConsentTemplates,
    LoadAnonymousConsentTemplatesSuccess: LoadAnonymousConsentTemplatesSuccess,
    LoadAnonymousConsentTemplatesFail: LoadAnonymousConsentTemplatesFail,
    ResetLoadAnonymousConsentTemplates: ResetLoadAnonymousConsentTemplates,
    GetAllAnonymousConsents: GetAllAnonymousConsents,
    GetAnonymousConsent: GetAnonymousConsent,
    SetAnonymousConsents: SetAnonymousConsents,
    GiveAnonymousConsent: GiveAnonymousConsent,
    WithdrawAnonymousConsent: WithdrawAnonymousConsent,
    ToggleAnonymousConsentsBannerDissmissed: ToggleAnonymousConsentsBannerDissmissed,
    ToggleAnonymousConsentTemplatesUpdated: ToggleAnonymousConsentTemplatesUpdated,
    AnonymousConsentCheckUpdatedVersions: AnonymousConsentCheckUpdatedVersions
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getAnonymousConsentState = createFeatureSelector(ANONYMOUS_CONSENTS_STORE_FEATURE);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getAnonymousConsentTemplatesState = createSelector(getAnonymousConsentState, (state) => state.templates);
const getAnonymousConsentTemplatesValue = createSelector(getAnonymousConsentTemplatesState, (state) => loaderValueSelector(state));
const getAnonymousConsentTemplatesLoading = createSelector(getAnonymousConsentTemplatesState, loaderLoadingSelector);
const getAnonymousConsentTemplatesSuccess = createSelector(getAnonymousConsentTemplatesState, loaderSuccessSelector);
const getAnonymousConsentTemplatesError = createSelector(getAnonymousConsentTemplatesState, loaderErrorSelector);
const getAnonymousConsentTemplate = (templateCode) => {
    return createSelector(getAnonymousConsentTemplatesValue, (templates) => {
        return templates
            ? templates.find((template) => template.id === templateCode)
            : undefined;
    });
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getAnonymousConsentTemplatesUpdate = createSelector(getAnonymousConsentState, (state) => state.ui.updated);
const getAnonymousConsentsBannerDismissed = createSelector(getAnonymousConsentState, (state) => state.ui.bannerDismissed);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getAnonymousConsents = createSelector(getAnonymousConsentState, (state) => state.consents);
const getAnonymousConsentByTemplateCode = (templateCode) => createSelector(getAnonymousConsents, (consents) => consents.find((consent) => consent.templateCode === templateCode));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var anonymousConsentsGroup_selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getAnonymousConsentTemplatesState: getAnonymousConsentTemplatesState,
    getAnonymousConsentTemplatesValue: getAnonymousConsentTemplatesValue,
    getAnonymousConsentTemplatesLoading: getAnonymousConsentTemplatesLoading,
    getAnonymousConsentTemplatesSuccess: getAnonymousConsentTemplatesSuccess,
    getAnonymousConsentTemplatesError: getAnonymousConsentTemplatesError,
    getAnonymousConsentTemplate: getAnonymousConsentTemplate,
    getAnonymousConsentTemplatesUpdate: getAnonymousConsentTemplatesUpdate,
    getAnonymousConsentsBannerDismissed: getAnonymousConsentsBannerDismissed,
    getAnonymousConsents: getAnonymousConsents,
    getAnonymousConsentByTemplateCode: getAnonymousConsentByTemplateCode,
    getAnonymousConsentState: getAnonymousConsentState
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const OCC_USER_ID_CURRENT = 'current';
const OCC_USER_ID_ANONYMOUS = 'anonymous';
const OCC_USER_ID_GUEST = 'guest';
const OCC_CART_ID_CURRENT = 'current';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOGIN = '[Auth] Login';
const LOGOUT = '[Auth] Logout';
class Login {
    constructor() {
        this.type = LOGIN;
    }
}
class Logout {
    constructor() {
        this.type = LOGOUT;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var authGroup_actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LOGIN: LOGIN,
    LOGOUT: LOGOUT,
    Login: Login,
    Logout: Logout
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * This implementation is OCC specific.
 * Different backend might have completely different need regarding user id.
 * It might not need user id at all and work based on access_token.
 * To implement custom solution provide your own implementation and customize services that use UserIdService
 */
class UserIdService {
    constructor() {
        this._userId = new ReplaySubject(1);
    }
    /**
     * Sets current user id.
     *
     * @param userId
     */
    setUserId(userId) {
        this._userId.next(userId);
    }
    /**
     * This function provides the userId the OCC calls should use, depending
     * on whether there is an active storefront session or not.
     *
     * It returns the userId of the current storefront user or 'anonymous'
     * in the case there are no signed in user in the storefront.
     *
     * The user id of a regular customer session is 'current'. In the case of an
     * asm customer emulation session, the userId will be the customerId.
     */
    getUserId() {
        return this._userId;
    }
    /**
     * Utility method if you need userId to perform single action (eg. dispatch call to API).
     *
     * @param loggedIn Set to true if you want the observable to emit id only for logged in user. Throws in case of anonymous user.
     *
     * @returns Observable that emits once and completes with the last userId value.
     */
    takeUserId(loggedIn = false) {
        return this.getUserId().pipe(take(1), map((userId) => {
            if (loggedIn && userId === OCC_USER_ID_ANONYMOUS) {
                throw new Error('Requested user id for logged user while user is not logged in.');
            }
            return userId;
        }));
    }
    /**
     * Sets user id to the default value for logged out user.
     */
    clearUserId() {
        this.setUserId(OCC_USER_ID_ANONYMOUS);
    }
    /**
     * Checks if the userId is of emulated user type.
     */
    isEmulated() {
        return this.getUserId().pipe(map((userId) => userId !== OCC_USER_ID_ANONYMOUS && userId !== OCC_USER_ID_CURRENT));
    }
}
UserIdService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
UserIdService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserIdService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserIdService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Supported OAuth flows.
 */
var OAuthFlow;
(function (OAuthFlow) {
    /**
     * Flow when username and password is passed to the application and then the application through API fetches tokens from OAuth server.
     */
    OAuthFlow[OAuthFlow["ResourceOwnerPasswordFlow"] = 0] = "ResourceOwnerPasswordFlow";
    /**
     * Flow with redirect to OAuth server where user inputs credentials and the are redirected back with token.
     */
    OAuthFlow[OAuthFlow["ImplicitFlow"] = 1] = "ImplicitFlow";
    /**
     * Similar to Implicit flow, but user is redirected with code that need to later exchange through API for a token.
     */
    OAuthFlow[OAuthFlow["AuthorizationCode"] = 2] = "AuthorizationCode";
})(OAuthFlow || (OAuthFlow = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AuthConfig {
}
AuthConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AuthConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SiteContextConfig {
}
SiteContextConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
SiteContextConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccConfig extends SiteContextConfig {
}
OccConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccConfig, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
OccConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Utility service on top of the authorization config.
 * Provides handy defaults, when not everything is set in the configuration.
 * Use this service instead of direct configuration.
 */
class AuthConfigService {
    constructor(authConfig, occConfig) {
        this.authConfig = authConfig;
        this.occConfig = occConfig;
    }
    /**
     * Utility to make access to authentication config easier.
     */
    get config() {
        var _a, _b;
        return (_b = (_a = this.authConfig) === null || _a === void 0 ? void 0 : _a.authentication) !== null && _b !== void 0 ? _b : {};
    }
    /**
     * Get client_id
     *
     * @return client_id
     */
    getClientId() {
        var _a, _b;
        return (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.client_id) !== null && _b !== void 0 ? _b : '';
    }
    /**
     * Get client_secret. OAuth server shouldn't require it from web apps (but Hybris OAuth server requires).
     *
     * @return client_secret
     */
    getClientSecret() {
        var _a, _b;
        return (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.client_secret) !== null && _b !== void 0 ? _b : '';
    }
    /**
     * Returns base url of the authorization server
     */
    getBaseUrl() {
        var _a, _b, _c, _d, _e, _f;
        return ((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.baseUrl) !== null && _b !== void 0 ? _b : ((_f = (_e = (_d = (_c = this.occConfig) === null || _c === void 0 ? void 0 : _c.backend) === null || _d === void 0 ? void 0 : _d.occ) === null || _e === void 0 ? void 0 : _e.baseUrl) !== null && _f !== void 0 ? _f : '') + '/authorizationserver');
    }
    /**
     * Returns endpoint for getting the auth token
     */
    getTokenEndpoint() {
        var _a, _b;
        const tokenEndpoint = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.tokenEndpoint) !== null && _b !== void 0 ? _b : '';
        return this.prefixEndpoint(tokenEndpoint);
    }
    /**
     * Returns url for redirect to the authorization server to get token/code
     */
    getLoginUrl() {
        var _a, _b;
        const loginUrl = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.loginUrl) !== null && _b !== void 0 ? _b : '';
        return this.prefixEndpoint(loginUrl);
    }
    /**
     * Returns endpoint for token revocation (both access and refresh token).
     */
    getRevokeEndpoint() {
        var _a, _b;
        const revokeEndpoint = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.revokeEndpoint) !== null && _b !== void 0 ? _b : '';
        return this.prefixEndpoint(revokeEndpoint);
    }
    /**
     * Returns logout url to redirect to on logout.
     */
    getLogoutUrl() {
        var _a, _b;
        const logoutUrl = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.logoutUrl) !== null && _b !== void 0 ? _b : '';
        return this.prefixEndpoint(logoutUrl);
    }
    /**
     * Returns userinfo endpoint of the OAuth server.
     */
    getUserinfoEndpoint() {
        var _a, _b;
        const userinfoEndpoint = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.userinfoEndpoint) !== null && _b !== void 0 ? _b : '';
        return this.prefixEndpoint(userinfoEndpoint);
    }
    /**
     * Returns configuration specific for the angular-oauth2-oidc library.
     */
    getOAuthLibConfig() {
        var _a, _b;
        return (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.OAuthLibConfig) !== null && _b !== void 0 ? _b : {};
    }
    prefixEndpoint(endpoint) {
        let url = endpoint;
        if (!url.startsWith('/')) {
            url = '/' + url;
        }
        return `${this.getBaseUrl()}${url}`;
    }
    /**
     * Returns the type of the OAuth flow based on auth config.
     * Use when you have to perform particular action only in some of the OAuth flow scenarios.
     */
    getOAuthFlow() {
        var _a, _b;
        const responseType = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.OAuthLibConfig) === null || _b === void 0 ? void 0 : _b.responseType;
        if (responseType) {
            const types = responseType.split(' ');
            if (types.includes('code')) {
                return OAuthFlow.AuthorizationCode;
            }
            else if (types.includes('token')) {
                return OAuthFlow.ImplicitFlow;
            }
            else {
                return OAuthFlow.ResourceOwnerPasswordFlow;
            }
        }
        return OAuthFlow.ResourceOwnerPasswordFlow;
    }
}
AuthConfigService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthConfigService, deps: [{ token: AuthConfig }, { token: OccConfig }], target: i0.ɵɵFactoryTarget.Injectable });
AuthConfigService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthConfigService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthConfigService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: AuthConfig }, { type: OccConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The url of the server request when running SSR
 * */
const SERVER_REQUEST_URL = new InjectionToken('SERVER_REQUEST_URL');
/**
 * The url of the server request host when running SSR
 * */
const SERVER_REQUEST_ORIGIN = new InjectionToken('SERVER_REQUEST_ORIGIN');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class WindowRef {
    constructor(
    // https://github.com/angular/angular/issues/20351
    document, platformId, serverUrl, serverOrigin) {
        this.platformId = platformId;
        this.serverUrl = serverUrl;
        this.serverOrigin = serverOrigin;
        this.document = document;
    }
    /**
     * Returns true when invoked in browser context.
     * Use this method to check if you can access `window` and other browser globals.
     */
    isBrowser() {
        return isPlatformBrowser(this.platformId);
    }
    /**
     * Exposes global `window` object. In SSR when `window` is not available it returns `undefined`.
     * To detect if you can safely use `nativeWindow` use `isBrowser` to check execution platform.
     */
    get nativeWindow() {
        // TODO(#11133): Consider throwing in SSR
        return this.isBrowser() ? window : undefined;
    }
    /**
     * Exposes global `sessionStorage` object. In SSR when `sessionStorage` is not available it returns `undefined`.
     * To detect if you can safely use `sessionStorage` use `isBrowser` to check execution platform.
     */
    get sessionStorage() {
        return this.nativeWindow ? this.nativeWindow.sessionStorage : undefined;
    }
    /**
     * Exposes global `localStorage` object. In SSR when `localStorage` is not available it returns `undefined`.
     * To detect if you can safely use `localStorage` use `isBrowser` to check execution platform.
     */
    get localStorage() {
        return this.nativeWindow ? this.nativeWindow.localStorage : undefined;
    }
    /**
     * Returns the window/document location, unless it's not available (i.e. SSR).
     *
     * When there's no access to the location object, we mimic the location partially, by resolving
     * the request url (`SERVER_REQUEST_URL`) and origin (`SERVER_REQUEST_ORIGIN`) from the injector.
     * These values are injected in the server implementation so that we can resolve some of the location
     * values when we do server side rendering.
     */
    get location() {
        if (this.isBrowser()) {
            return this.document.location;
        }
        else {
            if (!this.serverUrl) {
                throw new Error('Cannot resolve the href as the SERVER_REQUEST_URL is undefined');
            }
            if (!this.serverOrigin) {
                throw new Error('Cannot resolve the origin as the SERVER_REQUEST_ORIGIN is undefined');
            }
            return {
                href: this.serverUrl,
                origin: this.serverOrigin,
            };
        }
    }
    /**
     * Returns an observable for the window resize event and emits an event
     * every 300ms in case of resizing. An event is simulated initially.
     *
     * If there's no window object available (i.e. in SSR), a null value is emitted.
     */
    get resize$() {
        if (!this.nativeWindow) {
            return of(null);
        }
        else {
            return fromEvent(this.nativeWindow, 'resize').pipe(debounceTime(300), startWith({ target: this.nativeWindow }), distinctUntilChanged());
        }
    }
}
WindowRef.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: WindowRef, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }, { token: SERVER_REQUEST_URL, optional: true }, { token: SERVER_REQUEST_ORIGIN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
WindowRef.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: WindowRef, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: WindowRef, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: Object, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [SERVER_REQUEST_URL]
                    }] }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [SERVER_REQUEST_ORIGIN]
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Wrapper service on the library OAuthService. Normalizes the lib API for services.
 * Use this service when you want to access low level OAuth library methods.
 */
class OAuthLibWrapperService {
    // TODO: Remove platformId dependency in 4.0
    constructor(oAuthService, authConfigService, platformId, winRef) {
        this.oAuthService = oAuthService;
        this.authConfigService = authConfigService;
        this.platformId = platformId;
        this.winRef = winRef;
        this.events$ = this.oAuthService.events;
        this.initialize();
    }
    initialize() {
        var _a, _b, _c, _d;
        const isSSR = !this.winRef.isBrowser();
        this.oAuthService.configure(Object.assign({ tokenEndpoint: this.authConfigService.getTokenEndpoint(), loginUrl: this.authConfigService.getLoginUrl(), clientId: this.authConfigService.getClientId(), dummyClientSecret: this.authConfigService.getClientSecret(), revocationEndpoint: this.authConfigService.getRevokeEndpoint(), logoutUrl: this.authConfigService.getLogoutUrl(), userinfoEndpoint: this.authConfigService.getUserinfoEndpoint(), issuer: (_b = (_a = this.authConfigService.getOAuthLibConfig()) === null || _a === void 0 ? void 0 : _a.issuer) !== null && _b !== void 0 ? _b : this.authConfigService.getBaseUrl(), redirectUri: (_d = (_c = this.authConfigService.getOAuthLibConfig()) === null || _c === void 0 ? void 0 : _c.redirectUri) !== null && _d !== void 0 ? _d : (!isSSR
                ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    this.winRef.nativeWindow.location.origin
                : '') }, this.authConfigService.getOAuthLibConfig()));
    }
    /**
     * Authorize with ResourceOwnerPasswordFlow.
     *
     * @param userId
     * @param password
     *
     * @return token response from the lib
     */
    authorizeWithPasswordFlow(userId, password) {
        return this.oAuthService.fetchTokenUsingPasswordFlow(userId, password);
    }
    /**
     * Refresh access_token.
     */
    refreshToken() {
        this.oAuthService.refreshToken();
    }
    /**
     * Revoke access tokens and clear tokens in lib state.
     */
    revokeAndLogout() {
        return new Promise((resolve) => {
            this.oAuthService
                .revokeTokenAndLogout()
                .catch(() => {
                // when there would be some kind of error during revocation we can't do anything else, so at least we logout user.
                this.oAuthService.logOut();
            })
                .finally(() => {
                resolve();
            });
        });
    }
    /**
     * Clear tokens in library state (no revocation).
     */
    logout() {
        this.oAuthService.logOut();
    }
    /**
     * Returns Open Id token. Might be empty, when it was not requested with the `responseType` config.
     *
     * @return id token
     */
    getIdToken() {
        return this.oAuthService.getIdToken();
    }
    /**
     * Initialize Implicit Flow or Authorization Code flows with the redirect to OAuth login url.
     */
    initLoginFlow() {
        return this.oAuthService.initLoginFlow();
    }
    /**
     * Tries to login user based on `code` or `token` present in the url.
     *
     * @param result The result returned by `OAuthService.tryLogin()`.
     *
     * @param tokenReceived Whether the event 'token_received' is emitted during `OAuthService.tryLogin()`.
     * We can use this identify that we have returned from an external authorization page to Spartacus).
     * In cases where we don't receive this event, the token has been obtained from storage.
     */
    tryLogin() {
        return new Promise((resolve) => {
            // We use the 'token_received' event to check if we have returned
            // from the auth server.
            let tokenReceivedEvent;
            const subscription = this.events$
                .pipe(filter((event) => event.type === 'token_received'), take(1))
                .subscribe((event) => (tokenReceivedEvent = event));
            this.oAuthService
                .tryLogin({
                // We don't load discovery document, because it doesn't contain revoke endpoint information
                disableOAuth2StateCheck: true,
            })
                .then((result) => {
                resolve({
                    result: result,
                    tokenReceived: !!tokenReceivedEvent,
                });
            })
                .finally(() => {
                subscription.unsubscribe();
            });
        });
    }
}
OAuthLibWrapperService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OAuthLibWrapperService, deps: [{ token: i1.OAuthService }, { token: AuthConfigService }, { token: PLATFORM_ID }, { token: WindowRef }], target: i0.ɵɵFactoryTarget.Injectable });
OAuthLibWrapperService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OAuthLibWrapperService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OAuthLibWrapperService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: i1.OAuthService }, { type: AuthConfigService }, { type: Object, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }, { type: WindowRef }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Storage service for AuthToken. Used as a storage for angular-oauth2-oidc library.
 */
class AuthStorageService extends OAuthStorage {
    constructor() {
        super(...arguments);
        this._token$ = new BehaviorSubject({});
    }
    decode(key, value) {
        if (AuthStorageService.nonStringifiedOAuthLibKeys.includes(key)) {
            return value;
        }
        return JSON.stringify(value);
    }
    encode(key, value) {
        if (AuthStorageService.nonStringifiedOAuthLibKeys.includes(key)) {
            return value;
        }
        else {
            try {
                return JSON.parse(value);
            }
            catch (_a) {
                return value;
            }
        }
    }
    /* Async API for spartacus use */
    /**
     * Returns complete token (all fields).
     *
     * @return observable emitting AuthToken
     */
    getToken() {
        return this._token$;
    }
    /**
     * Set current value of token.
     *
     * @param token
     */
    setToken(token) {
        this._token$.next(token);
    }
    /* Sync API for OAuth lib use */
    /**
     * Get parameter from the token (eg. access_token)
     *
     * @param key
     */
    getItem(key) {
        let token;
        this.getToken()
            .subscribe((currentToken) => (token = currentToken))
            .unsubscribe();
        return this.decode(key, token === null || token === void 0 ? void 0 : token[key]);
    }
    /**
     * Removes parameter from the token (eg. access_token)
     *
     * @param key
     */
    removeItem(key) {
        const val = Object.assign({}, this._token$.value);
        delete val[key];
        this._token$.next(Object.assign({}, val));
    }
    /**
     * Sets parameter of the token (eg. access_token)
     *
     * @param key
     */
    setItem(key, data) {
        if (key) {
            this._token$.next(Object.assign(Object.assign({}, this._token$.value), { [key]: this.encode(key, data) }));
        }
    }
}
/**
 * Extracted keys that are not `JSON.stringify` from reading the angular-oauth2-oidc source code
 */
AuthStorageService.nonStringifiedOAuthLibKeys = [
    'PKCE_verifier',
    'access_token',
    'refresh_token',
    'expires_at',
    'access_token_stored_at',
    'id_token',
    'id_token_expires_at',
    'id_token_stored_at',
    'session_state',
    'nonce',
];
AuthStorageService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthStorageService, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
AuthStorageService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthStorageService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthStorageService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CHANGE_NEXT_PAGE_CONTEXT = '[Router] Change Next PageContext';
class ChangeNextPageContext {
    constructor(payload) {
        this.payload = payload;
        this.type = CHANGE_NEXT_PAGE_CONTEXT;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var routingGroup_actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CHANGE_NEXT_PAGE_CONTEXT: CHANGE_NEXT_PAGE_CONTEXT,
    ChangeNextPageContext: ChangeNextPageContext
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ROUTING_FEATURE = 'router';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getRouterFeatureState = createFeatureSelector(ROUTING_FEATURE);
const getRouterState = createSelector(getRouterFeatureState, (state) => state.router);
const getSemanticRoute = createSelector(getRouterState, (routingState) => (routingState.state && routingState.state.semanticRoute) || '');
const getPageContext = createSelector(getRouterState, (routingState) => (routingState.state && routingState.state.context) || { id: '' });
const getNextPageContext = createSelector(getRouterState, (routingState) => routingState.nextState && routingState.nextState.context);
const isNavigating = createSelector(getNextPageContext, (context) => !!context);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var routingGroup_selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getRouterFeatureState: getRouterFeatureState,
    getRouterState: getRouterState,
    getSemanticRoute: getSemanticRoute,
    getPageContext: getPageContext,
    getNextPageContext: getNextPageContext,
    isNavigating: isNavigating
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const isParam = (segment) => segment.startsWith(':');
const getParamName = (segment) => segment.slice(1); // it just removes leading ':'
const ensureLeadingSlash = (path) => path.startsWith('/') ? path : '/' + path;
const removeLeadingSlash = (path) => path.startsWith('/') ? path.slice(1) : path;

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class RoutingConfig {
}
RoutingConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
RoutingConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class RoutingConfigService {
    constructor(config) {
        this.config = config;
    }
    /**
     * Returns the route config for the given route name.
     */
    getRouteConfig(routeName) {
        var _a, _b;
        const routeConfig = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.routing) === null || _b === void 0 ? void 0 : _b.routes;
        const result = routeConfig && routeConfig[routeName];
        if (!routeConfig || result === undefined) {
            this.warn(`No path was configured for the named route '${routeName}'!`);
        }
        return result;
    }
    warn(...args) {
        if (isDevMode()) {
            console.warn(...args);
        }
    }
    /**
     * Returns the configured route loading strategy.
     */
    getLoadStrategy() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.routing) === null || _b === void 0 ? void 0 : _b.loadStrategy) !== null && _c !== void 0 ? _c : "always" /* RouteLoadStrategy.ALWAYS */;
    }
    /**
     * Returns the route name of the configured path.
     *
     * For example, when the config is:
     * ```
     * routing: {
     *   routes: {
     *      addressBook: { paths: ['my-account/address-book'] }
     *   }
     * }
     * ```
     *
     * the `getRouteName('my-account/address-book')` returns `'addressBook'`.
     */
    getRouteName(path) {
        if (!this.routeNamesByPath) {
            this.initRouteNamesByPath();
        }
        return this.routeNamesByPath[path];
    }
    /**
     * Initializes the property `routeNamesByPath`.
     *
     * The original config allows for reading configured path by the route name.
     * But this method builds up a structure with a 'reversed config'
     * to read quickly the route name by the path.
     */
    initRouteNamesByPath() {
        var _a, _b, _c, _d;
        this.routeNamesByPath = {};
        for (const [routeName, routeConfig] of Object.entries((_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.routing) === null || _b === void 0 ? void 0 : _b.routes) !== null && _c !== void 0 ? _c : {})) {
            (_d = routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.paths) === null || _d === void 0 ? void 0 : _d.forEach((path) => {
                if (isDevMode() && this.routeNamesByPath[path]) {
                    console.error(`The same path '${path}' is configured for two different route names: '${this.routeNamesByPath[path]}' and '${routeName}`);
                }
                this.routeNamesByPath[path] = routeName;
            });
        }
    }
}
RoutingConfigService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingConfigService, deps: [{ token: RoutingConfig }], target: i0.ɵɵFactoryTarget.Injectable });
RoutingConfigService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingConfigService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingConfigService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: RoutingConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UrlParsingService {
    constructor(router) {
        this.router = router;
    }
    getPrimarySegments(url) {
        const urlTree = this.router.parseUrl(url);
        return this._getPrimarySegmentsFromUrlTree(urlTree.root);
    }
    _getPrimarySegmentsFromUrlTree(tree) {
        const segments = tree.segments.map((s) => s.path);
        const childrenSegments = tree.children[PRIMARY_OUTLET]
            ? this._getPrimarySegmentsFromUrlTree(tree.children[PRIMARY_OUTLET])
            : [];
        return segments.concat(childrenSegments);
    }
    /**
     * Tells whether the given url matches the given path.
     *
     * @param urlSegments   string or array of url segments. When it's a string, the preceding
     *                      site-context params are ignored (i.e. '/electronics-spa/en/USD/...')
     *
     * @param pathSegments  string or array of path segments. Dynamic params are allowed in the
     *                      path shape, i.e. `/url/:param1/with/:param2`.
     */
    matchPath(urlSegments, pathSegments) {
        urlSegments = Array.isArray(urlSegments)
            ? urlSegments
            : this.getPrimarySegments(urlSegments);
        pathSegments = Array.isArray(pathSegments)
            ? pathSegments
            : this.getPrimarySegments(pathSegments);
        if (urlSegments.length !== pathSegments.length) {
            return false;
        }
        for (let i = 0; i < pathSegments.length; i++) {
            const pathSeg = pathSegments[i];
            const urlSeg = urlSegments[i];
            // compare only static segments:
            if (!isParam(pathSeg) && pathSeg !== urlSeg) {
                return false;
            }
        }
        return true;
    }
}
UrlParsingService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlParsingService, deps: [{ token: i1$1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
UrlParsingService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlParsingService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlParsingService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1$1.Router }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SemanticPathService {
    constructor(routingConfigService, urlParser) {
        this.routingConfigService = routingConfigService;
        this.urlParser = urlParser;
        this.ROOT_URL = ['/'];
    }
    /**
     * Returns the first path alias configured for a given route name. It adds `/` at the beginning.
     */
    get(routeName) {
        const routeConfig = this.routingConfigService.getRouteConfig(routeName);
        return routeConfig && Array.isArray(routeConfig.paths)
            ? '/' + routeConfig.paths[0]
            : undefined;
    }
    /**
     * Transforms the array of url commands. Each command can be:
     * a) string - will be left untouched
     * b) object { cxRoute: <route name> } - will be replaced with semantic path
     * c) object { cxRoute: <route name>, params: { ... } } - same as above, but with passed params
     *
     * If the first command is the object with the `cxRoute` property, returns an absolute url (with the first element of the array `'/'`)
     */
    transform(commands) {
        if (!Array.isArray(commands)) {
            commands = [commands];
        }
        const result = [];
        for (const command of commands) {
            if (!this.isRouteCommand(command)) {
                // don't modify segment that is not route command:
                result.push(command);
            }
            else {
                // generate array with url segments for given route command:
                const partialResult = this.generateUrlPart(command);
                if (partialResult === null) {
                    return this.ROOT_URL;
                }
                result.push(...partialResult);
            }
        }
        if (this.shouldOutputAbsolute(commands)) {
            result.unshift('/');
        }
        return result;
    }
    isRouteCommand(command) {
        return command && Boolean(command.cxRoute);
    }
    shouldOutputAbsolute(commands) {
        return this.isRouteCommand(commands[0]);
    }
    generateUrlPart(command) {
        this.standarizeRouteCommand(command);
        if (!command.cxRoute) {
            return null;
        }
        const routeConfig = this.routingConfigService.getRouteConfig(command.cxRoute);
        // if no route translation was configured, return null:
        if (!routeConfig || !routeConfig.paths) {
            return null;
        }
        // find first path that can satisfy it's parameters with given parameters
        const path = this.findPathWithFillableParams(routeConfig, command.params);
        // if there is no configured path that can be satisfied with given params, return null
        if (!path) {
            return null;
        }
        const result = this.provideParamsValues(path, command.params, routeConfig.paramsMapping);
        return result;
    }
    standarizeRouteCommand(command) {
        command.params = command.params || {};
    }
    provideParamsValues(path, params, paramsMapping) {
        return this.urlParser.getPrimarySegments(path).map((segment) => {
            if (isParam(segment)) {
                const paramName = getParamName(segment);
                const mappedParamName = this.getMappedParamName(paramName, paramsMapping);
                return params === null || params === void 0 ? void 0 : params[mappedParamName];
            }
            return segment;
        });
    }
    findPathWithFillableParams(routeConfig, params) {
        var _a;
        const foundPath = (_a = routeConfig.paths) === null || _a === void 0 ? void 0 : _a.find((path) => this.getParams(path).every((paramName) => {
            const mappedParamName = this.getMappedParamName(paramName, routeConfig.paramsMapping);
            return (params === null || params === void 0 ? void 0 : params[mappedParamName]) !== undefined;
        }));
        if (foundPath === undefined || foundPath === null) {
            return null;
        }
        return foundPath;
    }
    getParams(path) {
        return this.urlParser
            .getPrimarySegments(path)
            .filter(isParam)
            .map(getParamName);
    }
    getMappedParamName(paramName, paramsMapping) {
        if (paramsMapping) {
            return paramsMapping[paramName] || paramName;
        }
        return paramName;
    }
}
SemanticPathService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SemanticPathService, deps: [{ token: RoutingConfigService }, { token: UrlParsingService }], target: i0.ɵɵFactoryTarget.Injectable });
SemanticPathService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SemanticPathService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SemanticPathService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: RoutingConfigService }, { type: UrlParsingService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Helper service to expose all activated routes
 */
class ActivatedRoutesService {
    constructor(router) {
        this.router = router;
        /**
         * Array of currently activated routes (from the root route to the leaf route).
         */
        this.routes$ = this.router.events.pipe(filter((event) => event instanceof NavigationEnd), 
        // eslint-disable-next-line import/no-deprecated
        startWith(undefined), // emit value for consumer who subscribed lately after NavigationEnd event
        map(() => {
            let route = this.router.routerState.snapshot.root;
            const routes = [route];
            // traverse to the leaf route:
            while ((route = route.firstChild)) {
                routes.push(route);
            }
            return routes;
        }), shareReplay({ bufferSize: 1, refCount: true }));
    }
}
ActivatedRoutesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ActivatedRoutesService, deps: [{ token: i1$1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
ActivatedRoutesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ActivatedRoutesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ActivatedRoutesService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1$1.Router }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Service to expose all parameters for the router, including child routes.
 * This is convenient in case the parent route (component) requires awareness
 * of child routes parameters.
 */
class RoutingParamsService {
    constructor(router, activatedRoutesService) {
        this.router = router;
        this.activatedRoutesService = activatedRoutesService;
        this.params$ = this.activatedRoutesService.routes$.pipe(map((routes) => this.findAllParam(routes)), shareReplay({ refCount: true, bufferSize: 1 }));
    }
    /**
     * Get the list of all parameters of the full route. This includes
     * active child routes.
     */
    getParams() {
        return this.params$;
    }
    findAllParam(routes) {
        return Object.assign({}, ...routes.map((route) => route.params));
    }
}
RoutingParamsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingParamsService, deps: [{ token: i1$1.Router }, { token: ActivatedRoutesService }], target: i0.ɵɵFactoryTarget.Injectable });
RoutingParamsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingParamsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingParamsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1$1.Router }, { type: ActivatedRoutesService }]; } });

class RoutingService {
    constructor(store, winRef, semanticPathService, routingParamsService, router, location) {
        this.store = store;
        this.winRef = winRef;
        this.semanticPathService = semanticPathService;
        this.routingParamsService = routingParamsService;
        this.router = router;
        this.location = location;
    }
    /**
     * Get the list of all parameters of the full route. This includes
     * active child routes.
     */
    getParams() {
        return this.routingParamsService.getParams();
    }
    /**
     * Get the current router state
     */
    getRouterState() {
        return this.store.pipe(select(getRouterState));
    }
    /**
     * Get the `PageContext` from the state
     */
    getPageContext() {
        return this.store.pipe(select(getPageContext));
    }
    /**
     * Get the next `PageContext` from the state
     */
    getNextPageContext() {
        return this.store.pipe(select(getNextPageContext));
    }
    /**
     * Allow to change next page context for the ongoing navigation
     *
     * @param pageContext
     */
    changeNextPageContext(pageContext) {
        this.store.dispatch(new ChangeNextPageContext(pageContext));
    }
    /**
     * Get the `isNavigating` info from the state
     */
    isNavigating() {
        return this.store.pipe(select(isNavigating));
    }
    /**
     * Navigation with a new state into history
     * @param commands: url commands
     * @param extras: Represents the extra options used during navigation.
     *
     * @returns Promise that resolves to `true` when navigation succeeds,
     *          to `false` when navigation fails, or is rejected on error.
     */
    go(commands, extras) {
        const path = this.semanticPathService.transform(commands);
        return this.navigate(path, extras);
    }
    /**
     * Resolves the relative url for the given `UrlCommands` and `NavigationExtras`.
     *
     * The absolute url can be resolved using `getFullUrl()`.
     */
    getUrl(commands, extras) {
        let url = this.router.serializeUrl(this.router.createUrlTree(this.semanticPathService.transform(commands), extras));
        if (!url.startsWith('/')) {
            url = `/${url}`;
        }
        return url;
    }
    /**
     * Returns the absolute url for the given `UrlCommands` and `NavigationExtras`.
     *
     * The absolute url uses the origin of the current location.
     */
    getFullUrl(commands, extras) {
        return `${this.winRef.document.location.origin}${this.getUrl(commands, extras)}`;
    }
    /**
     * Navigation using absolute route path
     * @param url
     * @param extras: Represents the extra options used during navigation.
     *
     * @returns Promise that resolves to `true` when navigation succeeds,
     *          to `false` when navigation fails, or is rejected on error.
     */
    goByUrl(url, extras) {
        return this.router.navigateByUrl(url, extras);
    }
    /**
     * Navigating back
     */
    back() {
        const isLastPageInApp = this.winRef.nativeWindow &&
            this.winRef.document.referrer.includes(this.winRef.nativeWindow.location.origin);
        if (isLastPageInApp) {
            this.location.back();
            return;
        }
        this.go(['/']);
        return;
    }
    /**
     * Navigating forward
     */
    forward() {
        this.location.forward();
    }
    /**
     * Navigation with a new state into history
     * @param path
     * @param extras: Represents the extra options used during navigation.
     *
     * @returns Promise that resolves to `true` when navigation succeeds,
     *          to `false` when navigation fails, or is rejected on error.
     */
    navigate(path, extras) {
        return this.router.navigate(path, extras);
    }
}
RoutingService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingService, deps: [{ token: i1$2.Store }, { token: WindowRef }, { token: SemanticPathService }, { token: RoutingParamsService }, { token: i1$1.Router }, { token: i6.Location }], target: i0.ɵɵFactoryTarget.Injectable });
RoutingService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: WindowRef }, { type: SemanticPathService }, { type: RoutingParamsService }, { type: i1$1.Router }, { type: i6.Location }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Service serves storage role for AuthRedirectService.
 * Used by AuthStatePersistenceService to store redirect url for OAuth flows that rely on redirects.
 */
class AuthRedirectStorageService {
    constructor() {
        this.redirectUrl$ = new BehaviorSubject(undefined);
        // Intentional empty constructor
    }
    /**
     * Get redirect url after logging in.
     *
     * @returns observable with the redirect url as string
     */
    getRedirectUrl() {
        return this.redirectUrl$;
    }
    /**
     * Set url to redirect to after login.
     *
     * @param redirectUrl
     */
    setRedirectUrl(redirectUrl) {
        this.redirectUrl$.next(redirectUrl);
    }
}
AuthRedirectStorageService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthRedirectStorageService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AuthRedirectStorageService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthRedirectStorageService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthRedirectStorageService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return []; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AuthFlowRoutesService {
    constructor(config, urlParsingService) {
        this.config = config;
        this.urlParsingService = urlParsingService;
    }
    /**
     * List of paths that are part user auth flow
     */
    get authFlowPaths() {
        var _a, _b;
        if (!this._authFlowPaths) {
            // extract from the routing config the paths that are part of the user auth flow
            this._authFlowPaths = Object.values(((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.routing) === null || _b === void 0 ? void 0 : _b.routes) || {}).reduce((acc, routeConfig) => {
                var _a;
                return routeConfig.authFlow === true && ((_a = routeConfig.paths) === null || _a === void 0 ? void 0 : _a.length)
                    ? acc.concat(routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.paths)
                    : acc;
            }, []);
        }
        return this._authFlowPaths;
    }
    /**
     * Tells whether the given URL is a part of the user auth flow
     */
    isAuthFlow(url) {
        return this.authFlowPaths.some((path) => this.urlParsingService.matchPath(url, path));
    }
}
AuthFlowRoutesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthFlowRoutesService, deps: [{ token: RoutingConfig }, { token: UrlParsingService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthFlowRoutesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthFlowRoutesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthFlowRoutesService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: RoutingConfig }, { type: UrlParsingService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Responsible for saving last accessed page (or attempted) before login and for redirecting to that page after login.
 */
class AuthRedirectService {
    /**
     * This service is responsible for remembering the last page before the authentication. "The last page" can be:
     * 1. Just the previously opened page; or
     * 2. The page that we just tried to open, but AuthGuard cancelled it
     *
     * Then, after successful authentication it allows for redirecting to that remembered page via the `redirect()` method.
     *
     * For example:
     * 1. The user opens the product page, then clicks /login link and signs in
     *    -> Then we should redirect to the product page; or
     * 2. The user opens the product page, then he clicks /my-account link,
     *    but is automatically redirected to the login page by the AuthGuard, and he signs in
     *    -> Then we should redirect to the my-account page, not the product page
     */
    constructor(routing, router, authRedirectStorageService, authFlowRoutesService) {
        this.routing = routing;
        this.router = router;
        this.authRedirectStorageService = authRedirectStorageService;
        this.authFlowRoutesService = authFlowRoutesService;
        this.init();
    }
    init() {
        this.subscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.setRedirectUrl(event.urlAfterRedirects);
            }
        });
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /**
     * Redirect to saved url (homepage if nothing is saved).
     */
    redirect() {
        this.authRedirectStorageService
            .getRedirectUrl()
            .pipe(take(1))
            .subscribe((redirectUrl) => {
            if (redirectUrl === undefined) {
                this.routing.go('/');
            }
            else {
                this.routing.goByUrl(redirectUrl);
            }
            this.clearRedirectUrl();
        });
    }
    /**
     * Saves the url of the current navigation as the redirect url, unless
     * the url is a part of the user login flow.
     */
    saveCurrentNavigationUrl() {
        const navigation = this.router.getCurrentNavigation();
        if (!(navigation === null || navigation === void 0 ? void 0 : navigation.finalUrl)) {
            return;
        }
        const url = this.router.serializeUrl(navigation.finalUrl);
        this.setRedirectUrl(url);
    }
    /**
     * Save the url as the redirect url, unless it's a part of the user login flow.
     */
    setRedirectUrl(url) {
        if (!this.authFlowRoutesService.isAuthFlow(url)) {
            this.authRedirectStorageService.setRedirectUrl(url);
        }
    }
    /**
     * Sets the redirect URL to undefined.
     */
    clearRedirectUrl() {
        this.authRedirectStorageService.setRedirectUrl(undefined);
    }
}
AuthRedirectService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthRedirectService, deps: [{ token: RoutingService }, { token: i1$1.Router }, { token: AuthRedirectStorageService }, { token: AuthFlowRoutesService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthRedirectService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthRedirectService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthRedirectService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: RoutingService }, { type: i1$1.Router }, { type: AuthRedirectStorageService }, { type: AuthFlowRoutesService }]; } });

/**
 * Auth service for normal user authentication.
 * Use to check auth status, login/logout with different OAuth flows.
 */
class AuthService {
    constructor(store, userIdService, oAuthLibWrapperService, authStorageService, authRedirectService, routingService) {
        this.store = store;
        this.userIdService = userIdService;
        this.oAuthLibWrapperService = oAuthLibWrapperService;
        this.authStorageService = authStorageService;
        this.authRedirectService = authRedirectService;
        this.routingService = routingService;
        /**
         * Indicates whether the access token is being refreshed
         */
        this.refreshInProgress$ = new BehaviorSubject(false);
        /**
         * Indicates whether the logout is being performed
         */
        this.logoutInProgress$ = new BehaviorSubject(false);
    }
    /**
     * Check params in url and if there is an code/token then try to login with those.
     */
    checkOAuthParamsInUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginResult = yield this.oAuthLibWrapperService.tryLogin();
                const token = this.authStorageService.getItem('access_token');
                // We get the value `true` of `result` in the _code flow_ even if we did not log in successfully
                // (see source code https://github.com/manfredsteyer/angular-oauth2-oidc/blob/d95d7da788e2c1390346c66de62dc31f10d2b852/projects/lib/src/oauth-service.ts#L1711),
                // that why we also need to check if we have access_token
                if (loginResult.result && token) {
                    this.userIdService.setUserId(OCC_USER_ID_CURRENT);
                    this.store.dispatch(new Login());
                    // We check if the token was received during the `tryLogin()` attempt.
                    // If so, we will redirect as we can deduce we are returning from the authentication server.
                    // Redirection should not be done in cases we get the token from storage (eg. refreshing the page).
                    if (loginResult.tokenReceived) {
                        this.authRedirectService.redirect();
                    }
                }
            }
            catch (_a) { }
        });
    }
    /**
     * Initialize Implicit/Authorization Code flow by redirecting to OAuth server.
     */
    loginWithRedirect() {
        this.oAuthLibWrapperService.initLoginFlow();
        return true;
    }
    /**
     * Loads a new user token with Resource Owner Password Flow.
     * @param userId
     * @param password
     */
    loginWithCredentials(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.oAuthLibWrapperService.authorizeWithPasswordFlow(userId, password);
                // OCC specific user id handling. Customize when implementing different backend
                this.userIdService.setUserId(OCC_USER_ID_CURRENT);
                this.store.dispatch(new Login());
                this.authRedirectService.redirect();
            }
            catch (_a) { }
        });
    }
    /**
     * Revokes tokens and clears state for logged user (tokens, userId).
     * To perform logout it is best to use `logout` method. Use this method with caution.
     */
    coreLogout() {
        this.setLogoutProgress(true);
        this.userIdService.clearUserId();
        return new Promise((resolve) => {
            this.oAuthLibWrapperService.revokeAndLogout().finally(() => {
                this.store.dispatch(new Logout());
                this.setLogoutProgress(false);
                resolve();
            });
        });
    }
    /**
     * Returns `true` if the user is logged in; and `false` if the user is anonymous.
     */
    isUserLoggedIn() {
        return this.authStorageService.getToken().pipe(map((userToken) => Boolean(userToken === null || userToken === void 0 ? void 0 : userToken.access_token)), distinctUntilChanged());
    }
    /**
     * Logout a storefront customer. It will initialize logout procedure by redirecting to the `logout` endpoint.
     */
    logout() {
        this.routingService.go({ cxRoute: 'logout' });
    }
    /**
     * Start or stop the refresh process
     */
    setRefreshProgress(progress) {
        this.refreshInProgress$.next(progress);
    }
    /**
     * Start or stop the logout process
     */
    setLogoutProgress(progress) {
        this.logoutInProgress$.next(progress);
    }
}
AuthService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthService, deps: [{ token: i1$2.Store }, { token: UserIdService }, { token: OAuthLibWrapperService }, { token: AuthStorageService }, { token: AuthRedirectService }, { token: RoutingService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: UserIdService }, { type: OAuthLibWrapperService }, { type: AuthStorageService }, { type: AuthRedirectService }, { type: RoutingService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AnonymousConsentsService {
    constructor(store, authService) {
        this.store = store;
        this.authService = authService;
    }
    /**
     * Retrieves the anonymous consent templates.
     */
    loadTemplates() {
        this.store.dispatch(new LoadAnonymousConsentTemplates());
    }
    /**
     * Conditionally triggers the load of the anonymous consent templates if:
     *   - `loadIfMissing` parameter is set to `true`
     *   - the `templates` in the store are `undefined`
     *
     * Otherwise it just returns the value from the store.
     *
     * @param loadIfMissing setting to `true` will trigger the load of the templates if the currently stored templates are `undefined`
     */
    getTemplates(loadIfMissing = false) {
        return iif(() => loadIfMissing, this.store.pipe(select(getAnonymousConsentTemplatesValue), withLatestFrom(this.getLoadTemplatesLoading()), filter(([_templates, loading]) => !loading), tap(([templates, _loading]) => {
            if (!Boolean(templates)) {
                this.loadTemplates();
            }
        }), filter(([templates, _loading]) => Boolean(templates)), map(([templates, _loading]) => templates)), this.store.pipe(select(getAnonymousConsentTemplatesValue)));
    }
    /**
     * Returns the anonymous consent templates with the given template code.
     * @param templateCode a template code by which to filter anonymous consent templates.
     */
    getTemplate(templateCode) {
        return this.store.pipe(select(getAnonymousConsentTemplate(templateCode)));
    }
    /**
     * Returns an indicator for the loading status for the anonymous consent templates.
     */
    getLoadTemplatesLoading() {
        return this.store.pipe(select(getAnonymousConsentTemplatesLoading));
    }
    /**
     * Returns an indicator for the success status for the anonymous consent templates.
     */
    getLoadTemplatesSuccess() {
        return this.store.pipe(select(getAnonymousConsentTemplatesSuccess));
    }
    /**
     * Returns an indicator for the error status for the anonymous consent templates.
     */
    getLoadTemplatesError() {
        return this.store.pipe(select(getAnonymousConsentTemplatesError));
    }
    /**
     * Resets the loading, success and error indicators for the anonymous consent templates.
     */
    resetLoadTemplatesState() {
        this.store.dispatch(new ResetLoadAnonymousConsentTemplates());
    }
    /**
     * Returns all the anonymous consents.
     */
    getConsents() {
        return this.store.pipe(select(getAnonymousConsents));
    }
    /**
     * Puts the provided anonymous consents into the store.
     */
    setConsents(consents) {
        return this.store.dispatch(new SetAnonymousConsents(consents));
    }
    /**
     * Returns the anonymous consent for the given template ID.
     *
     * As a side-effect, the method will call `getTemplates(true)` to load the templates if those are not present.
     *
     * @param templateId a template ID by which to filter anonymous consent templates.
     */
    getConsent(templateId) {
        return this.authService.isUserLoggedIn().pipe(filter((authenticated) => !authenticated), tap(() => this.getTemplates(true)), switchMap(() => this.store.pipe(select(getAnonymousConsentByTemplateCode(templateId)))));
    }
    /**
     * Give a consent for the given `templateCode`
     * @param templateCode for which to give the consent
     */
    giveConsent(templateCode) {
        this.store.dispatch(new GiveAnonymousConsent(templateCode));
    }
    /**
     * Sets all the anonymous consents' state to given.
     */
    giveAllConsents() {
        return this.getTemplates(true).pipe(tap((templates) => templates.forEach((template) => {
            if (template.id) {
                this.giveConsent(template.id);
            }
        })));
    }
    /**
     * Returns `true` if the provided `consent` is given.
     * @param consent a consent to test
     */
    isConsentGiven(consent) {
        var _a;
        return ((_a = (consent && consent.consentState === ANONYMOUS_CONSENT_STATUS.GIVEN)) !== null && _a !== void 0 ? _a : false);
    }
    /**
     * Withdraw a consent for the given `templateCode`
     * @param templateCode for which to withdraw the consent
     */
    withdrawConsent(templateCode) {
        this.store.dispatch(new WithdrawAnonymousConsent(templateCode));
    }
    /**
     * Sets all the anonymous consents' state to withdrawn.
     */
    withdrawAllConsents() {
        return this.getTemplates(true).pipe(tap((templates) => templates.forEach((template) => {
            if (template.id) {
                this.withdrawConsent(template.id);
            }
        })));
    }
    /**
     * Returns `true` if the provided `consent` is withdrawn.
     * @param consent a consent to test
     */
    isConsentWithdrawn(consent) {
        return (consent && consent.consentState === ANONYMOUS_CONSENT_STATUS.WITHDRAWN);
    }
    /**
     * Toggles the dismissed state of the anonymous consents banner.
     * @param dismissed the banner will be dismissed if `true` is passed, otherwise it will be visible.
     */
    toggleBannerDismissed(dismissed) {
        this.store.dispatch(new ToggleAnonymousConsentsBannerDissmissed(dismissed));
        if (dismissed) {
            this.toggleTemplatesUpdated(false);
        }
    }
    /**
     * Returns `true` if the banner was dismissed, `false` otherwise.
     */
    isBannerDismissed() {
        return this.store.pipe(select(getAnonymousConsentsBannerDismissed));
    }
    /**
     * Returns `true` if the consent templates were updated on the back-end.
     * If the templates are not present in the store, it triggers the load.
     */
    getTemplatesUpdated() {
        return this.getTemplates(true).pipe(switchMap(() => this.store.pipe(select(getAnonymousConsentTemplatesUpdate))));
    }
    /**
     * Toggles the `updated` slice of the state
     * @param updated
     */
    toggleTemplatesUpdated(updated) {
        this.store.dispatch(new ToggleAnonymousConsentTemplatesUpdated(updated));
    }
    /**
     * Returns `true` if either the banner is not dismissed or if the templates were updated on the back-end.
     * Otherwise, it returns `false`.
     */
    isBannerVisible() {
        return combineLatest([
            this.isBannerDismissed(),
            this.getTemplatesUpdated(),
        ]).pipe(tap(() => this.checkConsentVersions()), map(([dismissed, updated]) => !dismissed || updated));
    }
    /**
     * Dispatches an action to trigger the check
     * whether the anonymous consent version have been updated
     */
    checkConsentVersions() {
        this.store.dispatch(new AnonymousConsentCheckUpdatedVersions());
    }
    /**
     * Returns `true` if there's a mismatch in template versions between the provided `currentTemplates` and `newTemplates`
     * @param currentTemplates current templates to check
     * @param newTemplates new templates to check
     */
    detectUpdatedTemplates(currentTemplates, newTemplates) {
        if (newTemplates.length !== currentTemplates.length) {
            return true;
        }
        for (let i = 0; i < newTemplates.length; i++) {
            const newTemplate = newTemplates[i];
            const currentTemplate = currentTemplates[i];
            if (newTemplate.version !== currentTemplate.version) {
                return true;
            }
        }
        return false;
    }
    /**
     * Serializes using `JSON.stringify()` and encodes using `encodeURIComponent()` methods
     * @param consents to serialize and encode
     */
    serializeAndEncode(consents) {
        if (!consents) {
            return '';
        }
        const serialized = JSON.stringify(consents);
        const encoded = encodeURIComponent(serialized);
        return encoded;
    }
    /**
     * Decodes using `decodeURIComponent()` and deserializes using `JSON.parse()`
     * @param rawConsents to decode an deserialize
     */
    decodeAndDeserialize(rawConsents) {
        const decoded = decodeURIComponent(rawConsents);
        if (decoded.length > 0) {
            const unserialized = JSON.parse(decoded);
            return unserialized;
        }
        return [];
    }
    /**
     *
     * Compares the given `newConsents` and `previousConsents` and returns `true` if there are differences (the `newConsents` are updates).
     * Otherwise it returns `false`.
     *
     * @param newConsents new consents to compare
     * @param previousConsents old consents to compare
     */
    consentsUpdated(newConsents, previousConsents) {
        const newRawConsents = this.serializeAndEncode(newConsents);
        const previousRawConsents = this.serializeAndEncode(previousConsents);
        return newRawConsents !== previousRawConsents;
    }
}
AnonymousConsentsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsService, deps: [{ token: i1$2.Store }, { token: AuthService }], target: i0.ɵɵFactoryTarget.Injectable });
AnonymousConsentsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: AuthService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const USE_CLIENT_TOKEN = 'cx-use-client-token';
const USE_CUSTOMER_SUPPORT_AGENT_TOKEN = 'cx-use-csagent-token';
class InterceptorUtil {
    static createHeader(headerName, interceptorParam, headers) {
        if (headers) {
            return headers.append(headerName, JSON.stringify(interceptorParam));
        }
        headers = new HttpHeaders().set(headerName, JSON.stringify(interceptorParam));
        return headers;
    }
    static removeHeader(headerName, request) {
        const updatedHeaders = request.headers.delete(headerName);
        return request.clone({ headers: updatedHeaders });
    }
    static getInterceptorParam(headerName, headers) {
        const rawValue = headers.get(headerName);
        if (rawValue) {
            return JSON.parse(rawValue);
        }
        return undefined;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function isNotUndefined(value) {
    return typeof value !== 'undefined';
}
function isNotNullable(value) {
    return isNotUndefined(value) && value !== null;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CLIENT_AUTH_FEATURE = 'client-auth';
const CLIENT_TOKEN_DATA = '[Client auth] Client Token Data';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_CLIENT_TOKEN = '[Token] Load Client Token';
const LOAD_CLIENT_TOKEN_FAIL = '[Token] Load Client Token Fail';
const LOAD_CLIENT_TOKEN_SUCCESS = '[Token] Load Client Token Success';
class LoadClientToken extends LoaderLoadAction {
    constructor() {
        super(CLIENT_TOKEN_DATA);
        this.type = LOAD_CLIENT_TOKEN;
    }
}
class LoadClientTokenFail extends LoaderFailAction {
    constructor(payload) {
        super(CLIENT_TOKEN_DATA, payload);
        this.payload = payload;
        this.type = LOAD_CLIENT_TOKEN_FAIL;
    }
}
class LoadClientTokenSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(CLIENT_TOKEN_DATA);
        this.payload = payload;
        this.type = LOAD_CLIENT_TOKEN_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var clientTokenGroup_actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LOAD_CLIENT_TOKEN: LOAD_CLIENT_TOKEN,
    LOAD_CLIENT_TOKEN_FAIL: LOAD_CLIENT_TOKEN_FAIL,
    LOAD_CLIENT_TOKEN_SUCCESS: LOAD_CLIENT_TOKEN_SUCCESS,
    LoadClientToken: LoadClientToken,
    LoadClientTokenFail: LoadClientTokenFail,
    LoadClientTokenSuccess: LoadClientTokenSuccess
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getClientAuthState = createFeatureSelector(CLIENT_AUTH_FEATURE);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getClientTokenState = createSelector(getClientAuthState, (state) => state.clientToken);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var clientTokenGroup_selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getClientTokenState: getClientTokenState,
    getClientAuthState: getClientAuthState
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Serves a role of a facade on client token store.
 */
class ClientTokenService {
    constructor(store) {
        this.store = store;
    }
    /**
     * Returns a client token. The client token from the store is returned if there is one.
     * Otherwise a new token is fetched from the backend and saved in the store.
     */
    getClientToken() {
        return this.store.pipe(select(getClientTokenState), observeOn(queueScheduler), filter((state) => {
            if (this.isClientTokenLoaded(state)) {
                return true;
            }
            else {
                if (!state.loading) {
                    this.store.dispatch(new LoadClientToken());
                }
                return false;
            }
        }), map((state) => state.value));
    }
    /**
     * Fetches a clientToken from the backend and saves it in the store where getClientToken can use it.
     * The new clientToken is returned.
     */
    refreshClientToken() {
        this.store.dispatch(new LoadClientToken());
        return this.store.pipe(select(getClientTokenState), filter((state) => this.isClientTokenLoaded(state)), map((state) => state.value), filter(isNotUndefined));
    }
    isClientTokenLoaded(state) {
        return Boolean((state.success || state.error) && !state.loading);
    }
}
ClientTokenService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientTokenService, deps: [{ token: i1$2.Store }], target: i0.ɵɵFactoryTarget.Injectable });
ClientTokenService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientTokenService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientTokenService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }]; } });

/**
 * Service for handling `Authorization` header and errors for requests that
 * require client token (eg. user registration).
 */
class ClientErrorHandlingService {
    constructor(clientTokenService) {
        this.clientTokenService = clientTokenService;
    }
    /**
     * Refreshes client token and retries the request with the new token.
     *
     * @param request
     * @param httpHandler
     */
    handleExpiredClientToken(request, next) {
        return this.clientTokenService.refreshClientToken().pipe(take(1), switchMap((token) => {
            return next.handle(this.createNewRequestWithNewToken(request, token));
        }));
    }
    /**
     * Clones the requests and provided `Authorization` header.
     *
     * @param request
     * @param token
     */
    createNewRequestWithNewToken(request, token) {
        request = request.clone({
            setHeaders: {
                Authorization: `${token.token_type || 'Bearer'} ${token.access_token}`,
            },
        });
        return request;
    }
}
ClientErrorHandlingService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientErrorHandlingService, deps: [{ token: ClientTokenService }], target: i0.ɵɵFactoryTarget.Injectable });
ClientErrorHandlingService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientErrorHandlingService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientErrorHandlingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ClientTokenService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class StringTemplate {
    /**
     * Populates the given template with the variables provided
     *
     * @param templateString template of the OCC endpoint
     * @param templateVariables variables to replace in the template
     * @param encodeVariable encode variable before placing it in the template
     */
    static resolve(templateString, templateVariables, encodeVariable) {
        for (const variableLabel of Object.keys(templateVariables)) {
            const placeholder = new RegExp('\\${' + variableLabel + '}', 'g');
            templateString = templateString.replace(placeholder, 
            // TODO 4.0: default to encodeVariable = true
            encodeVariable
                ? encodeURIComponent(templateVariables[variableLabel])
                : templateVariables[variableLabel]);
        }
        return templateString;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Helper function for safely getting context parameter config
 *
 * @param config
 * @param parameter
 */
function getContextParameterValues(config, parameter) {
    return (config.context && config.context[parameter]) || [];
}
/**
 * Helper function for calculating default value for context parameter from config
 *
 * @param config
 * @param parameter
 */
function getContextParameterDefault(config, parameter) {
    const param = getContextParameterValues(config, parameter);
    return param && param.length ? param[0] : undefined;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LANGUAGE_CONTEXT_ID = 'language';
const CURRENCY_CONTEXT_ID = 'currency';
const BASE_SITE_CONTEXT_ID = 'baseSite';
const THEME_CONTEXT_ID = 'theme';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class HttpParamsURIEncoder {
    encodeKey(key) {
        return encodeURIComponent(key);
    }
    encodeValue(value) {
        return encodeURIComponent(value);
    }
    decodeKey(key) {
        return decodeURIComponent(key);
    }
    decodeValue(value) {
        return decodeURIComponent(value);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const DEFAULT_SCOPE = 'default';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Joins the multiple parts with '/' to create a url
 *
 * @param parts the distinct parts of the url to join
 */
function urlPathJoin(...parts) {
    var _a, _b;
    const paths = [];
    parts = parts.filter((part) => Boolean(part));
    for (const part of parts) {
        paths.push(cleanSlashes(part));
    }
    if ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.startsWith('/')) {
        paths[0] = '/' + paths[0];
    }
    if ((_b = parts[parts.length - 1]) === null || _b === void 0 ? void 0 : _b.endsWith('/')) {
        paths[paths.length - 1] = paths[paths.length - 1] + '/';
    }
    return paths.join('/');
}
function cleanSlashes(path) {
    path = path.startsWith('/') ? path.slice(1) : path;
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    return path;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_BASE_SITE = '[Site-context] Load BaseSite';
const LOAD_BASE_SITE_FAIL = '[Site-context] Load BaseSite Fail';
const LOAD_BASE_SITE_SUCCESS = '[Site-context] Load BaseSite Success';
const LOAD_BASE_SITES = '[Site-context] Load BaseSites';
const LOAD_BASE_SITES_FAIL = '[Site-context] Load BaseSites Fail';
const LOAD_BASE_SITES_SUCCESS = '[Site-context] Load BaseSites Success';
const SET_ACTIVE_BASE_SITE = '[Site-context] Set Active BaseSite';
const BASE_SITE_CHANGE = '[Site-context] BaseSite Change';
class LoadBaseSite {
    constructor() {
        this.type = LOAD_BASE_SITE;
    }
}
class LoadBaseSiteFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BASE_SITE_FAIL;
    }
}
class LoadBaseSiteSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BASE_SITE_SUCCESS;
    }
}
class LoadBaseSites {
    constructor() {
        this.type = LOAD_BASE_SITES;
    }
}
class LoadBaseSitesFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BASE_SITES_FAIL;
    }
}
class LoadBaseSitesSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BASE_SITES_SUCCESS;
    }
}
class SetActiveBaseSite {
    constructor(payload) {
        this.payload = payload;
        this.type = SET_ACTIVE_BASE_SITE;
    }
}
class BaseSiteChange {
    constructor() {
        this.type = BASE_SITE_CHANGE;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_CURRENCIES = '[Site-context] Load Currencies';
const LOAD_CURRENCIES_FAIL = '[Site-context] Load Currencies Fail';
const LOAD_CURRENCIES_SUCCESS = '[Site-context] Load Currencies Success';
const SET_ACTIVE_CURRENCY = '[Site-context] Set Active Currency';
const CURRENCY_CHANGE = '[Site-context] Currency Change';
class LoadCurrencies {
    constructor() {
        this.type = LOAD_CURRENCIES;
    }
}
class LoadCurrenciesFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_CURRENCIES_FAIL;
    }
}
class LoadCurrenciesSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_CURRENCIES_SUCCESS;
    }
}
class SetActiveCurrency {
    constructor(payload) {
        this.payload = payload;
        this.type = SET_ACTIVE_CURRENCY;
    }
}
class CurrencyChange {
    constructor(payload) {
        this.payload = payload;
        this.type = CURRENCY_CHANGE;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_LANGUAGES = '[Site-context] Load Languages';
const LOAD_LANGUAGES_FAIL = '[Site-context] Load Languages Fail';
const LOAD_LANGUAGES_SUCCESS = '[Site-context] Load Languages Success';
const SET_ACTIVE_LANGUAGE = '[Site-context] Set Active Language';
const LANGUAGE_CHANGE = '[Site-context] Language Change';
class LoadLanguages {
    constructor() {
        this.type = LOAD_LANGUAGES;
    }
}
class LoadLanguagesFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_LANGUAGES_FAIL;
    }
}
class LoadLanguagesSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_LANGUAGES_SUCCESS;
    }
}
class SetActiveLanguage {
    constructor(payload) {
        this.payload = payload;
        this.type = SET_ACTIVE_LANGUAGE;
    }
}
class LanguageChange {
    constructor(payload) {
        this.payload = payload;
        this.type = LANGUAGE_CHANGE;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var siteContextGroup_actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LOAD_BASE_SITE: LOAD_BASE_SITE,
    LOAD_BASE_SITE_FAIL: LOAD_BASE_SITE_FAIL,
    LOAD_BASE_SITE_SUCCESS: LOAD_BASE_SITE_SUCCESS,
    LOAD_BASE_SITES: LOAD_BASE_SITES,
    LOAD_BASE_SITES_FAIL: LOAD_BASE_SITES_FAIL,
    LOAD_BASE_SITES_SUCCESS: LOAD_BASE_SITES_SUCCESS,
    SET_ACTIVE_BASE_SITE: SET_ACTIVE_BASE_SITE,
    BASE_SITE_CHANGE: BASE_SITE_CHANGE,
    LoadBaseSite: LoadBaseSite,
    LoadBaseSiteFail: LoadBaseSiteFail,
    LoadBaseSiteSuccess: LoadBaseSiteSuccess,
    LoadBaseSites: LoadBaseSites,
    LoadBaseSitesFail: LoadBaseSitesFail,
    LoadBaseSitesSuccess: LoadBaseSitesSuccess,
    SetActiveBaseSite: SetActiveBaseSite,
    BaseSiteChange: BaseSiteChange,
    LOAD_CURRENCIES: LOAD_CURRENCIES,
    LOAD_CURRENCIES_FAIL: LOAD_CURRENCIES_FAIL,
    LOAD_CURRENCIES_SUCCESS: LOAD_CURRENCIES_SUCCESS,
    SET_ACTIVE_CURRENCY: SET_ACTIVE_CURRENCY,
    CURRENCY_CHANGE: CURRENCY_CHANGE,
    LoadCurrencies: LoadCurrencies,
    LoadCurrenciesFail: LoadCurrenciesFail,
    LoadCurrenciesSuccess: LoadCurrenciesSuccess,
    SetActiveCurrency: SetActiveCurrency,
    CurrencyChange: CurrencyChange,
    LOAD_LANGUAGES: LOAD_LANGUAGES,
    LOAD_LANGUAGES_FAIL: LOAD_LANGUAGES_FAIL,
    LOAD_LANGUAGES_SUCCESS: LOAD_LANGUAGES_SUCCESS,
    SET_ACTIVE_LANGUAGE: SET_ACTIVE_LANGUAGE,
    LANGUAGE_CHANGE: LANGUAGE_CHANGE,
    LoadLanguages: LoadLanguages,
    LoadLanguagesFail: LoadLanguagesFail,
    LoadLanguagesSuccess: LoadLanguagesSuccess,
    SetActiveLanguage: SetActiveLanguage,
    LanguageChange: LanguageChange
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const SITE_CONTEXT_FEATURE = 'siteContext';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getSiteContextState = createFeatureSelector(SITE_CONTEXT_FEATURE);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const sitesEntitiesSelector = (state) => state.entities;
const getBaseSiteState = createSelector(getSiteContextState, (state) => state.baseSite);
const getActiveBaseSite = createSelector(getSiteContextState, (state) => state && state.baseSite && state.baseSite.activeSite);
const getBaseSiteData = createSelector(getSiteContextState, (state) => state && state.baseSite && state.baseSite.details);
const getBaseSitesEntities = createSelector(getBaseSiteState, sitesEntitiesSelector);
const getAllBaseSites = createSelector(getBaseSitesEntities, (entities) => {
    return entities ? Object.keys(entities).map((uid) => entities[uid]) : null;
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const currenciesEntitiesSelector = (state) => state.entities;
const activeCurrencySelector = (state) => state.activeCurrency;
const getCurrenciesState = createSelector(getSiteContextState, (state) => state.currencies);
const getCurrenciesEntities = createSelector(getCurrenciesState, currenciesEntitiesSelector);
const getActiveCurrency = createSelector(getCurrenciesState, activeCurrencySelector);
const getAllCurrencies = createSelector(getCurrenciesEntities, (entities) => {
    return entities
        ? Object.keys(entities).map((isocode) => entities[isocode])
        : null;
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const activeLanguageSelector = (state) => state.activeLanguage;
const languagesEntitiesSelector = (state) => state.entities;
const getLanguagesState = createSelector(getSiteContextState, (state) => state.languages);
const getLanguagesEntities = createSelector(getLanguagesState, languagesEntitiesSelector);
const getActiveLanguage = createSelector(getLanguagesState, activeLanguageSelector);
const getAllLanguages = createSelector(getLanguagesEntities, (entities) => {
    return entities
        ? Object.keys(entities).map((isocode) => entities[isocode])
        : null;
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var siteContextGroup_selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getBaseSiteState: getBaseSiteState,
    getActiveBaseSite: getActiveBaseSite,
    getBaseSiteData: getBaseSiteData,
    getBaseSitesEntities: getBaseSitesEntities,
    getAllBaseSites: getAllBaseSites,
    getCurrenciesState: getCurrenciesState,
    getCurrenciesEntities: getCurrenciesEntities,
    getActiveCurrency: getActiveCurrency,
    getAllCurrencies: getAllCurrencies,
    getLanguagesState: getLanguagesState,
    getLanguagesEntities: getLanguagesEntities,
    getActiveLanguage: getActiveLanguage,
    getAllLanguages: getAllLanguages,
    getSiteContextState: getSiteContextState
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class BaseSiteService {
    constructor(store, config) {
        this.store = store;
        this.config = config;
    }
    /**
     * Represents the current baseSite uid.
     */
    getActive() {
        return this.store.pipe(select(getActiveBaseSite), filter((active) => Boolean(active)));
    }
    /**
     * Get all base sites data
     */
    getAll() {
        return this.store.pipe(select(getAllBaseSites), tap((sites) => {
            if (!sites) {
                this.store.dispatch(new LoadBaseSites());
            }
        }), filter(isNotNullable));
    }
    /**
     * Get base site data based on site uid
     */
    get(siteUid) {
        if (siteUid) {
            return this.getAll().pipe(map((sites) => sites.find((site) => site.uid === siteUid)));
        }
        return this.getActive().pipe(switchMap((activeSiteUid) => this.getAll().pipe(map((sites) => sites.find((site) => site.uid === activeSiteUid)))));
    }
    setActive(baseSite) {
        this.store
            .pipe(select(getActiveBaseSite), take(1))
            .subscribe((activeBaseSite) => {
            if (baseSite && activeBaseSite !== baseSite) {
                this.store.dispatch(new SetActiveBaseSite(baseSite));
            }
        });
    }
    /**
     * Tells whether the value of the base site has been already initialized
     */
    isInitialized() {
        let valueInitialized = false;
        this.getActive()
            .subscribe(() => (valueInitialized = true))
            .unsubscribe();
        return valueInitialized;
    }
    /**
     * Tells whether the given iso code is allowed.
     *
     * The list of allowed iso codes can be configured in the `context` config of Spartacus.
     */
    isValid(value) {
        return (!!value &&
            getContextParameterValues(this.config, BASE_SITE_CONTEXT_ID).includes(value));
    }
}
BaseSiteService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteService, deps: [{ token: i1$2.Store }, { token: SiteContextConfig }], target: i0.ɵɵFactoryTarget.Injectable });
BaseSiteService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: SiteContextConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccEndpointsService {
    constructor(config, baseSiteService) {
        this.config = config;
        this.baseSiteService = baseSiteService;
        if (this.baseSiteService) {
            this.baseSiteService
                .getActive()
                .subscribe((value) => (this._activeBaseSite = value));
        }
    }
    get activeBaseSite() {
        var _a;
        return ((_a = this._activeBaseSite) !== null && _a !== void 0 ? _a : getContextParameterDefault(this.config, BASE_SITE_CONTEXT_ID));
    }
    /**
     * Returns the value configured for a specific endpoint
     *
     * @param endpointKey the configuration key for the endpoint to return
     * @param scope endpoint configuration scope
     */
    getRawEndpointValue(endpoint, scope) {
        const endpointValue = this.getEndpointForScope(endpoint, scope);
        return endpointValue;
    }
    /**
     * Returns true when the endpoint is configured
     *
     * @param endpointKey the configuration key for the endpoint to return
     * @param scope endpoint configuration scope
     */
    isConfigured(endpoint, scope) {
        return !(typeof this.getEndpointFromConfig(endpoint, scope) === 'undefined');
    }
    /**
     * Returns base OCC endpoint (baseUrl + prefix + baseSite) base on provided values
     *
     * @param baseUrlProperties Specify properties to not add to the url (baseUrl, prefix, baseSite)
     */
    getBaseUrl(baseUrlProperties = {
        baseUrl: true,
        prefix: true,
        baseSite: true,
    }) {
        var _a, _b, _c, _d;
        const baseUrl = baseUrlProperties.baseUrl === false
            ? ''
            : (_d = (_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.backend) === null || _b === void 0 ? void 0 : _b.occ) === null || _c === void 0 ? void 0 : _c.baseUrl) !== null && _d !== void 0 ? _d : '';
        const prefix = baseUrlProperties.prefix === false ? '' : this.getPrefix();
        const baseSite = baseUrlProperties.baseSite === false ? '' : this.activeBaseSite;
        return urlPathJoin(baseUrl, prefix, baseSite);
    }
    /**
     * Returns a fully qualified OCC Url
     *
     * @param endpoint Name of the OCC endpoint key
     * @param attributes Dynamic attributes used to build the url
     * @param propertiesToOmit Specify properties to not add to the url (baseUrl, prefix, baseSite)
     */
    buildUrl(endpoint, attributes, propertiesToOmit) {
        let url = this.getEndpointForScope(endpoint, attributes === null || attributes === void 0 ? void 0 : attributes.scope);
        if (attributes) {
            const { urlParams, queryParams } = attributes;
            if (urlParams) {
                url = StringTemplate.resolve(url, urlParams, true);
            }
            if (queryParams) {
                let httpParamsOptions = { encoder: new HttpParamsURIEncoder() };
                if (url.includes('?')) {
                    let queryParamsFromEndpoint;
                    [url, queryParamsFromEndpoint] = url.split('?');
                    httpParamsOptions = Object.assign(Object.assign({}, httpParamsOptions), { fromString: queryParamsFromEndpoint });
                }
                let httpParams = new HttpParams(httpParamsOptions);
                Object.keys(queryParams).forEach((key) => {
                    const value = queryParams[key];
                    if (value !== undefined) {
                        if (value === null) {
                            httpParams = httpParams.delete(key);
                        }
                        else {
                            httpParams = httpParams.set(key, value);
                        }
                    }
                });
                const params = httpParams.toString();
                if (params.length) {
                    url += '?' + params;
                }
            }
        }
        return this.buildUrlFromEndpointString(url, propertiesToOmit);
    }
    getEndpointFromConfig(endpoint, scope) {
        var _a, _b;
        const endpointsConfig = (_b = (_a = this.config.backend) === null || _a === void 0 ? void 0 : _a.occ) === null || _b === void 0 ? void 0 : _b.endpoints;
        if (!endpointsConfig) {
            return undefined;
        }
        const endpointConfig = endpointsConfig[endpoint];
        if (scope) {
            if (scope === DEFAULT_SCOPE && typeof endpointConfig === 'string') {
                return endpointConfig;
            }
            return endpointConfig === null || endpointConfig === void 0 ? void 0 : endpointConfig[scope];
        }
        return typeof endpointConfig === 'string'
            ? endpointConfig
            : endpointConfig === null || endpointConfig === void 0 ? void 0 : endpointConfig[DEFAULT_SCOPE];
    }
    // TODO: Can we reuse getEndpointFromConfig in this method? Should we change behavior of this function?
    getEndpointForScope(endpoint, scope) {
        var _a, _b;
        const endpointsConfig = (_b = (_a = this.config.backend) === null || _a === void 0 ? void 0 : _a.occ) === null || _b === void 0 ? void 0 : _b.endpoints;
        if (!endpointsConfig) {
            return '';
        }
        const endpointConfig = endpointsConfig[endpoint];
        if (scope) {
            if (endpointConfig === null || endpointConfig === void 0 ? void 0 : endpointConfig[scope]) {
                return endpointConfig === null || endpointConfig === void 0 ? void 0 : endpointConfig[scope];
            }
            if (scope === DEFAULT_SCOPE && typeof endpointConfig === 'string') {
                return endpointConfig;
            }
            if (isDevMode()) {
                console.warn(`${endpoint} endpoint configuration missing for scope "${scope}"`);
            }
        }
        return ((typeof endpointConfig === 'string'
            ? endpointConfig
            : endpointConfig === null || endpointConfig === void 0 ? void 0 : endpointConfig[DEFAULT_SCOPE]) || endpoint);
    }
    /**
     * Add the base OCC url properties to the specified endpoint string
     *
     * @param endpointString String value for the url endpoint
     * @param propertiesToOmit Specify properties to not add to the url (baseUrl, prefix, baseSite)
     */
    buildUrlFromEndpointString(endpointString, propertiesToOmit) {
        return urlPathJoin(this.getBaseUrl(propertiesToOmit), endpointString);
    }
    getPrefix() {
        var _a, _b, _c, _d, _e, _f, _g;
        if (((_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.backend) === null || _b === void 0 ? void 0 : _b.occ) === null || _c === void 0 ? void 0 : _c.prefix) &&
            !this.config.backend.occ.prefix.startsWith('/')) {
            return '/' + this.config.backend.occ.prefix;
        }
        return (_g = (_f = (_e = (_d = this.config) === null || _d === void 0 ? void 0 : _d.backend) === null || _e === void 0 ? void 0 : _e.occ) === null || _f === void 0 ? void 0 : _f.prefix) !== null && _g !== void 0 ? _g : '';
    }
}
OccEndpointsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccEndpointsService, deps: [{ token: OccConfig }, { token: BaseSiteService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
OccEndpointsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccEndpointsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccEndpointsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: OccConfig }, { type: BaseSiteService, decorators: [{
                        type: Optional
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Interceptor for handling requests with `USE_CLIENT_TOKEN` header.
 * Provides `Authorization` header with client token and handles errors related to client auth.
 */
class ClientTokenInterceptor {
    constructor(clientTokenService, clientErrorHandlingService, occEndpoints) {
        this.clientTokenService = clientTokenService;
        this.clientErrorHandlingService = clientErrorHandlingService;
        this.occEndpoints = occEndpoints;
    }
    intercept(request, next) {
        const isClientTokenRequest = this.isClientTokenRequest(request);
        if (isClientTokenRequest) {
            request = InterceptorUtil.removeHeader(USE_CLIENT_TOKEN, request);
        }
        return this.getClientToken(isClientTokenRequest).pipe(take(1), switchMap((token) => {
            if ((token === null || token === void 0 ? void 0 : token.access_token) &&
                request.url.includes(this.occEndpoints.getBaseUrl())) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `${token.token_type || 'Bearer'} ${token.access_token}`,
                    },
                });
            }
            return next.handle(request).pipe(catchError((errResponse) => {
                if (errResponse instanceof HttpErrorResponse) {
                    if (errResponse.status === 401) {
                        if (isClientTokenRequest) {
                            if (this.isExpiredToken(errResponse)) {
                                return this.clientErrorHandlingService.handleExpiredClientToken(request, next);
                            }
                        }
                    }
                }
                return throwError(errResponse);
            }));
        }));
    }
    getClientToken(isClientTokenRequest) {
        if (isClientTokenRequest) {
            return this.clientTokenService.getClientToken();
        }
        return of(undefined);
    }
    isClientTokenRequest(request) {
        const isRequestMapping = InterceptorUtil.getInterceptorParam(USE_CLIENT_TOKEN, request.headers);
        return Boolean(isRequestMapping);
    }
    isExpiredToken(resp) {
        var _a, _b, _c;
        return ((_c = (_b = (_a = resp.error) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.type) === 'InvalidTokenError';
    }
}
ClientTokenInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientTokenInterceptor, deps: [{ token: ClientTokenService }, { token: ClientErrorHandlingService }, { token: OccEndpointsService }], target: i0.ɵɵFactoryTarget.Injectable });
ClientTokenInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientTokenInterceptor, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientTokenInterceptor, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: ClientTokenService }, { type: ClientErrorHandlingService }, { type: OccEndpointsService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const interceptors$2 = [
    {
        provide: HTTP_INTERCEPTORS,
        useExisting: ClientTokenInterceptor,
        multi: true,
    },
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var StorageSyncType;
(function (StorageSyncType) {
    StorageSyncType["NO_STORAGE"] = "NO_STORAGE";
    StorageSyncType["LOCAL_STORAGE"] = "LOCAL_STORAGE";
    StorageSyncType["SESSION_STORAGE"] = "SESSION_STORAGE";
})(StorageSyncType || (StorageSyncType = {}));
var StateTransferType;
(function (StateTransferType) {
    StateTransferType["TRANSFER_STATE"] = "SSR";
})(StateTransferType || (StateTransferType = {}));
class StateConfig {
}
StateConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StateConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
StateConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StateConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StateConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getStorage(storageType, winRef) {
    let storage;
    switch (storageType) {
        case StorageSyncType.LOCAL_STORAGE: {
            storage = winRef.localStorage;
            break;
        }
        case StorageSyncType.SESSION_STORAGE: {
            storage = winRef.sessionStorage;
            break;
        }
        case StorageSyncType.NO_STORAGE: {
            storage = undefined;
            break;
        }
        default: {
            storage = winRef.sessionStorage;
        }
    }
    return storage;
}
function persistToStorage(configKey, value, storage) {
    if (!isSsr(storage) && value) {
        storage.setItem(configKey, JSON.stringify(value));
    }
}
function readFromStorage(storage, key) {
    if (isSsr(storage)) {
        return;
    }
    const storageValue = storage.getItem(key);
    if (!storageValue) {
        return;
    }
    return JSON.parse(storageValue);
}
function isSsr(storage) {
    return !Boolean(storage);
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class StatePersistenceService {
    constructor(winRef) {
        this.winRef = winRef;
    }
    /**
     * Helper to synchronize state to more persistent storage (localStorage, sessionStorage).
     * It is context aware, so you can keep different state for te same feature based on specified context.
     *
     * Eg. cart is valid only under the same base site. So you want to synchronize cart only with the same base site.
     * Usage for that case: `syncWithStorage({ key: 'cart', state$: activeCartSelector$, context$: this.siteContextParamsService.getValues([BASE_SITE_CONTEXT_ID]), onRead: (state) => setCorrectStateInStore(state) })`.
     * Active cart for the `electronics` base site will be stored under `spartacus⚿electronics⚿cart` and for apparel under `spartacus⚿apparel⚿cart`.
     *
     * On each context change onRead function will be executed with state from storage provided as a parameter.
     *
     * Omitting context$ will trigger onRead only once at initialization.
     *
     * @param key Key to use in storage for the synchronized state. Should be unique for each feature.
     * @param state$ State to be saved and later restored.
     * @param context$ Context for state
     * @param storageType Storage type to be used to persist state
     * @param onRead Function to be executed on each storage read after context change
     *
     * @returns Subscriptions for reading/writing in storage on context/state change
     */
    syncWithStorage({ key, state$, context$ = of(''), storageType = StorageSyncType.LOCAL_STORAGE, onRead = () => {
        // Intentional empty arrow function
    }, }) {
        const storage = getStorage(storageType, this.winRef);
        const subscriptions = new Subscription();
        // Do not change order of subscription! Read should happen before write on context change.
        subscriptions.add(context$
            .pipe(map((context) => {
            return storage
                ? readFromStorage(storage, this.generateKeyWithContext(context, key))
                : undefined;
        }), tap((state) => onRead(state)))
            .subscribe());
        if (storage) {
            subscriptions.add(state$.pipe(withLatestFrom(context$)).subscribe(([state, context]) => {
                persistToStorage(this.generateKeyWithContext(context, key), state, storage);
            }));
        }
        return subscriptions;
    }
    /**
     * Helper to read state from persistent storage (localStorage, sessionStorage).
     * It is useful if you need synchronously access state saved with `syncWithStorage`.
     *
     * @param key Key to use in storage for state. Should be unique for each feature.
     * @param context Context value for state
     * @param storageType Storage type from to read state
     *
     * @returns State from the storage
     */
    readStateFromStorage({ key, context = '', storageType = StorageSyncType.LOCAL_STORAGE, }) {
        const storage = getStorage(storageType, this.winRef);
        if (storage) {
            return readFromStorage(storage, this.generateKeyWithContext(context, key));
        }
    }
    generateKeyWithContext(context, key) {
        return `spartacus⚿${[]
            .concat(context)
            .join('⚿')}⚿${key}`;
    }
}
StatePersistenceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StatePersistenceService, deps: [{ token: WindowRef }], target: i0.ɵɵFactoryTarget.Injectable });
StatePersistenceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StatePersistenceService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StatePersistenceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: WindowRef }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Responsible for saving the authorization data (userId, token, redirectUrl) in browser storage.
 */
class AuthStatePersistenceService {
    constructor(statePersistenceService, userIdService, authStorageService, authRedirectStorageService) {
        this.statePersistenceService = statePersistenceService;
        this.userIdService = userIdService;
        this.authStorageService = authStorageService;
        this.authRedirectStorageService = authRedirectStorageService;
        this.subscription = new Subscription();
        /**
         * Identifier used for storage key.
         */
        this.key = 'auth';
    }
    /**
     * Initializes the synchronization between state and browser storage.
     */
    initSync() {
        this.subscription.add(this.statePersistenceService.syncWithStorage({
            key: this.key,
            state$: this.getAuthState(),
            onRead: (state) => this.onRead(state),
        }));
    }
    /**
     * Gets and transforms state from different sources into the form that should
     * be saved in storage.
     */
    getAuthState() {
        return combineLatest([
            this.authStorageService.getToken().pipe(filter((state) => !!state), map((state) => {
                return Object.assign({}, state);
            })),
            this.userIdService.getUserId(),
            this.authRedirectStorageService.getRedirectUrl(),
        ]).pipe(map(([authToken, userId, redirectUrl]) => {
            let token = authToken;
            if (token) {
                token = Object.assign({}, token);
                // To minimize risk of user account hijacking we don't persist user refresh_token
                delete token.refresh_token;
            }
            return { token, userId, redirectUrl };
        }));
    }
    /**
     * Function called on each browser storage read.
     * Used to update state from browser -> state.
     */
    onRead(state) {
        if (state === null || state === void 0 ? void 0 : state.token) {
            this.authStorageService.setToken(state.token);
        }
        if (state === null || state === void 0 ? void 0 : state.redirectUrl) {
            this.authRedirectStorageService.setRedirectUrl(state.redirectUrl);
        }
        if (state === null || state === void 0 ? void 0 : state.userId) {
            this.userIdService.setUserId(state.userId);
        }
        else {
            this.userIdService.clearUserId();
        }
    }
    /**
     * Reads synchronously state from storage and returns it.
     */
    readStateFromStorage() {
        return this.statePersistenceService.readStateFromStorage({
            key: this.key,
        });
    }
    /**
     * Check synchronously in browser storage if user is logged in (required by transfer state reducer).
     * For most cases `isUserLoggedIn` from the `AuthService` should be used instead of this.
     */
    isUserLoggedIn() {
        var _a, _b;
        return Boolean((_b = (_a = this.readStateFromStorage()) === null || _a === void 0 ? void 0 : _a.token) === null || _b === void 0 ? void 0 : _b.access_token);
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
AuthStatePersistenceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthStatePersistenceService, deps: [{ token: StatePersistenceService }, { token: UserIdService }, { token: AuthStorageService }, { token: AuthRedirectStorageService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthStatePersistenceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthStatePersistenceService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthStatePersistenceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: StatePersistenceService }, { type: UserIdService }, { type: AuthStorageService }, { type: AuthRedirectStorageService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CX_KEY = makeStateKey('cx-state');
function getTransferStateReducer(platformId, transferState, config, authStatePersistenceService) {
    var _a, _b;
    if (transferState && ((_b = (_a = config === null || config === void 0 ? void 0 : config.state) === null || _a === void 0 ? void 0 : _a.ssrTransfer) === null || _b === void 0 ? void 0 : _b.keys)) {
        if (isPlatformBrowser(platformId)) {
            return getBrowserTransferStateReducer(transferState, config.state.ssrTransfer.keys, Boolean(authStatePersistenceService === null || authStatePersistenceService === void 0 ? void 0 : authStatePersistenceService.isUserLoggedIn()));
        }
        else if (isPlatformServer(platformId)) {
            return getServerTransferStateReducer(transferState, config.state.ssrTransfer.keys);
        }
    }
    return (reducer) => reducer;
}
function getServerTransferStateReducer(transferState, keys) {
    const transferStateKeys = filterKeysByType(keys, StateTransferType.TRANSFER_STATE);
    return function (reducer) {
        return function (state, action) {
            const newState = reducer(state, action);
            if (newState) {
                const stateSlice = getStateSlice(transferStateKeys, [], newState);
                transferState.set(CX_KEY, stateSlice);
            }
            return newState;
        };
    };
}
function getBrowserTransferStateReducer(transferState, keys, isLoggedIn) {
    const transferStateKeys = filterKeysByType(keys, StateTransferType.TRANSFER_STATE);
    return function (reducer) {
        return function (state, action) {
            if (action.type === INIT) {
                if (!state) {
                    state = reducer(state, action);
                }
                if (!isLoggedIn && transferState.hasKey(CX_KEY)) {
                    const cxKey = transferState.get(CX_KEY, {});
                    const transferredStateSlice = getStateSlice(transferStateKeys, [], cxKey);
                    state = deepMerge({}, state, transferredStateSlice);
                }
                return state;
            }
            return reducer(state, action);
        };
    };
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const TRANSFER_STATE_META_REDUCER = new InjectionToken('TransferStateMetaReducer');
const stateMetaReducers = [
    {
        provide: TRANSFER_STATE_META_REDUCER,
        useFactory: getTransferStateReducer,
        deps: [
            PLATFORM_ID,
            [new Optional(), TransferState],
            [new Optional(), Config],
            [new Optional(), AuthStatePersistenceService],
        ],
    },
    {
        provide: META_REDUCERS,
        useExisting: TRANSFER_STATE_META_REDUCER,
        multi: true,
    },
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class StateModule {
    static forRoot() {
        return {
            ngModule: StateModule,
            providers: [...stateMetaReducers],
        };
    }
}
StateModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StateModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
StateModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: StateModule });
StateModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StateModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StateModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Normalizes HttpErrorResponse to HttpErrorModel.
 *
 * Can be used as a safe and generic way for embodying http errors into
 * NgRx Action payload, as it will strip potentially unserializable parts from
 * it and warn in debug mode if passed error is not instance of HttpErrorModel
 * (which usually happens when logic in NgRx Effect is not sealed correctly)
 */
function normalizeHttpError(error) {
    if (error instanceof HttpErrorModel) {
        return error;
    }
    if (error instanceof HttpErrorResponse) {
        const normalizedError = new HttpErrorModel();
        normalizedError.message = error.message;
        normalizedError.status = error.status;
        normalizedError.statusText = error.statusText;
        normalizedError.url = error.url;
        // include backend's error details
        if (Array.isArray(error.error.errors)) {
            normalizedError.details = error.error.errors;
        }
        else if (typeof error.error.error === 'string') {
            normalizedError.details = [
                {
                    type: error.error.error,
                    message: error.error.error_description,
                },
            ];
        }
        return normalizedError;
    }
    if (isDevMode()) {
        console.error('Error passed to normalizeHttpError is not HttpErrorResponse instance', error);
    }
    return undefined;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Responsible for requesting from OAuth server `ClientToken` for a particular
 * auth client.
 */
class ClientAuthenticationTokenService {
    constructor(http, authConfigService) {
        this.http = http;
        this.authConfigService = authConfigService;
    }
    /**
     * Loads token with client authentication flow.
     *
     * @returns observable with ClientToken
     */
    loadClientAuthenticationToken() {
        const url = this.authConfigService.getTokenEndpoint();
        const params = new HttpParams()
            .set('client_id', encodeURIComponent(this.authConfigService.getClientId()))
            .set('client_secret', encodeURIComponent(this.authConfigService.getClientSecret()))
            .set('grant_type', 'client_credentials');
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        return this.http.post(url, params, { headers });
    }
}
ClientAuthenticationTokenService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthenticationTokenService, deps: [{ token: i1$3.HttpClient }, { token: AuthConfigService }], target: i0.ɵɵFactoryTarget.Injectable });
ClientAuthenticationTokenService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthenticationTokenService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthenticationTokenService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: AuthConfigService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ClientTokenEffect {
    constructor(actions$, clientAuthenticationTokenService) {
        this.actions$ = actions$;
        this.clientAuthenticationTokenService = clientAuthenticationTokenService;
        this.loadClientToken$ = createEffect(() => this.actions$.pipe(ofType(LOAD_CLIENT_TOKEN), exhaustMap(() => {
            return this.clientAuthenticationTokenService
                .loadClientAuthenticationToken()
                .pipe(map((token) => {
                return new LoadClientTokenSuccess(token);
            }), catchError((error) => of(new LoadClientTokenFail(normalizeHttpError(error)))));
        })));
    }
}
ClientTokenEffect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientTokenEffect, deps: [{ token: i1$4.Actions }, { token: ClientAuthenticationTokenService }], target: i0.ɵɵFactoryTarget.Injectable });
ClientTokenEffect.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientTokenEffect });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientTokenEffect, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: ClientAuthenticationTokenService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const effects$6 = [ClientTokenEffect];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getReducers$8() {
    return {
        clientToken: loaderReducer(CLIENT_TOKEN_DATA),
    };
}
const reducerToken$8 = new InjectionToken('ClientAuthReducers');
const reducerProvider$8 = {
    provide: reducerToken$8,
    useFactory: getReducers$8,
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ClientAuthStoreModule {
}
ClientAuthStoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthStoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClientAuthStoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthStoreModule, imports: [CommonModule,
        HttpClientModule,
        StateModule, i1$2.StoreFeatureModule, i1$4.EffectsFeatureModule] });
ClientAuthStoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthStoreModule, providers: [reducerProvider$8], imports: [CommonModule,
        HttpClientModule,
        StateModule,
        StoreModule.forFeature(CLIENT_AUTH_FEATURE, reducerToken$8),
        EffectsModule.forFeature(effects$6)] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthStoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        HttpClientModule,
                        StateModule,
                        StoreModule.forFeature(CLIENT_AUTH_FEATURE, reducerToken$8),
                        EffectsModule.forFeature(effects$6),
                    ],
                    providers: [reducerProvider$8],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Some of the OCC endpoints require Authorization header with the client token (eg. user registration).
 * This pattern should not be used in the frontend apps, but until OCC changes this requirement
 * we provide this module to support using those endpoints.
 *
 * After OCC improvements regarding client authentication this module can be safely removed.
 */
class ClientAuthModule {
    static forRoot() {
        return {
            ngModule: ClientAuthModule,
            providers: [...interceptors$2],
        };
    }
}
ClientAuthModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ClientAuthModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthModule, imports: [CommonModule, ClientAuthStoreModule] });
ClientAuthModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthModule, imports: [CommonModule, ClientAuthStoreModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClientAuthModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClientAuthStoreModule],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CONFIG_INITIALIZER = new InjectionToken('ConfigInitializer');
const CONFIG_INITIALIZER_FORROOT_GUARD = new InjectionToken('CONFIG_INITIALIZER_FORROOT_GUARD');

/**
 * Provides support for CONFIG_INITIALIZERS
 */
class ConfigInitializerService {
    constructor(config, initializerGuard, rootConfig) {
        this.config = config;
        this.initializerGuard = initializerGuard;
        this.rootConfig = rootConfig;
        this.ongoingScopes$ = new BehaviorSubject(undefined);
    }
    /**
     * Returns true if config is stable, i.e. all CONFIG_INITIALIZERS resolved correctly
     */
    get isStable() {
        var _a;
        return !this.initializerGuard || ((_a = this.ongoingScopes$.value) === null || _a === void 0 ? void 0 : _a.length) === 0;
    }
    /**
     * Recommended way to get config for code that can run before app will finish
     * initialization (APP_INITIALIZERS, selected service constructors)
     *
     * Used without parameters waits for the whole config to become stable
     *
     * Parameters allow to describe which part of the config should be stable using
     * string describing config part, e.g.:
     * 'siteContext', 'siteContext.language', etc.
     *
     * @param scopes String describing parts of the config we want to be sure are stable
     */
    getStable(...scopes) {
        if (this.isStable) {
            return of(this.config);
        }
        return this.ongoingScopes$.pipe(filter((ongoingScopes) => !!ongoingScopes && this.areReady(scopes, ongoingScopes)), take(1), mapTo(this.config));
    }
    /**
     * Removes provided scopes from currently ongoingScopes
     *
     * @param scopes
     */
    finishScopes(scopes) {
        var _a;
        const newScopes = [...((_a = this.ongoingScopes$.value) !== null && _a !== void 0 ? _a : [])];
        for (const scope of scopes) {
            newScopes.splice(newScopes.indexOf(scope), 1);
        }
        this.ongoingScopes$.next(newScopes);
    }
    /**
     * Return true if provided scopes are not part of ongoingScopes
     *
     * @param scopes
     * @param ongoingScopes
     */
    areReady(scopes, ongoingScopes) {
        if (!scopes.length) {
            return !ongoingScopes.length;
        }
        for (const scope of scopes) {
            for (const ongoingScope of ongoingScopes) {
                if (this.scopesOverlap(scope, ongoingScope)) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Check if two scopes overlap.
     *
     * Example of scopes that overlap:
     * 'test' and 'test', 'test.a' and 'test', 'test' and 'test.a'
     *
     * Example of scopes that do not overlap:
     * 'test' and 'testA', 'test.a' and 'test.b', 'test.nested' and 'test.nest'
     *
     * @param a ScopeA
     * @param b ScopeB
     */
    scopesOverlap(a, b) {
        if (b.length > a.length) {
            [a, b] = [b, a];
        }
        return a.startsWith(b) && (a[b.length] || '.') === '.';
    }
    /**
     * @internal
     *
     * Not a part of a public API, used by APP_INITIALIZER to initialize all provided CONFIG_INITIALIZERS
     *
     */
    initialize(initializers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ongoingScopes$.value) {
                // guard for double initialization
                return;
            }
            const ongoingScopes = [];
            const asyncConfigs = [];
            for (const initializer of initializers || []) {
                if (!initializer) {
                    continue;
                }
                if (!initializer.scopes || !initializer.scopes.length) {
                    throw new Error('CONFIG_INITIALIZER should provide scope!');
                }
                if (isDevMode() && !this.areReady(initializer.scopes, ongoingScopes)) {
                    console.warn('More than one CONFIG_INITIALIZER is initializing the same config scope.');
                }
                ongoingScopes.push(...initializer.scopes);
                asyncConfigs.push((() => __awaiter(this, void 0, void 0, function* () {
                    const initializerConfig = yield initializer.configFactory();
                    // contribute configuration to rootConfig
                    deepMerge(this.rootConfig, initializerConfig);
                    // contribute configuration to global config
                    deepMerge(this.config, initializerConfig);
                    this.finishScopes(initializer.scopes);
                }))());
            }
            this.ongoingScopes$.next(ongoingScopes);
            if (asyncConfigs.length) {
                yield Promise.all(asyncConfigs);
            }
        });
    }
}
ConfigInitializerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigInitializerService, deps: [{ token: Config }, { token: CONFIG_INITIALIZER_FORROOT_GUARD, optional: true }, { token: RootConfig }], target: i0.ɵɵFactoryTarget.Injectable });
ConfigInitializerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigInitializerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigInitializerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: Config }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [CONFIG_INITIALIZER_FORROOT_GUARD]
                    }] }, { type: Config, decorators: [{
                        type: Inject,
                        args: [RootConfig]
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ConfigValidatorToken = new InjectionToken('ConfigurationValidator');
/**
 * Use to probide config validation at app bootstrap (when all config chunks are merged)
 *
 * @param configValidator
 */
function provideConfigValidator(configValidator) {
    return {
        provide: ConfigValidatorToken,
        useValue: configValidator,
        multi: true,
    };
}
function validateConfig(config, configValidators) {
    for (const validate of configValidators) {
        const warning = validate(config);
        if (warning) {
            console.warn(warning);
        }
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function baseUrlConfigValidator(config) {
    var _a, _b, _c, _d, _e;
    if (typeof ((_a = config === null || config === void 0 ? void 0 : config.authentication) === null || _a === void 0 ? void 0 : _a.baseUrl) === 'undefined' &&
        typeof ((_c = (_b = config === null || config === void 0 ? void 0 : config.backend) === null || _b === void 0 ? void 0 : _b.occ) === null || _c === void 0 ? void 0 : _c.baseUrl) === 'undefined' &&
        // Don't show warning when user tries to work around the issue.
        ((_e = (_d = config === null || config === void 0 ? void 0 : config.authentication) === null || _d === void 0 ? void 0 : _d.OAuthLibConfig) === null || _e === void 0 ? void 0 : _e.requireHttps) !== false) {
        return 'Authentication might not work correctly without setting either authentication.baseUrl or backend.occ.baseUrl configuration option! Workaround: To support relative urls in angular-oauth2-oidc library you can try setting authentication.OAuthLibConfig.requireHttps to false.';
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultAuthConfig = {
    authentication: {
        client_id: 'mobile_android',
        client_secret: 'secret',
        tokenEndpoint: '/oauth/token',
        revokeEndpoint: '/oauth/revoke',
        loginUrl: '/oauth/authorize',
        OAuthLibConfig: {
            scope: '',
            customTokenParameters: ['token_type'],
            strictDiscoveryDocumentValidation: false,
            skipIssuerCheck: true,
            disablePKCE: true,
            oidc: false,
            clearHashAfterLogin: false,
        },
    },
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Creates an instance of the given class and fills its properties with the given data.
 *
 * @param type reference to the class
 * @param data object with properties to be copied to the class
 */
function createFrom(type, data) {
    return Object.assign(new type(), data);
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Intended to be inherited by all other Spartacus' events.
 *
 * "One event to rule them all".
 */
class CxEvent {
}
/**
 * Event's type
 */
CxEvent.type = 'CxEvent';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Indicates that the user has logged out
 *
 * * The event is fired even for customer emulation
 * * The event is NOT fired for a ASM support agent authentication
 */
class LogoutEvent extends CxEvent {
}
/**
 * Event's type
 */
LogoutEvent.type = 'LogoutEvent';
/**
 * Indicates that the user has logged in
 *
 * * The event is fired even for customer emulation
 * * The event is NOT fired for a ASM support agent authentication
 */
class LoginEvent extends CxEvent {
}
/**
 * Event's type
 */
LoginEvent.type = 'LoginEvent';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
// PRIVATE API
/**
 * Allows for dynamic adding and removing source observables
 * and exposes them as one merged observable at a property `output$`.
 *
 * Thanks to the `share()` operator used inside, it subscribes to source observables
 * only when someone subscribes to it. And it unsubscribes from source observables
 * when the counter of consumers drops to 0.
 *
 * **To avoid memory leaks**, all manually added sources should be manually removed
 * when not plan to emit values anymore. In particular closed event sources won't be
 * automatically removed.
 */
class MergingSubject {
    constructor() {
        /**
         * List of already added sources (but not removed yet)
         */
        this.sources = [];
        /**
         * For each source: it stores a subscription responsible for
         * passing all values from source to the consumer
         */
        this.subscriptionsToSources = new Map();
        /**
         * Observable with all sources merged.
         *
         * Only after subscribing to it, under the hood it subscribes to the source observables.
         * When the number of subscribers drops to 0, it unsubscribes from all source observables.
         * But if later on something subscribes to it again, it subscribes to the source observables again.
         *
         * It multicasts the emissions for each subscriber.
         */
        this.output$ = new Observable((consumer) => {
            // There can be only 0 or 1 consumer of this observable coming from the `share()` operator
            // that is piped right after this observable.
            // `share()` not only multicasts the results but also  When all end-subscribers unsubscribe from `share()` operator, it will unsubscribe
            // from this observable (by the nature `refCount`-nature of the `share()` operator).
            this.consumer = consumer;
            this.bindAllSourcesToConsumer(consumer);
            return () => {
                this.consumer = null;
                this.unbindAllSourcesFromConsumer();
            };
        }).pipe(share());
        /**
         * Reference to the subscriber coming from the `share()` operator piped to the `output$` observable.
         * For more, see docs of the `output$` observable;
         */
        this.consumer = null;
    }
    /**
     * Registers the given source to pass its values to the `output$` observable.
     *
     * It does nothing, when the source has been already added (but not removed yet).
     */
    add(source) {
        if (this.has(source)) {
            return;
        }
        if (this.consumer) {
            this.bindSourceToConsumer(source, this.consumer);
        }
        this.sources.push(source);
    }
    /**
     * Starts passing all values from already added sources to consumer
     */
    bindAllSourcesToConsumer(consumer) {
        this.sources.forEach((source) => this.bindSourceToConsumer(source, consumer));
    }
    /**
     * Stops passing all values from already added sources to consumer
     * (if any consumer is active at the moment)
     */
    unbindAllSourcesFromConsumer() {
        this.sources.forEach((source) => this.unbindSourceFromConsumer(source));
    }
    /**
     * Starts passing all values from a single source to consumer
     */
    bindSourceToConsumer(source, consumer) {
        const subscriptionToSource = source.subscribe((val) => consumer.next(val)); // passes all emissions from source to consumer
        this.subscriptionsToSources.set(source, subscriptionToSource);
    }
    /**
     * Stops passing all values from a single source to consumer
     * (if any consumer is active at the moment)
     */
    unbindSourceFromConsumer(source) {
        const subscriptionToSource = this.subscriptionsToSources.get(source);
        if (subscriptionToSource !== undefined) {
            subscriptionToSource.unsubscribe();
            this.subscriptionsToSources.delete(source);
        }
    }
    /**
     * Unregisters the given source so it stops passing its values to `output$` observable.
     *
     * Should be used when a source is no longer maintained **to avoid memory leaks**.
     */
    remove(source) {
        // clear binding from source to consumer (if any consumer exists at the moment)
        this.unbindSourceFromConsumer(source);
        // remove source from array
        let i;
        if ((i = this.sources.findIndex((s) => s === source)) !== -1) {
            this.sources.splice(i, 1);
        }
    }
    /**
     * Returns whether the given source has been already addded
     */
    has(source) {
        return this.sources.includes(source);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A service to register and observe event sources. Events are driven by event types, which are class signatures
 * for the given event.
 *
 * It is possible to register multiple sources to a single event, even without
 * knowing as multiple decoupled features can attach sources to the same
 * event type.
 */
class EventService {
    constructor() {
        /**
         * The various events meta are collected in a map, stored by the event type class
         */
        this.eventsMeta = new Map();
    }
    /**
     * Register an event source for the given event type.
     *
     * CAUTION: To avoid memory leaks, the returned teardown function should be called
     *  when the event source is no longer maintained by its creator
     * (i.e. in `ngOnDestroy` if the event source was registered in the component).
     *
     * @since 3.1 - registers the given `source$` for the parent classes of the given `eventType`.
     *
     * @param eventType the event type
     * @param source$ an observable that represents the source
     *
     * @returns a teardown function which unregisters the given event source
     */
    register(eventType, source$) {
        const eventMeta = this.getEventMeta(eventType);
        if (eventMeta.mergingSubject.has(source$)) {
            if (isDevMode()) {
                console.warn(`EventService: the event source`, source$, `has been already registered for the type`, eventType);
            }
        }
        else {
            eventMeta.mergingSubject.add(source$);
        }
        return () => eventMeta.mergingSubject.remove(source$);
    }
    /**
     * Returns a stream of events for the given event type
     * @param eventTypes event type
     */
    get(eventType) {
        let output$ = this.getEventMeta(eventType).mergingSubject.output$;
        if (isDevMode()) {
            output$ = this.getValidatedEventStream(output$, eventType);
        }
        return output$;
    }
    /**
     * Dispatches an instance of an individual event.
     * If the eventType is provided a new event will be created for that type and with the event data.
     *
     * @param event an event
     * @param eventType (optional) - type of event
     */
    dispatch(event, eventType) {
        if (!eventType) {
            eventType = event.constructor;
        }
        else if (!(event instanceof eventType)) {
            event = createFrom(eventType, event);
        }
        const inputSubject$ = this.getInputSubject(eventType);
        inputSubject$.next(event);
    }
    /**
     * Returns the input subject used to dispatch a single event.
     * The subject is created on demand, when it's needed for the first time.
     * @param eventType type of event
     */
    getInputSubject(eventType) {
        const eventMeta = this.getEventMeta(eventType);
        if (!eventMeta.inputSubject$) {
            eventMeta.inputSubject$ = new Subject();
            this.register(eventType, eventMeta.inputSubject$);
        }
        return eventMeta.inputSubject$;
    }
    /**
     * Returns the event meta object for the given event type
     */
    getEventMeta(eventType) {
        if (!this.eventsMeta.get(eventType)) {
            if (isDevMode()) {
                this.validateEventType(eventType);
            }
            this.createEventMeta(eventType);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.eventsMeta.get(eventType);
    }
    createEventMeta(eventType) {
        const eventMeta = {
            inputSubject$: null,
            mergingSubject: new MergingSubject(),
        };
        this.eventsMeta.set(eventType, eventMeta);
        let parentEvent = Object.getPrototypeOf(eventType);
        while (parentEvent !== null &&
            Object.getPrototypeOf(parentEvent) !== Object.getPrototypeOf({})) {
            this.register(parentEvent, eventMeta.mergingSubject.output$);
            parentEvent = Object.getPrototypeOf(parentEvent);
        }
    }
    /**
     * Checks if the event type is a valid type (is a class with constructor).
     *
     * Should be used only in dev mode.
     */
    validateEventType(eventType) {
        if (!(eventType === null || eventType === void 0 ? void 0 : eventType.constructor)) {
            throw new Error(`EventService:  ${eventType} is not a valid event type. Please provide a class reference.`);
        }
        this.validateCxEvent(eventType);
    }
    /**
     * Validates if the given type (or its prototype chain) extends from the CxEvent.
     *
     * Should be used only in the dev mode.
     */
    validateCxEvent(eventType) {
        let parentType = eventType;
        while (parentType !== null &&
            Object.getPrototypeOf(parentType) !== Object.getPrototypeOf({})) {
            if (parentType.type === CxEvent.type) {
                return;
            }
            parentType = Object.getPrototypeOf(parentType);
        }
        console.warn(`The ${eventType.name} (or one of its parent classes) does not inherit from the ${CxEvent.type}`);
    }
    /**
     * Returns the given event source with runtime validation whether the emitted values are instances of given event type.
     *
     * Should be used only in dev mode.
     */
    getValidatedEventStream(source$, eventType) {
        return source$.pipe(tap((event) => {
            if (!(event instanceof eventType)) {
                console.warn(`EventService: The stream`, source$, `emitted the event`, event, `that is not an instance of the declared type`, eventType.name);
            }
        }));
    }
}
EventService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: EventService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
EventService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: EventService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: EventService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Registers streams of ngrx actions as events source streams
 */
class StateEventService {
    constructor(actionsSubject, eventService) {
        this.actionsSubject = actionsSubject;
        this.eventService = eventService;
    }
    /**
     * Registers an event source stream of specific events
     * mapped from a given action type.
     *
     * @param mapping mapping from action to event
     *
     * @returns a teardown function that unregisters the event source
     */
    register(mapping) {
        return this.eventService.register(mapping.event, this.getFromAction(mapping));
    }
    /**
     * Returns a stream of specific events mapped from a specific action.
     * @param mapping mapping from action to event
     */
    getFromAction(mapping) {
        return this.actionsSubject
            .pipe(ofType(...[].concat(mapping.action)))
            .pipe(map((action) => this.createEvent(action, mapping.event, mapping.factory)));
    }
    /**
     * Creates an event instance for given class out from the action object.
     * Unless the `factory` parameter is given, the action's `payload` is used
     * as the argument for the event's constructor.
     *
     * @param action instance of an Action
     * @param mapping mapping from action to event
     * @param factory optional function getting an action instance and returning an event instance
     *
     * @returns instance of an Event
     */
    createEvent(action, eventType, factory) {
        var _a;
        return factory
            ? factory(action)
            : createFrom(eventType, (_a = action.payload) !== null && _a !== void 0 ? _a : {});
    }
}
StateEventService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StateEventService, deps: [{ token: i1$2.ActionsSubject }, { token: EventService }], target: i0.ɵɵFactoryTarget.Injectable });
StateEventService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StateEventService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: StateEventService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.ActionsSubject }, { type: EventService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserAuthEventBuilder {
    constructor(stateEventService, eventService, authService) {
        this.stateEventService = stateEventService;
        this.eventService = eventService;
        this.authService = authService;
        this.register();
    }
    /**
     * Registers user auth events
     */
    register() {
        this.registerLoginEvent();
        this.registerLogoutEvent();
    }
    /**
     * Register a login event
     */
    registerLoginEvent() {
        this.stateEventService.register({
            action: LOGIN,
            event: LoginEvent,
        });
    }
    /**
     * Register a logout event
     */
    registerLogoutEvent() {
        this.eventService.register(LogoutEvent, this.buildLogoutEvent());
    }
    /**
     * Returns logout event stream
     */
    buildLogoutEvent() {
        return this.authService.isUserLoggedIn().pipe(pairwise(), filter(([prev, curr]) => prev && !curr), map(() => createFrom(LogoutEvent, {})));
    }
}
UserAuthEventBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAuthEventBuilder, deps: [{ token: StateEventService }, { token: EventService }, { token: AuthService }], target: i0.ɵɵFactoryTarget.Injectable });
UserAuthEventBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAuthEventBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAuthEventBuilder, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: StateEventService }, { type: EventService }, { type: AuthService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserAuthEventModule {
    constructor(_userAuthEventBuilder) {
        // Intentional empty constructor
    }
}
UserAuthEventModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAuthEventModule, deps: [{ token: UserAuthEventBuilder }], target: i0.ɵɵFactoryTarget.NgModule });
UserAuthEventModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: UserAuthEventModule });
UserAuthEventModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAuthEventModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAuthEventModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: UserAuthEventBuilder }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var GlobalMessageType;
(function (GlobalMessageType) {
    GlobalMessageType["MSG_TYPE_CONFIRMATION"] = "[GlobalMessage] Confirmation";
    GlobalMessageType["MSG_TYPE_ERROR"] = "[GlobalMessage] Error";
    GlobalMessageType["MSG_TYPE_INFO"] = "[GlobalMessage] Information";
    GlobalMessageType["MSG_TYPE_WARNING"] = "[GlobalMessage] Warning";
    GlobalMessageType["MSG_TYPE_ASSISTIVE"] = "[GlobalMessage] Assistive";
})(GlobalMessageType || (GlobalMessageType = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ADD_MESSAGE = '[Global-message] Add a Message';
const REMOVE_MESSAGE = '[Global-message] Remove a Message';
const REMOVE_MESSAGES_BY_TYPE = '[Global-message] Remove messages by type';
class AddMessage {
    constructor(payload) {
        this.payload = payload;
        this.type = ADD_MESSAGE;
    }
}
class RemoveMessage {
    constructor(payload) {
        this.payload = payload;
        this.type = REMOVE_MESSAGE;
    }
}
class RemoveMessagesByType {
    constructor(payload) {
        this.payload = payload;
        this.type = REMOVE_MESSAGES_BY_TYPE;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var globalMessageGroup_actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ADD_MESSAGE: ADD_MESSAGE,
    REMOVE_MESSAGE: REMOVE_MESSAGE,
    REMOVE_MESSAGES_BY_TYPE: REMOVE_MESSAGES_BY_TYPE,
    AddMessage: AddMessage,
    RemoveMessage: RemoveMessage,
    RemoveMessagesByType: RemoveMessagesByType
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const GLOBAL_MESSAGE_FEATURE = 'global-message';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getGlobalMessageState = createFeatureSelector(GLOBAL_MESSAGE_FEATURE);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getGlobalMessageEntities = createSelector(getGlobalMessageState, (state) => state.entities);
const getGlobalMessageEntitiesByType = (type) => {
    return createSelector(getGlobalMessageEntities, (entities) => entities && entities[type]);
};
const getGlobalMessageCountByType = (type) => {
    return createSelector(getGlobalMessageEntitiesByType(type), (entities) => entities && entities.length);
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var globalMessageGroup_selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getGlobalMessageState: getGlobalMessageState,
    getGlobalMessageEntities: getGlobalMessageEntities,
    getGlobalMessageEntitiesByType: getGlobalMessageEntitiesByType,
    getGlobalMessageCountByType: getGlobalMessageCountByType
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class GlobalMessageService {
    constructor(store) {
        this.store = store;
    }
    /**
     * Get all global messages
     */
    get() {
        return this.store.pipe(select(getGlobalMessageEntities), filter(isNotUndefined));
    }
    /**
     * Add one message into store
     * @param text: string | Translatable
     * @param type: GlobalMessageType object
     * @param timeout: number
     */
    add(text, type, timeout) {
        this.store.dispatch(new AddMessage({
            text: typeof text === 'string' ? { raw: text } : text,
            type,
            timeout,
        }));
    }
    /**
     * Remove message(s) from store
     * @param type: GlobalMessageType
     * @param index:optional. Without it, messages will be removed by type; otherwise,
     * message will be removed from list by index.
     */
    remove(type, index) {
        this.store.dispatch(index !== undefined
            ? new RemoveMessage({
                type: type,
                index: index,
            })
            : new RemoveMessagesByType(type));
    }
}
GlobalMessageService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageService, deps: [{ token: i1$2.Store }], target: i0.ɵɵFactoryTarget.Injectable });
GlobalMessageService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }]; } });

/**
 * Extendable service for `AuthInterceptor`.
 */
class AuthHttpHeaderService {
    constructor(authService, authStorageService, oAuthLibWrapperService, routingService, occEndpoints, globalMessageService, authRedirectService) {
        this.authService = authService;
        this.authStorageService = authStorageService;
        this.oAuthLibWrapperService = oAuthLibWrapperService;
        this.routingService = routingService;
        this.occEndpoints = occEndpoints;
        this.globalMessageService = globalMessageService;
        this.authRedirectService = authRedirectService;
        /**
         * Starts the refresh of the access token
         */
        this.refreshTokenTrigger$ = new Subject();
        /**
         * Internal token streams which reads the latest from the storage.
         * Emits the token or `undefined`
         */
        this.token$ = this.authStorageService
            .getToken()
            .pipe(map((token) => ((token === null || token === void 0 ? void 0 : token.access_token) ? token : undefined)));
        /**
         * Compares the previous and the new token in order to stop the refresh or logout processes
         */
        this.stopProgress$ = this.token$.pipe(
        // Keeps the previous and the new token
        pairwise(), tap(([oldToken, newToken]) => {
            // if we got the new token we know that either the refresh or logout finished
            if ((oldToken === null || oldToken === void 0 ? void 0 : oldToken.access_token) !== (newToken === null || newToken === void 0 ? void 0 : newToken.access_token)) {
                this.authService.setLogoutProgress(false);
                this.authService.setRefreshProgress(false);
            }
        }));
        /**
         * Refreshes the token only if currently there's no refresh nor logout in progress.
         * If the refresh token is not present, it triggers the logout process
         */
        this.refreshToken$ = this.refreshTokenTrigger$.pipe(withLatestFrom(this.authService.refreshInProgress$, this.authService.logoutInProgress$), filter(([, refreshInProgress, logoutInProgress]) => !refreshInProgress && !logoutInProgress), tap(([token]) => {
            if (token === null || token === void 0 ? void 0 : token.refresh_token) {
                this.oAuthLibWrapperService.refreshToken();
                this.authService.setRefreshProgress(true);
            }
            else {
                this.handleExpiredRefreshToken();
            }
        }));
        /**
         * Kicks of the process by listening to the new token and refresh token processes.
         * This token should be used when retrying the failed http request.
         */
        this.tokenToRetryRequest$ = using(() => this.refreshToken$.subscribe(), () => this.getStableToken()).pipe(shareReplay({ refCount: true, bufferSize: 1 }));
        this.subscriptions = new Subscription();
        // We need to have stopProgress$ stream active for the whole time,
        // so when the logout finishes we finish it's process.
        // It could happen when retryToken$ is not active.
        this.subscriptions.add(this.stopProgress$.subscribe());
    }
    /**
     * Checks if request should be handled by this service (if it's OCC call).
     */
    shouldCatchError(request) {
        return this.isOccUrl(request.url);
    }
    shouldAddAuthorizationHeader(request) {
        const hasAuthorizationHeader = !!this.getAuthorizationHeader(request);
        const isOccUrl = this.isOccUrl(request.url);
        return !hasAuthorizationHeader && isOccUrl;
    }
    /**
     * Adds `Authorization` header for OCC calls.
     */
    alterRequest(request, token) {
        const hasAuthorizationHeader = !!this.getAuthorizationHeader(request);
        const isOccUrl = this.isOccUrl(request.url);
        if (!hasAuthorizationHeader && isOccUrl) {
            return request.clone({
                setHeaders: Object.assign({}, this.createAuthorizationHeader(token)),
            });
        }
        return request;
    }
    isOccUrl(url) {
        return url.includes(this.occEndpoints.getBaseUrl());
    }
    getAuthorizationHeader(request) {
        const rawValue = request.headers.get('Authorization');
        return rawValue;
    }
    createAuthorizationHeader(token) {
        if (token === null || token === void 0 ? void 0 : token.access_token) {
            return {
                Authorization: `${token.token_type || 'Bearer'} ${token.access_token}`,
            };
        }
        let currentToken;
        this.authStorageService
            .getToken()
            .subscribe((authToken) => (currentToken = authToken))
            .unsubscribe();
        if (currentToken === null || currentToken === void 0 ? void 0 : currentToken.access_token) {
            return {
                Authorization: `${currentToken.token_type || 'Bearer'} ${currentToken.access_token}`,
            };
        }
        return {};
    }
    /**
     * Refreshes access_token and then retries the call with the new token.
     */
    handleExpiredAccessToken(request, next, initialToken) {
        return this.getValidToken(initialToken).pipe(switchMap((token) => 
        // we break the stream with EMPTY when we don't have the token. This prevents sending the requests with `Authorization: bearer undefined` header
        token
            ? next.handle(this.createNewRequestWithNewToken(request, token))
            : EMPTY));
    }
    /**
     * Logout user, redirected to login page and informs about expired session.
     */
    handleExpiredRefreshToken() {
        // There might be 2 cases:
        // 1. when user is already on some page (router is stable) and performs an UI action
        // that triggers http call (i.e. button click to save data in backend)
        // 2. when user is navigating to some page and a route guard triggers the http call
        // (i.e. guard loading cms page data)
        //
        // In the second case, we want to remember the anticipated url before we navigate to
        // the login page, so we can redirect back to that URL after user authenticates.
        this.authRedirectService.saveCurrentNavigationUrl();
        // Logout user
        // TODO(#9638): Use logout route when it will support passing redirect url
        this.authService.coreLogout().finally(() => {
            this.routingService.go({ cxRoute: 'login' });
            this.globalMessageService.add({
                key: 'httpHandlers.sessionExpired',
            }, GlobalMessageType.MSG_TYPE_ERROR);
        });
    }
    /**
     * Emits the token or `undefined` only when the refresh or the logout processes are finished.
     */
    getStableToken() {
        return combineLatest([
            this.token$,
            this.authService.refreshInProgress$,
            this.authService.logoutInProgress$,
        ]).pipe(observeOn(queueScheduler), filter(([_, refreshInProgress, logoutInProgress]) => !refreshInProgress && !logoutInProgress), switchMap(() => this.token$));
    }
    /**
     * Returns a valid access token.
     * It will attempt to refresh it if the current one expired; emits after the new one is retrieved.
     */
    getValidToken(requestToken) {
        return defer(() => {
            // flag to only refresh token only on first emission
            let refreshTriggered = false;
            return this.tokenToRetryRequest$.pipe(tap((token) => {
                // we want to refresh the access token only when it is old.
                // this is a guard for the case when there are multiple parallel http calls
                if ((token === null || token === void 0 ? void 0 : token.access_token) === (requestToken === null || requestToken === void 0 ? void 0 : requestToken.access_token) &&
                    !refreshTriggered) {
                    this.refreshTokenTrigger$.next(token);
                }
                refreshTriggered = true;
            }), skipWhile((token) => (token === null || token === void 0 ? void 0 : token.access_token) === (requestToken === null || requestToken === void 0 ? void 0 : requestToken.access_token)), take(1));
        });
    }
    createNewRequestWithNewToken(request, token) {
        request = request.clone({
            setHeaders: {
                Authorization: `${token.token_type || 'Bearer'} ${token.access_token}`,
            },
        });
        return request;
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
AuthHttpHeaderService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthHttpHeaderService, deps: [{ token: AuthService }, { token: AuthStorageService }, { token: OAuthLibWrapperService }, { token: RoutingService }, { token: OccEndpointsService }, { token: GlobalMessageService }, { token: AuthRedirectService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthHttpHeaderService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthHttpHeaderService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthHttpHeaderService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: AuthService }, { type: AuthStorageService }, { type: OAuthLibWrapperService }, { type: RoutingService }, { type: OccEndpointsService }, { type: GlobalMessageService }, { type: AuthRedirectService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Responsible for catching auth errors and providing `Authorization` header for API calls.
 * Uses AuthHttpHeaderService for request manipulation and error handling. Interceptor only hooks into request send/received events.
 */
class AuthInterceptor {
    constructor(authHttpHeaderService, authConfigService) {
        this.authHttpHeaderService = authHttpHeaderService;
        this.authConfigService = authConfigService;
    }
    intercept(httpRequest, next) {
        const shouldCatchError = this.authHttpHeaderService.shouldCatchError(httpRequest);
        const shouldAddAuthorizationHeader = this.authHttpHeaderService.shouldAddAuthorizationHeader(httpRequest);
        const token$ = shouldAddAuthorizationHeader
            ? // emits sync, unless there is refresh or logout in progress, in which case it emits async
                this.authHttpHeaderService.getStableToken().pipe(take(1))
            : of(undefined);
        const requestAndToken$ = token$.pipe(map((token) => ({
            token,
            request: this.authHttpHeaderService.alterRequest(httpRequest, token),
        })));
        return requestAndToken$.pipe(switchMap(({ request, token }) => next.handle(request).pipe(catchError((errResponse) => {
            var _a, _b;
            if (errResponse instanceof HttpErrorResponse) {
                switch (errResponse.status) {
                    case 401: // Unauthorized
                        if (this.isExpiredToken(errResponse) && shouldCatchError) {
                            // request failed because of the expired access token
                            // we should get refresh the token and retry the request, or logout if the refresh is missing / expired
                            return this.authHttpHeaderService.handleExpiredAccessToken(request, next, token);
                        }
                        else if (
                        // Refresh the expired token
                        // Check if the OAuth endpoint was called and the error is because the refresh token expired
                        ((_a = errResponse.url) === null || _a === void 0 ? void 0 : _a.includes(this.authConfigService.getTokenEndpoint())) &&
                            errResponse.error.error === 'invalid_token') {
                            this.authHttpHeaderService.handleExpiredRefreshToken();
                            return of();
                        }
                        break;
                    case 400: // Bad Request
                        if (((_b = errResponse.url) === null || _b === void 0 ? void 0 : _b.includes(this.authConfigService.getTokenEndpoint())) &&
                            errResponse.error.error === 'invalid_grant') {
                            if (request.body.get('grant_type') === 'refresh_token') {
                                this.authHttpHeaderService.handleExpiredRefreshToken();
                            }
                        }
                        break;
                }
            }
            return throwError(errResponse);
        }))));
    }
    isExpiredToken(resp) {
        var _a, _b, _c;
        return ((_c = (_b = (_a = resp.error) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.type) === 'InvalidTokenError';
    }
}
AuthInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthInterceptor, deps: [{ token: AuthHttpHeaderService }, { token: AuthConfigService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthInterceptor, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthInterceptor, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: AuthHttpHeaderService }, { type: AuthConfigService }]; } });

/**
 * This interceptor is dedicated for Hybris OAuth server which requires `Authorization` header for revoke token calls.
 */
class TokenRevocationInterceptor {
    constructor(authStorageService, authConfigService) {
        this.authStorageService = authStorageService;
        this.authConfigService = authConfigService;
    }
    intercept(request, next) {
        const isTokenRevocationRequest = this.isTokenRevocationRequest(request);
        return this.authStorageService.getToken().pipe(take(1), switchMap((token) => {
            if (isTokenRevocationRequest) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `${token.token_type || 'Bearer'} ${token.access_token}`,
                    },
                });
            }
            return next.handle(request);
        }));
    }
    isTokenRevocationRequest(request) {
        return request.url === this.authConfigService.getRevokeEndpoint();
    }
}
TokenRevocationInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TokenRevocationInterceptor, deps: [{ token: AuthStorageService }, { token: AuthConfigService }], target: i0.ɵɵFactoryTarget.Injectable });
TokenRevocationInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TokenRevocationInterceptor, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TokenRevocationInterceptor, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: AuthStorageService }, { type: AuthConfigService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const interceptors$1 = [
    {
        provide: HTTP_INTERCEPTORS,
        useExisting: AuthInterceptor,
        multi: true,
    },
    {
        provide: HTTP_INTERCEPTORS,
        useExisting: TokenRevocationInterceptor,
        multi: true,
    },
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Initialize the check for `token` or `code` in the url returned from the OAuth server.
 */
function checkOAuthParamsInUrl(authService, configInit) {
    const result = () => configInit
        .getStable()
        .pipe(switchMap(() => 
    // Wait for stable config is used, because with auth redirect would kick so quickly that the page would not be loaded correctly
    authService.checkOAuthParamsInUrl()))
        .toPromise();
    return result;
}
function authStatePersistenceFactory(authStatePersistenceService) {
    const result = () => authStatePersistenceService.initSync();
    return result;
}
/**
 * Authentication module for a user. Handlers requests for logged in users,
 * provides authorization services and storage for tokens.
 */
class UserAuthModule {
    static forRoot() {
        return {
            ngModule: UserAuthModule,
            providers: [
                provideDefaultConfig(defaultAuthConfig),
                provideConfigValidator(baseUrlConfigValidator),
                ...interceptors$1,
                {
                    provide: OAuthStorage,
                    useExisting: AuthStorageService,
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: authStatePersistenceFactory,
                    deps: [AuthStatePersistenceService],
                    multi: true,
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: checkOAuthParamsInUrl,
                    deps: [AuthService, ConfigInitializerService],
                    multi: true,
                },
            ],
        };
    }
}
UserAuthModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAuthModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
UserAuthModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: UserAuthModule, imports: [CommonModule, i1.OAuthModule, UserAuthEventModule] });
UserAuthModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAuthModule, imports: [CommonModule, OAuthModule.forRoot(), UserAuthEventModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAuthModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, OAuthModule.forRoot(), UserAuthEventModule],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AuthModule {
    static forRoot() {
        return {
            ngModule: AuthModule,
        };
    }
}
AuthModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AuthModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: AuthModule, imports: [CommonModule, UserAuthModule, ClientAuthModule] });
AuthModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthModule, imports: [CommonModule, UserAuthModule.forRoot(), ClientAuthModule.forRoot()] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthModule, decorators: [{
            type: NgModule,
            args: [{
                    // ClientAuthModule should always be imported after UserAuthModule because the ClientTokenInterceptor must be imported after the AuthInterceptor.
                    // This way, the ClientTokenInterceptor is the first to handle 401 errors and attempt to refresh the client token.
                    // If the request is not for the client token, the AuthInterceptor handles the refresh.
                    imports: [CommonModule, UserAuthModule.forRoot(), ClientAuthModule.forRoot()],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Checks if there is currently logged in user.
 * Use to protect pages dedicated only for logged in users.
 */
class AuthGuard {
    constructor(authService, authRedirectService, router, semanticPathService) {
        this.authService = authService;
        this.authRedirectService = authRedirectService;
        this.router = router;
        this.semanticPathService = semanticPathService;
    }
    canActivate() {
        return this.authService.isUserLoggedIn().pipe(map((isLoggedIn) => {
            var _a;
            if (!isLoggedIn) {
                this.authRedirectService.saveCurrentNavigationUrl();
                return this.router.parseUrl((_a = this.semanticPathService.get('login')) !== null && _a !== void 0 ? _a : '');
            }
            return isLoggedIn;
        }));
    }
}
AuthGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthGuard, deps: [{ token: AuthService }, { token: AuthRedirectService }, { token: i1$1.Router }, { token: SemanticPathService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AuthGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: AuthService }, { type: AuthRedirectService }, { type: i1$1.Router }, { type: SemanticPathService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Checks if there isn't any logged in user.
 * Use to protect pages dedicated only for guests (eg. login page).
 */
class NotAuthGuard {
    constructor(authService, semanticPathService, router) {
        this.authService = authService;
        this.semanticPathService = semanticPathService;
        this.router = router;
    }
    canActivate() {
        // redirect, if user is already logged in:
        return this.authService.isUserLoggedIn().pipe(map((isLoggedIn) => {
            var _a;
            if (isLoggedIn) {
                return this.router.parseUrl((_a = this.semanticPathService.get('home')) !== null && _a !== void 0 ? _a : '');
            }
            return !isLoggedIn;
        }));
    }
}
NotAuthGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NotAuthGuard, deps: [{ token: AuthService }, { token: SemanticPathService }, { token: i1$1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
NotAuthGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NotAuthGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NotAuthGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: AuthService }, { type: SemanticPathService }, { type: i1$1.Router }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AnonymousConsentsConfig extends OccConfig {
}
AnonymousConsentsConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsConfig, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
AnonymousConsentsConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AnonymousConsentsInterceptor {
    constructor(anonymousConsentsService, authService, occEndpoints, config) {
        this.anonymousConsentsService = anonymousConsentsService;
        this.authService = authService;
        this.occEndpoints = occEndpoints;
        this.config = config;
    }
    intercept(request, next) {
        return combineLatest([
            this.anonymousConsentsService.getConsents(),
            this.authService.isUserLoggedIn(),
        ]).pipe(take(1), switchMap(([consents, isUserLoggedIn]) => {
            if (!this.isOccUrl(request.url)) {
                return next.handle(request);
            }
            const clonedRequest = this.handleRequest(consents, request);
            return next.handle(clonedRequest).pipe(tap((event) => {
                var _a;
                if (event instanceof HttpResponse &&
                    ((_a = event.url) !== null && _a !== void 0 ? _a : '').startsWith(this.occEndpoints.buildUrl('anonymousConsentTemplates'))) {
                    this.handleResponse(isUserLoggedIn, event.headers.get(ANONYMOUS_CONSENTS_HEADER), consents);
                }
            }));
        }));
    }
    handleResponse(isUserLoggedIn, newRawConsents, previousConsents) {
        if (!isUserLoggedIn && newRawConsents) {
            let newConsents = [];
            newConsents =
                this.anonymousConsentsService.decodeAndDeserialize(newRawConsents);
            newConsents = this.giveRequiredConsents(newConsents);
            if (this.anonymousConsentsService.consentsUpdated(newConsents, previousConsents)) {
                this.anonymousConsentsService.setConsents(newConsents);
            }
        }
    }
    handleRequest(consents, request) {
        if (!consents) {
            return request;
        }
        const rawConsents = this.anonymousConsentsService.serializeAndEncode(consents);
        return request.clone({
            setHeaders: {
                [ANONYMOUS_CONSENTS_HEADER]: rawConsents,
            },
        });
    }
    isOccUrl(url) {
        return url.includes(this.occEndpoints.getBaseUrl());
    }
    giveRequiredConsents(consents) {
        const givenConsents = [...consents];
        if (this.config.anonymousConsents &&
            this.config.anonymousConsents.requiredConsents) {
            for (const consent of givenConsents) {
                if (consent.templateCode &&
                    this.config.anonymousConsents.requiredConsents.includes(consent.templateCode)) {
                    consent.consentState = ANONYMOUS_CONSENT_STATUS.GIVEN;
                }
            }
        }
        return givenConsents;
    }
}
AnonymousConsentsInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsInterceptor, deps: [{ token: AnonymousConsentsService }, { token: AuthService }, { token: OccEndpointsService }, { token: AnonymousConsentsConfig }], target: i0.ɵɵFactoryTarget.Injectable });
AnonymousConsentsInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsInterceptor, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsInterceptor, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: AnonymousConsentsService }, { type: AuthService }, { type: OccEndpointsService }, { type: AnonymousConsentsConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const interceptors = [
    {
        provide: HTTP_INTERCEPTORS,
        useExisting: AnonymousConsentsInterceptor,
        multi: true,
    },
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_BILLING_COUNTRIES = '[User] Load Billing Countries';
const LOAD_BILLING_COUNTRIES_FAIL = '[User] Load Billing Countries Fail';
const LOAD_BILLING_COUNTRIES_SUCCESS = '[User] Load Billing Countries Success';
class LoadBillingCountries {
    constructor() {
        this.type = LOAD_BILLING_COUNTRIES;
        // Intentional empty constructor
    }
}
class LoadBillingCountriesFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BILLING_COUNTRIES_FAIL;
    }
}
class LoadBillingCountriesSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_BILLING_COUNTRIES_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PROCESS_FEATURE = 'process';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getProcessState() {
    return createFeatureSelector(PROCESS_FEATURE);
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getProcessStateFactory(processId) {
    return createSelector(getProcessState(), (entityState) => entityLoaderStateSelector(entityState, processId));
}
function getProcessLoadingFactory(processId) {
    return createSelector(getProcessStateFactory(processId), (loaderState) => loaderLoadingSelector(loaderState));
}
function getProcessSuccessFactory(processId) {
    return createSelector(getProcessStateFactory(processId), (loaderState) => loaderSuccessSelector(loaderState));
}
function getProcessErrorFactory(processId) {
    return createSelector(getProcessStateFactory(processId), (loaderState) => loaderErrorSelector(loaderState));
}

var process_selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getProcessStateFactory: getProcessStateFactory,
    getProcessLoadingFactory: getProcessLoadingFactory,
    getProcessSuccessFactory: getProcessSuccessFactory,
    getProcessErrorFactory: getProcessErrorFactory
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const USER_FEATURE = 'user';
const REGISTER_USER_PROCESS_ID = 'registerUser';
const GIVE_CONSENT_PROCESS_ID = 'giveConsent';
const WITHDRAW_CONSENT_PROCESS_ID = 'withdrawConsent';
const UPDATE_NOTIFICATION_PREFERENCES_PROCESS_ID = 'updateNotificationPreferences';
const ADD_PRODUCT_INTEREST_PROCESS_ID = 'addProductInterests';
const REMOVE_PRODUCT_INTERESTS_PROCESS_ID = 'removeProductInterests';
const USER_CONSENTS = '[User] User Consents';
const USER_PAYMENT_METHODS = '[User] User Payment Methods';
const USER_ADDRESSES = '[User] User Addresses';
const USER_COST_CENTERS = '[User] User Cost Centers';
const REGIONS = '[User] Regions';
const CUSTOMER_COUPONS = '[User] Customer Coupons';
const SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID = 'subscribeCustomerCoupon';
const UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID = 'unsubscribeCustomerCoupon';
const CLAIM_CUSTOMER_COUPON_PROCESS_ID = 'claimCustomerCoupon';
const NOTIFICATION_PREFERENCES = '[User] Notification Preferences';
const PRODUCT_INTERESTS = '[User] Product Interests';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_CUSTOMER_COUPONS = '[User] Load Customer Coupons';
const LOAD_CUSTOMER_COUPONS_FAIL = '[User] Load Customer Coupons Fail';
const LOAD_CUSTOMER_COUPONS_SUCCESS = '[User] Load Customer Coupons Success';
const RESET_LOAD_CUSTOMER_COUPONS = '[User] Reset Load Customer Coupons';
const SUBSCRIBE_CUSTOMER_COUPON = '[User] Subscribe Customer Notification Coupon';
const SUBSCRIBE_CUSTOMER_COUPON_FAIL = '[User] Subscribe Customer Coupon Notification Fail';
const SUBSCRIBE_CUSTOMER_COUPON_SUCCESS = '[User] Subscribe Customer Coupon Notification Success';
const RESET_SUBSCRIBE_CUSTOMER_COUPON_PROCESS = '[User] Reset Subscribe Customer Coupon Process';
const UNSUBSCRIBE_CUSTOMER_COUPON = '[User] Unsubscribe Customer Notification Coupon';
const UNSUBSCRIBE_CUSTOMER_COUPON_FAIL = '[User] Unsubscribe Customer Coupon Notification Fail';
const UNSUBSCRIBE_CUSTOMER_COUPON_SUCCESS = '[User] Unsubscribe Customer Coupon Notification Success';
const RESET_UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS = '[User] Reset Unsubscribe Customer Coupon Process';
const CLAIM_CUSTOMER_COUPON = '[User] Claim Customer';
const CLAIM_CUSTOMER_COUPON_FAIL = '[User] Claim Customer Fail';
const CLAIM_CUSTOMER_COUPON_SUCCESS = '[User] Claim Customer Success';
class LoadCustomerCoupons extends LoaderLoadAction {
    constructor(payload) {
        super(CUSTOMER_COUPONS);
        this.payload = payload;
        this.type = LOAD_CUSTOMER_COUPONS;
    }
}
class LoadCustomerCouponsFail extends LoaderFailAction {
    constructor(payload) {
        super(CUSTOMER_COUPONS, payload);
        this.payload = payload;
        this.type = LOAD_CUSTOMER_COUPONS_FAIL;
    }
}
class LoadCustomerCouponsSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(CUSTOMER_COUPONS);
        this.payload = payload;
        this.type = LOAD_CUSTOMER_COUPONS_SUCCESS;
    }
}
class ResetLoadCustomerCoupons extends LoaderResetAction {
    constructor() {
        super(CUSTOMER_COUPONS);
        this.type = RESET_LOAD_CUSTOMER_COUPONS;
    }
}
// Subscribe coupon notification actions
class SubscribeCustomerCoupon extends EntityLoadAction {
    constructor(payload) {
        super(PROCESS_FEATURE, SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID);
        this.payload = payload;
        this.type = SUBSCRIBE_CUSTOMER_COUPON;
    }
}
class SubscribeCustomerCouponFail extends EntityFailAction {
    constructor(payload) {
        super(PROCESS_FEATURE, SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID, payload);
        this.payload = payload;
        this.type = SUBSCRIBE_CUSTOMER_COUPON_FAIL;
    }
}
class SubscribeCustomerCouponSuccess extends EntitySuccessAction {
    constructor(payload) {
        super(PROCESS_FEATURE, SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID, payload);
        this.payload = payload;
        this.type = SUBSCRIBE_CUSTOMER_COUPON_SUCCESS;
    }
}
class ResetSubscribeCustomerCouponProcess extends EntityLoaderResetAction {
    constructor() {
        super(PROCESS_FEATURE, SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID);
        this.type = RESET_SUBSCRIBE_CUSTOMER_COUPON_PROCESS;
    }
}
class UnsubscribeCustomerCoupon extends EntityLoadAction {
    constructor(payload) {
        super(PROCESS_FEATURE, UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID);
        this.payload = payload;
        this.type = UNSUBSCRIBE_CUSTOMER_COUPON;
    }
}
class UnsubscribeCustomerCouponFail extends EntityFailAction {
    constructor(payload) {
        super(PROCESS_FEATURE, UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID, payload);
        this.payload = payload;
        this.type = UNSUBSCRIBE_CUSTOMER_COUPON_FAIL;
    }
}
class UnsubscribeCustomerCouponSuccess extends EntitySuccessAction {
    constructor(payload) {
        super(PROCESS_FEATURE, UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID, payload);
        this.payload = payload;
        this.type = UNSUBSCRIBE_CUSTOMER_COUPON_SUCCESS;
    }
}
class ResetUnsubscribeCustomerCouponProcess extends EntityLoaderResetAction {
    constructor() {
        super(PROCESS_FEATURE, UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID);
        this.type = RESET_UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS;
    }
}
class ClaimCustomerCoupon extends EntityLoadAction {
    constructor(payload) {
        super(PROCESS_FEATURE, CLAIM_CUSTOMER_COUPON_PROCESS_ID);
        this.payload = payload;
        this.type = CLAIM_CUSTOMER_COUPON;
    }
}
class ClaimCustomerCouponFail extends EntityFailAction {
    constructor(payload) {
        super(PROCESS_FEATURE, CLAIM_CUSTOMER_COUPON_PROCESS_ID, payload);
        this.payload = payload;
        this.type = CLAIM_CUSTOMER_COUPON_FAIL;
    }
}
class ClaimCustomerCouponSuccess extends EntitySuccessAction {
    constructor(payload) {
        super(PROCESS_FEATURE, CLAIM_CUSTOMER_COUPON_PROCESS_ID, payload);
        this.payload = payload;
        this.type = CLAIM_CUSTOMER_COUPON_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_DELIVERY_COUNTRIES = '[User] Load Delivery Countries';
const LOAD_DELIVERY_COUNTRIES_FAIL = '[User] Load Delivery Countries Fail';
const LOAD_DELIVERY_COUNTRIES_SUCCESS = '[User] Load Delivery Countries Success';
class LoadDeliveryCountries {
    constructor() {
        this.type = LOAD_DELIVERY_COUNTRIES;
        // Intentional empty constructor
    }
}
class LoadDeliveryCountriesFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_DELIVERY_COUNTRIES_FAIL;
    }
}
class LoadDeliveryCountriesSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_DELIVERY_COUNTRIES_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_NOTIFICATION_PREFERENCES = '[User] Load Notification Preferences';
const LOAD_NOTIFICATION_PREFERENCES_FAIL = '[User] Load Notification Preferences Fail';
const LOAD_NOTIFICATION_PREFERENCES_SUCCESS = '[User] Load Notification Preferences Success';
const UPDATE_NOTIFICATION_PREFERENCES = '[User] Update Notification Preferences';
const UPDATE_NOTIFICATION_PREFERENCES_FAIL = '[User] Update Notification Preferences Fail';
const UPDATE_NOTIFICATION_PREFERENCES_SUCCESS = '[User] Update Notification Preferences Success';
const RESET_NOTIFICATION_PREFERENCES = '[User] Reset Notification Preferences';
const CLEAR_NOTIFICATION_PREFERENCES = '[User] Clear Notification Preferences';
class LoadNotificationPreferences extends LoaderLoadAction {
    constructor(payload) {
        super(NOTIFICATION_PREFERENCES);
        this.payload = payload;
        this.type = LOAD_NOTIFICATION_PREFERENCES;
    }
}
class LoadNotificationPreferencesFail extends LoaderFailAction {
    constructor(payload) {
        super(NOTIFICATION_PREFERENCES, payload);
        this.payload = payload;
        this.type = LOAD_NOTIFICATION_PREFERENCES_FAIL;
    }
}
class LoadNotificationPreferencesSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(NOTIFICATION_PREFERENCES);
        this.payload = payload;
        this.type = LOAD_NOTIFICATION_PREFERENCES_SUCCESS;
    }
}
class UpdateNotificationPreferences extends EntityLoadAction {
    constructor(payload) {
        super(PROCESS_FEATURE, UPDATE_NOTIFICATION_PREFERENCES_PROCESS_ID);
        this.payload = payload;
        this.type = UPDATE_NOTIFICATION_PREFERENCES;
    }
}
class UpdateNotificationPreferencesFail extends EntityFailAction {
    constructor(payload) {
        super(PROCESS_FEATURE, UPDATE_NOTIFICATION_PREFERENCES_PROCESS_ID, payload);
        this.payload = payload;
        this.type = UPDATE_NOTIFICATION_PREFERENCES_FAIL;
    }
}
class UpdateNotificationPreferencesSuccess extends EntitySuccessAction {
    constructor(payload) {
        super(PROCESS_FEATURE, UPDATE_NOTIFICATION_PREFERENCES_PROCESS_ID);
        this.payload = payload;
        this.type = UPDATE_NOTIFICATION_PREFERENCES_SUCCESS;
    }
}
class ResetNotificationPreferences extends EntityLoaderResetAction {
    constructor() {
        super(PROCESS_FEATURE, UPDATE_NOTIFICATION_PREFERENCES_PROCESS_ID);
        this.type = RESET_NOTIFICATION_PREFERENCES;
    }
}
class ClearNotificationPreferences extends LoaderResetAction {
    constructor() {
        super(NOTIFICATION_PREFERENCES);
        this.type = CLEAR_NOTIFICATION_PREFERENCES;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_USER_PAYMENT_METHODS = '[User] Load User Payment Methods';
const LOAD_USER_PAYMENT_METHODS_FAIL = '[User] Load User Payment Methods Fail';
const LOAD_USER_PAYMENT_METHODS_SUCCESS = '[User] Load User Payment Methods Success';
const SET_DEFAULT_USER_PAYMENT_METHOD = '[User] Set Default User Payment Method';
const SET_DEFAULT_USER_PAYMENT_METHOD_FAIL = '[User] Set Default User Payment Method Fail';
const SET_DEFAULT_USER_PAYMENT_METHOD_SUCCESS = '[User] Set Default User Payment Method Success';
const DELETE_USER_PAYMENT_METHOD = '[User] Delete User Payment Method';
const DELETE_USER_PAYMENT_METHOD_FAIL = '[User] Delete User Payment Method Fail';
const DELETE_USER_PAYMENT_METHOD_SUCCESS = '[User] Delete User  Payment Method Success';
class LoadUserPaymentMethods extends LoaderLoadAction {
    constructor(payload) {
        super(USER_PAYMENT_METHODS);
        this.payload = payload;
        this.type = LOAD_USER_PAYMENT_METHODS;
    }
}
class LoadUserPaymentMethodsFail extends LoaderFailAction {
    constructor(payload) {
        super(USER_PAYMENT_METHODS, payload);
        this.payload = payload;
        this.type = LOAD_USER_PAYMENT_METHODS_FAIL;
    }
}
class LoadUserPaymentMethodsSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(USER_PAYMENT_METHODS);
        this.payload = payload;
        this.type = LOAD_USER_PAYMENT_METHODS_SUCCESS;
    }
}
class SetDefaultUserPaymentMethod extends LoaderLoadAction {
    constructor(payload) {
        super(USER_PAYMENT_METHODS);
        this.payload = payload;
        this.type = SET_DEFAULT_USER_PAYMENT_METHOD;
    }
}
class SetDefaultUserPaymentMethodFail extends LoaderFailAction {
    constructor(payload) {
        super(USER_PAYMENT_METHODS, payload);
        this.payload = payload;
        this.type = SET_DEFAULT_USER_PAYMENT_METHOD_FAIL;
    }
}
class SetDefaultUserPaymentMethodSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(USER_PAYMENT_METHODS);
        this.payload = payload;
        this.type = SET_DEFAULT_USER_PAYMENT_METHOD_SUCCESS;
    }
}
class DeleteUserPaymentMethod extends LoaderLoadAction {
    constructor(payload) {
        super(USER_PAYMENT_METHODS);
        this.payload = payload;
        this.type = DELETE_USER_PAYMENT_METHOD;
    }
}
class DeleteUserPaymentMethodFail extends LoaderFailAction {
    constructor(payload) {
        super(USER_PAYMENT_METHODS, payload);
        this.payload = payload;
        this.type = DELETE_USER_PAYMENT_METHOD_FAIL;
    }
}
class DeleteUserPaymentMethodSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(USER_PAYMENT_METHODS);
        this.payload = payload;
        this.type = DELETE_USER_PAYMENT_METHOD_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_PRODUCT_INTERESTS = 'Load Product Interests';
const LOAD_PRODUCT_INTERESTS_FAIL = 'Load Product Interests Fail';
const LOAD_PRODUCT_INTERESTS_SUCCESS = 'Load Product Interests Success';
const REMOVE_PRODUCT_INTEREST = 'Remove Product Interest';
const REMOVE_PRODUCT_INTEREST_SUCCESS = 'Remove Product Interest Success';
const REMOVE_PRODUCT_INTEREST_FAIL = 'Remove Product Interest Fail';
const ADD_PRODUCT_INTEREST = 'Add Product Interest';
const ADD_PRODUCT_INTEREST_FAIL = 'Add Product Interest Fail';
const ADD_PRODUCT_INTEREST_SUCCESS = 'Add Product Interest Success';
const ADD_PRODUCT_INTEREST_RESET = 'Add Product Interest Reset';
const REMOVE_PRODUCT_INTEREST_RESET = 'Remove Product Interest Reset';
const CLEAR_PRODUCT_INTERESTS = 'Clear Product Interests';
class LoadProductInterests extends LoaderLoadAction {
    constructor(payload) {
        super(PRODUCT_INTERESTS);
        this.payload = payload;
        this.type = LOAD_PRODUCT_INTERESTS;
    }
}
class LoadProductInterestsFail extends LoaderFailAction {
    constructor(payload) {
        super(PRODUCT_INTERESTS, payload);
        this.payload = payload;
        this.type = LOAD_PRODUCT_INTERESTS_FAIL;
    }
}
class LoadProductInterestsSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(PRODUCT_INTERESTS);
        this.payload = payload;
        this.type = LOAD_PRODUCT_INTERESTS_SUCCESS;
    }
}
class RemoveProductInterest extends EntityLoadAction {
    constructor(payload) {
        super(PROCESS_FEATURE, REMOVE_PRODUCT_INTERESTS_PROCESS_ID);
        this.payload = payload;
        this.type = REMOVE_PRODUCT_INTEREST;
    }
}
class RemoveProductInterestSuccess extends EntitySuccessAction {
    constructor(payload) {
        super(PROCESS_FEATURE, REMOVE_PRODUCT_INTERESTS_PROCESS_ID);
        this.payload = payload;
        this.type = REMOVE_PRODUCT_INTEREST_SUCCESS;
    }
}
class RemoveProductInterestFail extends EntityFailAction {
    constructor(payload) {
        super(PROCESS_FEATURE, REMOVE_PRODUCT_INTERESTS_PROCESS_ID, payload);
        this.payload = payload;
        this.type = REMOVE_PRODUCT_INTEREST_FAIL;
    }
}
class AddProductInterest extends EntityLoadAction {
    constructor(payload) {
        super(PROCESS_FEATURE, ADD_PRODUCT_INTEREST_PROCESS_ID);
        this.payload = payload;
        this.type = ADD_PRODUCT_INTEREST;
    }
}
class AddProductInterestSuccess extends EntitySuccessAction {
    constructor(payload) {
        super(PROCESS_FEATURE, ADD_PRODUCT_INTEREST_PROCESS_ID);
        this.payload = payload;
        this.type = ADD_PRODUCT_INTEREST_SUCCESS;
    }
}
class AddProductInterestFail extends EntityFailAction {
    constructor(payload) {
        super(PROCESS_FEATURE, ADD_PRODUCT_INTEREST_PROCESS_ID, payload);
        this.payload = payload;
        this.type = ADD_PRODUCT_INTEREST_FAIL;
    }
}
class ResetAddInterestState extends EntityLoaderResetAction {
    constructor() {
        super(PROCESS_FEATURE, ADD_PRODUCT_INTEREST_PROCESS_ID);
        this.type = ADD_PRODUCT_INTEREST_RESET;
    }
}
class ResetRemoveInterestState extends EntityLoaderResetAction {
    constructor() {
        super(PROCESS_FEATURE, REMOVE_PRODUCT_INTERESTS_PROCESS_ID);
        this.type = REMOVE_PRODUCT_INTEREST_RESET;
    }
}
class ClearProductInterests extends LoaderResetAction {
    constructor() {
        super(PRODUCT_INTERESTS);
        this.type = CLEAR_PRODUCT_INTERESTS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_REGIONS = '[User] Load Regions';
const LOAD_REGIONS_SUCCESS = '[User] Load Regions Success';
const LOAD_REGIONS_FAIL = '[User] Load Regions Fail';
const CLEAR_REGIONS = '[User] Clear Regions';
class LoadRegions extends LoaderLoadAction {
    constructor(payload) {
        super(REGIONS);
        this.payload = payload;
        this.type = LOAD_REGIONS;
    }
}
class LoadRegionsFail extends LoaderFailAction {
    constructor(payload) {
        super(REGIONS, payload);
        this.payload = payload;
        this.type = LOAD_REGIONS_FAIL;
    }
}
class LoadRegionsSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(REGIONS);
        this.payload = payload;
        this.type = LOAD_REGIONS_SUCCESS;
    }
}
class ClearRegions {
    constructor() {
        this.type = CLEAR_REGIONS;
        // Intentional empty constructor
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_USER_ADDRESSES = '[User] Load User Addresses';
const LOAD_USER_ADDRESSES_FAIL = '[User] Load User Addresses Fail';
const LOAD_USER_ADDRESSES_SUCCESS = '[User] Load User Addresses Success';
const ADD_USER_ADDRESS = '[User] Add User Address';
const ADD_USER_ADDRESS_FAIL = '[User] Add User Address Fail';
const ADD_USER_ADDRESS_SUCCESS = '[User] Add User Address Success';
const UPDATE_USER_ADDRESS = '[User] Update User Address';
const UPDATE_USER_ADDRESS_FAIL = '[User] Update User Address Fail';
const UPDATE_USER_ADDRESS_SUCCESS = '[User] Update User Address Success';
const DELETE_USER_ADDRESS = '[User] Delete User Address';
const DELETE_USER_ADDRESS_FAIL = '[User] Delete User Address Fail';
const DELETE_USER_ADDRESS_SUCCESS = '[User] Delete User Address Success';
class LoadUserAddresses extends LoaderLoadAction {
    constructor(payload) {
        super(USER_ADDRESSES);
        this.payload = payload;
        this.type = LOAD_USER_ADDRESSES;
    }
}
class LoadUserAddressesFail extends LoaderFailAction {
    constructor(payload) {
        super(USER_ADDRESSES, payload);
        this.payload = payload;
        this.type = LOAD_USER_ADDRESSES_FAIL;
    }
}
class LoadUserAddressesSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(USER_ADDRESSES);
        this.payload = payload;
        this.type = LOAD_USER_ADDRESSES_SUCCESS;
    }
}
// Adding address actions
class AddUserAddress extends LoaderLoadAction {
    constructor(payload) {
        super(USER_ADDRESSES);
        this.payload = payload;
        this.type = ADD_USER_ADDRESS;
    }
}
class AddUserAddressFail extends LoaderFailAction {
    constructor(payload) {
        super(USER_ADDRESSES, payload);
        this.payload = payload;
        this.type = ADD_USER_ADDRESS_FAIL;
    }
}
class AddUserAddressSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(USER_ADDRESSES);
        this.payload = payload;
        this.type = ADD_USER_ADDRESS_SUCCESS;
    }
}
// Updating address actions
class UpdateUserAddress extends LoaderLoadAction {
    constructor(payload) {
        super(USER_ADDRESSES);
        this.payload = payload;
        this.type = UPDATE_USER_ADDRESS;
    }
}
class UpdateUserAddressFail extends LoaderFailAction {
    constructor(payload) {
        super(USER_ADDRESSES, payload);
        this.payload = payload;
        this.type = UPDATE_USER_ADDRESS_FAIL;
    }
}
class UpdateUserAddressSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(USER_ADDRESSES);
        this.payload = payload;
        this.type = UPDATE_USER_ADDRESS_SUCCESS;
    }
}
// Deleting address actions
class DeleteUserAddress extends LoaderLoadAction {
    constructor(payload) {
        super(USER_ADDRESSES);
        this.payload = payload;
        this.type = DELETE_USER_ADDRESS;
    }
}
class DeleteUserAddressFail extends LoaderFailAction {
    constructor(payload) {
        super(USER_ADDRESSES, payload);
        this.payload = payload;
        this.type = DELETE_USER_ADDRESS_FAIL;
    }
}
class DeleteUserAddressSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(USER_ADDRESSES);
        this.payload = payload;
        this.type = DELETE_USER_ADDRESS_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_USER_CONSENTS = '[User] Load User Consents';
const LOAD_USER_CONSENTS_SUCCESS = '[User] Load User Consents Success';
const LOAD_USER_CONSENTS_FAIL = '[User] Load User Consents Fail';
const RESET_LOAD_USER_CONSENTS = '[User] Reset Load User Consents';
const GIVE_USER_CONSENT = '[User] Give User Consent';
const GIVE_USER_CONSENT_FAIL = '[User] Give User Consent Fail';
const GIVE_USER_CONSENT_SUCCESS = '[User] Give User Consent Success';
const RESET_GIVE_USER_CONSENT_PROCESS = '[User] Reset Give User Consent Process';
const TRANSFER_ANONYMOUS_CONSENT = '[User] Transfer Anonymous Consent';
const WITHDRAW_USER_CONSENT = '[User] Withdraw User Consent';
const WITHDRAW_USER_CONSENT_FAIL = '[User] Withdraw User Consent Fail';
const WITHDRAW_USER_CONSENT_SUCCESS = '[User] Withdraw User Consent Success';
const RESET_WITHDRAW_USER_CONSENT_PROCESS = '[User] Reset Withdraw User Consent Process';
class LoadUserConsents extends LoaderLoadAction {
    constructor(payload) {
        super(USER_CONSENTS);
        this.payload = payload;
        this.type = LOAD_USER_CONSENTS;
    }
}
class LoadUserConsentsFail extends LoaderFailAction {
    constructor(payload) {
        super(USER_CONSENTS, payload);
        this.payload = payload;
        this.type = LOAD_USER_CONSENTS_FAIL;
    }
}
class LoadUserConsentsSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(USER_CONSENTS);
        this.payload = payload;
        this.type = LOAD_USER_CONSENTS_SUCCESS;
    }
}
class ResetLoadUserConsents extends LoaderResetAction {
    constructor() {
        super(USER_CONSENTS);
        this.type = RESET_LOAD_USER_CONSENTS;
    }
}
class GiveUserConsent extends EntityLoadAction {
    constructor(payload) {
        super(PROCESS_FEATURE, GIVE_CONSENT_PROCESS_ID);
        this.payload = payload;
        this.type = GIVE_USER_CONSENT;
    }
}
class GiveUserConsentFail extends EntityFailAction {
    constructor(payload) {
        super(PROCESS_FEATURE, GIVE_CONSENT_PROCESS_ID, payload);
        this.type = GIVE_USER_CONSENT_FAIL;
    }
}
class GiveUserConsentSuccess extends EntitySuccessAction {
    constructor(consentTemplate) {
        super(PROCESS_FEATURE, GIVE_CONSENT_PROCESS_ID);
        this.consentTemplate = consentTemplate;
        this.type = GIVE_USER_CONSENT_SUCCESS;
    }
}
class ResetGiveUserConsentProcess extends EntityLoaderResetAction {
    constructor() {
        super(PROCESS_FEATURE, GIVE_CONSENT_PROCESS_ID);
        this.type = RESET_GIVE_USER_CONSENT_PROCESS;
    }
}
class TransferAnonymousConsent {
    constructor(payload) {
        this.payload = payload;
        this.type = TRANSFER_ANONYMOUS_CONSENT;
    }
}
class WithdrawUserConsent extends EntityLoadAction {
    constructor(payload) {
        super(PROCESS_FEATURE, WITHDRAW_CONSENT_PROCESS_ID);
        this.payload = payload;
        this.type = WITHDRAW_USER_CONSENT;
    }
}
class WithdrawUserConsentFail extends EntityFailAction {
    constructor(payload) {
        super(PROCESS_FEATURE, WITHDRAW_CONSENT_PROCESS_ID, payload);
        this.type = WITHDRAW_USER_CONSENT_FAIL;
    }
}
class WithdrawUserConsentSuccess extends EntitySuccessAction {
    constructor() {
        super(PROCESS_FEATURE, WITHDRAW_CONSENT_PROCESS_ID);
        this.type = WITHDRAW_USER_CONSENT_SUCCESS;
    }
}
class ResetWithdrawUserConsentProcess extends EntityLoaderResetAction {
    constructor() {
        super(PROCESS_FEATURE, WITHDRAW_CONSENT_PROCESS_ID);
        this.type = RESET_WITHDRAW_USER_CONSENT_PROCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_ACTIVE_COST_CENTERS = '[User] Load Active CostCenters';
const LOAD_ACTIVE_COST_CENTERS_FAIL = '[User] Load Active CostCenters Fail';
const LOAD_ACTIVE_COST_CENTERS_SUCCESS = '[User] Load Active CostCenters Success';
class LoadActiveCostCenters extends LoaderLoadAction {
    constructor(payload) {
        super(USER_COST_CENTERS);
        this.payload = payload;
        this.type = LOAD_ACTIVE_COST_CENTERS;
    }
}
class LoadActiveCostCentersFail extends LoaderFailAction {
    constructor(payload) {
        super(USER_COST_CENTERS, payload);
        this.payload = payload;
        this.type = LOAD_ACTIVE_COST_CENTERS_FAIL;
    }
}
class LoadActiveCostCentersSuccess extends LoaderSuccessAction {
    constructor(payload) {
        super(USER_COST_CENTERS);
        this.payload = payload;
        this.type = LOAD_ACTIVE_COST_CENTERS_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CLEAR_USER_MISCS_DATA = '[User] Clear User Misc Data';
class ClearUserMiscsData {
    constructor() {
        this.type = CLEAR_USER_MISCS_DATA;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const REGISTER_USER_SUCCESS = '[User] Register User Success';
/**
 * @deprecated since 3.2, moved to `@spartacus/user/profile/core`
 */
class RegisterUserSuccess extends EntitySuccessAction {
    constructor() {
        super(PROCESS_FEATURE, REGISTER_USER_PROCESS_ID);
        this.type = REGISTER_USER_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var userGroup_actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LOAD_BILLING_COUNTRIES: LOAD_BILLING_COUNTRIES,
    LOAD_BILLING_COUNTRIES_FAIL: LOAD_BILLING_COUNTRIES_FAIL,
    LOAD_BILLING_COUNTRIES_SUCCESS: LOAD_BILLING_COUNTRIES_SUCCESS,
    LoadBillingCountries: LoadBillingCountries,
    LoadBillingCountriesFail: LoadBillingCountriesFail,
    LoadBillingCountriesSuccess: LoadBillingCountriesSuccess,
    LOAD_CUSTOMER_COUPONS: LOAD_CUSTOMER_COUPONS,
    LOAD_CUSTOMER_COUPONS_FAIL: LOAD_CUSTOMER_COUPONS_FAIL,
    LOAD_CUSTOMER_COUPONS_SUCCESS: LOAD_CUSTOMER_COUPONS_SUCCESS,
    RESET_LOAD_CUSTOMER_COUPONS: RESET_LOAD_CUSTOMER_COUPONS,
    SUBSCRIBE_CUSTOMER_COUPON: SUBSCRIBE_CUSTOMER_COUPON,
    SUBSCRIBE_CUSTOMER_COUPON_FAIL: SUBSCRIBE_CUSTOMER_COUPON_FAIL,
    SUBSCRIBE_CUSTOMER_COUPON_SUCCESS: SUBSCRIBE_CUSTOMER_COUPON_SUCCESS,
    RESET_SUBSCRIBE_CUSTOMER_COUPON_PROCESS: RESET_SUBSCRIBE_CUSTOMER_COUPON_PROCESS,
    UNSUBSCRIBE_CUSTOMER_COUPON: UNSUBSCRIBE_CUSTOMER_COUPON,
    UNSUBSCRIBE_CUSTOMER_COUPON_FAIL: UNSUBSCRIBE_CUSTOMER_COUPON_FAIL,
    UNSUBSCRIBE_CUSTOMER_COUPON_SUCCESS: UNSUBSCRIBE_CUSTOMER_COUPON_SUCCESS,
    RESET_UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS: RESET_UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS,
    CLAIM_CUSTOMER_COUPON: CLAIM_CUSTOMER_COUPON,
    CLAIM_CUSTOMER_COUPON_FAIL: CLAIM_CUSTOMER_COUPON_FAIL,
    CLAIM_CUSTOMER_COUPON_SUCCESS: CLAIM_CUSTOMER_COUPON_SUCCESS,
    LoadCustomerCoupons: LoadCustomerCoupons,
    LoadCustomerCouponsFail: LoadCustomerCouponsFail,
    LoadCustomerCouponsSuccess: LoadCustomerCouponsSuccess,
    ResetLoadCustomerCoupons: ResetLoadCustomerCoupons,
    SubscribeCustomerCoupon: SubscribeCustomerCoupon,
    SubscribeCustomerCouponFail: SubscribeCustomerCouponFail,
    SubscribeCustomerCouponSuccess: SubscribeCustomerCouponSuccess,
    ResetSubscribeCustomerCouponProcess: ResetSubscribeCustomerCouponProcess,
    UnsubscribeCustomerCoupon: UnsubscribeCustomerCoupon,
    UnsubscribeCustomerCouponFail: UnsubscribeCustomerCouponFail,
    UnsubscribeCustomerCouponSuccess: UnsubscribeCustomerCouponSuccess,
    ResetUnsubscribeCustomerCouponProcess: ResetUnsubscribeCustomerCouponProcess,
    ClaimCustomerCoupon: ClaimCustomerCoupon,
    ClaimCustomerCouponFail: ClaimCustomerCouponFail,
    ClaimCustomerCouponSuccess: ClaimCustomerCouponSuccess,
    LOAD_DELIVERY_COUNTRIES: LOAD_DELIVERY_COUNTRIES,
    LOAD_DELIVERY_COUNTRIES_FAIL: LOAD_DELIVERY_COUNTRIES_FAIL,
    LOAD_DELIVERY_COUNTRIES_SUCCESS: LOAD_DELIVERY_COUNTRIES_SUCCESS,
    LoadDeliveryCountries: LoadDeliveryCountries,
    LoadDeliveryCountriesFail: LoadDeliveryCountriesFail,
    LoadDeliveryCountriesSuccess: LoadDeliveryCountriesSuccess,
    LOAD_NOTIFICATION_PREFERENCES: LOAD_NOTIFICATION_PREFERENCES,
    LOAD_NOTIFICATION_PREFERENCES_FAIL: LOAD_NOTIFICATION_PREFERENCES_FAIL,
    LOAD_NOTIFICATION_PREFERENCES_SUCCESS: LOAD_NOTIFICATION_PREFERENCES_SUCCESS,
    UPDATE_NOTIFICATION_PREFERENCES: UPDATE_NOTIFICATION_PREFERENCES,
    UPDATE_NOTIFICATION_PREFERENCES_FAIL: UPDATE_NOTIFICATION_PREFERENCES_FAIL,
    UPDATE_NOTIFICATION_PREFERENCES_SUCCESS: UPDATE_NOTIFICATION_PREFERENCES_SUCCESS,
    RESET_NOTIFICATION_PREFERENCES: RESET_NOTIFICATION_PREFERENCES,
    CLEAR_NOTIFICATION_PREFERENCES: CLEAR_NOTIFICATION_PREFERENCES,
    LoadNotificationPreferences: LoadNotificationPreferences,
    LoadNotificationPreferencesFail: LoadNotificationPreferencesFail,
    LoadNotificationPreferencesSuccess: LoadNotificationPreferencesSuccess,
    UpdateNotificationPreferences: UpdateNotificationPreferences,
    UpdateNotificationPreferencesFail: UpdateNotificationPreferencesFail,
    UpdateNotificationPreferencesSuccess: UpdateNotificationPreferencesSuccess,
    ResetNotificationPreferences: ResetNotificationPreferences,
    ClearNotificationPreferences: ClearNotificationPreferences,
    LOAD_USER_PAYMENT_METHODS: LOAD_USER_PAYMENT_METHODS,
    LOAD_USER_PAYMENT_METHODS_FAIL: LOAD_USER_PAYMENT_METHODS_FAIL,
    LOAD_USER_PAYMENT_METHODS_SUCCESS: LOAD_USER_PAYMENT_METHODS_SUCCESS,
    SET_DEFAULT_USER_PAYMENT_METHOD: SET_DEFAULT_USER_PAYMENT_METHOD,
    SET_DEFAULT_USER_PAYMENT_METHOD_FAIL: SET_DEFAULT_USER_PAYMENT_METHOD_FAIL,
    SET_DEFAULT_USER_PAYMENT_METHOD_SUCCESS: SET_DEFAULT_USER_PAYMENT_METHOD_SUCCESS,
    DELETE_USER_PAYMENT_METHOD: DELETE_USER_PAYMENT_METHOD,
    DELETE_USER_PAYMENT_METHOD_FAIL: DELETE_USER_PAYMENT_METHOD_FAIL,
    DELETE_USER_PAYMENT_METHOD_SUCCESS: DELETE_USER_PAYMENT_METHOD_SUCCESS,
    LoadUserPaymentMethods: LoadUserPaymentMethods,
    LoadUserPaymentMethodsFail: LoadUserPaymentMethodsFail,
    LoadUserPaymentMethodsSuccess: LoadUserPaymentMethodsSuccess,
    SetDefaultUserPaymentMethod: SetDefaultUserPaymentMethod,
    SetDefaultUserPaymentMethodFail: SetDefaultUserPaymentMethodFail,
    SetDefaultUserPaymentMethodSuccess: SetDefaultUserPaymentMethodSuccess,
    DeleteUserPaymentMethod: DeleteUserPaymentMethod,
    DeleteUserPaymentMethodFail: DeleteUserPaymentMethodFail,
    DeleteUserPaymentMethodSuccess: DeleteUserPaymentMethodSuccess,
    LOAD_PRODUCT_INTERESTS: LOAD_PRODUCT_INTERESTS,
    LOAD_PRODUCT_INTERESTS_FAIL: LOAD_PRODUCT_INTERESTS_FAIL,
    LOAD_PRODUCT_INTERESTS_SUCCESS: LOAD_PRODUCT_INTERESTS_SUCCESS,
    REMOVE_PRODUCT_INTEREST: REMOVE_PRODUCT_INTEREST,
    REMOVE_PRODUCT_INTEREST_SUCCESS: REMOVE_PRODUCT_INTEREST_SUCCESS,
    REMOVE_PRODUCT_INTEREST_FAIL: REMOVE_PRODUCT_INTEREST_FAIL,
    ADD_PRODUCT_INTEREST: ADD_PRODUCT_INTEREST,
    ADD_PRODUCT_INTEREST_FAIL: ADD_PRODUCT_INTEREST_FAIL,
    ADD_PRODUCT_INTEREST_SUCCESS: ADD_PRODUCT_INTEREST_SUCCESS,
    ADD_PRODUCT_INTEREST_RESET: ADD_PRODUCT_INTEREST_RESET,
    REMOVE_PRODUCT_INTEREST_RESET: REMOVE_PRODUCT_INTEREST_RESET,
    CLEAR_PRODUCT_INTERESTS: CLEAR_PRODUCT_INTERESTS,
    LoadProductInterests: LoadProductInterests,
    LoadProductInterestsFail: LoadProductInterestsFail,
    LoadProductInterestsSuccess: LoadProductInterestsSuccess,
    RemoveProductInterest: RemoveProductInterest,
    RemoveProductInterestSuccess: RemoveProductInterestSuccess,
    RemoveProductInterestFail: RemoveProductInterestFail,
    AddProductInterest: AddProductInterest,
    AddProductInterestSuccess: AddProductInterestSuccess,
    AddProductInterestFail: AddProductInterestFail,
    ResetAddInterestState: ResetAddInterestState,
    ResetRemoveInterestState: ResetRemoveInterestState,
    ClearProductInterests: ClearProductInterests,
    LOAD_REGIONS: LOAD_REGIONS,
    LOAD_REGIONS_SUCCESS: LOAD_REGIONS_SUCCESS,
    LOAD_REGIONS_FAIL: LOAD_REGIONS_FAIL,
    CLEAR_REGIONS: CLEAR_REGIONS,
    LoadRegions: LoadRegions,
    LoadRegionsFail: LoadRegionsFail,
    LoadRegionsSuccess: LoadRegionsSuccess,
    ClearRegions: ClearRegions,
    LOAD_USER_ADDRESSES: LOAD_USER_ADDRESSES,
    LOAD_USER_ADDRESSES_FAIL: LOAD_USER_ADDRESSES_FAIL,
    LOAD_USER_ADDRESSES_SUCCESS: LOAD_USER_ADDRESSES_SUCCESS,
    ADD_USER_ADDRESS: ADD_USER_ADDRESS,
    ADD_USER_ADDRESS_FAIL: ADD_USER_ADDRESS_FAIL,
    ADD_USER_ADDRESS_SUCCESS: ADD_USER_ADDRESS_SUCCESS,
    UPDATE_USER_ADDRESS: UPDATE_USER_ADDRESS,
    UPDATE_USER_ADDRESS_FAIL: UPDATE_USER_ADDRESS_FAIL,
    UPDATE_USER_ADDRESS_SUCCESS: UPDATE_USER_ADDRESS_SUCCESS,
    DELETE_USER_ADDRESS: DELETE_USER_ADDRESS,
    DELETE_USER_ADDRESS_FAIL: DELETE_USER_ADDRESS_FAIL,
    DELETE_USER_ADDRESS_SUCCESS: DELETE_USER_ADDRESS_SUCCESS,
    LoadUserAddresses: LoadUserAddresses,
    LoadUserAddressesFail: LoadUserAddressesFail,
    LoadUserAddressesSuccess: LoadUserAddressesSuccess,
    AddUserAddress: AddUserAddress,
    AddUserAddressFail: AddUserAddressFail,
    AddUserAddressSuccess: AddUserAddressSuccess,
    UpdateUserAddress: UpdateUserAddress,
    UpdateUserAddressFail: UpdateUserAddressFail,
    UpdateUserAddressSuccess: UpdateUserAddressSuccess,
    DeleteUserAddress: DeleteUserAddress,
    DeleteUserAddressFail: DeleteUserAddressFail,
    DeleteUserAddressSuccess: DeleteUserAddressSuccess,
    LOAD_USER_CONSENTS: LOAD_USER_CONSENTS,
    LOAD_USER_CONSENTS_SUCCESS: LOAD_USER_CONSENTS_SUCCESS,
    LOAD_USER_CONSENTS_FAIL: LOAD_USER_CONSENTS_FAIL,
    RESET_LOAD_USER_CONSENTS: RESET_LOAD_USER_CONSENTS,
    GIVE_USER_CONSENT: GIVE_USER_CONSENT,
    GIVE_USER_CONSENT_FAIL: GIVE_USER_CONSENT_FAIL,
    GIVE_USER_CONSENT_SUCCESS: GIVE_USER_CONSENT_SUCCESS,
    RESET_GIVE_USER_CONSENT_PROCESS: RESET_GIVE_USER_CONSENT_PROCESS,
    TRANSFER_ANONYMOUS_CONSENT: TRANSFER_ANONYMOUS_CONSENT,
    WITHDRAW_USER_CONSENT: WITHDRAW_USER_CONSENT,
    WITHDRAW_USER_CONSENT_FAIL: WITHDRAW_USER_CONSENT_FAIL,
    WITHDRAW_USER_CONSENT_SUCCESS: WITHDRAW_USER_CONSENT_SUCCESS,
    RESET_WITHDRAW_USER_CONSENT_PROCESS: RESET_WITHDRAW_USER_CONSENT_PROCESS,
    LoadUserConsents: LoadUserConsents,
    LoadUserConsentsFail: LoadUserConsentsFail,
    LoadUserConsentsSuccess: LoadUserConsentsSuccess,
    ResetLoadUserConsents: ResetLoadUserConsents,
    GiveUserConsent: GiveUserConsent,
    GiveUserConsentFail: GiveUserConsentFail,
    GiveUserConsentSuccess: GiveUserConsentSuccess,
    ResetGiveUserConsentProcess: ResetGiveUserConsentProcess,
    TransferAnonymousConsent: TransferAnonymousConsent,
    WithdrawUserConsent: WithdrawUserConsent,
    WithdrawUserConsentFail: WithdrawUserConsentFail,
    WithdrawUserConsentSuccess: WithdrawUserConsentSuccess,
    ResetWithdrawUserConsentProcess: ResetWithdrawUserConsentProcess,
    LOAD_ACTIVE_COST_CENTERS: LOAD_ACTIVE_COST_CENTERS,
    LOAD_ACTIVE_COST_CENTERS_FAIL: LOAD_ACTIVE_COST_CENTERS_FAIL,
    LOAD_ACTIVE_COST_CENTERS_SUCCESS: LOAD_ACTIVE_COST_CENTERS_SUCCESS,
    LoadActiveCostCenters: LoadActiveCostCenters,
    LoadActiveCostCentersFail: LoadActiveCostCentersFail,
    LoadActiveCostCentersSuccess: LoadActiveCostCentersSuccess,
    CLEAR_USER_MISCS_DATA: CLEAR_USER_MISCS_DATA,
    ClearUserMiscsData: ClearUserMiscsData,
    REGISTER_USER_SUCCESS: REGISTER_USER_SUCCESS,
    RegisterUserSuccess: RegisterUserSuccess
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AnonymousConsentTemplatesAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AnonymousConsentTemplatesConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    loadAnonymousConsentTemplates() {
        return this.adapter.loadAnonymousConsentTemplates();
    }
    loadAnonymousConsents() {
        return this.adapter.loadAnonymousConsents();
    }
}
AnonymousConsentTemplatesConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentTemplatesConnector, deps: [{ token: AnonymousConsentTemplatesAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
AnonymousConsentTemplatesConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentTemplatesConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentTemplatesConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: AnonymousConsentTemplatesAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getUserState = createFeatureSelector(USER_FEATURE);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getBillingCountriesState = createSelector(getUserState, (state) => state.billingCountries);
const getBillingCountriesEntites = createSelector(getBillingCountriesState, (state) => state.entities);
const getAllBillingCountries = createSelector(getBillingCountriesEntites, (entites) => Object.keys(entites).map((isocode) => entites[isocode]));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getCustomerCouponsState = createSelector(getUserState, (state) => state.customerCoupons);
const getCustomerCouponsLoaded = createSelector(getCustomerCouponsState, (state) => loaderSuccessSelector(state));
const getCustomerCouponsLoading = createSelector(getCustomerCouponsState, (state) => loaderLoadingSelector(state));
const getCustomerCoupons = createSelector(getCustomerCouponsState, (state) => loaderValueSelector(state));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getDeliveryCountriesState = createSelector(getUserState, (state) => state.countries);
const getDeliveryCountriesEntites = createSelector(getDeliveryCountriesState, (state) => state.entities);
const getAllDeliveryCountries = createSelector(getDeliveryCountriesEntites, (entites) => Object.keys(entites).map((isocode) => entites[isocode]));
const countrySelectorFactory = (isocode) => createSelector(getDeliveryCountriesEntites, (entities) => Object.keys(entities).length !== 0 ? entities[isocode] : null);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getPreferencesLoaderState = createSelector(getUserState, (state) => state.notificationPreferences);
const getPreferences = createSelector(getPreferencesLoaderState, (state) => loaderValueSelector(state));
const getEnabledPreferences = createSelector(getPreferencesLoaderState, (state) => loaderValueSelector(state).filter((p) => p.enabled));
const getPreferencesLoading = createSelector(getPreferencesLoaderState, (state) => loaderLoadingSelector(state));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getPaymentMethodsState = createSelector(getUserState, (state) => state.payments);
const getPaymentMethods = createSelector(getPaymentMethodsState, (state) => loaderValueSelector(state));
const getPaymentMethodsLoading = createSelector(getPaymentMethodsState, (state) => loaderLoadingSelector(state));
const getPaymentMethodsLoadedSuccess = createSelector(getPaymentMethodsState, (state) => loaderSuccessSelector(state) &&
    !loaderLoadingSelector(state));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getInterestsState = createSelector(getUserState, (state) => state.productInterests);
const getInterests = createSelector(getInterestsState, (state) => loaderValueSelector(state));
const getInterestsLoading = createSelector(getInterestsState, (state) => loaderLoadingSelector(state));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getRegionsLoaderState = createSelector(getUserState, (state) => state.regions);
const getAllRegions = createSelector(getRegionsLoaderState, (state) => {
    return loaderValueSelector(state).entities;
});
const getRegionsDataAndLoading = createSelector(getRegionsLoaderState, (state) => ({
    loaded: loaderSuccessSelector(state),
    loading: loaderLoadingSelector(state),
    regions: loaderValueSelector(state).entities,
    country: loaderValueSelector(state).country,
}));
const getRegionsCountry = createSelector(getRegionsLoaderState, (state) => loaderValueSelector(state).country);
const getRegionsLoading = createSelector(getRegionsLoaderState, (state) => loaderLoadingSelector(state));
const getRegionsLoaded = createSelector(getRegionsLoaderState, (state) => loaderSuccessSelector(state));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getAddressesLoaderState = createSelector(getUserState, (state) => state.addresses);
const getAddresses = createSelector(getAddressesLoaderState, (state) => loaderValueSelector(state));
const getAddressesLoading = createSelector(getAddressesLoaderState, (state) => loaderLoadingSelector(state));
const getAddressesLoadedSuccess = createSelector(getAddressesLoaderState, (state) => loaderSuccessSelector(state) &&
    !loaderLoadingSelector(state));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getConsentsState = createSelector(getUserState, (state) => state.consents);
const getConsentsValue = createSelector(getConsentsState, (state) => loaderValueSelector(state));
const getConsentByTemplateId = (templateId) => createSelector(getConsentsValue, (templates) => templates.find((template) => template.id === templateId));
const getConsentsLoading = createSelector(getConsentsState, loaderLoadingSelector);
const getConsentsSuccess = createSelector(getConsentsState, loaderSuccessSelector);
const getConsentsError = createSelector(getConsentsState, loaderErrorSelector);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getCostCentersState = createSelector(getUserState, (state) => state.costCenters);
const getCostCenters = createSelector(getCostCentersState, (state) => loaderValueSelector(state));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var usersGroup_selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getBillingCountriesState: getBillingCountriesState,
    getBillingCountriesEntites: getBillingCountriesEntites,
    getAllBillingCountries: getAllBillingCountries,
    getCustomerCouponsState: getCustomerCouponsState,
    getCustomerCouponsLoaded: getCustomerCouponsLoaded,
    getCustomerCouponsLoading: getCustomerCouponsLoading,
    getCustomerCoupons: getCustomerCoupons,
    getDeliveryCountriesState: getDeliveryCountriesState,
    getDeliveryCountriesEntites: getDeliveryCountriesEntites,
    getAllDeliveryCountries: getAllDeliveryCountries,
    countrySelectorFactory: countrySelectorFactory,
    getUserState: getUserState,
    getPreferencesLoaderState: getPreferencesLoaderState,
    getPreferences: getPreferences,
    getEnabledPreferences: getEnabledPreferences,
    getPreferencesLoading: getPreferencesLoading,
    getPaymentMethodsState: getPaymentMethodsState,
    getPaymentMethods: getPaymentMethods,
    getPaymentMethodsLoading: getPaymentMethodsLoading,
    getPaymentMethodsLoadedSuccess: getPaymentMethodsLoadedSuccess,
    getInterestsState: getInterestsState,
    getInterests: getInterests,
    getInterestsLoading: getInterestsLoading,
    getRegionsLoaderState: getRegionsLoaderState,
    getAllRegions: getAllRegions,
    getRegionsDataAndLoading: getRegionsDataAndLoading,
    getRegionsCountry: getRegionsCountry,
    getRegionsLoading: getRegionsLoading,
    getRegionsLoaded: getRegionsLoaded,
    getAddressesLoaderState: getAddressesLoaderState,
    getAddresses: getAddresses,
    getAddressesLoading: getAddressesLoading,
    getAddressesLoadedSuccess: getAddressesLoadedSuccess,
    getConsentsState: getConsentsState,
    getConsentsValue: getConsentsValue,
    getConsentByTemplateId: getConsentByTemplateId,
    getConsentsLoading: getConsentsLoading,
    getConsentsSuccess: getConsentsSuccess,
    getConsentsError: getConsentsError,
    getCostCentersState: getCostCentersState,
    getCostCenters: getCostCenters
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserConsentService {
    constructor(store, authService, userIdService) {
        this.store = store;
        this.authService = authService;
        this.userIdService = userIdService;
    }
    /**
     * Retrieves all consents.
     */
    loadConsents() {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new LoadUserConsents(userId));
        });
    }
    /**
     * Returns all consent templates. If `loadIfMissing` parameter is set to `true`, the method triggers the load if consent templates.
     * @param loadIfMissing is set to `true`, the method will load templates if those are not already present. The default value is `false`.
     */
    getConsents(loadIfMissing = false) {
        return iif(() => loadIfMissing, this.store.pipe(select(getConsentsValue), withLatestFrom(this.getConsentsResultLoading(), this.getConsentsResultSuccess()), filter(([_templates, loading, _success]) => !loading), tap(([templates, _loading, success]) => {
            if (!templates || templates.length === 0) {
                // avoid infinite loop - if we've already attempted to load templates and we got an empty array as the response
                if (!success) {
                    this.loadConsents();
                }
            }
        }), filter(([templates, _loading]) => Boolean(templates)), map(([templates, _loading]) => templates)), this.store.pipe(select(getConsentsValue)));
    }
    /**
     * Returns the consents loading flag
     */
    getConsentsResultLoading() {
        return this.store.pipe(select(getConsentsLoading));
    }
    /**
     * Returns the consents success flag
     */
    getConsentsResultSuccess() {
        return this.store.pipe(select(getConsentsSuccess));
    }
    /**
     * Returns the consents error flag
     */
    getConsentsResultError() {
        return this.store.pipe(select(getConsentsError));
    }
    /**
     * Resets the processing state for consent retrieval
     */
    resetConsentsProcessState() {
        this.store.dispatch(new ResetLoadUserConsents());
    }
    /**
     * Returns the registered consent for the given template ID.
     *
     * As a side-effect, the method will call `getConsents(true)` to load the templates if those are not present.
     *
     * @param templateId a template ID by which to filter the registered templates.
     */
    getConsent(templateId) {
        return this.authService.isUserLoggedIn().pipe(filter(Boolean), switchMap(() => this.getConsents(true)), switchMap(() => this.store.pipe(select(getConsentByTemplateId(templateId)))), filter(isNotUndefined), map((template) => template.currentConsent));
    }
    /**
     * Returns `true` if the consent is truthy and if `consentWithdrawnDate` doesn't exist.
     * Otherwise, `false` is returned.
     *
     * @param consent to check
     */
    isConsentGiven(consent) {
        return (Boolean(consent) &&
            Boolean(consent.consentGivenDate) &&
            !Boolean(consent.consentWithdrawnDate));
    }
    /**
     * Returns `true` if the consent is either falsy or if `consentWithdrawnDate` is present.
     * Otherwise, `false` is returned.
     *
     * @param consent to check
     */
    isConsentWithdrawn(consent) {
        if (Boolean(consent)) {
            return Boolean(consent === null || consent === void 0 ? void 0 : consent.consentWithdrawnDate);
        }
        return true;
    }
    /**
     * Give consent for specified consent template ID and version.
     * @param consentTemplateId a template ID for which to give a consent
     * @param consentTemplateVersion a template version for which to give a consent
     */
    giveConsent(consentTemplateId, consentTemplateVersion) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new GiveUserConsent({
                userId,
                consentTemplateId,
                consentTemplateVersion,
            }));
        });
    }
    /**
     * Returns the give consent process loading flag
     */
    getGiveConsentResultLoading() {
        return this.store.pipe(select(getProcessLoadingFactory(GIVE_CONSENT_PROCESS_ID)));
    }
    /**
     * Returns the give consent process success flag
     */
    getGiveConsentResultSuccess() {
        return this.store.pipe(select(getProcessSuccessFactory(GIVE_CONSENT_PROCESS_ID)));
    }
    /**
     * Returns the give consent process error flag
     */
    getGiveConsentResultError() {
        return this.store.pipe(select(getProcessErrorFactory(GIVE_CONSENT_PROCESS_ID)));
    }
    /**
     * Resents the give consent process flags
     */
    resetGiveConsentProcessState() {
        return this.store.dispatch(new ResetGiveUserConsentProcess());
    }
    /**
     * Withdraw consent for the given `consentCode`
     * @param consentCode for which to withdraw the consent
     */
    withdrawConsent(consentCode) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new WithdrawUserConsent({
                userId,
                consentCode,
            }));
        });
    }
    /**
     * Returns the withdraw consent process loading flag
     */
    getWithdrawConsentResultLoading() {
        return this.store.pipe(select(getProcessLoadingFactory(WITHDRAW_CONSENT_PROCESS_ID)));
    }
    /**
     * Returns the withdraw consent process success flag
     */
    getWithdrawConsentResultSuccess() {
        return this.store.pipe(select(getProcessSuccessFactory(WITHDRAW_CONSENT_PROCESS_ID)));
    }
    /**
     * Returns the withdraw consent process error flag
     */
    getWithdrawConsentResultError() {
        return this.store.pipe(select(getProcessErrorFactory(WITHDRAW_CONSENT_PROCESS_ID)));
    }
    /**
     * Resets the process flags for withdraw consent
     */
    resetWithdrawConsentProcessState() {
        return this.store.dispatch(new ResetWithdrawUserConsentProcess());
    }
    /**
     * Filters the provided `templateList`' templates by hiding the template IDs specified in `hideTemplateIds`.
     * If the `hideTemplateIds` is empty, the provided `templateList` is returned.
     *
     * @param templateList a list of consent templates to filter
     * @param hideTemplateIds template IDs to hide
     */
    filterConsentTemplates(templateList, hideTemplateIds = []) {
        if (hideTemplateIds.length === 0) {
            return templateList;
        }
        const updatedTemplateList = [];
        for (const template of templateList) {
            const show = template.id && !hideTemplateIds.includes(template.id);
            if (show) {
                updatedTemplateList.push(template);
            }
        }
        return updatedTemplateList;
    }
}
UserConsentService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserConsentService, deps: [{ token: i1$2.Store }, { token: AuthService }, { token: UserIdService }], target: i0.ɵɵFactoryTarget.Injectable });
UserConsentService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserConsentService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserConsentService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: AuthService }, { type: UserIdService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AnonymousConsentsEffects {
    constructor(actions$, anonymousConsentTemplatesConnector, authService, anonymousConsentsConfig, anonymousConsentService, userConsentService, userIdService) {
        this.actions$ = actions$;
        this.anonymousConsentTemplatesConnector = anonymousConsentTemplatesConnector;
        this.authService = authService;
        this.anonymousConsentsConfig = anonymousConsentsConfig;
        this.anonymousConsentService = anonymousConsentService;
        this.userConsentService = userConsentService;
        this.userIdService = userIdService;
        this.checkConsentVersions$ = createEffect(() => this.actions$.pipe(ofType(ANONYMOUS_CONSENT_CHECK_UPDATED_VERSIONS), withLatestFrom(this.anonymousConsentService.getConsents()), concatMap(([_, currentConsents]) => {
            return this.anonymousConsentTemplatesConnector
                .loadAnonymousConsents()
                .pipe(map((newConsents) => {
                if (!newConsents) {
                    if (isDevMode()) {
                        console.warn('No consents were loaded. Please check the Spartacus documentation as this could be a back-end configuration issue.');
                    }
                    return false;
                }
                const currentConsentVersions = currentConsents.map((consent) => consent.templateVersion);
                const newConsentVersions = newConsents.map((consent) => consent.templateVersion);
                return this.detectUpdatedVersion(currentConsentVersions, newConsentVersions);
            }), switchMap((updated) => updated
                ? of(new LoadAnonymousConsentTemplates())
                : EMPTY), catchError((error) => of(new LoadAnonymousConsentTemplatesFail(normalizeHttpError(error)))));
        })));
        this.loadAnonymousConsentTemplates$ = createEffect(() => this.actions$.pipe(ofType(LOAD_ANONYMOUS_CONSENT_TEMPLATES), withLatestFrom(this.anonymousConsentService.getTemplates()), concatMap(([_, currentConsentTemplates]) => this.anonymousConsentTemplatesConnector
            .loadAnonymousConsentTemplates()
            .pipe(mergeMap((newConsentTemplates) => {
            let updated = false;
            if (currentConsentTemplates &&
                currentConsentTemplates.length !== 0) {
                updated = this.anonymousConsentService.detectUpdatedTemplates(currentConsentTemplates, newConsentTemplates);
            }
            return [
                new LoadAnonymousConsentTemplatesSuccess(newConsentTemplates),
                new ToggleAnonymousConsentTemplatesUpdated(updated),
            ];
        }), catchError((error) => of(new LoadAnonymousConsentTemplatesFail(normalizeHttpError(error))))))));
        // TODO(#9416): This won't work with flow different than `Resource Owner Password Flow` which involves redirect (maybe in popup in will work)
        this.transferAnonymousConsentsToUser$ = createEffect(() => this.actions$.pipe(ofType(LOGIN), filter(() => Boolean(this.anonymousConsentsConfig.anonymousConsents)), withLatestFrom(this.actions$.pipe(ofType(REGISTER_USER_SUCCESS))), filter(([, registerAction]) => Boolean(registerAction)), switchMap(() => this.anonymousConsentService.getConsents().pipe(withLatestFrom(this.userIdService.getUserId(), this.anonymousConsentService.getTemplates(), this.authService.isUserLoggedIn()), filter(([, , , loggedIn]) => loggedIn), concatMap(([consents, userId, templates, _loggedIn]) => {
            const actions = [];
            for (const consent of consents) {
                if (this.anonymousConsentService.isConsentGiven(consent) &&
                    !this.isRequiredConsent(consent.templateCode)) {
                    for (const template of templates) {
                        if (template.id === consent.templateCode) {
                            actions.push(new TransferAnonymousConsent({
                                userId,
                                consentTemplateId: template.id,
                                consentTemplateVersion: template.version,
                            }));
                            break;
                        }
                    }
                }
            }
            if (actions.length > 0) {
                return actions;
            }
            return EMPTY;
        })))));
        this.giveRequiredConsentsToUser$ = createEffect(() => this.actions$.pipe(ofType(LOGIN), filter((action) => Boolean(this.anonymousConsentsConfig.anonymousConsents &&
            this.anonymousConsentsConfig.anonymousConsents.requiredConsents &&
            action)), concatMap(() => this.userConsentService.getConsentsResultSuccess().pipe(withLatestFrom(this.userIdService.getUserId(), this.userConsentService.getConsents(), this.authService.isUserLoggedIn()), filter(([, , , loggedIn]) => loggedIn), tap(([loaded, _userId, _templates, _loggedIn]) => {
            if (!loaded) {
                this.userConsentService.loadConsents();
            }
        }), map(([_loaded, userId, templates, _loggedIn]) => {
            return { userId, templates };
        }), concatMap(({ userId, templates }) => {
            const actions = [];
            for (const template of templates) {
                if (this.userConsentService.isConsentWithdrawn(template.currentConsent) &&
                    this.isRequiredConsent(template.id)) {
                    actions.push(new GiveUserConsent({
                        userId,
                        consentTemplateId: template.id,
                        consentTemplateVersion: template.version,
                    }));
                }
            }
            if (actions.length > 0) {
                return actions;
            }
            return EMPTY;
        })))));
    }
    isRequiredConsent(templateCode) {
        var _a, _b;
        return Boolean(templateCode &&
            ((_b = (_a = this.anonymousConsentsConfig.anonymousConsents) === null || _a === void 0 ? void 0 : _a.requiredConsents) === null || _b === void 0 ? void 0 : _b.includes(templateCode)));
    }
    /**
     * Compares the given versions and determines if there's a mismatch,
     * in which case `true` is returned.
     *
     * @param currentVersions versions of the current consents
     * @param newVersions versions of the new consents
     */
    detectUpdatedVersion(currentVersions, newVersions) {
        if (currentVersions.length !== newVersions.length) {
            return true;
        }
        for (let i = 0; i < newVersions.length; i++) {
            if (currentVersions[i] !== newVersions[i]) {
                return true;
            }
        }
        return false;
    }
}
AnonymousConsentsEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsEffects, deps: [{ token: i1$4.Actions }, { token: AnonymousConsentTemplatesConnector }, { token: AuthService }, { token: AnonymousConsentsConfig }, { token: AnonymousConsentsService }, { token: UserConsentService }, { token: UserIdService }], target: i0.ɵɵFactoryTarget.Injectable });
AnonymousConsentsEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: AnonymousConsentTemplatesConnector }, { type: AuthService }, { type: AnonymousConsentsConfig }, { type: AnonymousConsentsService }, { type: UserConsentService }, { type: UserIdService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const effects$5 = [AnonymousConsentsEffects];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class JavaRegExpConverter {
    constructor() {
        /**
         * Pattern that extracts modifiers from the Java regexp.
         *
         * Java regexps MAY start with ONE or MANY modifiers like `(?MODIFIERS)PATTERN`. Examples:
         * - `(?i)` for Case Insensitive Mode: `(?i)PATTERN`
         * - `(?u)` for Unicode-Aware Case Folding; `(?u)PATTERN`
         * - or multiple combined:  `(?iu)PATTERN`
         * - (more modifiers in the official Java docs https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html)
         *
         * This pattern extracts 3 parts from the input string, i.e. for `(?iu)PATTERN`:
         *    1. original modifiers syntax, i.e. `(?iu)` (or undefined if no modifiers present)
         *    2. extracted modifiers, i.e. `iu` (or undefined if no modifiers present)
         *    3. the rest of the regexp, i.e. `PATTERN`
         */
        this.EXTRACT_JAVA_REGEXP_MODIFIERS = /^(\(\?([a-z]+)\))?(.*)/;
    }
    /**
     * Converts RegExp from Java syntax to Javascript, by recognizing Java regexp modifiers
     * and converting them to the Javascript ones (i.e. case insensitive mode: `(?i)PATTERN` -> `/pattern/i`)
     *
     * **CAUTION!** Not all features and modifiers of Java regexps are valid in Javascript!
     * If unsupported feature or modifier is used, then `null` will be returned instead of Javascript RegExp.
     *
     * See differences between Java and Javascript regexps:
     * - https://stackoverflow.com/questions/8754444/convert-javascript-regular-expression-to-java-syntax
     * - https://en.wikipedia.org/wiki/Comparison_of_regular_expression_engines#Language_features
     */
    toJsRegExp(javaSyntax) {
        const parts = javaSyntax.match(this.EXTRACT_JAVA_REGEXP_MODIFIERS);
        if (!parts) {
            return null;
        }
        const [, , modifiers, jsSyntax] = parts;
        try {
            return new RegExp(jsSyntax, modifiers);
        }
        catch (error) {
            if (isDevMode()) {
                console.warn(`WARNING: Could not convert Java regexp into Javascript. Original regexp: ${javaSyntax} \nMessage: ${error}`);
            }
            return null;
        }
    }
}
JavaRegExpConverter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: JavaRegExpConverter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
JavaRegExpConverter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: JavaRegExpConverter, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: JavaRegExpConverter, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SiteContextConfigInitializer {
    constructor(baseSiteService, javaRegExpConverter, winRef) {
        this.baseSiteService = baseSiteService;
        this.javaRegExpConverter = javaRegExpConverter;
        this.winRef = winRef;
        this.scopes = ['context'];
        this.configFactory = () => this.resolveConfig().toPromise();
    }
    get currentUrl() {
        return this.winRef.location.href;
    }
    /**
     * Emits the site context config basing on the current base site data.
     *
     * Completes after emitting the value.
     */
    resolveConfig() {
        return this.baseSiteService.getAll().pipe(map((baseSites) => baseSites === null || baseSites === void 0 ? void 0 : baseSites.find((site) => this.isCurrentBaseSite(site))), filter((baseSite) => {
            if (!baseSite) {
                throw new Error(`Error: Cannot get base site config! Current url (${this.currentUrl}) doesn't match any of url patterns of any base sites.`);
            }
            return Boolean(baseSite);
        }), map((baseSite) => this.getConfig(baseSite)), take(1));
    }
    getConfig(source) {
        var _a, _b, _c, _d;
        const result = {
            context: {
                urlParameters: this.getUrlParams(source.urlEncodingAttributes),
                [BASE_SITE_CONTEXT_ID]: [source.uid],
                [LANGUAGE_CONTEXT_ID]: this.getIsoCodes((_a = source.baseStore) === null || _a === void 0 ? void 0 : _a.languages, source.defaultLanguage || ((_b = source.baseStore) === null || _b === void 0 ? void 0 : _b.defaultLanguage)),
                [CURRENCY_CONTEXT_ID]: this.getIsoCodes((_c = source.baseStore) === null || _c === void 0 ? void 0 : _c.currencies, (_d = source.baseStore) === null || _d === void 0 ? void 0 : _d.defaultCurrency),
                [THEME_CONTEXT_ID]: [source.theme],
            },
        };
        return result;
    }
    isCurrentBaseSite(site) {
        const index = (site.urlPatterns || []).findIndex((javaRegexp) => {
            const jsRegexp = this.javaRegExpConverter.toJsRegExp(javaRegexp);
            if (jsRegexp) {
                const result = jsRegexp.test(this.currentUrl);
                return result;
            }
        });
        return index !== -1;
    }
    /**
     * Returns an array of url encoded site context parameters.
     *
     * It maps the string "storefront" (used in OCC) to the "baseSite" (used in Spartacus)
     */
    getUrlParams(params) {
        const STOREFRONT_PARAM = 'storefront';
        return (params || []).map((param) => param === STOREFRONT_PARAM ? BASE_SITE_CONTEXT_ID : param);
    }
    /**
     * Returns iso codes in a array, where the first element is the default iso code.
     */
    getIsoCodes(elements, defaultElement) {
        if (elements && defaultElement) {
            const result = this.moveToFirst(elements, (el) => el.isocode === defaultElement.isocode).map((el) => el.isocode);
            return result;
        }
    }
    /**
     * Moves to the start of the array the first element that satisfies the given predicate.
     *
     * @param array array to modify
     * @param predicate function called on elements
     */
    moveToFirst(array, predicate) {
        array = [...array];
        const index = array.findIndex(predicate);
        if (index !== -1) {
            const [el] = array.splice(index, 1);
            array.unshift(el);
        }
        return array;
    }
}
SiteContextConfigInitializer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextConfigInitializer, deps: [{ token: BaseSiteService }, { token: JavaRegExpConverter }, { token: WindowRef }], target: i0.ɵɵFactoryTarget.Injectable });
SiteContextConfigInitializer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextConfigInitializer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextConfigInitializer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: BaseSiteService }, { type: JavaRegExpConverter }, { type: WindowRef }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SiteAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SiteConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    getLanguages() {
        return this.adapter.loadLanguages();
    }
    getCurrencies() {
        return this.adapter.loadCurrencies();
    }
    getCountries(type) {
        return this.adapter.loadCountries(type);
    }
    getRegions(countryIsoCode) {
        return this.adapter.loadRegions(countryIsoCode);
    }
    getBaseSite(siteUid) {
        return this.adapter.loadBaseSite(siteUid);
    }
    getBaseSites() {
        return this.adapter.loadBaseSites();
    }
}
SiteConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteConnector, deps: [{ token: SiteAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
SiteConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: SiteAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LANGUAGE_NORMALIZER = new InjectionToken('LanguageNormalizer');
const CURRENCY_NORMALIZER = new InjectionToken('CurrencyNormalizer');
const COUNTRY_NORMALIZER = new InjectionToken('CountryNormalizer');
const REGION_NORMALIZER = new InjectionToken('RegionNormalizer');
const BASE_SITE_NORMALIZER = new InjectionToken('BaseSiteNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Indicates that the language has changed.
 */
class LanguageSetEvent extends CxEvent {
}
/**
 * Event's type
 */
LanguageSetEvent.type = 'LanguageSetEvent';
/**
 * Indicates that the Currency has changed.
 */
class CurrencySetEvent extends CxEvent {
}
/**
 * Event's type
 */
CurrencySetEvent.type = 'CurrencySetEvent';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Builds and registers the site context events
 */
class SiteContextEventBuilder {
    constructor(actionsSubject, eventService) {
        this.actionsSubject = actionsSubject;
        this.eventService = eventService;
        this.register();
    }
    /**
     * Registers the site context events
     */
    register() {
        this.registerSetLanguage();
        this.registerSetCurrency();
    }
    /**
     * Register the language set action
     */
    registerSetLanguage() {
        const languageEvent$ = this.actionsSubject.pipe(ofType(SET_ACTIVE_LANGUAGE), map((languageAction) => createFrom(LanguageSetEvent, {
            activeLanguage: languageAction.payload,
        })));
        this.eventService.register(LanguageSetEvent, languageEvent$);
    }
    /**
     * Register the currency set action
     */
    registerSetCurrency() {
        const currencyEvent$ = this.actionsSubject.pipe(ofType(SET_ACTIVE_CURRENCY), map((currencyAction) => createFrom(CurrencySetEvent, {
            activeCurrency: currencyAction.payload,
        })));
        this.eventService.register(CurrencySetEvent, currencyEvent$);
    }
}
SiteContextEventBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextEventBuilder, deps: [{ token: i1$2.ActionsSubject }, { token: EventService }], target: i0.ɵɵFactoryTarget.Injectable });
SiteContextEventBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextEventBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextEventBuilder, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.ActionsSubject }, { type: EventService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SiteContextEventModule {
    constructor(_siteContextEventBuilder) {
        // Intentional empty constructor
    }
}
SiteContextEventModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextEventModule, deps: [{ token: SiteContextEventBuilder }], target: i0.ɵɵFactoryTarget.NgModule });
SiteContextEventModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: SiteContextEventModule });
SiteContextEventModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextEventModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextEventModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: SiteContextEventBuilder }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Facade that provides easy access to currency state, actions and selectors.
 */
class CurrencyService {
    constructor(store, config) {
        this.store = store;
        this.config = config;
    }
    /**
     * Represents all the currencies supported by the current store.
     */
    getAll() {
        return this.store.pipe(select(getAllCurrencies), tap((currencies) => {
            if (!currencies) {
                this.store.dispatch(new LoadCurrencies());
            }
        }), filter(isNotNullable));
    }
    /**
     * Represents the isocode of the active currency.
     */
    getActive() {
        return this.store.pipe(select(getActiveCurrency), filter(isNotNullable));
    }
    /**
     * Sets the active language.
     */
    setActive(isocode) {
        this.store
            .pipe(select(getActiveCurrency), take(1))
            .subscribe((activeCurrency) => {
            if (activeCurrency !== isocode && this.isValid(isocode)) {
                this.store.dispatch(new SetActiveCurrency(isocode));
            }
        });
    }
    /**
     * Tells whether the value of the active currency has been already initialized
     */
    isInitialized() {
        let valueInitialized = false;
        this.getActive()
            .subscribe(() => (valueInitialized = true))
            .unsubscribe();
        return valueInitialized;
    }
    /**
     * Tells whether the given iso code is allowed.
     *
     * The list of allowed iso codes can be configured in the `context` config of Spartacus.
     */
    isValid(value) {
        return (!!value &&
            getContextParameterValues(this.config, CURRENCY_CONTEXT_ID).includes(value));
    }
}
CurrencyService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrencyService, deps: [{ token: i1$2.Store }, { token: SiteContextConfig }], target: i0.ɵɵFactoryTarget.Injectable });
CurrencyService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrencyService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrencyService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: SiteContextConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Facade that provides easy access to language state, actions and selectors.
 */
class LanguageService {
    constructor(store, config) {
        this.store = store;
        this.config = config;
    }
    /**
     * Represents all the languages supported by the current store.
     */
    getAll() {
        return this.store.pipe(select(getAllLanguages), tap((languages) => {
            if (!languages) {
                this.store.dispatch(new LoadLanguages());
            }
        }), filter(isNotNullable));
    }
    /**
     * Represents the isocode of the active language.
     */
    getActive() {
        return this.store.pipe(select(getActiveLanguage), filter(isNotNullable));
    }
    /**
     * Sets the active language.
     */
    setActive(isocode) {
        this.store
            .pipe(select(getActiveLanguage), take(1))
            .subscribe((activeLanguage) => {
            if (activeLanguage !== isocode && this.isValid(isocode)) {
                this.store.dispatch(new SetActiveLanguage(isocode));
            }
        });
    }
    /**
     * Tells whether the value of the active language has been already initialized
     */
    isInitialized() {
        let valueInitialized = false;
        this.getActive()
            .subscribe(() => (valueInitialized = true))
            .unsubscribe();
        return valueInitialized;
    }
    /**
     * Tells whether the given iso code is allowed.
     *
     * The list of allowed iso codes can be configured in the `context` config of Spartacus.
     */
    isValid(value) {
        return (!!value &&
            getContextParameterValues(this.config, LANGUAGE_CONTEXT_ID).includes(value));
    }
}
LanguageService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguageService, deps: [{ token: i1$2.Store }, { token: SiteContextConfig }], target: i0.ɵɵFactoryTarget.Injectable });
LanguageService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguageService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguageService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: SiteContextConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ContextServiceMap {
}
function serviceMapFactory() {
    return {
        [LANGUAGE_CONTEXT_ID]: LanguageService,
        [CURRENCY_CONTEXT_ID]: CurrencyService,
        [BASE_SITE_CONTEXT_ID]: BaseSiteService,
    };
}
const contextServiceMapProvider = {
    provide: ContextServiceMap,
    useFactory: serviceMapFactory,
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class BaseSiteInitializer {
    constructor(baseSiteService, configInit) {
        this.baseSiteService = baseSiteService;
        this.configInit = configInit;
    }
    /**
     * Initializes the value of the base site
     */
    initialize() {
        this.subscription = this.configInit
            .getStable('context')
            .pipe(
        // TODO(#12351): <--- plug here explicitly SiteContextRoutesHandler
        switchMap(() => this.setFallbackValue()))
            .subscribe();
    }
    /**
     * On subscription to the returned observable:
     *
     * Sets the default value taken from config, unless the active base site has been already initialized.
     */
    setFallbackValue() {
        return this.configInit
            .getStable('context')
            .pipe(tap((config) => this.setDefaultFromConfig(config)));
    }
    /**
     * Sets the active base site value based on the default value from the config,
     * unless the active base site has been already initialized.
     */
    setDefaultFromConfig(config) {
        const contextParam = getContextParameterDefault(config, BASE_SITE_CONTEXT_ID);
        if (!this.baseSiteService.isInitialized() && contextParam) {
            this.baseSiteService.setActive(contextParam);
        }
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
}
BaseSiteInitializer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteInitializer, deps: [{ token: BaseSiteService }, { token: ConfigInitializerService }], target: i0.ɵɵFactoryTarget.Injectable });
BaseSiteInitializer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteInitializer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteInitializer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: BaseSiteService }, { type: ConfigInitializerService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CurrencyStatePersistenceService {
    constructor(statePersistenceService, currencyService, config) {
        this.statePersistenceService = statePersistenceService;
        this.currencyService = currencyService;
        this.config = config;
        this.initialized$ = new ReplaySubject(1);
    }
    initSync() {
        this.statePersistenceService.syncWithStorage({
            key: CURRENCY_CONTEXT_ID,
            state$: this.currencyService.getActive(),
            onRead: (state) => this.onRead(state),
        });
        return this.initialized$;
    }
    onRead(valueFromStorage) {
        if (!this.currencyService.isInitialized() && valueFromStorage) {
            this.currencyService.setActive(valueFromStorage);
        }
        if (!this.initialized$.closed) {
            this.initialized$.next();
            this.initialized$.complete();
        }
    }
}
CurrencyStatePersistenceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrencyStatePersistenceService, deps: [{ token: StatePersistenceService }, { token: CurrencyService }, { token: SiteContextConfig }], target: i0.ɵɵFactoryTarget.Injectable });
CurrencyStatePersistenceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrencyStatePersistenceService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrencyStatePersistenceService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: StatePersistenceService }, { type: CurrencyService }, { type: SiteContextConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function configInitializerFactory(configInitializer, initializers) {
    const isReady = () => configInitializer.initialize(initializers);
    return isReady;
}
function locationInitializedFactory(configInitializer) {
    return configInitializer.getStable().toPromise();
}
class ConfigInitializerModule {
    static forRoot() {
        return {
            ngModule: ConfigInitializerModule,
            providers: [
                {
                    provide: CONFIG_INITIALIZER_FORROOT_GUARD,
                    useValue: true,
                },
                {
                    provide: APP_INITIALIZER,
                    multi: true,
                    useFactory: configInitializerFactory,
                    deps: [
                        ConfigInitializerService,
                        [new Optional(), CONFIG_INITIALIZER],
                    ],
                },
                {
                    // Hold on the initial navigation until the Spartacus configuration is stable
                    provide: LOCATION_INITIALIZED,
                    useFactory: locationInitializedFactory,
                    deps: [ConfigInitializerService],
                },
            ],
        };
    }
}
ConfigInitializerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigInitializerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ConfigInitializerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ConfigInitializerModule });
ConfigInitializerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigInitializerModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigInitializerModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function configValidatorFactory(configInitializer, validators) {
    const validate = () => {
        if (isDevMode()) {
            configInitializer
                .getStable()
                .subscribe((config) => validateConfig(config, validators || []));
        }
    };
    return validate;
}
/**
 * Should stay private in 1.x
 * as forRoot() is used internally by ConfigInitializerModule
 *
 * issue: #5279
 */
class ConfigValidatorModule {
    static forRoot() {
        return {
            ngModule: ConfigValidatorModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    multi: true,
                    useFactory: configValidatorFactory,
                    deps: [
                        ConfigInitializerService,
                        [new Optional(), ConfigValidatorToken],
                    ],
                },
            ],
        };
    }
}
ConfigValidatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigValidatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ConfigValidatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ConfigValidatorModule });
ConfigValidatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigValidatorModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigValidatorModule, decorators: [{
            type: NgModule
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function isFeatureConfig(config) {
    return typeof config === 'object' && !!config.features;
}
function isInLevel(level, version) {
    if (level === '*') {
        return true;
    }
    const levelParts = level.split('.');
    const versionParts = version.split('.');
    for (let i = 0; i < versionParts.length; i++) {
        const versionNumberPart = Number(versionParts[i]);
        const levelNumberPart = Number(levelParts[i]) || 0;
        if (versionNumberPart !== levelNumberPart) {
            return levelNumberPart > versionNumberPart;
        }
    }
    return true;
}
function isFeatureLevel(config, level) {
    if (isFeatureConfig(config) && config.features.level) {
        return level.startsWith('!')
            ? !isInLevel(config.features.level, level.substr(1, level.length))
            : isInLevel(config.features.level, level);
    }
    return false;
}
function isFeatureEnabled(config, feature) {
    if (isFeatureConfig(config)) {
        const featureConfig = feature[0] === '!'
            ? config.features[feature.substr(1, feature.length)]
            : config.features[feature];
        const result = typeof featureConfig === 'string'
            ? isFeatureLevel(config, featureConfig)
            : featureConfig;
        return feature.startsWith('!') ? !result : !!result;
    }
    return false;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class FeaturesConfig {
}
FeaturesConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeaturesConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FeaturesConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeaturesConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeaturesConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class FeatureConfigService {
    constructor(config) {
        this.config = config;
    }
    isLevel(version) {
        return isFeatureLevel(this.config, version);
    }
    isEnabled(feature) {
        return isFeatureEnabled(this.config, feature);
    }
}
FeatureConfigService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureConfigService, deps: [{ token: FeaturesConfig }], target: i0.ɵɵFactoryTarget.Injectable });
FeatureConfigService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureConfigService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureConfigService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: FeaturesConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class FeatureLevelDirective {
    constructor(templateRef, viewContainer, featureConfig) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.featureConfig = featureConfig;
        this.hasView = false;
    }
    set cxFeatureLevel(level) {
        if (this.featureConfig.isLevel(level.toString()) && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        }
        else if (!this.featureConfig.isLevel(level.toString()) && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }
}
FeatureLevelDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureLevelDirective, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: FeatureConfigService }], target: i0.ɵɵFactoryTarget.Directive });
FeatureLevelDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.3", type: FeatureLevelDirective, selector: "[cxFeatureLevel]", inputs: { cxFeatureLevel: "cxFeatureLevel" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureLevelDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cxFeatureLevel]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: FeatureConfigService }]; }, propDecorators: { cxFeatureLevel: [{
                type: Input
            }] } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class FeatureDirective {
    constructor(templateRef, viewContainer, featureConfig) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.featureConfig = featureConfig;
        this.hasView = false;
    }
    set cxFeature(feature) {
        if (this.featureConfig.isEnabled(feature) && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        }
        else if (!this.featureConfig.isEnabled(feature) && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }
}
FeatureDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureDirective, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: FeatureConfigService }], target: i0.ɵɵFactoryTarget.Directive });
FeatureDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.3", type: FeatureDirective, selector: "[cxFeature]", inputs: { cxFeature: "cxFeature" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[cxFeature]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: FeatureConfigService }]; }, propDecorators: { cxFeature: [{
                type: Input
            }] } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class FeaturesConfigModule {
    static forRoot(defaultLevel = '3.0') {
        return {
            ngModule: FeaturesConfigModule,
            providers: [
                provideDefaultConfig({
                    features: {
                        level: defaultLevel || '*',
                    },
                }),
            ],
        };
    }
}
FeaturesConfigModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeaturesConfigModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FeaturesConfigModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: FeaturesConfigModule, declarations: [FeatureLevelDirective, FeatureDirective], exports: [FeatureLevelDirective, FeatureDirective] });
FeaturesConfigModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeaturesConfigModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeaturesConfigModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [FeatureLevelDirective, FeatureDirective],
                    exports: [FeatureLevelDirective, FeatureDirective],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const NOT_FOUND_SYMBOL$1 = {};
/**
 * CombinedInjector is able to combine more than one injector together.
 *
 * Can be used to instantiate lazy loaded modules with dependency modules,
 * so lazy loaded module can use instances provided in all dependency modules.
 *
 * Injector tries to resolve token in all Injector, taking into account the order
 * in which they were provided in complementaryInjectors and fallbacks to the
 * mainInjector.
 */
class CombinedInjector {
    /**
     * @param mainInjector Component hierarchical injector
     * @param complementaryInjectors Additional injector that will be taken into an account when resolving dependencies
     */
    constructor(mainInjector, complementaryInjectors) {
        this.mainInjector = mainInjector;
        this.complementaryInjectors = complementaryInjectors;
    }
    get(token, notFoundValue, flags) {
        // eslint-disable-next-line no-bitwise
        if (flags && flags & InjectFlags.Self) {
            if (notFoundValue !== undefined) {
                return notFoundValue;
            }
            throw new Error("CombinedInjector should be used as a parent injector / doesn't support self dependencies");
        }
        for (const injector of this.complementaryInjectors) {
            // First we are resolving providers provided at Self level
            // in all complementary injectors...
            const service = injector.get(token, NOT_FOUND_SYMBOL$1, InjectFlags.Self);
            if (service !== NOT_FOUND_SYMBOL$1) {
                return service;
            }
        }
        for (const injector of this.complementaryInjectors) {
            // next we try to resolve tokens from all levels
            const service = injector.get(token, NOT_FOUND_SYMBOL$1);
            if (service !== NOT_FOUND_SYMBOL$1) {
                return service;
            }
        }
        // ...and then fallback to main injector
        return this.mainInjector.get(token, notFoundValue);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Will be thrown in case lazy loaded modules are loaded and instantiated.
 *
 * This event is thrown for cms driven lazy loaded feature modules amd it's
 * dependencies
 */
class ModuleInitializedEvent extends CxEvent {
}
/**
 * Event's type
 */
ModuleInitializedEvent.type = 'ModuleInitializedEvent';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The MODULE_INITIALIZER is used as a multi provider that returns
 * a function that should be executed when the module is lazy loaded.
 * It is, in a way, an APP_INITIALIZER for lazy loaded modules.
 *
 * If the module is eagerly loaded, the MODULE_INITIALIZER functions
 * run when the app is initialized.  Therfore, if the module in which it is
 * defined is used in a eager loading configuration, MODULE_INITIALIZER
 * will fall back to work like APP_INITIALIZER.
 */
const MODULE_INITIALIZER = new InjectionToken('MODULE_INITIALIZER');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Utility service for managing dynamic imports of Angular services
 */
class LazyModulesService {
    constructor(compiler, injector, events) {
        this.compiler = compiler;
        this.injector = injector;
        this.events = events;
        /**
         * Expose lazy loaded module references
         */
        this.modules$ = this.events
            .get(ModuleInitializedEvent)
            .pipe(map((event) => event.moduleRef), publishReplay());
        this.dependencyModules = new Map();
        this.eventSubscription = this.modules$.connect();
    }
    /**
     * Resolves module instance based dynamic import wrapped in an arrow function
     *
     * New module instance will be created with each call.
     *
     * @param moduleFunc
     * @param feature
     */
    resolveModuleInstance(moduleFunc, feature, dependencyModuleRefs = []) {
        let parentInjector;
        if (!dependencyModuleRefs.length) {
            parentInjector = this.injector;
        }
        else if (dependencyModuleRefs.length === 1) {
            parentInjector = dependencyModuleRefs[0].injector;
        }
        else {
            parentInjector = new CombinedInjector(this.injector, dependencyModuleRefs.map((moduleRef) => moduleRef.injector));
        }
        return this.resolveModuleFactory(moduleFunc).pipe(map(([moduleFactory]) => moduleFactory.create(parentInjector)), concatMap((moduleRef) => this.runModuleInitializersForModule(moduleRef)), tap((moduleRef) => this.events.dispatch(createFrom(ModuleInitializedEvent, {
            feature,
            moduleRef,
        }))));
    }
    /**
     * Returns dependency module instance and initializes it when needed.
     *
     * Module will be instantiated only once, at first request for a this specific module class
     */
    resolveDependencyModuleInstance(moduleFunc) {
        // We grab moduleFactory symbol from module function and if there is no
        // such a module created yet, we create it and store it in a
        // dependencyModules map
        return this.resolveModuleFactory(moduleFunc).pipe(map(([moduleFactory, module]) => {
            if (!this.dependencyModules.has(module)) {
                const moduleRef = moduleFactory.create(this.injector);
                this.dependencyModules.set(module, moduleRef);
            }
            return this.dependencyModules.get(module);
        }), concatMap((moduleRef) => this.runModuleInitializersForModule(moduleRef)), tap((moduleRef) => this.events.dispatch(createFrom(ModuleInitializedEvent, {
            moduleRef,
        }))));
    }
    /**
     * The purpose of this function is to run MODULE_INITIALIZER logic that can be provided
     * by a lazy loaded module.  The module is recieved as a function parameter.
     * This function returns an Observable to the module reference passed as an argument.
     *
     * @param {NgModuleRef<any>} moduleRef
     *
     * @returns {Observable<NgModuleRef<any>>}
     */
    runModuleInitializersForModule(moduleRef) {
        const moduleInits = moduleRef.injector.get(MODULE_INITIALIZER, [], InjectFlags.Self);
        const asyncInitPromises = this.runModuleInitializerFunctions(moduleInits);
        if (asyncInitPromises.length) {
            return from(Promise.all(asyncInitPromises)).pipe(catchError((error) => {
                console.error('MODULE_INITIALIZER promise was rejected while lazy loading a module.', error);
                return throwError(error);
            }), switchMapTo(of(moduleRef)));
        }
        else {
            return of(moduleRef);
        }
    }
    /**
     * This function accepts an array of functions and runs them all. For each function that returns a promise,
     * the resulting promise is stored in an array of promises.  That array of promises is returned.
     * It is not required for the functions to return a Promise.  All functions are run.  The return values
     * that are not a Promise are simply not stored and returned.
     *
     * @param {(() => any)[]} initFunctions An array of functions too be run.
     *
     * @return {Promise<any>[]} An array of Promise returned by the functions, if any,
     */
    runModuleInitializerFunctions(initFunctions) {
        const initPromises = [];
        try {
            if (initFunctions) {
                for (let i = 0; i < initFunctions.length; i++) {
                    const initResult = initFunctions[i]();
                    if (this.isObjectPromise(initResult)) {
                        initPromises.push(initResult);
                    }
                }
            }
            return initPromises;
        }
        catch (error) {
            console.error(`MODULE_INITIALIZER init function throwed an error. `, error);
            throw error;
        }
    }
    /**
     * Determine if the argument is shaped like a Promise
     */
    isObjectPromise(obj) {
        return !!obj && typeof obj.then === 'function';
    }
    /**
     * Resolve any Angular module from an function that return module or moduleFactory
     */
    resolveModuleFactory(moduleFunc) {
        return from(moduleFunc()).pipe(switchMap((module) => module instanceof NgModuleFactory
            ? of([module, module])
            : combineLatest([
                // using compiler here is for jit compatibility, there is no overhead
                // for aot production builds as it will be stubbed
                from(this.compiler.compileModuleAsync(module)),
                of(module),
            ])), observeOn(queueScheduler));
    }
    ngOnDestroy() {
        if (this.eventSubscription) {
            this.eventSubscription.unsubscribe();
        }
        // clean up all initialized dependency modules
        this.dependencyModules.forEach((dependency) => dependency.destroy());
    }
}
LazyModulesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LazyModulesService, deps: [{ token: i0.Compiler }, { token: i0.Injector }, { token: EventService }], target: i0.ɵɵFactoryTarget.Injectable });
LazyModulesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LazyModulesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LazyModulesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i0.Compiler }, { type: i0.Injector }, { type: EventService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const NOT_FOUND_SYMBOL = {};
/**
 * UnifiedInjector provides a way to get instances of tokens not only once, from the root injector,
 * but also from lazy loaded module injectors that can be initialized over time.
 */
class UnifiedInjector {
    constructor(rootInjector, lazyModules) {
        this.rootInjector = rootInjector;
        this.lazyModules = lazyModules;
        /**
         * Gather all the injectors, with the root injector as a first one
         *
         */
        this.injectors$ = this.lazyModules.modules$.pipe(map((moduleRef) => moduleRef.injector), startWith(this.rootInjector));
    }
    /**
     * Gen instances for specified tokens.
     *
     * When notFoundValue is provided, it will consistently emit once per injector,
     * even if injector doesn't contain instances for specified token.
     * Otherwise, emissions will only involve cases, where new instances will be found.
     *
     * @param token
     * @param notFoundValue
     */
    get(token, notFoundValue) {
        return this.injectors$.pipe(map((injector, index) => injector.get(token, notFoundValue !== null && notFoundValue !== void 0 ? notFoundValue : NOT_FOUND_SYMBOL, 
        // we want to get only Self instances from all injectors except the
        // first one, which is a root injector
        index ? InjectFlags.Self : undefined)), filter((instance) => instance !== NOT_FOUND_SYMBOL));
    }
    getMulti(token) {
        return this.get(token, []).pipe(filter((instances) => {
            if (!Array.isArray(instances)) {
                throw new Error(`Multi-providers mixed with single providers for ${token.toString()}!`);
            }
            return instances.length > 0;
        }), scan((acc, services) => [...acc, ...services], []));
    }
}
UnifiedInjector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UnifiedInjector, deps: [{ token: i0.Injector }, { token: LazyModulesService }], target: i0.ɵɵFactoryTarget.Injectable });
UnifiedInjector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UnifiedInjector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UnifiedInjector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: LazyModulesService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ConfigurationService {
    constructor(rootConfig, defaultConfig, unifiedInjector, config) {
        this.rootConfig = rootConfig;
        this.defaultConfig = defaultConfig;
        this.unifiedInjector = unifiedInjector;
        this.ambientDefaultConfig = {};
        this.ambientConfig = {};
        this.config = config;
        this.unifiedConfig$ = new BehaviorSubject(config);
        // We need to use subscription to propagate changes to the config from the beginning.
        // It will be possible to make it lazy, when we drop this compatibility feature
        // in the future.
        this.subscription = this.feedUnifiedConfig().subscribe();
    }
    feedUnifiedConfig() {
        const configChunks$ = this.unifiedInjector.get(ConfigChunk, []);
        const defaultConfigChunks$ = this.unifiedInjector.get(DefaultConfigChunk, []);
        return zip(configChunks$, defaultConfigChunks$).pipe(
        // we don't need result from the root injector
        skip(1), tap(([configChunks, defaultConfigChunks]) => this.processConfig(configChunks, defaultConfigChunks)));
    }
    processConfig(configChunks, defaultConfigChunks) {
        if (defaultConfigChunks === null || defaultConfigChunks === void 0 ? void 0 : defaultConfigChunks.length) {
            deepMerge(this.ambientDefaultConfig, ...defaultConfigChunks);
        }
        if (configChunks.length) {
            deepMerge(this.ambientConfig, ...configChunks);
        }
        if (configChunks.length || defaultConfigChunks.length) {
            this.emitUnifiedConfig();
        }
    }
    emitUnifiedConfig() {
        const newConfig = deepMerge({}, this.defaultConfig, this.ambientDefaultConfig, this.ambientConfig, this.rootConfig);
        this.unifiedConfig$.next(newConfig);
        // compatibility mechanism, can be disabled with feature toggle
        if (!isFeatureEnabled(this.config, 'disableConfigUpdates')) {
            deepMerge(this.config, newConfig);
        }
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.unifiedConfig$.complete();
    }
}
ConfigurationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigurationService, deps: [{ token: RootConfig }, { token: DefaultConfig }, { token: UnifiedInjector }, { token: Config }], target: i0.ɵɵFactoryTarget.Injectable });
ConfigurationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigurationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigurationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: Config, decorators: [{
                        type: Inject,
                        args: [RootConfig]
                    }] }, { type: Config, decorators: [{
                        type: Inject,
                        args: [DefaultConfig]
                    }] }, { type: UnifiedInjector }, { type: Config }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ConfigModule {
    // To make sure ConfigurationService will be instantiated, we inject it into
    // module constructor
    constructor(_configurationService) {
        // Intentional empty constructor
    }
    /**
     * Import ConfigModule and contribute config to the global configuration
     *
     * To provide default configuration in libraries provideDefaultConfig should be used instead.
     *
     * @param config Config object to merge with the global configuration
     */
    static withConfig(config) {
        return {
            ngModule: ConfigModule,
            // eslint-disable-next-line @spartacus-eslint/use-default-provide-config
            providers: [provideConfig(config)],
        };
    }
    /**
     * Import ConfigModule and contribute config to the global configuration using factory function
     *
     * To provide default configuration in libraries provideDefaultConfigFactory should be used instead.
     *
     * @param configFactory Factory function that will generate configuration
     * @param deps Optional dependencies to factory function
     */
    static withConfigFactory(configFactory, deps) {
        return {
            ngModule: ConfigModule,
            providers: [provideConfigFactory(configFactory, deps)],
        };
    }
    /**
     * Module with providers, should be imported only once, if possible, at the root of the app.
     *
     * @param config
     */
    static forRoot(config = {}) {
        return {
            ngModule: ConfigModule,
            // eslint-disable-next-line @spartacus-eslint/use-default-provide-config
            providers: [provideConfig(config)],
        };
    }
}
ConfigModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigModule, deps: [{ token: ConfigurationService }], target: i0.ɵɵFactoryTarget.NgModule });
ConfigModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ConfigModule });
ConfigModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: ConfigurationService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getCookie(cookie, name) {
    const regExp = new RegExp('(?:^|;\\s*)' + name + '=([^;]*)', 'g');
    const result = regExp.exec(cookie);
    return (result && decodeURIComponent(result[1])) || '';
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const TEST_CONFIG_COOKIE_NAME = new InjectionToken('TEST_CONFIG_COOKIE_NAME');
function parseConfigJSON(config) {
    try {
        return JSON.parse(decodeURIComponent(config));
    }
    catch (_) {
        return {};
    }
}
function configFromCookieFactory(cookieName, platform, document) {
    if (isPlatformBrowser(platform) && cookieName) {
        const config = getCookie(document.cookie, cookieName);
        return parseConfigJSON(config);
    }
    return {};
}
/**
 * Designed/intended to provide dynamic configuration for testing scenarios ONLY (e.g. e2e tests).
 *
 * CAUTION: DON'T USE IT IN PRODUCTION! IT HASN'T BEEN REVIEWED FOR SECURITY ISSUES.
 */
class TestConfigModule {
    /**
     * Injects JSON config from the cookie of the given name.
     *
     * Be aware of the cookie limitations (4096 bytes).
     *
     * CAUTION: DON'T USE IT IN PRODUCTION! IT HASN'T BEEN REVIEWED FOR SECURITY ISSUES.
     */
    static forRoot(options) {
        return {
            ngModule: TestConfigModule,
            providers: [
                {
                    provide: TEST_CONFIG_COOKIE_NAME,
                    useValue: options && options.cookie,
                },
                provideConfigFactory(configFromCookieFactory, [
                    TEST_CONFIG_COOKIE_NAME,
                    PLATFORM_ID,
                    DOCUMENT,
                ]),
            ],
        };
    }
}
TestConfigModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TestConfigModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TestConfigModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: TestConfigModule });
TestConfigModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TestConfigModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TestConfigModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CurrencyInitializer {
    constructor(currencyService, currencyStatePersistenceService, configInit) {
        this.currencyService = currencyService;
        this.currencyStatePersistenceService = currencyStatePersistenceService;
        this.configInit = configInit;
    }
    /**
     * Initializes the value of the active currency.
     */
    initialize() {
        this.subscription = this.configInit
            .getStable('context')
            .pipe(
        // TODO(#12351): <--- plug here explicitly SiteContextRoutesHandler
        switchMap(() => this.currencyStatePersistenceService.initSync()), switchMap(() => this.setFallbackValue()))
            .subscribe();
    }
    /**
     * On subscription to the returned observable:
     *
     * Sets the default value taken from config, unless the active currency has been already initialized.
     */
    setFallbackValue() {
        return this.configInit
            .getStable('context')
            .pipe(tap((config) => this.setDefaultFromConfig(config)));
    }
    /**
     * Sets the active currency value based on the default value from the config,
     * unless the active currency has been already initialized.
     */
    setDefaultFromConfig(config) {
        const contextParam = getContextParameterDefault(config, CURRENCY_CONTEXT_ID);
        if (!this.currencyService.isInitialized() && contextParam) {
            this.currencyService.setActive(contextParam);
        }
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
}
CurrencyInitializer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrencyInitializer, deps: [{ token: CurrencyService }, { token: CurrencyStatePersistenceService }, { token: ConfigInitializerService }], target: i0.ɵɵFactoryTarget.Injectable });
CurrencyInitializer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrencyInitializer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrencyInitializer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: CurrencyService }, { type: CurrencyStatePersistenceService }, { type: ConfigInitializerService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class LanguageStatePersistenceService {
    constructor(statePersistenceService, languageService, config) {
        this.statePersistenceService = statePersistenceService;
        this.languageService = languageService;
        this.config = config;
        this.initialized$ = new ReplaySubject(1);
    }
    /**
     * Initializes the synchronization of the active language with the local storage.
     *
     * @returns Observable that emits and completes when the value is read from the storage.
     */
    initSync() {
        this.statePersistenceService.syncWithStorage({
            key: LANGUAGE_CONTEXT_ID,
            state$: this.languageService.getActive(),
            onRead: (state) => this.onRead(state),
        });
        return this.initialized$;
    }
    onRead(valueFromStorage) {
        if (!this.languageService.isInitialized() && valueFromStorage) {
            this.languageService.setActive(valueFromStorage);
        }
        if (!this.initialized$.closed) {
            this.initialized$.next();
            this.initialized$.complete();
        }
    }
}
LanguageStatePersistenceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguageStatePersistenceService, deps: [{ token: StatePersistenceService }, { token: LanguageService }, { token: SiteContextConfig }], target: i0.ɵɵFactoryTarget.Injectable });
LanguageStatePersistenceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguageStatePersistenceService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguageStatePersistenceService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: StatePersistenceService }, { type: LanguageService }, { type: SiteContextConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class LanguageInitializer {
    constructor(languageService, languageStatePersistenceService, configInit) {
        this.languageService = languageService;
        this.languageStatePersistenceService = languageStatePersistenceService;
        this.configInit = configInit;
    }
    /**
     * Initializes the value of the active language.
     */
    initialize() {
        this.subscription = this.configInit
            .getStable('context')
            .pipe(
        // TODO(#12351): <--- plug here explicitly SiteContextRoutesHandler
        switchMap(() => this.languageStatePersistenceService.initSync()), switchMap(() => this.setFallbackValue()))
            .subscribe();
    }
    /**
     * On subscription to the returned observable:
     *
     * Sets the default value taken from config, unless the active language has been already initialized.
     */
    setFallbackValue() {
        return this.configInit
            .getStable('context')
            .pipe(tap((config) => this.setDefaultFromConfig(config)));
    }
    /**
     * Sets the active language value based on the default value from the config,
     * unless the active language has been already initialized.
     */
    setDefaultFromConfig(config) {
        const contextParam = getContextParameterDefault(config, LANGUAGE_CONTEXT_ID);
        if (!this.languageService.isInitialized() && contextParam) {
            this.languageService.setActive(contextParam);
        }
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
}
LanguageInitializer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguageInitializer, deps: [{ token: LanguageService }, { token: LanguageStatePersistenceService }, { token: ConfigInitializerService }], target: i0.ɵɵFactoryTarget.Injectable });
LanguageInitializer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguageInitializer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguageInitializer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: LanguageService }, { type: LanguageStatePersistenceService }, { type: ConfigInitializerService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SiteContextParamsService {
    constructor(config, injector, serviceMap) {
        this.config = config;
        this.injector = injector;
        this.serviceMap = serviceMap;
    }
    getContextParameters() {
        if (this.config.context) {
            return Object.keys(this.config.context).filter((param) => param !== 'urlParameters');
        }
        return [];
    }
    getUrlEncodingParameters() {
        return (this.config.context && this.config.context.urlParameters) || [];
    }
    getParamValues(param) {
        return getContextParameterValues(this.config, param);
    }
    getParamDefaultValue(param) {
        return getContextParameterDefault(this.config, param);
    }
    getSiteContextService(param) {
        if (this.serviceMap[param]) {
            try {
                return this.injector.get(this.serviceMap[param]);
            }
            catch (_a) {
                if (isDevMode()) {
                    console.warn(`Couldn't find site context service for '${param}'.`);
                }
                return undefined;
            }
        }
    }
    getValue(param) {
        let value;
        const service = this.getSiteContextService(param);
        if (service) {
            service
                .getActive()
                .subscribe((val) => (value = val))
                .unsubscribe();
        }
        return value !== undefined ? value : this.getParamDefaultValue(param);
    }
    setValue(param, value) {
        const service = this.getSiteContextService(param);
        if (service) {
            service.setActive(value);
        }
    }
    /**
     * Get active values for all provided context parameters
     *
     * @param params Context parameters
     *
     * @returns Observable emitting array of all passed active context values
     */
    getValues(params) {
        if (params.length === 0) {
            return of([]);
        }
        return combineLatest(params.map((param) => {
            const service = this.getSiteContextService(param);
            if (service) {
                return service.getActive().pipe(distinctUntilChanged());
            }
            return of('');
        })).pipe(filter((value) => value.every((param) => !!param)));
    }
}
SiteContextParamsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextParamsService, deps: [{ token: SiteContextConfig }, { token: i0.Injector }, { token: ContextServiceMap }], target: i0.ɵɵFactoryTarget.Injectable });
SiteContextParamsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextParamsService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextParamsService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: SiteContextConfig }, { type: i0.Injector }, { type: ContextServiceMap }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Angular URL Serializer aware of Spartacus site context parameters
 * encoded in the URL.
 */
class SiteContextUrlSerializer extends DefaultUrlSerializer {
    constructor(siteContextParams) {
        super();
        this.siteContextParams = siteContextParams;
        /**
         * Splits the URL into 2 parts: path and the query/fragment part
         */
        this.URL_SPLIT = /(^[^#?]*)(.*)/;
    }
    /**
     * Names of site context parameters encoded in the URL
     */
    get urlEncodingParameters() {
        return this.siteContextParams.getUrlEncodingParameters();
    }
    /**
     * Tells whether any site context parameters should be encoded in the URL
     */
    get hasContextInRoutes() {
        return this.urlEncodingParameters.length > 0;
    }
    /**
     * @override Recognizes the site context parameters encoded in the prefix segments
     * of the given URL.
     *
     * It returns the UrlTree for the given URL shortened by the recognized params, but saves
     * the params' values in the custom property of UrlTree: `siteContext`.
     */
    parse(url) {
        if (this.hasContextInRoutes) {
            const urlWithParams = this.urlExtractContextParameters(url);
            const parsed = super.parse(urlWithParams.url);
            this.urlTreeIncludeContextParameters(parsed, urlWithParams.params);
            return parsed;
        }
        else {
            return super.parse(url);
        }
    }
    /**
     * Recognizes the site context parameters encoded in the prefix segments of the given URL.
     *
     * It returns the recognized site context params as well as the
     * URL shortened by the recognized params.
     */
    urlExtractContextParameters(url) {
        var _a, _b;
        const [, urlPart, queryPart] = (_a = url.match(this.URL_SPLIT)) !== null && _a !== void 0 ? _a : [, '', ''];
        const segments = (_b = urlPart === null || urlPart === void 0 ? void 0 : urlPart.split('/')) !== null && _b !== void 0 ? _b : [];
        if (segments[0] === '') {
            segments.shift();
        }
        const params = {};
        let paramId = 0;
        let segmentId = 0;
        while (paramId < this.urlEncodingParameters.length &&
            segmentId < segments.length) {
            const paramName = this.urlEncodingParameters[paramId];
            const paramValues = this.siteContextParams.getParamValues(paramName);
            if (paramValues.includes(segments[segmentId])) {
                params[paramName] = segments[segmentId];
                segmentId++;
            }
            paramId++;
        }
        url = segments.slice(segmentId).join('/') + queryPart;
        return { url, params };
    }
    /**
     * Saves the given site context parameters in the custom property
     * of the given UrlTree: `siteContext`.
     */
    urlTreeIncludeContextParameters(urlTree, params) {
        urlTree.siteContext = params;
    }
    /**
     * @override Serializes the given UrlTree to a string and prepends
     *  to it the current values of the site context parameters.
     */
    serialize(tree) {
        const params = this.urlTreeExtractContextParameters(tree);
        const url = super.serialize(tree);
        const serialized = this.urlIncludeContextParameters(url, params);
        return serialized;
    }
    /**
     * Returns the site context parameters stored in the custom property
     * of the UrlTree: `siteContext`.
     */
    urlTreeExtractContextParameters(urlTree) {
        return urlTree.siteContext ? urlTree.siteContext : {};
    }
    /**
     * Prepends the current values of the site context parameters to the given URL.
     */
    urlIncludeContextParameters(url, params) {
        const contextRoutePart = this.urlEncodingParameters
            .map((param) => {
            return params[param]
                ? params[param]
                : this.siteContextParams.getValue(param);
        })
            .join('/');
        return contextRoutePart + url;
    }
}
SiteContextUrlSerializer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextUrlSerializer, deps: [{ token: SiteContextParamsService }], target: i0.ɵɵFactoryTarget.Injectable });
SiteContextUrlSerializer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextUrlSerializer });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextUrlSerializer, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: SiteContextParamsService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function baseSiteConfigValidator(config) {
    if (getContextParameterDefault(config, BASE_SITE_CONTEXT_ID) === undefined) {
        return 'Please configure context.parameters.baseSite before using storefront library!';
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function defaultSiteContextConfigFactory() {
    return {
        context: {
            [LANGUAGE_CONTEXT_ID]: [
                'en',
                'de',
                'ja',
                'zh',
                'ru',
                'fr',
                'tr',
                'it',
                'es',
                'uk',
                'pl',
                'nl',
                'hi',
                'ar',
                'pt',
                'bn',
                'pa',
            ],
            [CURRENCY_CONTEXT_ID]: [
                'USD',
                'EUR',
                'JPY',
                'GBP',
                'AUD',
                'CAD',
                'CHF',
                'CNY',
                'SEK',
                'NZD',
                'MXN',
                'SGD',
                'HKD',
                'NOK',
                'KRW',
                'TRY',
                'RUB',
                'INR',
                'BRL',
                'ZAR',
            ],
        },
    };
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function initializeCurrency(currencyInitializer) {
    const result = () => {
        currencyInitializer.initialize();
    };
    return result;
}
function initializeLanguage(languageInitializer) {
    const result = () => {
        languageInitializer.initialize();
    };
    return result;
}
function initializeBaseSite(baseSiteInitializer) {
    const result = () => {
        baseSiteInitializer.initialize();
    };
    return result;
}
const contextInitializerProviders = [
    {
        provide: APP_INITIALIZER,
        useFactory: initializeLanguage,
        deps: [LanguageInitializer],
        multi: true,
    },
    {
        provide: APP_INITIALIZER,
        useFactory: initializeCurrency,
        deps: [CurrencyInitializer],
        multi: true,
    },
    {
        provide: APP_INITIALIZER,
        useFactory: initializeBaseSite,
        deps: [BaseSiteInitializer],
        multi: true,
    },
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
// PRIVATE API
class SiteContextRoutesHandler {
    constructor(siteContextParams, serializer, injector) {
        this.siteContextParams = siteContextParams;
        this.serializer = serializer;
        this.injector = injector;
        this.subscription = new Subscription();
        this.contextValues = {};
        /**
         * Tells whether there is a pending navigation at the moment, so we can avoid an infinite loop caused by the cyclic dependency:
         * - `subscribeChanges` method triggers a navigation on update of site context state
         * - `subscribeRouting` method updates the site context state on navigation
         */
        this.isNavigating = false;
    }
    /**
     * Initializes the two-way synchronization between the site context state and the URL.
     */
    init() {
        this.router = this.injector.get(Router);
        this.location = this.injector.get(Location);
        const routingParams = this.siteContextParams.getUrlEncodingParameters();
        if (routingParams.length) {
            this.setContextParamsFromRoute(this.location.path(true));
            this.subscribeChanges(routingParams);
            this.subscribeRouting();
        }
    }
    /**
     * After each change of the site context state, it modifies the current URL in place.
     * But it happens only for the parameters configured to be persisted in the URL.
     */
    subscribeChanges(params) {
        params.forEach((param) => {
            const service = this.siteContextParams.getSiteContextService(param);
            if (service) {
                this.subscription.add(service.getActive().subscribe((value) => {
                    if (!this.isNavigating &&
                        this.contextValues[param] &&
                        this.contextValues[param] !== value) {
                        const parsed = this.router.parseUrl(this.router.url);
                        const serialized = this.router.serializeUrl(parsed);
                        this.location.replaceState(serialized);
                    }
                    this.contextValues[param] = value;
                }));
            }
        });
    }
    /**
     * After each Angular NavigationStart event it updates the site context state based on
     * site context params encoded in the anticipated URL.
     */
    subscribeRouting() {
        this.subscription.add(this.router.events
            .pipe(filter((event) => event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationError ||
            event instanceof NavigationCancel))
            .subscribe((event) => {
            this.isNavigating = event instanceof NavigationStart;
            if (this.isNavigating) {
                this.setContextParamsFromRoute(event.url);
            }
        }));
    }
    /**
     * Updates the site context state based on the context params encoded in the given URL
     *
     * @param url URL with encoded context params
     */
    setContextParamsFromRoute(url) {
        const { params } = this.serializer.urlExtractContextParameters(url);
        Object.keys(params).forEach((param) => this.siteContextParams.setValue(param, params[param]));
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
SiteContextRoutesHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextRoutesHandler, deps: [{ token: SiteContextParamsService }, { token: SiteContextUrlSerializer }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
SiteContextRoutesHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextRoutesHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextRoutesHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: SiteContextParamsService }, { type: SiteContextUrlSerializer }, { type: i0.Injector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function initializeContext(configInit, siteContextRoutesHandler) {
    return () => {
        return configInit
            .getStable('context')
            .pipe(tap(() => {
            // `siteContextRoutesHandler.init()` should be executed before CurrencyInitializer,
            // LanguageInitializer and BaseSiteInitializer
            // (now it's the case, thanks to the order of providers for APP_INITIALIZER).
            //
            // TODO(#12351): move it to the logic of specific context initializers
            siteContextRoutesHandler.init();
        }))
            .toPromise();
    };
}
const contextServiceProviders = [
    BaseSiteService,
    LanguageService,
    CurrencyService,
    {
        provide: APP_INITIALIZER,
        useFactory: initializeContext,
        deps: [ConfigInitializerService, SiteContextRoutesHandler],
        multi: true,
    },
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
// functions below should not be exposed in public API:
const siteContextParamsProviders = [
    SiteContextParamsService,
    SiteContextUrlSerializer,
    { provide: UrlSerializer, useExisting: SiteContextUrlSerializer },
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class BaseSiteEffects {
    constructor(actions$, siteConnector) {
        this.actions$ = actions$;
        this.siteConnector = siteConnector;
        this.loadBaseSite$ = createEffect(() => this.actions$.pipe(ofType(LOAD_BASE_SITE), exhaustMap(() => {
            return this.siteConnector.getBaseSite().pipe(map((baseSite) => {
                if (baseSite) {
                    return new LoadBaseSiteSuccess(baseSite);
                }
                else {
                    throw new Error('BaseSite is not found');
                }
            }), catchError((error) => of(new LoadBaseSiteFail(normalizeHttpError(error)))));
        })));
        this.loadBaseSites$ = createEffect(() => this.actions$.pipe(ofType(LOAD_BASE_SITES), exhaustMap(() => {
            return this.siteConnector.getBaseSites().pipe(map((baseSites) => new LoadBaseSitesSuccess(baseSites)), catchError((error) => of(new LoadBaseSitesFail(normalizeHttpError(error)))));
        })));
    }
}
BaseSiteEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteEffects, deps: [{ token: i1$4.Actions }, { token: SiteConnector }], target: i0.ɵɵFactoryTarget.Injectable });
BaseSiteEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: SiteConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CurrenciesEffects {
    constructor(actions$, siteConnector, state) {
        this.actions$ = actions$;
        this.siteConnector = siteConnector;
        this.state = state;
        this.loadCurrencies$ = createEffect(() => this.actions$.pipe(ofType(LOAD_CURRENCIES), exhaustMap(() => {
            return this.siteConnector.getCurrencies().pipe(map((currencies) => new LoadCurrenciesSuccess(currencies)), catchError((error) => of(new LoadCurrenciesFail(normalizeHttpError(error)))));
        })));
        this.activateCurrency$ = createEffect(() => this.state.select(getActiveCurrency).pipe(bufferCount(2, 1), 
        // avoid dispatching `change` action when we're just setting the initial value:
        filter(([previous]) => !!previous), map(([previous, current]) => new CurrencyChange({ previous, current }))));
    }
}
CurrenciesEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrenciesEffects, deps: [{ token: i1$4.Actions }, { token: SiteConnector }, { token: i1$2.Store }], target: i0.ɵɵFactoryTarget.Injectable });
CurrenciesEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrenciesEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CurrenciesEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: SiteConnector }, { type: i1$2.Store }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class LanguagesEffects {
    constructor(actions$, siteConnector, state) {
        this.actions$ = actions$;
        this.siteConnector = siteConnector;
        this.state = state;
        this.loadLanguages$ = createEffect(() => this.actions$.pipe(ofType(LOAD_LANGUAGES), exhaustMap(() => {
            return this.siteConnector.getLanguages().pipe(map((languages) => new LoadLanguagesSuccess(languages)), catchError((error) => of(new LoadLanguagesFail(normalizeHttpError(error)))));
        })));
        this.activateLanguage$ = createEffect(() => this.state.select(getActiveLanguage).pipe(bufferCount(2, 1), 
        // avoid dispatching `change` action when we're just setting the initial value:
        filter(([previous]) => !!previous), map(([previous, current]) => new LanguageChange({ previous, current }))));
    }
}
LanguagesEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguagesEffects, deps: [{ token: i1$4.Actions }, { token: SiteConnector }, { token: i1$2.Store }], target: i0.ɵɵFactoryTarget.Injectable });
LanguagesEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguagesEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LanguagesEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: SiteConnector }, { type: i1$2.Store }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const effects$4 = [
    LanguagesEffects,
    CurrenciesEffects,
    BaseSiteEffects,
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$o = {
    entities: null,
    details: {},
    activeSite: '',
};
function reducer$o(state = initialState$o, action) {
    switch (action.type) {
        case LOAD_BASE_SITE_SUCCESS: {
            return Object.assign(Object.assign({}, state), { details: action.payload });
        }
        case SET_ACTIVE_BASE_SITE: {
            // if active base site is updated,
            // the active base site details data should also be updated
            let details = {};
            if (state.entities) {
                details = state.entities[action.payload];
            }
            return Object.assign(Object.assign({}, state), { details, activeSite: action.payload });
        }
        case LOAD_BASE_SITES_SUCCESS: {
            const sites = action.payload;
            const entities = sites.reduce((siteEntities, site) => {
                var _a;
                return Object.assign(Object.assign({}, siteEntities), { [(_a = site.uid) !== null && _a !== void 0 ? _a : '']: site });
            }, Object.assign({}, state.entities));
            // after base sites entities are populated,
            // the active base site details data is also populated
            const details = entities[state.activeSite];
            return Object.assign(Object.assign({}, state), { details,
                entities });
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$n = {
    entities: null,
    activeCurrency: null,
};
function reducer$n(state = initialState$n, action) {
    switch (action.type) {
        case LOAD_CURRENCIES_SUCCESS: {
            const currencies = action.payload;
            const entities = currencies.reduce((currEntities, currency) => {
                var _a;
                return Object.assign(Object.assign({}, currEntities), { [(_a = currency.isocode) !== null && _a !== void 0 ? _a : '']: currency });
            }, Object.assign({}, state.entities));
            return Object.assign(Object.assign({}, state), { entities });
        }
        case SET_ACTIVE_CURRENCY: {
            const isocode = action.payload;
            return Object.assign(Object.assign({}, state), { activeCurrency: isocode });
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$m = {
    entities: null,
    activeLanguage: null,
};
function reducer$m(state = initialState$m, action) {
    switch (action.type) {
        case LOAD_LANGUAGES_SUCCESS: {
            const languages = action.payload;
            const entities = languages.reduce((langEntities, language) => {
                var _a;
                return Object.assign(Object.assign({}, langEntities), { [(_a = language.isocode) !== null && _a !== void 0 ? _a : '']: language });
            }, Object.assign({}, state.entities));
            return Object.assign(Object.assign({}, state), { entities });
        }
        case SET_ACTIVE_LANGUAGE: {
            const isocode = action.payload;
            return Object.assign(Object.assign({}, state), { activeLanguage: isocode });
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getReducers$7() {
    return {
        languages: reducer$m,
        currencies: reducer$n,
        baseSite: reducer$o,
    };
}
const reducerToken$7 = new InjectionToken('SiteContextReducers');
const reducerProvider$7 = {
    provide: reducerToken$7,
    useFactory: getReducers$7,
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function siteContextStoreConfigFactory() {
    // if we want to reuse SITE_CONTEXT_FEATURE const in config, we have to use factory instead of plain object
    const config = {
        state: {
            ssrTransfer: {
                keys: { [SITE_CONTEXT_FEATURE]: StateTransferType.TRANSFER_STATE },
            },
        },
    };
    return config;
}
class SiteContextStoreModule {
}
SiteContextStoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextStoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SiteContextStoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: SiteContextStoreModule, imports: [CommonModule, i1$2.StoreFeatureModule, i1$4.EffectsFeatureModule] });
SiteContextStoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextStoreModule, providers: [
        provideDefaultConfigFactory(siteContextStoreConfigFactory),
        reducerProvider$7,
    ], imports: [CommonModule,
        StoreModule.forFeature(SITE_CONTEXT_FEATURE, reducerToken$7),
        EffectsModule.forFeature(effects$4)] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextStoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        StoreModule.forFeature(SITE_CONTEXT_FEATURE, reducerToken$7),
                        EffectsModule.forFeature(effects$4),
                    ],
                    providers: [
                        provideDefaultConfigFactory(siteContextStoreConfigFactory),
                        reducerProvider$7,
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Initializes the site context config
 */
function initSiteContextConfig(configInitializer, config) {
    /**
     * Load config for `context` from backend only when there is no static config for `context.baseSite`
     */
    if (!config.context || !config.context[BASE_SITE_CONTEXT_ID]) {
        return configInitializer;
    }
    return null;
}
class SiteContextModule {
    static forRoot() {
        return {
            ngModule: SiteContextModule,
            providers: [
                provideDefaultConfigFactory(defaultSiteContextConfigFactory),
                contextServiceMapProvider,
                ...contextServiceProviders,
                ...siteContextParamsProviders,
                provideConfigValidator(baseSiteConfigValidator),
                {
                    provide: CONFIG_INITIALIZER,
                    useFactory: initSiteContextConfig,
                    deps: [SiteContextConfigInitializer, SiteContextConfig],
                    multi: true,
                },
                ...contextInitializerProviders,
            ],
        };
    }
}
SiteContextModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SiteContextModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: SiteContextModule, imports: [StateModule, SiteContextStoreModule, SiteContextEventModule] });
SiteContextModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextModule, imports: [StateModule, SiteContextStoreModule, SiteContextEventModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [StateModule, SiteContextStoreModule, SiteContextEventModule],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$l = false;
function reducer$l(state = initialState$l, action) {
    switch (action.type) {
        case TOGGLE_ANONYMOUS_CONSENTS_BANNER_DISMISSED: {
            return action.dismissed;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$k = false;
function reducer$k(state = initialState$k, action) {
    switch (action.type) {
        case TOGGLE_ANONYMOUS_CONSENT_TEMPLATES_UPDATED: {
            return action.updated;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$j = [];
function toggleConsentStatus(consents, templateCode, status) {
    if (!consents) {
        return [];
    }
    return consents.map((consent) => {
        if (consent.templateCode === templateCode) {
            consent = Object.assign(Object.assign({}, consent), { consentState: status });
        }
        return consent;
    });
}
function reducer$j(state = initialState$j, action) {
    switch (action.type) {
        case GIVE_ANONYMOUS_CONSENT: {
            return toggleConsentStatus(state, action.templateCode, ANONYMOUS_CONSENT_STATUS.GIVEN);
        }
        case WITHDRAW_ANONYMOUS_CONSENT: {
            return toggleConsentStatus(state, action.templateCode, ANONYMOUS_CONSENT_STATUS.WITHDRAWN);
        }
        case SET_ANONYMOUS_CONSENTS: {
            return action.payload;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getReducers$6() {
    return {
        templates: loaderReducer(ANONYMOUS_CONSENTS),
        consents: reducer$j,
        ui: combineReducers({
            bannerDismissed: reducer$l,
            updated: reducer$k,
        }),
    };
}
const reducerToken$6 = new InjectionToken('AnonymousConsentsReducers');
const reducerProvider$6 = {
    provide: reducerToken$6,
    useFactory: getReducers$6,
};
function clearAnonymousConsentTemplates(reducer) {
    return function (state, action) {
        if (state !== undefined &&
            (action.type === LOGOUT ||
                action.type === LANGUAGE_CHANGE)) {
            state = Object.assign(Object.assign({}, state), { templates: {} });
        }
        return reducer(state, action);
    };
}
const metaReducers$3 = [
    clearAnonymousConsentTemplates,
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Responsible for saving the anonymous consents data in browser storage.
 */
class AnonymousConsentsStatePersistenceService {
    constructor(statePersistenceService, store, anonymousConsentsService) {
        this.statePersistenceService = statePersistenceService;
        this.store = store;
        this.anonymousConsentsService = anonymousConsentsService;
        this.subscription = new Subscription();
        /**
         * Identifier used for storage key.
         */
        this.key = 'anonymous-consents';
    }
    /**
     * Initializes the synchronization between state and browser storage.
     */
    initSync() {
        this.subscription.add(this.statePersistenceService.syncWithStorage({
            key: this.key,
            state$: this.getAuthState(),
            onRead: (state) => this.onRead(state),
        }));
    }
    /**
     * Gets and transforms state from different sources into the form that should
     * be saved in storage.
     */
    getAuthState() {
        return this.store.select(getAnonymousConsentState);
    }
    /**
     * Function called on each browser storage read.
     * Used to update state from browser -> state.
     */
    onRead(state) {
        var _a;
        const templates = state === null || state === void 0 ? void 0 : state.templates;
        const consents = state === null || state === void 0 ? void 0 : state.consents;
        const ui = state === null || state === void 0 ? void 0 : state.ui;
        // templates
        if (templates === null || templates === void 0 ? void 0 : templates.success) {
            this.store.dispatch(new LoadAnonymousConsentTemplatesSuccess((_a = templates.value) !== null && _a !== void 0 ? _a : []));
        }
        // consents
        if (consents) {
            this.anonymousConsentsService.setConsents(consents);
        }
        // ui
        if (ui) {
            this.anonymousConsentsService.toggleBannerDismissed(ui === null || ui === void 0 ? void 0 : ui.bannerDismissed);
            this.anonymousConsentsService.toggleTemplatesUpdated(ui === null || ui === void 0 ? void 0 : ui.updated);
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
AnonymousConsentsStatePersistenceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsStatePersistenceService, deps: [{ token: StatePersistenceService }, { token: i1$2.Store }, { token: AnonymousConsentsService }], target: i0.ɵɵFactoryTarget.Injectable });
AnonymousConsentsStatePersistenceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsStatePersistenceService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsStatePersistenceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: StatePersistenceService }, { type: i1$2.Store }, { type: AnonymousConsentsService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function anonymousConsentsStatePersistenceFactory(anonymousConsentsStatePersistenceService) {
    const result = () => anonymousConsentsStatePersistenceService.initSync();
    return result;
}
class AnonymousConsentsStoreModule {
}
AnonymousConsentsStoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsStoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AnonymousConsentsStoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsStoreModule, imports: [CommonModule,
        StateModule, i1$2.StoreFeatureModule, i1$4.EffectsFeatureModule] });
AnonymousConsentsStoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsStoreModule, providers: [
        reducerProvider$6,
        {
            provide: APP_INITIALIZER,
            useFactory: anonymousConsentsStatePersistenceFactory,
            deps: [AnonymousConsentsStatePersistenceService],
            multi: true,
        },
    ], imports: [CommonModule,
        StateModule,
        StoreModule.forFeature(ANONYMOUS_CONSENTS_STORE_FEATURE, reducerToken$6, {
            metaReducers: metaReducers$3,
        }),
        EffectsModule.forFeature(effects$5)] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsStoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        StateModule,
                        StoreModule.forFeature(ANONYMOUS_CONSENTS_STORE_FEATURE, reducerToken$6, {
                            metaReducers: metaReducers$3,
                        }),
                        EffectsModule.forFeature(effects$5),
                    ],
                    providers: [
                        reducerProvider$6,
                        {
                            provide: APP_INITIALIZER,
                            useFactory: anonymousConsentsStatePersistenceFactory,
                            deps: [AnonymousConsentsStatePersistenceService],
                            multi: true,
                        },
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AnonymousConsentsModule {
    static forRoot() {
        return {
            ngModule: AnonymousConsentsModule,
            providers: [
                ...interceptors,
                AnonymousConsentsService,
                provideDefaultConfig(defaultAnonymousConsentsConfig),
            ],
        };
    }
}
AnonymousConsentsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AnonymousConsentsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsModule, imports: [AnonymousConsentsStoreModule] });
AnonymousConsentsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsModule, imports: [AnonymousConsentsStoreModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [AnonymousConsentsStoreModule],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ANONYMOUS_CONSENT_NORMALIZER = new InjectionToken('AnonymousConsentNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const POINT_OF_SERVICE_NORMALIZER = new InjectionToken('PointOfServiceNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PAYMENT_DETAILS_NORMALIZER = new InjectionToken('PaymentDetailsNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultCmsModuleConfig = {
    backend: {
        occ: {
            endpoints: {
                component: 'cms/components/${id}',
                components: 'cms/components',
                pages: 'cms/pages',
                page: 'cms/pages/${id}',
            },
        },
    },
    cmsComponents: {},
    componentsLoading: {
        pageSize: 50,
    },
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CMS_FEATURE = 'cms';
const NAVIGATION_DETAIL_ENTITY = '[Cms] Navigation Entity';
const COMPONENT_ENTITY = '[Cms] Component Entity';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_CMS_COMPONENT = '[Cms] Load Component';
const LOAD_CMS_COMPONENT_FAIL = '[Cms] Load Component Fail';
const LOAD_CMS_COMPONENT_SUCCESS = '[Cms] Load Component Success';
const CMS_GET_COMPONENT_FROM_PAGE = '[Cms] Get Component from Page';
class LoadCmsComponent extends EntityLoadAction {
    constructor(payload) {
        super(COMPONENT_ENTITY, payload.uid);
        this.payload = payload;
        this.type = LOAD_CMS_COMPONENT;
    }
}
class LoadCmsComponentFail extends EntityFailAction {
    constructor(payload) {
        super(COMPONENT_ENTITY, payload.uid, payload.error);
        this.payload = payload;
        this.type = LOAD_CMS_COMPONENT_FAIL;
    }
}
class LoadCmsComponentSuccess extends EntitySuccessAction {
    constructor(payload) {
        super(COMPONENT_ENTITY, payload.uid || payload.component.uid || '');
        this.payload = payload;
        this.type = LOAD_CMS_COMPONENT_SUCCESS;
    }
}
class CmsGetComponentFromPage extends EntitySuccessAction {
    constructor(payload) {
        super(COMPONENT_ENTITY, [].concat(payload).map((cmp) => cmp.component.uid));
        this.payload = payload;
        this.type = CMS_GET_COMPONENT_FROM_PAGE;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_CMS_NAVIGATION_ITEMS = '[Cms] Load NavigationEntry items';
const LOAD_CMS_NAVIGATION_ITEMS_FAIL = '[Cms] Load NavigationEntry items Fail';
const LOAD_CMS_NAVIGATION_ITEMS_SUCCESS = '[Cms] Load NavigationEntry items Success';
class LoadCmsNavigationItems extends EntityLoadAction {
    constructor(payload) {
        super(NAVIGATION_DETAIL_ENTITY, payload.nodeId);
        this.payload = payload;
        this.type = LOAD_CMS_NAVIGATION_ITEMS;
    }
}
class LoadCmsNavigationItemsFail extends EntityFailAction {
    constructor(nodeId, payload) {
        super(NAVIGATION_DETAIL_ENTITY, nodeId, payload);
        this.payload = payload;
        this.type = LOAD_CMS_NAVIGATION_ITEMS_FAIL;
    }
}
class LoadCmsNavigationItemsSuccess extends EntitySuccessAction {
    constructor(payload) {
        super(NAVIGATION_DETAIL_ENTITY, payload.nodeId);
        this.payload = payload;
        this.type = LOAD_CMS_NAVIGATION_ITEMS_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_CMS_PAGE_DATA = '[Cms] Load Page Data';
const LOAD_CMS_PAGE_DATA_FAIL = '[Cms] Load Page Data Fail';
const LOAD_CMS_PAGE_DATA_SUCCESS = '[Cms] Load Page Data Success';
const CMS_SET_PAGE_SUCCESS_INDEX = '[Cms] Set Page Success Index';
const CMS_SET_PAGE_FAIL_INDEX = '[Cms] Set Page Fail Index';
class LoadCmsPageData extends EntityLoadAction {
    constructor(payload) {
        var _a;
        super((_a = payload.type) !== null && _a !== void 0 ? _a : '', payload.id);
        this.payload = payload;
        this.type = LOAD_CMS_PAGE_DATA;
    }
}
class LoadCmsPageDataFail extends EntityFailAction {
    constructor(pageContext, error) {
        var _a;
        super((_a = pageContext.type) !== null && _a !== void 0 ? _a : '', pageContext.id, error);
        this.type = LOAD_CMS_PAGE_DATA_FAIL;
    }
}
class LoadCmsPageDataSuccess extends EntitySuccessAction {
    constructor(pageContext, payload) {
        var _a;
        super((_a = pageContext.type) !== null && _a !== void 0 ? _a : '', pageContext.id, payload);
        this.type = LOAD_CMS_PAGE_DATA_SUCCESS;
    }
}
class CmsSetPageSuccessIndex extends EntitySuccessAction {
    constructor(pageContext, payload) {
        var _a;
        super((_a = pageContext.type) !== null && _a !== void 0 ? _a : '', pageContext.id, payload);
        this.type = CMS_SET_PAGE_SUCCESS_INDEX;
    }
}
class CmsSetPageFailIndex extends EntityFailAction {
    constructor(pageContext, payload) {
        var _a;
        super((_a = pageContext.type) !== null && _a !== void 0 ? _a : '', pageContext.id);
        this.payload = payload;
        this.type = CMS_SET_PAGE_FAIL_INDEX;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var cmsGroup_actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LOAD_CMS_COMPONENT: LOAD_CMS_COMPONENT,
    LOAD_CMS_COMPONENT_FAIL: LOAD_CMS_COMPONENT_FAIL,
    LOAD_CMS_COMPONENT_SUCCESS: LOAD_CMS_COMPONENT_SUCCESS,
    CMS_GET_COMPONENT_FROM_PAGE: CMS_GET_COMPONENT_FROM_PAGE,
    LoadCmsComponent: LoadCmsComponent,
    LoadCmsComponentFail: LoadCmsComponentFail,
    LoadCmsComponentSuccess: LoadCmsComponentSuccess,
    CmsGetComponentFromPage: CmsGetComponentFromPage,
    LOAD_CMS_NAVIGATION_ITEMS: LOAD_CMS_NAVIGATION_ITEMS,
    LOAD_CMS_NAVIGATION_ITEMS_FAIL: LOAD_CMS_NAVIGATION_ITEMS_FAIL,
    LOAD_CMS_NAVIGATION_ITEMS_SUCCESS: LOAD_CMS_NAVIGATION_ITEMS_SUCCESS,
    LoadCmsNavigationItems: LoadCmsNavigationItems,
    LoadCmsNavigationItemsFail: LoadCmsNavigationItemsFail,
    LoadCmsNavigationItemsSuccess: LoadCmsNavigationItemsSuccess,
    LOAD_CMS_PAGE_DATA: LOAD_CMS_PAGE_DATA,
    LOAD_CMS_PAGE_DATA_FAIL: LOAD_CMS_PAGE_DATA_FAIL,
    LOAD_CMS_PAGE_DATA_SUCCESS: LOAD_CMS_PAGE_DATA_SUCCESS,
    CMS_SET_PAGE_SUCCESS_INDEX: CMS_SET_PAGE_SUCCESS_INDEX,
    CMS_SET_PAGE_FAIL_INDEX: CMS_SET_PAGE_FAIL_INDEX,
    LoadCmsPageData: LoadCmsPageData,
    LoadCmsPageDataFail: LoadCmsPageDataFail,
    LoadCmsPageDataSuccess: LoadCmsPageDataSuccess,
    CmsSetPageSuccessIndex: CmsSetPageSuccessIndex,
    CmsSetPageFailIndex: CmsSetPageFailIndex
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getCmsState = createFeatureSelector(CMS_FEATURE);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getComponentsState = createSelector(getCmsState, (state) => state.components);
const componentsContextSelectorFactory = (uid) => {
    return createSelector(getComponentsState, (componentsState) => entitySelector(componentsState, uid));
};
const componentsLoaderStateSelectorFactory = (uid, context) => {
    return createSelector(componentsContextSelectorFactory(uid), (componentsContext) => (componentsContext &&
        componentsContext.pageContext &&
        componentsContext.pageContext[context]) ||
        initialLoaderState);
};
/**
 * This selector will return:
 *   - true: component for this context exists
 *   - false: component for this context doesn't exist
 *   - undefined: if the exists status for component is unknown
 *
 * @param uid
 * @param context
 */
const componentsContextExistsSelectorFactory = (uid, context) => {
    return createSelector(componentsLoaderStateSelectorFactory(uid, context), (loaderState) => loaderValueSelector(loaderState));
};
const componentsDataSelectorFactory = (uid) => {
    return createSelector(componentsContextSelectorFactory(uid), (state) => state ? state.component : undefined);
};
/**
 * This selector will return:
 *   - CmsComponent instance: if we have component data for specified context
 *   - null: if there is no component data for specified context
 *   - undefined: if status of component data for specified context is unknown
 *
 * @param uid
 * @param context
 */
const componentsSelectorFactory = (uid, context) => {
    return createSelector(componentsDataSelectorFactory(uid), componentsContextExistsSelectorFactory(uid, context), (componentState, exists) => {
        switch (exists) {
            case true:
                return componentState;
            case false:
                return null;
            case undefined:
                return undefined;
        }
    });
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getNavigationEntryItemState = createSelector(getCmsState, (state) => state.navigation);
const getSelectedNavigationEntryItemState = (nodeId) => {
    return createSelector(getNavigationEntryItemState, (nodes) => entityLoaderStateSelector(nodes, nodeId));
};
const getNavigationEntryItems = (nodeId) => {
    return createSelector(getSelectedNavigationEntryItemState(nodeId), (itemState) => loaderValueSelector(itemState));
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getPageEntitiesSelector = (state) => state.pageData.entities;
const getIndexByType = (index, type) => {
    switch (type) {
        case PageType.CONTENT_PAGE: {
            return index.content;
        }
        case PageType.PRODUCT_PAGE: {
            return index.product;
        }
        case PageType.CATEGORY_PAGE: {
            return index.category;
        }
        case PageType.CATALOG_PAGE: {
            return index.catalog;
        }
        default: {
            return { entities: {} };
        }
    }
};
const getPageComponentTypesSelector = (page) => {
    var _a;
    const componentTypes = new Set();
    if (page && page.slots) {
        for (const slot of Object.keys(page.slots)) {
            for (const component of page.slots[slot].components || []) {
                componentTypes.add((_a = component.flexType) !== null && _a !== void 0 ? _a : '');
            }
        }
    }
    return Array.from(componentTypes);
};
const getPageState = createSelector(getCmsState, (state) => state.page);
const getPageStateIndex = createSelector(getPageState, (page) => page.index);
const getPageStateIndexEntityLoaderState = (pageContext) => createSelector(getPageStateIndex, (index) => getIndexByType(index, pageContext.type));
const getPageStateIndexLoaderState = (pageContext) => createSelector(getPageStateIndexEntityLoaderState(pageContext), (indexState) => entityLoaderStateSelector(indexState, pageContext.id));
const getPageStateIndexValue = (pageContext) => createSelector(getPageStateIndexLoaderState(pageContext), (entity) => loaderValueSelector(entity));
const getPageEntities = createSelector(getPageState, getPageEntitiesSelector);
const getPageData = (pageContext) => createSelector(getPageEntities, getPageStateIndexValue(pageContext), (entities, indexValue) => entities[indexValue]);
const getPageComponentTypes = (pageContext) => createSelector(getPageData(pageContext), (pageData) => getPageComponentTypesSelector(pageData));
const getCurrentSlotSelectorFactory = (pageContext, position) => {
    return createSelector(getPageData(pageContext), (entity) => {
        var _a;
        if (entity) {
            return ((_a = entity.slots) === null || _a === void 0 ? void 0 : _a[position]) || { components: [] };
        }
    });
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var cmsGroup_selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getComponentsState: getComponentsState,
    componentsContextSelectorFactory: componentsContextSelectorFactory,
    componentsLoaderStateSelectorFactory: componentsLoaderStateSelectorFactory,
    componentsContextExistsSelectorFactory: componentsContextExistsSelectorFactory,
    componentsDataSelectorFactory: componentsDataSelectorFactory,
    componentsSelectorFactory: componentsSelectorFactory,
    getCmsState: getCmsState,
    getNavigationEntryItemState: getNavigationEntryItemState,
    getSelectedNavigationEntryItemState: getSelectedNavigationEntryItemState,
    getNavigationEntryItems: getNavigationEntryItems,
    getPageState: getPageState,
    getPageStateIndex: getPageStateIndex,
    getPageStateIndexEntityLoaderState: getPageStateIndexEntityLoaderState,
    getPageStateIndexLoaderState: getPageStateIndexLoaderState,
    getPageStateIndexValue: getPageStateIndexValue,
    getPageEntities: getPageEntities,
    getPageData: getPageData,
    getPageComponentTypes: getPageComponentTypes,
    getCurrentSlotSelectorFactory: getCurrentSlotSelectorFactory
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CURRENT_CONTEXT_KEY = 'current';
/**
 *
 * Serializes the provided page context.
 * The pattern used for serialization is: `pageContext.type-pageContext.id`.
 *
 * @param pageContext to serialize
 * @param ignoreContentPageId if set to true, and the PageType is of type ContentPage, then the serialized page context will not contain the ID.
 * Otherwise, the page context if fully serialized.
 */
function serializePageContext(pageContext, ignoreContentPageId) {
    if (!pageContext) {
        return CURRENT_CONTEXT_KEY;
    }
    if (ignoreContentPageId && pageContext.type === PageType.CONTENT_PAGE) {
        return `${pageContext.type}`;
    }
    return `${pageContext.type}-${pageContext.id}`;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CmsService {
    constructor(store, routingService) {
        this.store = store;
        this.routingService = routingService;
        this.components = {};
    }
    /**
     * Get current CMS page data
     */
    getCurrentPage() {
        return this.routingService
            .getPageContext()
            .pipe(switchMap((pageContext) => this.store.select(getPageData(pageContext))));
    }
    /**
     * Get CMS component data by uid
     *
     * This method can be safely and optimally used to load multiple components data at the same time.
     * Calling getComponentData multiple times for different components will always result in optimized
     * back-end request: all components requested at the same time (in one event loop) will be loaded in one network call.
     *
     * In case the component data is not present, the method will load it.
     * Otherwise, if the page context is not provided, the current page context from the router state will be used instead.
     *
     * @param uid CMS component uid
     * @param pageContext if provided, it will be used to lookup the component data.
     */
    getComponentData(uid, pageContext) {
        const context = serializePageContext(pageContext, true);
        if (!this.components[uid]) {
            // create the component data structure, if it doesn't already exist
            this.components[uid] = {};
        }
        const component = this.components[uid];
        if (!component[context]) {
            // create the component data and assign it to the component's context
            component[context] = this.createComponentData(uid, pageContext);
        }
        return component[context];
    }
    createComponentData(uid, pageContext) {
        if (!pageContext) {
            return this.routingService.getPageContext().pipe(filter((currentContext) => !!currentContext), switchMap((currentContext) => this.getComponentData(uid, currentContext)));
        }
        const context = serializePageContext(pageContext, true);
        const loading$ = combineLatest([
            this.routingService.getNextPageContext(),
            this.store.pipe(select(componentsLoaderStateSelectorFactory(uid, context))),
        ]).pipe(observeOn(queueScheduler), tap(([nextContext, loadingState]) => {
            const attemptedLoad = loadingState.loading || loadingState.success || loadingState.error;
            // if the requested context is the same as the one that's currently being navigated to
            // (as it might already been triggered and might be available shortly from page data)
            // TODO(issue:3649), TODO(issue:3668) - this optimization could be removed
            const couldBeLoadedWithPageData = nextContext
                ? serializePageContext(nextContext, true) === context
                : false;
            if (!attemptedLoad && !couldBeLoadedWithPageData) {
                this.store.dispatch(new LoadCmsComponent({ uid, pageContext }));
            }
        }));
        const component$ = this.store.pipe(select(componentsSelectorFactory(uid, context)), filter(isNotUndefined));
        return using(() => loading$.subscribe(), () => component$).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    /**
     * Given the position, get the content slot data
     * @param position : content slot position
     */
    getContentSlot(position) {
        return this.routingService
            .getPageContext()
            .pipe(switchMap((pageContext) => this.store.pipe(select(getCurrentSlotSelectorFactory(pageContext, position)), filter(isNotUndefined))));
    }
    /**
     * Given navigation node uid, get items (with id and type) inside the navigation entries
     * @param navigationNodeUid : uid of the navigation node
     */
    getNavigationEntryItems(navigationNodeUid) {
        return this.store.pipe(select(getNavigationEntryItems(navigationNodeUid)));
    }
    /**
     * Load navigation items data
     * @param rootUid : the uid of the root navigation node
     * @param itemList : list of items (with id and type)
     */
    loadNavigationItems(rootUid, itemList) {
        this.store.dispatch(new LoadCmsNavigationItems({
            nodeId: rootUid,
            items: itemList,
        }));
    }
    /**
     * Refresh the content of the latest cms page
     */
    refreshLatestPage() {
        this.routingService
            .getPageContext()
            .pipe(take(1))
            .subscribe((pageContext) => this.store.dispatch(new LoadCmsPageData(pageContext)));
    }
    /**
     * Refresh the cms page content by page Id
     * @param pageId
     */
    refreshPageById(pageId) {
        const pageContext = { id: pageId };
        this.store.dispatch(new LoadCmsPageData(pageContext));
    }
    /**
     * Refresh cms component's content
     * @param uid component uid
     * @param pageContext an optional parameter that enables the caller to specify for which context the component should be refreshed.
     * If not specified, 'current' page context is used.
     */
    refreshComponent(uid, pageContext) {
        this.store.dispatch(new LoadCmsComponent({ uid, pageContext }));
    }
    /**
     * Given pageContext, return the CMS page data
     * @param pageContext
     */
    getPageState(pageContext) {
        return this.store.pipe(select(getPageData(pageContext)));
    }
    /**
     * Given pageContext, return the CMS page data
     * @param pageContext
     */
    getPageComponentTypes(pageContext) {
        return this.store.pipe(select(getPageComponentTypes(pageContext)));
    }
    /**
     * Given pageContext, return whether the CMS page data exists or not
     * @param pageContext
     */
    hasPage(pageContext, forceReload = false) {
        return this.store.pipe(select(getPageStateIndexLoaderState(pageContext)), tap((entity) => {
            const attemptedLoad = entity.loading || entity.success || entity.error;
            const shouldReload = forceReload && !entity.loading;
            if (!attemptedLoad || shouldReload) {
                this.store.dispatch(new LoadCmsPageData(pageContext));
                forceReload = false;
            }
        }), filter((entity) => {
            if (!entity.hasOwnProperty('value')) {
                // if we have incomplete state from SSR failed load transfer state,
                // we should wait for reload and actual value
                return false;
            }
            return Boolean(entity.success || (entity.error && !entity.loading));
        }), pluck('success'), map((success) => !!success), catchError(() => of(false)));
    }
    /**
     * Given pageContext, return the CMS page data
     **/
    getPage(pageContext, forceReload = false) {
        return this.hasPage(pageContext, forceReload).pipe(switchMap((hasPage) => hasPage ? this.getPageState(pageContext) : of(null)));
    }
    getPageIndex(pageContext) {
        return this.store.pipe(select(getPageStateIndexValue(pageContext)));
    }
    setPageFailIndex(pageContext, value) {
        this.store.dispatch(new CmsSetPageFailIndex(pageContext, value));
    }
}
CmsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsService, deps: [{ token: i1$2.Store }, { token: RoutingService }], target: i0.ɵɵFactoryTarget.Injectable });
CmsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: RoutingService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultPageMetaConfig = {
    pageMeta: {
        resolvers: [
            {
                property: 'title',
                method: 'resolveTitle',
            },
            {
                property: 'heading',
                method: 'resolveHeading',
            },
            {
                property: 'breadcrumbs',
                method: 'resolveBreadcrumbs',
            },
            {
                property: 'description',
                method: 'resolveDescription',
                disabledInCsr: true,
            },
            {
                property: 'image',
                method: 'resolveImage',
                disabledInCsr: true,
            },
            {
                property: 'robots',
                method: 'resolveRobots',
                disabledInCsr: true,
            },
            {
                property: 'canonicalUrl',
                method: 'resolveCanonicalUrl',
                disabledInCsr: true,
            },
        ],
        canonicalUrl: {
            forceHttps: true,
            forceWww: false,
            removeQueryParams: true,
            forceTrailingSlash: true,
        },
    },
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Abstract class that can be used to resolve meta data for specific pages.
 * The `getScore` method is used to select the right resolver for a specific
 * page, based on a score. The score is calculated by the (non)matching page
 * type and page template.
 */
class PageMetaResolver {
    /**
     * Returns the matching score for a resolver class, based on
     * the page type and page template.
     */
    getScore(page) {
        let score = 0;
        if (this.pageType) {
            score += page.type === this.pageType ? 1 : -1;
        }
        if (this.pageTemplate) {
            score += page.template === this.pageTemplate ? 1 : -1;
        }
        return score;
    }
    hasMatch(page) {
        return this.getScore(page) > 0;
    }
    getPriority(page) {
        return this.getScore(page);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class TranslationService {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Resolves the breadcrumb for the Angular ActivatedRouteSnapshot
 */
class DefaultRoutePageMetaResolver {
    constructor(translation) {
        this.translation = translation;
    }
    /**
     * Resolves breadcrumb based on the given url and the breadcrumb config.
     *
     * - When breadcrumb config is empty, it returns an empty breadcrumb.
     * - When breadcrumb config is a string or object with `i18n` property,
     *    it translates it and use as a label of the returned breadcrumb.
     * - When breadcrumb config is an object with property `raw`, then
     *    it's used as a label of the returned breadcrumb.
     */
    resolveBreadcrumbs({ url, pageMetaConfig, }) {
        const breadcrumbConfig = pageMetaConfig === null || pageMetaConfig === void 0 ? void 0 : pageMetaConfig.breadcrumb;
        if (!breadcrumbConfig) {
            return of([]);
        }
        if (typeof breadcrumbConfig !== 'string' && breadcrumbConfig.raw) {
            return of([{ link: url, label: breadcrumbConfig.raw }]);
        }
        return this.translateBreadcrumbLabel(breadcrumbConfig).pipe(map((label) => [{ label, link: url }]));
    }
    /**
     * Translates the configured breadcrumb label
     */
    translateBreadcrumbLabel(breadcrumbConfig) {
        const i18nKey = typeof breadcrumbConfig === 'string'
            ? breadcrumbConfig
            : breadcrumbConfig.i18n;
        return this.getParams().pipe(switchMap((params) => this.translation.translate(i18nKey !== null && i18nKey !== void 0 ? i18nKey : '', params !== null && params !== void 0 ? params : {})));
    }
    /**
     * Resolves dynamic data for the whole resolver.
     */
    getParams() {
        return of({});
    }
}
DefaultRoutePageMetaResolver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: DefaultRoutePageMetaResolver, deps: [{ token: TranslationService }], target: i0.ɵɵFactoryTarget.Injectable });
DefaultRoutePageMetaResolver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: DefaultRoutePageMetaResolver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: DefaultRoutePageMetaResolver, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: TranslationService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Resolves the page meta based on the Angular Activated Routes
 */
class RoutingPageMetaResolver {
    constructor(activatedRoutesService, injector) {
        this.activatedRoutesService = activatedRoutesService;
        this.injector = injector;
        /**
         * Array of activated routes, excluding the special Angular `root` route.
         */
        this.routes$ = this.activatedRoutesService.routes$.pipe(
        // drop the first route - the special `root` route:
        map((routes) => (routes = routes.slice(1, routes.length))));
        /**
         * Array of activated routes together with precalculated extras:
         *
         * - route's page meta resolver
         * - route's absolute string URL
         *
         * In case when there is no page meta resolver configured for a specific route,
         * it inherits its parent's resolver.
         *
         * When there is no page meta resolver configured for the highest parent in the hierarchy,
         * it uses the `DefaultRoutePageMetaResolver`.
         */
        this.routesWithExtras$ = this.routes$.pipe(map((routes) => routes.reduce((results, route) => {
            var _a;
            const parent = results.length
                ? results[results.length - 1]
                : {
                    route: null,
                    resolver: this.injector.get(DefaultRoutePageMetaResolver),
                    url: '',
                };
            const resolver = (_a = this.getResolver(route)) !== null && _a !== void 0 ? _a : parent.resolver; // fallback to parent's resolver
            const urlPart = this.getUrlPart(route);
            const url = parent.url + (urlPart ? `/${urlPart}` : ''); // don't add slash for a route with path '', to avoid double slash ...//...
            return results.concat({ route, resolver, url });
        }, [])), shareReplay({ bufferSize: 1, refCount: true }));
    }
    /**
     * Array of breadcrumbs defined for all the activated routes (from the root route to the leaf route).
     * It emits on every completed routing navigation.
     */
    resolveBreadcrumbs(options) {
        return this.routesWithExtras$.pipe(map((routesWithExtras) => (options === null || options === void 0 ? void 0 : options.includeCurrentRoute)
            ? routesWithExtras
            : this.trimCurrentRoute(routesWithExtras)), switchMap((routesWithExtras) => routesWithExtras.length
            ? combineLatest(routesWithExtras.map((routeWithExtras) => this.resolveRouteBreadcrumb(routeWithExtras)))
            : of([])), map((breadcrumbArrays) => breadcrumbArrays.flat()));
    }
    /**
     * Returns the instance of the RoutePageMetaResolver configured for the given activated route.
     * Returns null in case there the resolver can't be injected or is undefined.
     *
     * @param route route to resolve
     */
    getResolver(route) {
        const pageMetaConfig = this.getPageMetaConfig(route);
        if (typeof pageMetaConfig !== 'string' && (pageMetaConfig === null || pageMetaConfig === void 0 ? void 0 : pageMetaConfig.resolver)) {
            return this.injector.get(pageMetaConfig.resolver, null);
        }
        return null;
    }
    /**
     * Resolvers breadcrumb for a specific route
     */
    resolveRouteBreadcrumb({ route, resolver, url, }) {
        const breadcrumbResolver = resolver;
        if (typeof breadcrumbResolver.resolveBreadcrumbs === 'function') {
            return breadcrumbResolver.resolveBreadcrumbs({
                route,
                url,
                pageMetaConfig: this.getPageMetaConfig(route),
            });
        }
        return of([]);
    }
    /**
     * By default in breadcrumbs list we don't want to show a link to the current page, so this function
     * trims the last breadcrumb (the breadcrumb of the current route).
     *
     * This function also handles special case when the current route has a configured empty path ('' route).
     * The '' routes are often a _technical_ routes to organize other routes, assign common guards for its children, etc.
     * It shouldn't happen that '' route has a defined breadcrumb config.
     *
     * In that case, we trim not only the last route ('' route), but also its parent route with non-empty path
     * (which likely defines the breadcrumb config).
     */
    trimCurrentRoute(routesWithExtras) {
        var _a, _b;
        // If the last route is '', we trim:
        // - the '' route
        // - all parent '' routes (until we meet route with non-empty path)
        let i = routesWithExtras.length - 1;
        while (((_b = (_a = routesWithExtras[i]) === null || _a === void 0 ? void 0 : _a.route) === null || _b === void 0 ? void 0 : _b.url.length) === 0 && i >= 0) {
            i--;
        }
        // Finally we trim the last route (the one with non-empty path)
        return routesWithExtras.slice(0, i);
    }
    /**
     * Returns the URL path for the given activated route in a string format.
     * (ActivatedRouteSnapshot#url contains an array of `UrlSegment`s, not a string)
     */
    getUrlPart(route) {
        return route.url.map((urlSegment) => urlSegment.path).join('/');
    }
    /**
     * Returns the breadcrumb config placed in the route's `data` configuration.
     */
    getPageMetaConfig(route) {
        var _a, _b;
        // Note: we use `route.routeConfig.data` (not `route.data`) to save us from
        // an edge case bug. In Angular, by design the `data` of ActivatedRoute is inherited
        // from the parent route, if only the child has an empty path ''.
        // But in any case we don't want the page meta configs to be inherited, so we
        // read data from the original `routeConfig` which is static.
        //
        // Note: we may inherit the parent's page meta resolver in case we don't define it,
        // but we don't want to inherit parent's page meta config!
        return (_b = (_a = route === null || route === void 0 ? void 0 : route.routeConfig) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.cxPageMeta;
    }
}
RoutingPageMetaResolver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingPageMetaResolver, deps: [{ token: ActivatedRoutesService }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
RoutingPageMetaResolver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingPageMetaResolver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingPageMetaResolver, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: ActivatedRoutesService }, { type: i0.Injector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class PageMetaConfig {
}
PageMetaConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageMetaConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PageMetaConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageMetaConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageMetaConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Service to add links to the page meta data, such canonical URLs.
 */
class PageLinkService {
    constructor(pageMetaConfig, winRef) {
        this.pageMetaConfig = pageMetaConfig;
        this.winRef = winRef;
    }
    /**
     * Returns the canonical for the page.
     *
     * The canonical url is created by the help of the default `CanonicalUrlOptions` from
     * the pageMeta options. The options can be further adjusted by the options argument.
     */
    getCanonicalUrl(options, url) {
        var _a, _b, _c;
        const config = Object.assign(Object.assign({}, (_b = (_a = this.pageMetaConfig) === null || _a === void 0 ? void 0 : _a.pageMeta) === null || _b === void 0 ? void 0 : _b.canonicalUrl), options);
        return this.buildCanonicalUrl((_c = url !== null && url !== void 0 ? url : this.winRef.location.href) !== null && _c !== void 0 ? _c : '', config);
    }
    buildCanonicalUrl(url, options) {
        if (options.forceHttps) {
            url = url.replace(/^http(?!s):/i, 'https:');
        }
        if (options.forceWww) {
            // this will not allow for not adding wwww. in case of a subdomain
            url = url.replace(/^(https?:\/\/)(?!www\.)(.*)/i, '$1www.$2');
        }
        if (options.removeQueryParams) {
            url = this.removeQueryParams(url, options);
        }
        if (options.forceTrailingSlash) {
            url = url.replace(/^([^\?]+[^\/\?]$)$/i, '$1/');
        }
        return url;
    }
    removeQueryParams(url, config) {
        const queryPos = url.indexOf('?');
        if (queryPos > -1) {
            const urlBeforeQueryParam = url.substr(0, queryPos);
            const params = new URLSearchParams(url.substr(queryPos));
            url = urlBeforeQueryParam;
            if (Array.isArray(config.removeQueryParams)) {
                config.removeQueryParams.forEach((param) => {
                    params.delete(param);
                });
                if (params.toString().length > 0) {
                    url = `${urlBeforeQueryParam}?${params.toString()}`;
                }
            }
        }
        return url;
    }
}
PageLinkService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageLinkService, deps: [{ token: PageMetaConfig }, { token: WindowRef }], target: i0.ɵɵFactoryTarget.Injectable });
PageLinkService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageLinkService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageLinkService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: PageMetaConfig }, { type: WindowRef }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class BasePageMetaResolver {
    constructor(cmsService, translation, routingPageMetaResolver, router, pageLinkService) {
        this.cmsService = cmsService;
        this.translation = translation;
        this.routingPageMetaResolver = routingPageMetaResolver;
        this.router = router;
        this.pageLinkService = pageLinkService;
        /**
         * Helper to provide access to the current CMS page
         */
        this.page$ = defer(() => this.cmsService.getCurrentPage()).pipe(filter((p) => Boolean(p)));
        this.title$ = this.page$.pipe(map((p) => p.title));
        this.description$ = this.page$.pipe(map((p) => p.description));
        this.robots$ = this.page$.pipe(map((page) => page.robots || []));
        /**
         * Breadcrumb for the home page.
         */
        this.homeBreadcrumb$ = this.translation
            .translate('common.home')
            .pipe(map((label) => [{ label: label, link: '/' }]));
        /**
         * All the resolved breadcrumbs (including those from Angular child routes).
         */
        this.breadcrumb$ = combineLatest([
            this.homeBreadcrumb$,
            defer(() => { var _a; return (_a = this.routingPageMetaResolver) === null || _a === void 0 ? void 0 : _a.resolveBreadcrumbs(); }),
        ]).pipe(map((breadcrumbs) => breadcrumbs.flat()), shareReplay({ bufferSize: 1, refCount: true }));
    }
    resolveTitle() {
        return this.title$;
    }
    resolveDescription() {
        return this.description$;
    }
    /**
     * Resolves a single breadcrumb item to the home page for each `ContentPage`.
     * The home page label is resolved from the translation service.
     */
    resolveBreadcrumbs() {
        return this.breadcrumb$;
    }
    resolveRobots() {
        return this.robots$;
    }
    resolveCanonicalUrl(options) {
        return this.router.events.pipe(filter((ev) => ev instanceof NavigationEnd), startWith(null), map(() => this.pageLinkService.getCanonicalUrl(options)));
    }
}
BasePageMetaResolver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BasePageMetaResolver, deps: [{ token: CmsService }, { token: TranslationService }, { token: RoutingPageMetaResolver }, { token: i1$1.Router }, { token: PageLinkService }], target: i0.ɵɵFactoryTarget.Injectable });
BasePageMetaResolver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BasePageMetaResolver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BasePageMetaResolver, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: CmsService }, { type: TranslationService }, { type: RoutingPageMetaResolver }, { type: i1$1.Router }, { type: PageLinkService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Resolves the page data for all Content Pages based on the `PageType.CONTENT_PAGE`.
 * More specific resolvers for content pages can be implemented by making them more
 * specific, for example by using the page template (see `CartPageMetaResolver`).
 *
 * The page title, description, breadcrumbs and robot information are resolved from the
 * content page data. The canonical URL is resolved from the URL.
 */
class ContentPageMetaResolver extends PageMetaResolver {
    constructor(basePageMetaResolver) {
        super();
        this.basePageMetaResolver = basePageMetaResolver;
        this.pageType = PageType.CONTENT_PAGE;
    }
    resolveTitle() {
        return this.basePageMetaResolver.resolveTitle();
    }
    resolveDescription() {
        return this.basePageMetaResolver.resolveDescription();
    }
    resolveBreadcrumbs() {
        return this.basePageMetaResolver.resolveBreadcrumbs();
    }
    resolveRobots() {
        return this.basePageMetaResolver.resolveRobots();
    }
    resolveCanonicalUrl() {
        return this.basePageMetaResolver.resolveCanonicalUrl();
    }
}
ContentPageMetaResolver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ContentPageMetaResolver, deps: [{ token: BasePageMetaResolver }], target: i0.ɵɵFactoryTarget.Injectable });
ContentPageMetaResolver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ContentPageMetaResolver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ContentPageMetaResolver, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: BasePageMetaResolver }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class PageMetaModule {
    static forRoot() {
        return {
            ngModule: PageMetaModule,
            providers: [provideDefaultConfig(defaultPageMetaConfig)],
        };
    }
}
PageMetaModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageMetaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PageMetaModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: PageMetaModule });
PageMetaModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageMetaModule, providers: [
        {
            provide: PageMetaResolver,
            useExisting: ContentPageMetaResolver,
            multi: true,
        },
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageMetaModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [
                        {
                            provide: PageMetaResolver,
                            useExisting: ContentPageMetaResolver,
                            multi: true,
                        },
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function bufferDebounceTime(time = 0, scheduler) {
    return (source) => {
        let bufferedValues = [];
        return source.pipe(tap((value) => bufferedValues.push(value)), debounceTime(time, scheduler), map(() => bufferedValues), tap(() => (bufferedValues = [])));
    };
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 *
 * Withdraw from the source observable when notifier emits a value
 *
 * Withdraw will result in resubscribing to the source observable
 * Operator is useful to kill ongoing emission transformation on notifier emission
 *
 * @param notifier
 */
function withdrawOn(notifier) {
    return (source) => notifier.pipe(startWith(undefined), switchMapTo(source));
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const JSP_INCLUDE_CMS_COMPONENT_TYPE = 'JspIncludeComponent';
const CMS_FLEX_COMPONENT_TYPE = 'CMSFlexComponent';
/** Strategy to control the loading strategy of DOM elements. */
var DeferLoadingStrategy;
(function (DeferLoadingStrategy) {
    /** Defers loading of DOM elements until element is near/in the users view port */
    DeferLoadingStrategy["DEFER"] = "DEFERRED-LOADING";
    /** Renders the DOM instantly without being concerned with the view port */
    DeferLoadingStrategy["INSTANT"] = "INSTANT-LOADING";
})(DeferLoadingStrategy || (DeferLoadingStrategy = {}));
class CmsConfig extends OccConfig {
}
CmsConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsConfig, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
CmsConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The `CmsStructureConfig` is used to build pages in Spartacus by configuration
 * instead of using a backend CMS system. The configuration can be used to build
 * complete pages or parts of a page. The `CmsStructureConfig` is optimized to
 * only require the necessary properties. Adapter logic is applied to serialize
 * the `CmsStructureConfig` into the required UI model.
 */
class CmsStructureConfig extends CmsConfig {
}
CmsStructureConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsStructureConfig, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
CmsStructureConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsStructureConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsStructureConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Service that provides access to CMS structure from a static
 * configuration or configuration file. This class uses static
 * configuration is designed in async fashion so that configurations
 * can be loaded from a file or stream.
 *
 * The intent of the `CmsStructureConfigService` however is to provide
 * fast loading pages and default cms structure for commodity commerce.
 */
class CmsStructureConfigService {
    constructor(cmsDataConfig) {
        this.cmsDataConfig = cmsDataConfig;
    }
    /**
     * Merge the cms structure to the pageStructure. The page structure
     * can either hold complete page structures or global structures that
     * might apply to all pages (such has header coponents).
     */
    mergePageStructure(pageId, pageStructure) {
        return this.mergePage(pageId, pageStructure).pipe(switchMap((page) => this.mergeSlots(page)));
    }
    /**
     *
     * Returns boolean observable to indicate whether the page should not be
     * loaded from the backend. This is useful for pages which are comoditized
     * and follow best practice.
     *
     * By default, configurable pages are driven by static configuration,
     * in order to allow for fast loading pages (preventing network delays).
     */
    shouldIgnoreBackend(pageId) {
        return this.getPageFromConfig(pageId).pipe(map((page) => !!page && !!page.ignoreBackend));
    }
    /**
     * returns an Observable component data from the static configuration.
     */
    getComponentFromConfig(componentId) {
        return of(this.getComponentById(componentId));
    }
    /**
     * returns an Observable components data from the static configuration.
     */
    getComponentsFromConfig(ids) {
        return of(ids.map((id) => this.getComponentById(id)));
    }
    /**
     * returns an observable with the `PageConfig`.
     */
    getPageFromConfig(pageId) {
        return of(this.cmsDataConfig.cmsStructure && this.cmsDataConfig.cmsStructure.pages
            ? this.cmsDataConfig.cmsStructure.pages.find((p) => p.pageId === pageId)
            : undefined);
    }
    /**
     * Merge page data from the configuration into the given structure, if any.
     * If the given page structure is empty, a page is created and the page slots are
     * are merged into the page.
     */
    mergePage(pageId, pageStructure) {
        return this.getPageFromConfig(pageId).pipe(switchMap((page) => {
            if (page) {
                // serialize page data
                if (!pageStructure.page) {
                    pageStructure.page = Object.assign({}, page);
                    pageStructure.page.slots = {};
                }
                if (!pageStructure.page.slots) {
                    pageStructure.page.slots = {};
                }
                return this.mergeSlots(pageStructure, page.slots);
            }
            else {
                return of(pageStructure);
            }
        }));
    }
    /**
     * Adds any pre-configured slots for pages that do not use them.
     * If pages have a slot for the given position, the configiuration
     * is ingored. Even if the slot does not have inner structure (such as
     * components), so that the cms structure is able to override the (static)
     * configuration.
     */
    mergeSlots(pageStructure, slots) {
        var _a, _b;
        // if no slots have been given, we use the global configured slots
        if (!slots &&
            this.cmsDataConfig.cmsStructure &&
            this.cmsDataConfig.cmsStructure.slots) {
            slots = this.cmsDataConfig.cmsStructure.slots;
        }
        if (!slots) {
            return of(pageStructure);
        }
        for (const position of Object.keys(slots)) {
            if (((_a = pageStructure.page) === null || _a === void 0 ? void 0 : _a.slots) &&
                !Object.keys(pageStructure.page.slots).includes(position)) {
                // the global slot isn't yet part of the page structure
                pageStructure.page.slots[position] = {};
                for (const component of this.getComponentsByPosition(slots, position)) {
                    if (!pageStructure.page.slots[position].components) {
                        pageStructure.page.slots[position].components = [];
                    }
                    (_b = pageStructure.page.slots[position].components) === null || _b === void 0 ? void 0 : _b.push({
                        uid: component.uid,
                        flexType: component.flexType,
                        typeCode: component.typeCode,
                    });
                    if (!pageStructure.components) {
                        pageStructure.components = [];
                    }
                    pageStructure.components.push(component);
                }
            }
        }
        return of(pageStructure);
    }
    getComponentsByPosition(slots, position) {
        var _a;
        const components = [];
        if (slots[position] && slots[position].componentIds) {
            for (const componentId of (_a = slots[position].componentIds) !== null && _a !== void 0 ? _a : []) {
                if (this.cmsDataConfig.cmsStructure &&
                    this.cmsDataConfig.cmsStructure.components) {
                    const component = this.cmsDataConfig.cmsStructure.components[componentId];
                    if (component) {
                        components.push(Object.assign({ uid: componentId }, component));
                    }
                }
            }
        }
        return components;
    }
    getComponentById(componentId) {
        return this.cmsDataConfig.cmsStructure &&
            this.cmsDataConfig.cmsStructure.components
            ? this.cmsDataConfig.cmsStructure.components[componentId]
            : undefined;
    }
}
CmsStructureConfigService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsStructureConfigService, deps: [{ token: CmsStructureConfig }], target: i0.ɵɵFactoryTarget.Injectable });
CmsStructureConfigService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsStructureConfigService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsStructureConfigService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: CmsStructureConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CmsComponentAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CmsComponentConnector {
    constructor(cmsStructureConfigService, cmsComponentAdapter, config) {
        this.cmsStructureConfigService = cmsStructureConfigService;
        this.cmsComponentAdapter = cmsComponentAdapter;
        this.config = config;
    }
    get(id, pageContext) {
        return this.cmsStructureConfigService
            .getComponentFromConfig(id)
            .pipe(switchMap((configuredComponent) => configuredComponent
            ? of(configuredComponent)
            : this.cmsComponentAdapter.load(id, pageContext)));
    }
    getList(ids, pageContext) {
        return this.cmsStructureConfigService.getComponentsFromConfig(ids).pipe(switchMap((configuredComponents) => {
            var _a;
            // check if we have some components that are not loaded from configuration
            const missingIds = configuredComponents.reduce((acc, component, index) => {
                if (component === undefined) {
                    acc.push(ids[index]);
                }
                return acc;
            }, []);
            if (missingIds.length > 0) {
                const pageSize = ((_a = this.config.componentsLoading) === null || _a === void 0 ? void 0 : _a.pageSize) || missingIds.length;
                const totalPages = Math.ceil(missingIds.length / pageSize);
                const cmsComponents = [];
                let currentPage = 0;
                while (currentPage < totalPages) {
                    cmsComponents.push(this.cmsComponentAdapter.findComponentsByIds(missingIds.slice(currentPage * pageSize, (currentPage + 1) * pageSize), pageContext));
                    currentPage++;
                }
                return zip(...cmsComponents).pipe(map((loadedComponents) => [...configuredComponents.filter(Boolean)].concat(...loadedComponents)));
            }
            else {
                return of(configuredComponents);
            }
        }));
    }
}
CmsComponentConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsComponentConnector, deps: [{ token: CmsStructureConfigService }, { token: CmsComponentAdapter }, { token: CmsConfig }], target: i0.ɵɵFactoryTarget.Injectable });
CmsComponentConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsComponentConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsComponentConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: CmsStructureConfigService }, { type: CmsComponentAdapter }, { type: CmsConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ComponentsEffects {
    constructor(actions$, cmsComponentConnector) {
        this.actions$ = actions$;
        this.cmsComponentConnector = cmsComponentConnector;
        this.contextChange$ = this.actions$.pipe(ofType(LANGUAGE_CHANGE, LOGOUT, LOGIN));
        this.loadComponent$ = createEffect(() => ({ scheduler, debounce = 0 } = {}) => this.actions$.pipe(ofType(LOAD_CMS_COMPONENT), groupBy((actions) => serializePageContext(actions.payload.pageContext)), mergeMap((actionGroup) => actionGroup.pipe(bufferDebounceTime(debounce, scheduler), mergeMap((actions) => { var _a; return this.loadComponentsEffect(actions.map((action) => action.payload.uid), (_a = actions[0].payload.pageContext) !== null && _a !== void 0 ? _a : { id: '' }); }))), withdrawOn(this.contextChange$)));
    }
    loadComponentsEffect(componentUids, pageContext) {
        return this.cmsComponentConnector.getList(componentUids, pageContext).pipe(switchMap((components) => {
            var _a;
            const actions = [];
            const uidsLeft = new Set(componentUids);
            for (const component of components) {
                actions.push(new LoadCmsComponentSuccess({
                    component,
                    uid: component.uid,
                    pageContext,
                }));
                uidsLeft.delete((_a = component.uid) !== null && _a !== void 0 ? _a : '');
            }
            // we have to emit LoadCmsComponentFail for all component's uids that
            // are missing from the response
            uidsLeft.forEach((uid) => {
                actions.push(new LoadCmsComponentFail({
                    uid,
                    pageContext,
                }));
            });
            return from(actions);
        }), catchError((error) => from(componentUids.map((uid) => new LoadCmsComponentFail({
            uid,
            error: normalizeHttpError(error),
            pageContext,
        })))));
    }
}
ComponentsEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ComponentsEffects, deps: [{ token: i1$4.Actions }, { token: CmsComponentConnector }], target: i0.ɵɵFactoryTarget.Injectable });
ComponentsEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ComponentsEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ComponentsEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: CmsComponentConnector }]; } });

/*
 * Copyright (c) 2010-2019 Google LLC. http://angular.io/license
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const QUESTION_MARK = '[^/]';
const WILD_SINGLE = '[^/]*';
const WILD_OPEN = '(?:.+\\/)?';
const TO_ESCAPE_BASE = [
    { replace: /\./g, with: '\\.' },
    { replace: /\+/g, with: '\\+' },
    { replace: /\*/g, with: WILD_SINGLE },
];
const TO_ESCAPE_WILDCARD_QM = [
    ...TO_ESCAPE_BASE,
    { replace: /\?/g, with: QUESTION_MARK },
];
const TO_ESCAPE_LITERAL_QM = [
    ...TO_ESCAPE_BASE,
    { replace: /\?/g, with: '\\?' },
];
/**
 * Converts the glob-like pattern into regex string.
 *
 * Patterns use a limited glob format:
 * `**` matches 0 or more path segments
 * `*` matches 0 or more characters excluding `/`
 * `?` matches exactly one character excluding `/` (but when @param literalQuestionMark is true, `?` is treated as normal character)
 * The `!` prefix marks the pattern as being negative, meaning that only URLs that don't match the pattern will be included
 *
 * @param glob glob-like pattern
 * @param literalQuestionMark when true, it tells that `?` is treated as a normal character
 */
function globToRegex(glob, literalQuestionMark = false) {
    const toEscape = literalQuestionMark
        ? TO_ESCAPE_LITERAL_QM
        : TO_ESCAPE_WILDCARD_QM;
    const segments = glob.split('/').reverse();
    let regex = '';
    while (segments.length > 0) {
        const segment = segments.pop();
        if (segment === '**') {
            if (segments.length > 0) {
                regex += WILD_OPEN;
            }
            else {
                regex += '.*';
            }
        }
        else {
            const processed = toEscape.reduce((seg, escape) => seg === null || seg === void 0 ? void 0 : seg.replace(escape.replace, escape.with), segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}
/**
 * For given list of glob-like patterns, returns a matcher function.
 *
 * The matcher returns true for given URL only when ANY of the positive patterns is matched and NONE of the negative ones.
 */
function getGlobMatcher(patterns) {
    const processedPatterns = processGlobPatterns(patterns).map(({ positive, regex }) => ({
        positive,
        regex: new RegExp(regex),
    }));
    const includePatterns = processedPatterns.filter((spec) => spec.positive);
    const excludePatterns = processedPatterns.filter((spec) => !spec.positive);
    return (url) => includePatterns.some((pattern) => pattern.regex.test(url)) &&
        !excludePatterns.some((pattern) => pattern.regex.test(url));
}
/**
 * Converts list of glob-like patterns into list of RegExps with information whether the glob pattern is positive or negative
 */
function processGlobPatterns(urls) {
    return urls.map((url) => {
        const positive = !url.startsWith('!');
        url = positive ? url : url.substr(1);
        return { positive, regex: `^${globToRegex(url)}$` };
    });
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class GlobService {
    /**
     * For given list of glob-like patterns, returns a validator function.
     *
     * The validator returns true for given URL only when ANY of the positive patterns is matched and NONE of the negative ones.
     */
    getValidator(patterns) {
        const processedPatterns = processGlobPatterns(patterns).map(({ positive, regex }) => ({
            positive,
            regex: new RegExp(regex),
        }));
        const includePatterns = processedPatterns.filter((spec) => spec.positive);
        const excludePatterns = processedPatterns.filter((spec) => !spec.positive);
        return (url) => includePatterns.some((pattern) => pattern.regex.test(url)) &&
            !excludePatterns.some((pattern) => pattern.regex.test(url));
    }
}
GlobService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
GlobService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UrlMatcherService {
    constructor(globService) {
        this.globService = globService;
    }
    /**
     * Returns a matcher that is always fails
     */
    getFalsy() {
        return function falsyUrlMatcher() {
            return null;
        };
    }
    /**
     * Returns a matcher for given list of paths
     */
    getFromPaths(paths) {
        const matchers = paths.map((path) => this.getFromPath(path));
        const matcher = this.getCombined(matchers);
        if (isDevMode()) {
            matcher['_paths'] = paths; // property added for easier debugging of routes
        }
        return matcher;
    }
    /**
     * Returns a matcher that combines the given matchers
     * */
    getCombined(matchers) {
        const matcher = function combinedUrlMatchers(segments, segmentGroup, route) {
            for (let i = 0; i < matchers.length; i++) {
                const result = matchers[i](segments, segmentGroup, route);
                if (result) {
                    return result;
                }
            }
            return null;
        };
        if (isDevMode()) {
            matcher['_matchers'] = matchers; // property added for easier debugging of routes
        }
        return matcher;
    }
    /**
     * Similar to Angular's defaultUrlMatcher. Differences:
     * - the `path` comes from function's argument, not from `route.path`
     * - the empty path `''` is handled here, but in Angular is handled one level higher in the match() function
     */
    getFromPath(path = '') {
        const matcher = function pathUrlMatcher(segments, segmentGroup, route) {
            /**
             * @license
             * The MIT License
             * Copyright (c) 2010-2019 Google LLC. http://angular.io/license
             *
             * See:
             * - https://github.com/angular/angular/blob/6f5f481fdae03f1d8db36284b64c7b82d9519d85/packages/router/src/shared.ts#L121
             */
            // use function's argument, not the `route.path`
            if (path === '') {
                if (route.pathMatch === 'full' &&
                    (segmentGroup.hasChildren() || segments.length > 0)) {
                    return null;
                }
                return { consumed: [], posParams: {} };
            }
            const parts = path.split('/'); // use function's argument, not the `route.path`
            if (parts.length > segments.length) {
                // The actual URL is shorter than the config, no match
                return null;
            }
            if (route.pathMatch === 'full' &&
                (segmentGroup.hasChildren() || parts.length < segments.length)) {
                // The config is longer than the actual URL but we are looking for a full match, return null
                return null;
            }
            const posParams = {};
            // Check each config part against the actual URL
            for (let index = 0; index < parts.length; index++) {
                const part = parts[index];
                const segment = segments[index];
                const isParameter = part.startsWith(':');
                if (isParameter) {
                    posParams[part.substring(1)] = segment;
                }
                else if (part !== segment.path) {
                    // The actual URL part does not match the config, no match
                    return null;
                }
            }
            return { consumed: segments.slice(0, parts.length), posParams };
        };
        if (isDevMode()) {
            matcher['_path'] = path; // property added for easier debugging of routes
        }
        return matcher;
    }
    /**
     * Returns URL matcher that accepts almost everything (like `**` route), but not paths accepted by the given matcher
     */
    getOpposite(originalMatcher) {
        const matcher = function oppositeUrlMatcher(segments, group, route) {
            return originalMatcher(segments, group, route)
                ? null
                : { consumed: segments, posParams: {} };
        };
        if (isDevMode()) {
            matcher['_originalMatcher'] = originalMatcher; // property added for easier debugging of routes
        }
        return matcher;
    }
    /**
     * Returns URL matcher for the given list of glob-like patterns. Each pattern must start with `/` or `!/`.
     */
    getFromGlob(globPatterns) {
        const globValidator = this.globService.getValidator(globPatterns);
        const matcher = function globUrlMatcher(segments) {
            const fullPath = `/${segments.map((s) => s.path).join('/')}`;
            return globValidator(fullPath)
                ? { consumed: segments, posParams: {} }
                : null;
        };
        if (isDevMode()) {
            matcher['_globPatterns'] = globPatterns; // property added for easier debugging of routes
        }
        return matcher;
    }
}
UrlMatcherService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlMatcherService, deps: [{ token: GlobService }], target: i0.ɵɵFactoryTarget.Injectable });
UrlMatcherService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlMatcherService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlMatcherService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: GlobService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ConfigurableRoutesService {
    constructor(injector, routingConfigService, urlMatcherService) {
        this.injector = injector;
        this.routingConfigService = routingConfigService;
        this.urlMatcherService = urlMatcherService;
        this.initCalled = false; // guard not to call init() more than once
    }
    /**
     * Enhances existing Angular routes using the routing config of Spartacus.
     * Can be called only once.
     */
    init() {
        if (!this.initCalled) {
            this.initCalled = true;
            this.configure();
        }
    }
    /**
     * Enhances existing Angular routes using the routing config of Spartacus.
     */
    configure() {
        // Router could not be injected in constructor due to cyclic dependency with APP_INITIALIZER:
        const router = this.injector.get(Router);
        router.resetConfig(this.configureRoutes(router.config));
    }
    /**
     * Sets the property `path` or `matcher` for the given routes, based on the Spartacus' routing configuration.
     *
     * @param routes list of Angular `Route` objects
     */
    configureRoutes(routes) {
        return routes.map((route) => {
            const configuredRoute = this.configureRoute(route);
            if (route.children && route.children.length) {
                configuredRoute.children = this.configureRoutes(route.children);
            }
            return configuredRoute;
        });
    }
    /**
     * Sets the property `path` or `matcher` of the `Route`, based on the Spartacus' routing configuration.
     * Uses the property `data.cxRoute` to determine the name of the route.
     * It's the same name used as a key in the routing configuration: `routing.routes[ROUTE NAME]`.
     *
     * @param route Angular `Route` object
     */
    configureRoute(route) {
        var _a;
        const routeName = this.getRouteName(route);
        if (routeName) {
            const routeConfig = this.routingConfigService.getRouteConfig(routeName);
            this.validateRouteConfig(routeConfig, routeName, route);
            if (routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.disabled) {
                delete route.path;
                return Object.assign(Object.assign({}, route), { matcher: this.urlMatcherService.getFalsy() });
            }
            else if (routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.matchers) {
                delete route.path;
                return Object.assign(Object.assign({}, route), { matcher: this.resolveUrlMatchers(route, routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.matchers) });
            }
            else if (((_a = routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.paths) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                delete route.matcher;
                return Object.assign(Object.assign({}, route), { path: routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.paths[0] });
            }
            else {
                delete route.path;
                return Object.assign(Object.assign({}, route), { matcher: this.urlMatcherService.getFromPaths((routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.paths) || []) });
            }
        }
        return route; // if route doesn't have a name, just pass the original route
    }
    /**
     * Creates a single `UrlMatcher` based on given matchers and factories of matchers.
     *
     * @param route Route object
     * @param matchersOrFactories `UrlMatcher`s or injection tokens with a factory functions
     *  that create UrlMatchers based on the given route.
     */
    resolveUrlMatchers(route, matchersOrFactories) {
        var _a;
        const matchers = (_a = matchersOrFactories === null || matchersOrFactories === void 0 ? void 0 : matchersOrFactories.map((matcherOrFactory) => {
            return typeof matcherOrFactory === 'function'
                ? matcherOrFactory // matcher
                : this.resolveUrlMatcherFactory(route, matcherOrFactory); // factory injection token
        })) !== null && _a !== void 0 ? _a : [];
        return this.urlMatcherService.getCombined(matchers);
    }
    /**
     * Creates an `UrlMatcher` based on the given route, using the factory function coming from the given injection token.
     *
     * @param route Route object
     * @param factoryToken injection token with a factory function that will create an UrlMatcher using given route
     */
    resolveUrlMatcherFactory(route, factoryToken) {
        const factory = this.injector.get(factoryToken);
        return factory(route);
    }
    /**
     * Returns the name of the Route stored in its property `data.cxRoute`
     * @param route
     */
    getRouteName(route) {
        return route.data && route.data.cxRoute;
    }
    validateRouteConfig(routeConfig, routeName, route) {
        if (isDevMode()) {
            // - null value of routeConfig or routeConfig.paths means explicit switching off the route - it's valid config
            // - routeConfig with defined `matchers` is valid, even if `paths` are undefined
            if (routeConfig === null ||
                (routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.paths) === null ||
                (routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.matchers)) {
                return;
            }
            // undefined value of routeConfig or routeConfig.paths is a misconfiguration
            if (!(routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.paths)) {
                this.warn(`Could not configure the named route '${routeName}'`, route, `due to undefined config or undefined 'paths' property for this route`);
                return;
            }
        }
    }
    warn(...args) {
        if (isDevMode()) {
            console.warn(...args);
        }
    }
}
ConfigurableRoutesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigurableRoutesService, deps: [{ token: i0.Injector }, { token: RoutingConfigService }, { token: UrlMatcherService }], target: i0.ɵɵFactoryTarget.Injectable });
ConfigurableRoutesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigurableRoutesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConfigurableRoutesService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: RoutingConfigService }, { type: UrlMatcherService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductURLPipe {
    constructor(semanticPath) {
        this.semanticPath = semanticPath;
    }
    transform(product) {
        return this.semanticPath.transform({ cxRoute: 'product', params: product });
    }
}
ProductURLPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductURLPipe, deps: [{ token: SemanticPathService }], target: i0.ɵɵFactoryTarget.Pipe });
ProductURLPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ProductURLPipe, name: "cxProductUrl" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductURLPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'cxProductUrl',
                }]
        }], ctorParameters: function () { return [{ type: SemanticPathService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UrlPipe {
    constructor(urlService) {
        this.urlService = urlService;
    }
    transform(commands) {
        return this.urlService.transform(commands);
    }
}
UrlPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlPipe, deps: [{ token: SemanticPathService }], target: i0.ɵɵFactoryTarget.Pipe });
UrlPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: UrlPipe, name: "cxUrl" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'cxUrl',
                }]
        }], ctorParameters: function () { return [{ type: SemanticPathService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UrlModule {
}
UrlModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
UrlModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: UrlModule, declarations: [UrlPipe, ProductURLPipe], imports: [CommonModule], exports: [UrlPipe, ProductURLPipe] });
UrlModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UrlModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [UrlPipe, ProductURLPipe],
                    exports: [UrlPipe, ProductURLPipe],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ExternalRoutesConfig {
}
ExternalRoutesConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ExternalRoutesConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ExternalRoutesGuard {
    constructor(winRef, platformId) {
        this.winRef = winRef;
        this.platformId = platformId;
    }
    /**
     * Redirects to different storefront system for anticipated URL
     */
    canActivate(route, state) {
        if (isPlatformBrowser(this.platformId)) {
            this.redirect(route, state);
        }
        return false;
    }
    /**
     * Redirects to anticipated URL using full page reload, not Angular routing
     */
    redirect(_, state) {
        const window = this.winRef.nativeWindow;
        if (window && window.location) {
            window.location.href = state.url;
        }
    }
}
ExternalRoutesGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesGuard, deps: [{ token: WindowRef }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
ExternalRoutesGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () {
        return [{ type: WindowRef }, { type: Object, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function addExternalRoutesFactory(service) {
    const result = () => {
        service.addRoutes();
    };
    return result;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Service that helps redirecting to different storefront systems for configured URLs
 */
class ExternalRoutesService {
    constructor(config, urlMatcherService, injector) {
        this.config = config;
        this.urlMatcherService = urlMatcherService;
        this.injector = injector;
    }
    get internalUrlPatterns() {
        return ((this.config && this.config.routing && this.config.routing.internal) || []);
    }
    /**
     * Prepends routes (to the Router.config) that are responsible for redirecting to a different storefront system
     */
    addRoutes() {
        const router = this.injector.get(Router);
        const newRoutes = this.getRoutes();
        if (newRoutes.length) {
            router.resetConfig([...newRoutes, ...router.config]);
        }
    }
    /**
     * Returns routes that are responsible for redirection to different storefront systems
     */
    getRoutes() {
        if (!this.internalUrlPatterns.length) {
            return [];
        }
        const routes = [];
        routes.push({
            pathMatch: 'full',
            matcher: this.getUrlMatcher(),
            canActivate: [ExternalRoutesGuard],
            component: {},
        });
        return routes;
    }
    /**
     * Returns the URL matcher for the external route
     */
    getUrlMatcher() {
        const matcher = this.urlMatcherService.getFromGlob(this.internalUrlPatterns);
        return this.urlMatcherService.getOpposite(matcher); // the external route should be activated only when it's NOT an internal route
    }
}
ExternalRoutesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesService, deps: [{ token: ExternalRoutesConfig }, { token: UrlMatcherService }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
ExternalRoutesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ExternalRoutesConfig }, { type: UrlMatcherService }, { type: i0.Injector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Prepends the external route that redirects to a different storefront system for configured URLs
 */
class ExternalRoutesModule {
    static forRoot() {
        return {
            ngModule: ExternalRoutesModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    multi: true,
                    useFactory: addExternalRoutesFactory,
                    deps: [ExternalRoutesService],
                },
            ],
        };
    }
}
ExternalRoutesModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ExternalRoutesModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesModule });
ExternalRoutesModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ExternalRoutesModule, decorators: [{
            type: NgModule
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The homepage id for the CMS homepage is not required when we query the backend.
 * CMS business users can have multiple pages, that they might switch quickly without
 * changing the page id. Therefore, we use a constant to keep track of the page in the
 * store, but are able to ignore the id while querying the backend.
 */
const HOME_PAGE_CONTEXT = '__HOMEPAGE__';
/**
 * SmartEdit preview page is loaded by previewToken which is added by interceptor
 */
const SMART_EDIT_CONTEXT = 'smartedit-preview';
class PageContext {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProtectedRoutesService {
    constructor(config, urlParsingService) {
        this.config = config;
        this.urlParsingService = urlParsingService;
        this.nonProtectedPaths = []; // arrays of paths' segments list
        if (this.shouldProtect) {
            // pre-process config for performance:
            this.nonProtectedPaths = this.getNonProtectedPaths().map((path) => this.getSegments(path));
        }
    }
    get routingConfig() {
        return this.config && this.config.routing;
    }
    /**
     * Returns 'protected' property (boolean) from routing config
     *
     * @returns boolean
     */
    get shouldProtect() {
        var _a;
        return !!((_a = this.routingConfig) === null || _a === void 0 ? void 0 : _a.protected);
    }
    /**
     * Tells if the url is protected
     */
    isUrlProtected(urlSegments) {
        return (this.shouldProtect &&
            !this.matchAnyPath(urlSegments, this.nonProtectedPaths));
    }
    /**
     * Tells whether the url matches at least one of the paths
     */
    matchAnyPath(urlSegments, pathsSegments) {
        return pathsSegments.some((pathSegments) => this.matchPath(urlSegments, pathSegments));
    }
    /**
     * Tells whether the url matches the path
     */
    matchPath(urlSegments, pathSegments) {
        return this.urlParsingService.matchPath(urlSegments, pathSegments);
    }
    /**
     * Returns a list of paths that are not protected
     */
    getNonProtectedPaths() {
        var _a, _b;
        return Object.values((_b = (_a = this.routingConfig) === null || _a === void 0 ? void 0 : _a.routes) !== null && _b !== void 0 ? _b : {}).reduce((acc, routeConfig) => {
            var _a;
            return routeConfig.protected === false && // must be explicitly false, ignore undefined
                routeConfig.paths &&
                routeConfig.paths.length
                ? acc.concat((_a = routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.paths) !== null && _a !== void 0 ? _a : [])
                : acc;
        }, []);
    }
    /**
     * Splits the url by slashes
     */
    getSegments(url) {
        return (url || '').split('/');
    }
}
ProtectedRoutesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProtectedRoutesService, deps: [{ token: RoutingConfig }, { token: UrlParsingService }], target: i0.ɵɵFactoryTarget.Injectable });
ProtectedRoutesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProtectedRoutesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProtectedRoutesService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: RoutingConfig }, { type: UrlParsingService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProtectedRoutesGuard {
    constructor(service, authGuard) {
        this.service = service;
        this.authGuard = authGuard;
    }
    /**
     * When the anticipated url is protected, it switches to the AuthGuard. Otherwise emits true.
     */
    canActivate(route) {
        let urlSegments = route.url.map((seg) => seg.path);
        // For the root path `/` ActivatedRoute contains an empty array of segments:
        urlSegments = urlSegments.length ? urlSegments : [''];
        if (this.service.isUrlProtected(urlSegments)) {
            return this.authGuard.canActivate();
        }
        return of(true);
    }
}
ProtectedRoutesGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProtectedRoutesGuard, deps: [{ token: ProtectedRoutesService }, { token: AuthGuard }], target: i0.ɵɵFactoryTarget.Injectable });
ProtectedRoutesGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProtectedRoutesGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProtectedRoutesGuard, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: ProtectedRoutesService }, { type: AuthGuard }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class RouterEffects {
    constructor(actions$, router) {
        this.actions$ = actions$;
        this.router = router;
        this.clearCmsRoutes$ = createEffect(() => this.actions$.pipe(ofType(LANGUAGE_CHANGE, LOGOUT, LOGIN), tap(() => {
            const filteredConfig = this.router.config.filter((route) => !(route.data && route.data.cxCmsRouteContext));
            if (filteredConfig.length !== this.router.config.length) {
                this.router.resetConfig(filteredConfig);
            }
        })), { dispatch: false });
    }
}
RouterEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RouterEffects, deps: [{ token: i1$4.Actions }, { token: i1$1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
RouterEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RouterEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RouterEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: i1$1.Router }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const effects$3 = [RouterEffects];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$i = {
    navigationId: 0,
    state: {
        url: '',
        queryParams: {},
        params: {},
        context: {
            id: '',
        },
        cmsRequired: false,
        semanticRoute: undefined,
    },
    nextState: undefined,
};
function getReducers$5() {
    return {
        router: reducer$i,
    };
}
function reducer$i(state = initialState$i, action) {
    var _a, _b;
    switch (action.type) {
        case fromNgrxRouter.ROUTER_NAVIGATION: {
            return Object.assign(Object.assign({}, state), { nextState: action.payload.routerState, navigationId: action.payload.event.id });
        }
        case fromNgrxRouter.ROUTER_ERROR:
        case fromNgrxRouter.ROUTER_CANCEL: {
            return Object.assign(Object.assign({}, state), { nextState: undefined });
        }
        case CHANGE_NEXT_PAGE_CONTEXT: {
            return state.nextState
                ? Object.assign(Object.assign({}, state), { nextState: Object.assign(Object.assign({}, state.nextState), { context: action.payload }) }) : state;
        }
        case fromNgrxRouter.ROUTER_NAVIGATED: {
            return {
                state: Object.assign(Object.assign({}, action.payload.routerState), { context: 
                    // we want to preserve already resolved context,
                    // in case it was changed while navigating
                    (_b = (_a = state.nextState) === null || _a === void 0 ? void 0 : _a.context) !== null && _b !== void 0 ? _b : action.payload.routerState.context }),
                navigationId: action.payload.event.id,
                nextState: undefined,
            };
        }
        default: {
            return state;
        }
    }
}
const reducerToken$5 = new InjectionToken('RouterReducers');
const reducerProvider$5 = {
    provide: reducerToken$5,
    useFactory: getReducers$5,
};
/* The serializer is there to parse the RouterStateSnapshot,
and to reduce the amount of properties to be passed to the reducer.
 */
class CustomSerializer {
    constructor(routingConfig) {
        this.routingConfig = routingConfig;
    }
    serialize(routerState) {
        var _a, _b;
        let state = routerState.root;
        let cmsRequired = false;
        let context;
        let semanticRoute;
        let urlString = '';
        while (state.firstChild) {
            state = state.firstChild;
            urlString +=
                '/' + state.url.map((urlSegment) => urlSegment.path).join('/');
            // we use semantic route information embedded from any parent route
            if ((_a = state.data) === null || _a === void 0 ? void 0 : _a.cxRoute) {
                semanticRoute = (_b = state.data) === null || _b === void 0 ? void 0 : _b.cxRoute;
            }
            // we use context information embedded in Cms driven routes from any parent route
            if (state.data && state.data.cxCmsRouteContext) {
                context = state.data.cxCmsRouteContext;
            }
            // we assume, that any route that has CmsPageGuard or it's child
            // is cmsRequired
            if (!cmsRequired &&
                (context ||
                    (state.routeConfig &&
                        state.routeConfig.canActivate &&
                        state.routeConfig.canActivate.find((x) => x && x.guardName === 'CmsPageGuard')))) {
                cmsRequired = true;
            }
        }
        // If `semanticRoute` couldn't be already recognized using `data.cxRoute` property
        // let's lookup the routing configuration to find the semantic route that has exactly the same configured path as the current URL.
        // This will work only for simple URLs without any dynamic routing parameters.
        semanticRoute = semanticRoute || this.lookupSemanticRoute(urlString);
        const { params } = state;
        // we give smartedit preview page a PageContext
        if (state.url.length > 0 && state.url[0].path === 'cx-preview') {
            context = {
                id: SMART_EDIT_CONTEXT,
                type: PageType.CONTENT_PAGE,
            };
        }
        else {
            if (params['productCode']) {
                context = { id: params['productCode'], type: PageType.PRODUCT_PAGE };
            }
            else if (params['categoryCode']) {
                context = { id: params['categoryCode'], type: PageType.CATEGORY_PAGE };
            }
            else if (params['brandCode']) {
                context = { id: params['brandCode'], type: PageType.CATEGORY_PAGE };
            }
            else if (state.data.pageLabel !== undefined) {
                context = { id: state.data.pageLabel, type: PageType.CONTENT_PAGE };
            }
            else if (!context) {
                if (state.url.length > 0) {
                    const pageLabel = '/' + state.url.map((urlSegment) => urlSegment.path).join('/');
                    context = {
                        id: pageLabel,
                        type: PageType.CONTENT_PAGE,
                    };
                }
                else {
                    context = {
                        // We like URLs to be driven by the backend, the CMS actually returns the homepage
                        // if no page label is given. Our logic however requires an id. undefined doesn't work.
                        id: HOME_PAGE_CONTEXT,
                        // We currently need to support a hardcoded page type, since the internal store uses the page
                        // type to store the content.
                        type: PageType.CONTENT_PAGE,
                    };
                }
            }
        }
        return {
            url: routerState.url,
            queryParams: routerState.root.queryParams,
            params,
            context,
            cmsRequired,
            semanticRoute,
        };
    }
    /**
     * Returns the semantic route name for given page label.
     *
     * *NOTE*: It works only for simple static urls that are equal to the page label
     * of cms-driven content page. For example: `/my-account/address-book`.
     *
     * It doesn't work for URLs with dynamic parameters. But such case can be handled
     * by reading the defined `data.cxRoute` from the Angular Routes.
     *
     * @param path path to be found in the routing config
     */
    lookupSemanticRoute(path) {
        // Page label is assumed to start with `/`, but Spartacus configured paths
        // don't start with slash. So we remove the leading slash:
        return this.routingConfig.getRouteName(path.substr(1));
    }
}
CustomSerializer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomSerializer, deps: [{ token: RoutingConfigService }], target: i0.ɵɵFactoryTarget.Injectable });
CustomSerializer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomSerializer });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomSerializer, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: RoutingConfigService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function initConfigurableRoutes(service) {
    const result = () => service.init(); // workaround for AOT compilation (see https://stackoverflow.com/a/51977115)
    return result;
}
class RoutingModule {
    static forRoot() {
        return {
            ngModule: RoutingModule,
            providers: [
                reducerProvider$5,
                {
                    provide: RouterStateSerializer,
                    useClass: CustomSerializer,
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: initConfigurableRoutes,
                    deps: [ConfigurableRoutesService],
                    multi: true,
                },
            ],
        };
    }
}
RoutingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
RoutingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: RoutingModule, imports: [i1$2.StoreFeatureModule, i1$4.EffectsFeatureModule, fromNgrxRouter.StoreRouterConnectingModule] });
RoutingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingModule, imports: [StoreModule.forFeature(ROUTING_FEATURE, reducerToken$5),
        EffectsModule.forFeature(effects$3),
        StoreRouterConnectingModule.forRoot({
            routerState: 1 /* RouterState.Minimal */,
            stateKey: ROUTING_FEATURE, // name of reducer key
        })] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RoutingModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        StoreModule.forFeature(ROUTING_FEATURE, reducerToken$5),
                        EffectsModule.forFeature(effects$3),
                        StoreRouterConnectingModule.forRoot({
                            routerState: 1 /* RouterState.Minimal */,
                            stateKey: ROUTING_FEATURE, // name of reducer key
                        }),
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getDefaultUrlMatcherFactory(routingConfigService, urlMatcherService) {
    const factory = (route) => {
        const routeName = route.data && route.data['cxRoute'];
        const routeConfig = routingConfigService.getRouteConfig(routeName);
        const paths = (routeConfig && routeConfig.paths) || [];
        return urlMatcherService.getFromPaths(paths);
    };
    return factory;
}
/**
 * Injection token with url matcher factory for spartacus routes containing property `data.cxRoute`.
 * The provided url matcher matches the configured `paths` from routing config.
 *
 * If this matcher doesn't fit the requirements, it can be replaced with custom matcher
 * or additional matchers can be added for a specific route. See for example PRODUCT_DETAILS_URL_MATCHER.
 *
 * Note: Matchers will "match" a route, but do not contribute to the creation of the route, nor do they guard routes.
 */
const DEFAULT_URL_MATCHER = new InjectionToken('DEFAULT_URL_MATCHER', {
    providedIn: 'root',
    factory: () => getDefaultUrlMatcherFactory(inject(RoutingConfigService), inject(UrlMatcherService)),
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class NavigationEntryItemEffects {
    constructor(actions$, cmsComponentConnector, routingService) {
        this.actions$ = actions$;
        this.cmsComponentConnector = cmsComponentConnector;
        this.routingService = routingService;
        this.loadNavigationItems$ = createEffect(() => this.actions$.pipe(ofType(LOAD_CMS_NAVIGATION_ITEMS), map((action) => action.payload), map((payload) => {
            return {
                ids: this.getIdListByItemType(payload.items),
                nodeId: payload.nodeId,
            };
        }), mergeMap((data) => {
            if (data.ids.componentIds.length > 0) {
                return this.routingService.getRouterState().pipe(filter(isNotUndefined), map((routerState) => routerState.state.context), take(1), mergeMap((pageContext) => 
                // download all items in one request
                this.cmsComponentConnector
                    .getList(data.ids.componentIds, pageContext)
                    .pipe(map((components) => new LoadCmsNavigationItemsSuccess({
                    nodeId: data.nodeId,
                    components: components,
                })), catchError((error) => of(new LoadCmsNavigationItemsFail(data.nodeId, normalizeHttpError(error)))))));
                //} else if (data.ids.pageIds.length > 0) {
                // TODO: future work
                // dispatch action to load cms page one by one
                //} else if (data.ids.mediaIds.length > 0) {
                // TODO: future work
                // send request to get list of media
            }
            else {
                return of(new LoadCmsNavigationItemsFail(data.nodeId, 'navigation nodes are empty'));
            }
        })));
    }
    // We only consider 3 item types: cms page, cms component, and media.
    getIdListByItemType(itemList) {
        const pageIds = [];
        const componentIds = [];
        const mediaIds = [];
        itemList.forEach((item) => {
            if (item.superType === 'AbstractCMSComponent') {
                componentIds.push(item.id);
            }
            else if (item.superType === 'AbstractPage') {
                pageIds.push(item.id);
            }
            else if (item.superType === 'AbstractMedia') {
                mediaIds.push(item.id);
            }
        });
        return { pageIds: pageIds, componentIds: componentIds, mediaIds: mediaIds };
    }
}
NavigationEntryItemEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NavigationEntryItemEffects, deps: [{ token: i1$4.Actions }, { token: CmsComponentConnector }, { token: RoutingService }], target: i0.ɵɵFactoryTarget.Injectable });
NavigationEntryItemEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NavigationEntryItemEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NavigationEntryItemEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: CmsComponentConnector }, { type: RoutingService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Abstract class that can be used to implement custom loader logic
 * in order to load CMS structure from third-party CMS system.
 */
class CmsPageAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CmsPageConnector {
    constructor(cmsPageAdapter, cmsStructureConfigService) {
        this.cmsPageAdapter = cmsPageAdapter;
        this.cmsStructureConfigService = cmsStructureConfigService;
    }
    /**
     * Returns an observable with the page structure. The page structure is
     * typically loaded from a backend, but can also be returned from static
     * configuration (see `CmsStructureConfigService`).
     */
    get(pageContext) {
        return this.cmsStructureConfigService
            .shouldIgnoreBackend(pageContext.id)
            .pipe(switchMap((loadFromConfig) => {
            if (!loadFromConfig) {
                return this.cmsPageAdapter.load(pageContext).pipe(catchError((error) => {
                    if (error instanceof HttpErrorResponse &&
                        error.status === 400) {
                        return of({});
                    }
                    else {
                        return throwError(error);
                    }
                }));
            }
            else {
                return of({});
            }
        }), switchMap((page) => this.mergeDefaultPageStructure(pageContext, page)));
    }
    /**
     *
     * Merge default page structure to the given `CmsStructureModel`.
     * This is beneficial for a fast setup of the UI without necessary
     * fine-grained CMS setup.
     */
    mergeDefaultPageStructure(pageContext, pageStructure) {
        return this.cmsStructureConfigService.mergePageStructure(pageContext.id, pageStructure);
    }
}
CmsPageConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsPageConnector, deps: [{ token: CmsPageAdapter }, { token: CmsStructureConfigService }], target: i0.ɵɵFactoryTarget.Injectable });
CmsPageConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsPageConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsPageConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: CmsPageAdapter }, { type: CmsStructureConfigService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class PageEffects {
    constructor(actions$, cmsPageConnector, routingService) {
        this.actions$ = actions$;
        this.cmsPageConnector = cmsPageConnector;
        this.routingService = routingService;
        this.refreshPage$ = createEffect(() => this.actions$.pipe(ofType(LANGUAGE_CHANGE, LOGOUT, LOGIN), switchMap(() => this.routingService.getRouterState().pipe(filter((routerState) => routerState &&
            routerState.state &&
            routerState.state.cmsRequired &&
            !routerState.nextState), take(1), map((routerState) => routerState.state.context), mergeMap((context) => of(new LoadCmsPageData(context)))))));
        this.loadPageData$ = createEffect(() => this.actions$.pipe(ofType(LOAD_CMS_PAGE_DATA), map((action) => action.payload), groupBy((pageContext) => serializePageContext(pageContext)), mergeMap((group) => group.pipe(switchMap((pageContext) => this.cmsPageConnector.get(pageContext).pipe(mergeMap((cmsStructure) => {
            var _a, _b, _c, _d;
            const actions = [
                new CmsGetComponentFromPage(((_a = cmsStructure.components) !== null && _a !== void 0 ? _a : []).map((component) => ({
                    component,
                    pageContext,
                }))),
                new LoadCmsPageDataSuccess(pageContext, (_b = cmsStructure.page) !== null && _b !== void 0 ? _b : {}),
            ];
            const pageLabel = (_c = cmsStructure.page) === null || _c === void 0 ? void 0 : _c.label;
            // For content pages the page label returned from backend can be different than page ID initially assumed from route.
            // In such a case let's save the success response not only for initially assumed page ID, but also for correct page label.
            if (pageLabel && pageLabel !== pageContext.id) {
                actions.unshift(new CmsSetPageSuccessIndex({ id: pageLabel, type: pageContext.type }, (_d = cmsStructure.page) !== null && _d !== void 0 ? _d : {}));
            }
            return actions;
        }), catchError((error) => of(new LoadCmsPageDataFail(pageContext, normalizeHttpError(error))))))))));
    }
}
PageEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageEffects, deps: [{ token: i1$4.Actions }, { token: CmsPageConnector }, { token: RoutingService }], target: i0.ɵɵFactoryTarget.Injectable });
PageEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: CmsPageConnector }, { type: RoutingService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const effects$2 = [
    PageEffects,
    ComponentsEffects,
    NavigationEntryItemEffects,
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$h = {
    component: undefined,
    pageContext: {},
};
function componentExistsReducer(state, action) {
    switch (action.type) {
        case LOAD_CMS_COMPONENT_FAIL:
            return false;
        case CMS_GET_COMPONENT_FROM_PAGE:
        case LOAD_CMS_COMPONENT_SUCCESS:
            return true;
    }
    return state;
}
function reducer$h(state = initialState$h, action) {
    switch (action.type) {
        case LOAD_CMS_COMPONENT: {
            const pageContextReducer = loaderReducer(action.meta.entityType, componentExistsReducer);
            const context = serializePageContext(action.payload.pageContext, true);
            return Object.assign(Object.assign({}, state), { pageContext: Object.assign(Object.assign({}, state.pageContext), { [context]: pageContextReducer(state.pageContext[context], action) }) });
        }
        case LOAD_CMS_COMPONENT_FAIL: {
            const pageContextReducer = loaderReducer(action.meta.entityType, componentExistsReducer);
            const context = serializePageContext(action.payload.pageContext, true);
            return Object.assign(Object.assign({}, state), { pageContext: Object.assign(Object.assign({}, state.pageContext), { [context]: pageContextReducer(state.pageContext[context], action) }) });
        }
        case LOAD_CMS_COMPONENT_SUCCESS: {
            const pageContextReducer = loaderReducer(action.meta.entityType, componentExistsReducer);
            const context = serializePageContext(action.payload.pageContext, true);
            return Object.assign(Object.assign({}, state), { component: action.payload.component, pageContext: Object.assign(Object.assign({}, state.pageContext), { [context]: pageContextReducer(state.pageContext[context], action) }) });
        }
        case CMS_GET_COMPONENT_FROM_PAGE: {
            const pageContextReducer = loaderReducer(action.meta.entityType, componentExistsReducer);
            if (!Array.isArray(action.payload)) {
                const context = serializePageContext(action.payload.pageContext, true);
                return Object.assign(Object.assign({}, state), { component: action.payload.component, pageContext: Object.assign(Object.assign({}, state.pageContext), { [context]: pageContextReducer(state.pageContext[context], action) }) });
            }
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$g = undefined;
function reducer$g(state = initialState$g, action) {
    switch (action.type) {
        case LOAD_CMS_NAVIGATION_ITEMS_SUCCESS: {
            if (action.payload.components) {
                const components = action.payload.components;
                const newItem = components.reduce((compItems, component) => {
                    return Object.assign(Object.assign({}, compItems), { [`${component.uid}_AbstractCMSComponent`]: component });
                }, Object.assign({}));
                return Object.assign(Object.assign({}, state), newItem);
            }
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$f = { entities: {} };
function reducer$f(state = initialState$f, action) {
    var _a;
    switch (action.type) {
        case LOAD_CMS_PAGE_DATA_SUCCESS: {
            const page = action.payload;
            return Object.assign(Object.assign({}, state), { entities: Object.assign(Object.assign({}, state.entities), { [(_a = page.pageId) !== null && _a !== void 0 ? _a : '']: page }) });
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$e = undefined;
function reducer$e(entityType) {
    return (state = initialState$e, action) => {
        if (action.meta && action.meta.entityType === entityType) {
            switch (action.type) {
                case LOAD_CMS_PAGE_DATA_SUCCESS: {
                    return action.payload.pageId;
                }
                case LOAD_CMS_PAGE_DATA_FAIL: {
                    return initialState$e;
                }
                case CMS_SET_PAGE_FAIL_INDEX: {
                    return action.payload;
                }
                case CMS_SET_PAGE_SUCCESS_INDEX: {
                    return action.payload.pageId;
                }
            }
        }
        return state;
    };
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getReducers$4() {
    return {
        page: combineReducers({
            pageData: reducer$f,
            index: combineReducers({
                content: entityLoaderReducer(PageType.CONTENT_PAGE, reducer$e(PageType.CONTENT_PAGE)),
                product: entityLoaderReducer(PageType.PRODUCT_PAGE, reducer$e(PageType.PRODUCT_PAGE)),
                category: entityLoaderReducer(PageType.CATEGORY_PAGE, reducer$e(PageType.CATEGORY_PAGE)),
                catalog: entityLoaderReducer(PageType.CATALOG_PAGE, reducer$e(PageType.CATALOG_PAGE)),
            }),
        }),
        components: entityReducer(COMPONENT_ENTITY, reducer$h),
        navigation: entityLoaderReducer(NAVIGATION_DETAIL_ENTITY, reducer$g),
    };
}
const reducerToken$4 = new InjectionToken('CmsReducers');
const reducerProvider$4 = {
    provide: reducerToken$4,
    useFactory: getReducers$4,
};
function clearCmsState(reducer) {
    return function (state, action) {
        if (action.type === LANGUAGE_CHANGE ||
            action.type === LOGOUT ||
            action.type === LOGIN) {
            state = undefined;
        }
        return reducer(state, action);
    };
}
const metaReducers$2 = [clearCmsState];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function cmsStoreConfigFactory() {
    // if we want to reuse CMS_FEATURE const in config, we have to use factory instead of plain object
    const config = {
        state: {
            ssrTransfer: {
                keys: { [CMS_FEATURE]: StateTransferType.TRANSFER_STATE },
            },
        },
    };
    return config;
}
class CmsStoreModule {
}
CmsStoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsStoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CmsStoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: CmsStoreModule, imports: [CommonModule,
        StateModule, i1$2.StoreFeatureModule, i1$4.EffectsFeatureModule] });
CmsStoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsStoreModule, providers: [
        provideDefaultConfigFactory(cmsStoreConfigFactory),
        reducerProvider$4,
    ], imports: [CommonModule,
        StateModule,
        StoreModule.forFeature(CMS_FEATURE, reducerToken$4, { metaReducers: metaReducers$2 }),
        EffectsModule.forFeature(effects$2)] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsStoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        StateModule,
                        StoreModule.forFeature(CMS_FEATURE, reducerToken$4, { metaReducers: metaReducers$2 }),
                        EffectsModule.forFeature(effects$2),
                    ],
                    providers: [
                        provideDefaultConfigFactory(cmsStoreConfigFactory),
                        reducerProvider$4,
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CmsModule {
    static forRoot() {
        return {
            ngModule: CmsModule,
            providers: [CmsService, provideDefaultConfig(defaultCmsModuleConfig)],
        };
    }
}
CmsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CmsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: CmsModule, imports: [CmsStoreModule, PageMetaModule] });
CmsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsModule, imports: [CmsStoreModule, PageMetaModule.forRoot()] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CmsStoreModule, PageMetaModule.forRoot()],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CMS_PAGE_NORMALIZER = new InjectionToken('CmsPageNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CMS_COMPONENT_NORMALIZER = new InjectionToken('CmsComponentNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ComponentDecorator {
}
ComponentDecorator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ComponentDecorator, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ComponentDecorator.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ComponentDecorator });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ComponentDecorator, decorators: [{
            type: Injectable
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SlotDecorator {
}
SlotDecorator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SlotDecorator, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
SlotDecorator.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SlotDecorator });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SlotDecorator, decorators: [{
            type: Injectable
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Helper logic to resolve best matching Applicable
 *
 * Finding best match is a two step process:
 * 1. Find all matching applicables
 *    - all applicables for which hasMatch(...matchParams) will return true
 *    - all applicables without hasMatch method (implicit always match)
 * 2. Find the applicable with highest priority
 *    - applicable with highest getPriority(...priorityParams) will win
 *    - applicable without getPriority method is treated as Priority.NORMAL or 0
 *    - applicables with the same priority are sorted by order of providers, the applicable that was provided later wins
 *
 * @param applicables - array or applicable-like instances
 * @param matchParams - array of parameters passed for hasMatch calls
 * @param priorityParams - array of parameters passed for getPriority calls
 */
function resolveApplicable(applicables, matchParams = [], priorityParams = []) {
    const matchedApplicables = (applicables !== null && applicables !== void 0 ? applicables : []).filter((applicable) => !applicable.hasMatch || applicable.hasMatch(...matchParams));
    if (matchedApplicables.length < 2) {
        return matchedApplicables[0];
    }
    let lastPriority = -Infinity;
    return matchedApplicables.reduce((acc, curr) => {
        const currPriority = curr.getPriority
            ? curr.getPriority(...priorityParams)
            : 0 /* Priority.NORMAL */;
        if (lastPriority > currPriority) {
            return acc;
        }
        lastPriority = currPriority;
        return curr;
    }, undefined);
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * uniteLatest is an alternative to combineLatest. The first emission is
 * emitted synchronously (just like combineLatest) and all following emissions
 * are audited and emitted using asapScheduler.
 *
 * It effectively smooths out emissions when multiple sources will emit at the
 * same time: uniteLatest will have only one emission, where combine latest will
 * have more than one (one per source changed).
 *
 * @param sources
 */
function uniteLatest(sources) {
    return defer(() => {
        let subNo = 0;
        const trigger = new Observable((subscriber) => {
            const action = () => {
                subscriber.next();
                subscriber.complete();
            };
            if (subNo) {
                asapScheduler.schedule(action);
            }
            else {
                action();
            }
            subNo++;
        });
        return combineLatest(sources).pipe(audit(() => trigger));
    });
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Service that collects the page meta data by using injected page resolvers.
 */
class PageMetaService {
    constructor(cms, unifiedInjector, pageMetaConfig, platformId) {
        this.cms = cms;
        this.unifiedInjector = unifiedInjector;
        this.pageMetaConfig = pageMetaConfig;
        this.platformId = platformId;
        this.resolvers$ = this.unifiedInjector
            .getMulti(PageMetaResolver)
            .pipe(shareReplay({ bufferSize: 1, refCount: true }));
        this.meta$ = defer(() => this.cms.getCurrentPage()).pipe(filter((page) => Boolean(page)), switchMap((page) => this.getMetaResolver(page)), switchMap((metaResolver) => metaResolver ? this.resolve(metaResolver) : of(null)), shareReplay({ bufferSize: 1, refCount: true }));
    }
    /**
     * Returns the observed page meta data for the current page.
     *
     * The data is resolved by various PageResolvers, which are configurable.
     */
    getMeta() {
        return this.meta$;
    }
    /**
     * If a `PageResolver` has implemented a resolver interface, the resolved data
     * is merged into the `PageMeta` object.
     * @param metaResolver
     */
    resolve(metaResolver) {
        const resolverMethods = this.getResolverMethods();
        const resolvedData = Object.keys(resolverMethods)
            // TODO: Revisit if typing is possible here with Template Literal Types when we update to TS >=4.1
            .filter((key) => metaResolver[resolverMethods[key]])
            .map((key) => {
            return metaResolver[resolverMethods[key]]()
                .pipe(map((data) => ({ [key]: data })));
        });
        if (resolvedData.length === 0) {
            // uniteLatest will fail otherwise
            return of({});
        }
        else {
            return uniteLatest(resolvedData).pipe(map((data) => Object.assign({}, ...data)));
        }
    }
    /**
     * Returns an object with resolvers. The object properties represent the `PageMeta` property, i.e.:
     *
     * ```
     * {
     *   title: 'resolveTitle',
     *   robots: 'resolveRobots'
     * }
     * ```
     *
     * This list of resolvers is filtered for CSR vs SSR processing since not all resolvers are
     * relevant during browsing.
     */
    getResolverMethods() {
        var _a, _b, _c;
        let resolverMethods = {};
        // filter the resolvers to avoid unnecessary processing in CSR
        (_c = (_b = (_a = this.pageMetaConfig) === null || _a === void 0 ? void 0 : _a.pageMeta) === null || _b === void 0 ? void 0 : _b.resolvers) === null || _c === void 0 ? void 0 : _c.filter((resolver) => {
            var _a, _b, _c;
            return (
            // always resolve in SSR
            !isPlatformBrowser((_a = this.platformId) !== null && _a !== void 0 ? _a : '') ||
                // resolve in CSR when it's not disabled
                !resolver.disabledInCsr ||
                // resolve in CSR when resolver is enabled in devMode
                (isDevMode() && ((_c = (_b = this.pageMetaConfig) === null || _b === void 0 ? void 0 : _b.pageMeta) === null || _c === void 0 ? void 0 : _c.enableInDevMode)));
        }).forEach((resolver) => (resolverMethods[resolver.property] = resolver.method));
        return resolverMethods;
    }
    /**
     * Return the resolver with the best match, based on a score
     * generated by the resolver.
     *
     * Resolvers match by default on `PageType` and `page.template`.
     */
    getMetaResolver(page) {
        return this.resolvers$.pipe(map((resolvers) => resolveApplicable(resolvers, [page], [page])));
    }
}
PageMetaService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageMetaService, deps: [{ token: CmsService }, { token: UnifiedInjector }, { token: PageMetaConfig }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
PageMetaService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageMetaService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: PageMetaService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: CmsService }, { type: UnifiedInjector }, { type: PageMetaConfig }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var PageRobotsMeta;
(function (PageRobotsMeta) {
    PageRobotsMeta["INDEX"] = "INDEX";
    PageRobotsMeta["NOINDEX"] = "NOINDEX";
    PageRobotsMeta["FOLLOW"] = "FOLLOW";
    PageRobotsMeta["NOFOLLOW"] = "NOFOLLOW";
})(PageRobotsMeta || (PageRobotsMeta = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Will grab last synchronously available value from the observable stream
 * at the time of the call.
 *
 * Should be used with caution, as it's not a legitimate way for getting value
 * from the observable. Observable composition or standard subscribe method
 * should be used for most of the cases.
 *
 * @param source
 */
function getLastValueSync(source) {
    let value;
    source.subscribe((emission) => (value = emission)).unsubscribe();
    return value;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Service that used to add dynamic attributes to CMS component
 * and slot elements.
 */
class DynamicAttributeService {
    constructor(unifiedInjector) {
        this.unifiedInjector = unifiedInjector;
        this.componentDecorators$ = this.unifiedInjector
            .getMulti(ComponentDecorator)
            .pipe(shareReplay(1));
        this.slotDecorators$ = this.unifiedInjector
            .getMulti(SlotDecorator)
            .pipe(shareReplay(1));
    }
    /**
     * Add dynamic attributes to CMS component element
     * @param element: CMS component element
     * @param renderer
     * @param componentData: component data
     */
    addAttributesToComponent(element, renderer, componentData) {
        (getLastValueSync(this.componentDecorators$) || []).forEach((decorator) => decorator.decorate(element, renderer, componentData));
    }
    /**
     * Add dynamic attributes to CMS slot element
     * @param element: CMS slot element
     * @param renderer
     * @param slotData: slot data
     */
    addAttributesToSlot(element, renderer, slotData) {
        (getLastValueSync(this.slotDecorators$) || []).forEach((decorator) => decorator.decorate(element, renderer, slotData));
    }
}
DynamicAttributeService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: DynamicAttributeService, deps: [{ token: UnifiedInjector }], target: i0.ɵɵFactoryTarget.Injectable });
DynamicAttributeService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: DynamicAttributeService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: DynamicAttributeService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: UnifiedInjector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class GlobalMessageConfig {
}
GlobalMessageConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
GlobalMessageConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var HttpResponseStatus;
(function (HttpResponseStatus) {
    HttpResponseStatus[HttpResponseStatus["UNKNOWN"] = -1] = "UNKNOWN";
    HttpResponseStatus[HttpResponseStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpResponseStatus[HttpResponseStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpResponseStatus[HttpResponseStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpResponseStatus[HttpResponseStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpResponseStatus[HttpResponseStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpResponseStatus[HttpResponseStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpResponseStatus[HttpResponseStatus["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    HttpResponseStatus[HttpResponseStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpResponseStatus || (HttpResponseStatus = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class HttpErrorHandler {
    constructor(globalMessageService, platformId) {
        this.globalMessageService = globalMessageService;
        this.platformId = platformId;
    }
    /**
     * Error handlers are matched by the error `responseStatus` (i.e. 404). On top of the matching status
     * a priority can be added to distinguish multiple handles for the same response status.
     */
    hasMatch(errorResponse) {
        return errorResponse.status === this.responseStatus;
    }
    /**
     * Returns true when invoked on the server (SSR).
     *
     * Added in 3.2, depends on the injected `platformId`.
     */
    isSsr() {
        if (this.platformId) {
            return !isPlatformBrowser(this.platformId);
        }
        return false;
    }
}
HttpErrorHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: HttpErrorHandler, deps: [{ token: GlobalMessageService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
HttpErrorHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: HttpErrorHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: HttpErrorHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: GlobalMessageService }, { type: Object, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class BadGatewayHandler extends HttpErrorHandler {
    constructor() {
        super(...arguments);
        this.responseStatus = HttpResponseStatus.BAD_GATEWAY;
    }
    handleError() {
        this.globalMessageService.add({ key: 'httpHandlers.badGateway' }, GlobalMessageType.MSG_TYPE_ERROR);
    }
    getPriority() {
        return -10 /* Priority.LOW */;
    }
}
BadGatewayHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BadGatewayHandler, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
BadGatewayHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BadGatewayHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BadGatewayHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

const OAUTH_ENDPOINT = '/authorizationserver/oauth/token';
class BadRequestHandler extends HttpErrorHandler {
    constructor() {
        super(...arguments);
        this.responseStatus = HttpResponseStatus.BAD_REQUEST;
    }
    handleError(request, response) {
        this.handleBadPassword(request, response);
        this.handleBadLoginResponse(request, response);
        this.handleValidationError(request, response);
        this.handleGuestDuplicateEmail(request, response);
        this.handleUnknownIdentifierError(request, response);
    }
    handleBadPassword(request, response) {
        var _a, _b, _c;
        if (((_a = response.url) === null || _a === void 0 ? void 0 : _a.includes(OAUTH_ENDPOINT)) &&
            ((_b = response.error) === null || _b === void 0 ? void 0 : _b.error) === 'invalid_grant' &&
            ((_c = request.body) === null || _c === void 0 ? void 0 : _c.get('grant_type')) === 'password') {
            this.globalMessageService.add({
                key: 'httpHandlers.badRequestPleaseLoginAgain',
                params: {
                    errorMessage: response.error.error_description || response.message || '',
                },
            }, GlobalMessageType.MSG_TYPE_ERROR);
            this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_CONFIRMATION);
        }
    }
    handleBadLoginResponse(_request, response) {
        this.getErrors(response)
            .filter((error) => error.type === 'PasswordMismatchError')
            .forEach(() => {
            // Updating email and changing password share same http error occurence.
            // Determine the context of global error message based on request url
            const url = new URL(_request.url);
            const key = url.pathname.endsWith('/password')
                ? 'httpHandlers.badRequestOldPasswordIncorrect'
                : 'httpHandlers.validationErrors.invalid.password';
            this.globalMessageService.add({ key }, GlobalMessageType.MSG_TYPE_ERROR);
        });
    }
    handleValidationError(_request, response) {
        this.getErrors(response)
            .filter((e) => e.type === 'ValidationError')
            .forEach((error) => {
            this.globalMessageService.add({
                key: `httpHandlers.validationErrors.${error.reason}.${error.subject}`,
            }, GlobalMessageType.MSG_TYPE_ERROR);
        });
    }
    handleGuestDuplicateEmail(_request, response) {
        this.getErrors(response)
            .filter((e) => e.type === 'DuplicateUidError')
            .forEach((error) => {
            this.globalMessageService.add({
                key: 'httpHandlers.badRequestGuestDuplicateEmail',
                params: {
                    errorMessage: error.message || '',
                },
            }, GlobalMessageType.MSG_TYPE_ERROR);
        });
    }
    handleUnknownIdentifierError(_request, response) {
        this.getErrors(response)
            .filter((e) => e.type === 'UnknownIdentifierError')
            .forEach((error) => {
            this.globalMessageService.add(error.message
                ? error.message
                : { key: 'httpHandlers.unknownIdentifier' }, GlobalMessageType.MSG_TYPE_ERROR);
        });
    }
    getErrors(response) {
        var _a;
        return (((_a = response.error) === null || _a === void 0 ? void 0 : _a.errors) || []).filter((error) => error.type !== 'JaloObjectNoLongerValidError');
    }
    getPriority() {
        return -10 /* Priority.LOW */;
    }
}
BadRequestHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BadRequestHandler, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
BadRequestHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BadRequestHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BadRequestHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ConflictHandler extends HttpErrorHandler {
    constructor() {
        super(...arguments);
        this.responseStatus = HttpResponseStatus.CONFLICT;
    }
    handleError() {
        this.globalMessageService.add({ key: 'httpHandlers.conflict' }, GlobalMessageType.MSG_TYPE_ERROR);
    }
    getPriority() {
        return -10 /* Priority.LOW */;
    }
}
ConflictHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConflictHandler, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
ConflictHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConflictHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConflictHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

class ForbiddenHandler extends HttpErrorHandler {
    constructor(globalMessageService, authService, occEndpoints) {
        super(globalMessageService);
        this.globalMessageService = globalMessageService;
        this.authService = authService;
        this.occEndpoints = occEndpoints;
        this.responseStatus = HttpResponseStatus.FORBIDDEN;
    }
    handleError(request) {
        if (request.url.endsWith(this.occEndpoints.buildUrl('user', {
            urlParams: { userId: 'current' },
        }))) {
            this.authService.logout();
        }
        this.globalMessageService.add({ key: 'httpHandlers.forbidden' }, GlobalMessageType.MSG_TYPE_ERROR);
    }
    getPriority() {
        return -10 /* Priority.LOW */;
    }
}
ForbiddenHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ForbiddenHandler, deps: [{ token: GlobalMessageService }, { token: AuthService }, { token: OccEndpointsService }], target: i0.ɵɵFactoryTarget.Injectable });
ForbiddenHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ForbiddenHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ForbiddenHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: GlobalMessageService }, { type: AuthService }, { type: OccEndpointsService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class GatewayTimeoutHandler extends HttpErrorHandler {
    constructor() {
        super(...arguments);
        this.responseStatus = HttpResponseStatus.GATEWAY_TIMEOUT;
    }
    handleError() {
        this.globalMessageService.add({ key: 'httpHandlers.gatewayTimeout' }, GlobalMessageType.MSG_TYPE_ERROR);
    }
    getPriority() {
        return -10 /* Priority.LOW */;
    }
}
GatewayTimeoutHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GatewayTimeoutHandler, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
GatewayTimeoutHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GatewayTimeoutHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GatewayTimeoutHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class InternalServerErrorHandler extends HttpErrorHandler {
    constructor() {
        super(...arguments);
        this.responseStatus = HttpResponseStatus.INTERNAL_SERVER_ERROR;
    }
    handleError() {
        this.globalMessageService.add({ key: 'httpHandlers.internalServerError' }, GlobalMessageType.MSG_TYPE_ERROR);
    }
    getPriority() {
        return -10 /* Priority.LOW */;
    }
}
InternalServerErrorHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: InternalServerErrorHandler, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
InternalServerErrorHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: InternalServerErrorHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: InternalServerErrorHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class NotFoundHandler extends HttpErrorHandler {
    constructor() {
        super(...arguments);
        this.responseStatus = HttpResponseStatus.NOT_FOUND;
    }
    handleError() {
        // Intentional empty error handler to avoid we fallabck to the unknown error handler
    }
    getPriority() {
        return -10 /* Priority.LOW */;
    }
}
NotFoundHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NotFoundHandler, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NotFoundHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NotFoundHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NotFoundHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/**
 * Unknown Error Handler works as an fallback, to handle errors that were
 * not handled by any other error handlers
 */
class UnknownErrorHandler extends HttpErrorHandler {
    constructor() {
        super(...arguments);
        this.responseStatus = HttpResponseStatus.UNKNOWN;
    }
    /**
     * hasMatch always returns true, to mach all errors
     */
    hasMatch(_errorResponse) {
        return true;
    }
    handleError(_request, errorResponse) {
        if (isDevMode() || this.isSsr()) {
            console.warn(`An unknown http error occurred\n`, errorResponse.message);
        }
    }
    /**
     * Fallback priority assures that the handler is used as a last resort
     */
    getPriority() {
        return -50 /* Priority.FALLBACK */;
    }
}
UnknownErrorHandler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UnknownErrorHandler, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
UnknownErrorHandler.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UnknownErrorHandler, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UnknownErrorHandler, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class HttpErrorInterceptor {
    constructor(unifiedInjector) {
        this.unifiedInjector = unifiedInjector;
        this.handlers$ = this.unifiedInjector
            .getMulti(HttpErrorHandler)
            .pipe(shareReplay(1));
    }
    intercept(request, next) {
        return next.handle(request).pipe(catchError((response) => {
            if (response instanceof HttpErrorResponse) {
                this.handleErrorResponse(request, response);
            }
            return throwError(response);
        }));
    }
    handleErrorResponse(request, response) {
        const handler = this.getResponseHandler(response);
        if (handler) {
            handler.handleError(request, response);
        }
    }
    /**
     * return the error handler that matches the `HttpResponseStatus` code.
     * If no handler is available, the UNKNOWN handler is returned.
     */
    getResponseHandler(response) {
        var _a;
        return resolveApplicable((_a = getLastValueSync(this.handlers$)) !== null && _a !== void 0 ? _a : [], [
            response,
        ]);
    }
}
HttpErrorInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: HttpErrorInterceptor, deps: [{ token: UnifiedInjector }], target: i0.ɵɵFactoryTarget.Injectable });
HttpErrorInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: HttpErrorInterceptor, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: HttpErrorInterceptor, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: UnifiedInjector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const errorHandlers = [
    {
        provide: HttpErrorHandler,
        useExisting: UnknownErrorHandler,
        multi: true,
    },
    {
        provide: HttpErrorHandler,
        useExisting: BadGatewayHandler,
        multi: true,
    },
    {
        provide: HttpErrorHandler,
        useExisting: BadRequestHandler,
        multi: true,
    },
    {
        provide: HttpErrorHandler,
        useExisting: ConflictHandler,
        multi: true,
    },
    {
        provide: HttpErrorHandler,
        useExisting: ForbiddenHandler,
        multi: true,
    },
    {
        provide: HttpErrorHandler,
        useExisting: GatewayTimeoutHandler,
        multi: true,
    },
    {
        provide: HttpErrorHandler,
        useExisting: InternalServerErrorHandler,
        multi: true,
    },
    {
        provide: HttpErrorHandler,
        useExisting: NotFoundHandler,
        multi: true,
    },
];
const httpErrorInterceptors = [
    {
        provide: HTTP_INTERCEPTORS,
        useExisting: HttpErrorInterceptor,
        multi: true,
    },
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$d = {
    entities: {},
};
function reducer$d(state = initialState$d, action) {
    switch (action.type) {
        case ADD_MESSAGE: {
            const message = action.payload;
            if (state.entities[message.type] === undefined) {
                return Object.assign(Object.assign({}, state), { entities: Object.assign(Object.assign({}, state.entities), { [message.type]: [message.text] }) });
            }
            else {
                const currentMessages = state.entities[message.type];
                return Object.assign(Object.assign({}, state), { entities: Object.assign(Object.assign({}, state.entities), { [message.type]: [...currentMessages, message.text] }) });
            }
        }
        case REMOVE_MESSAGE: {
            const msgType = action.payload.type;
            const msgIndex = action.payload.index;
            if (Object.keys(state.entities).length === 0 ||
                !state.entities[msgType]) {
                return state;
            }
            const messages = [...state.entities[msgType]];
            messages.splice(msgIndex, 1);
            return Object.assign(Object.assign({}, state), { entities: Object.assign(Object.assign({}, state.entities), { [msgType]: messages }) });
        }
        case REMOVE_MESSAGES_BY_TYPE: {
            const entities = Object.assign(Object.assign({}, state.entities), { [action.payload]: [] });
            return Object.assign(Object.assign({}, state), { entities });
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getReducers$3() {
    return reducer$d;
}
const reducerToken$3 = new InjectionToken('GlobalMessageReducers');
const reducerProvider$3 = {
    provide: reducerToken$3,
    useFactory: getReducers$3,
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class GlobalMessageStoreModule {
}
GlobalMessageStoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageStoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
GlobalMessageStoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageStoreModule, imports: [StateModule, i1$2.StoreFeatureModule] });
GlobalMessageStoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageStoreModule, providers: [reducerProvider$3], imports: [StateModule,
        StoreModule.forFeature(GLOBAL_MESSAGE_FEATURE, reducerToken$3)] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageStoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        StateModule,
                        StoreModule.forFeature(GLOBAL_MESSAGE_FEATURE, reducerToken$3),
                    ],
                    providers: [reducerProvider$3],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ObjectComparisonUtils {
    static shallowEqualObjects(objA, objB) {
        if (objA === objB) {
            return true;
        }
        if (!objA || !objB) {
            return false;
        }
        const aKeys = Object.keys(objA);
        const bKeys = Object.keys(objB);
        const aKeysLen = aKeys.length;
        const bKeysLen = bKeys.length;
        if (aKeysLen !== bKeysLen) {
            return false;
        }
        for (let i = 0; i < aKeysLen; i++) {
            const key = aKeys[i];
            if (objA[key] !== objB[key]) {
                return false;
            }
        }
        return true;
    }
    static deepEqualObjects(objA, objB) {
        if (objA === objB) {
            return true; // if both objA and objB are null or undefined and exactly the same
        }
        else if (!(objA instanceof Object) || !(objB instanceof Object)) {
            return false; // if they are not strictly equal, they both need to be Objects
        }
        else if (objA.constructor !== objB.constructor) {
            // they must have the exact same prototype chain, the closest we can do is
            // test their constructor.
            return false;
        }
        else {
            for (const key in objA) {
                if (!objA.hasOwnProperty(key)) {
                    continue; // other properties were tested using objA.constructor === y.constructor
                }
                if (!objB.hasOwnProperty(key)) {
                    return false; // allows to compare objA[ key ] and objB[ key ] when set to undefined
                }
                if (objA[key] === objB[key]) {
                    continue; // if they have the same strict value or identity then they are equal
                }
                if (typeof objA[key] !== 'object') {
                    return false; // Numbers, Strings, Functions, Booleans must be strictly equal
                }
                if (!this.deepEqualObjects(objA[key], objB[key])) {
                    return false;
                }
            }
            for (const key in objB) {
                if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }
    }
    static countOfDeepEqualObjects(obj, arr) {
        return arr.reduce((acc, curr) => {
            if (this.deepEqualObjects(obj, curr)) {
                acc++;
            }
            return acc;
        }, 0);
    }
    static indexOfFirstOccurrence(obj, arr) {
        for (let index = 0; index < arr.length; index++) {
            if (this.deepEqualObjects(arr[index], obj)) {
                return index;
            }
        }
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class GlobalMessageEffect {
    constructor(actions$, store, config, platformId) {
        this.actions$ = actions$;
        this.store = store;
        this.config = config;
        this.platformId = platformId;
        this.removeDuplicated$ = createEffect(() => this.actions$.pipe(ofType(ADD_MESSAGE), pluck('payload'), switchMap((message) => of(message.text).pipe(withLatestFrom(this.store.pipe(select(getGlobalMessageEntitiesByType(message.type)))), filter(([text, messages]) => ObjectComparisonUtils.countOfDeepEqualObjects(text, messages) >
            1), map(([text, messages]) => {
            const index = ObjectComparisonUtils.indexOfFirstOccurrence(text, messages);
            if (index !== undefined) {
                return new RemoveMessage({
                    type: message.type,
                    index,
                });
            }
        }), filter(isNotUndefined)))));
        this.hideAfterDelay$ = createEffect(() => isPlatformBrowser(this.platformId) // we don't want to run this logic when doing SSR
            ? this.actions$.pipe(ofType(ADD_MESSAGE), pluck('payload'), concatMap((message) => {
                var _a;
                const config = (_a = this.config.globalMessages) === null || _a === void 0 ? void 0 : _a[message.type];
                return this.store.pipe(select(getGlobalMessageCountByType(message.type)), take(1), filter((count) => ((config && config.timeout !== undefined) ||
                    message.timeout !== undefined) &&
                    count > 0), delay(message.timeout || (config === null || config === void 0 ? void 0 : config.timeout)), switchMap(() => of(new RemoveMessage({
                    type: message.type,
                    index: 0,
                }))));
            }))
            : // workaround is required due to NGRX mutating a global static
                // observable EMPTY, causing to throw an error if we have
                // effect registered on the same observable twice
                () => EMPTY);
    }
}
GlobalMessageEffect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageEffect, deps: [{ token: i1$4.Actions }, { token: i1$2.Store }, { token: GlobalMessageConfig }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
GlobalMessageEffect.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageEffect });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageEffect, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i1$4.Actions }, { type: i1$2.Store }, { type: GlobalMessageConfig }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultGlobalMessageConfig = {
    globalMessages: {
        [GlobalMessageType.MSG_TYPE_CONFIRMATION]: {
            timeout: 3000,
        },
        [GlobalMessageType.MSG_TYPE_INFO]: {
            timeout: 3000,
        },
        [GlobalMessageType.MSG_TYPE_ERROR]: {
            timeout: 7000,
        },
        [GlobalMessageType.MSG_TYPE_WARNING]: {
            timeout: 7000,
        },
        [GlobalMessageType.MSG_TYPE_ASSISTIVE]: {
            timeout: 7000,
        },
    },
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class GlobalMessageModule {
    static forRoot() {
        return {
            ngModule: GlobalMessageModule,
            providers: [...errorHandlers, ...httpErrorInterceptors],
        };
    }
}
GlobalMessageModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
GlobalMessageModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageModule, imports: [GlobalMessageStoreModule, i1$4.EffectsFeatureModule] });
GlobalMessageModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageModule, providers: [provideDefaultConfig(defaultGlobalMessageConfig)], imports: [GlobalMessageStoreModule,
        EffectsModule.forFeature([GlobalMessageEffect])] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: GlobalMessageModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        GlobalMessageStoreModule,
                        EffectsModule.forFeature([GlobalMessageEffect]),
                    ],
                    providers: [provideDefaultConfig(defaultGlobalMessageConfig)],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class I18nConfig {
}
I18nConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
I18nConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nConfig, providedIn: 'root', useExisting: Config });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nConfig, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useExisting: Config,
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class I18nConfigInitializer {
    constructor(configInit) {
        this.configInit = configInit;
        this.scopes = ['i18n.fallbackLang'];
        this.configFactory = () => this.resolveConfig().toPromise();
    }
    /**
     * Resolves the `fallbackLang` based on the default language from config `context.language` .
     */
    resolveConfig() {
        return this.configInit.getStable('context.language').pipe(map((config) => {
            var _a, _b;
            return ({
                i18n: {
                    // the first language in the array is the default one
                    fallbackLang: (_b = (_a = config === null || config === void 0 ? void 0 : config.context) === null || _a === void 0 ? void 0 : _a.language) === null || _b === void 0 ? void 0 : _b[0],
                },
            });
        }));
    }
}
I18nConfigInitializer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nConfigInitializer, deps: [{ token: ConfigInitializerService }], target: i0.ɵɵFactoryTarget.Injectable });
I18nConfigInitializer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nConfigInitializer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nConfigInitializer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: ConfigInitializerService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
// type CxDatePipe, not DatePipe, due to conflict with Angular's DatePipe - problem occurs for the backward compatibility compiler of Ivy
class CxDatePipe extends DatePipe {
    constructor(language) {
        super('');
        this.language = language;
    }
    transform(value, format, timezone) {
        return super.transform(value, format, timezone, this.getLang());
    }
    getLang() {
        const lang = this.getActiveLang();
        try {
            getLocaleId(lang);
            return lang;
        }
        catch (_a) {
            this.reportMissingLocaleData(lang);
            return 'en';
        }
    }
    getActiveLang() {
        let result = '';
        this.language
            .getActive()
            .subscribe((lang) => (result = lang))
            .unsubscribe();
        return result;
    }
    reportMissingLocaleData(lang) {
        if (isDevMode()) {
            console.warn(`cxDate pipe: No locale data registered for '${lang}' (see https://angular.io/api/common/registerLocaleData).`);
        }
    }
}
CxDatePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CxDatePipe, deps: [{ token: LanguageService }], target: i0.ɵɵFactoryTarget.Pipe });
CxDatePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: CxDatePipe, name: "cxDate" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CxDatePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cxDate' }]
        }], ctorParameters: function () { return [{ type: LanguageService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CxNumericPipe extends DecimalPipe {
    constructor(language) {
        super('');
        this.language = language;
    }
    transform(value, digitsInfo) {
        return super.transform(value, digitsInfo, this.getLang());
    }
    getLang() {
        const lang = this.getActiveLang();
        try {
            getLocaleId(lang);
            return lang;
        }
        catch (_a) {
            this.reportMissingLocaleData(lang);
            return 'en';
        }
    }
    getActiveLang() {
        let result = '';
        this.language
            .getActive()
            .subscribe((lang) => (result = lang))
            .unsubscribe();
        return result;
    }
    reportMissingLocaleData(lang) {
        if (isDevMode()) {
            console.warn(`cxNumeric pipe: No locale data registered for '${lang}' (see https://angular.io/api/common/registerLocaleData).`);
        }
    }
}
CxNumericPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CxNumericPipe, deps: [{ token: LanguageService }], target: i0.ɵɵFactoryTarget.Pipe });
CxNumericPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: CxNumericPipe, name: "cxNumeric" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CxNumericPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cxNumeric' }]
        }], ctorParameters: function () { return [{ type: LanguageService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultI18nConfig = {
    i18n: {
        fallbackLang: undefined,
        debug: false,
    },
};

function i18nextInit(i18next, configInit, languageService, httpClient, serverRequestOrigin, siteContextI18nextSynchronizer) {
    return () => configInit
        .getStable('i18n')
        .pipe(tap((config) => {
        var _a, _b, _c, _d;
        let i18nextConfig = {
            ns: [],
            fallbackLng: (_a = config.i18n) === null || _a === void 0 ? void 0 : _a.fallbackLang,
            debug: (_b = config.i18n) === null || _b === void 0 ? void 0 : _b.debug,
            interpolation: {
                escapeValue: false,
                skipOnVariables: false,
            },
        };
        if ((_d = (_c = config.i18n) === null || _c === void 0 ? void 0 : _c.backend) === null || _d === void 0 ? void 0 : _d.loadPath) {
            i18next = i18next.use(i18nextHttpBackend);
            const loadPath = getLoadPath(config.i18n.backend.loadPath, serverRequestOrigin);
            const backend = {
                loadPath,
                request: i18nextGetHttpClient(httpClient),
                // Disable the periodical reloading. Otherwise SSR would not finish due to the pending task `setInterval()`
                // See source code of `i18next-http-backend` : https://github.com/i18next/i18next-http-backend/blob/00b7e8f67abf8372af17529b51190a7e8b17e3d8/lib/index.js#L40-L41
                reloadInterval: false,
            };
            i18nextConfig = Object.assign(Object.assign({}, i18nextConfig), { backend });
        }
        return i18next.init(i18nextConfig, () => {
            var _a;
            // Don't use i18next's 'resources' config key for adding static translations,
            // because it will disable loading chunks from backend. We add resources here, in the init's callback.
            i18nextAddTranslations(i18next, (_a = config.i18n) === null || _a === void 0 ? void 0 : _a.resources);
            siteContextI18nextSynchronizer.init(i18next, languageService);
        });
    }))
        .toPromise();
}
function i18nextAddTranslations(i18next, resources = {}) {
    Object.keys(resources).forEach((lang) => {
        Object.keys(resources[lang]).forEach((chunkName) => {
            i18next.addResourceBundle(lang, chunkName, resources[lang][chunkName], true, true);
        });
    });
}
class SiteContextI18nextSynchronizer {
    init(i18next, language) {
        var _a;
        // always update language of i18next on site context (language) change
        this.sub =
            (_a = this.sub) !== null && _a !== void 0 ? _a : language.getActive().subscribe((lang) => i18next.changeLanguage(lang));
    }
    ngOnDestroy() {
        var _a;
        (_a = this.sub) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
}
SiteContextI18nextSynchronizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextI18nextSynchronizer, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
SiteContextI18nextSynchronizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextI18nextSynchronizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextI18nextSynchronizer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * Returns a function appropriate for i18next to make http calls for JSON files.
 * See docs for `i18next-http-backend`: https://github.com/i18next/i18next-http-backend#backend-options
 *
 * It uses Angular HttpClient under the hood, so it works in SSR.
 * @param httpClient Angular http client
 */
function i18nextGetHttpClient(httpClient) {
    return (_options, url, _payload, callback) => {
        httpClient.get(url, { responseType: 'text' }).subscribe((data) => callback(null, { status: 200, data }), (error) => callback(error, {
            // a workaround for https://github.com/i18next/i18next-http-backend/issues/82
            data: null,
            status: error.status,
        }));
    };
}
/**
 * Resolves the relative path to the absolute one in SSR, using the server request's origin.
 * It's needed, because Angular Universal doesn't support relative URLs in HttpClient. See Angular issues:
 * - https://github.com/angular/angular/issues/19224
 * - https://github.com/angular/universal/issues/858
 */
function getLoadPath(path, serverRequestOrigin) {
    if (serverRequestOrigin && !path.match(/^http(s)?:\/\//)) {
        if (path.startsWith('/')) {
            path = path.slice(1);
        }
        if (path.startsWith('./')) {
            path = path.slice(2);
        }
        const result = `${serverRequestOrigin}/${path}`;
        return result;
    }
    return path;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * The instance of i18next.
 *
 * Each SSR request gets its own instance of i18next.
 *
 * The reference to the static global instance of `i18next` (`import i18next from 'i18next`)
 * should not be used anywhere else, because otherwise it would be shared in between all SSR requests
 * and can cause concurrency issues.
 */
const I18NEXT_INSTANCE = new InjectionToken('I18NEXT_INSTANCE', {
    providedIn: 'root',
    factory: () => i18next.createInstance(),
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const i18nextProviders = [
    {
        provide: APP_INITIALIZER,
        useFactory: i18nextInit,
        deps: [
            I18NEXT_INSTANCE,
            ConfigInitializerService,
            LanguageService,
            HttpClient,
            [new Optional(), SERVER_REQUEST_ORIGIN],
            SiteContextI18nextSynchronizer,
        ],
        multi: true,
    },
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class TranslationChunkService {
    constructor(config) {
        this.config = config;
        this.duplicates = {};
        this.chunks = {};
        this.KEY_SEPARATOR = '.';
        const chunks = (config.i18n && config.i18n.chunks) || {};
        Object.keys(chunks).forEach((chunk) => {
            chunks[chunk].forEach((key) => {
                if (this.chunks.hasOwnProperty(key)) {
                    if (!this.duplicates[key]) {
                        this.duplicates[key] = [this.chunks[key]];
                    }
                    this.duplicates[key].push(chunk);
                }
                else {
                    this.chunks[key] = chunk;
                }
            });
        });
        if (Object.keys(this.duplicates).length > 0 && isDevMode()) {
            this.warnDuplicates(this.duplicates);
        }
    }
    getChunkNameForKey(key) {
        const mainKey = (key || '').split(this.KEY_SEPARATOR)[0];
        const chunk = this.chunks && this.chunks[mainKey];
        if (!chunk) {
            return mainKey; // fallback to main key as a chunk
        }
        return chunk;
    }
    warnDuplicates(items) {
        const dupes = [];
        Object.keys(items).forEach((key) => {
            dupes.push(`* '${key}' found in chunks: ${items[key].join(', ')}. Used '${this.chunks[key]}.${key}'.`);
        });
        console.warn(`Duplicated keys has been found in the config of i18n chunks:\n${dupes.join('\n')}`);
    }
}
TranslationChunkService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TranslationChunkService, deps: [{ token: I18nConfig }], target: i0.ɵɵFactoryTarget.Injectable });
TranslationChunkService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TranslationChunkService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TranslationChunkService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: I18nConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class I18nextTranslationService {
    constructor(config, translationChunk, 
    // Required param added in 3.0.x as a critical bug fix, not subject to the breaking changes policy
    i18next) {
        this.config = config;
        this.translationChunk = translationChunk;
        this.i18next = i18next;
        this.NON_BREAKING_SPACE = String.fromCharCode(160);
        this.NAMESPACE_SEPARATOR = ':';
    }
    translate(key, options = {}, whitespaceUntilLoaded = false) {
        // If we've already loaded the chunk (or failed to load), we should immediately emit the value
        // (or the fallback value in case the key is missing).
        // Moreover, we SHOULD emit a value (or a fallback value) synchronously (not in a promise/setTimeout).
        // Otherwise, we the will trigger additional deferred change detection in a view that consumes the returned observable,
        // which together with `switchMap` operator may lead to an infinite loop.
        const chunkName = this.translationChunk.getChunkNameForKey(key);
        const namespacedKey = this.getNamespacedKey(key, chunkName);
        return new Observable((subscriber) => {
            const translate = () => {
                if (!this.i18next.isInitialized) {
                    return;
                }
                if (this.i18next.exists(namespacedKey, options)) {
                    subscriber.next(this.i18next.t(namespacedKey, options));
                }
                else {
                    if (whitespaceUntilLoaded) {
                        subscriber.next(this.NON_BREAKING_SPACE);
                    }
                    this.i18next.loadNamespaces(chunkName, () => {
                        if (!this.i18next.exists(namespacedKey, options)) {
                            this.reportMissingKey(key, chunkName);
                            subscriber.next(this.getFallbackValue(namespacedKey));
                        }
                        else {
                            subscriber.next(this.i18next.t(namespacedKey, options));
                        }
                    });
                }
            };
            translate();
            this.i18next.on('languageChanged', translate);
            return () => this.i18next.off('languageChanged', translate);
        });
    }
    loadChunks(chunkNames) {
        return this.i18next.loadNamespaces(chunkNames);
    }
    /**
     * Returns a fallback value in case when the given key is missing
     * @param key
     */
    getFallbackValue(key) {
        return isDevMode() ? `[${key}]` : this.NON_BREAKING_SPACE;
    }
    reportMissingKey(key, chunkName) {
        if (isDevMode()) {
            console.warn(`Translation key missing '${key}' in the chunk '${chunkName}'`);
        }
    }
    getNamespacedKey(key, chunk) {
        return chunk + this.NAMESPACE_SEPARATOR + key;
    }
}
I18nextTranslationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nextTranslationService, deps: [{ token: I18nConfig }, { token: TranslationChunkService }, { token: I18NEXT_INSTANCE }], target: i0.ɵɵFactoryTarget.Injectable });
I18nextTranslationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nextTranslationService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nextTranslationService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () {
        return [{ type: I18nConfig }, { type: TranslationChunkService }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [I18NEXT_INSTANCE]
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class TranslatePipe {
    constructor(service, cd) {
        this.service = service;
        this.cd = cd;
    }
    transform(input, options = {}) {
        var _a;
        if (!input) {
            if (isDevMode()) {
                console.error(`The given input for the cxTranslate pipe (${input}) is invalid and cannot be translated`);
            }
            return '';
        }
        if (input.raw) {
            return (_a = input.raw) !== null && _a !== void 0 ? _a : '';
        }
        const key = typeof input === 'string' ? input : input.key;
        if (typeof input !== 'string') {
            options = Object.assign(Object.assign({}, options), input.params);
        }
        this.translate(key, options);
        return this.translatedValue;
    }
    translate(key, options) {
        if (key !== this.lastKey ||
            !ObjectComparisonUtils.shallowEqualObjects(options, this.lastOptions)) {
            this.lastKey = key;
            this.lastOptions = options;
            if (this.sub) {
                this.sub.unsubscribe();
            }
            this.sub = this.service
                .translate(key, options, true)
                .subscribe((val) => this.markForCheck(val));
        }
    }
    markForCheck(value) {
        this.translatedValue = value;
        this.cd.markForCheck();
    }
    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
TranslatePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TranslatePipe, deps: [{ token: TranslationService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Pipe });
TranslatePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: TranslatePipe, name: "cxTranslate", pure: false });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: TranslatePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cxTranslate', pure: false }]
        }], ctorParameters: function () { return [{ type: TranslationService }, { type: i0.ChangeDetectorRef }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function initI18nConfig(configInitializer, config) {
    var _a;
    /**
     * If `fallbackLang` was already configured statically
     */
    if (((_a = config === null || config === void 0 ? void 0 : config.i18n) === null || _a === void 0 ? void 0 : _a.fallbackLang) !== undefined) {
        return null;
    }
    return configInitializer;
}
class I18nModule {
    static forRoot() {
        return {
            ngModule: I18nModule,
            providers: [
                provideDefaultConfig(defaultI18nConfig),
                { provide: TranslationService, useExisting: I18nextTranslationService },
                ...i18nextProviders,
                {
                    provide: CONFIG_INITIALIZER,
                    useFactory: initI18nConfig,
                    deps: [I18nConfigInitializer, I18nConfig],
                    multi: true,
                },
            ],
        };
    }
}
I18nModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
I18nModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: I18nModule, declarations: [TranslatePipe, CxDatePipe, CxNumericPipe], exports: [TranslatePipe, CxDatePipe, CxNumericPipe] });
I18nModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TranslatePipe, CxDatePipe, CxNumericPipe],
                    exports: [TranslatePipe, CxDatePipe, CxNumericPipe],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function mockTranslate(key, options = {}) {
    const optionsString = Object.keys(options)
        .sort()
        .map((optionName) => `${optionName}:${options[optionName]}`)
        .join(' ');
    return optionsString ? `${key} ${optionsString}` : key;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class MockTranslatePipe {
    transform(input, options = {}) {
        if (input.raw) {
            return input.raw;
        }
        const key = typeof input === 'string' ? input : input.key;
        if (typeof input !== 'string') {
            options = Object.assign(Object.assign({}, options), input.params);
        }
        return mockTranslate(key, options);
    }
}
MockTranslatePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MockTranslatePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
MockTranslatePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: MockTranslatePipe, name: "cxTranslate" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MockTranslatePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cxTranslate' }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class MockTranslationService {
    translate(key, options = {}, _whitespaceUntilLoaded = false) {
        return new Observable((subscriber) => {
            const value = mockTranslate(key, options);
            subscriber.next(value);
            subscriber.complete();
        });
    }
    loadChunks(_chunks) {
        return Promise.resolve();
    }
}
MockTranslationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MockTranslationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MockTranslationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MockTranslationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MockTranslationService, decorators: [{
            type: Injectable
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class MockDatePipe extends DatePipe {
    // Overload to support stricter type check from angular 11 onwards
    transform(value, format, timezone, locale = 'en') {
        return super.transform(value, format, timezone, locale);
    }
}
MockDatePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MockDatePipe, deps: null, target: i0.ɵɵFactoryTarget.Pipe });
MockDatePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: MockDatePipe, name: "cxDate" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MockDatePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'cxDate' }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class I18nTestingModule {
}
I18nTestingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nTestingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
I18nTestingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: I18nTestingModule, declarations: [MockTranslatePipe, MockDatePipe], exports: [MockTranslatePipe, MockDatePipe] });
I18nTestingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nTestingModule, providers: [
        { provide: TranslationService, useClass: MockTranslationService },
    ] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: I18nTestingModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [MockTranslatePipe, MockDatePipe],
                    exports: [MockTranslatePipe, MockDatePipe],
                    providers: [
                        { provide: TranslationService, useClass: MockTranslationService },
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const COST_CENTER_NORMALIZER = new InjectionToken('CostCenterNormalizer');
const COST_CENTERS_NORMALIZER = new InjectionToken('CostCentersListNormalizer');
const COST_CENTER_SERIALIZER = new InjectionToken('CostCenterSerializer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CostCenterModule {
    static forRoot() {
        return {
            ngModule: CostCenterModule,
            providers: [],
        };
    }
}
CostCenterModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CostCenterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CostCenterModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: CostCenterModule });
CostCenterModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CostCenterModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CostCenterModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var Occ;
(function (Occ) {
    /**
     * The page robot information is exposed with 4 string values.
     */
    let PageRobots;
    (function (PageRobots) {
        PageRobots["INDEX_FOLLOW"] = "INDEX_FOLLOW";
        PageRobots["NOINDEX_FOLLOW"] = "NOINDEX_FOLLOW";
        PageRobots["INDEX_NOFOLLOW"] = "INDEX_NOFOLLOW";
        PageRobots["NOINDEX_NOFOLLOW"] = "NOINDEX_NOFOLLOW";
    })(PageRobots = Occ.PageRobots || (Occ.PageRobots = {}));
    /**
     * Possible order entry statuses
     */
    let OrderEntryStatus;
    (function (OrderEntryStatus) {
        OrderEntryStatus["Success"] = "SUCCESS";
        OrderEntryStatus["Info"] = "INFO";
        OrderEntryStatus["Warning"] = "WARNING";
        OrderEntryStatus["Error"] = "ERROR";
    })(OrderEntryStatus = Occ.OrderEntryStatus || (Occ.OrderEntryStatus = {}));
    /**
     * Defines values for PriceType.
     * Possible values include: 'BUY', 'FROM'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: PriceType = <PriceType>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let PriceType;
    (function (PriceType) {
        PriceType["BUY"] = "BUY";
        PriceType["FROM"] = "FROM";
    })(PriceType = Occ.PriceType || (Occ.PriceType = {}));
    /**
     * Defines values for ImageType.
     * Possible values include: 'PRIMARY', 'GALLERY'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: ImageType = <ImageType>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let ImageType;
    (function (ImageType) {
        ImageType["PRIMARY"] = "PRIMARY";
        ImageType["GALLERY"] = "GALLERY";
    })(ImageType = Occ.ImageType || (Occ.ImageType = {}));
    /**
     * Defines values for Fields.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields = <Fields>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields;
    (function (Fields) {
        Fields["BASIC"] = "BASIC";
        Fields["DEFAULT"] = "DEFAULT";
        Fields["FULL"] = "FULL";
    })(Fields = Occ.Fields || (Occ.Fields = {}));
    /**
     * Defines values for Fields1.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields1 = <Fields1>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields1;
    (function (Fields1) {
        Fields1["BASIC"] = "BASIC";
        Fields1["DEFAULT"] = "DEFAULT";
        Fields1["FULL"] = "FULL";
    })(Fields1 = Occ.Fields1 || (Occ.Fields1 = {}));
    /**
     * Defines values for Fields2.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields2 = <Fields2>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields2;
    (function (Fields2) {
        Fields2["BASIC"] = "BASIC";
        Fields2["DEFAULT"] = "DEFAULT";
        Fields2["FULL"] = "FULL";
    })(Fields2 = Occ.Fields2 || (Occ.Fields2 = {}));
    /**
     * Defines values for Fields3.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields3 = <Fields3>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields3;
    (function (Fields3) {
        Fields3["BASIC"] = "BASIC";
        Fields3["DEFAULT"] = "DEFAULT";
        Fields3["FULL"] = "FULL";
    })(Fields3 = Occ.Fields3 || (Occ.Fields3 = {}));
    /**
     * Defines values for Fields4.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields4 = <Fields4>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields4;
    (function (Fields4) {
        Fields4["BASIC"] = "BASIC";
        Fields4["DEFAULT"] = "DEFAULT";
        Fields4["FULL"] = "FULL";
    })(Fields4 = Occ.Fields4 || (Occ.Fields4 = {}));
    /**
     * Defines values for Fields5.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields5 = <Fields5>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields5;
    (function (Fields5) {
        Fields5["BASIC"] = "BASIC";
        Fields5["DEFAULT"] = "DEFAULT";
        Fields5["FULL"] = "FULL";
    })(Fields5 = Occ.Fields5 || (Occ.Fields5 = {}));
    /**
     * Defines values for Fields6.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields6 = <Fields6>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields6;
    (function (Fields6) {
        Fields6["BASIC"] = "BASIC";
        Fields6["DEFAULT"] = "DEFAULT";
        Fields6["FULL"] = "FULL";
    })(Fields6 = Occ.Fields6 || (Occ.Fields6 = {}));
    /**
     * Defines values for PageType.
     * Possible values include: 'ContentPage', 'ProductPage', 'CategoryPage',
     * 'CatalogPage'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: PageType = <PageType>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let PageType;
    (function (PageType) {
        PageType["CONTENT_PAGE"] = "ContentPage";
        PageType["PRODUCT_PAGE"] = "ProductPage";
        PageType["CATEGORY_PAGE"] = "CategoryPage";
        PageType["CATALOG_PAGE"] = "CatalogPage";
    })(PageType = Occ.PageType || (Occ.PageType = {}));
    /**
     * Defines values for Fields7.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields7 = <Fields7>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields7;
    (function (Fields7) {
        Fields7["BASIC"] = "BASIC";
        Fields7["DEFAULT"] = "DEFAULT";
        Fields7["FULL"] = "FULL";
    })(Fields7 = Occ.Fields7 || (Occ.Fields7 = {}));
    /**
     * Defines values for Fields8.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields8 = <Fields8>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields8;
    (function (Fields8) {
        Fields8["BASIC"] = "BASIC";
        Fields8["DEFAULT"] = "DEFAULT";
        Fields8["FULL"] = "FULL";
    })(Fields8 = Occ.Fields8 || (Occ.Fields8 = {}));
    /**
     * Defines values for Fields9.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields9 = <Fields9>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields9;
    (function (Fields9) {
        Fields9["BASIC"] = "BASIC";
        Fields9["DEFAULT"] = "DEFAULT";
        Fields9["FULL"] = "FULL";
    })(Fields9 = Occ.Fields9 || (Occ.Fields9 = {}));
    /**
     * Defines values for Fields10.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields10 = <Fields10>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields10;
    (function (Fields10) {
        Fields10["BASIC"] = "BASIC";
        Fields10["DEFAULT"] = "DEFAULT";
        Fields10["FULL"] = "FULL";
    })(Fields10 = Occ.Fields10 || (Occ.Fields10 = {}));
    /**
     * Defines values for Fields11.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields11 = <Fields11>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields11;
    (function (Fields11) {
        Fields11["BASIC"] = "BASIC";
        Fields11["DEFAULT"] = "DEFAULT";
        Fields11["FULL"] = "FULL";
    })(Fields11 = Occ.Fields11 || (Occ.Fields11 = {}));
    /**
     * Defines values for Fields12.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields12 = <Fields12>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields12;
    (function (Fields12) {
        Fields12["BASIC"] = "BASIC";
        Fields12["DEFAULT"] = "DEFAULT";
        Fields12["FULL"] = "FULL";
    })(Fields12 = Occ.Fields12 || (Occ.Fields12 = {}));
    /**
     * Defines values for Fields13.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields13 = <Fields13>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields13;
    (function (Fields13) {
        Fields13["BASIC"] = "BASIC";
        Fields13["DEFAULT"] = "DEFAULT";
        Fields13["FULL"] = "FULL";
    })(Fields13 = Occ.Fields13 || (Occ.Fields13 = {}));
    /**
     * Defines values for Fields14.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields14 = <Fields14>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields14;
    (function (Fields14) {
        Fields14["BASIC"] = "BASIC";
        Fields14["DEFAULT"] = "DEFAULT";
        Fields14["FULL"] = "FULL";
    })(Fields14 = Occ.Fields14 || (Occ.Fields14 = {}));
    /**
     * Defines values for Fields15.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields15 = <Fields15>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields15;
    (function (Fields15) {
        Fields15["BASIC"] = "BASIC";
        Fields15["DEFAULT"] = "DEFAULT";
        Fields15["FULL"] = "FULL";
    })(Fields15 = Occ.Fields15 || (Occ.Fields15 = {}));
    /**
     * Defines values for Fields16.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields16 = <Fields16>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields16;
    (function (Fields16) {
        Fields16["BASIC"] = "BASIC";
        Fields16["DEFAULT"] = "DEFAULT";
        Fields16["FULL"] = "FULL";
    })(Fields16 = Occ.Fields16 || (Occ.Fields16 = {}));
    /**
     * Defines values for SortEnum.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: SortEnum = <SortEnum>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let SortEnum;
    (function (SortEnum) {
        SortEnum["BASIC"] = "BASIC";
        SortEnum["DEFAULT"] = "DEFAULT";
        SortEnum["FULL"] = "FULL";
    })(SortEnum = Occ.SortEnum || (Occ.SortEnum = {}));
    /**
     * Defines values for Fields17.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields17 = <Fields17>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields17;
    (function (Fields17) {
        Fields17["BASIC"] = "BASIC";
        Fields17["DEFAULT"] = "DEFAULT";
        Fields17["FULL"] = "FULL";
    })(Fields17 = Occ.Fields17 || (Occ.Fields17 = {}));
    /**
     * Defines values for Fields18.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields18 = <Fields18>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields18;
    (function (Fields18) {
        Fields18["BASIC"] = "BASIC";
        Fields18["DEFAULT"] = "DEFAULT";
        Fields18["FULL"] = "FULL";
    })(Fields18 = Occ.Fields18 || (Occ.Fields18 = {}));
    /**
     * Defines values for Fields19.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields19 = <Fields19>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields19;
    (function (Fields19) {
        Fields19["BASIC"] = "BASIC";
        Fields19["DEFAULT"] = "DEFAULT";
        Fields19["FULL"] = "FULL";
    })(Fields19 = Occ.Fields19 || (Occ.Fields19 = {}));
    /**
     * Defines values for Fields20.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields20 = <Fields20>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields20;
    (function (Fields20) {
        Fields20["BASIC"] = "BASIC";
        Fields20["DEFAULT"] = "DEFAULT";
        Fields20["FULL"] = "FULL";
    })(Fields20 = Occ.Fields20 || (Occ.Fields20 = {}));
    /**
     * Defines values for Fields21.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields21 = <Fields21>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields21;
    (function (Fields21) {
        Fields21["BASIC"] = "BASIC";
        Fields21["DEFAULT"] = "DEFAULT";
        Fields21["FULL"] = "FULL";
    })(Fields21 = Occ.Fields21 || (Occ.Fields21 = {}));
    /**
     * Defines values for Fields22.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields22 = <Fields22>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields22;
    (function (Fields22) {
        Fields22["BASIC"] = "BASIC";
        Fields22["DEFAULT"] = "DEFAULT";
        Fields22["FULL"] = "FULL";
    })(Fields22 = Occ.Fields22 || (Occ.Fields22 = {}));
    /**
     * Defines values for Fields23.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields23 = <Fields23>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields23;
    (function (Fields23) {
        Fields23["BASIC"] = "BASIC";
        Fields23["DEFAULT"] = "DEFAULT";
        Fields23["FULL"] = "FULL";
    })(Fields23 = Occ.Fields23 || (Occ.Fields23 = {}));
    /**
     * Defines values for Fields24.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields24 = <Fields24>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields24;
    (function (Fields24) {
        Fields24["BASIC"] = "BASIC";
        Fields24["DEFAULT"] = "DEFAULT";
        Fields24["FULL"] = "FULL";
    })(Fields24 = Occ.Fields24 || (Occ.Fields24 = {}));
    /**
     * Defines values for Fields25.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields25 = <Fields25>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields25;
    (function (Fields25) {
        Fields25["BASIC"] = "BASIC";
        Fields25["DEFAULT"] = "DEFAULT";
        Fields25["FULL"] = "FULL";
    })(Fields25 = Occ.Fields25 || (Occ.Fields25 = {}));
    /**
     * Defines values for Fields26.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields26 = <Fields26>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields26;
    (function (Fields26) {
        Fields26["BASIC"] = "BASIC";
        Fields26["DEFAULT"] = "DEFAULT";
        Fields26["FULL"] = "FULL";
    })(Fields26 = Occ.Fields26 || (Occ.Fields26 = {}));
    /**
     * Defines values for Fields27.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields27 = <Fields27>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields27;
    (function (Fields27) {
        Fields27["BASIC"] = "BASIC";
        Fields27["DEFAULT"] = "DEFAULT";
        Fields27["FULL"] = "FULL";
    })(Fields27 = Occ.Fields27 || (Occ.Fields27 = {}));
    /**
     * Defines values for Fields28.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields28 = <Fields28>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields28;
    (function (Fields28) {
        Fields28["BASIC"] = "BASIC";
        Fields28["DEFAULT"] = "DEFAULT";
        Fields28["FULL"] = "FULL";
    })(Fields28 = Occ.Fields28 || (Occ.Fields28 = {}));
    /**
     * Defines values for Fields29.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields29 = <Fields29>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields29;
    (function (Fields29) {
        Fields29["BASIC"] = "BASIC";
        Fields29["DEFAULT"] = "DEFAULT";
        Fields29["FULL"] = "FULL";
    })(Fields29 = Occ.Fields29 || (Occ.Fields29 = {}));
    /**
     * Defines values for Fields30.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields30 = <Fields30>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields30;
    (function (Fields30) {
        Fields30["BASIC"] = "BASIC";
        Fields30["DEFAULT"] = "DEFAULT";
        Fields30["FULL"] = "FULL";
    })(Fields30 = Occ.Fields30 || (Occ.Fields30 = {}));
    /**
     * Defines values for Fields31.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields31 = <Fields31>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields31;
    (function (Fields31) {
        Fields31["BASIC"] = "BASIC";
        Fields31["DEFAULT"] = "DEFAULT";
        Fields31["FULL"] = "FULL";
    })(Fields31 = Occ.Fields31 || (Occ.Fields31 = {}));
    /**
     * Defines values for Fields32.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields32 = <Fields32>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields32;
    (function (Fields32) {
        Fields32["BASIC"] = "BASIC";
        Fields32["DEFAULT"] = "DEFAULT";
        Fields32["FULL"] = "FULL";
    })(Fields32 = Occ.Fields32 || (Occ.Fields32 = {}));
    /**
     * Defines values for Fields33.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields33 = <Fields33>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields33;
    (function (Fields33) {
        Fields33["BASIC"] = "BASIC";
        Fields33["DEFAULT"] = "DEFAULT";
        Fields33["FULL"] = "FULL";
    })(Fields33 = Occ.Fields33 || (Occ.Fields33 = {}));
    /**
     * Defines values for Fields34.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields34 = <Fields34>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields34;
    (function (Fields34) {
        Fields34["BASIC"] = "BASIC";
        Fields34["DEFAULT"] = "DEFAULT";
        Fields34["FULL"] = "FULL";
    })(Fields34 = Occ.Fields34 || (Occ.Fields34 = {}));
    /**
     * Defines values for Fields35.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields35 = <Fields35>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields35;
    (function (Fields35) {
        Fields35["BASIC"] = "BASIC";
        Fields35["DEFAULT"] = "DEFAULT";
        Fields35["FULL"] = "FULL";
    })(Fields35 = Occ.Fields35 || (Occ.Fields35 = {}));
    /**
     * Defines values for Fields36.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields36 = <Fields36>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields36;
    (function (Fields36) {
        Fields36["BASIC"] = "BASIC";
        Fields36["DEFAULT"] = "DEFAULT";
        Fields36["FULL"] = "FULL";
    })(Fields36 = Occ.Fields36 || (Occ.Fields36 = {}));
    /**
     * Defines values for Fields37.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields37 = <Fields37>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields37;
    (function (Fields37) {
        Fields37["BASIC"] = "BASIC";
        Fields37["DEFAULT"] = "DEFAULT";
        Fields37["FULL"] = "FULL";
    })(Fields37 = Occ.Fields37 || (Occ.Fields37 = {}));
    /**
     * Defines values for Fields38.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields38 = <Fields38>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields38;
    (function (Fields38) {
        Fields38["BASIC"] = "BASIC";
        Fields38["DEFAULT"] = "DEFAULT";
        Fields38["FULL"] = "FULL";
    })(Fields38 = Occ.Fields38 || (Occ.Fields38 = {}));
    /**
     * Defines values for Fields39.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields39 = <Fields39>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields39;
    (function (Fields39) {
        Fields39["BASIC"] = "BASIC";
        Fields39["DEFAULT"] = "DEFAULT";
        Fields39["FULL"] = "FULL";
    })(Fields39 = Occ.Fields39 || (Occ.Fields39 = {}));
    /**
     * Defines values for Fields40.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields40 = <Fields40>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields40;
    (function (Fields40) {
        Fields40["BASIC"] = "BASIC";
        Fields40["DEFAULT"] = "DEFAULT";
        Fields40["FULL"] = "FULL";
    })(Fields40 = Occ.Fields40 || (Occ.Fields40 = {}));
    /**
     * Defines values for Fields41.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields41 = <Fields41>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields41;
    (function (Fields41) {
        Fields41["BASIC"] = "BASIC";
        Fields41["DEFAULT"] = "DEFAULT";
        Fields41["FULL"] = "FULL";
    })(Fields41 = Occ.Fields41 || (Occ.Fields41 = {}));
    /**
     * Defines values for Fields42.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields42 = <Fields42>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields42;
    (function (Fields42) {
        Fields42["BASIC"] = "BASIC";
        Fields42["DEFAULT"] = "DEFAULT";
        Fields42["FULL"] = "FULL";
    })(Fields42 = Occ.Fields42 || (Occ.Fields42 = {}));
    /**
     * Defines values for Fields43.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields43 = <Fields43>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields43;
    (function (Fields43) {
        Fields43["BASIC"] = "BASIC";
        Fields43["DEFAULT"] = "DEFAULT";
        Fields43["FULL"] = "FULL";
    })(Fields43 = Occ.Fields43 || (Occ.Fields43 = {}));
    /**
     * Defines values for Fields44.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields44 = <Fields44>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields44;
    (function (Fields44) {
        Fields44["BASIC"] = "BASIC";
        Fields44["DEFAULT"] = "DEFAULT";
        Fields44["FULL"] = "FULL";
    })(Fields44 = Occ.Fields44 || (Occ.Fields44 = {}));
    /**
     * Defines values for Fields45.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields45 = <Fields45>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields45;
    (function (Fields45) {
        Fields45["BASIC"] = "BASIC";
        Fields45["DEFAULT"] = "DEFAULT";
        Fields45["FULL"] = "FULL";
    })(Fields45 = Occ.Fields45 || (Occ.Fields45 = {}));
    /**
     * Defines values for Fields46.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields46 = <Fields46>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields46;
    (function (Fields46) {
        Fields46["BASIC"] = "BASIC";
        Fields46["DEFAULT"] = "DEFAULT";
        Fields46["FULL"] = "FULL";
    })(Fields46 = Occ.Fields46 || (Occ.Fields46 = {}));
    /**
     * Defines values for Fields47.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields47 = <Fields47>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields47;
    (function (Fields47) {
        Fields47["BASIC"] = "BASIC";
        Fields47["DEFAULT"] = "DEFAULT";
        Fields47["FULL"] = "FULL";
    })(Fields47 = Occ.Fields47 || (Occ.Fields47 = {}));
    /**
     * Defines values for Fields48.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields48 = <Fields48>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields48;
    (function (Fields48) {
        Fields48["BASIC"] = "BASIC";
        Fields48["DEFAULT"] = "DEFAULT";
        Fields48["FULL"] = "FULL";
    })(Fields48 = Occ.Fields48 || (Occ.Fields48 = {}));
    /**
     * Defines values for Fields49.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields49 = <Fields49>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields49;
    (function (Fields49) {
        Fields49["BASIC"] = "BASIC";
        Fields49["DEFAULT"] = "DEFAULT";
        Fields49["FULL"] = "FULL";
    })(Fields49 = Occ.Fields49 || (Occ.Fields49 = {}));
    /**
     * Defines values for Fields50.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields50 = <Fields50>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields50;
    (function (Fields50) {
        Fields50["BASIC"] = "BASIC";
        Fields50["DEFAULT"] = "DEFAULT";
        Fields50["FULL"] = "FULL";
    })(Fields50 = Occ.Fields50 || (Occ.Fields50 = {}));
    /**
     * Defines values for Fields51.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields51 = <Fields51>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields51;
    (function (Fields51) {
        Fields51["BASIC"] = "BASIC";
        Fields51["DEFAULT"] = "DEFAULT";
        Fields51["FULL"] = "FULL";
    })(Fields51 = Occ.Fields51 || (Occ.Fields51 = {}));
    /**
     * Defines values for Fields52.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields52 = <Fields52>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields52;
    (function (Fields52) {
        Fields52["BASIC"] = "BASIC";
        Fields52["DEFAULT"] = "DEFAULT";
        Fields52["FULL"] = "FULL";
    })(Fields52 = Occ.Fields52 || (Occ.Fields52 = {}));
    /**
     * Defines values for Fields53.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields53 = <Fields53>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields53;
    (function (Fields53) {
        Fields53["BASIC"] = "BASIC";
        Fields53["DEFAULT"] = "DEFAULT";
        Fields53["FULL"] = "FULL";
    })(Fields53 = Occ.Fields53 || (Occ.Fields53 = {}));
    /**
     * Defines values for Fields54.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields54 = <Fields54>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields54;
    (function (Fields54) {
        Fields54["BASIC"] = "BASIC";
        Fields54["DEFAULT"] = "DEFAULT";
        Fields54["FULL"] = "FULL";
    })(Fields54 = Occ.Fields54 || (Occ.Fields54 = {}));
    /**
     * Defines values for Fields55.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields55 = <Fields55>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields55;
    (function (Fields55) {
        Fields55["BASIC"] = "BASIC";
        Fields55["DEFAULT"] = "DEFAULT";
        Fields55["FULL"] = "FULL";
    })(Fields55 = Occ.Fields55 || (Occ.Fields55 = {}));
    /**
     * Defines values for Fields56.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields56 = <Fields56>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields56;
    (function (Fields56) {
        Fields56["BASIC"] = "BASIC";
        Fields56["DEFAULT"] = "DEFAULT";
        Fields56["FULL"] = "FULL";
    })(Fields56 = Occ.Fields56 || (Occ.Fields56 = {}));
    /**
     * Defines values for Fields57.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields57 = <Fields57>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields57;
    (function (Fields57) {
        Fields57["BASIC"] = "BASIC";
        Fields57["DEFAULT"] = "DEFAULT";
        Fields57["FULL"] = "FULL";
    })(Fields57 = Occ.Fields57 || (Occ.Fields57 = {}));
    /**
     * Defines values for Fields58.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields58 = <Fields58>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields58;
    (function (Fields58) {
        Fields58["BASIC"] = "BASIC";
        Fields58["DEFAULT"] = "DEFAULT";
        Fields58["FULL"] = "FULL";
    })(Fields58 = Occ.Fields58 || (Occ.Fields58 = {}));
    /**
     * Defines values for Fields59.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields59 = <Fields59>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields59;
    (function (Fields59) {
        Fields59["BASIC"] = "BASIC";
        Fields59["DEFAULT"] = "DEFAULT";
        Fields59["FULL"] = "FULL";
    })(Fields59 = Occ.Fields59 || (Occ.Fields59 = {}));
    /**
     * Defines values for Fields60.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields60 = <Fields60>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields60;
    (function (Fields60) {
        Fields60["BASIC"] = "BASIC";
        Fields60["DEFAULT"] = "DEFAULT";
        Fields60["FULL"] = "FULL";
    })(Fields60 = Occ.Fields60 || (Occ.Fields60 = {}));
    /**
     * Defines values for Fields61.
     * Possible values include: 'BASIC', 'DEFAULT', 'FULL'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Fields61 = <Fields61>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Fields61;
    (function (Fields61) {
        Fields61["BASIC"] = "BASIC";
        Fields61["DEFAULT"] = "DEFAULT";
        Fields61["FULL"] = "FULL";
    })(Fields61 = Occ.Fields61 || (Occ.Fields61 = {}));
    /**
     * Defines values for Type.
     * Possible values include: 'all', 'product', 'order'
     * There could be more values for this enum apart from the ones defined here.If
     * you want to set a value that is not from the known values then you can do
     * the following:
     * let param: Type = <Type>"someUnknownValueThatWillStillBeValid";
     * @readonly
     * @enum {string}
     */
    let Type;
    (function (Type) {
        Type["All"] = "all";
        Type["Product"] = "product";
        Type["Order"] = "order";
    })(Type = Occ.Type || (Occ.Type = {}));
    let CONSENT_STATUS;
    (function (CONSENT_STATUS) {
        CONSENT_STATUS["ANONYMOUS_CONSENT_GIVEN"] = "GIVEN";
        CONSENT_STATUS["ANONYMOUS_CONSENT_WITHDRAWN"] = "WITHDRAWN";
    })(CONSENT_STATUS = Occ.CONSENT_STATUS || (Occ.CONSENT_STATUS = {}));
    let NotificationType;
    (function (NotificationType) {
        NotificationType["BACK_IN_STOCK"] = "BACK_IN_STOCK";
    })(NotificationType = Occ.NotificationType || (Occ.NotificationType = {}));
    let Period;
    (function (Period) {
        Period["DAY"] = "DAY";
        Period["WEEK"] = "WEEK";
        Period["MONTH"] = "MONTH";
        Period["QUARTER"] = "QUARTER";
        Period["YEAR"] = "YEAR";
    })(Period = Occ.Period || (Occ.Period = {}));
    let DaysOfWeek;
    (function (DaysOfWeek) {
        DaysOfWeek["MONDAY"] = "MONDAY";
        DaysOfWeek["TUESDAY"] = "TUESDAY";
        DaysOfWeek["WEDNESDAY"] = "WEDNESDAY";
        DaysOfWeek["THURSDAY"] = "THURSDAY";
        DaysOfWeek["FRIDAY"] = "FRIDAY";
        DaysOfWeek["SATURDAY"] = "SATURDAY";
        DaysOfWeek["SUNDAY"] = "SUNDAY";
    })(DaysOfWeek = Occ.DaysOfWeek || (Occ.DaysOfWeek = {}));
    let OrderApprovalDecisionValue;
    (function (OrderApprovalDecisionValue) {
        OrderApprovalDecisionValue["APPROVE"] = "APPROVE";
        OrderApprovalDecisionValue["REJECT"] = "REJECT";
    })(OrderApprovalDecisionValue = Occ.OrderApprovalDecisionValue || (Occ.OrderApprovalDecisionValue = {}));
})(Occ || (Occ = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccCmsPageNormalizer {
    convert(source, target = {}) {
        this.normalizePageData(source, target);
        this.normalizePageSlotData(source, target);
        this.normalizePageComponentData(source, target);
        this.normalizeComponentData(source, target);
        return target;
    }
    /**
     * Converts the OCC cms page model to the `Page` in the `CmsStructureModel`.
     */
    normalizePageData(source, target) {
        if (!source) {
            return;
        }
        const page = {};
        if (source.name) {
            page.name = source.name;
        }
        if (source.typeCode) {
            page.type = source.typeCode;
        }
        if (source.label) {
            page.label = source.label;
        }
        if (source.template) {
            page.template = source.template;
        }
        if (source.uid) {
            page.pageId = source.uid;
        }
        if (source.title) {
            page.title = source.title;
        }
        if (source.description) {
            page.description = source.description;
        }
        if (source.properties) {
            page.properties = source.properties;
        }
        this.normalizeRobots(source, page);
        target.page = page;
    }
    /**
     * Adds a ContentSlotData for each page slot in the `CmsStructureModel`.
     */
    normalizePageSlotData(source, target) {
        var _a, _b;
        if (!(source === null || source === void 0 ? void 0 : source.contentSlots)) {
            return;
        }
        if (source.contentSlots.contentSlot &&
            !Array.isArray(source.contentSlots.contentSlot)) {
            source.contentSlots.contentSlot = [source.contentSlots.contentSlot];
        }
        target.page = (_a = target.page) !== null && _a !== void 0 ? _a : {};
        target.page.slots = {};
        for (const slot of (_b = source.contentSlots.contentSlot) !== null && _b !== void 0 ? _b : []) {
            if (slot.position) {
                target.page.slots[slot.position] = {};
                if (slot.properties) {
                    target.page.slots[slot.position].properties = slot.properties;
                }
            }
        }
    }
    /**
     * Registers the `ContentSlotComponentData` for each component.
     */
    normalizePageComponentData(source, target) {
        var _a, _b, _c, _d, _e, _f;
        if (!((_a = source === null || source === void 0 ? void 0 : source.contentSlots) === null || _a === void 0 ? void 0 : _a.contentSlot)) {
            return;
        }
        for (const slot of source.contentSlots.contentSlot) {
            if (Array.isArray((_b = slot.components) === null || _b === void 0 ? void 0 : _b.component)) {
                for (const component of (_d = (_c = slot.components) === null || _c === void 0 ? void 0 : _c.component) !== null && _d !== void 0 ? _d : []) {
                    const comp = {
                        uid: component.uid,
                        typeCode: component.typeCode,
                    };
                    if (component.properties) {
                        comp.properties = component.properties;
                    }
                    if (component.typeCode === CMS_FLEX_COMPONENT_TYPE) {
                        comp.flexType = component.flexType;
                    }
                    else if (component.typeCode === JSP_INCLUDE_CMS_COMPONENT_TYPE) {
                        comp.flexType = component.uid;
                    }
                    else {
                        comp.flexType = component.typeCode;
                    }
                    if (slot.position) {
                        let targetSlot = (_f = (_e = target.page) === null || _e === void 0 ? void 0 : _e.slots) === null || _f === void 0 ? void 0 : _f[slot.position];
                        if (targetSlot) {
                            if (!targetSlot.components) {
                                targetSlot.components = [];
                            }
                            targetSlot.components.push(comp);
                        }
                    }
                }
            }
        }
    }
    /**
     * Adds the actual component data whenever available in the CMS page data.
     *
     * If the data is not populated in this payload, it is loaded separately
     * (`OccCmsComponentAdapter`).
     */
    normalizeComponentData(source, target) {
        var _a, _b, _c, _d;
        if (!((_a = source === null || source === void 0 ? void 0 : source.contentSlots) === null || _a === void 0 ? void 0 : _a.contentSlot)) {
            return;
        }
        for (const slot of source.contentSlots.contentSlot) {
            if (Array.isArray((_b = slot.components) === null || _b === void 0 ? void 0 : _b.component)) {
                for (const component of (_d = (_c = slot.components) === null || _c === void 0 ? void 0 : _c.component) !== null && _d !== void 0 ? _d : []) {
                    // while we're hoping to get this right from the backend api,
                    // the OCC api stills seems out of sync with the right model.
                    if (component.modifiedtime) {
                        component.modifiedTime = component.modifiedtime;
                        delete component.modifiedtime;
                    }
                    // we don't put properties into component state
                    if (component.properties) {
                        component.properties = undefined;
                    }
                    if (!target.components) {
                        target.components = [];
                    }
                    target.components.push(component);
                }
            }
        }
    }
    /**
     * Normalizes the page robot string to an array of `PageRobotsMeta` items.
     */
    normalizeRobots(source, target) {
        const robots = [];
        if (source.robotTag) {
            switch (source.robotTag) {
                case Occ.PageRobots.INDEX_FOLLOW:
                    robots.push(PageRobotsMeta.INDEX);
                    robots.push(PageRobotsMeta.FOLLOW);
                    break;
                case Occ.PageRobots.NOINDEX_FOLLOW:
                    robots.push(PageRobotsMeta.NOINDEX);
                    robots.push(PageRobotsMeta.FOLLOW);
                    break;
                case Occ.PageRobots.INDEX_NOFOLLOW:
                    robots.push(PageRobotsMeta.INDEX);
                    robots.push(PageRobotsMeta.NOFOLLOW);
                    break;
                case Occ.PageRobots.NOINDEX_NOFOLLOW:
                    robots.push(PageRobotsMeta.NOINDEX);
                    robots.push(PageRobotsMeta.NOFOLLOW);
                    break;
            }
        }
        target.robots = robots;
    }
}
OccCmsPageNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCmsPageNormalizer, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
OccCmsPageNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCmsPageNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCmsPageNormalizer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ConverterService {
    constructor(unifiedInjector) {
        this.unifiedInjector = unifiedInjector;
        this.subscriptions = new Subscription();
        this.converters = new Map();
        // Clear cached converters when new injectors appear
        const cacheResetLogic = this.unifiedInjector.injectors$.pipe(tap(() => this.converters.clear()));
        this.subscriptions.add(cacheResetLogic.subscribe());
    }
    getConverters(injectionToken) {
        if (!this.converters.has(injectionToken)) {
            const converters = getLastValueSync(this.unifiedInjector.getMulti(injectionToken));
            if (converters) {
                this.converters.set(injectionToken, converters);
            }
        }
        return this.converters.get(injectionToken);
    }
    /**
     * Will return true if converters for specified token were provided
     */
    hasConverters(injectionToken) {
        const converters = this.getConverters(injectionToken);
        return Array.isArray(converters) && converters.length > 0;
    }
    /**
     * Pipeable operator to apply converter logic in a observable stream
     */
    pipeable(injectionToken) {
        if (this.hasConverters(injectionToken)) {
            return map((model) => this.convertSource(model, injectionToken));
        }
        else {
            return (observable) => observable;
        }
    }
    /**
     * Pipeable operator to apply converter logic in a observable stream to collection of items
     */
    pipeableMany(injectionToken) {
        if (this.hasConverters(injectionToken)) {
            return map((model) => this.convertMany(model, injectionToken));
        }
        else {
            return (observable) => observable;
        }
    }
    /**
     * Apply converter logic specified by injection token to source data
     */
    convert(source, injectionToken) {
        if (this.hasConverters(injectionToken)) {
            return this.convertSource(source, injectionToken);
        }
        else {
            return source;
        }
    }
    /**
     * Apply converter logic specified by injection token to a collection
     */
    convertMany(sources, injectionToken) {
        if (this.hasConverters(injectionToken) && Array.isArray(sources)) {
            return sources.map((source) => this.convertSource(source, injectionToken));
        }
        else {
            return sources;
        }
    }
    convertSource(source, injectionToken) {
        var _a;
        return (_a = this.getConverters(injectionToken)) === null || _a === void 0 ? void 0 : _a.reduce((target, converter) => {
            return converter.convert(source, target);
        }, undefined);
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
ConverterService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConverterService, deps: [{ token: UnifiedInjector }], target: i0.ɵɵFactoryTarget.Injectable });
ConverterService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConverterService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConverterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: UnifiedInjector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccCmsComponentAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
        this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    }
    load(id, pageContext) {
        return this.http
            .get(this.getComponentEndPoint(id, pageContext), {
            headers: this.headers,
        })
            .pipe(this.converter.pipeable(CMS_COMPONENT_NORMALIZER));
    }
    findComponentsByIds(ids, pageContext, fields = 'DEFAULT', currentPage = 0, pageSize = ids.length, sort) {
        const requestParams = Object.assign(Object.assign({}, this.getContextParams(pageContext)), this.getPaginationParams(currentPage, pageSize, sort));
        requestParams['componentIds'] = ids.toString();
        return this.http
            .get(this.getComponentsEndpoint(requestParams, fields), {
            headers: this.headers,
        })
            .pipe(pluck('component'), map((components) => components !== null && components !== void 0 ? components : []), this.converter.pipeableMany(CMS_COMPONENT_NORMALIZER));
    }
    getComponentEndPoint(id, pageContext) {
        return this.occEndpoints.buildUrl('component', {
            urlParams: { id },
            queryParams: this.getContextParams(pageContext),
        });
    }
    getComponentsEndpoint(requestParams, fields) {
        return this.occEndpoints.buildUrl('components', {
            queryParams: Object.assign({ fields }, requestParams),
        });
    }
    getPaginationParams(currentPage, pageSize, sort) {
        const requestParams = {};
        if (currentPage !== undefined) {
            requestParams['currentPage'] = currentPage.toString();
        }
        if (pageSize !== undefined) {
            requestParams['pageSize'] = pageSize.toString();
        }
        if (sort !== undefined) {
            requestParams['sort'] = sort;
        }
        return requestParams;
    }
    getContextParams(pageContext) {
        let requestParams = {};
        switch (pageContext.type) {
            case PageType.PRODUCT_PAGE: {
                requestParams = { productCode: pageContext.id };
                break;
            }
            case PageType.CATEGORY_PAGE: {
                requestParams = { categoryCode: pageContext.id };
                break;
            }
            case PageType.CATALOG_PAGE: {
                requestParams = { catalogCode: pageContext.id };
                break;
            }
        }
        return requestParams;
    }
}
OccCmsComponentAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCmsComponentAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccCmsComponentAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCmsComponentAdapter, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCmsComponentAdapter, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccCmsPageAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
        this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    }
    /**
     * @override returns the OCC CMS page data for the given context and converts
     * the data by any configured `CMS_PAGE_NORMALIZER`.
     */
    load(pageContext) {
        const params = this.getPagesRequestParams(pageContext);
        const endpoint = !pageContext.type
            ? this.occEndpoints.buildUrl('page', {
                urlParams: { id: pageContext.id },
            })
            : this.occEndpoints.buildUrl('pages', { queryParams: params });
        return this.http
            .get(endpoint, { headers: this.headers })
            .pipe(this.converter.pipeable(CMS_PAGE_NORMALIZER));
    }
    /**
     * The OCC CMS API allows to query pages by a combination of pageType, label and code.
     *
     * When a `ContentPage` is requested, we use the `pageLabelOrId`:
     *
     * ```
     * "/pages?pageLabelOrId=/my-page&pageType=ContentPage"
     * ```
     *
     * Other pages are queried by code:
     *
     * ```
     * "/pages?code=1234&pageType=ProductPage"
     * ```
     *
     * The page context is ignored for a home page request or in case of a
     * `smartedit-preview` request.
     */
    getPagesRequestParams(context) {
        if (context.id === HOME_PAGE_CONTEXT || context.id === SMART_EDIT_CONTEXT) {
            return {};
        }
        const httpParams = {};
        if (context.type) {
            httpParams.pageType = context.type;
        }
        if (context.type === PageType.CONTENT_PAGE) {
            httpParams.pageLabelOrId = context.id;
        }
        else {
            httpParams.code = context.id;
        }
        return httpParams;
    }
}
OccCmsPageAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCmsPageAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccCmsPageAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCmsPageAdapter, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCmsPageAdapter, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CmsOccModule {
}
CmsOccModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsOccModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CmsOccModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: CmsOccModule, imports: [CommonModule] });
CmsOccModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsOccModule, providers: [
        {
            provide: CmsPageAdapter,
            useExisting: OccCmsPageAdapter,
        },
        {
            provide: CMS_PAGE_NORMALIZER,
            useExisting: OccCmsPageNormalizer,
            multi: true,
        },
        {
            provide: CmsComponentAdapter,
            useExisting: OccCmsComponentAdapter,
        },
    ], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CmsOccModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    providers: [
                        {
                            provide: CmsPageAdapter,
                            useExisting: OccCmsPageAdapter,
                        },
                        {
                            provide: CMS_PAGE_NORMALIZER,
                            useExisting: OccCmsPageNormalizer,
                            multi: true,
                        },
                        {
                            provide: CmsComponentAdapter,
                            useExisting: OccCmsComponentAdapter,
                        },
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Before 1905, the OCC CMS component API required was using POST method
 * to load a (potentially large) number of components. With 1905, the endpoint
 * evaluated to use GET. Switching from POST to GET has been initially implemented
 * with the `legacy` flag, but from version 3.0 onwards, we're moving the
 * implementation to this optional Adapter.
 *
 * If you like to connect to a pre 1905 version, you can provide this adapter for the
 * `CmsComponentAdapter` injection token.
 */
class LegacyOccCmsComponentAdapter extends OccCmsComponentAdapter {
    findComponentsByIds(ids, pageContext, fields = 'DEFAULT', currentPage = 0, pageSize = ids.length, sort) {
        const idList = { idList: ids };
        const requestParams = Object.assign(Object.assign({}, this.getContextParams(pageContext)), this.getPaginationParams(currentPage, pageSize, sort));
        return this.http
            .post(this.getComponentsEndpoint(requestParams, fields), idList, {
            headers: this.headers,
        })
            .pipe(pluck('component'), map((components) => components !== null && components !== void 0 ? components : []), this.converter.pipeableMany(CMS_COMPONENT_NORMALIZER));
    }
}
LegacyOccCmsComponentAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LegacyOccCmsComponentAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
LegacyOccCmsComponentAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LegacyOccCmsComponentAdapter, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LegacyOccCmsComponentAdapter, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccCostCenterNormalizer {
    convert(source, target) {
        if (target === undefined) {
            target = Object.assign({}, source);
        }
        target.active = this.normalizeBoolean(source.active);
        return target;
    }
    /**
     * Returns the boolean value for a string property that is supposed
     * to be of type boolean.
     */
    normalizeBoolean(property) {
        if (property === undefined) {
            return false;
        }
        return typeof property === 'string' ? property === 'true' : property;
    }
}
OccCostCenterNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCostCenterNormalizer, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
OccCostCenterNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCostCenterNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCostCenterNormalizer, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccCostCenterSerializer {
    convert(source, target) {
        if (target === undefined) {
            target = Object.assign({}, source);
        }
        target.activeFlag = source.active;
        delete target.active;
        return target;
    }
}
OccCostCenterSerializer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCostCenterSerializer, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
OccCostCenterSerializer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCostCenterSerializer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCostCenterSerializer, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccCostCenterListNormalizer {
    constructor(converter) {
        this.converter = converter;
    }
    convert(source, target) {
        if (target === undefined) {
            target = Object.assign({}, source);
        }
        target.values = source.costCenters.map((costCenter) => (Object.assign({}, this.converter.convert(costCenter, COST_CENTER_NORMALIZER))));
        return target;
    }
}
OccCostCenterListNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCostCenterListNormalizer, deps: [{ token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccCostCenterListNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCostCenterListNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCostCenterListNormalizer, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultOccCostCentersConfig = {
    backend: {
        occ: {
            endpoints: {
                getActiveCostCenters: '/costcenters?fields=DEFAULT,unit(BASIC,addresses(DEFAULT))',
            },
        },
    },
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CostCenterOccModule {
}
CostCenterOccModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CostCenterOccModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CostCenterOccModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: CostCenterOccModule, imports: [CommonModule, ConfigModule] });
CostCenterOccModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CostCenterOccModule, providers: [
        {
            provide: COST_CENTERS_NORMALIZER,
            useExisting: OccCostCenterListNormalizer,
            multi: true,
        },
        {
            provide: COST_CENTER_NORMALIZER,
            useExisting: OccCostCenterNormalizer,
            multi: true,
        },
        {
            provide: COST_CENTER_SERIALIZER,
            useExisting: OccCostCenterSerializer,
            multi: true,
        },
    ], imports: [CommonModule, ConfigModule.withConfig(defaultOccCostCentersConfig)] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CostCenterOccModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ConfigModule.withConfig(defaultOccCostCentersConfig)],
                    providers: [
                        {
                            provide: COST_CENTERS_NORMALIZER,
                            useExisting: OccCostCenterListNormalizer,
                            multi: true,
                        },
                        {
                            provide: COST_CENTER_NORMALIZER,
                            useExisting: OccCostCenterNormalizer,
                            multi: true,
                        },
                        {
                            provide: COST_CENTER_SERIALIZER,
                            useExisting: OccCostCenterSerializer,
                            multi: true,
                        },
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductImageNormalizer {
    constructor(config) {
        this.config = config;
    }
    convert(source, target) {
        if (target === undefined) {
            target = Object.assign({}, source);
        }
        if (source.images) {
            target.images = this.normalize(source.images);
        }
        return target;
    }
    /**
     * @desc
     * Creates the image structure we'd like to have. Instead of
     * having a single list with all images despite type and format
     * we create a proper structure. With that we can do:
     * - images.primary.thumnail.url
     * - images.GALLERY[0].thumnail.url
     */
    normalize(source) {
        var _a;
        const images = {};
        if (source) {
            for (const image of source) {
                const isList = image.hasOwnProperty('galleryIndex');
                if (image.imageType) {
                    if (!images.hasOwnProperty(image.imageType)) {
                        images[image.imageType] = isList ? [] : {};
                    }
                    let imageContainer;
                    if (isList) {
                        const imageGroups = images[image.imageType];
                        if (!imageGroups[image.galleryIndex]) {
                            imageGroups[image.galleryIndex] = {};
                        }
                        imageContainer = imageGroups[image.galleryIndex];
                    }
                    else {
                        imageContainer = images[image.imageType];
                    }
                    const targetImage = Object.assign({}, image);
                    targetImage.url = this.normalizeImageUrl((_a = targetImage.url) !== null && _a !== void 0 ? _a : '');
                    if (image.format) {
                        imageContainer[image.format] = targetImage;
                    }
                }
            }
        }
        return images;
    }
    /**
     * Traditionally, in an on-prem world, medias and other backend related calls
     * are hosted at the same platform, but in a cloud setup, applications are are
     * typically distributed cross different environments. For media, we use the
     * `backend.media.baseUrl` by default, but fallback to `backend.occ.baseUrl`
     * if none provided.
     */
    normalizeImageUrl(url) {
        var _a, _b, _c, _d;
        if (new RegExp(/^(http|data:image|\/\/)/i).test(url)) {
            return url;
        }
        return ((((_b = (_a = this.config.backend) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.baseUrl) ||
            ((_d = (_c = this.config.backend) === null || _c === void 0 ? void 0 : _c.occ) === null || _d === void 0 ? void 0 : _d.baseUrl) ||
            '') + url);
    }
}
ProductImageNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductImageNormalizer, deps: [{ token: OccConfig }], target: i0.ɵɵFactoryTarget.Injectable });
ProductImageNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductImageNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductImageNormalizer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: OccConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductReferenceNormalizer {
    convert(source, target) {
        if (target === undefined) {
            target = Object.assign({}, source);
        }
        if (source.productReferences) {
            target.productReferences = this.normalize(source.productReferences);
        }
        return target;
    }
    /**
     * @desc
     * Creates the reference structure we'd like to have. Instead of
     * having a single list with all references we create a proper structure.
     * With that we have a semantic API for the clients
     * - product.references.SIMILAR[0].code
     */
    normalize(source) {
        const references = {};
        if (source) {
            for (const reference of source) {
                if (reference.referenceType) {
                    if (!references.hasOwnProperty(reference.referenceType)) {
                        references[reference.referenceType] = [];
                    }
                    references[reference.referenceType].push(reference);
                }
            }
        }
        return references;
    }
}
ProductReferenceNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferenceNormalizer, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ProductReferenceNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferenceNormalizer });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferenceNormalizer, decorators: [{
            type: Injectable
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PRODUCT_NORMALIZER = new InjectionToken('ProductNormalizer');

class OccProductSearchPageNormalizer {
    constructor(converterService) {
        this.converterService = converterService;
        /**
         * Specifies the minimal number of top values in case
         * non have been setup by the business.
         */
        this.DEFAULT_TOP_VALUES = 6;
    }
    convert(source, target = {}) {
        target = Object.assign(Object.assign({}, target), source);
        this.normalizeFacets(target);
        if (source.products) {
            target.products = source.products.map((product) => this.converterService.convert(product, PRODUCT_NORMALIZER));
        }
        return target;
    }
    normalizeFacets(target) {
        this.normalizeFacetValues(target);
        this.normalizeUselessFacets(target);
    }
    /**
     * The (current) backend returns facets with values that do not contribute
     * to the facet navigation much, as the number in the result list will not get
     * behavior, see https://jira.hybris.com/browse/CS-427.
     *
     * As long as this is not in place, we manually filter the facet from the list;
     * any facet that does not have a count < the total results will be dropped from
     * the facets.
     */
    normalizeUselessFacets(target) {
        if (target.facets) {
            target.facets = target.facets.filter((facet) => {
                return (!target.pagination ||
                    !target.pagination.totalResults ||
                    ((!facet.hasOwnProperty('visible') || facet.visible) &&
                        facet.values &&
                        facet.values.find((value) => {
                            var _a, _b, _c;
                            return (value.selected ||
                                ((_a = value.count) !== null && _a !== void 0 ? _a : 0) < ((_c = (_b = target.pagination) === null || _b === void 0 ? void 0 : _b.totalResults) !== null && _c !== void 0 ? _c : 0));
                        })));
            });
        }
    }
    /*
     * In case there are so-called `topValues` given for the facet values,
     * values are obsolete.
     *
     * `topValues` is a feature in Adaptive Search which can limit a large
     * amount of facet values to a small set (5 by default). As long as the backend
     * provides all facet values AND topValues, we normalize the data to not bother
     * the UI with this specific feature.
     */
    normalizeFacetValues(target) {
        if (target.facets) {
            target.facets = target.facets.map((facetSource) => {
                const { topValues } = facetSource, facetTarget = __rest(facetSource, ["topValues"]);
                facetTarget.topValueCount =
                    topValues && topValues.length > 0
                        ? topValues.length
                        : this.DEFAULT_TOP_VALUES;
                return facetTarget;
            });
        }
    }
}
OccProductSearchPageNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductSearchPageNormalizer, deps: [{ token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccProductSearchPageNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductSearchPageNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductSearchPageNormalizer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccProductReferencesListNormalizer {
    constructor(converter) {
        this.converter = converter;
    }
    convert(source, target = []) {
        if (target === undefined) {
            target = Object.assign({}, source);
        }
        if (source && source.references) {
            target = source.references.map((reference) => (Object.assign(Object.assign({}, reference), { target: this.converter.convert(reference.target, PRODUCT_NORMALIZER) })));
            return target;
        }
        return [];
    }
}
OccProductReferencesListNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductReferencesListNormalizer, deps: [{ token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccProductReferencesListNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductReferencesListNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductReferencesListNormalizer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductNameNormalizer {
    constructor(config) {
        this.config = config;
        /**
         * A pretty url should not have any encoded characters, which is why we replace
         * the following character in the product title.
         *
         * See https://developers.google.com/maps/documentation/urls/url-encoding for more
         * information on the characters.
         */
        this.reservedSlugCharacters = ` !*'();:@&=+$,/?%#[]`;
        this.slugChar = '-';
        // created the regex only once
        this.slugRegex = new RegExp(`[${this.reservedSlugCharacters.split('').join('\\')}]`, 'g');
        this.sanitizeMultipleSlugChars = new RegExp(`${this.slugChar}+`, 'g');
    }
    convert(source, target) {
        target = target !== null && target !== void 0 ? target : Object.assign({}, source);
        if (source.name) {
            target.name = this.normalize(source.name);
            target.slug = this.normalizeSlug(source.name);
            target.nameHtml = source.name;
        }
        return target;
    }
    /**
     * Sanitizes the name so that the name doesn't contain html elements.
     */
    normalize(name) {
        return name.replace(/<[^>]*>/g, '');
    }
    /**
     * Provides a title slug for the pretty URL.
     *
     * The name is sanitized from html, trimmed, converted to lowercase and special characters
     * which are encoded are replaced by the slug char (dash by default).
     */
    normalizeSlug(name) {
        return this.normalize(name)
            .trim()
            .toLowerCase()
            .replace(this.slugRegex, this.slugChar)
            .replace(this.sanitizeMultipleSlugChars, this.slugChar);
    }
}
ProductNameNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductNameNormalizer, deps: [{ token: OccConfig }], target: i0.ɵɵFactoryTarget.Injectable });
ProductNameNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductNameNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductNameNormalizer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: OccConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PRODUCT_REFERENCES_NORMALIZER = new InjectionToken('ProductReferencesListNormalizer');

class OccProductReferencesAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
    }
    load(productCode, referenceType, pageSize) {
        return this.http
            .get(this.getEndpoint(productCode, referenceType, pageSize))
            .pipe(this.converter.pipeable(PRODUCT_REFERENCES_NORMALIZER));
    }
    getEndpoint(code, reference, pageSize) {
        return this.occEndpoints.buildUrl('productReferences', {
            urlParams: { productCode: code },
            queryParams: { referenceType: reference, pageSize },
        });
    }
}
OccProductReferencesAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductReferencesAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccProductReferencesAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductReferencesAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductReferencesAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PRODUCT_REVIEW_NORMALIZER = new InjectionToken('ProductReviewNormalizer');
const PRODUCT_REVIEW_SERIALIZER = new InjectionToken('ProductReviewSerializer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccProductReviewsAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
    }
    load(productCode, maxCount) {
        return this.http
            .get(this.getEndpoint(productCode, maxCount))
            .pipe(pluck('reviews'), map((reviews) => reviews !== null && reviews !== void 0 ? reviews : []), this.converter.pipeableMany(PRODUCT_REVIEW_NORMALIZER));
    }
    post(productCode, review) {
        review = this.converter.convert(review, PRODUCT_REVIEW_SERIALIZER);
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });
        const body = new URLSearchParams();
        body.append('headline', review.headline);
        body.append('comment', review.comment);
        body.append('rating', review.rating.toString());
        body.append('alias', review.alias);
        return this.http.post(this.getEndpoint(productCode), body.toString(), {
            headers,
        });
    }
    getEndpoint(code, maxCount) {
        return this.occEndpoints.buildUrl('productReviews', {
            urlParams: { productCode: code },
            queryParams: { maxCount },
        });
    }
}
OccProductReviewsAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductReviewsAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccProductReviewsAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductReviewsAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductReviewsAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PRODUCT_SEARCH_PAGE_NORMALIZER = new InjectionToken('ProductSearchPageNormalizer');
const PRODUCT_SUGGESTION_NORMALIZER = new InjectionToken('ProductSuggestionNormalizer');

const DEFAULT_SEARCH_CONFIG = {
    pageSize: 20,
};
class OccProductSearchAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
    }
    search(query, searchConfig = DEFAULT_SEARCH_CONFIG) {
        return this.http
            .get(this.getSearchEndpoint(query, searchConfig))
            .pipe(this.converter.pipeable(PRODUCT_SEARCH_PAGE_NORMALIZER));
    }
    loadSuggestions(term, pageSize = 3) {
        return this.http
            .get(this.getSuggestionEndpoint(term, pageSize.toString()))
            .pipe(pluck('suggestions'), map((suggestions) => suggestions !== null && suggestions !== void 0 ? suggestions : []), this.converter.pipeableMany(PRODUCT_SUGGESTION_NORMALIZER));
    }
    getSearchEndpoint(query, searchConfig) {
        return this.occEndpoints.buildUrl('productSearch', {
            queryParams: Object.assign({ query }, searchConfig),
        });
    }
    getSuggestionEndpoint(term, max) {
        return this.occEndpoints.buildUrl('productSuggestions', {
            queryParams: { term, max },
        });
    }
}
OccProductSearchAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductSearchAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccProductSearchAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductSearchAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductSearchAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Merge occ fields parameters
 *
 * @param fields Fields definition as string or object
 */
function mergeFields(fields) {
    const parsedFields = fields.map((f) => typeof f === 'string' ? parseFields(f) : f);
    const mergedFields = optimizeFields(deepMerge({}, ...parsedFields));
    return stringifyFields(mergedFields);
}
/**
 * Optimize fields definition by removing not needed groups
 *
 * @param fields
 */
function optimizeFields(fields = {}) {
    const keys = Object.keys(fields);
    if (keys.includes('FULL')) {
        delete fields['DEFAULT'];
        delete fields['BASIC'];
    }
    else if (keys.includes('DEFAULT')) {
        delete fields['BASIC'];
    }
    Object.keys(fields).forEach((key) => {
        fields[key] = optimizeFields(fields[key]);
    });
    return fields;
}
/**
 * Parse string field definition to an AST object
 *
 * @param fields Fields string definition
 * @param startIndex Used for recurrence
 */
function parseFields(fields, startIndex = 0) {
    const parsedFields = {};
    let i = startIndex;
    while (i < fields.length) {
        if (fields[i] === ',') {
            if (i > startIndex) {
                parsedFields[fields.substr(startIndex, i - startIndex)] = {};
            }
            startIndex = i + 1;
        }
        else if (fields[i] === '(') {
            const subFields = parseFields(fields, i + 1);
            if (Array.isArray(subFields)) {
                parsedFields[fields.substr(startIndex, i - startIndex)] = subFields[0];
                startIndex = subFields[1];
                i = startIndex - 1;
            }
            else {
                return parsedFields;
            }
        }
        else if (fields[i] === ')') {
            if (i > startIndex) {
                parsedFields[fields.substr(startIndex, i - startIndex)] = {};
            }
            return [parsedFields, i + 1];
        }
        i++;
    }
    if (startIndex < fields.length) {
        parsedFields[fields.substr(startIndex, i - startIndex)] = {};
    }
    return parsedFields;
}
/**
 * Convert AST object fields definition to string representation
 *
 * @param fields
 */
function stringifyFields(fields) {
    return Object.keys(fields)
        .map((key) => {
        const subFields = stringifyFields(fields[key]);
        return subFields ? `${key}(${subFields})` : key;
    })
        .join(',');
}
/**
 * Extract part of the object described by fields definition
 *
 * @param data
 * @param fields
 */
function extractFields(data, fields) {
    const parsedFields = typeof fields === 'string' ? parseFields(fields) : fields;
    return getObjectPart(data, parsedFields);
}
function getObjectPart(data, fields) {
    if (!isObject(data)) {
        return data;
    }
    const keys = Object.keys(fields);
    if (keys.length === 0 ||
        // we should not extract parts of the object with ambiguous fields definitions
        keys.find((el) => el === 'BASIC' || el === 'DEFAULT' || el === 'FULL')) {
        return data;
    }
    const result = {};
    keys.forEach((key) => {
        if (data.hasOwnProperty(key)) {
            result[key] = getObjectPart(data[key], fields[key]);
        }
    });
    return result;
}

/**
 * Helper service for optimizing endpoint calls to occ backend
 */
class OccFieldsService {
    constructor(http) {
        this.http = http;
        this.FIELDS_PARAM = 'fields';
    }
    /**
     * Merge similar occ endpoints calls by merging fields parameter
     *
     * We assume that different scopes are defined by different fields parameters,
     * so we are grouping all requests with the same urls (except fields definition)
     * and merging into one request with fields that will satisfy all separate ones.
     *
     * @param models
     */
    getOptimalUrlGroups(models) {
        var _a;
        const groupedByUrls = {};
        for (const model of models) {
            const [urlPart, fields] = this.splitFields((_a = model.url) !== null && _a !== void 0 ? _a : '');
            if (!groupedByUrls[urlPart]) {
                groupedByUrls[urlPart] = {};
            }
            model.fields = fields ? parseFields(fields) : {};
            if (model.scopedData.scope !== undefined) {
                groupedByUrls[urlPart][model.scopedData.scope] = model;
            }
        }
        const mergedUrls = {};
        for (const [url, group] of Object.entries(groupedByUrls)) {
            const urlWithFields = this.getUrlWithFields(url, Object.values(group).map((lo) => lo.fields));
            mergedUrls[urlWithFields] = group;
        }
        return mergedUrls;
    }
    /**
     * Extract fields parameter from occ endpoint url
     *
     * @param urlWithFields
     */
    splitFields(urlWithFields) {
        const [url, params] = urlWithFields.split('?');
        const paramsMap = {};
        if (params) {
            params.split('&').forEach((param) => {
                const keyValue = param.split('=');
                paramsMap[keyValue[0]] = keyValue[1];
            });
        }
        const nonFieldsParams = Object.keys(paramsMap)
            .sort()
            .reduce((id, par) => {
            if (par !== this.FIELDS_PARAM) {
                id.push(paramsMap[par] ? `${par}=${paramsMap[par]}` : par);
            }
            return id;
        }, []);
        const nonFields = nonFieldsParams.join('&');
        return [
            nonFields ? `${url}?${nonFields}` : url,
            paramsMap[this.FIELDS_PARAM],
        ];
    }
    /**
     * Combine url with field parameters
     *
     * @param url
     * @param fields
     */
    getUrlWithFields(url, fields) {
        const mergedFields = mergeFields(fields);
        if (mergedFields) {
            url += url.includes('?') ? '&' : '?';
            url += `${this.FIELDS_PARAM}=${mergedFields}`;
        }
        return url;
    }
}
OccFieldsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccFieldsService, deps: [{ token: i1$3.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable });
OccFieldsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccFieldsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccFieldsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }]; } });

class OccRequestsOptimizerService {
    constructor(http, occFields) {
        this.http = http;
        this.occFields = occFields;
    }
    /**
     * Optimize occ endpoint calls merging requests to the same url by merging field parameters
     *
     * @param scopedDataWithUrls
     * @param dataFactory
     */
    scopedDataLoad(scopedDataWithUrls, dataFactory) {
        const result = [];
        if (!dataFactory) {
            dataFactory = (url) => this.http.get(url);
        }
        const mergedUrls = this.occFields.getOptimalUrlGroups(scopedDataWithUrls);
        Object.entries(mergedUrls).forEach(([url, groupedModelsSet]) => {
            const groupedModels = Object.values(groupedModelsSet);
            if (groupedModels.length === 1) {
                // only one scope for url, we can pass the data straightaway
                result.push(Object.assign(Object.assign({}, groupedModels[0].scopedData), { data$: dataFactory === null || dataFactory === void 0 ? void 0 : dataFactory(url) }));
            }
            else {
                // multiple scopes per url
                // we have to split the model per each scope
                const data$ = dataFactory === null || dataFactory === void 0 ? void 0 : dataFactory(url).pipe(shareReplay(1));
                groupedModels.forEach((modelData) => {
                    result.push(Object.assign(Object.assign({}, modelData.scopedData), { data$: data$ === null || data$ === void 0 ? void 0 : data$.pipe(map((data) => extractFields(data, modelData.fields))) }));
                });
            }
        });
        return result;
    }
}
OccRequestsOptimizerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccRequestsOptimizerService, deps: [{ token: i1$3.HttpClient }, { token: OccFieldsService }], target: i0.ɵɵFactoryTarget.Injectable });
OccRequestsOptimizerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccRequestsOptimizerService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccRequestsOptimizerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccFieldsService }]; } });

class OccProductAdapter {
    constructor(http, occEndpoints, converter, requestsOptimizer) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
        this.requestsOptimizer = requestsOptimizer;
    }
    load(productCode, scope) {
        return this.http
            .get(this.getEndpoint(productCode, scope))
            .pipe(this.converter.pipeable(PRODUCT_NORMALIZER));
    }
    loadMany(products) {
        const scopedDataWithUrls = products.map((model) => ({
            scopedData: model,
            url: this.getEndpoint(model.code, model.scope),
        }));
        return this.requestsOptimizer
            .scopedDataLoad(scopedDataWithUrls)
            .map((scopedProduct) => {
            var _a;
            return (Object.assign(Object.assign({}, scopedProduct), { data$: (_a = scopedProduct.data$) === null || _a === void 0 ? void 0 : _a.pipe(this.converter.pipeable(PRODUCT_NORMALIZER)) }));
        });
    }
    getEndpoint(code, scope) {
        return this.occEndpoints.buildUrl('product', {
            urlParams: { productCode: code },
            scope,
        });
    }
}
OccProductAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }, { token: OccRequestsOptimizerService }], target: i0.ɵɵFactoryTarget.Injectable });
OccProductAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccProductAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }, { type: OccRequestsOptimizerService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductReferencesAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductReviewsAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductSearchAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultOccProductConfig = {
    backend: {
        occ: {
            endpoints: {
                product: {
                    default: 'products/${productCode}?fields=DEFAULT,averageRating,images(FULL),classifications,manufacturer,numberOfReviews,categories(FULL),baseOptions,baseProduct,variantOptions,variantType',
                    list: 'products/${productCode}?fields=code,name,summary,price(formattedValue),images(DEFAULT,galleryIndex),baseProduct',
                    details: 'products/${productCode}?fields=averageRating,stock(DEFAULT),description,availableForPickup,code,url,price(DEFAULT),numberOfReviews,manufacturer,categories(FULL),priceRange,multidimensional,tags,images(FULL)',
                    attributes: 'products/${productCode}?fields=classifications',
                    price: 'products/${productCode}?fields=price(formattedValue)',
                    stock: 'products/${productCode}?fields=stock(DEFAULT)',
                },
                productReviews: 'products/${productCode}/reviews',
                // Uncomment this when occ gets configured
                // productReferences:
                //   'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))&referenceType=${referenceType}',
                productReferences: 'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))',
                /* eslint-disable max-len */
                productSearch: 'products/search?fields=products(code,name,summary,configurable,configuratorType,multidimensional,price(FULL),images(DEFAULT),stock(FULL),averageRating,variantOptions),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch,currentQuery',
                /* eslint-enable */
                productSuggestions: 'products/suggestions',
            },
        },
        loadingScopes: {
            product: {
                details: {
                    include: ["list" /* ProductScope.LIST */, "variants" /* ProductScope.VARIANTS */],
                },
            },
        },
    },
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductOccModule {
}
ProductOccModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductOccModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ProductOccModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ProductOccModule, imports: [CommonModule] });
ProductOccModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductOccModule, providers: [
        provideDefaultConfig(defaultOccProductConfig),
        {
            provide: ProductAdapter,
            useClass: OccProductAdapter,
        },
        {
            provide: PRODUCT_NORMALIZER,
            useExisting: ProductImageNormalizer,
            multi: true,
        },
        {
            provide: PRODUCT_NORMALIZER,
            useExisting: ProductNameNormalizer,
            multi: true,
        },
        {
            provide: ProductReferencesAdapter,
            useClass: OccProductReferencesAdapter,
        },
        {
            provide: PRODUCT_REFERENCES_NORMALIZER,
            useExisting: OccProductReferencesListNormalizer,
            multi: true,
        },
        {
            provide: ProductSearchAdapter,
            useClass: OccProductSearchAdapter,
        },
        {
            provide: PRODUCT_SEARCH_PAGE_NORMALIZER,
            useExisting: OccProductSearchPageNormalizer,
            multi: true,
        },
        {
            provide: ProductReviewsAdapter,
            useClass: OccProductReviewsAdapter,
        },
    ], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductOccModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    providers: [
                        provideDefaultConfig(defaultOccProductConfig),
                        {
                            provide: ProductAdapter,
                            useClass: OccProductAdapter,
                        },
                        {
                            provide: PRODUCT_NORMALIZER,
                            useExisting: ProductImageNormalizer,
                            multi: true,
                        },
                        {
                            provide: PRODUCT_NORMALIZER,
                            useExisting: ProductNameNormalizer,
                            multi: true,
                        },
                        {
                            provide: ProductReferencesAdapter,
                            useClass: OccProductReferencesAdapter,
                        },
                        {
                            provide: PRODUCT_REFERENCES_NORMALIZER,
                            useExisting: OccProductReferencesListNormalizer,
                            multi: true,
                        },
                        {
                            provide: ProductSearchAdapter,
                            useClass: OccProductSearchAdapter,
                        },
                        {
                            provide: PRODUCT_SEARCH_PAGE_NORMALIZER,
                            useExisting: OccProductSearchPageNormalizer,
                            multi: true,
                        },
                        {
                            provide: ProductReviewsAdapter,
                            useClass: OccProductReviewsAdapter,
                        },
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class BaseSiteNormalizer {
    constructor() {
        // Intentional empty constructor
    }
    convert(source, target) {
        var _a;
        if (target === undefined) {
            target = Object.assign({}, source);
        }
        // We take the first store as the base store.
        target.baseStore = (_a = source.stores) === null || _a === void 0 ? void 0 : _a[0];
        delete target.stores;
        return target;
    }
}
BaseSiteNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteNormalizer, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
BaseSiteNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseSiteNormalizer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return []; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

class OccSiteAdapter {
    constructor(http, occEndpointsService, converterService) {
        this.http = http;
        this.occEndpointsService = occEndpointsService;
        this.converterService = converterService;
    }
    loadLanguages() {
        return this.http
            .get(this.occEndpointsService.buildUrl('languages'))
            .pipe(map((languageList) => { var _a; return (_a = languageList.languages) !== null && _a !== void 0 ? _a : []; }), this.converterService.pipeableMany(LANGUAGE_NORMALIZER));
    }
    loadCurrencies() {
        return this.http
            .get(this.occEndpointsService.buildUrl('currencies'))
            .pipe(map((currencyList) => { var _a; return (_a = currencyList.currencies) !== null && _a !== void 0 ? _a : []; }), this.converterService.pipeableMany(CURRENCY_NORMALIZER));
    }
    loadCountries(type) {
        return this.http
            .get(this.occEndpointsService.buildUrl('countries', {
            queryParams: type ? { type } : undefined,
        }))
            .pipe(map((countryList) => { var _a; return (_a = countryList.countries) !== null && _a !== void 0 ? _a : []; }), this.converterService.pipeableMany(COUNTRY_NORMALIZER));
    }
    loadRegions(countryIsoCode) {
        return this.http
            .get(this.occEndpointsService.buildUrl('regions', {
            urlParams: { isoCode: countryIsoCode },
        }))
            .pipe(map((regionList) => { var _a; return (_a = regionList.regions) !== null && _a !== void 0 ? _a : []; }), this.converterService.pipeableMany(REGION_NORMALIZER));
    }
    /**
     * There is no OCC API to load one site based on Uid.
     * So, we have to load all sites, and find the one from the list.
     */
    loadBaseSite(siteUid) {
        if (!siteUid) {
            const baseUrl = this.occEndpointsService.getBaseUrl();
            const urlSplits = baseUrl.split('/');
            siteUid = urlSplits.pop();
        }
        return this.http
            .get(this.occEndpointsService.buildUrl('baseSites', {}, { baseSite: false }))
            .pipe(map((siteList) => {
            return siteList.baseSites.find((site) => site.uid === siteUid);
        }));
    }
    loadBaseSites() {
        return this.http
            .get(this.occEndpointsService.buildUrl('baseSites', {}, { baseSite: false }))
            .pipe(map((baseSiteList) => baseSiteList.baseSites), this.converterService.pipeableMany(BASE_SITE_NORMALIZER));
    }
}
OccSiteAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccSiteAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccSiteAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccSiteAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccSiteAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultOccSiteContextConfig = {
    backend: {
        occ: {
            endpoints: {
                languages: 'languages',
                currencies: 'currencies',
                countries: 'countries',
                regions: 'countries/${isoCode}/regions?fields=regions(name,isocode,isocodeShort)',
                baseSites: 'basesites?fields=baseSites(uid,defaultLanguage(isocode),urlEncodingAttributes,urlPatterns,stores(currencies(isocode),defaultCurrency(isocode),languages(isocode),defaultLanguage(isocode)),theme,defaultPreviewCatalogId,defaultPreviewCategoryCode,defaultPreviewProductCode)',
            },
        },
    },
};

class SiteContextInterceptor {
    constructor(languageService, currencyService, occEndpoints, config) {
        this.languageService = languageService;
        this.currencyService = currencyService;
        this.occEndpoints = occEndpoints;
        this.config = config;
        this.activeLang = getContextParameterDefault(this.config, LANGUAGE_CONTEXT_ID);
        this.activeCurr = getContextParameterDefault(this.config, CURRENCY_CONTEXT_ID);
        this.languageService
            .getActive()
            .subscribe((data) => (this.activeLang = data));
        this.currencyService.getActive().subscribe((data) => {
            this.activeCurr = data;
        });
    }
    intercept(request, next) {
        var _a, _b;
        if (request.url.includes(this.occEndpoints.getBaseUrl())) {
            request = request.clone({
                setParams: {
                    lang: (_a = this.activeLang) !== null && _a !== void 0 ? _a : '',
                    curr: (_b = this.activeCurr) !== null && _b !== void 0 ? _b : '',
                },
            });
        }
        return next.handle(request);
    }
}
SiteContextInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextInterceptor, deps: [{ token: LanguageService }, { token: CurrencyService }, { token: OccEndpointsService }, { token: SiteContextConfig }], target: i0.ɵɵFactoryTarget.Injectable });
SiteContextInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextInterceptor, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextInterceptor, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: LanguageService }, { type: CurrencyService }, { type: OccEndpointsService }, { type: SiteContextConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SiteContextOccModule {
}
SiteContextOccModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextOccModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SiteContextOccModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: SiteContextOccModule, imports: [CommonModule] });
SiteContextOccModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextOccModule, providers: [
        provideDefaultConfig(defaultOccSiteContextConfig),
        {
            provide: SiteAdapter,
            useClass: OccSiteAdapter,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useExisting: SiteContextInterceptor,
            multi: true,
        },
        {
            provide: BASE_SITE_NORMALIZER,
            useExisting: BaseSiteNormalizer,
            multi: true,
        },
    ], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SiteContextOccModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    providers: [
                        provideDefaultConfig(defaultOccSiteContextConfig),
                        {
                            provide: SiteAdapter,
                            useClass: OccSiteAdapter,
                        },
                        {
                            provide: HTTP_INTERCEPTORS,
                            useExisting: SiteContextInterceptor,
                            multi: true,
                        },
                        {
                            provide: BASE_SITE_NORMALIZER,
                            useExisting: BaseSiteNormalizer,
                            multi: true,
                        },
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class AnonymousConsentNormalizer {
    constructor(anonymousConsentsService) {
        this.anonymousConsentsService = anonymousConsentsService;
    }
    convert(source) {
        return this.anonymousConsentsService.decodeAndDeserialize(source);
    }
}
AnonymousConsentNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentNormalizer, deps: [{ token: AnonymousConsentsService }], target: i0.ɵɵFactoryTarget.Injectable });
AnonymousConsentNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: AnonymousConsentNormalizer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: AnonymousConsentsService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccUserInterestsNormalizer {
    constructor(converter) {
        this.converter = converter;
    }
    convert(source, target) {
        if (target === undefined) {
            target = Object.assign({}, source);
        }
        if (source && source.results) {
            target.results = source.results.map((result) => (Object.assign(Object.assign({}, result), { product: this.converter.convert(result.product, PRODUCT_NORMALIZER) })));
        }
        return target;
    }
}
OccUserInterestsNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserInterestsNormalizer, deps: [{ token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccUserInterestsNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserInterestsNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserInterestsNormalizer, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CONSENT_TEMPLATE_NORMALIZER = new InjectionToken('ConsentTemplateNormalizer');

class OccAnonymousConsentTemplatesAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
    }
    loadAnonymousConsentTemplates() {
        const url = this.occEndpoints.buildUrl('anonymousConsentTemplates');
        return this.http.get(url).pipe(catchError((error) => throwError(error)), map((consentList) => { var _a; return (_a = consentList.consentTemplates) !== null && _a !== void 0 ? _a : []; }), this.converter.pipeableMany(CONSENT_TEMPLATE_NORMALIZER));
    }
    loadAnonymousConsents() {
        // using the endpoint that doesn't set caching headers
        const url = this.occEndpoints.buildUrl('anonymousConsentTemplates');
        return this.http
            .head(url, { observe: 'response' })
            .pipe(catchError((error) => throwError(error)), map((response) => { var _a; return (_a = response.headers.get(ANONYMOUS_CONSENTS_HEADER)) !== null && _a !== void 0 ? _a : ''; }), this.converter.pipeable(ANONYMOUS_CONSENT_NORMALIZER));
    }
}
OccAnonymousConsentTemplatesAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccAnonymousConsentTemplatesAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccAnonymousConsentTemplatesAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccAnonymousConsentTemplatesAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccAnonymousConsentTemplatesAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const CUSTOMER_COUPON_SEARCH_RESULT_NORMALIZER = new InjectionToken('CustomerCouponSearchResultNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccCustomerCouponAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
    }
    getCustomerCoupons(userId, pageSize, currentPage, sort) {
        // Currently OCC only supports calls for customer coupons in case of logged users
        if (userId === OCC_USER_ID_ANONYMOUS) {
            return of({});
        }
        const url = this.occEndpoints.buildUrl('customerCoupons', {
            urlParams: { userId },
        });
        let params = new HttpParams().set('sort', sort ? sort : 'startDate:asc');
        if (pageSize) {
            params = params.set('pageSize', pageSize.toString());
        }
        if (currentPage) {
            params = params.set('currentPage', currentPage.toString());
        }
        const headers = this.newHttpHeader();
        return this.http
            .get(url, { headers, params })
            .pipe(this.converter.pipeable(CUSTOMER_COUPON_SEARCH_RESULT_NORMALIZER));
    }
    turnOffNotification(userId, couponCode) {
        const url = this.occEndpoints.buildUrl('couponNotification', {
            urlParams: { userId, couponCode },
        });
        const headers = this.newHttpHeader();
        return this.http.delete(url, { headers });
    }
    turnOnNotification(userId, couponCode) {
        const url = this.occEndpoints.buildUrl('couponNotification', {
            urlParams: { userId, couponCode },
        });
        const headers = this.newHttpHeader();
        return this.http.post(url, { headers });
    }
    claimCustomerCoupon(userId, couponCode) {
        const url = this.occEndpoints.buildUrl('claimCoupon', {
            urlParams: { userId, couponCode },
        });
        const headers = this.newHttpHeader();
        return this.http.post(url, { headers });
    }
    newHttpHeader() {
        return new HttpHeaders({
            'Content-Type': 'application/json',
        });
    }
}
OccCustomerCouponAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCustomerCouponAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccCustomerCouponAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCustomerCouponAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccCustomerCouponAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const ADDRESS_NORMALIZER = new InjectionToken('AddressNormalizer');
const ADDRESS_LIST_NORMALIZER = new InjectionToken('AddressesNormalizer');
const ADDRESS_SERIALIZER = new InjectionToken('AddressSerializer');
const ADDRESS_VALIDATION_NORMALIZER = new InjectionToken('AddressValidationNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccUserAddressAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
    }
    loadAll(userId) {
        const url = this.occEndpoints.buildUrl('addresses', {
            urlParams: { userId },
        });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.get(url, { headers }).pipe(catchError((error) => throwError(error)), map((addressList) => { var _a; return (_a = addressList.addresses) !== null && _a !== void 0 ? _a : []; }), this.converter.pipeableMany(ADDRESS_NORMALIZER));
    }
    add(userId, address) {
        const url = this.occEndpoints.buildUrl('addresses', {
            urlParams: { userId },
        });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        address = this.converter.convert(address, ADDRESS_SERIALIZER);
        return this.http
            .post(url, address, { headers })
            .pipe(catchError((error) => throwError(error)));
    }
    update(userId, addressId, address) {
        const url = this.occEndpoints.buildUrl('addressDetail', {
            urlParams: { userId, addressId },
        });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        address = this.converter.convert(address, ADDRESS_SERIALIZER);
        return this.http
            .patch(url, address, { headers })
            .pipe(catchError((error) => throwError(error)));
    }
    verify(userId, address) {
        const url = this.occEndpoints.buildUrl('addressVerification', {
            urlParams: { userId },
        });
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        if (userId === OCC_USER_ID_ANONYMOUS) {
            headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
        }
        address = this.converter.convert(address, ADDRESS_SERIALIZER);
        return this.http.post(url, address, { headers }).pipe(catchError((error) => throwError(error)), this.converter.pipeable(ADDRESS_VALIDATION_NORMALIZER));
    }
    delete(userId, addressId) {
        const url = this.occEndpoints.buildUrl('addressDetail', {
            urlParams: { userId, addressId },
        });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http
            .delete(url, { headers })
            .pipe(catchError((error) => throwError(error)));
    }
}
OccUserAddressAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserAddressAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccUserAddressAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserAddressAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserAddressAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccUserConsentAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
    }
    loadConsents(userId) {
        const url = this.occEndpoints.buildUrl('consentTemplates', {
            urlParams: { userId },
        });
        const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
        return this.http.get(url, { headers }).pipe(catchError((error) => throwError(error)), map((consentList) => { var _a; return (_a = consentList.consentTemplates) !== null && _a !== void 0 ? _a : []; }), this.converter.pipeableMany(CONSENT_TEMPLATE_NORMALIZER));
    }
    giveConsent(userId, consentTemplateId, consentTemplateVersion) {
        const url = this.occEndpoints.buildUrl('consents', {
            urlParams: { userId },
        });
        const httpParams = new HttpParams()
            .set('consentTemplateId', consentTemplateId)
            .set('consentTemplateVersion', consentTemplateVersion.toString());
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
        });
        return this.http
            .post(url, httpParams, { headers })
            .pipe(catchError((error) => throwError(error)), this.converter.pipeable(CONSENT_TEMPLATE_NORMALIZER));
    }
    withdrawConsent(userId, consentCode) {
        const headers = new HttpHeaders({
            'Cache-Control': 'no-cache',
        });
        const url = this.occEndpoints.buildUrl('consentDetail', {
            urlParams: { userId, consentId: consentCode },
        });
        return this.http.delete(url, { headers });
    }
}
OccUserConsentAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserConsentAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccUserConsentAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserConsentAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserConsentAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PRODUCT_INTERESTS_NORMALIZER = new InjectionToken('ProductInterestsNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const headers$1 = new HttpHeaders({
    'Content-Type': 'application/json',
});
class OccUserInterestsAdapter {
    constructor(http, occEndpoints, config, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.config = config;
        this.converter = converter;
    }
    getInterests(userId, pageSize, currentPage, sort, productCode, notificationType) {
        let params = new HttpParams().set('sort', sort ? sort : 'name:asc');
        if (pageSize) {
            params = params.set('pageSize', pageSize.toString());
        }
        if (currentPage) {
            params = params.set('currentPage', currentPage.toString());
        }
        if (productCode) {
            params = params.set('productCode', productCode);
        }
        if (notificationType) {
            params = params.set('notificationType', notificationType.toString());
        }
        return this.http
            .get(this.occEndpoints.buildUrl('getProductInterests', {
            urlParams: { userId },
        }), {
            headers: headers$1,
            params,
        })
            .pipe(this.converter.pipeable(PRODUCT_INTERESTS_NORMALIZER), catchError((error) => throwError(error)));
    }
    removeInterest(userId, item) {
        var _a;
        const r = [];
        (_a = item.productInterestEntry) === null || _a === void 0 ? void 0 : _a.forEach((entry) => {
            var _a, _b;
            const params = new HttpParams()
                .set('productCode', (_b = (_a = item.product) === null || _a === void 0 ? void 0 : _a.code) !== null && _b !== void 0 ? _b : '')
                .set('notificationType', entry.interestType);
            r.push(this.http
                .delete(this.occEndpoints.buildUrl('productInterests', {
                urlParams: { userId },
            }), {
                params: params,
            })
                .pipe(catchError((error) => throwError(error))));
        });
        return forkJoin(r);
    }
    addInterest(userId, productCode, notificationType) {
        const params = new HttpParams()
            .set('productCode', productCode)
            .set('notificationType', notificationType.toString());
        return this.http
            .post(this.occEndpoints.buildUrl('productInterests', {
            urlParams: { userId },
        }), {}, {
            headers: headers$1,
            params,
        })
            .pipe(catchError((error) => throwError(error)));
    }
}
OccUserInterestsAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserInterestsAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: OccConfig }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccUserInterestsAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserInterestsAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserInterestsAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: OccConfig }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const NOTIFICATION_PREFERENCE_SERIALIZER = new InjectionToken('NotificationPreferenceSerializer');
const NOTIFICATION_PREFERENCE_NORMALIZER = new InjectionToken('NotificationPreferenceNormalizer');

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserNotificationPreferenceAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserNotificationPreferenceConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    loadAll(userId) {
        return this.adapter.loadAll(userId);
    }
    update(userId, preferences) {
        return this.adapter.update(userId, preferences);
    }
}
UserNotificationPreferenceConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserNotificationPreferenceConnector, deps: [{ token: UserNotificationPreferenceAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
UserNotificationPreferenceConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserNotificationPreferenceConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserNotificationPreferenceConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: UserNotificationPreferenceAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
});
class OccUserNotificationPreferenceAdapter {
    constructor(http, converter, occEndpoints) {
        this.http = http;
        this.converter = converter;
        this.occEndpoints = occEndpoints;
    }
    loadAll(userId) {
        return this.http
            .get(this.occEndpoints.buildUrl('notificationPreference', {
            urlParams: { userId },
        }), {
            headers,
        })
            .pipe(map((list) => { var _a; return (_a = list.preferences) !== null && _a !== void 0 ? _a : []; }), this.converter.pipeableMany(NOTIFICATION_PREFERENCE_NORMALIZER), catchError((error) => throwError(error)));
    }
    update(userId, preferences) {
        preferences = this.converter.convert(preferences, NOTIFICATION_PREFERENCE_SERIALIZER);
        return this.http
            .patch(this.occEndpoints.buildUrl('notificationPreference', {
            urlParams: { userId },
        }), { preferences: preferences }, { headers })
            .pipe(catchError((error) => throwError(error)));
    }
}
OccUserNotificationPreferenceAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserNotificationPreferenceAdapter, deps: [{ token: i1$3.HttpClient }, { token: ConverterService }, { token: OccEndpointsService }], target: i0.ɵɵFactoryTarget.Injectable });
OccUserNotificationPreferenceAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserNotificationPreferenceAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserNotificationPreferenceAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: ConverterService }, { type: OccEndpointsService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccUserPaymentAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
    }
    loadAll(userId) {
        const url = this.occEndpoints.buildUrl('paymentDetailsAll', {
            urlParams: { userId },
        }) + '?saved=true';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.get(url, { headers }).pipe(catchError((error) => throwError(error)), map((methodList) => { var _a; return (_a = methodList.payments) !== null && _a !== void 0 ? _a : []; }), this.converter.pipeableMany(PAYMENT_DETAILS_NORMALIZER));
    }
    delete(userId, paymentMethodID) {
        const url = this.occEndpoints.buildUrl('paymentDetail', {
            urlParams: { userId, paymentDetailId: paymentMethodID },
        });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http
            .delete(url, { headers })
            .pipe(catchError((error) => throwError(error)));
    }
    setDefault(userId, paymentMethodID) {
        const url = this.occEndpoints.buildUrl('paymentDetail', {
            urlParams: { userId, paymentDetailId: paymentMethodID },
        });
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http
            .patch(url, 
        // TODO: Remove billingAddress property
        { billingAddress: { titleCode: 'mr' }, defaultPayment: true }, { headers })
            .pipe(catchError((error) => throwError(error)));
    }
}
OccUserPaymentAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserPaymentAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccUserPaymentAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserPaymentAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserPaymentAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserAddressAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserConsentAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserCostCenterAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CustomerCouponAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserInterestsAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserPaymentAdapter {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class OccAddressListNormalizer {
    constructor(converter) {
        this.converter = converter;
    }
    convert(source, target) {
        var _a, _b;
        if (target === undefined) {
            target = Object.assign({}, source);
        }
        target.values =
            (_b = (_a = source.addresses) === null || _a === void 0 ? void 0 : _a.map((address) => (Object.assign({}, this.converter.convert(address, ADDRESS_NORMALIZER))))) !== null && _b !== void 0 ? _b : [];
        return target;
    }
}
OccAddressListNormalizer.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccAddressListNormalizer, deps: [{ token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccAddressListNormalizer.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccAddressListNormalizer, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccAddressListNormalizer, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultOccUserConfig = {
    backend: {
        occ: {
            endpoints: {
                /* eslint-disable max-len */
                paymentDetailsAll: 'users/${userId}/paymentdetails',
                paymentDetail: 'users/${userId}/paymentdetails/${paymentDetailId}',
                anonymousConsentTemplates: 'users/anonymous/consenttemplates',
                consentTemplates: 'users/${userId}/consenttemplates',
                consents: 'users/${userId}/consents',
                consentDetail: 'users/${userId}/consents/${consentId}',
                addresses: 'users/${userId}/addresses',
                addressDetail: 'users/${userId}/addresses/${addressId}',
                addressVerification: 'users/${userId}/addresses/verification',
                customerCoupons: 'users/${userId}/customercoupons',
                claimCoupon: 'users/${userId}/customercoupons/${couponCode}/claim',
                couponNotification: 'users/${userId}/customercoupons/${couponCode}/notification',
                notificationPreference: 'users/${userId}/notificationpreferences',
                productInterests: 'users/${userId}/productinterests',
                getProductInterests: 'users/${userId}/productinterests?fields=sorts,pagination,results(productInterestEntry,product(code))',
            },
        },
    },
};

class OccUserCostCenterAdapter {
    constructor(http, occEndpoints, converter) {
        this.http = http;
        this.occEndpoints = occEndpoints;
        this.converter = converter;
    }
    loadActiveList(userId) {
        return this.http
            .get(this.getCostCentersEndpoint(userId))
            .pipe(this.converter.pipeable(COST_CENTERS_NORMALIZER));
    }
    getCostCentersEndpoint(userId, params) {
        return this.occEndpoints.buildUrl('getActiveCostCenters', {
            urlParams: { userId },
            queryParams: params,
        });
    }
}
OccUserCostCenterAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserCostCenterAdapter, deps: [{ token: i1$3.HttpClient }, { token: OccEndpointsService }, { token: ConverterService }], target: i0.ɵɵFactoryTarget.Injectable });
OccUserCostCenterAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserCostCenterAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: OccUserCostCenterAdapter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$3.HttpClient }, { type: OccEndpointsService }, { type: ConverterService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserOccModule {
}
UserOccModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserOccModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
UserOccModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: UserOccModule, imports: [CommonModule] });
UserOccModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserOccModule, providers: [
        provideDefaultConfig(defaultOccUserConfig),
        { provide: UserAddressAdapter, useClass: OccUserAddressAdapter },
        { provide: UserConsentAdapter, useClass: OccUserConsentAdapter },
        {
            provide: AnonymousConsentTemplatesAdapter,
            useClass: OccAnonymousConsentTemplatesAdapter,
        },
        {
            provide: UserPaymentAdapter,
            useClass: OccUserPaymentAdapter,
        },
        { provide: CustomerCouponAdapter, useClass: OccCustomerCouponAdapter },
        {
            provide: UserNotificationPreferenceAdapter,
            useClass: OccUserNotificationPreferenceAdapter,
        },
        { provide: UserInterestsAdapter, useClass: OccUserInterestsAdapter },
        { provide: UserCostCenterAdapter, useClass: OccUserCostCenterAdapter },
        {
            provide: PRODUCT_INTERESTS_NORMALIZER,
            useExisting: OccUserInterestsNormalizer,
            multi: true,
        },
        {
            provide: ANONYMOUS_CONSENT_NORMALIZER,
            useExisting: AnonymousConsentNormalizer,
            multi: true,
        },
        {
            provide: ADDRESS_LIST_NORMALIZER,
            useExisting: OccAddressListNormalizer,
            multi: true,
        },
    ], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserOccModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    providers: [
                        provideDefaultConfig(defaultOccUserConfig),
                        { provide: UserAddressAdapter, useClass: OccUserAddressAdapter },
                        { provide: UserConsentAdapter, useClass: OccUserConsentAdapter },
                        {
                            provide: AnonymousConsentTemplatesAdapter,
                            useClass: OccAnonymousConsentTemplatesAdapter,
                        },
                        {
                            provide: UserPaymentAdapter,
                            useClass: OccUserPaymentAdapter,
                        },
                        { provide: CustomerCouponAdapter, useClass: OccCustomerCouponAdapter },
                        {
                            provide: UserNotificationPreferenceAdapter,
                            useClass: OccUserNotificationPreferenceAdapter,
                        },
                        { provide: UserInterestsAdapter, useClass: OccUserInterestsAdapter },
                        { provide: UserCostCenterAdapter, useClass: OccUserCostCenterAdapter },
                        {
                            provide: PRODUCT_INTERESTS_NORMALIZER,
                            useExisting: OccUserInterestsNormalizer,
                            multi: true,
                        },
                        {
                            provide: ANONYMOUS_CONSENT_NORMALIZER,
                            useExisting: AnonymousConsentNormalizer,
                            multi: true,
                        },
                        {
                            provide: ADDRESS_LIST_NORMALIZER,
                            useExisting: OccAddressListNormalizer,
                            multi: true,
                        },
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const defaultOccConfig = {
    backend: {
        occ: {
            prefix: '/occ/v2/',
        },
        media: {},
    },
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function occConfigValidator(config) {
    if (config.backend === undefined ||
        config.backend.occ === undefined ||
        config.backend.occ.baseUrl === undefined) {
        return 'Please configure backend.occ.baseUrl before using storefront library!';
    }
}

/**
 * Http interceptor to add cookies to all cross-site requests.
 */
class WithCredentialsInterceptor {
    constructor(config) {
        this.config = config;
    }
    /**
     * Intercepts each request and adds the `withCredential` flag to it
     * if it hasn't been added already.
     */
    intercept(request, next) {
        if (this.requiresWithCredentials(request)) {
            request = request.clone({
                withCredentials: true,
            });
        }
        return next.handle(request);
    }
    /**
     * indicates whether the request should use the WithCredentials flag.
     */
    requiresWithCredentials(request) {
        var _a, _b, _c;
        return (((_a = this.occConfig) === null || _a === void 0 ? void 0 : _a.useWithCredentials) !== undefined &&
            request.url.indexOf((_c = (_b = this.occConfig) === null || _b === void 0 ? void 0 : _b.prefix) !== null && _c !== void 0 ? _c : '') > -1);
    }
    get occConfig() {
        var _a;
        return (_a = this.config.backend) === null || _a === void 0 ? void 0 : _a.occ;
    }
}
WithCredentialsInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: WithCredentialsInterceptor, deps: [{ token: OccConfig }], target: i0.ɵɵFactoryTarget.Injectable });
WithCredentialsInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: WithCredentialsInterceptor, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: WithCredentialsInterceptor, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: OccConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class BaseOccModule {
    static forRoot() {
        return {
            ngModule: BaseOccModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useExisting: WithCredentialsInterceptor,
                    multi: true,
                },
                provideDefaultConfig(defaultOccConfig),
                provideConfigValidator(occConfigValidator),
            ],
        };
    }
}
BaseOccModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseOccModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
BaseOccModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: BaseOccModule, imports: [CmsOccModule, SiteContextOccModule] });
BaseOccModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseOccModule, imports: [CmsOccModule, SiteContextOccModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseOccModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CmsOccModule, SiteContextOccModule],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const OCC_BASE_URL_META_TAG_NAME = 'occ-backend-base-url';
const OCC_BASE_URL_META_TAG_PLACEHOLDER = 'OCC_BACKEND_BASE_URL_VALUE';
const MEDIA_BASE_URL_META_TAG_NAME = 'media-backend-base-url';
const MEDIA_BASE_URL_META_TAG_PLACEHOLDER = 'MEDIA_BACKEND_BASE_URL_VALUE';
function occServerConfigFromMetaTagFactory(meta) {
    const baseUrl = getMetaTagContent(OCC_BASE_URL_META_TAG_NAME, meta);
    return baseUrl && baseUrl !== OCC_BASE_URL_META_TAG_PLACEHOLDER
        ? { backend: { occ: { baseUrl } } }
        : {};
}
function mediaServerConfigFromMetaTagFactory(meta) {
    const baseUrl = getMetaTagContent(MEDIA_BASE_URL_META_TAG_NAME, meta);
    return baseUrl && baseUrl !== MEDIA_BASE_URL_META_TAG_PLACEHOLDER
        ? { backend: { media: { baseUrl } } }
        : {};
}
function getMetaTagContent(name, meta) {
    const metaTag = meta.getTag(`name="${name}"`);
    return metaTag && metaTag.content;
}
function provideConfigFromMetaTags() {
    return [
        provideConfigFactory(occServerConfigFromMetaTagFactory, [Meta]),
        provideConfigFactory(mediaServerConfigFromMetaTagFactory, [Meta]),
    ];
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class MetaTagConfigModule {
    static forRoot() {
        return {
            ngModule: MetaTagConfigModule,
            providers: [...provideConfigFromMetaTags()],
        };
    }
}
MetaTagConfigModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MetaTagConfigModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MetaTagConfigModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: MetaTagConfigModule });
MetaTagConfigModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MetaTagConfigModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: MetaTagConfigModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class LoadingScopesService {
    constructor(config) {
        this.config = config;
    }
    /**
     * Aims to expand scopes based on loading scopes config.
     *
     * I.e. if 'details' scope includes 'list' scope by configuration, it'll return ['details', 'list']
     *
     * If scope data overlaps with each other, the data should be merged in the order of scopes provided,
     * i.e. the last scope is merged last, overwriting parts of the data already provided by preceding scope.
     * It should apply also to implicit scopes (that are included by configuration).
     *
     * @param model
     * @param scopes
     */
    expand(model, scopes) {
        var _a, _b, _c, _d;
        const scopesConfig = (_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.backend) === null || _b === void 0 ? void 0 : _b.loadingScopes) === null || _c === void 0 ? void 0 : _c[model];
        if (scopesConfig) {
            const expandedScopes = [...scopes];
            let i = expandedScopes.length;
            while (i > 0) {
                i--;
                const includedScopes = (_d = scopesConfig[expandedScopes[i]]) === null || _d === void 0 ? void 0 : _d.include;
                if (includedScopes) {
                    for (const includedScope of includedScopes) {
                        if (!expandedScopes.includes(includedScope)) {
                            expandedScopes.splice(i, 0, includedScope);
                            i++;
                        }
                    }
                }
            }
            return expandedScopes;
        }
        return scopes;
    }
    /**
     * Return maxAge for product scope in milliseconds
     *
     * @param model
     * @param scope
     */
    getMaxAge(model, scope) {
        var _a, _b, _c, _d, _e;
        const configuredMaxAge = (_e = (_d = (_c = (_b = (_a = this.config.backend) === null || _a === void 0 ? void 0 : _a.loadingScopes) === null || _b === void 0 ? void 0 : _b[model]) === null || _c === void 0 ? void 0 : _c[scope]) === null || _d === void 0 ? void 0 : _d.maxAge) !== null && _e !== void 0 ? _e : 0;
        return configuredMaxAge * 1000;
    }
    /**
     *
     * Returns the configured triggers for which to reload the product.
     *
     * @param model for which to look up the scopes (usually a 'product')
     * @param scope for which to look up the config
     * @returns the configured triggers, or an empty array if not configured
     */
    getReloadTriggers(model, scope) {
        var _a, _b, _c, _d, _e;
        return (_e = (_d = (_c = (_b = (_a = this.config.backend) === null || _a === void 0 ? void 0 : _a.loadingScopes) === null || _b === void 0 ? void 0 : _b[model]) === null || _c === void 0 ? void 0 : _c[scope]) === null || _d === void 0 ? void 0 : _d.reloadOn) !== null && _e !== void 0 ? _e : [];
    }
}
LoadingScopesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LoadingScopesService, deps: [{ token: OccConfig }], target: i0.ɵɵFactoryTarget.Injectable });
LoadingScopesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LoadingScopesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LoadingScopesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: OccConfig }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getReducers$2() {
    return entityLoaderReducer(PROCESS_FEATURE);
}
const reducerToken$2 = new InjectionToken('ProcessReducers');
const reducerProvider$2 = {
    provide: reducerToken$2,
    useFactory: getReducers$2,
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProcessStoreModule {
}
ProcessStoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProcessStoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ProcessStoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ProcessStoreModule, imports: [StateModule, i1$2.StoreFeatureModule] });
ProcessStoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProcessStoreModule, providers: [reducerProvider$2], imports: [StateModule, StoreModule.forFeature(PROCESS_FEATURE, reducerToken$2)] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProcessStoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [StateModule, StoreModule.forFeature(PROCESS_FEATURE, reducerToken$2)],
                    providers: [reducerProvider$2],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProcessModule {
    static forRoot() {
        return {
            ngModule: ProcessModule,
            providers: [],
        };
    }
}
ProcessModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProcessModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ProcessModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ProcessModule, imports: [ProcessStoreModule] });
ProcessModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProcessModule, imports: [ProcessStoreModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProcessModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ProcessStoreModule],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    get(productCode, scope = '') {
        return this.adapter.load(productCode, scope);
    }
    getMany(products) {
        if (!this.adapter.loadMany) {
            return products.map((product) => (Object.assign(Object.assign({}, product), { data$: this.adapter.load(product.code, product.scope) })));
        }
        return this.adapter.loadMany(products);
    }
}
ProductConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductConnector, deps: [{ token: ProductAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
ProductConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ProductAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductReferencesConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    get(productCode, referenceType, pageSize) {
        return this.adapter.load(productCode, referenceType, pageSize);
    }
}
ProductReferencesConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferencesConnector, deps: [{ token: ProductReferencesAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
ProductReferencesConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferencesConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferencesConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ProductReferencesAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductReviewsConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    get(productCode, maxCount) {
        return this.adapter.load(productCode, maxCount);
    }
    add(productCode, review) {
        return this.adapter.post(productCode, review);
    }
}
ProductReviewsConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReviewsConnector, deps: [{ token: ProductReviewsAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
ProductReviewsConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReviewsConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReviewsConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ProductReviewsAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductSearchConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    search(query, searchConfig) {
        return this.adapter.search(query, searchConfig);
    }
    getSuggestions(term, pageSize) {
        return this.adapter.loadSuggestions(term, pageSize);
    }
}
ProductSearchConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductSearchConnector, deps: [{ token: ProductSearchAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
ProductSearchConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductSearchConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductSearchConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ProductSearchAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Indicates that a user select or unselect a facet value
 */
class FacetChangedEvent extends CxEvent {
}
/**
 * Event's type
 */
FacetChangedEvent.type = 'FacetChangedEvent';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_PRODUCT_REFERENCES = '[Product] Load Product References Data';
const LOAD_PRODUCT_REFERENCES_FAIL = '[Product] Load Product References Data Fail';
const LOAD_PRODUCT_REFERENCES_SUCCESS = '[Product] Load Product References Data Success';
const CLEAN_PRODUCT_REFERENCES = '[Product] Clean Product References';
class LoadProductReferences {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_PRODUCT_REFERENCES;
    }
}
class LoadProductReferencesFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_PRODUCT_REFERENCES_FAIL;
    }
}
class LoadProductReferencesSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_PRODUCT_REFERENCES_SUCCESS;
    }
}
class CleanProductReferences {
    constructor() {
        this.type = CLEAN_PRODUCT_REFERENCES;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_PRODUCT_REVIEWS = '[Product] Load Product Reviews Data';
const LOAD_PRODUCT_REVIEWS_FAIL = '[Product] Load Product Reviews Data Fail';
const LOAD_PRODUCT_REVIEWS_SUCCESS = '[Product] Load Product Reviews Data Success';
const POST_PRODUCT_REVIEW = '[Product] Post Product Review';
const POST_PRODUCT_REVIEW_FAIL = '[Product] Post Product Review Fail';
const POST_PRODUCT_REVIEW_SUCCESS = '[Product] Post Product Review Success';
class LoadProductReviews {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_PRODUCT_REVIEWS;
    }
}
class LoadProductReviewsFail {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_PRODUCT_REVIEWS_FAIL;
    }
}
class LoadProductReviewsSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = LOAD_PRODUCT_REVIEWS_SUCCESS;
    }
}
class PostProductReview {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_PRODUCT_REVIEW;
    }
}
class PostProductReviewFail {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_PRODUCT_REVIEW_FAIL;
    }
}
class PostProductReviewSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = POST_PRODUCT_REVIEW_SUCCESS;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const SEARCH_PRODUCTS = '[Product] Search Products';
const SEARCH_PRODUCTS_FAIL = '[Product] Search Products Fail';
const SEARCH_PRODUCTS_SUCCESS = '[Product] Search Products Success';
const GET_PRODUCT_SUGGESTIONS = '[Product] Get Product Suggestions';
const GET_PRODUCT_SUGGESTIONS_SUCCESS = '[Product] Get Product Suggestions Success';
const GET_PRODUCT_SUGGESTIONS_FAIL = '[Product] Get Product Suggestions Fail';
const CLEAR_PRODUCT_SEARCH_RESULT = '[Product] Clear Product Search Result';
class SearchProducts {
    constructor(payload, auxiliary) {
        this.payload = payload;
        this.auxiliary = auxiliary;
        this.type = SEARCH_PRODUCTS;
    }
}
class SearchProductsFail {
    constructor(payload, auxiliary) {
        this.payload = payload;
        this.auxiliary = auxiliary;
        this.type = SEARCH_PRODUCTS_FAIL;
    }
}
class SearchProductsSuccess {
    constructor(payload, auxiliary) {
        this.payload = payload;
        this.auxiliary = auxiliary;
        this.type = SEARCH_PRODUCTS_SUCCESS;
    }
}
class GetProductSuggestions {
    constructor(payload) {
        this.payload = payload;
        this.type = GET_PRODUCT_SUGGESTIONS;
    }
}
class GetProductSuggestionsSuccess {
    constructor(payload) {
        this.payload = payload;
        this.type = GET_PRODUCT_SUGGESTIONS_SUCCESS;
    }
}
class GetProductSuggestionsFail {
    constructor(payload) {
        this.payload = payload;
        this.type = GET_PRODUCT_SUGGESTIONS_FAIL;
    }
}
class ClearProductSearchResult {
    constructor(payload = {
        clearPageResults: false,
        clearSearchboxResults: false,
    }) {
        this.payload = payload;
        this.type = CLEAR_PRODUCT_SEARCH_RESULT;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var EntityScopedLoaderActions;
(function (EntityScopedLoaderActions) {
    function entityScopedLoadMeta(entityType, id, scope) {
        return Object.assign(Object.assign({}, entityLoadMeta(entityType, id)), { scope });
    }
    EntityScopedLoaderActions.entityScopedLoadMeta = entityScopedLoadMeta;
    function entityScopedFailMeta(entityType, id, scope, error) {
        return Object.assign(Object.assign({}, entityFailMeta(entityType, id, error)), { scope });
    }
    EntityScopedLoaderActions.entityScopedFailMeta = entityScopedFailMeta;
    function entityScopedSuccessMeta(entityType, id, scope) {
        return Object.assign(Object.assign({}, entitySuccessMeta(entityType, id)), { scope });
    }
    EntityScopedLoaderActions.entityScopedSuccessMeta = entityScopedSuccessMeta;
    function entityScopedResetMeta(entityType, id, scope) {
        return Object.assign(Object.assign({}, entityResetMeta(entityType, id)), { scope });
    }
    EntityScopedLoaderActions.entityScopedResetMeta = entityScopedResetMeta;
    class EntityScopedLoadAction {
        constructor(entityType, id, scope) {
            this.type = ENTITY_LOAD_ACTION;
            this.meta = entityScopedLoadMeta(entityType, id, scope);
        }
    }
    EntityScopedLoaderActions.EntityScopedLoadAction = EntityScopedLoadAction;
    class EntityScopedFailAction {
        constructor(entityType, id, scope, error) {
            this.type = ENTITY_FAIL_ACTION;
            this.meta = entityScopedFailMeta(entityType, id, scope, error);
        }
    }
    EntityScopedLoaderActions.EntityScopedFailAction = EntityScopedFailAction;
    class EntityScopedSuccessAction {
        constructor(entityType, id, scope, payload) {
            this.payload = payload;
            this.type = ENTITY_SUCCESS_ACTION;
            this.meta = entityScopedSuccessMeta(entityType, id, scope);
        }
    }
    EntityScopedLoaderActions.EntityScopedSuccessAction = EntityScopedSuccessAction;
    class EntityScopedResetAction {
        constructor(entityType, id, scope) {
            this.type = ENTITY_RESET_ACTION;
            this.meta = entityScopedResetMeta(entityType, id, scope);
        }
    }
    EntityScopedLoaderActions.EntityScopedResetAction = EntityScopedResetAction;
})(EntityScopedLoaderActions || (EntityScopedLoaderActions = {}));

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PRODUCT_FEATURE = 'product';
const PRODUCT_DETAIL_ENTITY = '[Product] Detail Entity';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const LOAD_PRODUCT = '[Product] Load Product Data';
const LOAD_PRODUCT_FAIL = '[Product] Load Product Data Fail';
const LOAD_PRODUCT_SUCCESS = '[Product] Load Product Data Success';
const CLEAR_PRODUCT_PRICE = '[Product] Clear Product PRICE';
class LoadProduct extends EntityScopedLoaderActions.EntityScopedLoadAction {
    constructor(payload, scope = '') {
        super(PRODUCT_DETAIL_ENTITY, payload, scope);
        this.payload = payload;
        this.type = LOAD_PRODUCT;
    }
}
class LoadProductFail extends EntityScopedLoaderActions.EntityScopedFailAction {
    constructor(productCode, payload, scope = '') {
        super(PRODUCT_DETAIL_ENTITY, productCode, scope, payload);
        this.payload = payload;
        this.type = LOAD_PRODUCT_FAIL;
    }
}
class LoadProductSuccess extends EntityScopedLoaderActions.EntityScopedSuccessAction {
    constructor(payload, scope = '') {
        var _a;
        super(PRODUCT_DETAIL_ENTITY, (_a = payload.code) !== null && _a !== void 0 ? _a : '', scope);
        this.payload = payload;
        this.type = LOAD_PRODUCT_SUCCESS;
    }
}
class ClearProductPrice extends EntityScopedLoaderActions.EntityScopedResetAction {
    constructor() {
        super(PRODUCT_DETAIL_ENTITY, undefined, "price" /* ProductScope.PRICE */);
        this.type = CLEAR_PRODUCT_PRICE;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var productGroup_actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LOAD_PRODUCT_REFERENCES: LOAD_PRODUCT_REFERENCES,
    LOAD_PRODUCT_REFERENCES_FAIL: LOAD_PRODUCT_REFERENCES_FAIL,
    LOAD_PRODUCT_REFERENCES_SUCCESS: LOAD_PRODUCT_REFERENCES_SUCCESS,
    CLEAN_PRODUCT_REFERENCES: CLEAN_PRODUCT_REFERENCES,
    LoadProductReferences: LoadProductReferences,
    LoadProductReferencesFail: LoadProductReferencesFail,
    LoadProductReferencesSuccess: LoadProductReferencesSuccess,
    CleanProductReferences: CleanProductReferences,
    LOAD_PRODUCT_REVIEWS: LOAD_PRODUCT_REVIEWS,
    LOAD_PRODUCT_REVIEWS_FAIL: LOAD_PRODUCT_REVIEWS_FAIL,
    LOAD_PRODUCT_REVIEWS_SUCCESS: LOAD_PRODUCT_REVIEWS_SUCCESS,
    POST_PRODUCT_REVIEW: POST_PRODUCT_REVIEW,
    POST_PRODUCT_REVIEW_FAIL: POST_PRODUCT_REVIEW_FAIL,
    POST_PRODUCT_REVIEW_SUCCESS: POST_PRODUCT_REVIEW_SUCCESS,
    LoadProductReviews: LoadProductReviews,
    LoadProductReviewsFail: LoadProductReviewsFail,
    LoadProductReviewsSuccess: LoadProductReviewsSuccess,
    PostProductReview: PostProductReview,
    PostProductReviewFail: PostProductReviewFail,
    PostProductReviewSuccess: PostProductReviewSuccess,
    SEARCH_PRODUCTS: SEARCH_PRODUCTS,
    SEARCH_PRODUCTS_FAIL: SEARCH_PRODUCTS_FAIL,
    SEARCH_PRODUCTS_SUCCESS: SEARCH_PRODUCTS_SUCCESS,
    GET_PRODUCT_SUGGESTIONS: GET_PRODUCT_SUGGESTIONS,
    GET_PRODUCT_SUGGESTIONS_SUCCESS: GET_PRODUCT_SUGGESTIONS_SUCCESS,
    GET_PRODUCT_SUGGESTIONS_FAIL: GET_PRODUCT_SUGGESTIONS_FAIL,
    CLEAR_PRODUCT_SEARCH_RESULT: CLEAR_PRODUCT_SEARCH_RESULT,
    SearchProducts: SearchProducts,
    SearchProductsFail: SearchProductsFail,
    SearchProductsSuccess: SearchProductsSuccess,
    GetProductSuggestions: GetProductSuggestions,
    GetProductSuggestionsSuccess: GetProductSuggestionsSuccess,
    GetProductSuggestionsFail: GetProductSuggestionsFail,
    ClearProductSearchResult: ClearProductSearchResult,
    LOAD_PRODUCT: LOAD_PRODUCT,
    LOAD_PRODUCT_FAIL: LOAD_PRODUCT_FAIL,
    LOAD_PRODUCT_SUCCESS: LOAD_PRODUCT_SUCCESS,
    CLEAR_PRODUCT_PRICE: CLEAR_PRODUCT_PRICE,
    LoadProduct: LoadProduct,
    LoadProductFail: LoadProductFail,
    LoadProductSuccess: LoadProductSuccess,
    ClearProductPrice: ClearProductPrice
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getProductsState = createFeatureSelector(PRODUCT_FEATURE);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getProductReferencesState = createSelector(getProductsState, (state) => state.references);
const getSelectedProductReferencesFactory = (productCode, referenceType) => {
    return createSelector(getProductReferencesState, (referenceTypeData) => {
        if (referenceTypeData.productCode === productCode) {
            if (!!referenceTypeData.list) {
                if (referenceType) {
                    return referenceTypeData.list.filter((item) => item.referenceType === referenceType);
                }
                return referenceTypeData.list;
            }
        }
        return [];
    });
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getProductReviewsState = createSelector(getProductsState, (state) => state.reviews);
const getSelectedProductReviewsFactory = (productCode) => {
    return createSelector(getProductReviewsState, (reviewData) => {
        if (reviewData.productCode === productCode) {
            return reviewData.list;
        }
        return undefined;
    });
};

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$c = {
    results: {},
    suggestions: [],
    auxResults: {},
};
function reducer$c(state = initialState$c, action) {
    switch (action.type) {
        case SEARCH_PRODUCTS_SUCCESS: {
            const results = action.payload;
            const res = action.auxiliary ? { auxResults: results } : { results };
            return Object.assign(Object.assign({}, state), res);
        }
        case GET_PRODUCT_SUGGESTIONS_SUCCESS: {
            const suggestions = action.payload;
            return Object.assign(Object.assign({}, state), { suggestions });
        }
        case CLEAR_PRODUCT_SEARCH_RESULT: {
            return Object.assign(Object.assign({}, state), { results: action.payload.clearPageResults ? {} : state.results, suggestions: action.payload.clearSearchboxResults
                    ? []
                    : state.suggestions, auxResults: action.payload.clearSearchboxResults
                    ? {}
                    : state.auxResults });
        }
    }
    return state;
}
const getSearchResults$1 = (state) => state.results;
const getAuxSearchResults$1 = (state) => state.auxResults;
const getProductSuggestions$1 = (state) => state.suggestions;

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getProductsSearchState = createSelector(getProductsState, (state) => state.search);
const getSearchResults = createSelector(getProductsSearchState, getSearchResults$1);
const getAuxSearchResults = createSelector(getProductsSearchState, getAuxSearchResults$1);
const getProductSuggestions = createSelector(getProductsSearchState, getProductSuggestions$1);

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const getProductState = createSelector(getProductsState, (state) => state.details);
const getSelectedProductStateFactory = (code, scope = '') => {
    return createSelector(getProductState, (details) => entityLoaderStateSelector(details, code)[scope] ||
        initialLoaderState);
};
const getSelectedProductFactory = (code, scope = '') => {
    return createSelector(getSelectedProductStateFactory(code, scope), (productState) => loaderValueSelector(productState));
};
const getSelectedProductLoadingFactory = (code, scope = '') => {
    return createSelector(getSelectedProductStateFactory(code, scope), (productState) => loaderLoadingSelector(productState));
};
const getSelectedProductSuccessFactory = (code, scope = '') => {
    return createSelector(getSelectedProductStateFactory(code, scope), (productState) => loaderSuccessSelector(productState));
};
const getSelectedProductErrorFactory = (code, scope = '') => {
    return createSelector(getSelectedProductStateFactory(code, scope), (productState) => loaderErrorSelector(productState));
};
const getAllProductCodes = createSelector(getProductState, (details) => {
    return Object.keys(details.entities);
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

var productGroup_selectors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getProductsState: getProductsState,
    getProductReferencesState: getProductReferencesState,
    getSelectedProductReferencesFactory: getSelectedProductReferencesFactory,
    getProductReviewsState: getProductReviewsState,
    getSelectedProductReviewsFactory: getSelectedProductReviewsFactory,
    getProductsSearchState: getProductsSearchState,
    getSearchResults: getSearchResults,
    getAuxSearchResults: getAuxSearchResults,
    getProductSuggestions: getProductSuggestions,
    getProductState: getProductState,
    getSelectedProductStateFactory: getSelectedProductStateFactory,
    getSelectedProductFactory: getSelectedProductFactory,
    getSelectedProductLoadingFactory: getSelectedProductLoadingFactory,
    getSelectedProductSuccessFactory: getSelectedProductSuccessFactory,
    getSelectedProductErrorFactory: getSelectedProductErrorFactory,
    getAllProductCodes: getAllProductCodes
});

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductSearchService {
    constructor(store) {
        this.store = store;
    }
    search(query, searchConfig) {
        if (query) {
            this.store.dispatch(new SearchProducts({
                queryText: query,
                searchConfig: searchConfig,
            }));
        }
    }
    getResults() {
        return this.store.pipe(select(getSearchResults));
    }
    clearResults() {
        this.store.dispatch(new ClearProductSearchResult({
            clearPageResults: true,
        }));
    }
}
ProductSearchService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductSearchService, deps: [{ token: i1$2.Store }], target: i0.ɵɵFactoryTarget.Injectable });
ProductSearchService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductSearchService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductSearchService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductEventBuilder {
    constructor(eventService, productSearchService) {
        this.eventService = eventService;
        this.productSearchService = productSearchService;
        this.register();
    }
    register() {
        this.eventService.register(FacetChangedEvent, this.buildFacetChangedEvent());
    }
    /**
     * To get the changed facet, we need to compare the product search results
     * got before and after toggling the facet value. These 2 product searches must
     * have the same search queries except one different solr filter term. That means
     * these 2 searches must have the same 'freeTextSearch'; and if they are category
     * searches, they must have the same root (in the same category or brand).
     */
    buildFacetChangedEvent() {
        return this.productSearchService.getResults().pipe(pairwise(), filter(([prev, curr]) => this.compareSearchResults(prev, curr)), map(([prev, curr]) => {
            const toggled = this.getToggledBreadcrumb(curr.breadcrumbs, prev.breadcrumbs) ||
                this.getToggledBreadcrumb(prev.breadcrumbs, curr.breadcrumbs);
            if (toggled) {
                return createFrom(FacetChangedEvent, {
                    code: toggled.facetCode,
                    name: toggled.facetName,
                    valueCode: toggled.facetValueCode,
                    valueName: toggled.facetValueName,
                    selected: curr.breadcrumbs &&
                        prev.breadcrumbs &&
                        curr.breadcrumbs.length > prev.breadcrumbs.length,
                });
            }
        }));
    }
    /**
     * The 2 product searches (before and after facet changed) must have the same
     * search queries; and if they are category searches, they also must have the
     * same root (in the same category or brand).
     */
    compareSearchResults(prev, curr) {
        var _a, _b, _c, _d, _e;
        if (prev && Object.keys(prev).length !== 0) {
            // for text searches, they must have the same freeTextSearch
            const sameFreeTextSearch = prev.freeTextSearch !== '' &&
                prev.freeTextSearch === curr.freeTextSearch;
            // for category searches, they must have the same root
            const sameCategoryRoot = ((_b = (_a = curr.breadcrumbs) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.facetCode) === 'allCategories' &&
                ((_d = (_c = prev.breadcrumbs) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.facetCode) === ((_e = curr.breadcrumbs[0]) === null || _e === void 0 ? void 0 : _e.facetCode) &&
                // same category or brand
                prev.breadcrumbs[0].facetValueCode ===
                    curr.breadcrumbs[0].facetValueCode;
            return sameFreeTextSearch || sameCategoryRoot;
        }
        return false;
    }
    /**
     * Get the toggled breadcrumb. The 2 breadcrumb lists got from the 2 search results
     * only can have one different solr filter term.
     */
    getToggledBreadcrumb(bc1, bc2) {
        if (bc1 && bc2 && bc1.length - bc2.length === 1) {
            return bc1.find((x) => !bc2.find((y) => y.facetCode === x.facetCode &&
                y.facetValueCode === x.facetValueCode));
        }
    }
}
ProductEventBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductEventBuilder, deps: [{ token: EventService }, { token: ProductSearchService }], target: i0.ɵɵFactoryTarget.Injectable });
ProductEventBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductEventBuilder, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductEventBuilder, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: EventService }, { type: ProductSearchService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductEventModule {
    constructor(_productEventBuilder) {
        // Intentional empty constructor
    }
}
ProductEventModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductEventModule, deps: [{ token: ProductEventBuilder }], target: i0.ɵɵFactoryTarget.NgModule });
ProductEventModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ProductEventModule });
ProductEventModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductEventModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductEventModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: ProductEventBuilder }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductReferencesEffects {
    constructor(actions$, productReferencesConnector) {
        this.actions$ = actions$;
        this.productReferencesConnector = productReferencesConnector;
        this.loadProductReferences$ = createEffect(() => this.actions$.pipe(ofType(LOAD_PRODUCT_REFERENCES), map((action) => action.payload), mergeMap((payload) => {
            return this.productReferencesConnector
                .get(payload.productCode, payload.referenceType, payload.pageSize)
                .pipe(map((data) => {
                return new LoadProductReferencesSuccess({
                    productCode: payload.productCode,
                    list: data,
                });
            }), catchError((_error) => of(new LoadProductReferencesFail({
                message: payload.productCode,
            }))));
        })));
    }
}
ProductReferencesEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferencesEffects, deps: [{ token: i1$4.Actions }, { token: ProductReferencesConnector }], target: i0.ɵɵFactoryTarget.Injectable });
ProductReferencesEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferencesEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferencesEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: ProductReferencesConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductReviewsEffects {
    constructor(actions$, productReviewsConnector, globalMessageService) {
        this.actions$ = actions$;
        this.productReviewsConnector = productReviewsConnector;
        this.globalMessageService = globalMessageService;
        this.loadProductReviews$ = createEffect(() => this.actions$.pipe(ofType(LOAD_PRODUCT_REVIEWS), map((action) => action.payload), mergeMap((productCode) => {
            return this.productReviewsConnector.get(productCode).pipe(map((data) => {
                return new LoadProductReviewsSuccess({
                    productCode,
                    list: data,
                });
            }), catchError((_error) => of(new LoadProductReviewsFail({
                message: productCode,
            }))));
        })));
        this.postProductReview = createEffect(() => this.actions$.pipe(ofType(POST_PRODUCT_REVIEW), map((action) => action.payload), mergeMap((payload) => {
            return this.productReviewsConnector
                .add(payload.productCode, payload.review)
                .pipe(map((reviewResponse) => {
                return new PostProductReviewSuccess(reviewResponse);
            }), catchError((_error) => of(new PostProductReviewFail(payload.productCode))));
        })));
        this.showGlobalMessageOnPostProductReviewSuccess$ = createEffect(() => this.actions$.pipe(ofType(POST_PRODUCT_REVIEW_SUCCESS), tap(() => {
            this.globalMessageService.add({ key: 'productReview.thankYouForReview' }, GlobalMessageType.MSG_TYPE_CONFIRMATION);
        })), { dispatch: false });
    }
}
ProductReviewsEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReviewsEffects, deps: [{ token: i1$4.Actions }, { token: ProductReviewsConnector }, { token: GlobalMessageService }], target: i0.ɵɵFactoryTarget.Injectable });
ProductReviewsEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReviewsEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReviewsEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: ProductReviewsConnector }, { type: GlobalMessageService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductsSearchEffects {
    constructor(actions$, productSearchConnector) {
        this.actions$ = actions$;
        this.productSearchConnector = productSearchConnector;
        this.searchProducts$ = createEffect(() => this.actions$.pipe(ofType(SEARCH_PRODUCTS), groupBy((action) => action.auxiliary), mergeMap((group) => group.pipe(switchMap((action) => {
            return this.productSearchConnector
                .search(action.payload.queryText, action.payload.searchConfig)
                .pipe(map((data) => {
                return new SearchProductsSuccess(data, action.auxiliary);
            }), catchError((error) => of(new SearchProductsFail(normalizeHttpError(error), action.auxiliary))));
        })))));
        this.getProductSuggestions$ = createEffect(() => this.actions$.pipe(ofType(GET_PRODUCT_SUGGESTIONS), map((action) => action.payload), switchMap((payload) => {
            var _a;
            return this.productSearchConnector
                .getSuggestions(payload.term, (_a = payload.searchConfig) === null || _a === void 0 ? void 0 : _a.pageSize)
                .pipe(map((suggestions) => {
                if (suggestions === undefined) {
                    return new GetProductSuggestionsSuccess([]);
                }
                return new GetProductSuggestionsSuccess(suggestions);
            }), catchError((error) => of(new GetProductSuggestionsFail(normalizeHttpError(error)))));
        })));
    }
}
ProductsSearchEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductsSearchEffects, deps: [{ token: i1$4.Actions }, { token: ProductSearchConnector }], target: i0.ɵɵFactoryTarget.Injectable });
ProductsSearchEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductsSearchEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductsSearchEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: ProductSearchConnector }]; } });

class ProductEffects {
    constructor(actions$, productConnector) {
        this.actions$ = actions$;
        this.productConnector = productConnector;
        // we want to cancel all ongoing requests when currency or language changes,
        this.contextChange$ = this.actions$.pipe(ofType(CURRENCY_CHANGE, LANGUAGE_CHANGE));
        this.loadProduct$ = createEffect(() => ({ scheduler, debounce = 0 } = {}) => this.actions$.pipe(ofType(LOAD_PRODUCT), map((action) => ({
            code: action.payload,
            scope: action.meta.scope,
        })), 
        // we are grouping all load actions that happens at the same time
        // to optimize loading and pass them all to productConnector.getMany
        bufferDebounceTime(debounce, scheduler), mergeMap((products) => merge(...this.productConnector
            .getMany(products)
            .map(this.productLoadEffect))), withdrawOn(this.contextChange$)));
        this.clearProductPrice$ = this.actions$.pipe(ofType(LOGOUT, LOGIN), map(() => new ClearProductPrice()));
    }
    productLoadEffect(productLoad) {
        var _a, _b;
        return ((_b = (_a = productLoad.data$) === null || _a === void 0 ? void 0 : _a.pipe(map((data) => new LoadProductSuccess(Object.assign({ code: productLoad.code }, data), productLoad.scope)), catchError((error) => {
            return of(new LoadProductFail(productLoad.code, normalizeHttpError(error), productLoad.scope));
        }))) !== null && _b !== void 0 ? _b : of(new LoadProductFail(productLoad.code, 'Scoped product data does not exist', productLoad.scope)));
    }
}
ProductEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductEffects, deps: [{ token: i1$4.Actions }, { token: ProductConnector }], target: i0.ɵɵFactoryTarget.Injectable });
ProductEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductEffects });
__decorate([
    Effect()
], ProductEffects.prototype, "clearProductPrice$", void 0);
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: ProductConnector }]; }, propDecorators: { clearProductPrice$: [] } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const effects$1 = [
    ProductsSearchEffects,
    ProductEffects,
    ProductReviewsEffects,
    ProductReferencesEffects,
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialScopedLoaderState = {};
/**
 * Higher order reducer designed to add scope support for loader reducer
 *
 * @param entityType
 * @param reducer
 */
function scopedLoaderReducer(entityType, reducer) {
    const loader = loaderReducer(entityType, reducer);
    return (state = initialScopedLoaderState, action) => {
        var _a, _b;
        if (action && action.meta && action.meta.entityType === entityType) {
            return Object.assign(Object.assign({}, state), { [(_a = action.meta.scope) !== null && _a !== void 0 ? _a : '']: loader(state[(_b = action.meta.scope) !== null && _b !== void 0 ? _b : ''], action) });
        }
        return state;
    };
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Higher order reducer that wraps scopedLoaderReducer and EntityReducer enhancing
 * single state reducer to support multiple entities with generic loading flags and scopes
 */
function entityScopedLoaderReducer(entityType, reducer) {
    return entityReducer(entityType, scopedLoaderReducer(entityType, reducer));
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$b = {
    productCode: '',
    list: [],
};
function reducer$b(state = initialState$b, action) {
    switch (action.type) {
        case LOAD_PRODUCT_REFERENCES_SUCCESS: {
            const productCode = action.payload.productCode;
            const list = action.payload.list;
            return Object.assign(Object.assign({}, state), { list: [...state.list, ...(list ? list : [])].reduce((productReferences, productReference) => {
                    if (!productReferences.some((obj) => {
                        var _a, _b;
                        return obj.referenceType === productReference.referenceType &&
                            ((_a = obj.target) === null || _a === void 0 ? void 0 : _a.code) === ((_b = productReference.target) === null || _b === void 0 ? void 0 : _b.code);
                    })) {
                        productReferences.push(productReference);
                    }
                    return productReferences;
                }, []), productCode });
        }
        case CLEAN_PRODUCT_REFERENCES: {
            return initialState$b;
        }
    }
    return state;
}
const getProductReferenceList = (state) => state.list;
const getProductReferenceProductCode = (state) => state.productCode;

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$a = {
    productCode: '',
    list: [],
};
function reducer$a(state = initialState$a, action) {
    switch (action.type) {
        case LOAD_PRODUCT_REVIEWS_SUCCESS: {
            const productCode = action.payload.productCode;
            const list = action.payload.list;
            return Object.assign(Object.assign({}, state), { productCode,
                list });
        }
    }
    return state;
}
const getReviewList = (state) => state.list;
const getReviewProductCode = (state) => state.productCode;

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getReducers$1() {
    return {
        search: reducer$c,
        details: entityScopedLoaderReducer(PRODUCT_DETAIL_ENTITY),
        reviews: reducer$a,
        references: reducer$b,
    };
}
const reducerToken$1 = new InjectionToken('ProductReducers');
const reducerProvider$1 = {
    provide: reducerToken$1,
    useFactory: getReducers$1,
};
function clearProductsState(reducer) {
    return function (state, action) {
        if (action.type === CURRENCY_CHANGE ||
            action.type === LANGUAGE_CHANGE) {
            state = undefined;
        }
        return reducer(state, action);
    };
}
const metaReducers$1 = [clearProductsState];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductReferenceService {
    constructor(store) {
        this.store = store;
    }
    loadProductReferences(productCode, referenceType, pageSize) {
        this.store.dispatch(new LoadProductReferences({
            productCode,
            referenceType,
            pageSize,
        }));
    }
    getProductReferences(productCode, referenceType) {
        return this.store.pipe(select(getSelectedProductReferencesFactory(productCode, referenceType)));
    }
    cleanReferences() {
        this.store.dispatch(new CleanProductReferences());
    }
}
ProductReferenceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferenceService, deps: [{ token: i1$2.Store }], target: i0.ɵɵFactoryTarget.Injectable });
ProductReferenceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferenceService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReferenceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductReviewService {
    constructor(store) {
        this.store = store;
    }
    getByProductCode(productCode) {
        return this.store.pipe(select(getSelectedProductReviewsFactory(productCode)), tap((reviews) => {
            if (reviews === undefined && productCode !== undefined) {
                this.store.dispatch(new LoadProductReviews(productCode));
            }
        }), map((reviews) => reviews !== null && reviews !== void 0 ? reviews : []));
    }
    add(productCode, review) {
        this.store.dispatch(new PostProductReview({
            productCode: productCode,
            review,
        }));
    }
}
ProductReviewService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReviewService, deps: [{ token: i1$2.Store }], target: i0.ɵɵFactoryTarget.Injectable });
ProductReviewService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReviewService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductReviewService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductLoadingService {
    constructor(store, loadingScopes, actions$, platformId, eventService) {
        this.store = store;
        this.loadingScopes = loadingScopes;
        this.actions$ = actions$;
        this.platformId = platformId;
        this.eventService = eventService;
        this.products = {};
    }
    get(productCode, scopes) {
        scopes = this.loadingScopes.expand('product', scopes);
        this.initProductScopes(productCode, scopes);
        return this.products[productCode][this.getScopesIndex(scopes)];
    }
    initProductScopes(productCode, scopes) {
        if (!this.products[productCode]) {
            this.products[productCode] = {};
        }
        for (const scope of scopes) {
            if (!this.products[productCode][scope]) {
                this.products[productCode][scope] = this.getProductForScope(productCode, scope);
            }
        }
        if (scopes.length > 1) {
            this.products[productCode][this.getScopesIndex(scopes)] = uniteLatest(scopes.map((scope) => this.products[productCode][scope])).pipe(map((productParts) => productParts.every(Boolean)
                ? deepMerge({}, ...productParts)
                : undefined), distinctUntilChanged());
        }
    }
    getScopesIndex(scopes) {
        return scopes.join('ɵ');
    }
    /**
     * Creates observable for providing specified product data for the scope
     *
     * @param productCode
     * @param scope
     */
    getProductForScope(productCode, scope) {
        const shouldLoad$ = this.store.pipe(select(getSelectedProductStateFactory(productCode, scope)), map((productState) => !productState.loading && !productState.success && !productState.error), distinctUntilChanged(), filter((x) => x));
        const isLoading$ = this.store.pipe(select(getSelectedProductLoadingFactory(productCode, scope)));
        const productLoadLogic$ = merge(shouldLoad$, ...this.getProductReloadTriggers(productCode, scope)).pipe(debounceTime(0), withLatestFrom(isLoading$), tap(([, isLoading]) => {
            if (!isLoading) {
                this.store.dispatch(new LoadProduct(productCode, scope));
            }
        }));
        const productData$ = this.store.pipe(select(getSelectedProductFactory(productCode, scope)));
        return using(() => productLoadLogic$.subscribe(), () => productData$).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }
    /**
     * Returns reload triggers for product per scope
     *
     * @param productCode
     * @param scope
     */
    getProductReloadTriggers(productCode, scope) {
        const triggers = [];
        // max age trigger add
        const maxAge = this.loadingScopes.getMaxAge('product', scope);
        if (maxAge && isPlatformBrowser(this.platformId)) {
            // we want to grab load product success and load product fail for this product and scope
            const loadFinish$ = this.actions$.pipe(ofType(LOAD_PRODUCT_SUCCESS, LOAD_PRODUCT_FAIL), filter((action) => action.meta.entityId === productCode && action.meta.scope === scope));
            const loadStart$ = this.actions$.pipe(ofType(LOAD_PRODUCT), filter((action) => action.payload === productCode && action.meta.scope === scope));
            triggers.push(this.getMaxAgeTrigger(loadStart$, loadFinish$, maxAge));
        }
        const reloadTriggers$ = this.loadingScopes
            .getReloadTriggers('product', scope)
            .map((e) => this.eventService.get(e));
        return triggers.concat(reloadTriggers$);
    }
    /**
     * Generic method that returns stream triggering reload by maxAge
     *
     * Could be refactored to separate service in future to use in other
     * max age reload implementations
     *
     * @param loadStart$ Stream that emits on load start
     * @param loadFinish$ Stream that emits on load finish
     * @param maxAge max age
     */
    getMaxAgeTrigger(loadStart$, loadFinish$, maxAge, scheduler) {
        let timestamp = 0;
        const now = () => (scheduler ? scheduler.now() : Date.now());
        const timestamp$ = loadFinish$.pipe(tap(() => (timestamp = now())));
        const shouldReload$ = defer(() => {
            const age = now() - timestamp;
            const timestampRefresh$ = timestamp$.pipe(delay(maxAge, scheduler), mapTo(true), withdrawOn(loadStart$));
            if (age > maxAge) {
                // we should emit first value immediately
                return merge(of(true), timestampRefresh$);
            }
            else if (age === 0) {
                // edge case, we should emit max age timeout after next load success
                // could happen with artificial schedulers
                return timestampRefresh$;
            }
            else {
                // we should emit first value when age will expire
                return merge(of(true).pipe(delay(maxAge - age, scheduler)), timestampRefresh$);
            }
        });
        return shouldReload$;
    }
}
ProductLoadingService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductLoadingService, deps: [{ token: i1$2.Store }, { token: LoadingScopesService }, { token: i1$4.Actions }, { token: PLATFORM_ID }, { token: EventService }], target: i0.ɵɵFactoryTarget.Injectable });
ProductLoadingService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductLoadingService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductLoadingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: i1$2.Store }, { type: LoadingScopesService }, { type: i1$4.Actions }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }, { type: EventService }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductService {
    constructor(store, productLoading) {
        this.store = store;
        this.productLoading = productLoading;
    }
    /**
     * Returns the product observable. The product will be loaded
     * whenever there's no value observed.
     *
     * The underlying product loader ensures that the product is
     * only loaded once, even in case of parallel observers.
     *
     * You should provide product data scope you are interested in to not load all
     * the data if not needed. You can provide more than one scope.
     *
     * @param productCode Product code to load
     * @param scopes Scope or scopes of the product data
     */
    get(productCode, scopes = DEFAULT_SCOPE) {
        return productCode
            ? this.productLoading.get(productCode, [].concat(scopes))
            : of(undefined);
    }
    /**
     * Returns boolean observable for product's loading state
     */
    isLoading(productCode, scope = '') {
        return this.store.pipe(select(getSelectedProductLoadingFactory(productCode, scope)));
    }
    /**
     * Returns boolean observable for product's load success state
     */
    isSuccess(productCode, scope = '') {
        return this.store.pipe(select(getSelectedProductSuccessFactory(productCode, scope)));
    }
    /**
     * Returns boolean observable for product's load error state
     */
    hasError(productCode, scope = '') {
        return this.store.pipe(select(getSelectedProductErrorFactory(productCode, scope)));
    }
}
ProductService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductService, deps: [{ token: i1$2.Store }, { token: ProductLoadingService }], target: i0.ɵɵFactoryTarget.Injectable });
ProductService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: ProductLoadingService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class SearchboxService extends ProductSearchService {
    /**
     * dispatch the search for the search box
     */
    search(query, searchConfig) {
        this.store.dispatch(new SearchProducts({
            queryText: query,
            searchConfig: searchConfig,
        }, true));
    }
    getResults() {
        return this.store.pipe(select(getAuxSearchResults));
    }
    /**
     * clears the products and suggestions
     */
    clearResults() {
        this.store.dispatch(new ClearProductSearchResult({
            clearSearchboxResults: true,
        }));
    }
    getSuggestionResults() {
        return this.store.pipe(select(getProductSuggestions));
    }
    searchSuggestions(query, searchConfig) {
        this.store.dispatch(new GetProductSuggestions({
            term: query,
            searchConfig: searchConfig,
        }));
    }
}
SearchboxService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SearchboxService, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
SearchboxService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SearchboxService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SearchboxService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Resolves the page data for the Product Listing Page.
 *
 * The page title, and breadcrumbs are resolved in this implementation only.
 */
class CategoryPageMetaResolver extends PageMetaResolver {
    constructor(productSearchService, cms, translation, basePageMetaResolver) {
        super();
        this.productSearchService = productSearchService;
        this.cms = cms;
        this.translation = translation;
        this.basePageMetaResolver = basePageMetaResolver;
        // reusable observable for search page data
        this.searchPage$ = this.cms
            .getCurrentPage()
            .pipe(filter((page) => Boolean(page)), switchMap((page) => 
        // only the existence of a plp component tells us if products
        // are rendered or if this is an ordinary content page
        this.hasProductListComponent(page)
            ? this.productSearchService
                .getResults()
                .pipe(filter((result) => Boolean(result)))
            : of(page)));
        this.pageType = PageType.CATEGORY_PAGE;
    }
    resolveTitle() {
        return this.searchPage$.pipe(filter((page) => !!page.pagination), switchMap((p) => {
            var _a, _b;
            return this.translation.translate('pageMetaResolver.category.title', {
                count: (_a = p.pagination) === null || _a === void 0 ? void 0 : _a.totalResults,
                query: ((_b = p.breadcrumbs) === null || _b === void 0 ? void 0 : _b.length)
                    ? p.breadcrumbs[0].facetValueName
                    : undefined,
            });
        }));
    }
    resolveBreadcrumbs() {
        return combineLatest([
            this.searchPage$.pipe(),
            this.translation.translate('common.home'),
        ]).pipe(map(([page, label]) => page.breadcrumbs
            ? this.resolveBreadcrumbData(page, label)
            : []));
    }
    resolveBreadcrumbData(page, label) {
        var _a;
        const breadcrumbs = [];
        breadcrumbs.push({ label: label, link: '/' });
        for (const br of (_a = page.breadcrumbs) !== null && _a !== void 0 ? _a : []) {
            if (br.facetValueName) {
                if (br.facetCode === 'category' || br.facetCode === 'allCategories') {
                    breadcrumbs.push({
                        label: br.facetValueName,
                        link: `/c/${br.facetValueCode}`,
                    });
                }
                if (br.facetCode === 'brand') {
                    breadcrumbs.push({
                        label: br.facetValueName,
                        link: `/Brands/${br.facetValueName}/c/${br.facetValueCode}`,
                    });
                }
            }
        }
        return breadcrumbs;
    }
    hasProductListComponent(page) {
        return !!Object.keys(page.slots || {}).find((key) => {
            var _a, _b;
            return !!((_b = (_a = page.slots) === null || _a === void 0 ? void 0 : _a[key].components) === null || _b === void 0 ? void 0 : _b.find((comp) => comp.typeCode === 'CMSProductListComponent' ||
                comp.typeCode === 'ProductGridComponent'));
        });
    }
    resolveRobots() {
        return this.basePageMetaResolver.resolveRobots();
    }
    /**
     * Resolves the canonical url for the category listing page.
     *
     * The default options will be used to resolve the url, which means that
     * all query parameters are removed and https and www are added explicitly.
     */
    resolveCanonicalUrl() {
        return this.basePageMetaResolver.resolveCanonicalUrl();
    }
}
CategoryPageMetaResolver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CategoryPageMetaResolver, deps: [{ token: ProductSearchService }, { token: CmsService }, { token: TranslationService }, { token: BasePageMetaResolver }], target: i0.ɵɵFactoryTarget.Injectable });
CategoryPageMetaResolver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CategoryPageMetaResolver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CategoryPageMetaResolver, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ProductSearchService }, { type: CmsService }, { type: TranslationService }, { type: BasePageMetaResolver }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Resolves page meta data for the search result page, in case it's used
 * to query coupons. This is done by adding a `couponcode` query parameter
 * to the search page route.
 *
 * The page resolves an alternative page title and breadcrumb.
 */
class CouponSearchPageResolver extends PageMetaResolver {
    constructor(productSearchService, translation, authService, route, semanticPathService) {
        super();
        this.productSearchService = productSearchService;
        this.translation = translation;
        this.authService = authService;
        this.route = route;
        this.semanticPathService = semanticPathService;
        this.total$ = this.productSearchService
            .getResults()
            .pipe(filter((data) => !!(data === null || data === void 0 ? void 0 : data.pagination)), map((results) => { var _a, _b; return (_b = (_a = results.pagination) === null || _a === void 0 ? void 0 : _a.totalResults) !== null && _b !== void 0 ? _b : 0; }));
        this.pageType = PageType.CONTENT_PAGE;
        this.pageTemplate = 'SearchResultsListPageTemplate';
    }
    resolveBreadcrumbs() {
        return combineLatest([
            this.translation.translate('common.home'),
            this.translation.translate('myCoupons.myCoupons'),
            this.authService.isUserLoggedIn(),
        ]).pipe(map(([homeLabel, couponLabel, isLoggedIn]) => {
            const breadcrumbs = [];
            breadcrumbs.push({ label: homeLabel, link: '/' });
            if (isLoggedIn) {
                breadcrumbs.push({
                    label: couponLabel,
                    link: this.semanticPathService.transform({
                        cxRoute: 'coupons',
                    }),
                });
            }
            return breadcrumbs;
        }));
    }
    resolveTitle() {
        return this.total$.pipe(switchMap((total) => this.translation.translate('pageMetaResolver.search.findProductTitle', {
            count: total,
            coupon: this.couponCode,
        })));
    }
    getScore(page) {
        return super.getScore(page) + (this.couponCode ? 1 : -1);
    }
    get couponCode() {
        var _a, _b;
        return (_b = (_a = this.route.snapshot) === null || _a === void 0 ? void 0 : _a.queryParams) === null || _b === void 0 ? void 0 : _b.couponcode;
    }
}
CouponSearchPageResolver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CouponSearchPageResolver, deps: [{ token: ProductSearchService }, { token: TranslationService }, { token: AuthService }, { token: i1$1.ActivatedRoute }, { token: SemanticPathService }], target: i0.ɵɵFactoryTarget.Injectable });
CouponSearchPageResolver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CouponSearchPageResolver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CouponSearchPageResolver, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: ProductSearchService }, { type: TranslationService }, { type: AuthService }, { type: i1$1.ActivatedRoute }, { type: SemanticPathService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Resolves the page data for the Product Detail Page
 * based on the `PageType.PRODUCT_PAGE`.
 *
 * The page title, heading, description, breadcrumbs and
 * first GALLERY image are resolved if available in the data.
 */
class ProductPageMetaResolver extends PageMetaResolver {
    constructor(routingService, productService, translation, basePageMetaResolver, pageLinkService) {
        super();
        this.routingService = routingService;
        this.productService = productService;
        this.translation = translation;
        this.basePageMetaResolver = basePageMetaResolver;
        this.pageLinkService = pageLinkService;
        // reusable observable for product data based on the current page
        this.product$ = this.routingService
            .getRouterState()
            .pipe(map((state) => state.state.params['productCode']), filter((code) => !!code), switchMap((code) => this.productService.get(code, "details" /* ProductScope.DETAILS */)), filter(isNotUndefined));
        this.pageType = PageType.PRODUCT_PAGE;
    }
    /**
     * Resolves the page heading for the Product Detail Page.
     * The page heading is used in the UI (`<h1>`), where as the page
     * title is used by the browser and crawlers.
     */
    resolveHeading() {
        return this.product$.pipe(switchMap((p) => this.translation.translate('pageMetaResolver.product.heading', {
            heading: p.name,
        })));
    }
    /**
     * Resolves the page title for the Product Detail Page. The page title
     * is resolved with the product name, the first category and the manufacturer.
     * The page title used by the browser (history, tabs) and crawlers.
     */
    resolveTitle() {
        return this.product$.pipe(switchMap((product) => {
            let title = product.name;
            title += this.resolveFirstCategory(product);
            title += this.resolveManufacturer(product);
            return this.translation.translate('pageMetaResolver.product.title', {
                title: title,
            });
        }));
    }
    /**
     * Resolves the page description for the Product Detail Page. The description
     * is based on the `product.summary`.
     */
    resolveDescription() {
        return this.product$.pipe(switchMap((product) => this.translation.translate('pageMetaResolver.product.description', {
            description: product.summary,
        })));
    }
    /**
     * Resolves breadcrumbs for the Product Detail Page. The breadcrumbs are driven by
     * a static home page crumb and a crumb for each category.
     */
    resolveBreadcrumbs() {
        return combineLatest([
            this.product$.pipe(),
            this.translation.translate('common.home'),
        ]).pipe(map(([product, label]) => {
            const breadcrumbs = [];
            breadcrumbs.push({ label, link: '/' });
            for (const { name, code, url } of product.categories || []) {
                breadcrumbs.push({
                    label: name || code,
                    link: url,
                });
            }
            return breadcrumbs;
        }));
    }
    /**
     * Resolves the main page image for the Product Detail Page. The product image
     * is based on the PRIMARY product image. The zoom format is used by default.
     */
    resolveImage() {
        return this.product$.pipe(map((product) => { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = product.images) === null || _a === void 0 ? void 0 : _a.PRIMARY) === null || _b === void 0 ? void 0 : _b.zoom) === null || _c === void 0 ? void 0 : _c.url) !== null && _d !== void 0 ? _d : null; }));
    }
    resolveFirstCategory(product) {
        var _a;
        const firstCategory = (_a = product === null || product === void 0 ? void 0 : product.categories) === null || _a === void 0 ? void 0 : _a[0];
        return firstCategory
            ? ` | ${firstCategory.name || firstCategory.code}`
            : '';
    }
    resolveManufacturer(product) {
        return product.manufacturer ? ` | ${product.manufacturer}` : '';
    }
    resolveRobots() {
        return this.basePageMetaResolver.resolveRobots();
    }
    /**
     * Resolves the canonical url for the product page using the default canonical url
     * configuration.
     *
     * In case of a variant product, the baseProduct code is used to resolve the url. It's important
     * to know that this has a few limitations:
     * - We're not always able to get the super baseProduct, in case of multi-level variants.
     *   OCC only exposes the direct baseProduct, which might still not resolve in the correct
     *   canonical URL. This is business driven and subject to change in a customization.
     * - The url resolved for the variant doesn't contain any content other then the product code.
     *   This means that we do not provide any product data to resolve pretty URLs (for example
     *   the product title).
     */
    resolveCanonicalUrl() {
        return this.product$.pipe(switchMap((product) => this.findBaseProduct(product)), map((product) => {
            const url = this.routingService.getFullUrl({
                cxRoute: 'product',
                params: product,
            });
            return this.pageLinkService.getCanonicalUrl({}, url);
        }));
    }
    /**
     * Resolves the base product whenever the given product is a variant product.
     *
     * Since product variants can be multi-layered, we recursively try to find the base product
     * this might be too opinionated for your business though.
     */
    findBaseProduct(product) {
        if (product === null || product === void 0 ? void 0 : product.baseProduct) {
            return this.productService
                .get(product.baseProduct, "list" /* ProductScope.LIST */)
                .pipe(filter(isNotUndefined), switchMap((baseProduct) => this.findBaseProduct(baseProduct)));
        }
        return of(product);
    }
}
ProductPageMetaResolver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductPageMetaResolver, deps: [{ token: RoutingService }, { token: ProductService }, { token: TranslationService }, { token: BasePageMetaResolver }, { token: PageLinkService }], target: i0.ɵɵFactoryTarget.Injectable });
ProductPageMetaResolver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductPageMetaResolver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductPageMetaResolver, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: RoutingService }, { type: ProductService }, { type: TranslationService }, { type: BasePageMetaResolver }, { type: PageLinkService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Resolves the page data for the Search Result Page based on the
 * `PageType.CATEGORY_PAGE` and the `SearchResultsListPageTemplate` template.
 *
 * Only the page title is resolved in the standard implementation.
 */
class SearchPageMetaResolver extends PageMetaResolver {
    constructor(routingService, productSearchService, translation, basePageMetaResolver) {
        super();
        this.routingService = routingService;
        this.productSearchService = productSearchService;
        this.translation = translation;
        this.basePageMetaResolver = basePageMetaResolver;
        this.total$ = this.productSearchService
            .getResults()
            .pipe(filter((data) => !!(data === null || data === void 0 ? void 0 : data.pagination)), map((results) => { var _a; return (_a = results.pagination) === null || _a === void 0 ? void 0 : _a.totalResults; }));
        this.query$ = this.routingService
            .getRouterState()
            .pipe(map((state) => state.state.params['query']));
        this.pageType = PageType.CONTENT_PAGE;
        this.pageTemplate = 'SearchResultsListPageTemplate';
    }
    resolveTitle() {
        const sources = [this.total$, this.query$];
        return combineLatest(sources).pipe(switchMap(([count, query]) => this.translation
            .translate('pageMetaResolver.search.default_title')
            .pipe(mergeMap((defaultQuery) => this.translation.translate('pageMetaResolver.search.title', {
            count,
            query: query || defaultQuery,
        })))));
    }
    resolveRobots() {
        return this.basePageMetaResolver.resolveRobots();
    }
    /**
     * Resolves the canonical page for the search page.
     *
     * The default options will be used to resolve the url, which means that
     * the all query parameters are removed and https and www are added explicitly.
     */
    resolveCanonicalUrl() {
        return this.basePageMetaResolver.resolveCanonicalUrl();
    }
}
SearchPageMetaResolver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SearchPageMetaResolver, deps: [{ token: RoutingService }, { token: ProductSearchService }, { token: TranslationService }, { token: BasePageMetaResolver }], target: i0.ɵɵFactoryTarget.Injectable });
SearchPageMetaResolver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SearchPageMetaResolver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: SearchPageMetaResolver, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: RoutingService }, { type: ProductSearchService }, { type: TranslationService }, { type: BasePageMetaResolver }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function productStoreConfigFactory() {
    // if we want to reuse PRODUCT_FEATURE const in config, we have to use factory instead of plain object
    const config = {
        state: {
            ssrTransfer: {
                keys: { [PRODUCT_FEATURE]: StateTransferType.TRANSFER_STATE },
            },
        },
    };
    return config;
}
class ProductStoreModule {
}
ProductStoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductStoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ProductStoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ProductStoreModule, imports: [CommonModule, i1$2.StoreFeatureModule, i1$4.EffectsFeatureModule] });
ProductStoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductStoreModule, providers: [
        provideDefaultConfigFactory(productStoreConfigFactory),
        reducerProvider$1,
    ], imports: [CommonModule,
        StoreModule.forFeature(PRODUCT_FEATURE, reducerToken$1, { metaReducers: metaReducers$1 }),
        EffectsModule.forFeature(effects$1)] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductStoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        StoreModule.forFeature(PRODUCT_FEATURE, reducerToken$1, { metaReducers: metaReducers$1 }),
                        EffectsModule.forFeature(effects$1),
                    ],
                    providers: [
                        provideDefaultConfigFactory(productStoreConfigFactory),
                        reducerProvider$1,
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const pageTitleResolvers = [
    {
        provide: PageMetaResolver,
        useExisting: ProductPageMetaResolver,
        multi: true,
    },
    {
        provide: PageMetaResolver,
        useExisting: CategoryPageMetaResolver,
        multi: true,
    },
    {
        provide: PageMetaResolver,
        useExisting: SearchPageMetaResolver,
        multi: true,
    },
    {
        provide: PageMetaResolver,
        useExisting: CouponSearchPageResolver,
        multi: true,
    },
];
class ProductModule {
    static forRoot() {
        return {
            ngModule: ProductModule,
            providers: [...pageTitleResolvers],
        };
    }
}
ProductModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ProductModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: ProductModule, imports: [ProductStoreModule, ProductEventModule] });
ProductModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductModule, imports: [ProductStoreModule, ProductEventModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [ProductStoreModule, ProductEventModule],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserAddressConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    getAll(userId) {
        return this.adapter.loadAll(userId);
    }
    add(userId, address) {
        return this.adapter.add(userId, address);
    }
    update(userId, addressId, address) {
        return this.adapter.update(userId, addressId, address);
    }
    verify(userId, address) {
        return this.adapter.verify(userId, address);
    }
    delete(userId, addressId) {
        return this.adapter.delete(userId, addressId);
    }
}
UserAddressConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAddressConnector, deps: [{ token: UserAddressAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
UserAddressConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAddressConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAddressConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: UserAddressAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserConsentConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    loadConsents(userId) {
        return this.adapter.loadConsents(userId);
    }
    giveConsent(userId, consentTemplateId, consentTemplateVersion) {
        return this.adapter.giveConsent(userId, consentTemplateId, consentTemplateVersion);
    }
    withdrawConsent(userId, consentCode) {
        return this.adapter.withdrawConsent(userId, consentCode);
    }
}
UserConsentConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserConsentConnector, deps: [{ token: UserConsentAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
UserConsentConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserConsentConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserConsentConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: UserConsentAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserCostCenterConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    getActiveList(userId) {
        return this.adapter.loadActiveList(userId);
    }
}
UserCostCenterConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserCostCenterConnector, deps: [{ token: UserCostCenterAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
UserCostCenterConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserCostCenterConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserCostCenterConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: UserCostCenterAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CustomerCouponConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    getCustomerCoupons(userId, pageSize, currentPage, sort) {
        return this.adapter.getCustomerCoupons(userId, pageSize, currentPage, sort);
    }
    turnOnNotification(userId, couponCode) {
        return this.adapter.turnOnNotification(userId, couponCode);
    }
    turnOffNotification(userId, couponCode) {
        return this.adapter.turnOffNotification(userId, couponCode);
    }
    claimCustomerCoupon(userId, couponCode) {
        return this.adapter.claimCustomerCoupon(userId, couponCode);
    }
}
CustomerCouponConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomerCouponConnector, deps: [{ token: CustomerCouponAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
CustomerCouponConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomerCouponConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomerCouponConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: CustomerCouponAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserInterestsConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    getInterests(userId, pageSize, currentPage, sort, productCode, notificationType) {
        return this.adapter.getInterests(userId, pageSize, currentPage, sort, productCode, notificationType);
    }
    removeInterest(userId, item) {
        return this.adapter.removeInterest(userId, item);
    }
    addInterest(userId, productCode, notificationType) {
        return this.adapter.addInterest(userId, productCode, notificationType);
    }
}
UserInterestsConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserInterestsConnector, deps: [{ token: UserInterestsAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
UserInterestsConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserInterestsConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserInterestsConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: UserInterestsAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserPaymentConnector {
    constructor(adapter) {
        this.adapter = adapter;
    }
    getAll(userId) {
        return this.adapter.loadAll(userId);
    }
    delete(userId, paymentMethodID) {
        return this.adapter.delete(userId, paymentMethodID);
    }
    setDefault(userId, paymentMethodID) {
        return this.adapter.setDefault(userId, paymentMethodID);
    }
}
UserPaymentConnector.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserPaymentConnector, deps: [{ token: UserPaymentAdapter }], target: i0.ɵɵFactoryTarget.Injectable });
UserPaymentConnector.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserPaymentConnector, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserPaymentConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: UserPaymentAdapter }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserAddressEvent extends CxEvent {
}
class UpdateUserAddressEvent extends UserAddressEvent {
}
UpdateUserAddressEvent.type = 'UpdateUserAddressEvent';
class DeleteUserAddressEvent extends UserAddressEvent {
}
DeleteUserAddressEvent.type = 'DeleteUserAddressEvent';
class AddUserAddressEvent extends UserAddressEvent {
}
AddUserAddressEvent.type = 'AddUserAddressEvent';
class LoadUserAddressesEvent extends UserAddressEvent {
}
LoadUserAddressesEvent.type = 'LoadUserAddressesEvent';
class LoadUserPaymentMethodsEvent extends UserAddressEvent {
}
LoadUserPaymentMethodsEvent.type = 'LoadUserPaymentMethodsEvent';

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserEventBuilder {
    constructor(stateEventService) {
        this.stateEventService = stateEventService;
        this.register();
    }
    /**
     * Registers user events
     */
    register() {
        this.updateUserAddressEvent();
        this.deleteUserAddressEvent();
        this.addUserAddressEvent();
    }
    /**
     * Register an address successfully updated event
     */
    updateUserAddressEvent() {
        this.stateEventService.register({
            action: UPDATE_USER_ADDRESS,
            event: UpdateUserAddressEvent,
        });
    }
    addUserAddressEvent() {
        this.stateEventService.register({
            action: ADD_USER_ADDRESS,
            event: AddUserAddressEvent,
        });
    }
    deleteUserAddressEvent() {
        this.stateEventService.register({
            action: DELETE_USER_ADDRESS,
            event: DeleteUserAddressEvent,
        });
    }
}
UserEventBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserEventBuilder, deps: [{ token: StateEventService }], target: i0.ɵɵFactoryTarget.Injectable });
UserEventBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserEventBuilder });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserEventBuilder, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: StateEventService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserEventModule {
    constructor(_userEventBuilder) {
        // Intentional empty constructor
    }
}
UserEventModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserEventModule, deps: [{ token: UserEventBuilder }], target: i0.ɵɵFactoryTarget.NgModule });
UserEventModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: UserEventModule });
UserEventModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserEventModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserEventModule, decorators: [{
            type: NgModule,
            args: [{}]
        }], ctorParameters: function () { return [{ type: UserEventBuilder }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Unified facade for both anonymous and registered user consents.
 */
class ConsentService {
    constructor(anonymousConsentsService, userConsentService) {
        this.anonymousConsentsService = anonymousConsentsService;
        this.userConsentService = userConsentService;
    }
    /**
     * Returns either anonymous consent or registered consent as they are emmited.
     * @param templateCode for which to return either anonymous or registered consent.
     */
    getConsent(templateCode) {
        return merge(this.userConsentService.getConsent(templateCode), this.anonymousConsentsService.getConsent(templateCode));
    }
    /**
     * Checks if the `templateId`'s template has a given consent.
     * The method returns `false` if the consent doesn't exist or if it's withdrawn. Otherwise, `true` is returned.
     *
     * @param templateId of a template which's consent should be checked
     */
    checkConsentGivenByTemplateId(templateId) {
        return this.getConsent(templateId).pipe(map((consent) => {
            if (!consent) {
                return false;
            }
            return this.isAnonymousConsentType(consent)
                ? this.anonymousConsentsService.isConsentGiven(consent)
                : this.userConsentService.isConsentGiven(consent);
        }), distinctUntilChanged());
    }
    /**
     * Checks if the `templateId`'s template has a withdrawn consent.
     * The method returns `true` if the consent doesn't exist or if it's withdrawn. Otherwise, `false` is returned.
     *
     * @param templateId of a template which's consent should be checked
     */
    checkConsentWithdrawnByTemplateId(templateId) {
        return this.getConsent(templateId).pipe(map((consent) => {
            if (!consent) {
                return true;
            }
            return this.isAnonymousConsentType(consent)
                ? this.anonymousConsentsService.isConsentWithdrawn(consent)
                : this.userConsentService.isConsentWithdrawn(consent);
        }), distinctUntilChanged());
    }
    /**
     *
     * Checks the provided `consent`'s type and delegates to an appropriate method - `anonymousConsentsService.isConsentGiven(consent)` or `this.userConsentService.isConsentGiven`
     *
     * @param consent a consent to check
     */
    isConsentGiven(consent) {
        return this.isAnonymousConsentType(consent)
            ? this.anonymousConsentsService.isConsentGiven(consent)
            : this.userConsentService.isConsentGiven(consent);
    }
    /**
     *
     * Checks the provided `consent`'s type and delegates to an appropriate method - `anonymousConsentsService.isConsentWithdrawn(consent)` or `this.userConsentService.isConsentWithdrawn`
     *
     * @param consent a consent to check
     */
    isConsentWithdrawn(consent) {
        return this.isAnonymousConsentType(consent)
            ? this.anonymousConsentsService.isConsentWithdrawn(consent)
            : this.userConsentService.isConsentWithdrawn(consent);
    }
    /**
     * Returns `true` if the provided consent is of type `AnonymousConsent`. Otherwise, `false` is returned.
     */
    isAnonymousConsentType(consent) {
        if (!consent) {
            return false;
        }
        return consent.templateCode !== undefined;
    }
    /**
     * Returns `true` if the provided consent is of type `Consent`. Otherwise, `false` is returned.
     */
    isConsentType(consent) {
        if (!consent) {
            return false;
        }
        return consent.code !== undefined;
    }
}
ConsentService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConsentService, deps: [{ token: AnonymousConsentsService }, { token: UserConsentService }], target: i0.ɵɵFactoryTarget.Injectable });
ConsentService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConsentService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ConsentService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: AnonymousConsentsService }, { type: UserConsentService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class Command {
}
var CommandStrategy;
(function (CommandStrategy) {
    CommandStrategy[CommandStrategy["Parallel"] = 0] = "Parallel";
    CommandStrategy[CommandStrategy["Queue"] = 1] = "Queue";
    CommandStrategy[CommandStrategy["CancelPrevious"] = 2] = "CancelPrevious";
    CommandStrategy[CommandStrategy["ErrorPrevious"] = 3] = "ErrorPrevious";
    // SkipIfOngoing,
    // ErrorIfOngoing
})(CommandStrategy || (CommandStrategy = {}));
class CommandService {
    constructor() {
        this.subscriptions = new Subscription();
        // Intentional empty constructor
    }
    create(commandFactory, options) {
        const commands$ = new Subject();
        const results$ = new Subject();
        let process$;
        switch (options === null || options === void 0 ? void 0 : options.strategy) {
            case CommandStrategy.CancelPrevious:
            case CommandStrategy.ErrorPrevious:
                process$ = zip(commands$, results$).pipe(switchMap(([cmd, notifier$]) => commandFactory(cmd).pipe(tap(notifier$), finalize(() => options.strategy === CommandStrategy.CancelPrevious
                    ? notifier$.complete()
                    : notifier$.error(new Error('Canceled by next command'))))), retry());
                break;
            case CommandStrategy.Parallel:
                process$ = zip(commands$, results$).pipe(mergeMap(([cmd, notifier$]) => commandFactory(cmd).pipe(tap(notifier$))), retry());
                break;
            case CommandStrategy.Queue:
            default:
                process$ = zip(commands$, results$).pipe(concatMap(([cmd, notifier$]) => commandFactory(cmd).pipe(tap(notifier$))), retry());
                break;
        }
        this.subscriptions.add(process$.subscribe());
        const command = new (class extends Command {
            constructor() {
                super(...arguments);
                this.execute = (parameters) => {
                    const result$ = new ReplaySubject();
                    results$.next(result$);
                    commands$.next(parameters);
                    return result$;
                };
            }
        })();
        return command;
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
CommandService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CommandService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CommandService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CommandService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CommandService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return []; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class QueryService {
    constructor(eventService) {
        this.eventService = eventService;
        this.subscriptions = new Subscription();
    }
    create(loaderFactory, options) {
        var _a, _b, _c, _d, _e, _f;
        const initialState = {
            data: undefined,
            error: false,
            loading: true,
        };
        const state$ = new BehaviorSubject(initialState);
        // if the query will be unsubscribed from while the data is being loaded, we will end up with the loading flag set to true
        // we want to retry this load on next subscription
        const onSubscribeLoad$ = iif(() => state$.value.loading, of(undefined));
        const loadTrigger$ = this.getTriggersStream([
            onSubscribeLoad$,
            ...((_a = options === null || options === void 0 ? void 0 : options.reloadOn) !== null && _a !== void 0 ? _a : []),
            ...((_b = options === null || options === void 0 ? void 0 : options.resetOn) !== null && _b !== void 0 ? _b : []),
        ]);
        const resetTrigger$ = this.getTriggersStream((_c = options === null || options === void 0 ? void 0 : options.resetOn) !== null && _c !== void 0 ? _c : []);
        const reloadTrigger$ = this.getTriggersStream((_d = options === null || options === void 0 ? void 0 : options.reloadOn) !== null && _d !== void 0 ? _d : []);
        const load$ = loadTrigger$.pipe(tap(() => {
            if (!state$.value.loading) {
                state$.next(Object.assign(Object.assign({}, state$.value), { loading: true }));
            }
        }), switchMapTo(loaderFactory().pipe(takeUntil(resetTrigger$))), tap((data) => {
            state$.next({ loading: false, error: false, data });
        }), catchError((error, sourceStream$) => {
            state$.next({ loading: false, error, data: undefined });
            return sourceStream$;
        }), share());
        // reload logic
        if ((_e = options === null || options === void 0 ? void 0 : options.reloadOn) === null || _e === void 0 ? void 0 : _e.length) {
            this.subscriptions.add(reloadTrigger$.subscribe(() => {
                if (!state$.value.loading) {
                    state$.next(Object.assign(Object.assign({}, state$.value), { loading: true }));
                }
            }));
        }
        // reset logic
        if ((_f = options === null || options === void 0 ? void 0 : options.resetOn) === null || _f === void 0 ? void 0 : _f.length) {
            this.subscriptions.add(resetTrigger$.subscribe(() => {
                if (state$.value.data !== undefined ||
                    state$.value.error !== false ||
                    state$.value.loading !== false) {
                    state$.next(initialState);
                }
            }));
        }
        const query$ = using(() => load$.subscribe(), () => state$);
        const data$ = query$.pipe(pluck('data'), distinctUntilChanged());
        return { get: () => data$, getState: () => query$ };
    }
    getTriggersStream(triggers) {
        if (!triggers.length) {
            return EMPTY;
        }
        const observables = triggers.map((trigger) => {
            if (isObservable(trigger)) {
                return trigger;
            }
            return this.eventService.get(trigger);
        });
        return merge(...observables);
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
QueryService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: QueryService, deps: [{ token: EventService }], target: i0.ɵɵFactoryTarget.Injectable });
QueryService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: QueryService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: QueryService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: EventService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A helper function for detecting JaloObjectNoLongerValidError errors
 */
function isJaloError(err) {
    var _a, _b;
    return ((_b = (_a = err.details) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.type) === 'JaloObjectNoLongerValidError';
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
// Email Standard RFC 5322:
const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
const PASSWORD_PATTERN = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%^*()_\-+{};:.,]).{6,}$/;

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 *
 * An operator which performs exponential back-off on the source stream.
 *
 * Source: https://angular.io/guide/practical-observable-usage#exponential-backoff
 *
 * @param errFn for which to perform exponential back-off
 * @param options such as defining `maxTries`, or `delay`
 * @returns either the original error (if the given `errFn` return `false`), or the
 */
function backOff(options) {
    var _a, _b, _c;
    const shouldRetry = (_a = options === null || options === void 0 ? void 0 : options.shouldRetry) !== null && _a !== void 0 ? _a : (() => true);
    const maxTries = (_b = options === null || options === void 0 ? void 0 : options.maxTries) !== null && _b !== void 0 ? _b : 3;
    const delay = (_c = options === null || options === void 0 ? void 0 : options.delay) !== null && _c !== void 0 ? _c : 300;
    // creates a range of maximum retries - starting from 1, up until the given `maxTries`
    const retry$ = range(1, maxTries + 1);
    return (source$) => source$.pipe(
    // retries the source stream in case of an error.
    retryWhen((attempts$) => 
    // emits only when both emit at the same time. In practice, this means: emit when error happens again and retried
    zip(attempts$, retry$).pipe(mergeMap(([attemptError, currentRetry]) => {
        // if we've re-tried more than the maxTries, OR
        // if the source error is not the one we want to exponentially retry
        if (currentRetry > maxTries || !shouldRetry(attemptError)) {
            return throwError(attemptError);
        }
        return of(currentRetry);
    }), 
    // exponential
    map((currentRetry) => currentRetry * currentRetry), 
    // back-off
    mergeMap((exponent) => timer(exponent * delay)))));
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
var ScriptPlacement;
(function (ScriptPlacement) {
    ScriptPlacement["HEAD"] = "head";
    ScriptPlacement["BODY"] = "body";
})(ScriptPlacement || (ScriptPlacement = {}));
class ScriptLoader {
    constructor(document, platformId) {
        this.document = document;
        this.platformId = platformId;
    }
    /**
     * Embeds a javascript from an external URL.
     *
     * @param embedOptions
     * src: URL for the script to be loaded
     * params: additional parameters to be attached to the given URL
     * attributes: the attributes of HTML script tag (exclude src)
     * callback: a function to be invoked after the script has been loaded
     * errorCallback: function to be invoked after error during script loading
     * placement: HTML body or head where script will be placed
     */
    embedScript(embedOptions) {
        const { src, params, attributes, callback, errorCallback, placement = ScriptPlacement.HEAD, } = embedOptions;
        const isSSR = isPlatformServer(this.platformId);
        if ((callback || errorCallback) && isSSR) {
            return;
        }
        const source = params ? src + this.parseParams(params) : src;
        if (!isSSR && this.hasScript(source)) {
            return;
        }
        const script = this.document.createElement('script');
        script.src = source;
        script.async = true;
        script.defer = true;
        if (attributes) {
            Object.keys(attributes).forEach((key) => {
                // custom attributes
                if (key.startsWith('data-')) {
                    script.setAttribute(key, attributes[key]);
                }
                else {
                    script[key] = attributes[key];
                }
            });
        }
        if (callback) {
            script.addEventListener('load', callback);
        }
        if (errorCallback) {
            script.addEventListener('error', errorCallback);
        }
        placement === ScriptPlacement.HEAD
            ? this.document.head.appendChild(script)
            : this.document.body.appendChild(script);
    }
    /**
     * Indicates if the script is already added to the DOM.
     */
    hasScript(src) {
        return !!this.document.querySelector(`script[src="${src}"]`);
    }
    /**
     * Parses the given object with parameters to a string "param1=value1&param2=value2"
     * @param params object containing parameters
     */
    parseParams(params) {
        let result = '';
        const keysArray = Object.keys(params);
        if (keysArray.length > 0) {
            result =
                '?' +
                    keysArray
                        .map((key) => encodeURI(key) + '=' + encodeURI(params[key]))
                        .join('&');
        }
        return result;
    }
}
ScriptLoader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ScriptLoader, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
ScriptLoader.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ScriptLoader, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ScriptLoader, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: Object, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class TestingTimeUtils {
    static fakeToLocaleTimeString(mockTime, callback) {
        const original = Date.prototype.toLocaleTimeString;
        Date.prototype.toLocaleTimeString = () => mockTime;
        callback();
        Date.prototype.toLocaleTimeString = original;
    }
    static fakeDateTimezoneOffset(offset, callback) {
        const original = Date.prototype.getTimezoneOffset;
        Date.prototype.getTimezoneOffset = () => offset;
        callback();
        Date.prototype.getTimezoneOffset = original;
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class TimeUtils {
    /**
     * Returns the local timezone in a format that can be appended to a date-like string.
     * @param invert (default: false): returns the opposite operator relative to the local timezone
     *
     * @example
     * When locale is set to a CEST timezone, `getLocalTimezoneOffset()` returns '+02:00'
     * and `getLocalTimezoneOffset(true)` returns '-02:00'
     */
    static getLocalTimezoneOffset(invert) {
        const offset = new Date().getTimezoneOffset() * -1;
        const hours = Math.abs(Math.floor(offset / 60))
            .toString()
            .padStart(2, '0');
        const minutes = (offset % 60).toString().padStart(2, '0');
        const sign = offset >= 0 ? (invert ? `-` : `+`) : invert ? `+` : `-`;
        return `${sign}${hours}:${minutes}`;
    }
    static convertDateToDatetime(date, endOfDay) {
        return `${date}T${!endOfDay ? '00:00:00' : '23:59:59'}${TimeUtils.getLocalTimezoneOffset()}`;
    }
    static convertDatetimeToDate(datetime) {
        return new Date(`${datetime.substring(0, 19)}${TimeUtils.getLocalTimezoneOffset(true)}`)
            .toISOString()
            .substring(0, 10);
    }
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CustomerCouponService {
    constructor(store, userIdService) {
        this.store = store;
        this.userIdService = userIdService;
    }
    /**
     * Retrieves customer's coupons
     * @param pageSize page size
     * @param currentPage current page
     * @param sort sort
     */
    loadCustomerCoupons(pageSize, currentPage, sort) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new LoadCustomerCoupons({
                userId,
                pageSize: pageSize,
                currentPage: currentPage,
                sort: sort,
            }));
        });
    }
    /**
     * Returns customer coupon search result
     * @param pageSize page size
     */
    getCustomerCoupons(pageSize) {
        return combineLatest([
            this.store.pipe(select(getCustomerCouponsState)),
            this.getClaimCustomerCouponResultLoading(),
        ]).pipe(filter(([, loading]) => !loading), tap(([customerCouponsState]) => {
            const attemptedLoad = customerCouponsState.loading ||
                customerCouponsState.success ||
                customerCouponsState.error;
            if (!attemptedLoad) {
                this.loadCustomerCoupons(pageSize);
            }
        }), map(([customerCouponsState]) => customerCouponsState.value), filter(isNotUndefined));
    }
    /**
     * Returns a loaded flag for customer coupons
     */
    getCustomerCouponsLoaded() {
        return this.store.pipe(select(getCustomerCouponsLoaded));
    }
    /**
     * Returns a loading flag for customer coupons
     */
    getCustomerCouponsLoading() {
        return this.store.pipe(select(getCustomerCouponsLoading));
    }
    /**
     * Subscribe a CustomerCoupon Notification
     * @param couponCode a customer coupon code
     */
    subscribeCustomerCoupon(couponCode) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new SubscribeCustomerCoupon({
                userId,
                couponCode: couponCode,
            }));
        });
    }
    /**
     * Returns the subscribe customer coupon notification process loading flag
     */
    getSubscribeCustomerCouponResultLoading() {
        return this.store.pipe(select(getProcessLoadingFactory(SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID)));
    }
    /**
     * Returns the subscribe customer coupon notification process success flag
     */
    getSubscribeCustomerCouponResultSuccess() {
        return this.store.pipe(select(getProcessSuccessFactory(SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID)));
    }
    /**
     * Returns the subscribe customer coupon notification process error flag
     */
    getSubscribeCustomerCouponResultError() {
        return this.store.pipe(select(getProcessErrorFactory(SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID)));
    }
    /**
     * Unsubscribe a CustomerCoupon Notification
     * @param couponCode a customer coupon code
     */
    unsubscribeCustomerCoupon(couponCode) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new UnsubscribeCustomerCoupon({
                userId,
                couponCode: couponCode,
            }));
        });
    }
    /**
     * Returns the unsubscribe customer coupon notification process loading flag
     */
    getUnsubscribeCustomerCouponResultLoading() {
        return this.store.pipe(select(getProcessLoadingFactory(UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID)));
    }
    /**
     * Returns the unsubscribe customer coupon notification process success flag
     */
    getUnsubscribeCustomerCouponResultSuccess() {
        return this.store.pipe(select(getProcessSuccessFactory(UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID)));
    }
    /**
     * Returns the unsubscribe customer coupon notification process error flag
     */
    getUnsubscribeCustomerCouponResultError() {
        return this.store.pipe(select(getProcessErrorFactory(UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID)));
    }
    /**
     * Claim a CustomerCoupon
     * @param couponCode a customer coupon code
     */
    claimCustomerCoupon(couponCode) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new ClaimCustomerCoupon({
                userId,
                couponCode,
            }));
        });
    }
    /**
     * Returns the claim customer coupon notification process success flag
     */
    getClaimCustomerCouponResultSuccess() {
        return this.store.pipe(select(getProcessSuccessFactory(CLAIM_CUSTOMER_COUPON_PROCESS_ID)));
    }
    /**
     * Returns the claim customer coupon notification process loading flag
     */
    getClaimCustomerCouponResultLoading() {
        return this.store.pipe(select(getProcessLoadingFactory(CLAIM_CUSTOMER_COUPON_PROCESS_ID)));
    }
}
CustomerCouponService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomerCouponService, deps: [{ token: i1$2.Store }, { token: UserIdService }], target: i0.ɵɵFactoryTarget.Injectable });
CustomerCouponService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomerCouponService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomerCouponService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: UserIdService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserAddressService {
    constructor(store, userIdService, userAddressConnector, command) {
        this.store = store;
        this.userIdService = userIdService;
        this.userAddressConnector = userAddressConnector;
        this.command = command;
        this.userAddressVerificationCommand = this.command.create((payload) => this.userIdService
            .takeUserId(false)
            .pipe(switchMap((userId) => this.userAddressConnector.verify(userId, payload.address))));
    }
    /**
     * Retrieves user's addresses
     */
    loadAddresses() {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new LoadUserAddresses(userId));
        });
    }
    /**
     * Adds user address
     * @param address a user address
     */
    addUserAddress(address) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new AddUserAddress({
                userId,
                address,
            }));
        });
    }
    /**
     * Sets user address as default
     * @param addressId a user address ID
     */
    setAddressAsDefault(addressId) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new UpdateUserAddress({
                userId,
                addressId,
                address: { defaultAddress: true },
            }));
        });
    }
    /**
     * Updates existing user address
     * @param addressId a user address ID
     * @param address a user address
     */
    updateUserAddress(addressId, address) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new UpdateUserAddress({
                userId,
                addressId,
                address,
            }));
        });
    }
    /**
     * Deletes existing user address
     * @param addressId a user address ID
     */
    deleteUserAddress(addressId) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new DeleteUserAddress({
                userId,
                addressId,
            }));
        });
    }
    /**
     * Returns addresses
     */
    getAddresses() {
        return this.store.pipe(select(getAddresses));
    }
    /**
     * Returns a loading flag for addresses
     */
    getAddressesLoading() {
        return this.store.pipe(select(getAddressesLoading));
    }
    getAddressesLoadedSuccess() {
        return this.store.pipe(select(getAddressesLoadedSuccess));
    }
    /**
     * Retrieves delivery countries
     */
    loadDeliveryCountries() {
        this.store.dispatch(new LoadDeliveryCountries());
    }
    /**
     * Returns all delivery countries
     */
    getDeliveryCountries() {
        return this.store.pipe(select(getAllDeliveryCountries));
    }
    /**
     * Returns a country based on the provided `isocode`
     * @param isocode an isocode for a country
     */
    getCountry(isocode) {
        return this.store.pipe(select(countrySelectorFactory(isocode)));
    }
    /**
     * Retrieves regions for specified country by `countryIsoCode`
     * @param countryIsoCode
     */
    loadRegions(countryIsoCode) {
        this.store.dispatch(new LoadRegions(countryIsoCode));
    }
    /**
     * Clear regions in store - useful when changing country
     */
    clearRegions() {
        this.store.dispatch(new ClearRegions());
    }
    /**
     * Returns all regions
     */
    getRegions(countryIsoCode) {
        return this.store.pipe(select(getRegionsDataAndLoading), map(({ regions, country, loading, loaded }) => {
            if (!countryIsoCode && (loading || loaded)) {
                this.clearRegions();
                return [];
            }
            else if (loading && !loaded) {
                // don't interrupt loading
                return [];
            }
            else if (!loading && countryIsoCode !== country && countryIsoCode) {
                // country changed - clear store and load new regions
                if (country) {
                    this.clearRegions();
                }
                this.loadRegions(countryIsoCode);
                return [];
            }
            return regions;
        }));
    }
    /**
     * Verifies the address
     * @param address : the address to be verified
     */
    verifyAddress(address) {
        return this.userAddressVerificationCommand.execute({ address });
    }
}
UserAddressService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAddressService, deps: [{ token: i1$2.Store }, { token: UserIdService }, { token: UserAddressConnector }, { token: CommandService }], target: i0.ɵɵFactoryTarget.Injectable });
UserAddressService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAddressService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAddressService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: UserIdService }, { type: UserAddressConnector }, { type: CommandService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserCostCenterService {
    constructor(store, userIdService) {
        this.store = store;
        this.userIdService = userIdService;
    }
    /**
     * Load all visible active cost centers for the currently login user
     */
    loadActiveCostCenters() {
        this.userIdService.takeUserId(true).subscribe((userId) => {
            this.store.dispatch(new LoadActiveCostCenters(userId));
        }, () => {
            // TODO: for future releases, refactor this part to thrown errors
        });
    }
    getCostCentersState() {
        return this.store.select(getCostCentersState);
    }
    /**
     * Get all visible active cost centers
     */
    getActiveCostCenters() {
        return this.getCostCentersState().pipe(observeOn(queueScheduler), tap((process) => {
            if (!(process.loading || process.success || process.error)) {
                this.loadActiveCostCenters();
            }
        }), filter((process) => Boolean(process.success || process.error)), map((result) => { var _a; return (_a = result.value) !== null && _a !== void 0 ? _a : []; }));
    }
    /**
     * Get the addresses of the cost center's unit based on cost center id
     * @param costCenterId cost center id
     */
    getCostCenterAddresses(costCenterId) {
        return this.getActiveCostCenters().pipe(map((costCenters) => {
            var _a;
            const costCenter = costCenters.find((cc) => cc.code === costCenterId);
            if (costCenter && costCenter.unit) {
                return (_a = costCenter.unit.addresses) !== null && _a !== void 0 ? _a : [];
            }
            else {
                return [];
            }
        }));
    }
}
UserCostCenterService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserCostCenterService, deps: [{ token: i1$2.Store }, { token: UserIdService }], target: i0.ɵɵFactoryTarget.Injectable });
UserCostCenterService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserCostCenterService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserCostCenterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: UserIdService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserInterestsService {
    constructor(store, userIdService) {
        this.store = store;
        this.userIdService = userIdService;
    }
    /**
     * Retrieves an product interest list
     * @param pageSize page size
     * @param currentPage current page
     * @param sort sort
     */
    loadProductInterests(pageSize, currentPage, sort, productCode, notificationType) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new LoadProductInterests({
                userId,
                pageSize: pageSize,
                currentPage: currentPage,
                sort: sort,
                productCode: productCode,
                notificationType: notificationType,
            }));
        });
    }
    /**
     * Returns product interests
     */
    getProductInterests() {
        return this.store.pipe(select(getInterests));
    }
    /**
     * Returns product interests
     * @param pageSize the page size
     */
    getAndLoadProductInterests(pageSize) {
        return this.store.pipe(select(getInterestsState), tap((interestListState) => {
            const attemptedLoad = interestListState.loading ||
                interestListState.success ||
                interestListState.error;
            if (!attemptedLoad) {
                this.loadProductInterests(pageSize);
            }
        }), map((interestListState) => interestListState.value), filter(isNotUndefined));
    }
    /**
     * Returns a loading flag for product interests
     */
    getProdutInterestsLoading() {
        return this.store.pipe(select(getInterestsLoading));
    }
    /**
     * Removes a ProductInterestRelation
     * @param item product interest relation item
     * @param singleDelete flag to delete only one interest
     */
    removeProdutInterest(item, singleDelete) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new RemoveProductInterest({
                userId,
                item: item,
                singleDelete: singleDelete,
            }));
        });
    }
    /**
     * Returns a loading flag for removing product interests.
     */
    getRemoveProdutInterestLoading() {
        return this.store.pipe(select(getProcessLoadingFactory(REMOVE_PRODUCT_INTERESTS_PROCESS_ID)));
    }
    /**
     * Returns a success flag for removing a product interests.
     */
    getRemoveProdutInterestSuccess() {
        return this.store.pipe(select(getProcessSuccessFactory(REMOVE_PRODUCT_INTERESTS_PROCESS_ID)));
    }
    /**
     * Add a new product interest.
     *
     * @param productCode the product code
     * @param notificationType the notification type
     */
    addProductInterest(productCode, notificationType) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new AddProductInterest({
                userId,
                productCode: productCode,
                notificationType: notificationType,
            }));
        });
    }
    /**
     * Returns a success flag for adding a product interest.
     */
    getAddProductInterestSuccess() {
        return this.store.pipe(select(getProcessSuccessFactory(ADD_PRODUCT_INTEREST_PROCESS_ID)));
    }
    /**
     * Returns a error flag for adding a product interest.
     */
    getAddProductInterestError() {
        return this.store.pipe(select(getProcessErrorFactory(ADD_PRODUCT_INTEREST_PROCESS_ID)));
    }
    /**
     * Reset product interest adding state.
     */
    resetAddInterestState() {
        this.store.dispatch(new ResetAddInterestState());
    }
    /**
     * Reset product interest removing state.
     */
    resetRemoveInterestState() {
        this.store.dispatch(new ResetRemoveInterestState());
    }
    /**
     * Clears product interests
     */
    clearProductInterests() {
        this.store.dispatch(new ClearProductInterests());
    }
}
UserInterestsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserInterestsService, deps: [{ token: i1$2.Store }, { token: UserIdService }], target: i0.ɵɵFactoryTarget.Injectable });
UserInterestsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserInterestsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserInterestsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: UserIdService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserNotificationPreferenceService {
    constructor(store, userIdService) {
        this.store = store;
        this.userIdService = userIdService;
    }
    /**
     * Returns all notification preferences.
     */
    getPreferences() {
        return this.store.pipe(select(getPreferences));
    }
    /**
     * Returns all enabled notification preferences.
     */
    getEnabledPreferences() {
        return this.store.pipe(select(getEnabledPreferences));
    }
    /**
     * Loads all notification preferences.
     */
    loadPreferences() {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new LoadNotificationPreferences(userId));
        });
    }
    /**
     * Clear all notification preferences.
     */
    clearPreferences() {
        this.store.dispatch(new ClearNotificationPreferences());
    }
    /**
     * Returns a loading flag for notification preferences.
     */
    getPreferencesLoading() {
        return this.store.pipe(select(getPreferencesLoading));
    }
    /**
     * Updating notification preferences.
     * @param preferences a preference list
     */
    updatePreferences(preferences) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new UpdateNotificationPreferences({
                userId,
                preferences: preferences,
            }));
        });
    }
    /**
     * Returns a loading flag for updating preferences.
     */
    getUpdatePreferencesResultLoading() {
        return this.store.select(getProcessLoadingFactory(UPDATE_NOTIFICATION_PREFERENCES_PROCESS_ID));
    }
    /**
     * Resets the update notification preferences process state. The state needs to be
     * reset after the process concludes, regardless if it's a success or an error.
     */
    resetNotificationPreferences() {
        this.store.dispatch(new ResetNotificationPreferences());
    }
}
UserNotificationPreferenceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserNotificationPreferenceService, deps: [{ token: i1$2.Store }, { token: UserIdService }], target: i0.ɵɵFactoryTarget.Injectable });
UserNotificationPreferenceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserNotificationPreferenceService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserNotificationPreferenceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: UserIdService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserPaymentService {
    constructor(store, userIdService) {
        this.store = store;
        this.userIdService = userIdService;
    }
    /**
     * Loads all user's payment methods.
     */
    loadPaymentMethods() {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new LoadUserPaymentMethods(userId));
        });
    }
    /**
     * Returns all user's payment methods
     */
    getPaymentMethods() {
        return this.store.pipe(select(getPaymentMethods));
    }
    /**
     * Returns a loading flag for payment methods
     */
    getPaymentMethodsLoading() {
        return this.store.pipe(select(getPaymentMethodsLoading));
    }
    getPaymentMethodsLoadedSuccess() {
        return this.store.pipe(select(getPaymentMethodsLoadedSuccess));
    }
    /**
     * Sets the payment as a default one
     * @param paymentMethodId a payment method ID
     */
    setPaymentMethodAsDefault(paymentMethodId) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new SetDefaultUserPaymentMethod({
                userId,
                paymentMethodId,
            }));
        });
    }
    /**
     * Deletes the payment method
     *
     * @param paymentMethodId a payment method ID
     */
    deletePaymentMethod(paymentMethodId) {
        this.userIdService.takeUserId().subscribe((userId) => {
            this.store.dispatch(new DeleteUserPaymentMethod({
                userId,
                paymentMethodId,
            }));
        });
    }
    /**
     * Returns all billing countries
     */
    getAllBillingCountries() {
        return this.store.pipe(select(getAllBillingCountries));
    }
    /**
     * Retrieves billing countries
     */
    loadBillingCountries() {
        this.store.dispatch(new LoadBillingCountries());
    }
}
UserPaymentService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserPaymentService, deps: [{ token: i1$2.Store }, { token: UserIdService }], target: i0.ɵɵFactoryTarget.Injectable });
UserPaymentService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserPaymentService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserPaymentService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Store }, { type: UserIdService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserProfileFacadeTransitionalToken {
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserService {
    constructor(store, userIdService, 
    // TODO: Remove transitional tokens in 4.0 with #11607
    userProfileFacade) {
        this.store = store;
        this.userIdService = userIdService;
        this.userProfileFacade = userProfileFacade;
    }
    /**
     * Returns titles.
     *
     * @deprecated since 3.2, use `UserProfileFacade.getTitles()` from `@spartacus/user` package.
     * We can remove it completely once we move the user-address feature to the User lib.
     */
    getTitles() {
        if (this.userProfileFacade) {
            return this.userProfileFacade.getTitles();
        }
        throw Error('Cannot get a titles. Install `@spartacus/user` library which provides required services.');
    }
}
UserService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserService, deps: [{ token: i1$2.Store }, { token: UserIdService }, { token: UserProfileFacadeTransitionalToken, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
UserService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () {
        return [{ type: i1$2.Store }, { type: UserIdService }, { type: UserProfileFacadeTransitionalToken, decorators: [{
                        type: Optional
                    }] }];
    } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class BillingCountriesEffect {
    constructor(actions$, siteConnector) {
        this.actions$ = actions$;
        this.siteConnector = siteConnector;
        this.loadBillingCountries$ = createEffect(() => this.actions$.pipe(ofType(LOAD_BILLING_COUNTRIES), switchMap(() => {
            return this.siteConnector.getCountries(CountryType.BILLING).pipe(map((countries) => new LoadBillingCountriesSuccess(countries)), catchError((error) => of(new LoadBillingCountriesFail(normalizeHttpError(error)))));
        })));
    }
}
BillingCountriesEffect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BillingCountriesEffect, deps: [{ token: i1$4.Actions }, { token: SiteConnector }], target: i0.ɵɵFactoryTarget.Injectable });
BillingCountriesEffect.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BillingCountriesEffect });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BillingCountriesEffect, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: SiteConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ClearMiscsDataEffect {
    constructor(actions$) {
        this.actions$ = actions$;
        this.clearMiscsData$ = createEffect(() => this.actions$.pipe(ofType(LANGUAGE_CHANGE, CURRENCY_CHANGE), map(() => {
            return new ClearUserMiscsData();
        })));
    }
}
ClearMiscsDataEffect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClearMiscsDataEffect, deps: [{ token: i1$4.Actions }], target: i0.ɵɵFactoryTarget.Injectable });
ClearMiscsDataEffect.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClearMiscsDataEffect });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ClearMiscsDataEffect, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class CustomerCouponEffects {
    constructor(actions$, customerCouponConnector) {
        this.actions$ = actions$;
        this.customerCouponConnector = customerCouponConnector;
        this.loadCustomerCoupons$ = createEffect(() => this.actions$.pipe(ofType(LOAD_CUSTOMER_COUPONS), map((action) => action.payload), mergeMap((payload) => {
            return this.customerCouponConnector
                .getCustomerCoupons(payload.userId, payload.pageSize, payload.currentPage, payload.sort)
                .pipe(map((coupons) => {
                return new LoadCustomerCouponsSuccess(coupons);
            }), catchError((error) => of(new LoadCustomerCouponsFail(normalizeHttpError(error)))));
        })));
        this.subscribeCustomerCoupon$ = createEffect(() => this.actions$.pipe(ofType(SUBSCRIBE_CUSTOMER_COUPON), map((action) => action.payload), mergeMap((payload) => {
            return this.customerCouponConnector
                .turnOnNotification(payload.userId, payload.couponCode)
                .pipe(map((data) => {
                return new SubscribeCustomerCouponSuccess(data);
            }), catchError((error) => of(new SubscribeCustomerCouponFail(normalizeHttpError(error)))));
        })));
        this.unsubscribeCustomerCoupon$ = createEffect(() => this.actions$.pipe(ofType(UNSUBSCRIBE_CUSTOMER_COUPON), map((action) => action.payload), mergeMap((payload) => {
            return this.customerCouponConnector
                .turnOffNotification(payload.userId, payload.couponCode)
                .pipe(map(() => {
                return new UnsubscribeCustomerCouponSuccess(payload.couponCode);
            }), catchError((error) => of(new UnsubscribeCustomerCouponFail(normalizeHttpError(error)))));
        })));
        this.claimCustomerCoupon$ = createEffect(() => this.actions$.pipe(ofType(CLAIM_CUSTOMER_COUPON), map((action) => action.payload), mergeMap((payload) => {
            return this.customerCouponConnector
                .claimCustomerCoupon(payload.userId, payload.couponCode)
                .pipe(map((data) => {
                return new ClaimCustomerCouponSuccess(data);
            }), catchError((error) => of(new ClaimCustomerCouponFail(normalizeHttpError(error)))));
        })));
    }
}
CustomerCouponEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomerCouponEffects, deps: [{ token: i1$4.Actions }, { token: CustomerCouponConnector }], target: i0.ɵɵFactoryTarget.Injectable });
CustomerCouponEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomerCouponEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: CustomerCouponEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: CustomerCouponConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class DeliveryCountriesEffects {
    constructor(actions$, siteConnector) {
        this.actions$ = actions$;
        this.siteConnector = siteConnector;
        this.loadDeliveryCountries$ = createEffect(() => this.actions$.pipe(ofType(LOAD_DELIVERY_COUNTRIES), switchMap(() => {
            return this.siteConnector.getCountries(CountryType.SHIPPING).pipe(map((countries) => new LoadDeliveryCountriesSuccess(countries)), catchError((error) => of(new LoadDeliveryCountriesFail(normalizeHttpError(error)))));
        })));
    }
}
DeliveryCountriesEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: DeliveryCountriesEffects, deps: [{ token: i1$4.Actions }, { token: SiteConnector }], target: i0.ɵɵFactoryTarget.Injectable });
DeliveryCountriesEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: DeliveryCountriesEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: DeliveryCountriesEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: SiteConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class NotificationPreferenceEffects {
    constructor(actions$, connector) {
        this.actions$ = actions$;
        this.connector = connector;
        this.loadPreferences$ = createEffect(() => this.actions$.pipe(ofType(LOAD_NOTIFICATION_PREFERENCES), map((action) => action.payload), switchMap((payload) => this.connector.loadAll(payload).pipe(map((preferences) => new LoadNotificationPreferencesSuccess(preferences)), catchError((error) => of(new LoadNotificationPreferencesFail(normalizeHttpError(error))))))));
        this.updatePreferences$ = createEffect(() => this.actions$.pipe(ofType(UPDATE_NOTIFICATION_PREFERENCES), map((action) => action.payload), mergeMap((payload) => this.connector.update(payload.userId, payload.preferences).pipe(map(() => new UpdateNotificationPreferencesSuccess(payload.preferences)), catchError((error) => of(new UpdateNotificationPreferencesFail(normalizeHttpError(error))))))));
    }
}
NotificationPreferenceEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NotificationPreferenceEffects, deps: [{ token: i1$4.Actions }, { token: UserNotificationPreferenceConnector }], target: i0.ɵɵFactoryTarget.Injectable });
NotificationPreferenceEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NotificationPreferenceEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: NotificationPreferenceEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: UserNotificationPreferenceConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserPaymentMethodsEffects {
    constructor(actions$, userPaymentMethodConnector, globalMessageService) {
        this.actions$ = actions$;
        this.userPaymentMethodConnector = userPaymentMethodConnector;
        this.globalMessageService = globalMessageService;
        this.loadUserPaymentMethods$ = createEffect(() => this.actions$.pipe(ofType(LOAD_USER_PAYMENT_METHODS), map((action) => action.payload), mergeMap((payload) => {
            return this.userPaymentMethodConnector.getAll(payload).pipe(map((payments) => {
                return new LoadUserPaymentMethodsSuccess(payments);
            }), catchError((error) => of(new LoadUserPaymentMethodsFail(normalizeHttpError(error)))));
        })));
        this.setDefaultUserPaymentMethod$ = createEffect(() => this.actions$.pipe(ofType(SET_DEFAULT_USER_PAYMENT_METHOD), map((action) => action.payload), mergeMap((payload) => {
            return this.userPaymentMethodConnector
                .setDefault(payload.userId, payload.paymentMethodId)
                .pipe(switchMap((data) => [
                new SetDefaultUserPaymentMethodSuccess(data),
                new LoadUserPaymentMethods(payload.userId),
            ]), catchError((error) => of(new SetDefaultUserPaymentMethodFail(normalizeHttpError(error)))));
        })));
        this.deleteUserPaymentMethod$ = createEffect(() => this.actions$.pipe(ofType(DELETE_USER_PAYMENT_METHOD), map((action) => action.payload), mergeMap((payload) => {
            return this.userPaymentMethodConnector
                .delete(payload.userId, payload.paymentMethodId)
                .pipe(switchMap((data) => {
                this.globalMessageService.add({ key: 'paymentCard.deletePaymentSuccess' }, GlobalMessageType.MSG_TYPE_CONFIRMATION);
                return [
                    new DeleteUserPaymentMethodSuccess(data),
                    new LoadUserPaymentMethods(payload.userId),
                ];
            }), catchError((error) => of(new DeleteUserPaymentMethodFail(normalizeHttpError(error)))));
        })));
    }
}
UserPaymentMethodsEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserPaymentMethodsEffects, deps: [{ token: i1$4.Actions }, { token: UserPaymentConnector }, { token: GlobalMessageService }], target: i0.ɵɵFactoryTarget.Injectable });
UserPaymentMethodsEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserPaymentMethodsEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserPaymentMethodsEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: UserPaymentConnector }, { type: GlobalMessageService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class ProductInterestsEffect {
    constructor(actions$, userInterestsConnector) {
        this.actions$ = actions$;
        this.userInterestsConnector = userInterestsConnector;
        this.loadProductInteres$ = createEffect(() => this.actions$.pipe(ofType(LOAD_PRODUCT_INTERESTS), map((action) => action.payload), switchMap((payload) => {
            return this.userInterestsConnector
                .getInterests(payload.userId, payload.pageSize, payload.currentPage, payload.sort, payload.productCode, payload.notificationType)
                .pipe(map((interests) => {
                return new LoadProductInterestsSuccess(interests);
            }), catchError((error) => of(new LoadProductInterestsFail(normalizeHttpError(error)))));
        })));
        this.removeProductInterest$ = createEffect(() => this.actions$.pipe(ofType(REMOVE_PRODUCT_INTEREST), map((action) => action.payload), switchMap((payload) => this.userInterestsConnector
            .removeInterest(payload.userId, payload.item)
            .pipe(switchMap((data) => {
            var _a, _b;
            return [
                new LoadProductInterests(payload.singleDelete
                    ? {
                        userId: payload.userId,
                        productCode: (_a = payload.item.product) === null || _a === void 0 ? void 0 : _a.code,
                        notificationType: (_b = payload.item.productInterestEntry) === null || _b === void 0 ? void 0 : _b[0].interestType,
                    }
                    : { userId: payload.userId }),
                new RemoveProductInterestSuccess(data),
            ];
        }), catchError((error) => of(new RemoveProductInterestFail(normalizeHttpError(error))))))));
        this.addProductInterest$ = createEffect(() => this.actions$.pipe(ofType(ADD_PRODUCT_INTEREST), map((action) => action.payload), switchMap((payload) => this.userInterestsConnector
            .addInterest(payload.userId, payload.productCode, payload.notificationType)
            .pipe(switchMap((res) => [
            new LoadProductInterests({
                userId: payload.userId,
                productCode: payload.productCode,
                notificationType: payload.notificationType,
            }),
            new AddProductInterestSuccess(res),
        ]), catchError((error) => of(new AddProductInterestFail(normalizeHttpError(error))))))));
    }
}
ProductInterestsEffect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductInterestsEffect, deps: [{ token: i1$4.Actions }, { token: UserInterestsConnector }], target: i0.ɵɵFactoryTarget.Injectable });
ProductInterestsEffect.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductInterestsEffect });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: ProductInterestsEffect, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: UserInterestsConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class RegionsEffects {
    constructor(actions$, siteConnector) {
        this.actions$ = actions$;
        this.siteConnector = siteConnector;
        this.loadRegions$ = createEffect(() => this.actions$.pipe(ofType(LOAD_REGIONS), map((action) => {
            return action.payload;
        }), switchMap((countryCode) => {
            return this.siteConnector.getRegions(countryCode).pipe(map((regions) => new LoadRegionsSuccess({
                entities: regions,
                country: countryCode,
            })), catchError((error) => of(new LoadRegionsFail(normalizeHttpError(error)))));
        })));
        this.resetRegions$ = createEffect(() => this.actions$.pipe(ofType(CLEAR_USER_MISCS_DATA, CLEAR_REGIONS), map(() => {
            return new LoaderResetAction(REGIONS);
        })));
    }
}
RegionsEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RegionsEffects, deps: [{ token: i1$4.Actions }, { token: SiteConnector }], target: i0.ɵɵFactoryTarget.Injectable });
RegionsEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RegionsEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: RegionsEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: SiteConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserAddressesEffects {
    constructor(actions$, userAddressConnector, userAddressService, messageService) {
        this.actions$ = actions$;
        this.userAddressConnector = userAddressConnector;
        this.userAddressService = userAddressService;
        this.messageService = messageService;
        this.loadUserAddresses$ = createEffect(() => this.actions$.pipe(ofType(LOAD_USER_ADDRESSES), map((action) => action.payload), mergeMap((payload) => {
            return this.userAddressConnector.getAll(payload).pipe(map((addresses) => {
                return new LoadUserAddressesSuccess(addresses);
            }), catchError((error) => of(new LoadUserAddressesFail(normalizeHttpError(error)))));
        })));
        this.addUserAddress$ = createEffect(() => this.actions$.pipe(ofType(ADD_USER_ADDRESS), map((action) => action.payload), mergeMap((payload) => {
            return this.userAddressConnector
                .add(payload.userId, payload.address)
                .pipe(map((data) => {
                return new AddUserAddressSuccess(data);
            }), catchError((error) => of(new AddUserAddressFail(normalizeHttpError(error)))));
        })));
        this.updateUserAddress$ = createEffect(() => this.actions$.pipe(ofType(UPDATE_USER_ADDRESS), map((action) => action.payload), mergeMap((payload) => {
            return this.userAddressConnector
                .update(payload.userId, payload.addressId, payload.address)
                .pipe(map((data) => {
                // don't show the message if just setting address as default
                if (payload.address &&
                    Object.keys(payload.address).length === 1 &&
                    payload.address.defaultAddress) {
                    return new LoadUserAddresses(payload.userId);
                }
                else {
                    return new UpdateUserAddressSuccess(data);
                }
            }), catchError((error) => of(new UpdateUserAddressFail(normalizeHttpError(error)))));
        })));
        this.deleteUserAddress$ = createEffect(() => this.actions$.pipe(ofType(DELETE_USER_ADDRESS), map((action) => action.payload), mergeMap((payload) => {
            return this.userAddressConnector
                .delete(payload.userId, payload.addressId)
                .pipe(map((data) => {
                return new DeleteUserAddressSuccess(data);
            }), catchError((error) => of(new DeleteUserAddressFail(normalizeHttpError(error)))));
        })));
        /**
         *  Reload addresses and notify about add success
         */
        this.showGlobalMessageOnAddSuccess$ = createEffect(() => this.actions$.pipe(ofType(ADD_USER_ADDRESS_SUCCESS), tap(() => {
            this.loadAddresses();
            this.showGlobalMessage('addressForm.userAddressAddSuccess');
        })), { dispatch: false });
        /**
         *  Reload addresses and notify about update success
         */
        this.showGlobalMessageOnUpdateSuccess$ = createEffect(() => this.actions$.pipe(ofType(UPDATE_USER_ADDRESS_SUCCESS), tap(() => {
            this.loadAddresses();
            this.showGlobalMessage('addressForm.userAddressUpdateSuccess');
        })), { dispatch: false });
        /**
         *  Reload addresses and notify about delete success
         */
        this.showGlobalMessageOnDeleteSuccess$ = createEffect(() => this.actions$.pipe(ofType(DELETE_USER_ADDRESS_SUCCESS), tap(() => {
            this.loadAddresses();
            this.showGlobalMessage('addressForm.userAddressDeleteSuccess');
        })), { dispatch: false });
    }
    /**
     * Show global confirmation message with provided text
     */
    showGlobalMessage(text) {
        this.messageService.add({ key: text }, GlobalMessageType.MSG_TYPE_CONFIRMATION);
    }
    loadAddresses() {
        this.userAddressService.loadAddresses();
    }
}
UserAddressesEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAddressesEffects, deps: [{ token: i1$4.Actions }, { token: UserAddressConnector }, { token: UserAddressService }, { token: GlobalMessageService }], target: i0.ɵɵFactoryTarget.Injectable });
UserAddressesEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAddressesEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserAddressesEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: UserAddressConnector }, { type: UserAddressService }, { type: GlobalMessageService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserConsentsEffect {
    constructor(actions$, userConsentConnector) {
        this.actions$ = actions$;
        this.userConsentConnector = userConsentConnector;
        this.resetConsents$ = createEffect(() => this.actions$.pipe(ofType(LANGUAGE_CHANGE), map(() => new ResetLoadUserConsents())));
        this.getConsents$ = createEffect(() => this.actions$.pipe(ofType(LOAD_USER_CONSENTS), map((action) => action.payload), concatMap((userId) => this.userConsentConnector.loadConsents(userId).pipe(map((consents) => new LoadUserConsentsSuccess(consents)), catchError((error) => of(new LoadUserConsentsFail(normalizeHttpError(error))))))));
        this.giveConsent$ = createEffect(() => this.actions$.pipe(ofType(GIVE_USER_CONSENT, TRANSFER_ANONYMOUS_CONSENT), concatMap((action) => {
            var _a, _b;
            return this.userConsentConnector
                .giveConsent(action.payload.userId, (_a = action.payload.consentTemplateId) !== null && _a !== void 0 ? _a : '', (_b = action.payload.consentTemplateVersion) !== null && _b !== void 0 ? _b : 0)
                .pipe(map((consent) => new GiveUserConsentSuccess(consent)), catchError((error) => {
                const errors = [
                    new GiveUserConsentFail(normalizeHttpError(error)),
                ];
                if (action.type === TRANSFER_ANONYMOUS_CONSENT &&
                    error.status === 409) {
                    errors.push(new RemoveMessagesByType(GlobalMessageType.MSG_TYPE_ERROR));
                }
                return of(...errors);
            }));
        })));
        this.withdrawConsent$ = createEffect(() => this.actions$.pipe(ofType(WITHDRAW_USER_CONSENT), map((action) => action.payload), concatMap(({ userId, consentCode }) => this.userConsentConnector.withdrawConsent(userId, consentCode).pipe(map(() => new WithdrawUserConsentSuccess()), catchError((error) => of(new WithdrawUserConsentFail(normalizeHttpError(error))))))));
    }
}
UserConsentsEffect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserConsentsEffect, deps: [{ token: i1$4.Actions }, { token: UserConsentConnector }], target: i0.ɵɵFactoryTarget.Injectable });
UserConsentsEffect.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserConsentsEffect });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserConsentsEffect, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: UserConsentConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserCostCenterEffects {
    constructor(actions$, userCostCenterConnector) {
        this.actions$ = actions$;
        this.userCostCenterConnector = userCostCenterConnector;
        this.loadActiveCostCenters$ = createEffect(() => this.actions$.pipe(ofType(LOAD_ACTIVE_COST_CENTERS), map((action) => action.payload), switchMap((payload) => this.userCostCenterConnector.getActiveList(payload).pipe(
        // TODO(#8875): Should we use here serialize utils?
        map((data) => new LoadActiveCostCentersSuccess(data.values)), catchError((error) => of(new LoadActiveCostCentersFail(normalizeHttpError(error))))))));
    }
}
UserCostCenterEffects.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserCostCenterEffects, deps: [{ token: i1$4.Actions }, { token: UserCostCenterConnector }], target: i0.ɵɵFactoryTarget.Injectable });
UserCostCenterEffects.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserCostCenterEffects });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserCostCenterEffects, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1$4.Actions }, { type: UserCostCenterConnector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const effects = [
    ClearMiscsDataEffect,
    DeliveryCountriesEffects,
    RegionsEffects,
    UserAddressesEffects,
    UserPaymentMethodsEffects,
    BillingCountriesEffect,
    UserConsentsEffect,
    CustomerCouponEffects,
    NotificationPreferenceEffects,
    ProductInterestsEffect,
    UserCostCenterEffects,
];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$9 = {
    entities: {},
};
function reducer$9(state = initialState$9, action) {
    switch (action.type) {
        case LOAD_BILLING_COUNTRIES_SUCCESS: {
            const billingCountries = action.payload;
            const entities = billingCountries.reduce((countryEntities, name) => {
                return Object.assign(Object.assign({}, countryEntities), { [name.isocode]: name });
            }, Object.assign({}, state.entities));
            return Object.assign(Object.assign({}, state), { entities });
        }
        case CLEAR_USER_MISCS_DATA: {
            return initialState$9;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$8 = {
    coupons: [],
    sorts: [],
    pagination: {},
};
function reducer$8(state = initialState$8, action) {
    var _a, _b, _c, _d, _e, _f;
    switch (action.type) {
        case LOAD_CUSTOMER_COUPONS_SUCCESS: {
            return action.payload;
        }
        case SUBSCRIBE_CUSTOMER_COUPON_SUCCESS: {
            const updatedCustomerCoupon = action.payload.coupon;
            const customerCoupons = new Array((_b = (_a = state.coupons) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0);
            (_c = state.coupons) === null || _c === void 0 ? void 0 : _c.forEach((customerCoupon, index) => updatedCustomerCoupon &&
                customerCoupon.couponId === updatedCustomerCoupon.couponId
                ? (customerCoupons[index] = updatedCustomerCoupon)
                : (customerCoupons[index] = customerCoupon));
            return Object.assign(Object.assign({}, state), { coupons: customerCoupons });
        }
        case UNSUBSCRIBE_CUSTOMER_COUPON_SUCCESS: {
            const updatedCouponCode = action.payload;
            const customerCoupons = new Array((_e = (_d = state.coupons) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0);
            (_f = state.coupons) === null || _f === void 0 ? void 0 : _f.forEach((customerCoupon, index) => customerCoupon.couponId === updatedCouponCode
                ? (customerCoupons[index] = Object.assign(Object.assign({}, customerCoupon), { notificationOn: false }))
                : (customerCoupons[index] = customerCoupon));
            return Object.assign(Object.assign({}, state), { coupons: customerCoupons });
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$7 = {
    entities: {},
};
function reducer$7(state = initialState$7, action) {
    switch (action.type) {
        case LOAD_DELIVERY_COUNTRIES_SUCCESS: {
            const deliveryCountries = action.payload;
            const entities = deliveryCountries.reduce((countryEntities, country) => {
                var _a;
                return Object.assign(Object.assign({}, countryEntities), { [(_a = country.isocode) !== null && _a !== void 0 ? _a : '']: country });
            }, Object.assign({}, state.entities));
            return Object.assign(Object.assign({}, state), { entities });
        }
        case CLEAR_USER_MISCS_DATA: {
            return initialState$7;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$6 = [];
function reducer$6(state = initialState$6, action) {
    switch (action.type) {
        case LOAD_NOTIFICATION_PREFERENCES_FAIL: {
            return initialState$6;
        }
        case LOAD_NOTIFICATION_PREFERENCES_SUCCESS:
        case UPDATE_NOTIFICATION_PREFERENCES_SUCCESS: {
            return action.payload ? action.payload : initialState$6;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$5 = [];
function reducer$5(state = initialState$5, action) {
    switch (action.type) {
        case LOAD_USER_PAYMENT_METHODS_SUCCESS: {
            return action.payload ? action.payload : initialState$5;
        }
        case LOAD_USER_PAYMENT_METHODS_FAIL: {
            return initialState$5;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$4 = {
    results: [],
    pagination: {},
    sorts: [],
};
function reducer$4(state = initialState$4, action) {
    switch (action.type) {
        case LOAD_PRODUCT_INTERESTS_SUCCESS: {
            return action.payload ? action.payload : initialState$4;
        }
        case LOAD_PRODUCT_INTERESTS_FAIL: {
            return initialState$4;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$3 = {
    entities: [],
    country: null,
};
function reducer$3(state = initialState$3, action) {
    switch (action.type) {
        case LOAD_REGIONS_SUCCESS: {
            const entities = action.payload.entities;
            const country = action.payload.country;
            if (entities || country) {
                return Object.assign(Object.assign({}, state), { entities,
                    country });
            }
            return initialState$3;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$2 = [];
function reducer$2(state = initialState$2, action) {
    switch (action.type) {
        case LOAD_USER_ADDRESSES_FAIL: {
            return initialState$2;
        }
        case LOAD_USER_ADDRESSES_SUCCESS: {
            return action.payload ? action.payload : initialState$2;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState$1 = [];
function reducer$1(state = initialState$1, action) {
    switch (action.type) {
        case LOAD_USER_CONSENTS_SUCCESS: {
            const consents = action.payload;
            return consents ? consents : initialState$1;
        }
        case GIVE_USER_CONSENT_SUCCESS: {
            const updatedConsentTemplate = action.consentTemplate;
            return state.map((consentTemplate) => consentTemplate.id === updatedConsentTemplate.id
                ? updatedConsentTemplate
                : consentTemplate);
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const initialState = [];
function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_ACTIVE_COST_CENTERS_FAIL: {
            return initialState;
        }
        case LOAD_ACTIVE_COST_CENTERS_SUCCESS: {
            return action.payload ? action.payload : initialState;
        }
    }
    return state;
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function getReducers() {
    return {
        addresses: loaderReducer(USER_ADDRESSES, reducer$2),
        billingCountries: reducer$9,
        consents: loaderReducer(USER_CONSENTS, reducer$1),
        payments: loaderReducer(USER_PAYMENT_METHODS, reducer$5),
        countries: reducer$7,
        regions: loaderReducer(REGIONS, reducer$3),
        customerCoupons: loaderReducer(CUSTOMER_COUPONS, reducer$8),
        notificationPreferences: loaderReducer(NOTIFICATION_PREFERENCES, reducer$6),
        productInterests: loaderReducer(PRODUCT_INTERESTS, reducer$4),
        costCenters: loaderReducer(USER_COST_CENTERS, reducer),
    };
}
const reducerToken = new InjectionToken('UserReducers');
const reducerProvider = {
    provide: reducerToken,
    useFactory: getReducers,
};
function clearUserState(reducer) {
    return function (state, action) {
        if (action.type === LOGOUT) {
            state = undefined;
        }
        return reducer(state, action);
    };
}
const metaReducers = [clearUserState];

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserStoreModule {
}
UserStoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserStoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
UserStoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: UserStoreModule, imports: [CommonModule,
        StateModule, i1$2.StoreFeatureModule, i1$4.EffectsFeatureModule, RouterModule] });
UserStoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserStoreModule, providers: [reducerProvider], imports: [CommonModule,
        StateModule,
        StoreModule.forFeature(USER_FEATURE, reducerToken, { metaReducers }),
        EffectsModule.forFeature(effects),
        RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserStoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        StateModule,
                        StoreModule.forFeature(USER_FEATURE, reducerToken, { metaReducers }),
                        EffectsModule.forFeature(effects),
                        RouterModule,
                    ],
                    providers: [reducerProvider],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class UserModule {
    static forRoot() {
        return {
            ngModule: UserModule,
        };
    }
}
UserModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
UserModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: UserModule, imports: [UserStoreModule, UserEventModule] });
UserModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserModule, providers: [UserEventBuilder], imports: [UserStoreModule, UserEventModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: UserModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [UserStoreModule, UserEventModule],
                    providers: [UserEventBuilder],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class FeatureModulesService {
    constructor(cmsConfig, lazyModules) {
        this.cmsConfig = cmsConfig;
        this.lazyModules = lazyModules;
        /*
         * Contains resolvers for features.
         * Each resolver runs only once and caches the result.
         */
        this.features = new Map();
    }
    /**
     * Check if feature is configured properly by providing module the shell app
     *
     * @param featureName
     */
    isConfigured(featureName) {
        var _a;
        return !!((_a = this.getFeatureConfig(featureName)) === null || _a === void 0 ? void 0 : _a.module);
    }
    /**
     * Resolve feature based on feature name, if feature was not yet resolved
     *
     * It will first resolve all module dependencies if defined
     */
    resolveFeature(featureName) {
        featureName = this.resolveFeatureAlias(featureName);
        return defer(() => {
            if (!this.features.has(featureName)) {
                if (!this.isConfigured(featureName)) {
                    return throwError(new Error('No module defined for Feature Module ' + featureName));
                }
                const featureConfig = this.getFeatureConfig(featureName);
                this.features.set(featureName, this.resolveDependencies(featureConfig === null || featureConfig === void 0 ? void 0 : featureConfig.dependencies).pipe(switchMap((deps) => this.lazyModules.resolveModuleInstance(featureConfig === null || featureConfig === void 0 ? void 0 : featureConfig.module, featureName, deps)), shareReplay()));
            }
            return this.features.get(featureName);
        });
    }
    /**
     * Resolve
     * @param featureName
     * @protected
     */
    getFeatureConfig(featureName) {
        var _a;
        return (_a = this.cmsConfig.featureModules) === null || _a === void 0 ? void 0 : _a[this.resolveFeatureAlias(featureName)];
    }
    /**
     * Will return target feature name, resolving optional feature to feature
     * string mapping
     *
     * @param featureName
     * @protected
     */
    resolveFeatureAlias(featureName) {
        var _a, _b;
        while (typeof ((_a = this.cmsConfig.featureModules) === null || _a === void 0 ? void 0 : _a[featureName]) === 'string') {
            featureName = (_b = this.cmsConfig.featureModules) === null || _b === void 0 ? void 0 : _b[featureName];
        }
        return featureName;
    }
    /**
     * Resolve dependency modules for the feature
     *
     * @param dependencies
     * @protected
     */
    resolveDependencies(dependencies = []) {
        return (dependencies === null || dependencies === void 0 ? void 0 : dependencies.length)
            ? forkJoin(dependencies.map((dependency) => {
                if (typeof dependency === 'string') {
                    // dependency is a feature, referenced by a feature name
                    return this.resolveFeature(dependency);
                }
                // resolve dependency from a module function
                return this.lazyModules.resolveDependencyModuleInstance(dependency);
            }))
            : of(undefined);
    }
}
FeatureModulesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureModulesService, deps: [{ token: CmsConfig }, { token: LazyModulesService }], target: i0.ɵɵFactoryTarget.Injectable });
FeatureModulesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureModulesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FeatureModulesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: CmsConfig }, { type: LazyModulesService }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const PROXY_FACADE_INSTANCE_PROP = 'proxyFacadeInstance';
/**
 * Service that can create proxy facade, which is a service that will expose
 * methods and properties from a facade implemented in the lazy loaded module.
 *
 * Returned proxy facade will lazy load the feature and facade implementation
 * at first method call or when first property observable will be subscribed.
 */
class FacadeFactoryService {
    constructor(featureModules, injector) {
        this.featureModules = featureModules;
        this.injector = injector;
    }
    getResolver(feature, facadeClass, async = false) {
        if (!this.featureModules.isConfigured(feature)) {
            return throwError(new Error(`Feature ${feature} is not configured properly`));
        }
        let facadeService$ = this.featureModules.resolveFeature(feature).pipe(map((moduleRef) => moduleRef.injector), map((injector) => injector.get(facadeClass)));
        if (async) {
            facadeService$ = facadeService$.pipe(delay(0));
        }
        return facadeService$.pipe(shareReplay());
    }
    /**
     * Calls a method on a facade
     *
     * Method should either return an observable or void. Any other return type
     * than observable is ignored.
     *
     * @param resolver$
     * @param method
     * @param args
     * @protected
     */
    call(resolver$, method, args) {
        const callResult$ = resolver$.pipe(map((service) => service[method](...args)), publishReplay());
        callResult$.connect();
        return callResult$.pipe(switchMap((result) => {
            if (isObservable(result)) {
                return result;
            }
            return EMPTY;
        }));
    }
    /**
     * Get the property value from the facade
     *
     * Property has to be an aobservable
     *
     * @param resolver$
     * @param property
     * @protected
     */
    get(resolver$, property) {
        return resolver$.pipe(switchMap((service) => service[property]));
    }
    create({ facade, feature, methods, properties, async, }) {
        const resolver$ = this.getResolver(feature, facade, async);
        const result = new (class extends facade {
        })();
        (methods !== null && methods !== void 0 ? methods : []).forEach((method) => {
            result[method] = (...args) => this.call(resolver$, method, args);
        });
        (properties !== null && properties !== void 0 ? properties : []).forEach((property) => {
            result[property] = this.get(resolver$, property);
        });
        result[PROXY_FACADE_INSTANCE_PROP] = true;
        return result;
    }
    /**
     * isProxyFacadeInstance tests if the provided facade is labeled as a proxy instance.
     * Facade proxy instances contain an object key to label them as such.
     * @param facade The facade object to evaluate
     */
    isProxyFacadeInstance(facade) {
        return !!(facade === null || facade === void 0 ? void 0 : facade[PROXY_FACADE_INSTANCE_PROP]);
    }
}
FacadeFactoryService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FacadeFactoryService, deps: [{ token: FeatureModulesService }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
FacadeFactoryService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FacadeFactoryService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: FacadeFactoryService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: FeatureModulesService }, { type: i0.Injector }]; } });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Factory that will create proxy facade, which is a service that will expose
 * methods and properties from a facade implemented in the lazy loaded module.
 *
 * Returned proxy facade will lazy load the feature and facade implementation
 * at first method call or when first property observable will be subscribed.
 *
 * @param descriptor
 */
function facadeFactory(descriptor) {
    return inject(FacadeFactoryService).create(descriptor);
}

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
function moduleInitializersFactory(lazyModuleService, moduleInitializerFunctions) {
    const factoryFunction = () => {
        return Promise.all(lazyModuleService.runModuleInitializerFunctions(moduleInitializerFunctions)).catch((error) => {
            console.error('MODULE_INITIALIZER promise was rejected during app initialization.', error);
            throw error;
        });
    };
    return factoryFunction;
}
class LazyLoadingModule {
    static forRoot() {
        return {
            ngModule: LazyLoadingModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    useFactory: moduleInitializersFactory,
                    deps: [LazyModulesService, [new Optional(), MODULE_INITIALIZER]],
                    multi: true,
                },
            ],
        };
    }
}
LazyLoadingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LazyLoadingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
LazyLoadingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: LazyLoadingModule });
LazyLoadingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LazyLoadingModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: LazyLoadingModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
class BaseCoreModule {
    static forRoot() {
        return {
            ngModule: BaseCoreModule,
        };
    }
}
BaseCoreModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseCoreModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
BaseCoreModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.3", ngImport: i0, type: BaseCoreModule, imports: [StateModule, ConfigModule, ConfigInitializerModule, ConfigValidatorModule, I18nModule, CmsModule, GlobalMessageModule, ProcessModule, FeaturesConfigModule, SiteContextModule, MetaTagConfigModule, BaseOccModule, LazyLoadingModule] });
BaseCoreModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseCoreModule, imports: [StateModule.forRoot(),
        ConfigModule.forRoot(),
        ConfigInitializerModule.forRoot(),
        ConfigValidatorModule.forRoot(),
        I18nModule.forRoot(),
        CmsModule.forRoot(),
        GlobalMessageModule.forRoot(),
        ProcessModule.forRoot(),
        FeaturesConfigModule.forRoot(),
        SiteContextModule.forRoot(),
        MetaTagConfigModule.forRoot(),
        BaseOccModule.forRoot(),
        LazyLoadingModule.forRoot()] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.3", ngImport: i0, type: BaseCoreModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        StateModule.forRoot(),
                        ConfigModule.forRoot(),
                        ConfigInitializerModule.forRoot(),
                        ConfigValidatorModule.forRoot(),
                        I18nModule.forRoot(),
                        CmsModule.forRoot(),
                        GlobalMessageModule.forRoot(),
                        ProcessModule.forRoot(),
                        FeaturesConfigModule.forRoot(),
                        SiteContextModule.forRoot(),
                        MetaTagConfigModule.forRoot(),
                        BaseOccModule.forRoot(),
                        LazyLoadingModule.forRoot(),
                    ],
                }]
        }] });

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/** AUGMENTABLE_TYPES_END */

/**
 * Generated bundle index. Do not edit.
 */

export { ADDRESS_LIST_NORMALIZER, ADDRESS_NORMALIZER, ADDRESS_SERIALIZER, ADDRESS_VALIDATION_NORMALIZER, ADD_PRODUCT_INTEREST_PROCESS_ID, ANONYMOUS_CONSENTS, ANONYMOUS_CONSENTS_HEADER, ANONYMOUS_CONSENTS_STORE_FEATURE, ANONYMOUS_CONSENT_NORMALIZER, ANONYMOUS_CONSENT_STATUS, ActivatedRoutesService, AddUserAddressEvent, AnonymousConsentNormalizer, AnonymousConsentTemplatesAdapter, AnonymousConsentTemplatesConnector, anonymousConsentsGroup as AnonymousConsentsActions, AnonymousConsentsConfig, AnonymousConsentsInterceptor, AnonymousConsentsModule, anonymousConsentsGroup_selectors as AnonymousConsentsSelectors, AnonymousConsentsService, AnonymousConsentsStatePersistenceService, authGroup_actions as AuthActions, AuthConfig, AuthConfigService, AuthFlowRoutesService, AuthGuard, AuthHttpHeaderService, AuthInterceptor, AuthModule, AuthRedirectService, AuthRedirectStorageService, AuthService, AuthStatePersistenceService, AuthStorageService, B2BUserRole, BASE_SITE_CONTEXT_ID, BASE_SITE_NORMALIZER, BadGatewayHandler, BadRequestHandler, BaseCoreModule, BaseOccModule, BasePageMetaResolver, BaseSiteInitializer, BaseSiteNormalizer, BaseSiteService, CLAIM_CUSTOMER_COUPON_PROCESS_ID, CLIENT_AUTH_FEATURE, CLIENT_TOKEN_DATA, CMS_COMPONENT_NORMALIZER, CMS_FEATURE, CMS_FLEX_COMPONENT_TYPE, CMS_PAGE_NORMALIZER, COMPONENT_ENTITY, CONFIG_INITIALIZER, CONSENT_TEMPLATE_NORMALIZER, COST_CENTERS_NORMALIZER, COST_CENTER_NORMALIZER, COST_CENTER_SERIALIZER, COUNTRY_NORMALIZER, CURRENCY_CONTEXT_ID, CURRENCY_NORMALIZER, CUSTOMER_COUPONS, CUSTOMER_COUPON_SEARCH_RESULT_NORMALIZER, CategoryPageMetaResolver, clientTokenGroup_actions as ClientAuthActions, ClientAuthModule, clientTokenGroup_selectors as ClientAuthSelectors, ClientAuthenticationTokenService, ClientErrorHandlingService, ClientTokenInterceptor, ClientTokenService, cmsGroup_actions as CmsActions, CmsBannerCarouselEffect, CmsComponentAdapter, CmsComponentConnector, CmsConfig, CmsModule, CmsOccModule, CmsPageAdapter, CmsPageConnector, cmsGroup_selectors as CmsSelectors, CmsService, CmsStructureConfig, CmsStructureConfigService, Command, CommandService, CommandStrategy, ComponentDecorator, Config, ConfigChunk, ConfigInitializerModule, ConfigInitializerService, ConfigModule, ConfigValidatorModule, ConfigValidatorToken, ConfigurableRoutesService, ConfigurationService, ConflictHandler, ConsentService, ContainerBackgroundOptions, ContainerSizeOptions, ContentPageMetaResolver, ContextServiceMap, ConverterService, CostCenterModule, CostCenterOccModule, CountryType, CurrencyInitializer, CurrencyService, CurrencySetEvent, CurrencyStatePersistenceService, CustomerCouponAdapter, CustomerCouponConnector, CustomerCouponService, CxDatePipe, CxEvent, CxNumericPipe, DEFAULT_SCOPE, DEFAULT_URL_MATCHER, DefaultConfig, DefaultConfigChunk, DefaultRoutePageMetaResolver, DeferLoadingStrategy, DeleteUserAddressEvent, DynamicAttributeService, EMAIL_PATTERN, EventService, ExternalRoutesConfig, ExternalRoutesGuard, ExternalRoutesModule, ExternalRoutesService, FacadeFactoryService, FacetChangedEvent, FeatureConfigService, FeatureDirective, FeatureLevelDirective, FeatureModulesService, FeaturesConfig, FeaturesConfigModule, ForbiddenHandler, GIVE_CONSENT_PROCESS_ID, GLOBAL_MESSAGE_FEATURE, GatewayTimeoutHandler, GlobService, globalMessageGroup_actions as GlobalMessageActions, GlobalMessageConfig, GlobalMessageModule, globalMessageGroup_selectors as GlobalMessageSelectors, GlobalMessageService, GlobalMessageType, HOME_PAGE_CONTEXT, HttpErrorHandler, HttpErrorModel, HttpParamsURIEncoder, HttpResponseStatus, I18nConfig, I18nConfigInitializer, I18nModule, I18nTestingModule, I18nextTranslationService, ImageType, InterceptorUtil, InternalServerErrorHandler, JSP_INCLUDE_CMS_COMPONENT_TYPE, JavaRegExpConverter, LANGUAGE_CONTEXT_ID, LANGUAGE_NORMALIZER, LanguageInitializer, LanguageService, LanguageSetEvent, LanguageStatePersistenceService, LazyModulesService, LegacyOccCmsComponentAdapter, LoadUserAddressesEvent, LoadUserPaymentMethodsEvent, LoadingScopesService, LoginEvent, LogoutEvent, MEDIA_BASE_URL_META_TAG_NAME, MEDIA_BASE_URL_META_TAG_PLACEHOLDER, MODULE_INITIALIZER, MetaTagConfigModule, MockDatePipe, MockTranslatePipe, ModuleInitializedEvent, NAVIGATION_DETAIL_ENTITY, NOTIFICATION_PREFERENCES, NotAuthGuard, NotFoundHandler, NotificationType, OAuthFlow, OAuthLibWrapperService, OCC_BASE_URL_META_TAG_NAME, OCC_BASE_URL_META_TAG_PLACEHOLDER, OCC_CART_ID_CURRENT, OCC_USER_ID_ANONYMOUS, OCC_USER_ID_CURRENT, OCC_USER_ID_GUEST, Occ, OccAnonymousConsentTemplatesAdapter, OccCmsComponentAdapter, OccCmsPageAdapter, OccCmsPageNormalizer, OccConfig, OccCostCenterListNormalizer, OccCostCenterNormalizer, OccCostCenterSerializer, OccCustomerCouponAdapter, OccEndpointsService, OccFieldsService, OccProductAdapter, OccProductReferencesAdapter, OccProductReferencesListNormalizer, OccProductReviewsAdapter, OccProductSearchAdapter, OccProductSearchPageNormalizer, OccRequestsOptimizerService, OccSiteAdapter, OccUserAddressAdapter, OccUserConsentAdapter, OccUserInterestsAdapter, OccUserInterestsNormalizer, OccUserNotificationPreferenceAdapter, OccUserPaymentAdapter, PASSWORD_PATTERN, PAYMENT_DETAILS_NORMALIZER, POINT_OF_SERVICE_NORMALIZER, PROCESS_FEATURE, PRODUCT_DETAIL_ENTITY, PRODUCT_FEATURE, PRODUCT_INTERESTS, PRODUCT_INTERESTS_NORMALIZER, PRODUCT_NORMALIZER, PRODUCT_REFERENCES_NORMALIZER, PRODUCT_REVIEW_NORMALIZER, PRODUCT_REVIEW_SERIALIZER, PRODUCT_SEARCH_PAGE_NORMALIZER, PRODUCT_SUGGESTION_NORMALIZER, PageContext, PageLinkService, PageMetaConfig, PageMetaModule, PageMetaResolver, PageMetaService, PageRobotsMeta, PageType, PriceType, ProcessModule, process_selectors as ProcessSelectors, productGroup_actions as ProductActions, ProductAdapter, ProductConnector, ProductEventBuilder, ProductEventModule, ProductImageNormalizer, ProductLoadingService, ProductModule, ProductNameNormalizer, ProductOccModule, ProductPageMetaResolver, ProductReferenceNormalizer, ProductReferenceService, ProductReferencesAdapter, ProductReferencesConnector, ProductReviewService, ProductReviewsAdapter, ProductReviewsConnector, ProductSearchAdapter, ProductSearchConnector, ProductSearchService, productGroup_selectors as ProductSelectors, ProductService, ProductURLPipe, ProtectedRoutesGuard, ProtectedRoutesService, QueryService, REGIONS, REGION_NORMALIZER, REGISTER_USER_PROCESS_ID, REMOVE_PRODUCT_INTERESTS_PROCESS_ID, ROUTING_FEATURE, RootConfig, routingGroup_actions as RoutingActions, RoutingConfig, RoutingConfigService, RoutingModule, RoutingPageMetaResolver, RoutingParamsService, routingGroup_selectors as RoutingSelector, RoutingService, SERVER_REQUEST_ORIGIN, SERVER_REQUEST_URL, SITE_CONTEXT_FEATURE, SMART_EDIT_CONTEXT, SUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID, ScriptLoader, ScriptPlacement, ScrollBehavior, SearchPageMetaResolver, SearchboxService, SemanticPathService, SiteAdapter, SiteConnector, siteContextGroup_actions as SiteContextActions, SiteContextConfig, SiteContextConfigInitializer, SiteContextEventBuilder, SiteContextEventModule, SiteContextInterceptor, SiteContextModule, SiteContextOccModule, SiteContextParamsService, siteContextGroup_selectors as SiteContextSelectors, SiteContextUrlSerializer, SlotDecorator, StateConfig, StateEventService, StateModule, StatePersistenceService, StateTransferType, utilsGroup as StateUtils, StorageSyncType, StringTemplate, THEME_CONTEXT_ID, TestConfigModule, TestingTimeUtils, TimeUtils, TokenRevocationInterceptor, TranslatePipe, TranslationChunkService, TranslationService, UNSUBSCRIBE_CUSTOMER_COUPON_PROCESS_ID, UPDATE_NOTIFICATION_PREFERENCES_PROCESS_ID, USER_ADDRESSES, USER_CONSENTS, USER_COST_CENTERS, USER_FEATURE, USER_PAYMENT_METHODS, USE_CLIENT_TOKEN, USE_CUSTOMER_SUPPORT_AGENT_TOKEN, UnifiedInjector, UnknownErrorHandler, UpdateUserAddressEvent, UrlMatcherService, UrlModule, UrlParsingService, UrlPipe, userGroup_actions as UserActions, UserAddressAdapter, UserAddressConnector, UserAddressEvent, UserAddressService, UserAuthEventBuilder, UserAuthEventModule, UserAuthModule, UserConsentAdapter, UserConsentConnector, UserConsentService, UserCostCenterAdapter, UserCostCenterConnector, UserCostCenterService, UserEventBuilder, UserEventModule, UserIdService, UserInterestsAdapter, UserInterestsConnector, UserInterestsService, UserModule, UserNotificationPreferenceService, UserOccModule, UserPaymentAdapter, UserPaymentConnector, UserPaymentService, UserProfileFacadeTransitionalToken, UserService, usersGroup_selectors as UsersSelectors, VariantQualifier, VariantType, WITHDRAW_CONSENT_PROCESS_ID, WindowRef, WithCredentialsInterceptor, backOff, configInitializerFactory, configValidatorFactory, contextServiceMapProvider, createFrom, deepMerge, defaultAnonymousConsentsConfig, defaultCmsModuleConfig, defaultOccConfig, defaultPageMetaConfig, errorHandlers, facadeFactory, getContextParameterDefault, getContextParameterValues, getLastValueSync, httpErrorInterceptors, initConfigurableRoutes, isFeatureEnabled, isFeatureLevel, isJaloError, isNotNullable, isNotUndefined, isObject, locationInitializedFactory, mediaServerConfigFromMetaTagFactory, normalizeHttpError, occConfigValidator, occServerConfigFromMetaTagFactory, provideConfig, provideConfigFactory, provideConfigFromMetaTags, provideConfigValidator, provideDefaultConfig, provideDefaultConfigFactory, resolveApplicable, serviceMapFactory, uniteLatest, urlPathJoin, validateConfig, withdrawOn };
//# sourceMappingURL=spartacus-core.mjs.map
