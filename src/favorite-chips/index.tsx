import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Add} from '../assets/svg/icons/actions';
import {CurrentLocationArrow, MapPointPin} from '../assets/svg/icons/places';
import {screenReaderPause} from '../components/accessible-text';
import Button, {ButtonProps} from '../components/button';
import {FavoriteIcon} from '../favorites';
import {useFavorites} from '../favorites/FavoritesContext';
import {LocationWithMetadata} from '../favorites/types';
import {useReverseGeocoder} from '../geocoder';
import {useGeolocationState} from '../GeolocationContext';
import {RootStackParamList} from '../navigation';
import {StyleSheet, useTheme} from '../theme';
import {FavoriteTexts, useTranslation} from '../translations';
import useDisableMapCheck from '../utils/use-disable-map-check';
import {ThemeColor} from '@atb/theme/colors';

const themeColor: ThemeColor = 'primary_2';

type Props = {
  onSelectLocation: (location: LocationWithMetadata) => void;
  onMapSelection?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  chipTypes?: ChipTypeGroup[];
  chipActionHint?: string;
};

export type ChipTypeGroup = 'location' | 'map' | 'favorites' | 'add-favorite';

type ProfileNearbyScreenNavigationProp = StackNavigationProp<RootStackParamList>;
const FavoriteChips: React.FC<Props> = ({
  onSelectLocation,
  containerStyle,
  contentContainerStyle,
  onMapSelection = () => {},
  chipTypes = ['favorites', 'location', 'map'],
  chipActionHint,
}) => {
  const navigation = useNavigation<ProfileNearbyScreenNavigationProp>();
  const {favorites} = useFavorites();
  const styles = useStyles();
  const {t} = useTranslation();
  const {onCurrentLocation} = useCurrentLocationChip(onSelectLocation);
  const disableMap = useDisableMapCheck();
  const activeType = (type: ChipTypeGroup) => chipTypes.includes(type);

  return (
    <View style={containerStyle}>
      {(activeType('location') || activeType('map')) && (
        <View style={[styles.staticChipsContainer, contentContainerStyle]}>
          {activeType('location') && (
            <FavoriteChip
              color={themeColor}
              mode="secondary"
              text={t(FavoriteTexts.chips.currentLocation)}
              accessibilityRole="button"
              accessibilityHint={chipActionHint ?? ''}
              icon={CurrentLocationArrow}
              onPress={onCurrentLocation}
            />
          )}
          {activeType('map') && !disableMap && (
            <FavoriteChip
              text={t(FavoriteTexts.chips.mapLocation)}
              accessibilityRole="button"
              icon={MapPointPin}
              onPress={onMapSelection}
              color={themeColor}
              mode="secondary"
            />
          )}
        </View>
      )}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={contentContainerStyle}
      >
        {activeType('favorites') &&
          favorites.map((fav, i) => (
            <FavoriteChip
              color={themeColor}
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
            color={themeColor}
            mode="secondary"
            text={t(FavoriteTexts.chips.addFavorite)}
            accessibilityRole="button"
            icon={Add}
            onPress={() =>
              navigation.navigate('AddEditFavorite', {screen: 'SearchLocation'})
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
      }}
      type="compact"
    />
  );
};

export default FavoriteChips;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  staticChipsContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacings.medium,
  },
}));

function useCurrentLocationChip(
  onSelectLocation: (location: LocationWithMetadata) => void,
) {
  const {location, requestPermission} = useGeolocationState();
  const {closestLocation: currentLocation} = useReverseGeocoder(
    location?.coords ?? null,
  );

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
