import {renderHook} from '@testing-library/react-native';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useMapFilterFormFactors} from '../use-map-filter-form-factors';

let mockToggles = {
  isVehiclesInMapEnabled: true,
  isCityBikesInMapEnabled: true,
  isCarSharingInMapEnabled: true,
};
jest.mock('@atb/modules/feature-toggles', () => ({
  useFeatureTogglesContext: () => mockToggles,
}));

describe('useMapFilterFormFactors', () => {
  it('returns all form factors listed in the map filter', () => {
    const hook = renderHook(() => useMapFilterFormFactors());
    expect(hook.result.current).toEqual([
      FormFactor.Scooter,
      FormFactor.Bicycle,
      FormFactor.Car,
    ]);
  });

  it('leaves out form factors that are disabled in the map', () => {
    mockToggles = {
      isVehiclesInMapEnabled: false,
      isCityBikesInMapEnabled: true,
      isCarSharingInMapEnabled: false,
    };
    const hook = renderHook(() => useMapFilterFormFactors());
    expect(hook.result.current).toEqual([FormFactor.Bicycle]);
  });
});
