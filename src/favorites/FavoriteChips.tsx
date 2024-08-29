import {Add} from '@atb/assets/svg/mono-icons/actions';
import {Pin} from '@atb/assets/svg/mono-icons/map';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {screenReaderPause} from '@atb/components/text';
import {Button, ButtonProps} from '@atb/components/button';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {FavoriteTexts, useTranslation} from '@atb/translations';
import {useDisableMapCheck} from '@atb/utils/use-disable-map-check';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ChipTypeGroup,
  FavoriteIcon,
  GeoLocation,
  Location,
  useFavorites,
} from '@atb/favorites';

type Props = {
  onSelectLocation: (location: Location) => void;
  onMapSelection?: () => void;
  style?: StyleProp<ViewStyle>;
  chipTypes?: ChipTypeGroup[];
  chipActionHint?: string;
  onAddFavorite: () => void;
};

export const FavoriteChips: React.FC<Props> = ({
  onSelectLocation,
  style,
  onMapSelection = () => {},
  chipTypes = ['favorites', 'location', 'map'],
  chipActionHint,
  onAddFavorite,
}) => {
  const {favorites} = useFavorites();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const themeColor = theme.color.background.accent[0];

  const {onCurrentLocation} = useCurrentLocationChip(onSelectLocation);
  const disableMap = useDisableMapCheck();
  const styles = useStyles();
  const activeType = (type: ChipTypeGroup) => chipTypes.includes(type);

  return (
    <>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[style, styles.staticChipsContainer]}
      >
        {activeType('location') && (
          <FavoriteChip
            backgroundColor={themeColor}
            mode="secondary"
            text={t(FavoriteTexts.chips.currentLocation)}
            accessibilityRole="button"
            accessibilityHint={chipActionHint ?? ''}
            leftIcon={{svg: LocationIcon}}
            onPress={onCurrentLocation}
            testID="currentLocationChip"
          />
        )}
        {activeType('map') && !disableMap && (
          <FavoriteChip
            text={t(FavoriteTexts.chips.mapLocation)}
            accessibilityRole="button"
            leftIcon={{svg: Pin}}
            onPress={onMapSelection}
            backgroundColor={themeColor}
            mode="secondary"
            testID="mapLocationChip"
          />
        )}

        {activeType('favorites') &&
          favorites.map((fav, i) => (
            <FavoriteChip
              key={fav.id}
              text={fav.name ?? ''}
              accessibilityLabel={'Favoritt: ' + fav.name + screenReaderPause}
              accessibilityRole="button"
              accessibilityHint={chipActionHint ?? ''}
              leftIcon={{
                svg: ({fill}) => <FavoriteIcon favorite={fav} fill={fill} />,
              }}
              onPress={() =>
                onSelectLocation({
                  ...fav.location,
                  resultType: 'favorite',
                  favoriteId: fav.id,
                })
              }
              testID={'favoriteChip' + i}
            />
          ))}
        {activeType('add-favorite') && (
          <FavoriteChip
            backgroundColor={themeColor}
            mode="secondary"
            text={t(FavoriteTexts.chips.addFavorite)}
            accessibilityRole="button"
            leftIcon={{svg: Add}}
            onPress={onAddFavorite}
            testID="addFavoriteButton"
          />
        )}
      </ScrollView>
    </>
  );
};

const FavoriteChip: React.FC<ButtonProps> = (props) => {
  return <Button {...props} type="medium" compact={true} />;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  staticChipsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
}));

function useCurrentLocationChip(
  onSelectLocation: (location: GeoLocation) => void,
) {
  const {location, requestLocationPermission} = useGeolocationState();

  const [recentlyAllowedGeo, setRecentlyAllowedGeo] = useState(false);

  const onCurrentLocation = useCallback(
    async function () {
      if (location) {
        onSelectLocation(location);
      } else {
        const status = await requestLocationPermission();
        if (status === 'granted') {
          setRecentlyAllowedGeo(true);
        }
      }
    },
    [location, onSelectLocation, requestLocationPermission],
  );

  useEffect(() => {
    if (recentlyAllowedGeo && location) {
      onSelectLocation(location);
    }
  }, [recentlyAllowedGeo, location, onSelectLocation]);

  return {onCurrentLocation};
}
