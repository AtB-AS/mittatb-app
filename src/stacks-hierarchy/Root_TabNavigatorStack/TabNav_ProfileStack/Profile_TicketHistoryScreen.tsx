import React, {useCallback} from 'react';
import {ProfileScreenProps} from './navigation-types';
import {TicketHistoryScreenComponent} from '@atb/screen-components/ticket-history';
import {useNestedProfileScreenParams} from '@atb/utils/use-nested-profile-screen-params';

type Props = ProfileScreenProps<'Profile_TicketHistoryScreen'>;

export const Profile_TicketHistoryScreen = ({route, navigation}: Props) => {
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
