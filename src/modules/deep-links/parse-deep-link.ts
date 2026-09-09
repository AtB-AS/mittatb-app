export type DeepLink = {
  path: string;
  params: Record<string, string | undefined>;
};

/**
 * Parses a deep link into its path and query params, e.g.
 * `foo/bar?id=NSR:Example:1` into
 * `{path: 'foo/bar', params: {id: 'NSR:Example:1'}}`.
 */
export function parseDeepLink(url: string): DeepLink {
  const [pathAndQuery] = url.split('#');
  const [rawPath, ...rawQuery] = pathAndQuery.split('?');

  // Strip duplicate, leading and trailing slashes from the path.
  const path = rawPath.replace(/\/{2,}/g, '/').replace(/^\/|\/$/g, '');

  // Duplicated params keep the first value, like `URLSearchParams.get` does.
  const params: Record<string, string> = {};
  new URLSearchParams(rawQuery.join('?')).forEach((value, key) => {
    if (!(key in params)) params[key] = value;
  });

  return {
    path,
    params,
  };
}
