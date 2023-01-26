import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {Profile_AppearanceScreen} from './Profile_AppearanceScreen';
import {Profile_RootScreen} from './Profile_RootScreen';
import {Profile_TicketHistoryScreen} from './Profile_TicketHistoryScreen';
import {Profile_LanguageScreen} from './Profile_LanguageScreen';
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
import {Profile_DeleteProfileScreen} from './Profile_DeleteProfileScreen';
import {Profile_TravelTokenScreen} from './Profile_TravelTokenScreen';
import {Profile_SelectTravelTokenScreen} from './Profile_SelectTravelTokenScreen';
import {Profile_FavoriteListScreen} from './Profile_FavoriteListScreen';
import {Profile_SortFavoritesScreen} from './Profile_SortFavoritesScreen';

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
      <Stack.Screen name="Profile_RootScreen" component={Profile_RootScreen} />
      <Stack.Screen
        name="Profile_TicketHistoryScreen"
        component={Profile_TicketHistoryScreen}
      />
      <Stack.Screen
        name="Profile_PaymentOptionsScreen"
        component={Profile_PaymentOptionsScreen}
      />
      <Stack.Screen
        name="Profile_DeleteProfileScreen"
        component={Profile_DeleteProfileScreen}
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
        name="Profile_SelectTravelTokenScreen"
        component={Profile_SelectTravelTokenScreen}
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
        name="Profile_DebugInfoScreen"
        component={Profile_DebugInfoScreen}
      />
      <Stack.Screen
        name="Profile_TicketingInformationScreen"
        component={Profile_TicketingInformationScreen}
      />
      <Stack.Screen
        name="Profile_TermsInformationScreen"
        component={Profile_TermsInformationScreen}
      />
      <Stack.Screen
        name="Profile_TicketInspectionInformationScreen"
        component={Profile_TicketInspectionInformationScreen}
      />
      <Stack.Screen
        name="Profile_NearbyStopPlacesScreen"
        component={Profile_NearbyStopPlacesScreen}
      />
      <Stack.Screen
        name="Profile_PlaceScreen"
        component={Profile_PlaceScreen}
      />
    </Stack.Navigator>
  );
};
