import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PlannerIcon, NearestIcon, ProfileIcon} from './TabBarIcons';
import Planner from '../screens/Planner';

export type TabNavigatorParams = {
  Planner: undefined;
  Nearest: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParams>();

const EmptyScreen = () => null;

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
        name="Nearest"
        component={EmptyScreen}
        options={{
          tabBarLabel: 'Avganger i nærheten',
          tabBarIcon: ({color}) => <NearestIcon fill={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={EmptyScreen}
        options={{
          tabBarLabel: 'Mitt AtB',
          tabBarIcon: ({color}) => <ProfileIcon fill={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationRoot;
