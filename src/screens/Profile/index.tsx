import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import Appearance from './Appearance';
import TravelCard from './TravelCard';
import SelectTravelCard from './TravelCard/SelectTravelCard';
import FavoriteDepartures from './FavoriteDepartures';
import FavoriteList from './FavoriteList';
import ProfileHome from './Home';
import Language from './Language';
import Enrollment from './Enrollment';
import SelectStartScreen from './SelectStartScreen';
import DesignSystem from './DesignSystem';
import DefaultUserProfile from './DefaultUserProfile';
import TicketingInformation from '@atb/screens/Profile/Information/TicketingInformation';
import PaymentInformation from '@atb/screens/Profile/Information/PaymentInformation';
import TermsInformation from '@atb/screens/Profile/Information/TermsInformation';
import TicketInspectionInformation from '@atb/screens/Profile/Information/TicketInspectionInformation';

export type ProfileStackParams = {
  ProfileHome: undefined;
  FavoriteList: undefined;
  FavoriteDepartures: undefined;
  SelectStartScreen: undefined;
  TravelCard: undefined;
  SelectTravelCard: undefined;
  Appearance: undefined;
  Language: undefined;
  DefaultUserProfile: undefined;
  Enrollment: undefined;
  DesignSystem: undefined;
  TicketingInformation: undefined;
  PaymentInformation: undefined;
  TermsInformation: undefined;
  TicketInspectionInformation: undefined;
};

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
      <Stack.Screen name="FavoriteList" component={FavoriteList} />
      <Stack.Screen name="FavoriteDepartures" component={FavoriteDepartures} />
      <Stack.Screen name="SelectStartScreen" component={SelectStartScreen} />
      <Stack.Screen name="TravelCard" component={TravelCard} />
      <Stack.Screen name="SelectTravelCard" component={SelectTravelCard} />
      <Stack.Screen name="Appearance" component={Appearance} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="DefaultUserProfile" component={DefaultUserProfile} />
      <Stack.Screen name="Enrollment" component={Enrollment} />
      <Stack.Screen name="DesignSystem" component={DesignSystem} />
      <Stack.Screen
        name="TicketingInformation"
        component={TicketingInformation}
      />
      <Stack.Screen name="PaymentInformation" component={PaymentInformation} />
      <Stack.Screen name="TermsInformation" component={TermsInformation} />
      <Stack.Screen
        name="TicketInspectionInformation"
        component={TicketInspectionInformation}
      />
    </Stack.Navigator>
  );
}
