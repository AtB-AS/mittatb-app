import React, {useCallback} from 'react';
import {TicketHistoryScreenComponent} from '@atb/screen-components/ticket-history';
import {TicketingScreenProps} from './navigation-types';
import {useNestedProfileScreenParams} from '@atb/utils/use-nested-profile-screen-params';
import {FareContractType} from '@atb-as/utils';

type Props = TicketingScreenProps<'Ticketing_TicketHistoryScreen'>;

export const Ticketing_TicketHistoryScreen = ({navigation}: Props) => {
  const bonusScreenParams = useNestedProfileScreenParams('Profile_BonusScreen');

  const navigateToBonusScreen = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', bonusScreenParams);
  }, [navigation, bonusScreenParams]);

  return (
    <TicketHistoryScreenComponent
      onPressFareContract={(fareContractId: FareContractType['id']) =>
        navigation.navigate('Root_FareContractDetailsScreen', {
          fareContractId,
          transitionOverride: 'slide-from-right',
        })
      }
      navigateToBonusScreen={navigateToBonusScreen}
    />
  );
};
