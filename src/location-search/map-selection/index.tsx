import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useIsFocused,
  useRoute,
} from '@react-navigation/native';
import React, {useState} from 'react';
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
import {ArrowRight} from '../../assets/svg/icons/navigation';
import {MapPointPin} from '../../assets/svg/icons/places';
import {
  LocationSearchNavigationProp,
  LocationSearchStackParams,
  LocationWithSearchMetadata,
} from '../';

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

  const onSelect = (location: LocationWithSearchMetadata) => {
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: location,
    });
  };

  const location = locations?.[0];

  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView
        style={{
          flex: 1,
        }}
        onRegionDidChange={setRegion}
      >
        <MapboxGL.Camera
          zoomLevel={coordinates.zoomLevel}
          centerCoordinate={[coordinates.longitude, coordinates.latitude]}
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
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
            backgroundColor: 'white',
            borderRadius: 5,
            height: 20,
            width: 20,
            position: 'absolute',
            top: '10%',
            right: '5%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>+</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            height: 20,
            width: 20,
            position: 'absolute',
            top: '20%',
            right: '5%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback>
            <Text>-</Text>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 50,
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
                {!location ? (
                  <ActivityIndicator />
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect({...location, resultType: 'search'});
                    }}
                  >
                    <ArrowRight />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </MapboxGL.MapView>
    </View>
  );
};

export default MapSelection;
