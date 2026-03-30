import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {TicketTabNav_PurchaseTabScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {TicketTabNav_AvailableFareContractsTabScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_AvailableFareContractsTabScreen';
import React, {createContext, useContext, useMemo} from 'react';
import {TicketTabNavStackParams} from './navigation-types';
import {useFareContracts} from '@atb/modules/ticketing';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {View, ViewStyle} from 'react-native';
import {Route} from '@react-navigation/native';
import {Button} from '@atb/components/button';
import {getServerNowGlobal} from '@atb/modules/time';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';
import {scheduleOnUI} from 'react-native-worklets';

type TabScrollContextType = {
  scrollY: SharedValue<number>;
  tabOffset0: SharedValue<number>;
  tabOffset1: SharedValue<number>;
  activeTab: SharedValue<number>;
  onTabSwitch: (targetIndex: number) => void;
};

// Context to share the scroll state on both tabs
const TabScrollContext = createContext<TabScrollContextType | undefined>(
  undefined,
);

// Used to handle the scroll state of both tabs
export const useTabScrollHandler = (tabIndex: number) => {
  const ctx = useContext(TabScrollContext);
  // Destructure individual SharedValue references so the worklet closure
  // captures stable references rather than the context object identity.
  const scrollY = ctx?.scrollY;
  const tabOffset0 = ctx?.tabOffset0;
  const tabOffset1 = ctx?.tabOffset1;
  const activeTab = ctx?.activeTab;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (activeTab && activeTab.value === tabIndex) {
        const y = event.contentOffset.y;
        if (scrollY) scrollY.value = y;
        if (tabIndex === 0 && tabOffset0) {
          tabOffset0.value = y;
        } else if (tabOffset1) {
          tabOffset1.value = y;
        }
      }
    },
  });

  return {scrollHandler};
};

const TopTabNav = createMaterialTopTabNavigator<TicketTabNavStackParams>();

export const Ticketing_TicketTabNavStack = () => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const initialRoute = useInitialRoute();
  const scrollY = useSharedValue(0);
  const tabOffset0 = useSharedValue(0);
  const tabOffset1 = useSharedValue(0);
  const activeTab = useSharedValue(
    initialRoute === 'TicketTabNav_AvailableFareContractsTabScreen' ? 1 : 0,
  );
  const color = theme.color.background.neutral[3].background;

  // Instead of tracking scrollY value to determine border,
  // only trigger the change when needed (scroll Y value 0 vs not 0)
  const showBorder = useDerivedValue(() => (scrollY.value > 0 ? 1 : 0));

  const borderStyle = useAnimatedStyle(() => ({
    borderBottomWidth: 1,
    borderBottomColor: showBorder.value ? color : 'transparent',
  }));

  const onTabSwitch = useMemo(
    () => (targetIndex: number) => {
      scheduleOnUI(() => {
        'worklet';
        activeTab.value = targetIndex;
        scrollY.value = targetIndex === 0 ? tabOffset0.value : tabOffset1.value;
      });
    },
    [activeTab, scrollY, tabOffset0, tabOffset1],
  );

  const ctxValue = useMemo(
    () => ({scrollY, tabOffset0, tabOffset1, activeTab, onTabSwitch}),
    [scrollY, tabOffset0, tabOffset1, activeTab, onTabSwitch],
  );

  return (
    <TabScrollContext.Provider value={ctxValue}>
      <TopTabNav.Navigator
        tabBar={(props: MaterialTopTabBarProps) => (
          <TabBar
            {...props}
            borderStyle={borderStyle}
            onTabSwitch={onTabSwitch}
          />
        )}
        initialRouteName={initialRoute}
        screenOptions={{animationEnabled: false}}
      >
        <TopTabNav.Screen
          name="TicketTabNav_PurchaseTabScreen"
          component={TicketTabNav_PurchaseTabScreen}
          options={{
            tabBarLabel: t(TicketingTexts.purchaseTab.label),
            tabBarAccessibilityLabel: t(TicketingTexts.purchaseTab.a11yLabel),
            tabBarButtonTestID: 'purchaseTab',
          }}
        />
        <TopTabNav.Screen
          name="TicketTabNav_AvailableFareContractsTabScreen"
          component={TicketTabNav_AvailableFareContractsTabScreen}
          options={{
            tabBarLabel: t(
              TicketingTexts.availableFareProductsAndReservationsTab.label,
            ),
            tabBarButtonTestID: 'activeTicketsTab',
          }}
        />
      </TopTabNav.Navigator>
    </TabScrollContext.Provider>
  );
};

// This hook is used to determine the initial route to navigate to when the
// user opens the ticketing tab navigator. Using the global server time to avoid
// re-rendering the component just because the server time has ticked forward a second.
const useInitialRoute = () => {
  const {fareContracts: availableFareContracts} = useFareContracts(
    {availability: 'available'},
    getServerNowGlobal(),
  );

  return availableFareContracts.length
    ? 'TicketTabNav_AvailableFareContractsTabScreen'
    : 'TicketTabNav_PurchaseTabScreen';
};

const TabBar: React.FC<
  MaterialTopTabBarProps & {
    borderStyle: ViewStyle;
    onTabSwitch: (targetIndex: number) => void;
  }
> = ({state, descriptors, navigation, borderStyle, onTabSwitch}) => {
  const styles = useStyles();
  const theme = useThemeContext();
  return (
    <Animated.View style={borderStyle}>
      <View style={styles.container}>
        {state.routes.map((route: Route<string>, index: number) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              onTabSwitch(index);
              navigation.navigate(route.name);
            }
          };

          return (
            <Button
              key={index}
              text={typeof label === 'string' ? label : route.name}
              type="large"
              active={isFocused}
              expanded={true}
              onPress={onPress}
              interactiveColor={theme.theme.color.interactive[2]}
              accessibilityRole="tab"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              style={styles.button}
            />
          );
        })}
      </View>
    </Animated.View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    margin: theme.spacing.medium,
    gap: theme.spacing.small,
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.circle,
    padding: theme.spacing.xSmall,
  },
  button: {
    flex: 1,
  },
}));
