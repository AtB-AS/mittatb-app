import React, {useCallback} from 'react';
import {PurchaseHistoryScreenComponent} from '@atb/screen-components/purchase-history';
import {TicketingScreenProps} from './navigation-types';
import {useNestedProfileScreenParams} from '@atb/utils/use-nested-profile-screen-params';
import {FareContractType} from '@atb-as/utils';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';

type Props = TicketingScreenProps<'Ticketing_PurchaseHistoryScreen'>;

export const Ticketing_PurchaseHistoryScreen = ({navigation}: Props) => {
  const isFocused = useIsFocusedAndActive();
  const bonusScreenParams = useNestedProfileScreenParams('Profile_BonusScreen');

  const onNavigateToBonusScreen = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', bonusScreenParams);
  }, [navigation, bonusScreenParams]);

  return (
    <PurchaseHistoryScreenComponent
      onPressFareContract={(fareContractId: FareContractType['id']) =>
        navigation.navigate('Root_FareContractDetailsScreen', {
          fareContractId,
          transitionOverride: 'slide-from-right',
        })
      }
      onNavigateToBonusScreen={onNavigateToBonusScreen}
      isFocused={isFocused}
    />
  );
};
