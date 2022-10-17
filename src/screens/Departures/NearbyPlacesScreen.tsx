import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import Loading from '../Loading';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';
import FavouriteStopsOverview from '@atb/screens/Departures/FavouriteStopsOverview';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {AllStopsOverview} from '@atb/screens/Departures/AllStopsOverview';
import {NearbyPlacesScreenTabParams} from './types';

const Tab = createMaterialTopTabNavigator<NearbyPlacesScreenTabParams>();

export default function NearbyPlacesScreen() {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {status} = useGeolocationState();
  const {leftButton} = useServiceDisruptionSheet();
  const style = useStyles();
  if (!status) {
    return <Loading />;
  }
  return (
    <>
      <FullScreenHeader
        title={t(DeparturesTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={leftButton}
        globalMessageContext="app-departures"
      />
      <View style={style.container}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: theme.interactive.interactive_1.active.text,
            tabBarInactiveTintColor:
              theme.interactive.interactive_1.active.text,
            tabBarIndicatorStyle: {
              backgroundColor:
                theme.interactive.interactive_1.active.background,
              height: '100%',
              borderRadius: 12,
              borderColor: theme.interactive.interactive_1.default.background,
              borderWidth: theme.border.width.medium * 2,
            },
            tabBarStyle: {
              backgroundColor:
                theme.interactive.interactive_1.default.background,
              borderRadius: 12,
              margin: theme.spacings.medium,
              marginBottom: theme.spacings.large,
              alignContent: 'center',
              justifyContent: 'center',
            },
            tabBarLabelStyle: {
              textTransform: 'none',
              fontSize: theme.typography.body__primary.fontSize,
            },
            tabBarItemStyle: {
              justifyContent: 'center',
            },
          }}
        >
          <Tab.Screen
            name={'AllStopsOverview'}
            options={{
              tabBarLabel: t(DeparturesTexts.resultType.all),
              tabBarAccessibilityLabel: t(DeparturesTexts.resultType.all),
            }}
            component={AllStopsOverview}
          />
          <Tab.Screen
            name={'FavouriteStopsOverview'}
            component={FavouriteStopsOverview}
            options={{
              tabBarLabel: t(DeparturesTexts.resultType.favourites),
              tabBarAccessibilityLabel: t(
                DeparturesTexts.resultType.favourites,
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
  },
}));
