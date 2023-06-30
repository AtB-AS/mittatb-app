import {screenReaderPause} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Boat} from '@atb/assets/svg/mono-icons/transportation';
import {StopPlace, StopPlaces} from '@atb/api/types/stopPlaces';
import HarborSearchTexts from '@atb/translations/screens/subscreens/HarborSearch';
import sortBy from 'lodash.sortby';
import {GeoLocation} from '@atb/favorites';
import haversine from 'haversine-distance';
import {MessageBox} from '@atb/components/message-box';
import {useGeolocationState} from '@atb/GeolocationContext';
import {TFunc} from '@leile/lobo-t';

type Props = {
  harbors: StopPlaces;
  onSelect: (l: StopPlace) => void;
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

  const [harborResults, setHarborResults] = useState<StopPlaces | []>([]);
  const {location} = useGeolocationState();
  const currentLocation = location || undefined;

  useEffect(() => {
    harbors && setHarborResults(sortHarbors(harbors, currentLocation));
  }, [harbors, currentLocation]);

  useEffect(() => {
    if (searchText.length > 1 && harbors) {
      setHarborResults(
        sortHarbors(harbors, currentLocation).filter((harbor) => {
          return harbor.name.toLowerCase().includes(searchText.toLowerCase());
        }),
      );
    } else {
      harbors && setHarborResults(sortHarbors(harbors, currentLocation));
    }
  }, [searchText]);
  const showEmptyResultText = !harborResults.length && !!searchText;

  return (
    <>
      <View accessibilityRole="header" style={styles.subHeader}>
        {showEmptyResultText ? (
          <MessageBox
            type="info"
            message={t(HarborSearchTexts.messages.emptyResult)}
          />
        ) : (
          <ThemeText type="body__secondary" color="secondary">
            {getheading(t, searchText, fromHarborName, currentLocation)}
          </ThemeText>
        )}
      </View>
      <View>
        {harborResults.map((harbor, index) => (
          <View style={styles.rowContainer} key={harbor.id}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
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
                  <ThemeText type={'body__primary--bold'}>
                    {harbor.name}
                  </ThemeText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};
// sort by distance or alphabetically
function sortHarbors(harbors: StopPlaces, location?: GeoLocation): StopPlaces {
  if (location) {
    return harbors
      ?.map((stopPlace) => {
        return {
          id: stopPlace.id,
          name: stopPlace.name,
          distance: getDistance(stopPlace, location),
        };
      })
      .filter((stopPlace) => stopPlace.distance != -1)
      .sort((a, b) => a.distance - b.distance);
  }
  return sortBy(harbors, ['name']);
}

function getheading(
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
    : -1;
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  subHeader: {
    padding: theme.spacings.medium,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    padding: theme.spacings.medium,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginHorizontal: theme.spacings.medium,
  },
}));
