import {Place, Quay} from '@atb/api/types/departures';
import Button from '@atb/components/button';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {SearchTime} from '@atb/screens/Departures/utils';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import QuayView from './QuayView';
import {useStopsDetailsData} from './state/stop-place-details-state';
import StopPlaceView from './StopPlaceView';
import {DeparturesStackProps, StopPlacesMode} from './types';
import {StopPlaceAndQuaySelection} from '@atb/screens/Departures/components/StopPlaceAndQuaySelection';

export type PlaceScreenParams = {
  place: Place;
  selectedQuay?: Quay;
  showOnlyFavoritesByDefault?: boolean;
  mode: StopPlacesMode;
};
export type PlaceScreenProps = DeparturesStackProps<'PlaceScreen'>;

export default function PlaceScreen({
  navigation,
  route: {
    params: {place, selectedQuay, showOnlyFavoritesByDefault, mode},
  },
}: PlaceScreenProps) {
  const styles = useStyles();
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
    if (mode === 'Favourite') {
      navigation.push('PlaceScreen', {
        selectedQuay: quay,
        mode: mode,
        place: place,
      });
    } else {
      navigation.setParams({selectedQuay: quay});
    }
  };
  const isFocused = useIsFocused();

  return (
    <View style={styles.container}>
      <FullScreenHeader title={place.name} leftButton={{type: 'back'}} />
      {mode === 'Departure' && (
        <StopPlaceAndQuaySelection
          place={place}
          selectedQuay={selectedQuay}
          navigation={navigation}
        />
      )}

      <View style={styles.quayData}>
        {selectedQuay ? (
          <QuayView
            quay={selectedQuay}
            navigateToDetails={
              mode === 'Departure' ? navigateToDetails : undefined
            }
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
            navigateToDetails={
              mode === 'Departure' ? navigateToDetails : undefined
            }
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
        <View style={styles.closeButton}>
          <Button
            interactiveColor="interactive_0"
            text={t(DeparturesTexts.closeButton.label)}
            onPress={() => navigation.pop(selectedQuay ? 3 : 2)} // check if there is a smart way of doing this
            testID="confirmButton"
          />
        </View>
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  closeButton: {
    marginTop: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
    paddingHorizontal: theme.spacings.medium,
  },
  quayData: {flex: 1, marginTop: theme.spacings.small},
}));
