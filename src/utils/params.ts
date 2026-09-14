/**
 * Express 5 types every `req.params` value as `string | string[]`, because a
 * route path is allowed to repeat a parameter name. The routes in this service
 * declare single parameters (`/services/:serviceName`), which Express always
 * populates with exactly one string — but the type still has to be narrowed.
 *
 * If an array ever does arrive, take the first entry. Stringifying the whole
 * array would yield `"a,b"` and silently produce a lookup key that matches no
 * service, turning a routing surprise into a confusing 404.
 */
export function routeParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}
