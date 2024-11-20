import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {Profile_AppearanceScreen} from './Profile_AppearanceScreen';
import {Profile_RootScreen} from './Profile_RootScreen';
import {Profile_TicketHistoryScreen} from './Profile_TicketHistoryScreen';
import {Profile_LanguageScreen} from './Profile_LanguageScreen';
import {Profile_PrivacyScreen} from './Profile_PrivacyScreen';
import {Profile_EnrollmentScreen} from './Profile_EnrollmentScreen';
import {Profile_SelectStartScreenScreen} from './Profile_SelectStartScreenScreen';
import {Profile_DesignSystemScreen} from './Profile_DesignSystemScreen';
import {Profile_DebugInfoScreen} from './Profile_DebugInfoScreen';
import {Profile_DefaultUserProfileScreen} from './Profile_DefaultUserProfileScreen';
import {Profile_PaymentMethodsScreen} from './Profile_PaymentMethodsScreen';
import {ProfileStackParams} from './navigation-types';
import {Profile_PlaceScreen} from './Profile_PlaceScreen';
import {Profile_NearbyStopPlacesScreen} from './Profile_NearbyStopPlacesScreen';
import {Profile_FavoriteDeparturesScreen} from './Profile_FavoriteDeparturesScreen';
import {Profile_DeleteProfileScreen} from './Profile_DeleteProfileScreen';
import {Profile_TravelTokenScreen} from './Profile_TravelTokenScreen';
import {Profile_FavoriteListScreen} from './Profile_FavoriteListScreen';
import {Profile_SortFavoritesScreen} from './Profile_SortFavoritesScreen';
import {Profile_EditProfileScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_EditProfileScreen';
import {Profile_FareContractsScreen} from './Profile_FareContractsScreen';
import {Profile_NotificationsScreen} from './Profile_NotificationsScreen';
import {screenOptions} from '@atb/stacks-hierarchy/navigation-utils';
import {Profile_TicketHistorySelectionScreen} from './Profile_TicketHistorySelectionScreen';
import {Profile_TravelAidScreen} from './Profile_TravelAidScreen';
import {Profile_TravelAidInformationScreen} from './Profile_TravelAidInformationScreen.tsx';

const Stack = createStackNavigator<ProfileStackParams>();

export const TabNav_ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile_RootScreen"
      screenOptions={screenOptions(TransitionPresets.SlideFromRightIOS, {
        headerShown: false,
      })}
    >
      <Stack.Screen name="Profile_RootScreen" component={Profile_RootScreen} />
      <Stack.Screen
        name="Profile_TicketHistoryScreen"
        component={Profile_TicketHistoryScreen}
      />
      <Stack.Screen
        name="Profile_TicketHistorySelectionScreen"
        component={Profile_TicketHistorySelectionScreen}
      />
      <Stack.Screen
        name="Profile_PaymentMethodsScreen"
        component={Profile_PaymentMethodsScreen}
      />
      <Stack.Screen
        name="Profile_DeleteProfileScreen"
        component={Profile_DeleteProfileScreen}
      />
      <Stack.Screen
        name="Profile_EditProfileScreen"
        component={Profile_EditProfileScreen}
      />
      <Stack.Screen
        name="Profile_FavoriteListScreen"
        component={Profile_FavoriteListScreen}
      />
      <Stack.Screen
        name="Profile_SortFavoritesScreen"
        component={Profile_SortFavoritesScreen}
      />
      <Stack.Screen
        name="Profile_FavoriteDeparturesScreen"
        component={Profile_FavoriteDeparturesScreen}
      />
      <Stack.Screen
        name="Profile_SelectStartScreenScreen"
        component={Profile_SelectStartScreenScreen}
      />
      <Stack.Screen
        name="Profile_TravelTokenScreen"
        component={Profile_TravelTokenScreen}
      />
      <Stack.Screen
        name="Profile_AppearanceScreen"
        component={Profile_AppearanceScreen}
      />
      <Stack.Screen
        name="Profile_LanguageScreen"
        component={Profile_LanguageScreen}
      />
      <Stack.Screen
        name="Profile_PrivacyScreen"
        component={Profile_PrivacyScreen}
      />
      <Stack.Screen
        name="Profile_NotificationsScreen"
        component={Profile_NotificationsScreen}
      />
      <Stack.Screen
        name="Profile_DefaultUserProfileScreen"
        component={Profile_DefaultUserProfileScreen}
      />
      <Stack.Screen
        name="Profile_EnrollmentScreen"
        component={Profile_EnrollmentScreen}
      />
      <Stack.Screen
        name="Profile_DesignSystemScreen"
        component={Profile_DesignSystemScreen}
      />
      <Stack.Screen
        name="Profile_FareContractsScreen"
        component={Profile_FareContractsScreen}
      />
      <Stack.Screen
        name="Profile_DebugInfoScreen"
        component={Profile_DebugInfoScreen}
      />
      <Stack.Screen
        name="Profile_NearbyStopPlacesScreen"
        component={Profile_NearbyStopPlacesScreen}
      />
      <Stack.Screen
        name="Profile_PlaceScreen"
        component={Profile_PlaceScreen}
      />
      <Stack.Screen
        name="Profile_TravelAidScreen"
        component={Profile_TravelAidScreen}
      />
      <Stack.Screen
        name="Profile_TravelAidInformationScreen"
        component={Profile_TravelAidInformationScreen}
      />
    </Stack.Navigator>
  );
};
