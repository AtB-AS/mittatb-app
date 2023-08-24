import {useFirestoreConfiguration} from '@atb/configuration';
import {useEffect, useState} from 'react';
import {HarborConnectionOverrideType} from '@atb-as/config-specs';

export const useHarborConnectionOverrides = (fromHarborId?: string) => {
  const [overrides, setOverrides] = useState<HarborConnectionOverrideType[]>(
    [],
  );
  const {harborConnectionOverrides} = useFirestoreConfiguration();

  useEffect(() => {
    setOverrides(
      (harborConnectionOverrides ?? []).filter((o) => o.from === fromHarborId),
    );
  }, [harborConnectionOverrides, fromHarborId]);

  return overrides;
};
