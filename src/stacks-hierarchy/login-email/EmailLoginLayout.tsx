import React, {PropsWithChildren} from 'react';
import {KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {Loading} from '@atb/components/loading';
import {NativeTouchable} from '@atb/components/native-touchable';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {LoginTexts, useTranslation} from '@atb/translations';

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];

type Props = PropsWithChildren<{
  title: string;
  description?: string;
  focusRef?: React.Ref<any>;
  isLoading: boolean;
  errorMessage?: string;
  mainButton: {
    text: string;
    onPress: () => void;
    disabled: boolean;
    testID?: string;
  };
  /** Rendered below the main button, e.g. "Forgot password?" */
  footer?: React.ReactNode;
}>;

/**
 * Shared layout for the e-mail login screens, matching the phone login
 * screens.
 */
export const EmailLoginLayout = ({
  title,
  description,
  focusRef,
  isLoading,
  errorMessage,
  mainButton,
  footer,
  children,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        showBorder={false}
        leftButton={{type: 'back'}}
        title={t(LoginTexts.logInOptions.title)}
        globalMessageContext={GlobalMessageContextEnum.appLogin}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          centerContent={true}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <View accessible={true} accessibilityRole="header" ref={focusRef}>
            <ThemeText
              typography="heading__3xl"
              style={styles.title}
              color={themeColor}
            >
              {title}
            </ThemeText>
          </View>
          {description && (
            <ThemeText style={styles.description} color={themeColor}>
              {description}
            </ThemeText>
          )}
          {children}
          <View style={styles.buttonView}>
            {isLoading && <Loading style={styles.loading} size="large" />}
            {errorMessage && !isLoading && (
              <MessageInfoBox
                a11yLiveRegion="polite"
                style={styles.messageBox}
                type="error"
                message={errorMessage}
              />
            )}
            {!isLoading && (
              <>
                <Button
                  surfaceColor="accent"
                  expanded={true}
                  onPress={mainButton.onPress}
                  text={mainButton.text}
                  disabled={mainButton.disabled}
                  rightIcon={{svg: ChevronRight}}
                  style={styles.submitButton}
                  testID={mainButton.testID}
                />
                {footer}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

/** Underlined text button, like "Request new one-time code". */
export const EmailLoginLinkButton = ({
  text,
  onPress,
  disabled,
  testID,
}: {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  return (
    <NativeTouchable
      variant="borderless"
      style={styles.linkButton}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{disabled}}
      testID={testID}
    >
      <ThemeText
        style={[styles.linkButtonText, disabled && styles.disabled]}
        typography="body__m__underline"
        color={getThemeColor(theme)}
      >
        {text}
      </ThemeText>
    </NativeTouchable>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    paddingBottom: theme.spacing.xLarge,
  },
  contentContainerStyle: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xLarge,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacing.medium,
  },
  description: {
    marginVertical: theme.spacing.large,
    textAlign: 'center',
  },
  loading: {
    marginVertical: theme.spacing.large,
    alignSelf: 'center',
  },
  messageBox: {
    marginBottom: theme.spacing.medium,
  },
  buttonView: {
    marginTop: theme.spacing.medium,
  },
  submitButton: {
    marginTop: theme.spacing.medium,
  },
  linkButton: {
    marginTop: theme.spacing.medium,
    padding: theme.spacing.medium,
  },
  linkButtonText: {textAlign: 'center'},
  disabled: {opacity: 0.5},
}));
