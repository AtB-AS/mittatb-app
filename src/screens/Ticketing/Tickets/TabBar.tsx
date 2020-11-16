import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import {Route} from '@react-navigation/native';
import {StyleSheet, useTheme} from '../../../theme';
import ThemeText from '../../../components/text';

const TicketsTabBar: React.FC<MaterialTopTabBarProps> = ({
  state,
  descriptors,
  navigation,
  position,
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

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.button,
              {
                backgroundColor: isFocused
                  ? theme.background.level1
                  : theme.background.header,
              },
            ]}
          >
            <ThemeText type={isFocused ? 'paragraphHeadline' : 'body'}>
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

export default TicketsTabBar;
