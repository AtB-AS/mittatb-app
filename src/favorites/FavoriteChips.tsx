import {Add} from '@atb/assets/svg/mono-icons/actions';
import {Pin} from '@atb/assets/svg/mono-icons/map';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {screenReaderPause} from '@atb/components/text';
import {Button, ButtonProps} from '@atb/components/button';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
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

const themeColor: InteractiveColor = 'interactive_0';

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
  const {onCurrentLocation} = useCurrentLocationChip(onSelectLocation);
  const disableMap = useDisableMapCheck();
  const activeType = (type: ChipTypeGroup) => chipTypes.includes(type);

  return (
    <>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          (activeType('favorites') && favorites.length > 0) ||
          activeType('add-favorite')
            ? style
            : undefined
        }
      >
        {activeType('location') && (
          <FavoriteChip
            interactiveColor={themeColor}
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
            interactiveColor={themeColor}
            mode="secondary"
            testID="mapLocationChip"
          />
        )}

        {activeType('favorites') &&
          favorites.map((fav, i) => (
            <FavoriteChip
              interactiveColor={themeColor}
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
              style={
                !activeType('add-favorite') && i === favorites.length - 1
                  ? {marginRight: 0}
                  : undefined
              }
              testID={'favoriteChip' + i}
            />
          ))}
        {activeType('add-favorite') && (
          <FavoriteChip
            interactiveColor={themeColor}
            mode="secondary"
            text={t(FavoriteTexts.chips.addFavorite)}
            accessibilityRole="button"
            leftIcon={{svg: Add}}
            onPress={onAddFavorite}
            style={{marginRight: 0}}
            testID={'addFavoriteButton'}
          />
        )}
      </ScrollView>
    </>
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
      type="inline"
      compact={true}
    />
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  staticChipsContainer: {
    flexDirection: 'row',
  },
}));

function useCurrentLocationChip(
  onSelectLocation: (location: GeoLocation) => void,
) {
  const {location, requestPermission} = useGeolocationState();

  const [recentlyAllowedGeo, setsetRecentlyAllowedGeo] = useState(false);

  const onCurrentLocation = useCallback(
    async function () {
      if (location) {
        onSelectLocation(location);
      } else {
        const status = await requestPermission();
        if (status === 'granted') {
          setsetRecentlyAllowedGeo(true);
        }
      }
    },
    [location, onSelectLocation, requestPermission],
  );

  useEffect(() => {
    if (recentlyAllowedGeo && location) {
      onSelectLocation(location);
    }
  }, [recentlyAllowedGeo, location]);

  return {onCurrentLocation};
}
