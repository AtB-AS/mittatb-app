import {ThemeText} from '@atb/components/text';
import {GlobalMessage, GlobalMessageContextType} from '@atb/global-messages';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColor} from '@atb/theme/colors';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {LargeHeaderButton} from './HeaderButton';

export {AnimatedScreenHeader} from './AnimatedScreenHeader';

export type LargeScreenHeaderProps = {
  title?: string;
  titleA11yLabel?: string;
  /**
   * For specifying the alert context for alerts that should be shown in this
   * header. If no context is specified then no alerts are shown.
   */
  globalMessageContext?: GlobalMessageContextType;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  color?: StaticColor;
  setFocusOnLoad?: boolean;
  children?: JSX.Element | JSX.Element[];
};

export const LargeScreenHeader = ({
  color,
  setFocusOnLoad,
  style,
  containerStyle,
  title,
  titleA11yLabel,
  globalMessageContext,
  children,
}: LargeScreenHeaderProps) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const themeColor = color ?? 'background_accent_0';
  const focusRef = useFocusOnLoad(setFocusOnLoad);
  const backgroundColor = getStaticColor(themeName, themeColor).background;

  return (
    <View style={[styles.container, style, {backgroundColor}]}>
      <View style={styles.button}>
        <LargeHeaderButton />
      </View>
      {title && (
        <View
          accessibilityLabel={titleA11yLabel}
          accessible={!!title}
          importantForAccessibility={!!title ? 'yes' : 'no-hide-descendants'}
          accessibilityRole="header"
          style={styles.headerTitle}
          ref={focusRef}
        >
          <ThemeText
            accessible={false}
            type="heading--medium"
            color={themeColor}
          >
            {title}
          </ThemeText>
        </View>
      )}
      <View style={[styles.childrenContainer, containerStyle]}>{children}</View>
      <GlobalMessage
        globalMessageContext={globalMessageContext}
        style={styles.globalMessageBox}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.medium,
    borderTopLeftRadius: theme.border.radius.circle,
    borderTopRightRadius: theme.border.radius.circle,
  },
  button: {
    marginBottom: theme.spacings.medium,
  },
  headerTitle: {
    marginBottom: theme.spacings.medium,
  },
  childrenContainer: {},
  globalMessageBox: {
    marginTop: theme.spacings.medium,
  },
}));
