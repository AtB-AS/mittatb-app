import {useFirestoreConfiguration} from '@atb/configuration';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export const useOperators = () => {
  const {mobilityOperators} = useFirestoreConfiguration();

  return (types: undefined | FormFactor | FormFactor[]) => {
    if (!types) {
      return mobilityOperators ?? [];
    }
    types = Array.isArray(types) ? types : [types];
    return (
      mobilityOperators
        ?.filter((o) => o.showInApp)
        .filter((o) =>
          o.formFactors.some((f) => types?.length === 0 || types?.includes(f)),
        ) ?? []
    );
  };
};
