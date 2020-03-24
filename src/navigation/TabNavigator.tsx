import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PlannerIcon, NearestIcon, ProfileIcon} from './TabBarIcons';
import Assistant from '../screens/Assistant';
import ProfileScreen from '../screens/Profile';
import {LocationWithSearchMetadata} from '../location-search';
import NearbyScreen from '../screens/Nearby';

export type TabNavigatorParams = {
  Assistant: {
    fromLocation: LocationWithSearchMetadata;
    toLocation: LocationWithSearchMetadata;
  };
  Nearest: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParams>();

const NavigationRoot = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Assistant"
        component={Assistant}
        options={{
          tabBarLabel: 'Reiseassistent',
          tabBarIcon: ({color}) => <PlannerIcon fill={color} />,
        }}
      />
      <Tab.Screen
        name="Nearest"
        component={NearbyScreen}
        options={{
          tabBarLabel: 'Avganger i nærheten',
          tabBarIcon: ({color}) => <NearestIcon fill={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Mitt AtB',
          tabBarIcon: ({color}) => <ProfileIcon fill={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationRoot;
