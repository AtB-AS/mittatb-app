import {decodePolylineEncodedMultiPolygons} from '../geofencing-zone-utils';

import tierTrondheimEncoded from './tierTrondheimEncodedMinified.json';
import tierTrondheimDecoded from './tierTrondheimDecodedMinified.json';
import {PreProcessedGeofencingZones} from '../types';

describe('decodePolylineEncodedMultiPolygons', () => {
  it('returns correct geofencingZones with decoded MultiPolygons for tiertrondheim', () => {
    expect(
      decodePolylineEncodedMultiPolygons(
        tierTrondheimEncoded.data
          .geofencingZones as any as PreProcessedGeofencingZones[],
      ),
    ).toMatchObject(tierTrondheimDecoded.data.geofencingZones);
  });
});
