import React, {useCallback, useEffect, useState} from 'react';
import {
  AccessibilityProps,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {CurrentLocationArrow, MapPointPin} from '../assets/svg/icons/places';
import {FavoriteIcon} from '../favorites';
import {useFavorites} from '../favorites/FavoritesContext';
import {LocationWithMetadata} from '../favorites/types';
import {useGeolocationState} from '../GeolocationContext';
import colors from '../theme/colors';
import {useReverseGeocoder} from '../geocoder';

type Props = {
  onSelectLocation: (location: LocationWithMetadata) => void;
  onMapSelection?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  chipTypes?: ChipTypeGroup[];
  hideChips?: boolean;
};

type ChipTypeGroup = 'location' | 'map' | 'favorites';

const FavoriteChips: React.FC<Props> = ({
  onSelectLocation,
  containerStyle,
  onMapSelection = () => {},
  chipTypes = ['favorites', 'location', 'map'],
  hideChips = false,
}) => {
  const {favorites} = useFavorites();
  const {onCurrentLocation} = useCurrentLocationChip(onSelectLocation);
  const activeType = (type: ChipTypeGroup) => chipTypes.includes(type);

  if (hideChips) return null;

  return (
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
          icon={<CurrentLocationArrow fill={colors.general.white} />}
          onPress={onCurrentLocation}
          mode="dark"
        />
      )}
      {activeType('map') && (
        <FavoriteChip
          text="Velg i kart"
          accessibilityRole="menuitem"
          icon={<MapPointPin fill={colors.general.white} />}
          onPress={onMapSelection}
          mode="dark"
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
  );
};

export default FavoriteChips;

type ChipProps = {
  text?: string;
  icon: JSX.Element;
  onPress: () => void;
  style?: ViewStyle;
  mode?: 'dark' | 'light';
} & AccessibilityProps;

const FavoriteChip: React.FC<ChipProps> = ({
  text,
  icon,
  onPress,
  style,
  mode = 'light',
  ...accessibilityProps
}) => {
  return (
    <TouchableOpacity
      style={[
        chipStyles.container,
        mode == 'dark' && chipStyles.container__dark,
        style,
      ]}
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
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.secondary.blue_500,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  container__dark: {
    backgroundColor: colors.secondary.gray_500,
  },
  text: {
    marginLeft: 4,
    marginRight: 4,
    color: colors.general.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.31,
  },
});

function useCurrentLocationChip(
  onSelectLocation: (location: LocationWithMetadata) => void,
) {
  const {location, requestPermission} = useGeolocationState();
  const {locations: reverseLookupLocations} =
    useReverseGeocoder(location?.coords ?? null) ?? [];
  const currentLocation = reverseLookupLocations?.length
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
