import React, {useState} from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {PageIndicator} from '@atb/components/page-indicator';
import {useTheme} from '@atb/theme';

import {TicketAssistant_WelcomeScreen} from './TicketAssistant_WelcomeScreen';
import {TicketAssistantStackParams} from './navigation-types';
import {TicketAssistant_FrequencyScreen} from './TicketAssistant_FrequencyScreen';
import {TicketAssistant_DurationScreen} from './TicketAssistant_DurationScreen';
import {TicketAssistant_CategoryPickerScreen} from './TicketAssistant_CategoryPickerScreen';
import {TicketAssistant_ZonePickerScreen} from './TicketAssistant_ZonePickerScreen';
import {TicketAssistant_SummaryScreen} from './TicketAssistant_SummaryScreen';

import {FullScreenHeader} from '@atb/components/screen-header';
import {TicketAssistantContextProvider} from './TicketAssistantContext';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Platform} from 'react-native';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';

const Tab = createMaterialTopTabNavigator<TicketAssistantStackParams>();
type Props = RootStackScreenProps<'Root_TicketAssistantStack'>;

export const TICKET_ASSISTANT_WELCOME_SCREEN = 'TicketAssistant_WelcomeScreen';
export const TICKET_ASSISTANT_CATEGORY_PICKER_SCREEN =
  'TicketAssistant_CategoryPickerScreen';
export const TICKET_ASSISTANT_FREQUENCY_SCREEN =
  'TicketAssistant_FrequencyScreen';
export const TICKET_ASSISTANT_DURATION_SCREEN =
  'TicketAssistant_DurationScreen';
export const TICKET_ASSISTANT_ZONE_PICKER_SCREEN =
  'TicketAssistant_ZonePickerScreen';
export const TICKET_ASSISTANT_SUMMARY_SCREEN = 'TicketAssistant_SummaryScreen';

export const Root_TicketAssistantStack = ({navigation}: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const {t} = useTranslation();
  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  const [tabCount, setTabCount] = useState(0);
  const {theme} = useTheme();
  const themeColor = theme.color.background.accent[0];
  const [previousTab, setPreviousTab] = useState<any>();

  return (
    <TicketAssistantContextProvider>
      <FullScreenHeader
        title={t(TicketAssistantTexts.title)}
        leftButton={
          activeTab === 0
            ? {
                type: 'close',
                analyticsEventContext: 'Ticket assistant',
              }
            : {
                type: 'back',
                //Navigate to previous tab
                onPress: () => {
                  navigation.navigate(previousTab);
                },
              }
        }
        rightButton={
          activeTab !== tabCount - 1 && activeTab !== 0
            ? {type: 'close'}
            : undefined
        }
        setFocusOnLoad={false}
      />
      <Tab.Navigator
        tabBar={(props: MaterialTopTabBarProps) => {
          setActiveTab(props.state.index);
          setTabCount(props.state.routes.length);
          setPreviousTab(props.state.routes[props.state.index - 1]);
          return <PageIndicator {...props} />;
        }}
        style={{
          paddingTop: theme.spacing.xLarge,
          paddingBottom: Math.max(safeAreaBottom, theme.spacing.medium),
          backgroundColor: themeColor.background,
        }}
        tabBarPosition="bottom"
        initialRouteName="TicketAssistant_WelcomeScreen"
      >
        <Tab.Screen
          name={TICKET_ASSISTANT_WELCOME_SCREEN}
          component={TicketAssistant_WelcomeScreen}
        />
        <Tab.Screen
          name={TICKET_ASSISTANT_CATEGORY_PICKER_SCREEN}
          component={TicketAssistant_CategoryPickerScreen}
        />
        <Tab.Screen
          name={TICKET_ASSISTANT_FREQUENCY_SCREEN}
          component={TicketAssistant_FrequencyScreen}
        />
        <Tab.Screen
          name={TICKET_ASSISTANT_DURATION_SCREEN}
          component={TicketAssistant_DurationScreen}
        />
        <Tab.Screen
          name={TICKET_ASSISTANT_ZONE_PICKER_SCREEN}
          component={TicketAssistant_ZonePickerScreen}
          options={{swipeEnabled: Platform.OS === 'ios'}}
        />
        <Tab.Screen
          name={TICKET_ASSISTANT_SUMMARY_SCREEN}
          component={TicketAssistant_SummaryScreen}
        />
      </Tab.Navigator>
    </TicketAssistantContextProvider>
  );
};
