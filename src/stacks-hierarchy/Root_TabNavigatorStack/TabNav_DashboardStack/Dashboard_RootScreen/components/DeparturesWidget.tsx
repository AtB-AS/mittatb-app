import {Add, Edit} from '@atb/assets/svg/mono-icons/actions';
import {StopPlaceInfo} from '@atb/api/bff/types';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {
  QuaySection,
  QuaySectionProps,
} from '@atb/departure-list/section-items/quay-section';
import {useFavoritesContext} from '@atb/modules/favorites';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {SelectFavouritesBottomSheet} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/components/SelectFavouritesBottomSheet';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  DeparturesTexts,
  FavoriteDeparturesTexts,
  useTranslation,
} from '@atb/translations';
import {Coordinates} from '@atb/utils/coordinates';
import haversineDistance from 'haversine-distance';
import React, {useRef} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {useFavoriteDeparturesQuery} from '../use-favorite-departures-query';
import {ThemedNoFavouriteDepartureImage} from '@atb/theme/ThemedAssets';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Loading} from '@atb/components/loading';

type Props = {
  onEditFavouriteDeparture: () => void;
  onAddFavouriteDeparture: () => void;
  onPressDeparture: QuaySectionProps['onPressDeparture'];
  style?: StyleProp<ViewStyle>;
};

export const DeparturesWidget = ({
  onEditFavouriteDeparture,
  onAddFavouriteDeparture,
  onPressDeparture,
  style,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const themeColor = theme.color.background.neutral[1];
  const {favoriteDepartures} = useFavoritesContext();
  const {location} = useGeolocationContext();
  const isFocused = useIsFocusedAndActive();
  const {data: favoriteDeparturesData, isLoading: favoriteDeparturesIsLoading} =
    useFavoriteDeparturesQuery(isFocused);
  const onCloseFocusRef = useRef<View>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  async function openFrontpageFavouritesBottomSheet() {
    bottomSheetRef.current?.present();
  }

  const sortedStopPlaceGroups = location
    ? favoriteDeparturesData?.data?.sort((a, b) =>
        compareStopsByDistance(a.stopPlace, b.stopPlace, location.coordinates),
      )
    : favoriteDeparturesData?.data;

  const searchDate =
    favoriteDeparturesData?.startTime ?? new Date().toISOString();

  return (
    <View style={style}>
      <ContentHeading
        style={styles.heading}
        text={t(DeparturesTexts.widget.heading)}
      />
      {!favoriteDepartures.length && (
        <Section>
          <GenericSectionItem>
            <View style={styles.noFavouritesView}>
              <ThemedNoFavouriteDepartureImage height={64} width={64} />
              <View style={styles.noFavouritesTextContainer}>
                <ThemeText
                  typography="body__s"
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
            textType="body__s"
            text={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
            onPress={onAddFavouriteDeparture}
            rightIcon={{svg: Add}}
            testID="addFavoriteDeparture"
          />
        </Section>
      )}
      {favoriteDeparturesIsLoading && (
        <Loading size="large" style={styles.activityIndicator} />
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
          expanded={true}
          mode="secondary"
          backgroundColor={themeColor}
          onPress={openFrontpageFavouritesBottomSheet}
          text={t(DeparturesTexts.button.text)}
          rightIcon={{svg: Edit}}
          ref={onCloseFocusRef}
          testID="selectFavoriteDepartures"
        />
      )}
      <SelectFavouritesBottomSheet
        onEditFavouriteDeparture={onEditFavouriteDeparture}
        bottomSheetModalRef={bottomSheetRef}
        onCloseFocusRef={onCloseFocusRef}
      />
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
    marginBottom: theme.spacing.small,
  },
  noFavouritesView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noFavouritesTextContainer: {
    flex: 1,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
  },
  noFavouritesText: {
    marginHorizontal: theme.spacing.small,
  },
  noFavouritesUrl: {
    marginVertical: theme.spacing.xSmall,
  },
  activityIndicator: {
    marginVertical: theme.spacing.medium,
  },
}));
