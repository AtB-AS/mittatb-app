import {Add} from '@atb/assets/svg/mono-icons/actions';
import {Pin} from '@atb/assets/svg/mono-icons/map';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {screenReaderPause} from '@atb/components/text';
import {Button, ButtonProps} from '@atb/components/button';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {ContrastColor, StyleSheet} from '@atb/theme';
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
  useFavoritesContext,
} from '@atb/modules/favorites';

type Props = {
  onSelectLocation: (location: Location) => void;
  onMapSelection?: () => void;
  style?: StyleProp<ViewStyle>;
  chipTypes?: ChipTypeGroup[];
  chipActionHint?: string;
  onAddFavoritePlace: () => void;
  backgroundColor: ContrastColor;
};

export const FavoriteChips: React.FC<Props> = ({
  onSelectLocation,
  style,
  onMapSelection = () => {},
  chipTypes = ['favorites', 'location', 'map'],
  chipActionHint,
  onAddFavoritePlace,
  backgroundColor,
}) => {
  const {favorites} = useFavoritesContext();
  const {t} = useTranslation();
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
            expanded={false}
            backgroundColor={backgroundColor}
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
            expanded={false}
            text={t(FavoriteTexts.chips.mapLocation)}
            accessibilityRole="button"
            leftIcon={{svg: Pin}}
            onPress={onMapSelection}
            backgroundColor={backgroundColor}
            mode="secondary"
            testID="mapLocationChip"
          />
        )}

        {activeType('favorites') &&
          favorites.map((fav, i) => (
            <FavoriteChip
              expanded={false}
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
            expanded={false}
            backgroundColor={backgroundColor}
            mode="secondary"
            text={t(FavoriteTexts.chips.addFavorite)}
            accessibilityRole="button"
            leftIcon={{svg: Add}}
            onPress={onAddFavoritePlace}
            testID="addFavoriteButton"
          />
        )}
      </ScrollView>
    </>
  );
};

const FavoriteChip: React.FC<ButtonProps> = (props) => {
  return <Button {...props} type="small" />;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  staticChipsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    // On Android, buttons were slighly cut off by the scroll view container
    // when it had no extra vertical space
    marginVertical: 1,
  },
}));

function useCurrentLocationChip(
  onSelectLocation: (location: GeoLocation) => void,
) {
  const {location, requestLocationPermission} = useGeolocationContext();

  const [recentlyAllowedGeo, setRecentlyAllowedGeo] = useState(false);

  const onCurrentLocation = useCallback(
    async function () {
      if (location) {
        onSelectLocation(location);
      } else {
        const status = await requestLocationPermission(false);
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
