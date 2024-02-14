import {Add, Edit} from '@atb/assets/svg/mono-icons/actions';
import {StopPlaceInfo} from '@atb/api/departures/types';
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
import {
  DeparturesTexts,
  FavoriteDeparturesTexts,
  useTranslation,
} from '@atb/translations';
import {Coordinates} from '@atb/sdk';
import haversineDistance from 'haversine-distance';
import React, {useEffect} from 'react';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {useFavoriteDepartureData} from '../use-favorite-departure-data';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemedNoFavouriteDepartureImage} from '@atb/theme/ThemedAssets';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {StaticColorByType} from '@atb/theme/colors';

type Props = {
  onEditFavouriteDeparture: () => void;
  onAddFavouriteDeparture: () => void;
  onPressDeparture: QuaySectionProps['onPressDeparture'];
  style?: StyleProp<ViewStyle>;
};

const themeColor: StaticColorByType<'background'> = 'background_accent_0';
export const DeparturesWidget = ({
  onEditFavouriteDeparture,
  onAddFavouriteDeparture,
  onPressDeparture,
  style,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures} = useFavorites();
  const {location} = useGeolocationState();
  const {state, loadInitialDepartures, searchDate} = useFavoriteDepartureData();

  useEffect(() => loadInitialDepartures(), [loadInitialDepartures]);

  const {open: openBottomSheet, onCloseFocusRef} = useBottomSheet();

  async function openFrontpageFavouritesBottomSheet() {
    openBottomSheet(() => {
      return (
        <SelectFavouritesBottomSheet
          onEditFavouriteDeparture={onEditFavouriteDeparture}
        />
      );
    });
  }

  const sortedStopPlaceGroups = location
    ? state.data?.sort((a, b) =>
        compareStopsByDistance(a.stopPlace, b.stopPlace, location.coordinates),
      )
    : state.data;

  return (
    <View style={style}>
      <ContentHeading
        style={styles.heading}
        color={themeColor}
        text={t(DeparturesTexts.widget.heading)}
      />
      {!favoriteDepartures.length && (
        <Section>
          <GenericSectionItem>
            <View style={styles.noFavouritesView}>
              <ThemedNoFavouriteDepartureImage />
              <View style={styles.noFavouritesTextContainer}>
                <ThemeText
                  type="body__secondary"
                  color="secondary"
                  style={styles.noFavouritesText}
                  testID="noFavoriteWidget"
                >
                  {t(DeparturesTexts.message.noFavouritesWidget)}
                </ThemeText>
              </View>
            </View>
          </GenericSectionItem>
          <LinkSectionItem
            textType="body__secondary"
            text={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
            onPress={onAddFavouriteDeparture}
            icon={<ThemeIcon svg={Add} />}
            testID="addFavoriteDeparture"
          />
        </Section>
      )}

      {state.isLoading && (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      )}

      {sortedStopPlaceGroups?.map((stopPlaceGroup) => (
        <View key={stopPlaceGroup.stopPlace.id} testID="favoriteDepartures">
          {stopPlaceGroup.quays.map((quay) => (
            <QuaySection
              key={quay.quay.id}
              quayGroup={quay}
              searchDate={searchDate}
              locationOrStopPlace={location || undefined}
              onPressDeparture={onPressDeparture}
              testID="stopPlace"
            />
          ))}
        </View>
      ))}

      {!!favoriteDepartures.length && (
        <Button
          mode="secondary"
          backgroundColor={themeColor}
          onPress={openFrontpageFavouritesBottomSheet}
          text={t(DeparturesTexts.button.text)}
          rightIcon={{svg: Edit}}
          ref={onCloseFocusRef}
          testID="selectFavoriteDepartures"
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
  heading: {
    marginBottom: theme.spacings.small,
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
