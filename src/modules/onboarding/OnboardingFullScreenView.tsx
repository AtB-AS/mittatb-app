import {StyleSheet, useThemeContext} from '@atb/theme';
import React, {PropsWithChildren} from 'react';
import {Button, ButtonProps} from '@atb/components/button';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ScreenHeaderProps} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {FullScreenView} from '@atb/components/screen-view';
import {useTranslation} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import {VippsLoginButton} from '@atb/components/vipps-login-button';

export type OnboardingFullScreenViewProps = PropsWithChildren<{
  footerButton?: ButtonProps;
  secondaryFooterButton?: ButtonProps;
  vippsButton?: ButtonProps;
  fullScreenHeaderProps?: ScreenHeaderProps;
  footerDescription?: string;
  testID?: string;
  secondaryTestID?: string;
  isError?: boolean;
}>;

export const OnboardingFullScreenView = ({
  children,
  footerButton,
  secondaryFooterButton,
  vippsButton,
  fullScreenHeaderProps,
  footerDescription,
  testID,
  secondaryTestID,
  isError,
}: OnboardingFullScreenViewProps) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = theme.color.background.accent[0];
  const interactiveColor = theme.color.interactive[0];

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
                typography="body__xs"
                color={themeColor}
                style={styles.footerDescription}
              >
                {footerDescription}
              </ThemeText>
            </ScrollView>
          )}
          {isError && <GenericError />}
          {footerButton && (
            <Button
              {...footerButton}
              interactiveColor={interactiveColor}
              mode="primary"
              style={styles.footerButton}
              text={footerButton.text || ''}
              testID={testID ? `${testID}Button` : 'nextButton'}
            />
          )}

          {secondaryFooterButton && (
            <Button
              {...secondaryFooterButton}
              backgroundColor={themeColor}
              mode="secondary"
              style={styles.footerButton}
              text={secondaryFooterButton.text || ''}
              testID={
                secondaryTestID ? `${secondaryTestID}Button` : 'nextButton'
              }
            />
          )}
          {vippsButton && (
            <VippsLoginButton
              onPress={vippsButton.onPress}
              disabled={vippsButton?.loading ?? false}
              style={styles.footerButton}
            />
          )}
        </View>
      }
    >
      <View style={styles.mainContent}>{children}</View>
    </FullScreenView>
  );
};

const GenericError = () => {
  const {t} = useTranslation();
  return (
    <View accessibilityLiveRegion="polite">
      <MessageInfoBox
        type="error"
        message={t(PaymentMethodsTexts.genericError)}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  mainContent: {
    flexGrow: 1,
    marginHorizontal: theme.spacing.xLarge,
    justifyContent: 'center',
  },
  footerScrollView: {
    marginBottom: theme.spacing.small,
    maxHeight: 180,
  },
  footerDescription: {
    padding: theme.spacing.medium,
  },
  footerButton: {
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.medium,
  },
}));
