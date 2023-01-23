import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import Appearance from './Appearance';
import TravelToken from './TravelToken';
import SelectTravelToken from './TravelToken/SelectTravelTokenScreen';
import FavoriteList from './FavoriteList';
import ProfileHome from './Home';
import {TicketHistory} from './TicketHistory';
import Language from './Language';
import Enrollment from './Enrollment';
import SelectStartScreen from './SelectStartScreen';
import DesignSystem from './DesignSystem';
import DebugInfo from './DebugInfo';
import DefaultUserProfile from './DefaultUserProfile';
import TicketingInformation from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Information/TicketingInformation';
import TermsInformation from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Information/TermsInformation';
import TicketInspectionInformation from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Information/TicketInspectionInformation';
import DeleteProfile from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/DeleteProfile';
import PaymentOptions from './PaymentOptions';
import {ProfileStackParams} from './types';
import {Profile_PlaceScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_PlaceScreen';
import {Profile_NearbyStopPlacesScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_NearbyStopPlacesScreen';
import {Profile_FavoriteDeparturesScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_FavoriteDeparturesScreen';

const Stack = createStackNavigator<ProfileStackParams>();

export const TabNav_ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
      <Stack.Screen name="TicketHistory" component={TicketHistory} />
      <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
      <Stack.Screen name="DeleteProfile" component={DeleteProfile} />
      <Stack.Screen name="FavoriteList" component={FavoriteList} />
      <Stack.Screen
        name="Profile_FavoriteDeparturesScreen"
        component={Profile_FavoriteDeparturesScreen}
      />
      <Stack.Screen name="SelectStartScreen" component={SelectStartScreen} />
      <Stack.Screen name="TravelToken" component={TravelToken} />
      <Stack.Screen name="SelectTravelToken" component={SelectTravelToken} />
      <Stack.Screen name="Appearance" component={Appearance} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="DefaultUserProfile" component={DefaultUserProfile} />
      <Stack.Screen name="Enrollment" component={Enrollment} />
      <Stack.Screen name="DesignSystem" component={DesignSystem} />
      <Stack.Screen name="DebugInfo" component={DebugInfo} />
      <Stack.Screen
        name="TicketingInformation"
        component={TicketingInformation}
      />
      <Stack.Screen name="TermsInformation" component={TermsInformation} />
      <Stack.Screen
        name="TicketInspectionInformation"
        component={TicketInspectionInformation}
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
