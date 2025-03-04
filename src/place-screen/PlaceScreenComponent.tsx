import {Quay, StopPlace} from '@atb/api/types/departures';
import {Button} from '@atb/components/button';
import {FullScreenHeader} from '@atb/components/screen-header';
import {DepartureSearchTime} from './types';
import {StyleSheet, type Theme, useThemeContext} from '@atb/theme';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {useIsFocused} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {StopPlacesMode} from '@atb/nearby-stop-places';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {StopPlaceAndQuaySelection} from './components/StopPlaceAndQuaySelection';
import {QuayView} from './components/QuayView';
import {StopPlacesView} from './components/StopPlacesView';
import {useStopsDetailsDataQuery} from '@atb/place-screen';

export type PlaceScreenParams = {
  place: StopPlace;
  selectedQuayId?: string;
  showOnlyFavoritesByDefault?: boolean;
  addedFavoritesVisibleOnDashboard?: boolean;
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

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];

export const PlaceScreenComponent = ({
  place,
  selectedQuayId,
  showOnlyFavoritesByDefault,
  mode,
  addedFavoritesVisibleOnDashboard,
  onPressQuay,
  onPressDeparture,
  onPressClose,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];
  const themeColor = getThemeColor(theme);

  const [searchTime, setSearchTime] = useState<DepartureSearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(
    showOnlyFavoritesByDefault || false,
  );

  const {data: stopsDetailsData, isError: isStopsDetailsError} =
    useStopsDetailsDataQuery(place.quays === undefined ? [place.id] : []);

  const isFocused = useIsFocused();

  let missingStopData = false;

  if (stopsDetailsData && place.quays === undefined) {
    if (stopsDetailsData.stopPlaces[0].quays?.length) {
      place = stopsDetailsData.stopPlaces[0];
    } else {
      missingStopData = true;
    }
  }

  if (isStopsDetailsError || missingStopData) {
    return (
      <View style={styles.container}>
        <FullScreenHeader title={place.name} leftButton={{type: 'back'}} />
        <MessageInfoBox
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
    date: string | undefined,
    fromStopPosition: number,
    isTripCancelled?: boolean,
  ) => {
    if (!date) return;
    onPressDeparture?.(
      [
        {
          serviceJourneyId,
          serviceDate,
          date,
          fromStopPosition,
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
          style={styles.stopPlaceAndQuaySelection}
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
            addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
            testID="departuresContentView"
            stopPlace={place}
            mode={mode}
            backgroundColor={themeColor}
          />
        ) : (
          <StopPlacesView
            stopPlaces={[place]}
            isFocused={isFocused}
            navigateToDetails={
              mode === 'Departure' ? navigateToDetails : undefined
            }
            navigateToQuay={(_, quay) => navigateToQuay(quay)}
            searchTime={searchTime}
            setSearchTime={setSearchTime}
            showOnlyFavorites={showOnlyFavorites}
            addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
            setShowOnlyFavorites={setShowOnlyFavorites}
            testID="departuresContentView"
            mode={mode}
            backgroundColor={themeColor}
          />
        )}
      </View>

      {onPressClose && (
        <View style={styles.closeButton}>
          <Button
            expanded={true}
            interactiveColor={interactiveColor}
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
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  closeButton: {
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  stopPlaceAndQuaySelection: {
    paddingBottom: theme.spacing.medium,
  },
  quayData: {flex: 1},
  messageBox: {
    margin: theme.spacing.medium,
  },
}));
