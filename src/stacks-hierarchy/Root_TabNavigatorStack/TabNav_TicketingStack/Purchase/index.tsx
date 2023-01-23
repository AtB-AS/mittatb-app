import {transitionSpec} from '@atb/utils/transition-spec';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import React from 'react';
import ConfirmationScreen from './Confirmation';
import PurchaseOverviewScreen from './Overview';
import {CreditCard as CreditCardScreen, Vipps as VippsScreen} from './Payment';
import TariffZones from './TariffZones';
import TariffZoneSearch from './TariffZones/search';
import {PurchaseStackParams, PurchaseStackRootProps} from './types';

import {useGoToMobileTokenOnboardingWhenNecessary} from '@atb/stacks-hierarchy/Root_MobileTokenOnboarding/utils';
import {Purchase_AnonymousPurchaseConsequencesScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Purchase/Purchase_AnonymousPurchaseConsequencesScreen';

const Stack = createStackNavigator<PurchaseStackParams>();

const options: StackNavigationOptions = {
  headerShown: false,
};

export default function PurchaseStack({}: PurchaseStackRootProps) {
  useGoToMobileTokenOnboardingWhenNecessary();

  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="PurchaseOverview"
        component={PurchaseOverviewScreen}
      />
      <Stack.Screen
        name="Purchase_AnonymousPurchaseConsequencesScreen"
        component={Purchase_AnonymousPurchaseConsequencesScreen}
      />
      <Stack.Screen name="TariffZones" component={TariffZones} />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen name="PaymentCreditCard" component={CreditCardScreen} />
      <Stack.Screen name="PaymentVipps" component={VippsScreen} />
      <Stack.Screen
        name="TariffZoneSearch"
        component={TariffZoneSearch}
        options={{
          transitionSpec: {
            open: transitionSpec,
            close: transitionSpec,
          },
        }}
      />
    </Stack.Navigator>
  );
}
