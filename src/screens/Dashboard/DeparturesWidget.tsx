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
import {useIsFocused} from '@react-navigation/native';
import {NoFavouriteDeparture} from '@atb/assets/svg/color/images/';

import React, {useEffect, useState} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';

const FavouritesWidget: React.FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {new_favourites_info_url} = useRemoteConfig();
  const {favoriteDepartures, frontPageFavouriteDepartures} = useFavorites();
  const {location} = useGeolocationState();
  const [polling, setPolling] = useState(false);
  const [favouritesResults, setFavouritesResults] = useState<StopPlaceGroup[]>(
    [],
  );
  const [searchDate, setSearchDate] = useState<string>('');
  const isFocused = useIsFocused();
  const {favourite_departures_poll_interval} = useRemoteConfig();

  const fetchFavouriteFrontpageDepartures = async () => {
    const data = await getFavouriteDepartures(frontPageFavouriteDepartures);
    setFavouritesResults(data || []);
    setSearchDate(new Date().toISOString());
  };

  // timer orchestration
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;
    if (polling) {
      fetchFavouriteFrontpageDepartures();
      interval = setInterval(
        fetchFavouriteFrontpageDepartures,
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

  // do polling only when screen has focus and user has frontpage favourites.
  useEffect(() => {
    if (isFocused && !!frontPageFavouriteDepartures.length) {
      setPolling(true);
    } else {
      setPolling(false);
    }
  }, [isFocused, !!frontPageFavouriteDepartures.length]);

  // refresh favourite departures when user adds or removees a favourite
  useEffect(() => {
    fetchFavouriteFrontpageDepartures();
  }, [frontPageFavouriteDepartures.length]);

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

      {!frontPageFavouriteDepartures.length && (
        <View style={styles.noFavouritesView}>
          <NoFavouriteDeparture />
          <View style={styles.noFavouritesTextContainer}>
            <ThemeText>
              {!favoriteDepartures.length
                ? t(DeparturesTexts.message.noFavouritesWidget)
                : t(DeparturesTexts.message.noFrontpageFavouritesWidget)}
            </ThemeText>
            {new_favourites_info_url && (
              <TouchableOpacity
                onPress={() => Linking.openURL(new_favourites_info_url)}
              >
                <ThemeText
                  color="background_0"
                  type="body__primary--underline"
                  style={styles.noFavouritesUrl}
                >
                  {t(DeparturesTexts.message.readMoreUrl)}
                </ThemeText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {favouritesResults.map((stopPlaceGroup) => {
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
                  mode="frontpage"
                />
              );
            })}
          </View>
        );
      })}

      {!!favoriteDepartures.length && (
        <Button
          mode="secondary"
          type="block"
          onPress={openFrontpageFavouritesBottomSheet}
          text={t(DeparturesTexts.button.text)}
          icon={Edit}
          iconPosition="right"
        />
      )}
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
  noFavouritesView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  noFavouritesTextContainer: {
    flex: 1,
  },
  noFavouritesUrl: {
    marginVertical: theme.spacings.xSmall,
  },
}));
