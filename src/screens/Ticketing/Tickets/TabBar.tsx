import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import {Route} from '@react-navigation/native';
import colors from '../../../theme/colors';
import {StyleSheet} from '../../../theme';

const TicketsTabBar: React.FC<MaterialTopTabBarProps> = ({
  state,
  descriptors,
  navigation,
  position,
}) => {
  const styles = useStyles();
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
              {backgroundColor: isFocused ? '#F5F5F6' : colors.secondary.cyan},
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {fontWeight: isFocused ? '600' : 'normal'},
              ]}
            >
              {label}
            </Text>
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
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    padding: theme.spacings.small,
  },
  buttonText: {
    fontSize: theme.text.sizes.body,
    lineHeight: 20,
  },
}));

export default TicketsTabBar;
