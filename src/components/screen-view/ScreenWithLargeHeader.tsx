import {ThemeText} from '@atb/components/text';
import {GlobalMessage} from '@atb/global-messages';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import React from 'react';
import {View} from 'react-native';
import {ContentWithDisappearingHeader} from '../disappearing-header';
import {ScreenViewProps} from './FullScreenView';
export {AnimatedScreenHeader} from '../screen-header/AnimatedScreenHeader';

export const ScreenWithLargeHeader = ({
  color,
  setFocusOnLoad,
  title,
  titleA11yLabel,
  globalMessageContext,
  headerChildren,
  children,
}: ScreenViewProps) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const themeColor = color ?? 'background_accent_0';
  const focusRef = useFocusOnLoad(setFocusOnLoad);
  const backgroundColor = getStaticColor(themeName, themeColor).background;

  return (
    <View style={styles.container}>
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
              <View style={styles.childrenContainer}>{headerChildren}</View>
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
    flex: 1,
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
    marginBottom: theme.spacings.medium,
  },
}));
