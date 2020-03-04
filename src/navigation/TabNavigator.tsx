import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PlannerIcon, NearestIcon, ProfileIcon} from './TabBarIcons';
import Planner from '../screens/Planner';
import ProfileScreen from '../screens/Profile';

export type TabNavigatorParams = {
  Planner: undefined;
  Nearest: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParams>();

const NavigationRoot = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Planner"
        component={Planner}
        options={{
          tabBarLabel: 'Reiseassistent',
          tabBarIcon: ({color}) => <PlannerIcon fill={color} />,
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
