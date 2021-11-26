import type { Config } from './types';
export * from './types';
import fetch from '../api/internal-fetcher';

const DEFAULT_CONFIG: Config = {
  hosts: {
    pto: '',
  },
  fetch,
  extraHeaders: {},
};

export function getConfigFromInitialConfig(
  initialConfig?: Partial<Config>
): Config {
  if (!initialConfig) return DEFAULT_CONFIG;

  return {
    ...DEFAULT_CONFIG,
    ...initialConfig,
    hosts: {
      ...DEFAULT_CONFIG.hosts,
      ...initialConfig.hosts,
    },
    extraHeaders: {
      ...DEFAULT_CONFIG.extraHeaders,
      ...initialConfig.extraHeaders,
    },
  };
}
