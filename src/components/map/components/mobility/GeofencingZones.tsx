import MapboxGL from '@rnmapbox/maps';

export const GeofencingZones = ({geofencingZones}) => {
  return geofencingZones.map((geofencingZone, index) => (
    <MapboxGL.ShapeSource
      id="myShapeSource"
      //key={String(feature.id)}
      key={String(index)}
      shape={geofencingZone.geojson} // ['geometry']['coordinates'][0][0]
      hitbox={{width: 1, height: 1}} // to not be able to hit multiple zones with one click
      //onPress={(e) => console.log(JSON.stringify(e))}
    >
      <MapboxGL.FillLayer
        id="parkingFill"
        style={{
          fillAntialias: true,
          fillColor: ['get', 'color'],
          fillOpacity: ['get', 'opacity'],
        }}
      />
      <MapboxGL.LineLayer
        id="tariffZonesLine"
        style={{
          lineWidth: 1,
          lineColor: ['get', 'color'],
          lineOpacity: ['get', 'opacity'],
        }}
      />
    </MapboxGL.ShapeSource>
  ));
};
