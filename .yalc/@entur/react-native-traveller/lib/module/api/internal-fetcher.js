const internalFetcher = async (request) => {
  const {
    url,
    method,
    headers
  } = request;
  const response = await fetch(url, {
    method,
    headers,
    body: request.body ? JSON.stringify(request.body) : undefined
  });
  const {
    status
  } = response;
  const responseHeaders = {};

  for (let header of response.headers) {
    responseHeaders[header[0]] = header[1];
  }

  const data = await response.json();
  return {
    body: data,
    status,
    headers: responseHeaders
  };
};

export default internalFetcher;
//# sourceMappingURL=internal-fetcher.js.map