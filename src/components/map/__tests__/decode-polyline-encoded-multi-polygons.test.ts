import {decodePolylineEncodedMultiPolygons} from '../geofencing-zone-utils';

import voiTrondheimEncoded from './voiTrondheimEncoded.json';
import tierTrondheimEncoded from './tierTrondheimEncoded.json';
import voiTrondheimDecoded from './voiTrondheimDecoded.json';
import tierTrondheimDecoded from './tierTrondheimDecoded.json';
import {PreProcessedGeofencingZones} from '../types';

describe('decodePolylineEncodedMultiPolygons', () => {
  it('returns correct geofencingZones with decoded MultiPolygons for voitrondheim', () => {
    expect(
      decodePolylineEncodedMultiPolygons(
        voiTrondheimEncoded.data
          .geofencingZones as any as PreProcessedGeofencingZones[],
      ),
    ).toMatchObject(voiTrondheimDecoded.data.geofencingZones);
  });

  it('returns correct geofencingZones with decoded MultiPolygons for tiertrondheim', () => {
    expect(
      decodePolylineEncodedMultiPolygons(
        tierTrondheimEncoded.data
          .geofencingZones as any as PreProcessedGeofencingZones[],
      ),
    ).toMatchObject(tierTrondheimDecoded.data.geofencingZones);
  });
});
