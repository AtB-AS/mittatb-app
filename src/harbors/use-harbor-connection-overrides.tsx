import {useFirestoreConfiguration} from '@atb/configuration';

export const useHarborConnectionOverrides = (fromHarborId?: string) => {
  const {harborConnectionOverrides} = useFirestoreConfiguration();
  return (harborConnectionOverrides ?? []).filter(
    (o) => o.from === fromHarborId,
  );
};
