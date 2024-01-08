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
import {Profile_TicketingInformationScreen} from './Profile_TicketingInformationScreen';
import {Profile_PaymentOptionsScreen} from './Profile_PaymentOptionsScreen';
import {ProfileStackParams} from './navigation-types';
import {Profile_PlaceScreen} from './Profile_PlaceScreen';
import {Profile_NearbyStopPlacesScreen} from './Profile_NearbyStopPlacesScreen';
import {Profile_FavoriteDeparturesScreen} from './Profile_FavoriteDeparturesScreen';
import {Profile_TermsInformationScreen} from './Profile_TermsInformationScreen';
import {Profile_TicketInspectionInformationScreen} from './Profile_TicketInspectionInformationScreen';
import {Profile_GenericWebsiteInformationScreen} from './Profile_GenericWebsiteInformationScreen';
import {Profile_DeleteProfileScreen} from './Profile_DeleteProfileScreen';
import {Profile_TravelTokenScreen} from './Profile_TravelTokenScreen';
import {Profile_SelectTravelTokenScreen} from './Profile_SelectTravelTokenScreen';
import {Profile_FavoriteListScreen} from './Profile_FavoriteListScreen';
import {Profile_SortFavoritesScreen} from './Profile_SortFavoritesScreen';
import {Profile_EditProfileScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_EditProfileScreen';
import {Profile_FareContractsScreen} from './Profile_FareContractsScreen';
import {Profile_NotificationsScreen} from './Profile_NotificationsScreen';
import {transitionOptions} from '@atb/stacks-hierarchy/navigation-utils';

const Stack = createStackNavigator<ProfileStackParams>();

export const TabNav_ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile_RootScreen"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Profile_RootScreen"
        component={Profile_RootScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_TicketHistoryScreen"
        component={Profile_TicketHistoryScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_PaymentOptionsScreen"
        component={Profile_PaymentOptionsScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_DeleteProfileScreen"
        component={Profile_DeleteProfileScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_EditProfileScreen"
        component={Profile_EditProfileScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_FavoriteListScreen"
        component={Profile_FavoriteListScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_SortFavoritesScreen"
        component={Profile_SortFavoritesScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_FavoriteDeparturesScreen"
        component={Profile_FavoriteDeparturesScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_SelectStartScreenScreen"
        component={Profile_SelectStartScreenScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_TravelTokenScreen"
        component={Profile_TravelTokenScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_SelectTravelTokenScreen"
        component={Profile_SelectTravelTokenScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_AppearanceScreen"
        component={Profile_AppearanceScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_LanguageScreen"
        component={Profile_LanguageScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_PrivacyScreen"
        component={Profile_PrivacyScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_NotificationsScreen"
        component={Profile_NotificationsScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_DefaultUserProfileScreen"
        component={Profile_DefaultUserProfileScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_EnrollmentScreen"
        component={Profile_EnrollmentScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_DesignSystemScreen"
        component={Profile_DesignSystemScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_FareContractsScreen"
        component={Profile_FareContractsScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_DebugInfoScreen"
        component={Profile_DebugInfoScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_TicketingInformationScreen"
        component={Profile_TicketingInformationScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_TermsInformationScreen"
        component={Profile_TermsInformationScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_TicketInspectionInformationScreen"
        component={Profile_TicketInspectionInformationScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_GenericWebsiteInformationScreen"
        component={Profile_GenericWebsiteInformationScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_NearbyStopPlacesScreen"
        component={Profile_NearbyStopPlacesScreen}
        options={transitionOptions()}
      />
      <Stack.Screen
        name="Profile_PlaceScreen"
        component={Profile_PlaceScreen}
        options={transitionOptions()}
      />
    </Stack.Navigator>
  );
};
