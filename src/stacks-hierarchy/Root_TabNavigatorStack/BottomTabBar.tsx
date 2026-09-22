import React from 'react';
import {Platform, Pressable, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {SvgProps} from 'react-native-svg';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import {ThemeIcon, ThemeIconProps} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';

export type BottomTabBarItem = {
  label: string;
  Icon: (props: SvgProps) => React.JSX.Element;
  IconSelected: (props: SvgProps) => React.JSX.Element;
  testID: string;
  notification?: ThemeIconProps['notification'];
};

/**
 * Bottom tab bar rendering a single icon per tab, swapping its variant on focus.
 *
 * We render our own tab bar instead of react-navigation's since it was buggy on
 * RN 0.86
 */
export const BottomTabBar = ({
  state,
  navigation,
  config,
}: BottomTabBarProps & {config: Record<string, BottomTabBarItem>}) => {
  const {theme} = useThemeContext();
  const styles = useTabBarStyles();
  const bottomNavStyles = useBottomNavigationStyles();

  return (
    <View style={[styles.tabBar, bottomNavStyles]}>
      {state.routes.map((route, index) => {
        const item = config[route.name];
        if (!item) return null;

        const focused = state.index === index;
        const color = focused
          ? theme.color.interactive[2].outline.background
          : theme.color.foreground.dynamic.secondary;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            // iOS doesn't announce role 'tab' correctly with VoiceOver, so fall
            // back to 'button' there (same as react-navigation).
            accessibilityRole={Platform.select({ios: 'button', default: 'tab'})}
            accessibilityState={{selected: focused}}
            accessibilityLabel={item.label}
            style={({pressed}) => [styles.tab, pressed && styles.tabPressed]}
          >
            <ThemeIcon
              svg={focused ? item.IconSelected : item.Icon}
              color={color}
              notification={item.notification}
            />
            <ThemeText
              typography="body__s"
              color={color}
              style={styles.label}
              maxFontSizeMultiplier={1.2}
              testID={item.testID}
            >
              {item.label}
            </ThemeText>
          </Pressable>
        );
      })}
    </View>
  );
};

const useTabBarStyles = StyleSheet.createThemeHook((theme) => ({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: theme.border.width.slim,
    borderTopColor: theme.color.border.primary.background,
    backgroundColor: theme.color.interactive[2].default.background,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xSmall,
    paddingTop: theme.spacing.medium,
    paddingBottom: theme.spacing.xSmall,
  },
  tabPressed: {
    opacity: 0.6,
  },
  label: {
    textAlign: 'center',
    lineHeight: theme.typography.body__s.fontSize.valueOf(),
  },
}));
