import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Add} from '../assets/svg/icons/actions';
import {CurrentLocationArrow, MapPointPin} from '../assets/svg/icons/places';
import {FavoriteIcon} from '../favorites';
import {useFavorites} from '../favorites/FavoritesContext';
import {LocationWithMetadata} from '../favorites/types';
import {useReverseGeocoder} from '../geocoder';
import {useGeolocationState} from '../GeolocationContext';
import {TabNavigatorParams} from '../navigation/TabNavigator';
import ThemeIcon from '../components/theme-icon';
import {screenReaderPause} from '../components/accessible-text';
import Button, {ButtonProps} from '../components/button';
import {useTheme} from '../theme';

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
    <View style={containerStyle}>
      <View style={{flexDirection: 'row'}}>
        {activeType('location') && (
          <FavoriteChip
            mode="primary2"
            text="Posisjon"
            accessibilityRole="button"
            accessibilityHint={chipActionHint ?? ''}
            icon={CurrentLocationArrow}
            onPress={onCurrentLocation}
          />
        )}
        {activeType('map') && (
          <FavoriteChip
            text="Velg i kart"
            accessibilityRole="button"
            icon={MapPointPin}
            onPress={onMapSelection}
            mode="primary2"
          />
        )}
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {activeType('favorites') &&
          favorites.map((fav, i) => (
            <FavoriteChip
              mode="primary4"
              key={fav.name}
              text={fav.name ?? ''}
              accessibilityLabel={'Favoritt: ' + fav.name + screenReaderPause}
              accessibilityRole="button"
              accessibilityHint={chipActionHint ?? ''}
              icon={({fill}) => <FavoriteIcon favorite={fav} fill={fill} />}
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
            mode="secondary"
            text={'Legg til favoritt'}
            accessibilityRole="button"
            icon={Add}
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
    </View>
  );
};

const FavoriteChip: React.FC<ButtonProps> = (props) => {
  const {theme} = useTheme();
  return (
    <Button
      {...props}
      style={{
        marginRight: theme.spacings.small,
        marginBottom: theme.spacings.medium,
      }}
      type="compact"
    />
  );
};

export default FavoriteChips;

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
