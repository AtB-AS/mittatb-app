import {Add, Edit} from '@atb/assets/svg/mono-icons/actions';
import {StopPlaceInfo} from '@atb/api/departures/types';
import {NoFavouriteDeparture} from '@atb/assets/svg/color/images/';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {
  QuaySection,
  QuaySectionProps,
} from '@atb/departure-list/section-items/quay-section';
import {useFavorites} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import {SelectFavouritesBottomSheet} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/components/SelectFavouritesBottomSheet';
import {StyleSheet} from '@atb/theme';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {Coordinates} from '@entur/sdk';
import haversineDistance from 'haversine-distance';
import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useFavoriteDepartureData} from '../use-favorite-departure-data';
import * as Sections from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';

type Props = {
  onEditFavouriteDeparture: () => void;
  onAddFavouriteDeparture: () => void;
  onPressDeparture: QuaySectionProps['onPressDeparture'];
};

export const DeparturesWidget = ({
  onEditFavouriteDeparture,
  onAddFavouriteDeparture,
  onPressDeparture,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures} = useFavorites();
  const {location} = useGeolocationState();
  const {state, loadInitialDepartures, searchDate} = useFavoriteDepartureData();

  useEffect(() => loadInitialDepartures(), [favoriteDepartures]);

  const {open: openBottomSheet} = useBottomSheet();
  const closeRef = useRef(null);
  async function openFrontpageFavouritesBottomSheet() {
    openBottomSheet((close) => {
      return (
        <SelectFavouritesBottomSheet
          close={close}
          onEditFavouriteDeparture={onEditFavouriteDeparture}
        />
      );
    }, closeRef);
  }

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
        <Sections.Section>
          <Sections.GenericSectionItem>
            <View style={styles.noFavouritesView}>
              <NoFavouriteDeparture />
              <View style={styles.noFavouritesTextContainer}>
                <ThemeText
                  type="body__secondary"
                  color="secondary"
                  style={styles.noFavouritesText}
                >
                  {t(DeparturesTexts.message.noFavouritesWidget)}
                </ThemeText>
              </View>
            </View>
          </Sections.GenericSectionItem>
          <Sections.LinkSectionItem
            textType="body__secondary"
            text={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
            onPress={onAddFavouriteDeparture}
            icon={<ThemeIcon svg={Add} />}
          />
        </Sections.Section>
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
              onPressDeparture={onPressDeparture}
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
          rightIcon={{svg: Edit}}
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
  },
  heading: {
    marginTop: theme.spacings.large,
    marginBottom: theme.spacings.medium,
  },
  noFavouritesView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noFavouritesTextContainer: {
    flex: 1,
    paddingVertical: theme.spacings.small,
  },
  noFavouritesText: {
    marginHorizontal: theme.spacings.small,
  },
  noFavouritesUrl: {
    marginVertical: theme.spacings.xSmall,
  },
  activityIndicator: {
    marginVertical: theme.spacings.medium,
  },
}));
