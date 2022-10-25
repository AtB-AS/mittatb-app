import {Place, Quay} from '@atb/api/types/departures';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {DashboardScreenProps} from '@atb/screens/Dashboard/types';
import QuayView from '@atb/screens/Dashboard/favourites/QuayView';
import StopPlaceView from '@atb/screens/Dashboard/favourites/StopPlaceView';
import {useStopsDetailsData} from '@atb/screens/Departures/state/stop-place-details-state';
import Button from '@atb/components/button';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';

export type NearbyLinesScreenParams = {
  place: Place;
  selectedQuay?: Quay;
};

export type PlaceScreenProps = DashboardScreenProps<'NearbyLinesScreen'>;

export default function NearbyLinesScreen({
  navigation,
  route: {
    params: {place, selectedQuay},
  },
}: PlaceScreenProps) {
  const styles = useStyles();
  const {t} = useTranslation();
  const navigateToQuay = (quay: Quay) => {
    navigation.setParams({selectedQuay: quay});
  };

  const {state} = useStopsDetailsData(
    place.quays === undefined ? [place.id] : undefined,
  );

  if (state.data && place.quays === undefined) {
    place = state.data.stopPlaces[0];
  }
  return (
    <View style={styles.container}>
      <FullScreenHeader title={place.name} leftButton={{type: 'back'}} />
      {selectedQuay ? (
        <QuayView quay={selectedQuay} testID="quayView" stopPlace={place} />
      ) : (
        <StopPlaceView
          stopPlace={place}
          navigateToQuay={navigateToQuay}
          testID="stopPlaceView"
        />
      )}
      <FullScreenFooter>
        <Button
          interactiveColor="interactive_0"
          style={styles.closeButton}
          text={t(FavoriteDeparturesTexts.closeButton.label)}
          onPress={navigation.goBack}
          testID="closeButton"
        />
      </FullScreenFooter>
    </View>
  );
}
const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  closeButton: {marginTop: theme.spacings.medium},
}));
