import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {TicketTabNav_PurchaseTabScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/TicketTabNav_PurchaseTabScreen';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {TicketTabNav_ActiveFareProductsTabScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_ActiveFareProductsTabScreen';
import React from 'react';
import {TicketTabNavStackParams} from './navigation-types';
import {
  filterActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {StyleSheet, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {Route} from '@react-navigation/native';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useTimeContextState} from '@atb/time';

const TopTabNav = createMaterialTopTabNavigator<TicketTabNavStackParams>();

export const Ticketing_TicketTabNavStack = () => {
  const {t} = useTranslation();

  const {fareContracts} = useTicketingState();
  const {serverNow} = useTimeContextState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
    serverNow,
  );
  const initialRoute: keyof TicketTabNavStackParams = activeFareContracts.length
    ? 'TicketTabNav_ActiveFareProductsTabScreen'
    : 'TicketTabNav_PurchaseTabScreen';

  return (
    <TopTabNav.Navigator
      tabBar={(props: MaterialTopTabBarProps) => <TabBar {...props} />}
      initialRouteName={initialRoute}
      screenOptions={{animationEnabled: false}}
    >
      <TopTabNav.Screen
        name="TicketTabNav_PurchaseTabScreen"
        component={TicketTabNav_PurchaseTabScreen}
        options={{
          tabBarLabel: t(TicketingTexts.purchaseTab.label),
          tabBarAccessibilityLabel: t(TicketingTexts.purchaseTab.a11yLabel),
          tabBarTestID: 'purchaseTab',
        }}
      />
      <TopTabNav.Screen
        name="TicketTabNav_ActiveFareProductsTabScreen"
        component={TicketTabNav_ActiveFareProductsTabScreen}
        options={{
          tabBarLabel: t(
            TicketingTexts.activeFareProductsAndReservationsTab.label,
          ),
          tabBarTestID: 'activeTicketsTab',
        }}
      />
    </TopTabNav.Navigator>
  );
};

const TabBar: React.FC<MaterialTopTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  return (
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
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const tabColor = isFocused
          ? theme.color.background.neutral[1]
          : theme.color.background.accent[0];
        return (
          <PressableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.button,
              {
                backgroundColor: tabColor.background,
              },
            ]}
          >
            <ThemeText
              type={isFocused ? 'body__primary--bold' : 'body__primary'}
              color={tabColor}
              testID={options.tabBarTestID}
            >
              {label}
            </ThemeText>
          </PressableOpacity>
        );
      })}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flexDirection: 'row', paddingHorizontal: theme.spacing.medium},
  button: {
    flex: 1,
    borderTopLeftRadius: theme.border.radius.regular,
    borderTopRightRadius: theme.border.radius.regular,
    alignItems: 'center',
    padding: theme.spacing.small,
  },
}));
