export * from './types';
import fetch from '../api/internal-fetcher';
const DEFAULT_CONFIG = {
  hosts: {
    pto: ''
  },
  fetch,
  extraHeaders: {}
};
export function getConfigFromInitialConfig(initialConfig) {
  if (!initialConfig) return DEFAULT_CONFIG;
  return { ...DEFAULT_CONFIG,
    ...initialConfig,
    hosts: { ...DEFAULT_CONFIG.hosts,
      ...initialConfig.hosts
    },
    extraHeaders: { ...DEFAULT_CONFIG.extraHeaders,
      ...initialConfig.extraHeaders
    }
  };
}
//# sourceMappingURL=index.js.map