import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  AccessibilityProps,
} from 'react-native';
import {GeoPosition} from 'react-native-geolocation-service';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {CurrentLocationArrow} from '../assets/svg/icons/places';
import {FavoriteIcon} from '../favorites';
import {useFavorites} from '../favorites/FavoritesContext';
import {RequestPermissionFn} from '../GeolocationContext';
import colors from '../theme/colors';
import {LocationWithSearchMetadata} from './';
import {useReverseGeocoder} from './useGeocoder';

type Props = {
  geolocation: GeoPosition | null;
  requestGeoPermission: RequestPermissionFn;
  onSelectLocation: (location: LocationWithSearchMetadata) => void;
  hideFavorites: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

const FavoriteChips: React.FC<Props> = ({
  onSelectLocation,
  geolocation,
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

  async function onCurrentLocation() {
    if (currentLocation) {
      onSelectLocation({
        ...currentLocation,
        resultType: 'geolocation',
      });
    } else {
      const status = await requestGeoPermission();
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

  if (hideFavorites || !favorites.length) return null;

  return (
    <View
      style={{
        marginBottom: 24,
        height: 44,
      }}
    >
      <ScrollView
        accessibilityRole="menu"
        accessible={true}
        accessibilityLabel="Favorittsteder"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={containerStyle}
      >
        <FavoriteChip
          text="Min posisjon"
          accessibilityRole="menuitem"
          icon={<CurrentLocationArrow />}
          onPress={onCurrentLocation}
        />
        {!hideFavorites &&
          favorites.map((fav, i) => (
            <FavoriteChip
              key={fav.name}
              text={fav.name}
              accessibilityRole="menuitem"
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
} & AccessibilityProps;

const FavoriteChip: React.FC<ChipProps> = ({
  text,
  icon,
  onPress,
  style,
  ...accessibilityProps
}) => {
  return (
    <TouchableOpacity
      style={[chipStyles.container, style]}
      onPress={onPress}
      {...accessibilityProps}
    >
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
