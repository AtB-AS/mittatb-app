import {useFirestoreConfigurationContext} from '@atb/configuration';
import {useEffect, useState} from 'react';
import {HarborConnectionOverrideType} from '@atb/configuration';

export const useHarborConnectionOverrides = (fromHarborId?: string) => {
  const [overrides, setOverrides] = useState<HarborConnectionOverrideType[]>(
    [],
  );
  const {harborConnectionOverrides} = useFirestoreConfigurationContext();

  useEffect(() => {
    setOverrides(
      (harborConnectionOverrides ?? []).filter((o) => o.from === fromHarborId),
    );
  }, [harborConnectionOverrides, fromHarborId]);

  return overrides;
};
