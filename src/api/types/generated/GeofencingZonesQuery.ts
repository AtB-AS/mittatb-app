export type GetGeofencingZonesQuery = {
  geofencingZones?: Array<{
    systemId?: string;
    geojson?: {
      type?: string;
      features?: Array<{
        type?: string;
        geometry?: {type?: string};
        properties?: {
          name?: string;
          start?: number;
          end?: number;
          polylineEncodedMultiPolygon?: Array<Array<string>>;
          rules?: Array<{
            vehicleTypeIds?: Array<string>;
            rideAllowed: boolean;
            rideThroughAllowed: boolean;
            maximumSpeedKph?: number;
            stationParking?: boolean;
          }>;
        };
      }>;
    };
  }>;
};
