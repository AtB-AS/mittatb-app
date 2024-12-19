import {useFirestoreConfigurationContext} from '@atb/configuration';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useCallback} from 'react';

export const useOperators = () => {
  const {mobilityOperators} = useFirestoreConfigurationContext();

  const byFormFactor = useCallback(
    (types: undefined | FormFactor | FormFactor[]) => {
      if (!types) {
        return mobilityOperators ?? [];
      }
      const formFactors = (Array.isArray(types) ? types : [types]).map((t) =>
        t.valueOf(),
      );
      return (
        mobilityOperators
          ?.filter((o) => o.showInApp)
          .filter((o) =>
            o.formFactors.some(
              (f) => types?.length === 0 || formFactors.includes(f),
            ),
          )
          .sort((a, b) => a.name.localeCompare(b.name)) ?? []
      );
    },
    [mobilityOperators],
  );

  const byId = useCallback(
    (id: string | undefined) =>
      mobilityOperators?.find((operator) => operator.id === id),
    [mobilityOperators],
  );

  return {
    mobilityOperators,
    byFormFactor,
    byId,
  };
};
