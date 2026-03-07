import {Quay, StopPlace} from '@atb/api/types/departures';
import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useStopsDetailsDataQuery} from '../place-screen';
import {FavoriteLineList} from './components/FavoriteLineList';

export type SelectFavoriteDeparturesScreenParams = {
  stopPlace: StopPlace;
  selectedQuay?: Quay;
  limitPerQuay: number;
  addedFavoritesVisibleOnDashboard?: boolean;
};

type Props = SelectFavoriteDeparturesScreenParams & {
  onComplete: () => void;
  onNavigateToQuay: (quay: Quay) => void;
};

export const SelectFavoriteDeparturesScreenComponent = ({
  stopPlace,
  selectedQuay,
  limitPerQuay,
  addedFavoritesVisibleOnDashboard,
  onComplete,
  onNavigateToQuay,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const {data: stopsDetailsData, isError: isStopsDetailsError} =
    useStopsDetailsDataQuery(
      stopPlace.quays === undefined ? [stopPlace.id] : [],
    );

  let missingStopData = false;

  if (stopsDetailsData && stopPlace.quays === undefined) {
    if (stopsDetailsData.stopPlaces[0].quays?.length) {
      stopPlace = stopsDetailsData.stopPlaces[0];
    } else {
      missingStopData = true;
    }
  }

  if (isStopsDetailsError || missingStopData) {
    return (
      <View style={styles.container}>
        <FullScreenHeader title={stopPlace.name} leftButton={{type: 'back'}} />
        <MessageInfoBox
          style={styles.messageBox}
          type="error"
          message={t(DeparturesTexts.message.resultNotFound)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FullScreenHeader title={stopPlace.name} leftButton={{type: 'back'}} />
      <View style={styles.quayData}>
        <FavoriteLineList
          stopPlace={stopPlace}
          selectedQuay={selectedQuay}
          limitPerQuay={limitPerQuay}
          addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
          testID="lineList"
          onNavigateToQuay={onNavigateToQuay}
          onComplete={onComplete}
        />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[1].background,
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
