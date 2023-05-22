import {useFirestoreConfiguration} from '@atb/configuration';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export const useOperators = () => {
  const {mobilityOperators} = useFirestoreConfiguration();

  const whitelistedOperatorIds = (types: FormFactor[]) => {
    if (!mobilityOperators) return;
    return mobilityOperators
      .filter((o) => o.showInApp)
      .filter((o) =>
        o.formFactors.some((f) => types.length === 0 || types.includes(f)),
      )
      .map((o) => o.id);
  };

  return {
    whitelistedOperatorIds,
  };
};
