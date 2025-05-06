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

  return useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Root_TabNavigatorStack',
          state: {
            routes: [
              {
                name: 'TabNav_ProfileStack',
                state: {
                  routes: [
                    {name: 'Profile_RootScreen'},
                    {name: 'Profile_PaymentMethodsScreen'},
                  ],
                  index: 1,
                },
              },
            ],
            index: 0,
          },
        },
      ],
    });
  }, [navigation]);
};
