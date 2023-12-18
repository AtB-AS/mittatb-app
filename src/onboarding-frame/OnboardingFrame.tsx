import {StyleSheet} from '@atb/theme';
import React, {PropsWithChildren} from 'react';

import {Button, ButtonProps} from '@atb/components/button';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {
  FullScreenHeader,
  ScreenHeaderProps,
} from '@atb/components/screen-header';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {StaticColorByType} from '@atb/theme/colors';
import {ThemeText} from '@atb/components/text';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type OnboardingFrameProps = PropsWithChildren<{
  footerButton: ButtonProps;
  secondaryFooterButton?: ButtonProps;
  fullScreenHeaderProps?: ScreenHeaderProps;
  footerDescription?: string;
}>;

export const OnboardingFrame = ({
  children,
  footerButton,
  secondaryFooterButton,
  fullScreenHeaderProps,
  footerDescription,
}: OnboardingFrameProps) => {
  const styles = useStyles();
  const focusRef = useFocusOnLoad(true, 200);

  return (
    <View style={styles.container}>
      <FullScreenHeader {...fullScreenHeaderProps} setFocusOnLoad={false} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        ref={focusRef}
      >
        <View style={styles.mainContent}>{children}</View>
      </ScrollView>
      <FullScreenFooter>
        {footerDescription && (
          <ScrollView style={styles.footerScrollView}>
            <ThemeText
              type="body__tertiary"
              color={themeColor}
              style={styles.footerDescription}
            >
              {footerDescription}
            </ThemeText>
          </ScrollView>
        )}
        <Button
          interactiveColor="interactive_0"
          mode="primary"
          onPress={footerButton.onPress}
          style={styles.footerButton}
          text={footerButton.text || ''}
          rightIcon={footerButton.rightIcon}
        />
        {secondaryFooterButton && (
          <Button
            interactiveColor="interactive_0"
            mode="secondary"
            onPress={secondaryFooterButton.onPress}
            style={styles.footerButton}
            text={secondaryFooterButton.text || ''}
            rightIcon={secondaryFooterButton.rightIcon}
          />
        )}
      </FullScreenFooter>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    marginHorizontal: theme.spacings.xLarge,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footerScrollView: {
    marginBottom: theme.spacings.small,
    maxHeight: 180,
  },
  footerDescription: {
    padding: theme.spacings.medium,
  },
  footerButton: {
    marginHorizontal: theme.spacings.medium,
    marginTop: theme.spacings.medium,
  },
}));
