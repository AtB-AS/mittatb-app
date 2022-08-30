import createDismissableStackNavigator from '@atb/navigation/createDismissableStackNavigator';
import transitionSpec from '@atb/navigation/transitionSpec';
import ConsequencesScreen from '@atb/screens/AnonymousTicketPurchase/ConsequencesScreen';
import {TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import ConfirmationScreen from './Confirmation';
import PurchaseOverviewScreen from './Overview';
import {CreditCard as CreditCardScreen, Vipps as VippsScreen} from './Payment';
import TariffZones from './TariffZones';
import TariffZoneSearch from './TariffZones/search';
import {TicketingStackParams, TicketPurchaseStackRootProps} from './types';

import {useGoToMobileTokenOnboardingWhenNecessary} from '@atb/screens/MobileTokenOnboarding/utils';

const Stack = createDismissableStackNavigator<TicketingStackParams>();

export default function PurchaseStack({}: TicketPurchaseStackRootProps) {
  useGoToMobileTokenOnboardingWhenNecessary();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
      dismissToScreen="BuyTickets"
    >
      <Stack.Screen
        name="PurchaseOverview"
        component={PurchaseOverviewScreen}
      />
      <Stack.Screen
        name="ConsequencesFromTicketPurchase"
        component={ConsequencesScreen}
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
