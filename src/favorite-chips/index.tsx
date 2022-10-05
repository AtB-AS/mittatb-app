import {Add} from '@atb/assets/svg/mono-icons/actions';
import {Pin} from '@atb/assets/svg/mono-icons/map';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {screenReaderPause} from '@atb/components/accessible-text';
import Button, {ButtonProps} from '@atb/components/button';
import {useGeolocationState} from '@atb/GeolocationContext';
import {RootStackProps} from '@atb/navigation/types';
import {StyleSheet, useTheme} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
import {FavoriteTexts, useTranslation} from '@atb/translations';
import useDisableMapCheck from '@atb/utils/use-disable-map-check';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {FavoriteIcon, useFavorites} from '../favorites';
import {GeoLocation, Location} from '../favorites/types';

const themeColor: InteractiveColor = 'interactive_0';

type Props = {
  onSelectLocation: (location: Location) => void;
  onMapSelection?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  chipTypes?: ChipTypeGroup[];
  chipActionHint?: string;
};

export type ChipTypeGroup = 'location' | 'map' | 'favorites' | 'add-favorite';

const FavoriteChips: React.FC<Props> = ({
  onSelectLocation,
  containerStyle,
  contentContainerStyle,
  onMapSelection = () => {},
  chipTypes = ['favorites', 'location', 'map'],
  chipActionHint,
}) => {
  // @TODO this shouldn't refer to useNavigation but have onEditPress or something
  const navigation = useNavigation<RootStackProps['navigation']>();
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
              interactiveColor={themeColor}
              mode="secondary"
              text={t(FavoriteTexts.chips.currentLocation)}
              accessibilityRole="button"
              accessibilityHint={chipActionHint ?? ''}
              icon={LocationIcon}
              onPress={onCurrentLocation}
              testID="currentLocationChip"
            />
          )}
          {activeType('map') && !disableMap && (
            <FavoriteChip
              text={t(FavoriteTexts.chips.mapLocation)}
              accessibilityRole="button"
              icon={Pin}
              onPress={onMapSelection}
              interactiveColor={themeColor}
              mode="secondary"
              testID="mapLocationChip"
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
              interactiveColor={themeColor}
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
              testID={'favoriteChip' + i}
            />
          ))}
        {activeType('add-favorite') && (
          <FavoriteChip
            interactiveColor={themeColor}
            mode="secondary"
            text={t(FavoriteTexts.chips.addFavorite)}
            accessibilityRole="button"
            icon={Add}
            onPress={() =>
              navigation.navigate('AddEditFavorite', {screen: 'SearchLocation'})
            }
            style={{marginRight: 0}}
            testID={'addFavoriteButton'}
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
