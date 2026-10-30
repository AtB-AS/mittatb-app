import {getMapBounds, MapLine} from '../utils';

jest.mock('@atb/screen-components/travel-details-screens', () => ({
  isLineFlexibleTransport: jest.fn(),
}));

const line: MapLine = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [10, 63],
      [13, 66],
    ],
  },
};

describe('getMapBounds', () => {
  it('fits the lines with padding', () => {
    expect(getMapBounds([line])).toEqual({
      sw: [9, 62],
      ne: [14, 67],
    });
  });

  it('includes extra points outside the lines', () => {
    expect(getMapBounds([line], [[7, 60]])).toEqual({
      sw: [5, 58],
      ne: [15, 68],
    });
  });

  it('is unaffected by extra points inside the lines', () => {
    expect(getMapBounds([line], [[11, 64]])).toEqual(getMapBounds([line]));
  });

  it('ignores faded lines when there are non-faded lines', () => {
    const fadedLine: MapLine = {
      ...line,
      faded: true,
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 50],
          [10, 63],
        ],
      },
    };
    expect(getMapBounds([fadedLine, line])).toEqual(getMapBounds([line]));
  });

  it('uses faded lines when all lines are faded', () => {
    const fadedLine: MapLine = {...line, faded: true};
    expect(getMapBounds([fadedLine])).toEqual(getMapBounds([line]));
  });
});
