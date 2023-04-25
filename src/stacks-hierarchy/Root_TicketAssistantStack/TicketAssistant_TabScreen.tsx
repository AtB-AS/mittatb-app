import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {TicketAssistantStackParams} from './navigation-types';

import {PageIndicator} from '@atb/components/page-indicator';
import {useTheme} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TicketAssistant_WelcomeScreen} from './TicketAssistant_WelcomeScreen';
import {TicketAssistant_CategoryPickerScreen} from './TicketAssistant_CategoryPickerScreen';
import {TicketAssistant_FrequencyScreen} from './TicketAssistant_FrequencyScreen';
import {TicketAssistant_DurationScreen} from './TicketAssistant_DurationScreen';
import {TicketAssistant_SummaryScreen} from './TicketAssistant_SummaryScreen';
import {TicketAssistant_ZonePickerScreen} from './TicketAssistant_ZonePickerScreen';
import {StaticColorByType} from '@atb/theme/colors';
import {Platform} from 'react-native';

export type Props = {
  setPreviousTab: (tab: any) => void;
  setActiveTab: (tab: any) => void;
};

export const TicketAssistantTabScreen: React.FC<Props> = ({
  setPreviousTab,
  setActiveTab,
}) => {
  const Tab = createMaterialTopTabNavigator<TicketAssistantStackParams>();
  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  const themeColor: StaticColorByType<'background'> = 'background_accent_0';
  const {theme} = useTheme();
  return (
    <>
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
          //TODO: Find better fix here for scroll view on android
          options={{swipeEnabled: Platform.OS === 'ios' ? true : false}}
        />
        <Tab.Screen
          name="TicketAssistant_SummaryScreen"
          component={TicketAssistant_SummaryScreen}
        />
      </Tab.Navigator>
    </>
  );
};
