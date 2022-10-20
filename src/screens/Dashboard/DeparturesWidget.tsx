import {StopPlaceInfo} from '@atb/api/departures/types';
import {NoFavouriteDeparture} from '@atb/assets/svg/color/images/';
import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import QuaySection from '@atb/departure-list/section-items/quay-section';
import {useFavorites} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import SelectFavouritesBottomSheet from '@atb/screens/Assistant/SelectFavouritesBottomSheet';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {Coordinates} from '@entur/sdk';
import haversineDistance from 'haversine-distance';
import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Linking, TouchableOpacity, View} from 'react-native';
import {useFavoriteDepartureData} from './state';

const DeparturesWidget: React.FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {new_favourites_info_url} = useRemoteConfig();
  const {favoriteDepartures} = useFavorites();
  const {location} = useGeolocationState();
  const {state, loadInitialDepartures, searchDate} = useFavoriteDepartureData();

  useEffect(() => loadInitialDepartures(), [favoriteDepartures]);

  const {open: openBottomSheet} = useBottomSheet();
  const closeRef = useRef(null);
  async function openFrontpageFavouritesBottomSheet() {
    openBottomSheet((close) => {
      return <SelectFavouritesBottomSheet close={close} />;
    }, closeRef);
  }

  const openAppInfoUrl = () => Linking.openURL(new_favourites_info_url);

  const sortedStopPlaceGroups = location
    ? state.data?.sort((a, b) =>
        compareStopsByDistance(a.stopPlace, b.stopPlace, location.coordinates),
      )
    : state.data;

  return (
    <View style={styles.container}>
      <ThemeText
        type="body__secondary"
        color="background_accent_0"
        style={styles.heading}
      >
        {t(DeparturesTexts.widget.heading)}
      </ThemeText>

      {!favoriteDepartures.length && (
        <View
          style={styles.noFavouritesView}
          accessible={true}
          accessibilityRole="link"
          accessibilityActions={[{name: 'activate'}]}
          onAccessibilityAction={openAppInfoUrl}
          accessibilityLabel={
            t(DeparturesTexts.message.noFavouritesWidget) +
            ' ' +
            t(DeparturesTexts.message.readMoreUrl)
          }
        >
          <NoFavouriteDeparture />
          <View style={styles.noFavouritesTextContainer}>
            <ThemeText>
              {t(DeparturesTexts.message.noFavouritesWidget)}
            </ThemeText>
            {new_favourites_info_url && (
              <TouchableOpacity
                onPress={openAppInfoUrl}
                importantForAccessibility={'no'}
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

      {state.isLoading && (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      )}

      {sortedStopPlaceGroups?.map((stopPlaceGroup) => (
        <View key={stopPlaceGroup.stopPlace.id}>
          {stopPlaceGroup.quays.map((quay) => (
            <QuaySection
              key={quay.quay.id}
              quayGroup={quay}
              stop={stopPlaceGroup.stopPlace}
              searchDate={searchDate}
              locationOrStopPlace={location || undefined}
              mode="frontpage"
            />
          ))}
        </View>
      ))}

      {!!favoriteDepartures.length && (
        <Button
          mode="secondary"
          type="block"
          onPress={openFrontpageFavouritesBottomSheet}
          text={t(DeparturesTexts.button.text)}
          icon={Edit}
          iconPosition="right"
          ref={closeRef}
        />
      )}
    </View>
  );
};

function compareStopsByDistance(
  a: StopPlaceInfo,
  b: StopPlaceInfo,
  geolocation: Coordinates,
) {
  // Place stops without coordinates last
  if (!a.latitude || !a.longitude) return -1;
  if (!b.latitude || !b.longitude) return 1;

  const distanceToA = haversineDistance(
    {lat: a.latitude, lon: a.longitude},
    geolocation,
  );
  const distanceToB = haversineDistance(
    {lat: b.latitude, lon: b.longitude},
    geolocation,
  );
  return distanceToA - distanceToB;
}

export default DeparturesWidget;

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
  activityIndicator: {
    marginVertical: theme.spacings.medium,
  },
}));
