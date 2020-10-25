import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
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
import {Add} from '../assets/svg/icons/actions';
import {CurrentLocationArrow, MapPointPin} from '../assets/svg/icons/places';
import {FavoriteIcon} from '../favorites';
import {useFavorites} from '../favorites/FavoritesContext';
import {LocationWithMetadata} from '../favorites/types';
import {useReverseGeocoder} from '../geocoder';
import {useGeolocationState} from '../GeolocationContext';
import {TabNavigatorParams} from '../navigation/TabNavigator';
import colors from '../theme/colors';
import {screenReaderPause} from '../components/accessible-text';

type Props = {
  onSelectLocation: (location: LocationWithMetadata) => void;
  onMapSelection?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  chipTypes?: ChipTypeGroup[];
  chipActionHint?: string;
};

export type ChipTypeGroup = 'location' | 'map' | 'favorites' | 'add-favorite';

type ProfileNearbyScreenNavigationProp = StackNavigationProp<
  TabNavigatorParams,
  'Assistant'
>;
const FavoriteChips: React.FC<Props> = ({
  onSelectLocation,
  containerStyle,
  onMapSelection = () => {},
  chipTypes = ['favorites', 'location', 'map'],
  chipActionHint,
}) => {
  const navigation = useNavigation<ProfileNearbyScreenNavigationProp>();
  const {favorites} = useFavorites();

  const {onCurrentLocation} = useCurrentLocationChip(onSelectLocation);
  const activeType = (type: ChipTypeGroup) => chipTypes.includes(type);

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={containerStyle}
      keyboardShouldPersistTaps="handled"
    >
      {activeType('location') && (
        <FavoriteChip
          text="Posisjon"
          accessibilityRole="button"
          accessibilityHint={chipActionHint ?? ''}
          icon={<CurrentLocationArrow fill={colors.general.white} />}
          onPress={onCurrentLocation}
          mode="dark"
        />
      )}
      {activeType('map') && (
        <FavoriteChip
          text="Velg i kart"
          accessibilityRole="button"
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
            accessibilityLabel={'Favoritt: ' + fav.name + screenReaderPause}
            accessibilityRole="button"
            accessibilityHint={chipActionHint ?? ''}
            icon={<FavoriteIcon favorite={fav} />}
            onPress={() =>
              onSelectLocation({
                ...fav.location,
                resultType: 'favorite',
                favoriteId: fav.id,
              })
            }
            style={
              !activeType('add-favorite') && i === favorites.length - 1
                ? {marginRight: 0}
                : undefined
            }
          />
        ))}
      {activeType('add-favorite') && (
        <FavoriteChip
          text={'Legg til favoritt'}
          accessibilityRole="button"
          icon={<Add />}
          mode="light"
          onPress={() =>
            navigation.navigate('Profile', {
              screen: 'AddEditFavorite',
              initial: false,
            })
          }
          style={{marginRight: 0}}
        />
      )}
    </ScrollView>
  );
};

export default FavoriteChips;

type ChipProps = {
  text?: string;
  icon: JSX.Element;
  onPress: () => void;
  style?: ViewStyle;
  mode?: 'dark' | 'normal' | 'light';
} & AccessibilityProps;

const FavoriteChip: React.FC<ChipProps> = ({
  text,
  icon,
  onPress,
  style,
  mode = 'normal',
  ...accessibilityProps
}) => {
  return (
    <TouchableOpacity
      style={[
        chipStyles.container,
        style,
        mode == 'dark' && chipStyles.container__dark,
        mode == 'light' && chipStyles.container__light,
      ]}
      onPress={onPress}
      {...accessibilityProps}
    >
      {icon}
      <Text
        style={[chipStyles.text, mode == 'light' && chipStyles.text__light]}
      >
        {text}
      </Text>
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
  container__light: {
    backgroundColor: colors.secondary.cyan_300,
  },
  text: {
    marginLeft: 4,
    marginRight: 4,
    color: colors.general.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.31,
  },
  text__light: {
    color: colors.general.black,
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
