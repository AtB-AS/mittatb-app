import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {View} from 'react-native';
import TicketInformationalOverlay from '@atb/screens/Ticketing/Tickets/TicketInformationalOverlay';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import ThemeText from '@atb/components/text';
import {Info1, Info2, Info3, PageIndicator} from './MobileTokenOnboarding';
import {ThemeColor} from '@atb/theme/colors';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';

const themeColor: ThemeColor = 'background_accent';

export type TicketTabsNavigatorParams = {
  Info1: undefined;
  Info2: undefined;
  Info3: undefined;
};

const Tab = createMaterialTopTabNavigator<TicketTabsNavigatorParams>();

export default function MobileTokenOnboardingStack() {
  const styles = useStyles();
  const {t} = useTranslation();

  const initialRoute = 'Info1';

  return (
    <View style={styles.container}>
      <FullScreenHeader alertContext="ticketing" color={themeColor} />
      <Tab.Navigator
        tabBar={(props) => (
          <FullScreenFooter>
            <PageIndicator {...props} />
          </FullScreenFooter>
        )}
        tabBarPosition="bottom"
        initialRouteName={initialRoute}
      >
        <Tab.Screen name="Info1" component={Info1} />
        <Tab.Screen name="Info2" component={Info2} />
        <Tab.Screen name="Info3" component={Info3} />
      </Tab.Navigator>

      <TicketInformationalOverlay />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors[themeColor].backgroundColor,
  },
}));
