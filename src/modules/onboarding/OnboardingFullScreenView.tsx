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

export type OnboardingFullScreenViewProps = PropsWithChildren<{
  footerButton: ButtonProps;
  secondaryFooterButton?: ButtonProps;
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
                typography="body__tertiary"
                color={themeColor}
                style={styles.footerDescription}
              >
                {footerDescription}
              </ThemeText>
            </ScrollView>
          )}
          {isError && <GenericError />}
          <Button
            expanded={true}
            interactiveColor={interactiveColor}
            mode="primary"
            onPress={footerButton.onPress}
            style={styles.footerButton}
            text={footerButton.text || ''}
            rightIcon={footerButton.rightIcon}
            testID={testID ? `${testID}Button` : 'nextButton'}
          />
          {secondaryFooterButton && (
            <Button
              expanded={true}
              backgroundColor={themeColor}
              mode="secondary"
              onPress={secondaryFooterButton.onPress}
              style={styles.footerButton}
              text={secondaryFooterButton.text || ''}
              rightIcon={secondaryFooterButton.rightIcon}
              testID={
                secondaryTestID ? `${secondaryTestID}Button` : 'nextButton'
              }
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
