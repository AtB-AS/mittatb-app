import {Quay, StopPlace} from '@atb/api/types/departures';
import {Button} from '@atb/components/button';
import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useStopsDetailsDataQuery} from '../place-screen';
import {FavoriteLineList} from './components/FavoriteLineList';

export type SelectFavoriteDeparturesScreenParams = {
  place: StopPlace;
  selectedQuay?: Quay;
  limitPerQuay: number;
  addedFavoritesVisibleOnDashboard?: boolean;
};

type Props = SelectFavoriteDeparturesScreenParams & {
  onPressClose?: () => void;
  onNavigateToQuay: (quay: Quay) => void;
};

export const SelectFavoriteDeparturesScreenComponent = ({
  place,
  selectedQuay,
  limitPerQuay,
  addedFavoritesVisibleOnDashboard,
  onPressClose,
  onNavigateToQuay,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];

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

  return (
    <View style={styles.container}>
      <FullScreenHeader title={place.name} leftButton={{type: 'back'}} />
      <View style={styles.quayData}>
        <FavoriteLineList
          stopPlace={place}
          selectedQuay={selectedQuay}
          limitPerQuay={limitPerQuay}
          addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
          testID="lineList"
          onNavigateToQuay={onNavigateToQuay}
        />
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
