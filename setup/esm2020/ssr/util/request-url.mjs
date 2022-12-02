/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { getRequestOrigin } from './request-origin';
export function getRequestUrl(req) {
    return getRequestOrigin(req) + req.originalUrl;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC11cmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9jb3JlLWxpYnMvc2V0dXAvc3NyL3V0aWwvcmVxdWVzdC11cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUdILE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRXBELE1BQU0sVUFBVSxhQUFhLENBQUMsR0FBWTtJQUN4QyxPQUFPLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDakQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBTUERYLUZpbGVDb3B5cmlnaHRUZXh0OiAyMDIyIFNBUCBTcGFydGFjdXMgdGVhbSA8c3BhcnRhY3VzLXRlYW1Ac2FwLmNvbT5cbiAqXG4gKiBTUERYLUxpY2Vuc2UtSWRlbnRpZmllcjogQXBhY2hlLTIuMFxuICovXG5cbmltcG9ydCB7IFJlcXVlc3QgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGdldFJlcXVlc3RPcmlnaW4gfSBmcm9tICcuL3JlcXVlc3Qtb3JpZ2luJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlcXVlc3RVcmwocmVxOiBSZXF1ZXN0KTogc3RyaW5nIHtcbiAgcmV0dXJuIGdldFJlcXVlc3RPcmlnaW4ocmVxKSArIHJlcS5vcmlnaW5hbFVybDtcbn1cbiJdfQ==