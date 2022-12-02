/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { EMAIL_PATTERN, OCC_USER_ID_ANONYMOUS, } from '@spartacus/core';
/**
 * Extract cart identifier for current user. Anonymous calls use `guid` and for logged users `code` is used.
 */
export function getCartIdByUserId(cart, userId) {
    if (userId === OCC_USER_ID_ANONYMOUS) {
        return cart?.guid ?? '';
    }
    return cart?.code ?? '';
}
/**
 * Check if cart is selective (save for later) based on id.
 */
export function isSelectiveCart(cartId = '') {
    return cartId.startsWith('selectivecart');
}
/**
 * Check if the returned error is of type notFound.
 *
 * We additionally check if the cart is not a selective cart.
 * For selective cart this error can happen only when extension is disabled.
 * It should never happen, because in that case, selective cart should also be disabled in our configuration.
 * However if that happens we want to handle these errors silently.
 */
export function isCartNotFoundError(error) {
    return (error.reason === 'notFound' &&
        error.subjectType === 'cart' &&
        !isSelectiveCart(error.subject));
}
export function voucherExceededError(error) {
    return error.message === 'coupon.already.redeemed';
}
export function voucherInvalidError(error) {
    return error.message === 'coupon.invalid.code.provided';
}
export function isVoucherError(error) {
    return error.type === 'VoucherOperationError';
}
export function isCartError(error) {
    return (error.type === 'CartError' ||
        error.type === 'CartAddressError' ||
        error.type === 'CartEntryError' ||
        error.type === 'CartEntryGroupError');
}
/**
 * What is a temporary cart?
 * - frontend only cart entity!
 * - can be identified in store by `temp-` prefix with some unique id (multiple carts can be created at the same time eg. active cart, wishlist)
 *
 * Why we need temporary carts?
 * - to have information about cart creation process (meta flags: loading, error - for showing loader, error message)
 * - to know if there is currently a cart creation process in progress (eg. so, we don't create more than one active cart at the same time)
 * - cart identifiers are created in the backend, so those are only known after cart is created
 *
 * Temporary cart life cycle
 * - create cart method invoked
 * - new `temp-${uuid}` cart is created with `loading=true` state
 * - backend returns created cart
 * - normal cart entity is saved under correct id (eg. for logged user under cart `code` key)
 * - temporary cart value is set to backend response (anyone observing this cart can read code/guid from it and switch selector to normal cart)
 * - in next tick temporary cart is removed
 */
export function isTempCartId(cartId) {
    return cartId.startsWith('temp-');
}
/**
 * Indicates if given cart is empty.
 * Returns true is cart is undefined, null or is an empty object.
 */
export function isEmpty(cart) {
    return !cart || (typeof cart === 'object' && Object.keys(cart).length === 0);
}
/**
 * Indicates if given string is matching email pattern
 */
export function isEmail(str) {
    if (str) {
        return str.match(EMAIL_PATTERN) ? true : false;
    }
    return false;
}
/**
 * Indicates if a given user is logged in on account different than preceding user account
 */
export function isJustLoggedIn(userId, previousUserId) {
    return (userId !== OCC_USER_ID_ANONYMOUS && // not logged out
        previousUserId !== userId // *just* logged in / switched to ASM emulation
    );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9mZWF0dXJlLWxpYnMvY2FydC9iYXNlL2NvcmUvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUdILE9BQU8sRUFDTCxhQUFhLEVBRWIscUJBQXFCLEdBQ3RCLE1BQU0saUJBQWlCLENBQUM7QUFFekI7O0dBRUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsSUFBVyxFQUFFLE1BQWU7SUFDNUQsSUFBSSxNQUFNLEtBQUsscUJBQXFCLEVBQUU7UUFDcEMsT0FBTyxJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQztLQUN6QjtJQUNELE9BQU8sSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUM7QUFDMUIsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBQyxNQUFNLEdBQUcsRUFBRTtJQUN6QyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsS0FBaUI7SUFDbkQsT0FBTyxDQUNMLEtBQUssQ0FBQyxNQUFNLEtBQUssVUFBVTtRQUMzQixLQUFLLENBQUMsV0FBVyxLQUFLLE1BQU07UUFDNUIsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUNoQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxLQUFpQjtJQUNwRCxPQUFPLEtBQUssQ0FBQyxPQUFPLEtBQUsseUJBQXlCLENBQUM7QUFDckQsQ0FBQztBQUVELE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxLQUFpQjtJQUNuRCxPQUFPLEtBQUssQ0FBQyxPQUFPLEtBQUssOEJBQThCLENBQUM7QUFDMUQsQ0FBQztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsS0FBaUI7SUFDOUMsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLHVCQUF1QixDQUFDO0FBQ2hELENBQUM7QUFFRCxNQUFNLFVBQVUsV0FBVyxDQUFDLEtBQWlCO0lBQzNDLE9BQU8sQ0FDTCxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVc7UUFDMUIsS0FBSyxDQUFDLElBQUksS0FBSyxrQkFBa0I7UUFDakMsS0FBSyxDQUFDLElBQUksS0FBSyxnQkFBZ0I7UUFDL0IsS0FBSyxDQUFDLElBQUksS0FBSyxxQkFBcUIsQ0FDckMsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLE1BQWM7SUFDekMsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BDLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUFDLElBQVc7SUFDakMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMvRSxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsT0FBTyxDQUFDLEdBQVk7SUFDbEMsSUFBSSxHQUFHLEVBQUU7UUFDUCxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0tBQ2hEO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUM1QixNQUFjLEVBQ2QsY0FBc0I7SUFFdEIsT0FBTyxDQUNMLE1BQU0sS0FBSyxxQkFBcUIsSUFBSSxpQkFBaUI7UUFDckQsY0FBYyxLQUFLLE1BQU0sQ0FBQywrQ0FBK0M7S0FDMUUsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogU1BEWC1GaWxlQ29weXJpZ2h0VGV4dDogMjAyMiBTQVAgU3BhcnRhY3VzIHRlYW0gPHNwYXJ0YWN1cy10ZWFtQHNhcC5jb20+XG4gKlxuICogU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IEFwYWNoZS0yLjBcbiAqL1xuXG5pbXBvcnQgeyBDYXJ0IH0gZnJvbSAnQHNwYXJ0YWN1cy9jYXJ0L2Jhc2Uvcm9vdCc7XG5pbXBvcnQge1xuICBFTUFJTF9QQVRURVJOLFxuICBFcnJvck1vZGVsLFxuICBPQ0NfVVNFUl9JRF9BTk9OWU1PVVMsXG59IGZyb20gJ0BzcGFydGFjdXMvY29yZSc7XG5cbi8qKlxuICogRXh0cmFjdCBjYXJ0IGlkZW50aWZpZXIgZm9yIGN1cnJlbnQgdXNlci4gQW5vbnltb3VzIGNhbGxzIHVzZSBgZ3VpZGAgYW5kIGZvciBsb2dnZWQgdXNlcnMgYGNvZGVgIGlzIHVzZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYXJ0SWRCeVVzZXJJZChjYXJ0PzogQ2FydCwgdXNlcklkPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKHVzZXJJZCA9PT0gT0NDX1VTRVJfSURfQU5PTllNT1VTKSB7XG4gICAgcmV0dXJuIGNhcnQ/Lmd1aWQgPz8gJyc7XG4gIH1cbiAgcmV0dXJuIGNhcnQ/LmNvZGUgPz8gJyc7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgY2FydCBpcyBzZWxlY3RpdmUgKHNhdmUgZm9yIGxhdGVyKSBiYXNlZCBvbiBpZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2VsZWN0aXZlQ2FydChjYXJ0SWQgPSAnJyk6IGJvb2xlYW4ge1xuICByZXR1cm4gY2FydElkLnN0YXJ0c1dpdGgoJ3NlbGVjdGl2ZWNhcnQnKTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgcmV0dXJuZWQgZXJyb3IgaXMgb2YgdHlwZSBub3RGb3VuZC5cbiAqXG4gKiBXZSBhZGRpdGlvbmFsbHkgY2hlY2sgaWYgdGhlIGNhcnQgaXMgbm90IGEgc2VsZWN0aXZlIGNhcnQuXG4gKiBGb3Igc2VsZWN0aXZlIGNhcnQgdGhpcyBlcnJvciBjYW4gaGFwcGVuIG9ubHkgd2hlbiBleHRlbnNpb24gaXMgZGlzYWJsZWQuXG4gKiBJdCBzaG91bGQgbmV2ZXIgaGFwcGVuLCBiZWNhdXNlIGluIHRoYXQgY2FzZSwgc2VsZWN0aXZlIGNhcnQgc2hvdWxkIGFsc28gYmUgZGlzYWJsZWQgaW4gb3VyIGNvbmZpZ3VyYXRpb24uXG4gKiBIb3dldmVyIGlmIHRoYXQgaGFwcGVucyB3ZSB3YW50IHRvIGhhbmRsZSB0aGVzZSBlcnJvcnMgc2lsZW50bHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0NhcnROb3RGb3VuZEVycm9yKGVycm9yOiBFcnJvck1vZGVsKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgZXJyb3IucmVhc29uID09PSAnbm90Rm91bmQnICYmXG4gICAgZXJyb3Iuc3ViamVjdFR5cGUgPT09ICdjYXJ0JyAmJlxuICAgICFpc1NlbGVjdGl2ZUNhcnQoZXJyb3Iuc3ViamVjdClcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZvdWNoZXJFeGNlZWRlZEVycm9yKGVycm9yOiBFcnJvck1vZGVsKTogYm9vbGVhbiB7XG4gIHJldHVybiBlcnJvci5tZXNzYWdlID09PSAnY291cG9uLmFscmVhZHkucmVkZWVtZWQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdm91Y2hlckludmFsaWRFcnJvcihlcnJvcjogRXJyb3JNb2RlbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gZXJyb3IubWVzc2FnZSA9PT0gJ2NvdXBvbi5pbnZhbGlkLmNvZGUucHJvdmlkZWQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWb3VjaGVyRXJyb3IoZXJyb3I6IEVycm9yTW9kZWwpOiBib29sZWFuIHtcbiAgcmV0dXJuIGVycm9yLnR5cGUgPT09ICdWb3VjaGVyT3BlcmF0aW9uRXJyb3InO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDYXJ0RXJyb3IoZXJyb3I6IEVycm9yTW9kZWwpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBlcnJvci50eXBlID09PSAnQ2FydEVycm9yJyB8fFxuICAgIGVycm9yLnR5cGUgPT09ICdDYXJ0QWRkcmVzc0Vycm9yJyB8fFxuICAgIGVycm9yLnR5cGUgPT09ICdDYXJ0RW50cnlFcnJvcicgfHxcbiAgICBlcnJvci50eXBlID09PSAnQ2FydEVudHJ5R3JvdXBFcnJvcidcbiAgKTtcbn1cblxuLyoqXG4gKiBXaGF0IGlzIGEgdGVtcG9yYXJ5IGNhcnQ/XG4gKiAtIGZyb250ZW5kIG9ubHkgY2FydCBlbnRpdHkhXG4gKiAtIGNhbiBiZSBpZGVudGlmaWVkIGluIHN0b3JlIGJ5IGB0ZW1wLWAgcHJlZml4IHdpdGggc29tZSB1bmlxdWUgaWQgKG11bHRpcGxlIGNhcnRzIGNhbiBiZSBjcmVhdGVkIGF0IHRoZSBzYW1lIHRpbWUgZWcuIGFjdGl2ZSBjYXJ0LCB3aXNobGlzdClcbiAqXG4gKiBXaHkgd2UgbmVlZCB0ZW1wb3JhcnkgY2FydHM/XG4gKiAtIHRvIGhhdmUgaW5mb3JtYXRpb24gYWJvdXQgY2FydCBjcmVhdGlvbiBwcm9jZXNzIChtZXRhIGZsYWdzOiBsb2FkaW5nLCBlcnJvciAtIGZvciBzaG93aW5nIGxvYWRlciwgZXJyb3IgbWVzc2FnZSlcbiAqIC0gdG8ga25vdyBpZiB0aGVyZSBpcyBjdXJyZW50bHkgYSBjYXJ0IGNyZWF0aW9uIHByb2Nlc3MgaW4gcHJvZ3Jlc3MgKGVnLiBzbywgd2UgZG9uJ3QgY3JlYXRlIG1vcmUgdGhhbiBvbmUgYWN0aXZlIGNhcnQgYXQgdGhlIHNhbWUgdGltZSlcbiAqIC0gY2FydCBpZGVudGlmaWVycyBhcmUgY3JlYXRlZCBpbiB0aGUgYmFja2VuZCwgc28gdGhvc2UgYXJlIG9ubHkga25vd24gYWZ0ZXIgY2FydCBpcyBjcmVhdGVkXG4gKlxuICogVGVtcG9yYXJ5IGNhcnQgbGlmZSBjeWNsZVxuICogLSBjcmVhdGUgY2FydCBtZXRob2QgaW52b2tlZFxuICogLSBuZXcgYHRlbXAtJHt1dWlkfWAgY2FydCBpcyBjcmVhdGVkIHdpdGggYGxvYWRpbmc9dHJ1ZWAgc3RhdGVcbiAqIC0gYmFja2VuZCByZXR1cm5zIGNyZWF0ZWQgY2FydFxuICogLSBub3JtYWwgY2FydCBlbnRpdHkgaXMgc2F2ZWQgdW5kZXIgY29ycmVjdCBpZCAoZWcuIGZvciBsb2dnZWQgdXNlciB1bmRlciBjYXJ0IGBjb2RlYCBrZXkpXG4gKiAtIHRlbXBvcmFyeSBjYXJ0IHZhbHVlIGlzIHNldCB0byBiYWNrZW5kIHJlc3BvbnNlIChhbnlvbmUgb2JzZXJ2aW5nIHRoaXMgY2FydCBjYW4gcmVhZCBjb2RlL2d1aWQgZnJvbSBpdCBhbmQgc3dpdGNoIHNlbGVjdG9yIHRvIG5vcm1hbCBjYXJ0KVxuICogLSBpbiBuZXh0IHRpY2sgdGVtcG9yYXJ5IGNhcnQgaXMgcmVtb3ZlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUZW1wQ2FydElkKGNhcnRJZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBjYXJ0SWQuc3RhcnRzV2l0aCgndGVtcC0nKTtcbn1cblxuLyoqXG4gKiBJbmRpY2F0ZXMgaWYgZ2l2ZW4gY2FydCBpcyBlbXB0eS5cbiAqIFJldHVybnMgdHJ1ZSBpcyBjYXJ0IGlzIHVuZGVmaW5lZCwgbnVsbCBvciBpcyBhbiBlbXB0eSBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KGNhcnQ/OiBDYXJ0KTogYm9vbGVhbiB7XG4gIHJldHVybiAhY2FydCB8fCAodHlwZW9mIGNhcnQgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKGNhcnQpLmxlbmd0aCA9PT0gMCk7XG59XG5cbi8qKlxuICogSW5kaWNhdGVzIGlmIGdpdmVuIHN0cmluZyBpcyBtYXRjaGluZyBlbWFpbCBwYXR0ZXJuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0VtYWlsKHN0cj86IHN0cmluZyk6IGJvb2xlYW4ge1xuICBpZiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5tYXRjaChFTUFJTF9QQVRURVJOKSA/IHRydWUgOiBmYWxzZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogSW5kaWNhdGVzIGlmIGEgZ2l2ZW4gdXNlciBpcyBsb2dnZWQgaW4gb24gYWNjb3VudCBkaWZmZXJlbnQgdGhhbiBwcmVjZWRpbmcgdXNlciBhY2NvdW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0p1c3RMb2dnZWRJbihcbiAgdXNlcklkOiBzdHJpbmcsXG4gIHByZXZpb3VzVXNlcklkOiBzdHJpbmdcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIHVzZXJJZCAhPT0gT0NDX1VTRVJfSURfQU5PTllNT1VTICYmIC8vIG5vdCBsb2dnZWQgb3V0XG4gICAgcHJldmlvdXNVc2VySWQgIT09IHVzZXJJZCAvLyAqanVzdCogbG9nZ2VkIGluIC8gc3dpdGNoZWQgdG8gQVNNIGVtdWxhdGlvblxuICApO1xufVxuIl19