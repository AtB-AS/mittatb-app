import React, {useCallback, useEffect, useState} from 'react';
import {
  AccessibilityProps,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {CurrentLocationArrow, MapPointPin} from '../assets/svg/icons/places';
import {FavoriteIcon} from '../favorites';
import {useFavorites} from '../favorites/FavoritesContext';
import {LocationWithMetadata} from '../favorites/types';
import {useGeolocationState} from '../GeolocationContext';
import colors from '../theme/colors';
import {useReverseGeocoder} from '../utils/use-geocoder';

type Props = {
  onSelectLocation: (location: LocationWithMetadata) => void;
  onMapSelection: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  chipTypes?: ChipTypeGroup[];
  hideChips?: boolean;
};

type ChipTypeGroup = 'location' | 'map' | 'favorites';

const FavoriteChips: React.FC<Props> = ({
  onSelectLocation,
  onMapSelection,
  containerStyle,
  chipTypes = ['favorites', 'location', 'map'],
  hideChips = false,
}) => {
  const {favorites} = useFavorites();
  const {onCurrentLocation} = useCurrentLocationChip(onSelectLocation);
  const activeType = (type: ChipTypeGroup) => chipTypes.includes(type);

  if (hideChips) return null;

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
        keyboardShouldPersistTaps="handled"
      >
        {activeType('location') && (
          <FavoriteChip
            text="Posisjon"
            accessibilityRole="menuitem"
            icon={<CurrentLocationArrow />}
            onPress={onCurrentLocation}
          />
        )}
        {activeType('map') && (
          <FavoriteChip
            text="Velg i kart"
            accessibilityRole="menuitem"
            icon={<MapPointPin />}
            onPress={onMapSelection}
          />
        )}
        {activeType('favorites') &&
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

function useCurrentLocationChip(
  onSelectLocation: (location: LocationWithMetadata) => void,
) {
  const {location, requestPermission} = useGeolocationState();
  const reverseLookupLocations =
    useReverseGeocoder(location?.coords ?? null) ?? [];
  const currentLocation = reverseLookupLocations.length
    ? reverseLookupLocations[1]
    : null;

  const [recentlyAllowedGeo, setsetRecentlyAllowedGeo] = useState(false);

  const onCurrentLocation = useCallback(
    async function () {
      if (currentLocation) {
        onSelectLocation({
          ...currentLocation,
          resultType: 'geolocation',
        });
      } else {
        const status = await requestPermission();
        if (status === 'granted') {
          setsetRecentlyAllowedGeo(true);
        }
      }
    },
    [currentLocation, onSelectLocation, requestPermission],
  );

  useEffect(() => {
    if (recentlyAllowedGeo && currentLocation) {
      onSelectLocation({
        ...currentLocation,
        resultType: 'geolocation',
      });
    }
  }, [recentlyAllowedGeo, currentLocation]);

  return {onCurrentLocation};
}
