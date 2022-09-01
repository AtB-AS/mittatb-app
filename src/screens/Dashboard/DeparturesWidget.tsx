import {getFavouriteDepartures} from '@atb/api/departures';
import {StopPlaceGroup} from '@atb/api/departures/types';
import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import SelectFavouritesBottomSheet from '@atb/screens/Assistant/SelectFavouritesBottomSheet';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import QuaySection from '@atb/departure-list/section-items/quay-section';
import {useFavorites} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {View} from 'react-native';

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
  const {favourite_departures_poll_interval} = useRemoteConfig();

  const fetchFavouriteDepartures = async () => {
    const data = await getFavouriteDepartures(favoriteDepartures);
    setFavResults(data || []);
    setSearchDate(new Date().toISOString());
  };

  // timer orchestration
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (polling) {
      fetchFavouriteDepartures();
      interval = setInterval(
        fetchFavouriteDepartures,
        favourite_departures_poll_interval,
      );
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

  // do polling only when screen has focus and user has favourites.
  useEffect(() => {
    if (isFocused && !!favoriteDepartures.length) {
      setPolling(true);
    } else {
      setPolling(false);
    }
  }, [isFocused, !!favoriteDepartures.length]);

  // refresh favourite departures when user adds or removees a favourite
  useEffect(() => {
    fetchFavouriteDepartures();
  }, [favoriteDepartures.length]);

  const {open: openBottomSheet} = useBottomSheet();
  async function openFrontpageFavouritesBottomSheet() {
    openBottomSheet((close) => {
      return <SelectFavouritesBottomSheet close={close} />;
    });
  }

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
          <View key={stopPlaceGroup.stopPlace.id}>
            {stopPlaceGroup.quays.map((quay) => {
              return (
                <QuaySection
                  key={quay.quay.id}
                  quayGroup={quay}
                  stop={stopPlaceInfo}
                  searchDate={searchDate}
                  currentLocation={location || undefined}
                />
              );
            })}
          </View>
        );
      })}

      <Button
        mode="secondary"
        type="block"
        onPress={openFrontpageFavouritesBottomSheet}
        text={t(DeparturesTexts.button.text)}
        icon={Edit}
        iconPosition="right"
      />
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
