import {Quay, StopPlace} from '@atb/api/types/departures';
import {Button} from '@atb/components/button';
import {FullScreenHeader} from '@atb/components/screen-header';
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
import {MessageBox} from '@atb/components/message-box';

export type PlaceScreenParams = {
  place: StopPlace;
  selectedQuayId?: string;
  showOnlyFavoritesByDefault?: boolean;
  mode: StopPlacesMode;
  onCloseRoute?: string;
};
export type PlaceScreenProps = DeparturesStackProps<'PlaceScreen'>;

export default function PlaceScreen({
  navigation,
  route: {
    params: {
      place,
      selectedQuayId,
      showOnlyFavoritesByDefault,
      mode,
      onCloseRoute,
    },
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
  const isFocused = useIsFocused();

  let missingStopData = false;

  if (state.data && place.quays === undefined) {
    if (state.data.stopPlaces[0]) {
      place = state.data.stopPlaces[0];
    } else {
      missingStopData = true;
    }
  }

  if (state.error || missingStopData) {
    return (
      <View style={styles.container}>
        <FullScreenHeader title={place.name} leftButton={{type: 'back'}} />
        <MessageBox
          style={styles.messageBox}
          type="error"
          message={t(DeparturesTexts.message.resultNotFound)}
        />
      </View>
    );
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
        selectedQuayId: quay.id,
        mode: mode,
        place: place,
      });
    } else {
      navigation.setParams({selectedQuayId: quay.id});
    }
  };

  const selectedQuay = selectedQuayId
    ? place.quays?.find((q) => q.id === selectedQuayId)
    : undefined;

  return (
    <View style={styles.container}>
      <FullScreenHeader title={place.name} leftButton={{type: 'back'}} />
      {mode === 'Departure' && (
        <StopPlaceAndQuaySelection
          place={place}
          selectedQuay={selectedQuay}
          onPress={(quayId) => navigation.setParams({selectedQuayId: quayId})}
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
            onPress={() =>
              onCloseRoute
                ? navigation.navigate(onCloseRoute as any)
                : navigation.popToTop()
            }
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
  quayData: {flex: 1},
  messageBox: {
    margin: theme.spacings.medium,
  },
}));
