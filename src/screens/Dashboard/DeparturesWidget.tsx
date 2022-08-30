import {getFavouriteDepartures} from '@atb/api/departures';
import {
  DepartureLineInfo,
  DepartureTime,
  StopPlaceGroup,
} from '@atb/api/departures/types';
import {FavouriteDepartureQuery} from '@atb/api/types/generated/FavouriteDepartures';
import ThemeText from '@atb/components/text';
import QuaySection from '@atb/departure-list/section-items/quay-section';
import {useFavorites} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import {TicketsTexts, useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import groupBy from 'lodash.groupby';
import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import {themeColor} from '../Onboarding/WelcomeScreen';

const FavouritesWidget: React.FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures} = useFavorites();
  const {location} = useGeolocationState();
  const [polling, setPolling] = useState(false);
  const [favResults, setFavResults] = useState<StopPlaceGroup[]>([]);
  const [searchDate, setSearchDate] = useState<string>('');
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const fetchFavouriteDepartures = async () => {
    if (!favoriteDepartures || !navigation.isFocused()) return; // prevent backgound polling
    const result = await getFavouriteDepartures(favoriteDepartures).then(
      (data) => {
        if (data) {
          setFavResults(data);
          setSearchDate(new Date().toISOString());
        }
      },
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (polling) {
      fetchFavouriteDepartures();
      interval = setInterval(fetchFavouriteDepartures, 10000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [polling]);

  // timer
  useEffect(() => {
    if (isFocused && !!favoriteDepartures.length) {
      setPolling(true);
    } else {
      setPolling(false);
    }
  }, [isFocused, !!favoriteDepartures.length]);

  //
  useEffect(() => {
    fetchFavouriteDepartures();
  }, [favoriteDepartures.length]);

  return (
    <View style={styles.container}>
      <ThemeText
        type="body__secondary"
        color="background_accent_0"
        style={styles.heading}
      >
        {t(DeparturesTexts.widget.heading)}
      </ThemeText>

      {favResults.map((stopPlaceGroup) => {
        const stopPlaceInfo = stopPlaceGroup.stopPlace;
        return (
          <>
            {stopPlaceGroup.quays.map((quay) => {
              return (
                <QuaySection
                  quayGroup={quay}
                  stop={stopPlaceInfo}
                  searchDate={searchDate}
                  currentLocation={location || undefined}
                />
              );
            })}
          </>
        );
      })}
    </View>
  );
};

export default FavouritesWidget;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
  },
  heading: {
    marginTop: theme.spacings.large,
    marginBottom: theme.spacings.medium,
  },
}));
