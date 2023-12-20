import {useState} from 'react';
import {PhoneInputSectionItem, Section} from '@atb/components/sections';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {LoginTexts, useTranslation} from '@atb/translations';
import {StyleSheet, useTheme} from '@atb/theme';
import {PhoneSignInErrorCode} from '@atb/auth';
import {StaticColorByType, getStaticColor} from '@atb/theme/colors';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import phone from 'phone';
import { ArrowRight } from '@atb/assets/svg/mono-icons/navigation';
import { SvgProps } from 'react-native-svg';

type Props = {
  style?: StyleProp<ViewStyle>;
  submitButtonText: string;
  submitButtonTestId: string;
  onNextPromise: (
    number: string,
    forceResend?: boolean,
  ) => Promise<PhoneSignInErrorCode | undefined>;
  onNextAction: (number: string) => void;
  rightIcon?: (props: SvgProps) => JSX.Element;
};

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const PhoneInput = ({
  style, 
  submitButtonText,
  submitButtonTestId,
  onNextPromise,
  onNextAction,
  rightIcon
}: Props) => {
  const styles = useStyles();

  const {t} = useTranslation();
  const {themeName} = useTheme();

  const [prefix, setPrefix] = useState('47');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PhoneSignInErrorCode>();

  const phoneValidationParams = {
    strictDetection: true,
    validateMobilePrefix: false,
  };

  const phoneValidation = phone(
    '+' + prefix + phoneNumber,
    phoneValidationParams,
  );

  const isValidPhoneNumber = phoneValidation.isValid;

  const onNext = async () => {
    setIsSubmitting(true);
    if (!phoneValidation.phoneNumber) {
      setIsSubmitting(false);
      setError('invalid_phone');
      return;
    }

    const errorCode = await onNextPromise(phoneValidation.phoneNumber);
    if (!errorCode) {
      setError(undefined);
      setIsSubmitting(false);
      onNextAction(phoneValidation.phoneNumber);
    } else {
      setIsSubmitting(false);
      setError(errorCode);
    }
  };

  return (
    <View style={style}>
      <Section>
        <PhoneInputSectionItem
          label={t(LoginTexts.phoneInput.input.heading)}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          prefix={prefix}
          onChangePrefix={setPrefix}
          showClear={true}
          keyboardType="number-pad"
          placeholder={t(LoginTexts.phoneInput.input.placeholder)}
          autoFocus={true}
          textContentType="telephoneNumber"
        />
      </Section>

      <View style={styles.buttonView}>
        {isSubmitting && (
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
            color={getStaticColor(themeName, themeColor).text}
          />
        )}

        {error && !isSubmitting && (
          <MessageInfoBox
            style={styles.errorMessage}
            type="error"
            message={t(LoginTexts.phoneInput.errors[error])}
          />
        )}

        {!isSubmitting && (
          <Button
            style={styles.submitButton}
            interactiveColor="interactive_0"
            onPress={onNext}
            text={submitButtonText}
            disabled={!isValidPhoneNumber}
            testID={submitButtonTestId}
            rightIcon={rightIcon && {svg: rightIcon}}
          />
        )}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  activityIndicator: {
    marginVertical: theme.spacings.large,
  },
  errorMessage: {
    marginBottom: theme.spacings.medium,
  },
  buttonView: {
    marginTop: theme.spacings.medium,
  },
  submitButton: {
    marginTop: theme.spacings.medium,
  },
}));
