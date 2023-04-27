import React, {useState} from 'react';

import {TicketAssistantContextProvider} from './TicketAssistantContext';
import {FullScreenHeader} from '@atb/components/screen-header';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {PageIndicator} from '@atb/components/page-indicator';
import {TicketAssistant_WelcomeScreen} from './TicketAssistant_WelcomeScreen';
import {TicketAssistant_CategoryPickerScreen} from './TicketAssistant_CategoryPickerScreen';
import {TicketAssistant_FrequencyScreen} from './TicketAssistant_FrequencyScreen';
import {TicketAssistant_DurationScreen} from './TicketAssistant_DurationScreen';
import {TicketAssistant_ZonePickerScreen} from './TicketAssistant_ZonePickerScreen';
import {Platform} from 'react-native';
import {TicketAssistant_SummaryScreen} from './TicketAssistant_SummaryScreen';
import {TicketAssistantStackParams} from './navigation-types';
import {StaticColorByType} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator<TicketAssistantStackParams>();
const themeColor: StaticColorByType<'background'> = 'background_accent_0';
type Props = RootStackScreenProps<'Root_TicketAssistantStack'>;

export const Root_TicketAssistantStack = ({navigation}: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState<any>();
  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  const {theme} = useTheme();
  return (
    <TicketAssistantContextProvider>
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
      <Tab.Navigator
        tabBar={(props: MaterialTopTabBarProps) => {
          setActiveTab(props.state.index);
          setPreviousTab(props.state.routes[props.state.index - 1]);
          return <PageIndicator {...props} />;
        }}
        style={{
          paddingBottom: Math.max(safeAreaBottom, theme.spacings.medium),
          backgroundColor: theme.static.background[themeColor].background,
        }}
        tabBarPosition="bottom"
        initialRouteName="TicketAssistant_WelcomeScreen"
      >
        <Tab.Screen
          name="TicketAssistant_WelcomeScreen"
          component={TicketAssistant_WelcomeScreen}
        />
        <Tab.Screen
          name="TicketAssistant_CategoryPickerScreen"
          component={TicketAssistant_CategoryPickerScreen}
        />
        <Tab.Screen
          name="TicketAssistant_FrequencyScreen"
          component={TicketAssistant_FrequencyScreen}
        />
        <Tab.Screen
          name="TicketAssistant_DurationScreen"
          component={TicketAssistant_DurationScreen}
        />
        <Tab.Screen
          name="TicketAssistant_ZonePickerScreen"
          component={TicketAssistant_ZonePickerScreen}
          options={{swipeEnabled: Platform.OS === 'ios'}}
        />
        <Tab.Screen
          name="TicketAssistant_SummaryScreen"
          component={TicketAssistant_SummaryScreen}
        />
      </Tab.Navigator>
    </TicketAssistantContextProvider>
  );
};
