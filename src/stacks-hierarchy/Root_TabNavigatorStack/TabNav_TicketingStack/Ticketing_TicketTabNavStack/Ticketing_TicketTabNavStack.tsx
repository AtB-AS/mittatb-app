import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {TicketTabNav_PurchaseTabScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {TicketTabNav_AvailableFareContractsTabScreen} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_AvailableFareContractsTabScreen';
import React from 'react';
import {TicketTabNavStackParams} from './navigation-types';
import {useFareContracts} from '@atb/modules/ticketing';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {View} from 'react-native';
import {Route} from '@react-navigation/native';
import {ThemeText} from '@atb/components/text';
import {NativeBlockButton} from '@atb/components/native-button';
import {useTimeContext} from '@atb/modules/time';
import {useApplePassPresentationSuppression} from '@atb/modules/native-bridges';

const TopTabNav = createMaterialTopTabNavigator<TicketTabNavStackParams>();

export const Ticketing_TicketTabNavStack = () => {
  const {t} = useTranslation();

  const {serverNow} = useTimeContext();
  const {fareContracts: availableFareContracts} = useFareContracts(
    {availability: 'available'},
    serverNow,
  );
  const initialRoute: keyof TicketTabNavStackParams =
    availableFareContracts.length
      ? 'TicketTabNav_AvailableFareContractsTabScreen'
      : 'TicketTabNav_PurchaseTabScreen';

  useApplePassPresentationSuppression();

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
  );
};

const TabBar: React.FC<MaterialTopTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
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
          <NativeBlockButton
            key={index}
            accessibilityRole="tab"
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
              typography={isFocused ? 'body__m__strong' : 'body__m'}
              color={tabColor}
              testID={options.tabBarButtonTestID}
            >
              <>{label}</>
            </ThemeText>
          </NativeBlockButton>
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
