import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import {Route} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';

const TicketingTabBar: React.FC<MaterialTopTabBarProps> = ({
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

        const tabColor = isFocused ? 'background_1' : 'background_accent_0';
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.button,
              {
                backgroundColor: theme.static.background[tabColor].background,
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
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flexDirection: 'row', paddingHorizontal: theme.spacings.medium},
  button: {
    flex: 1,
    borderTopLeftRadius: theme.border.radius.regular,
    borderTopRightRadius: theme.border.radius.regular,
    alignItems: 'center',
    padding: theme.spacings.small,
  },
}));

export default TicketingTabBar;
