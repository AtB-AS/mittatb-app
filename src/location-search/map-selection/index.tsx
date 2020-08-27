import {RouteProp} from '@react-navigation/native';
import React, {useState, useRef} from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {useReverseGeocoder} from '../useGeocoder';
import colors from '../../theme/colors';
import {ArrowRight, ArrowLeft} from '../../assets/svg/icons/navigation';
import {MapPointPin} from '../../assets/svg/icons/places';
import {
  LocationSearchNavigationProp,
  LocationSearchStackParams,
  LocationWithSearchMetadata,
} from '../';
import insets from '../../utils/insets';
import MapControls from './MapControls';
import {useGeolocationState} from '../../GeolocationContext';

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  coordinates: {
    longitude: number;
    latitude: number;
    zoomLevel: number;
  };
};

export type Props = {
  navigation: LocationSearchNavigationProp;
  route: RouteProp<LocationSearchStackParams, 'MapSelection'>;
};

const MapSelection: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteName, callerRouteParam, coordinates},
  },
}) => {
  const [region, setRegion] = useState<
    GeoJSON.Feature<GeoJSON.Point, RegionPayload>
  >();

  const locations = useReverseGeocoder(
    region
      ? ({
          coords: {
            latitude: region?.geometry?.coordinates[1],
            longitude: region?.geometry?.coordinates[0],
          },
        } as any)
      : null,
  );

  const {location: geolocation} = useGeolocationState();

  const onSelect = (location: LocationWithSearchMetadata) => {
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: location,
    });
  };

  const location = locations?.[0];

  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

  async function zoomIn() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) + 1, 200);
  }

  async function zoomOut() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) - 1, 200);
  }

  async function flyToCurrentLocation() {
    geolocation &&
      mapCameraRef.current?.flyTo(
        [geolocation?.coords.longitude, geolocation?.coords.latitude],
        750,
      );
  }

  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={{
          flex: 1,
        }}
        onRegionDidChange={setRegion}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          zoomLevel={coordinates.zoomLevel}
          centerCoordinate={[coordinates.longitude, coordinates.latitude]}
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
        <View style={{position: 'absolute', top: 80, left: 20}}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            hitSlop={insets.symmetric(12, 20)}
          >
            <View
              style={{
                backgroundColor: colors.primary.gray,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                width: 36,
                height: 28,
              }}
            >
              <ArrowLeft fill={colors.general.white} />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: 'absolute',
            top: '50%',
            right: '50%',
            width: 10,
            height: 10,
          }}
        >
          <View style={{position: 'absolute', top: -10, right: -4}}>
            <Text>x</Text>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 80,
            paddingHorizontal: 12,
            width: '100%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <View
              style={{
                paddingRight: 8,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: colors.general.white,
                flexDirection: 'row',
                flexGrow: 1,
                justifyContent: 'space-between',
              }}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MapPointPin style={{marginHorizontal: 12}} />
                {location ? (
                  <View>
                    <Text style={{fontSize: 14, lineHeight: 20}}>
                      {location.name}
                    </Text>
                    <Text style={{fontSize: 12, lineHeight: 16}}>
                      {location.postalcode ? (
                        <Text>{location.postalcode}, </Text>
                      ) : null}
                      {location.locality}
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => {
                  location && onSelect({...location, resultType: 'search'});
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    marginLeft: 8,
                    backgroundColor: colors.secondary.cyan,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {!location ? <ActivityIndicator /> : <ArrowRight />}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </MapboxGL.MapView>
      <View style={{position: 'absolute', top: '10%', right: '10%'}}>
        <MapControls
          flyToCurrentLocation={flyToCurrentLocation}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
        />
      </View>
    </View>
  );
};

export default MapSelection;
