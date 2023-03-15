import {Quay, StopPlace} from '@atb/api/types/departures';
import {Button} from '@atb/components/button';
import {FullScreenHeader} from '@atb/components/screen-header';
import {SearchTime} from './types';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {StopPlacesMode} from '@atb/nearby-stop-places';
import {MessageBox} from '@atb/components/message-box';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {useStopsDetailsData} from './hooks/use-stop-details-data';
import {StopPlaceAndQuaySelection} from './components/StopPlaceAndQuaySelection';
import QuayView from './components/QuayView';
import {StopPlaceView} from './components/StopPlaceView';

export type PlaceScreenParams = {
  place: StopPlace;
  selectedQuayId?: string;
  showOnlyFavoritesByDefault?: boolean;
  addToFrontPageOnFavourite?: boolean;
  mode: StopPlacesMode;
};

type Props = PlaceScreenParams & {
  onPressQuay?: (
    stopPlace: StopPlace,
    quayId: string | undefined,
    onlyReplaceParam: boolean,
  ) => void;
  onPressDeparture?: (
    items: ServiceJourneyDeparture[],
    activeItemIndex: number,
  ) => void;
  onPressClose?: () => void;
};

export const PlaceScreenComponent = ({
  place,
  selectedQuayId,
  showOnlyFavoritesByDefault,
  mode,
  addToFrontPageOnFavourite,
  onPressQuay,
  onPressDeparture,
  onPressClose,
}: Props) => {
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
    if (!date) return;
    onPressDeparture?.(
      [
        {
          serviceJourneyId,
          serviceDate,
          date,
          fromQuayId,
          isTripCancelled,
        },
      ],
      0,
    );
  };

  const navigateToQuay = (quay: Quay) => {
    onPressQuay?.(place, quay.id, mode !== 'Favourite');
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
          onPress={(quayId) => onPressQuay?.(place, quayId, true)}
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
            addToFrontPageOnFavourite={addToFrontPageOnFavourite}
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
            addToFrontPageOnFavourite={addToFrontPageOnFavourite}
            setShowOnlyFavorites={setShowOnlyFavorites}
            testID="departuresContentView"
            allowFavouriteSelection={true}
            mode={mode}
          />
        )}
      </View>

      {onPressClose && (
        <View style={styles.closeButton}>
          <Button
            interactiveColor="interactive_0"
            text={t(DeparturesTexts.closeButton.label)}
            onPress={onPressClose}
            testID="confirmButton"
          />
        </View>
      )}
    </View>
  );
};

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
