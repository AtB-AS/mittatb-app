export type DeepLink = {
  path: string;
  params: Record<string, string | undefined>;
};

/**
 * Parses a deep link into its decoded path and query params, e.g.
 * `foo/bar%20baz?id=NSR%3AExample%3A1` into
 * `{path: 'foo/bar baz', params: {id: 'NSR:Example:1'}}`.
 */
export function parseDeepLink(url: string): DeepLink {
  const [pathAndQuery] = url.split('#');
  const [rawPath, ...rawQuery] = pathAndQuery.split('?');

  // Strip duplicate, leading and trailing slashes from the path.
  const path = rawPath
    .replace(/\/{2,}/g, '/')
    .replace(/^\/|\/$/g, '')
    .split('/')
    .map(safeDecode)
    .join('/');

  // Duplicated params keep the first value, like `URLSearchParams.get` does.
  // NOTE that Jest runs URLSearchParams from Node, while the React Native one
  // is different, and throws on malformed encoding.
  const params: Record<string, string> = {};
  try {
    new URLSearchParams(rawQuery.join('?')).forEach((value, key) => {
      if (!(key in params)) params[key] = value;
    });
  } catch {
    // Malformed encoding. Ignore the params.
  }

  return {
    path,
    params,
  };
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
