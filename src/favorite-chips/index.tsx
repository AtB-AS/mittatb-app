import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  AccessibilityProps,
  StyleProp,
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
import {screenreaderPause} from '../components/accessible-text';
import {StyleSheet} from '../theme';

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
      accessible={true}
      accessibilityLabel="Favoritter"
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
            accessibilityLabel={'Favoritt: ' + fav.name + screenreaderPause}
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
  const chipStyles = useChipStyles();
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
        style={[
          chipStyles.text,
          mode == 'light' && chipStyles.text__light,
          mode == 'dark' && chipStyles.text__dark,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const useChipStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.button.secondary.bg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacings.xSmall,
    paddingHorizontal: theme.spacings.small,
    marginRight: theme.spacings.small,
  },
  text: {
    marginLeft: theme.spacings.xSmall,
    marginRight: theme.spacings.xSmall,
    color: colors.general.white,
    fontSize: theme.text.sizes.body,
    fontWeight: 'bold',
    letterSpacing: -0.31,
  },
  container__dark: {
    backgroundColor: theme.button.primary2.bg,
  },
  text__dark: {
    color: theme.button.primary2.color,
  },
  container__light: {
    backgroundColor: theme.button.primary3.bg,
  },
  text__light: {
    color: theme.button.primary3.color,
  },
}));

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
