import {StyleSheet} from '@atb/theme';
import React, {PropsWithChildren} from 'react';

import {Button, ButtonProps} from '@atb/components/button';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {ScreenHeaderProps} from '@atb/components/screen-header';
import {StaticColorByType} from '@atb/theme/colors';
import {ThemeText} from '@atb/components/text';
import {FullScreenView} from '@atb/components/screen-view';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export type OnboardingFullScreenViewProps = PropsWithChildren<{
  footerButton: ButtonProps;
  secondaryFooterButton?: ButtonProps;
  fullScreenHeaderProps?: ScreenHeaderProps;
  footerDescription?: string;
  testID?: string;
}>;

export const OnboardingFullScreenView = ({
  children,
  footerButton,
  secondaryFooterButton,
  fullScreenHeaderProps,
  footerDescription,
  testID,
}: OnboardingFullScreenViewProps) => {
  const styles = useStyles();

  return (
    <FullScreenView
      headerProps={{
        setFocusOnLoad: false,
        ...(fullScreenHeaderProps || {}),
      }}
      contentColor={themeColor}
      footer={
        <View>
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
            testID={testID ? `${testID}Button` : 'nextButton'}
          />
          {secondaryFooterButton && (
            <Button
              backgroundColor={themeColor}
              mode="secondary"
              onPress={secondaryFooterButton.onPress}
              style={styles.footerButton}
              text={secondaryFooterButton.text || ''}
              rightIcon={secondaryFooterButton.rightIcon}
              testID={testID ? `${testID}Button` : 'nextButton'}
            />
          )}
        </View>
      }
    >
      <View style={styles.mainContent}>{children}</View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  mainContent: {
    flexGrow: 1,
    marginHorizontal: theme.spacings.xLarge,
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
