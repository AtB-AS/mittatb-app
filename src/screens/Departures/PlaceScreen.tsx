import {Place, Quay} from '@atb/api/types/departures';
import Button from '@atb/components/button';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {SearchTime} from '@atb/screens/Departures/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import QuayView from './QuayView';
import {useStopsDetailsData} from './state/stop-place-details-state';
import StopPlaceView from './StopPlaceView';
import {DeparturesStackProps} from './types';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';

export type PlaceScreenMode = 'Favourite' | 'Departure';
export type PlaceScreenParams = {
  place: Place;
  selectedQuay?: Quay;
  showOnlyFavoritesByDefault?: boolean;
  mode: PlaceScreenMode;
};

type quayChipData = {
  item: Quay;
};

export type PlaceScreenProps = DeparturesStackProps<'PlaceScreen'>;

export default function PlaceScreen({
  navigation,
  route: {
    params: {
      place,
      selectedQuay,
      showOnlyFavoritesByDefault,
      mode,
    },
  },
}: PlaceScreenProps) {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(
    showOnlyFavoritesByDefault || false,
  );

  const {state} = useStopsDetailsData(
    place.quays === undefined ? [place.id] : undefined,
  );

  if (state.data && place.quays === undefined) {
    place = state.data.stopPlaces[0];
  }

  const isMissingQuays = place.quays === undefined;

  const navigateToDetails = (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => {
    if (!serviceJourneyId || !date) return;
    navigation.push('DepartureDetails', {
      items: [
        {
          serviceJourneyId,
          serviceDate,
          date,
          fromQuayId,
          isTripCancelled,
        },
      ],
      activeItemIndex: 0,
    });
  };
  const navigateToQuay = (quay: Quay) => {
    navigation.setParams({selectedQuay: quay});
  };
  const isFocused = useIsFocused();

  return (
    <View style={styles.container}>
      <FullScreenHeader title={place.name} leftButton={{type: 'back'}} />
      {mode === 'Departure' && (
        <FlatList
          data={place.quays}
          style={styles.quayChipContainer}
          horizontal={!isMissingQuays}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {isMissingQuays ? (
                <ActivityIndicator size="large" />
              ) : (
                <Button
                  onPress={() => {
                    navigation.setParams({selectedQuay: undefined});
                  }}
                  text={t(DeparturesTexts.quayChips.allStops)}
                  interactiveColor="interactive_1"
                  active={!selectedQuay}
                  style={[styles.quayChip, {marginLeft: theme.spacings.medium}]}
                  accessibilityHint={t(
                    DeparturesTexts.quayChips.a11yAllStopsHint,
                  )}
                  testID="allStopsSelectionButton"
                ></Button>
              )}
            </>
          }
          renderItem={({item}: quayChipData) => (
            <Button
              onPress={() => {
                navigation.setParams({selectedQuay: item});
              }}
              text={getQuayName(item)}
              interactiveColor="interactive_1"
              active={selectedQuay?.id === item.id}
              style={styles.quayChip}
              accessibilityHint={
                t(DeparturesTexts.quayChips.a11yHint) + getQuayName(item)
              }
              testID="quaySelectionButton"
            ></Button>
          )}
        />
      )}

      <View style={styles.quayData}>
        {selectedQuay ? (
          <QuayView
            quay={selectedQuay}
            navigateToDetails={navigateToDetails}
            searchTime={searchTime}
            setSearchTime={setSearchTime}
            showOnlyFavorites={showOnlyFavorites}
            setShowOnlyFavorites={setShowOnlyFavorites}
            testID="departuresContentView"
            stopPlace={place}
            mode={mode}
          />
        ) : (
          <StopPlaceView
            stopPlace={place}
            isFocused={isFocused}
            navigateToDetails={navigateToDetails}
            navigateToQuay={navigateToQuay}
            searchTime={searchTime}
            setSearchTime={setSearchTime}
            showOnlyFavorites={showOnlyFavorites}
            setShowOnlyFavorites={setShowOnlyFavorites}
            testID="departuresContentView"
            allowFavouriteSelection={true}
            mode={mode}
          />
        )}
      </View>

      {mode === 'Favourite' && (
        <FullScreenFooter>
          <Button
            style={styles.closeButton}
            interactiveColor="interactive_0"
            text={t(DeparturesTexts.closeButton.label)}
            onPress={() => navigation.popToTop()}
            testID="confirmButton"
          />
        </FullScreenFooter>
      )}
    </View>
  );
}

function getQuayName(quay: Quay): string {
  return quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name;
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  quayChipContainer: {
    backgroundColor: theme.static.background.background_accent_0.background,
    paddingVertical: theme.spacings.medium,
    flexShrink: 0,
    flexGrow: 0,
  },
  quayChip: {
    marginRight: theme.spacings.medium,
  },
  closeButton: {
    marginTop: theme.spacings.medium,
  },
  quayData: {flex: 1, marginTop: theme.spacings.small},
}));
