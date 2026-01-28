import {Quay, StopPlace} from '@atb/api/types/departures';
import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, type Theme, useThemeContext} from '@atb/theme';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ServiceJourneyDeparture} from '@atb/screen-components/travel-details-screens';
import {StopPlaceAndQuaySelection} from './components/StopPlaceAndQuaySelection';
import {QuayView} from './components/QuayView';
import {StopPlacesView} from './components/StopPlacesView';
import type {DepartureSearchTime} from 'src/components/date-selection';
import {useStopsDetailsDataQuery} from './hooks/use-stops-details-data-query';

export type PlaceScreenParams = {
  place: StopPlace;
  selectedQuayId?: string;
  showOnlyFavoritesByDefault?: boolean;
};

type Props = PlaceScreenParams & {
  onPressQuay?: (quayId: string | undefined) => void;
  onPressDeparture?: (
    items: ServiceJourneyDeparture[],
    activeItemIndex: number,
  ) => void;
};

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];

export const PlaceScreenComponent = ({
  place,
  selectedQuayId,
  showOnlyFavoritesByDefault,
  onPressQuay,
  onPressDeparture,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
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
    onPressQuay?.(quay.id);
  };

  const selectedQuay = selectedQuayId
    ? place.quays?.find((q) => q.id === selectedQuayId)
    : undefined;

  return (
    <View style={styles.container}>
      <FullScreenHeader title={place.name} leftButton={{type: 'back'}} />
      <StopPlaceAndQuaySelection
        place={place}
        selectedQuay={selectedQuay}
        onPress={(quayId) => onPressQuay?.(quayId)}
        style={styles.stopPlaceAndQuaySelection}
      />

      <View style={styles.quayData}>
        {selectedQuay ? (
          <QuayView
            mode="Departure"
            quay={selectedQuay}
            navigateToDetails={navigateToDetails}
            searchTime={searchTime}
            setSearchTime={setSearchTime}
            showOnlyFavorites={showOnlyFavorites}
            setShowOnlyFavorites={setShowOnlyFavorites}
            testID="departuresContentView"
            stopPlace={place}
            backgroundColor={themeColor}
          />
        ) : (
          <StopPlacesView
            mode="Departure"
            stopPlaces={[place]}
            navigateToDetails={navigateToDetails}
            navigateToQuay={(_, quay) => navigateToQuay(quay)}
            searchTime={searchTime}
            setSearchTime={setSearchTime}
            showOnlyFavorites={showOnlyFavorites}
            setShowOnlyFavorites={setShowOnlyFavorites}
            testID="departuresContentView"
            backgroundColor={themeColor}
          />
        )}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  stopPlaceAndQuaySelection: {
    paddingBottom: theme.spacing.medium,
  },
  quayData: {flex: 1},
  messageBox: {
    margin: theme.spacing.medium,
  },
}));
