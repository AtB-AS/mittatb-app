import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import Appearance from './Appearance';
import TravelToken from './TravelToken';
import SelectTravelToken from './TravelToken/SelectTravelTokenScreen';
import FavoriteDepartures from './FavoriteDepartures';
import FavoriteList from './FavoriteList';
import ProfileHome from './Home';
import {ExpiredTickets} from './ExpiredTickets';
import Language from './Language';
import Enrollment from './Enrollment';
import SelectStartScreen from './SelectStartScreen';
import DesignSystem from './DesignSystem';
import DebugInfo from './DebugInfo';
import DefaultUserProfile from './DefaultUserProfile';
import TicketingInformation from '@atb/screens/Profile/Information/TicketingInformation';
import TermsInformation from '@atb/screens/Profile/Information/TermsInformation';
import TicketInspectionInformation from '@atb/screens/Profile/Information/TicketInspectionInformation';
import DeleteProfile from '@atb/screens/Profile/DeleteProfile';
import PaymentOptions from './PaymentOptions';
import {ProfileStackParams} from './types';

const Stack = createStackNavigator<ProfileStackParams>();

export default function ProfileScreen() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
      <Stack.Screen name="ExpiredTickets" component={ExpiredTickets} />
      <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
      <Stack.Screen name="DeleteProfile" component={DeleteProfile} />
      <Stack.Screen name="FavoriteList" component={FavoriteList} />
      <Stack.Screen name="FavoriteDepartures" component={FavoriteDepartures} />
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
    </Stack.Navigator>
  );
}
