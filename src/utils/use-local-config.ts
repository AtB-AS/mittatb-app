import {useState, useEffect} from 'react';
import {LocalConfig, loadLocalConfig} from '@atb/modules/local-config';

export function useLocalConfig() {
  const [config, setConfig] = useState<LocalConfig | undefined>(undefined);
  useEffect(() => {
    async function load() {
      const loadedConfig = await loadLocalConfig();
      setConfig(loadedConfig);
    }
    load();
  }, []);
  return config;
}
