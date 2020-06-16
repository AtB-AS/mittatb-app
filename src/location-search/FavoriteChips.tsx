import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ViewStyle, StyleProp} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../theme/colors';
import {useFavorites} from '../favorites/FavoritesContext';
import {useReverseGeocoder} from './useGeocoder';
import {CurrentLocationArrow} from '../assets/svg/icons/places';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {LocationWithSearchMetadata} from './';
import {FavoriteIcon} from '../favorites';
import {PermissionStatus} from 'react-native-permissions';
import {RequestPermissionFn} from '../GeolocationContext';

type Props = {
  geolocation: GeolocationResponse | null;
  geostatus: PermissionStatus | null;
  requestGeoPermission: RequestPermissionFn;
  onSelectLocation: (location: LocationWithSearchMetadata) => void;
  hideFavorites: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

const FavoriteChips: React.FC<Props> = ({
  onSelectLocation,
  geolocation,
  geostatus,
  requestGeoPermission,
  containerStyle,
  hideFavorites,
}) => {
  const {favorites} = useFavorites();
  const reverseLookupLocations = useReverseGeocoder(geolocation) ?? [];
  const currentLocation = reverseLookupLocations.length
    ? reverseLookupLocations[1]
    : null;

  const [recentlyAllowedGeo, setsetRecentlyAllowedGeo] = useState(false);

  const hasDeniedGeoPermission = geostatus && geostatus !== 'granted';
  const hideLocationChip = !currentLocation && !hasDeniedGeoPermission;

  async function onCurrentLocation() {
    if (currentLocation) {
      onSelectLocation({
        ...currentLocation,
        resultType: 'geolocation',
      });
    } else {
      const status = await requestGeoPermission({useSettingsFallback: true});
      if (status === 'granted') {
        setsetRecentlyAllowedGeo(true);
      }
    }
  }

  useEffect(() => {
    if (recentlyAllowedGeo && currentLocation) {
      onSelectLocation({
        ...currentLocation,
        resultType: 'geolocation',
      });
    }
  }, [recentlyAllowedGeo, currentLocation]);

  if (hideLocationChip && (hideFavorites || !favorites.length)) return null;

  return (
    <View
      style={{
        marginBottom: 24,
        height: 44,
      }}
    >
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={containerStyle}
      >
        {!hideLocationChip && (
          <FavoriteChip
            text="Min posisjon"
            icon={<CurrentLocationArrow />}
            onPress={onCurrentLocation}
          />
        )}
        {!hideFavorites &&
          favorites.map((fav, i) => (
            <FavoriteChip
              key={fav.name}
              text={fav.name}
              icon={<FavoriteIcon favorite={fav} />}
              onPress={() =>
                onSelectLocation({
                  ...fav.location,
                  resultType: 'favorite',
                  favoriteId: fav.id,
                })
              }
              style={i === favorites.length - 1 ? {marginRight: 0} : undefined}
            />
          ))}
      </ScrollView>
    </View>
  );
};

export default FavoriteChips;

type ChipProps = {
  text?: string;
  icon: JSX.Element;
  onPress: () => void;
  style?: ViewStyle;
};

const FavoriteChip: React.FC<ChipProps> = ({text, icon, onPress, style}) => {
  return (
    <TouchableOpacity style={[chipStyles.container, style]} onPress={onPress}>
      {icon}
      <Text style={chipStyles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const chipStyles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 4,
    borderTopLeftRadius: 16,
    backgroundColor: colors.secondary.cyan,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 12,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});
