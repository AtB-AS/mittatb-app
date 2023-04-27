import React, {useState} from 'react';

import {FullScreenHeader} from '@atb/components/screen-header';
import {TicketAssistantContextProvider} from './TicketAssistantContext';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {TicketAssistantTabScreen} from './TicketAssistant_TabScreen';

type Props = RootStackScreenProps<'Root_TicketAssistantStack'>;

export const Root_TicketAssistantStack = ({navigation}: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState<any>();
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
