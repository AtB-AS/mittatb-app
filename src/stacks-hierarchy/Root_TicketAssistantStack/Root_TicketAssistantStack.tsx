import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {PageIndicator} from '@atb/components/page-indicator';
import {StyleSheet} from '@atb/theme';

import {StaticColorByType} from '@atb/theme/colors';

import {
  WelcomeScreenProps,
  TicketAssistant_WelcomeScreen,
} from './TicketAssistant_WelcomeScreen';
import {TicketAssistantStackParams} from './navigation-types';
import {TicketAssistant_FrequencyScreen} from './TicketAssistant_FrequencyScreen';
import {TicketAssistant_CategoryPickerScreen} from './TicketAssistant_CategoryPickerScreen';
import {TicketAssistant_DurationScreen} from './TicketAssistant_DurationScreen';
import {TicketAssistant_ZonePickerScreen} from './TicketAssistant_ZonePickerScreen';
import {TicketAssistant_SummaryScreen} from './TicketAssistant_SummaryScreen';

import {FullScreenHeader} from '@atb/components/screen-header';

const Tab = createMaterialTopTabNavigator<TicketAssistantStackParams>();
const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const Root_TicketAssistantStack = ({navigation}: WelcomeScreenProps) => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState<any>();
  return (
    <>
      {activeTab !== 0 ? (
        <FullScreenHeader
          leftButton={{
            type: 'back',
            //Navigate to previous tab
            onPress: () => {
              navigation.navigate(previousTab);
            },
          }}
          rightButton={{type: 'close'}}
        />
      ) : (
        <FullScreenHeader rightButton={{type: 'close'}} />
      )}
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          tabBar={(props: MaterialTopTabBarProps) => {
            setActiveTab(props.state.index);
            setPreviousTab(props.state.routes[props.state.index - 1]);
            return <PageIndicator {...props} />;
          }}
          tabBarPosition="bottom"
          initialRouteName="TicketAssistant_WelcomeScreen"
        >
          <Tab.Screen
            name="TicketAssistant_WelcomeScreen"
            component={TicketAssistant_WelcomeScreen}
          />
          <Tab.Screen
            name="TicketAssistant_FrequencyScreen"
            component={TicketAssistant_FrequencyScreen}
          />
          <Tab.Screen
            name="TicketAssistant_CategoryPickerScreen"
            component={TicketAssistant_CategoryPickerScreen}
          />
          <Tab.Screen
            name="TicketAssistant_DurationScreen"
            component={TicketAssistant_DurationScreen}
          />
          <Tab.Screen
            name="TicketAssistant_ZonePickerScreen"
            component={TicketAssistant_ZonePickerScreen}
          />
          <Tab.Screen
            name="TicketAssistant_SummaryScreen"
            component={TicketAssistant_SummaryScreen}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));
