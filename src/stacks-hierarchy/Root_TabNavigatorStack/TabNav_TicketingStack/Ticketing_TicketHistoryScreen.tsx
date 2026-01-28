import React, {useCallback} from 'react';
import {TicketHistoryScreenComponent} from '@atb/screen-components/ticket-history';
import {TicketingScreenProps} from './navigation-types';
import {useNestedProfileScreenParams} from '@atb/utils/use-nested-profile-screen-params';

type Props = TicketingScreenProps<'Ticketing_TicketHistoryScreen'>;

export const Ticketing_TicketHistoryScreen = ({route, navigation}: Props) => {
  const bonusScreenParams = useNestedProfileScreenParams('Profile_BonusScreen');

  const onNavigateToBonusScreen = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', bonusScreenParams);
  }, [navigation, bonusScreenParams]);

  return (
    <TicketHistoryScreenComponent
      mode={route.params.mode}
      onPressFareContract={(fareContractId) =>
        navigation.navigate('Root_FareContractDetailsScreen', {
          fareContractId,
          transitionOverride: 'slide-from-right',
        })
      }
      onNavigateToBonusScreen={onNavigateToBonusScreen}
    />
  );
};
