import {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import React from 'react';

export type TravelAidScreenParams = {
  serviceJourney: ServiceJourneyWithEstCallsFragment;
};

type Props = TravelAidScreenParams & {};

export const TravelAidScreenComponent = ({serviceJourney}: Props) => {
  const styles = useStyles();
  return (
    <FullScreenView
      headerProps={{
        leftButton: {type: 'back', withIcon: true},
        title: 'Travel aid',
      }}
    >
      <ThemeText>{serviceJourney.id}</ThemeText>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({}));
