import {screenReaderPause} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Boat} from '@atb/assets/svg/mono-icons/transportation';
import HarborSearchTexts from '@atb/translations/screens/subscreens/HarborSearch';
import sortBy from 'lodash.sortby';
import {GeoLocation} from '@atb/modules/favorites';
import haversine from 'haversine-distance';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useGeolocationContext} from '@atb/GeolocationContext';
import {TFunc} from '@leile/lobo-t';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {StopPlaceFragmentWithIsFree} from '@atb/harbors/types';

type Props = {
  harbors: StopPlaceFragment[];
  onSelect: (l: StopPlaceFragment) => void;
  searchText?: string;
  fromHarborName?: string;
};

export const HarborResults: React.FC<Props> = ({
  harbors,
  onSelect,
  searchText = '',
  fromHarborName,
}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  const {location} = useGeolocationContext();
  const currentLocation = location || undefined;

  let harborResults = sortHarbors(harbors, currentLocation);

  if (searchText.length > 1 && harbors) {
    harborResults = harborResults.filter((harbor) =>
      harbor.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }

  const showEmptyResultText = !harborResults.length && !!searchText;

  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        {showEmptyResultText ? (
          <MessageInfoBox
            type="info"
            message={t(HarborSearchTexts.messages.emptyResult)}
          />
        ) : (
          <ThemeText typography="body__secondary" color="secondary">
            {getHeading(t, searchText, fromHarborName, currentLocation)}
          </ThemeText>
        )}
      </View>
      <View>
        {harborResults.map((harbor, index) => (
          <View style={styles.rowContainer} key={harbor.id}>
            <View style={styles.buttonContainer}>
              <PressableOpacity
                accessible={true}
                accessibilityLabel={
                  t(HarborSearchTexts.results.item.a11yLabel(harbor.name)) +
                  screenReaderPause
                }
                accessibilityHint={t(HarborSearchTexts.results.item.a11yHint)}
                accessibilityRole="button"
                hitSlop={insets.symmetric(8, 1)}
                onPress={() => onSelect(harbor)}
                style={styles.button}
                testID={'harborResult' + index}
              >
                <ThemeIcon svg={Boat} />
                <View style={styles.nameContainer}>
                  <ThemeText typography="body__primary--bold">
                    {harbor.name}
                  </ThemeText>
                </View>
              </PressableOpacity>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};
// sort by distance or alphabetically
function sortHarbors(
  harbors: StopPlaceFragment[],
  location?: GeoLocation,
): StopPlaceFragmentWithIsFree[] {
  if (location) {
    return harbors
      ?.map((stopPlace) => {
        return {
          ...stopPlace,
          distance: getDistance(stopPlace, location),
        };
      })
      .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
  }
  return sortBy(harbors, ['name']);
}

function getHeading(
  t: TFunc<any>,
  searchText?: string,
  fromHarborName?: string,
  currentLocation?: GeoLocation,
) {
  if (searchText?.length && searchText?.length > 1) {
    return t(HarborSearchTexts.results.resultsHeading);
  }
  if (fromHarborName) {
    return t(HarborSearchTexts.results.arrivalHeading(fromHarborName));
  }
  if (currentLocation) {
    return t(HarborSearchTexts.results.nearestHeading);
  }
  return t(HarborSearchTexts.results.departureHeading);
}

function getDistance(
  stopPlace: {latitude?: number; longitude?: number},
  location: GeoLocation,
) {
  return stopPlace?.latitude && stopPlace?.longitude
    ? haversine(location.coordinates, [stopPlace.longitude, stopPlace.latitude])
    : undefined;
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  subHeader: {
    padding: theme.spacing.medium,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    padding: theme.spacing.medium,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginHorizontal: theme.spacing.medium,
  },
}));
