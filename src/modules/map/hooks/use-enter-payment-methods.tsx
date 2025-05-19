import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useCallback} from 'react';

/**
 * This hook provides a function to navigate directly to the Payment Methods screen
 * with the proper navigation stack in place. It ensures that the back button behaves
 * naturally, taking users back to the Profile_RootScreen.
 *
 * @returns {Function} A function that when called, navigates to the Payment Methods screen
 * with the correct navigation hierarchy.
 */
export const useEnterPaymentMethods = () => {
  const navigation = useNavigation<RootNavigationProps>();

  return useCallback(async () => {
    navigation.navigate('Root_TabNavigatorStack', {
      screen: 'TabNav_ProfileStack',
      params: {
        screen: 'Profile_RootScreen',
      },
    });

    requestAnimationFrame(() =>
      navigation.navigate('Root_TabNavigatorStack', {
        screen: 'TabNav_ProfileStack',
        params: {
          screen: 'Profile_PaymentMethodsScreen',
        },
      }),
    );
  }, [navigation]);
};
