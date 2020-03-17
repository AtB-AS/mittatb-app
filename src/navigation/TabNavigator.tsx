import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PlannerIcon, NearestIcon, ProfileIcon} from './TabBarIcons';
import Planner from '../screens/Planner';
import ProfileScreen from '../screens/Profile';
import {Route, NavigationState, PartialState} from '@react-navigation/native';

export type TabNavigatorParams = {
  Planner: undefined;
  Nearest: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabNavigatorParams>();

type StatedRoute<T extends string> = Route<T> & {
  state?: NavigationState | PartialState<NavigationState>;
};

function hideTabBarOnNestedRoutes(route: StatedRoute<'Planner'>) {
  if (route.state?.index ?? 0 > 0) {
    return false;
  }
  return true;
}

const NavigationRoot = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Planner"
        component={Planner}
        options={props => ({
          tabBarVisible: hideTabBarOnNestedRoutes(props.route),
          tabBarLabel: 'Reiseassistent',
          tabBarIcon: ({color}) => <PlannerIcon fill={color} />,
        })}
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
