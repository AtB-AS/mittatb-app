import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

/**
 * The form factors listed in the map filter, depending on which vehicle types
 * are enabled in the map.
 */
export const useMapFilterFormFactors = (): FormFactor[] => {
  const {
    isCarSharingInMapEnabled,
    isCityBikesInMapEnabled,
    isVehiclesInMapEnabled,
  } = useFeatureTogglesContext();

  return [
    {
      shouldShow: isVehiclesInMapEnabled,
      formFactor: FormFactor.Scooter,
    },
    {
      shouldShow: isCityBikesInMapEnabled,
      formFactor: FormFactor.Bicycle,
    },
    {
      shouldShow: isCarSharingInMapEnabled,
      formFactor: FormFactor.Car,
    },
  ]
    .filter((f) => f.shouldShow)
    .map((f) => f.formFactor);
};
