import {mapStateReducer, MapStateActionType} from '../mapStateReducer';
import {MapBottomSheetType} from '../MapContext';
import {SearchLocation} from '@atb/modules/favorites';

jest.mock('../MapContext', () => ({
  MapBottomSheetType: {
    None: 'NONE',
    Filter: 'FILTER',
    SelectedLocation: 'SELECTED_LOCATION',
  },
}));
jest.mock('@atb/modules/favorites', () => ({}));

const location: SearchLocation = {
  id: 'some-id',
  name: 'Prinsens gate 39',
  layer: 'address',
  coordinates: {latitude: 63.43, longitude: 10.39},
  locality: 'Trondheim',
  category: [],
  resultType: 'search',
};

describe('mapStateReducer', () => {
  it('selects a location with a point feature at its coordinates', () => {
    const state = mapStateReducer(
      {bottomSheetType: MapBottomSheetType.Filter},
      {type: MapStateActionType.SelectedLocation, location},
    );

    expect(state).toEqual({
      bottomSheetType: MapBottomSheetType.SelectedLocation,
      location,
      feature: {
        type: 'Feature',
        geometry: {type: 'Point', coordinates: [10.39, 63.43]},
        properties: location,
      },
    });
  });

  it('clears the selected location when closing', () => {
    const selected = mapStateReducer(
      {bottomSheetType: MapBottomSheetType.None},
      {type: MapStateActionType.SelectedLocation, location},
    );
    const state = mapStateReducer(selected, {type: MapStateActionType.None});

    expect(state).toEqual({bottomSheetType: MapBottomSheetType.None});
  });
});
