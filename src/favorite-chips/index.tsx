import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  AccessibilityProps,
  StyleProp,
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
import {StyleSheet} from '../theme';
import ThemeIcon from '../components/theme-icon';
import {screenReaderPause} from '../components/accessible-text';
import ThemeText from '../components/text';

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
          icon={<ThemeIcon svg={CurrentLocationArrow} />}
          onPress={onCurrentLocation}
          mode="dark"
        />
      )}
      {activeType('map') && (
        <FavoriteChip
          text="Velg i kart"
          accessibilityRole="button"
          icon={<ThemeIcon svg={MapPointPin} />}
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
          icon={<ThemeIcon svg={Add} />}
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
      <ThemeText
        type="body"
        style={[
          chipStyles.text,
          mode == 'light' && chipStyles.text__light,
          mode == 'dark' && chipStyles.text__dark,
        ]}
      >
        {text}
      </ThemeText>
    </TouchableOpacity>
  );
};

const useChipStyles = StyleSheet.createThemeHook((theme, themeName) => ({
  container: {
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.secondary.blue_500,
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
    color: colors.text.white,
    fontWeight: 'bold',
    letterSpacing: -0.31,
  },
  container__dark: {
    backgroundColor: theme.button.primary2.backgroundColor,
  },
  text__dark: {
    color: theme.button.primary2.textColor,
  },
  container__light: {
    backgroundColor:
      themeName === 'dark'
        ? theme.button.primary3.backgroundColor
        : colors.secondary.cyan_300,
  },
  text__light: {
    color:
      themeName === 'dark'
        ? theme.button.primary3.textColor
        : theme.text.colors.primary,
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
