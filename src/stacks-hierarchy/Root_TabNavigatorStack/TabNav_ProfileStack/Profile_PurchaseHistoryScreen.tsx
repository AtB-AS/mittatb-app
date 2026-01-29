import React, {useCallback} from 'react';
import {ProfileScreenProps} from './navigation-types';
import {PurchaseHistoryScreenComponent} from '@atb/screen-components/purchase-history';
import {useNestedProfileScreenParams} from '@atb/utils/use-nested-profile-screen-params';

type Props = ProfileScreenProps<'Profile_PurchaseHistoryScreen'>;

export const Profile_PurchaseHistoryScreen = ({navigation}: Props) => {
  const bonusScreenParams = useNestedProfileScreenParams('Profile_BonusScreen');

  const onNavigateToBonusScreen = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', bonusScreenParams);
  }, [navigation, bonusScreenParams]);

  return (
    <PurchaseHistoryScreenComponent
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
