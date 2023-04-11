import {ThemeText} from '@atb/components/text';
import {GlobalMessage, GlobalMessageContextType} from '@atb/global-messages';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColor} from '@atb/theme/colors';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {ContentWithDisappearingHeader} from '../disappearing-header';
import {LargeHeaderButton, LargeHeaderButtonProps} from './HeaderButton';

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
  headerChildren?: JSX.Element | JSX.Element[];
  children?: JSX.Element | JSX.Element[];
};

export const LargeScreenHeaderTop = (props: LargeHeaderButtonProps) => {
  const styles = useStyles();
  return (
    <View style={styles.topContainer}>
      <LargeHeaderButton {...props}></LargeHeaderButton>
    </View>
  );
};

export const LargeScreenHeader = ({
  color,
  setFocusOnLoad,
  style,
  containerStyle,
  title,
  titleA11yLabel,
  globalMessageContext,
  headerChildren,
  children,
}: LargeScreenHeaderProps) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const themeColor = color ?? 'background_accent_0';
  const focusRef = useFocusOnLoad(setFocusOnLoad);
  const backgroundColor = getStaticColor(themeName, themeColor).background;

  return (
    <View style={[styles.container, style]}>
      <ContentWithDisappearingHeader
        header={
          <View style={[styles.headerContainer, {backgroundColor}]}>
            {title && (
              <View
                accessibilityLabel={titleA11yLabel}
                accessible={!!title}
                importantForAccessibility={
                  !!title ? 'yes' : 'no-hide-descendants'
                }
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
            {headerChildren && (
              <View style={[styles.childrenContainer, containerStyle]}>
                {headerChildren}
              </View>
            )}
            <GlobalMessage
              globalMessageContext={globalMessageContext}
              style={styles.globalMessageBox}
            />
          </View>
        }
      >
        {children}
      </ContentWithDisappearingHeader>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    height: '100%',
  },
  headerContainer: {
    paddingHorizontal: theme.spacings.medium,
  },
  topContainer: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
  headerTitle: {
    marginBottom: theme.spacings.medium,
  },
  childrenContainer: {
    paddingBottom: theme.spacings.medium,
  },
  globalMessageBox: {
    marginTop: theme.spacings.medium,
  },
}));
