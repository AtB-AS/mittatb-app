import {useState, useEffect} from 'react';
import {LocalConfig, loadLocalConfig} from '../local-config';

export default function useLocalConfig() {
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
