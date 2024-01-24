import {useState} from 'react';
import {PhoneInputSectionItem, Section} from '@atb/components/sections';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {PhoneInputTexts, useTranslation} from '@atb/translations';
import {StyleSheet, useTheme} from '@atb/theme';
import {PhoneSignInErrorCode} from '@atb/auth';
import {StaticColorByType, getStaticColor} from '@atb/theme/colors';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import phone from 'phone';
import {SvgProps} from 'react-native-svg';
import {GetAccountByPhoneErrorCode} from '@atb/on-behalf-of/types';

type PhoneInputErrorCode = PhoneSignInErrorCode | GetAccountByPhoneErrorCode;

type Props = {
  style?: StyleProp<ViewStyle>;
  submitButtonText: string;
  submitButtonTestId: string;
  placeholderText: string;
  validatePhoneNumber: (
    number: string,
    forceResend?: boolean,
  ) => Promise<PhoneInputErrorCode | string | undefined>;
  onPhoneNumberValidatedAction: (number: string, data?: any) => void;
  rightIcon?: (props: SvgProps) => JSX.Element;
};

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export const PhoneInput = ({
  style,
  submitButtonText,
  submitButtonTestId,
  placeholderText,
  validatePhoneNumber,
  onPhoneNumberValidatedAction,
  rightIcon,
}: Props) => {
  const styles = useStyles();

  const {t} = useTranslation();
  const {themeName} = useTheme();

  const [prefix, setPrefix] = useState('47');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<PhoneInputErrorCode>();

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

    const result = await validatePhoneNumber(phoneValidation.phoneNumber);

    setIsSubmitting(false);

    if (result && isError(result)) {
      setError(result);
    } else {
      setError(undefined);
      onPhoneNumberValidatedAction(phoneValidation.phoneNumber, result);
    }
  };

  return (
    <View style={style}>
      <Section>
        <PhoneInputSectionItem
          label={t(PhoneInputTexts.input.title)}
          value={phoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
            setError(undefined);
          }}
          prefix={prefix}
          onChangePrefix={setPrefix}
          showClear={true}
          keyboardType="number-pad"
          placeholder={placeholderText}
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
            message={t(PhoneInputTexts.errors[error])}
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

function isError(error: string): error is PhoneInputErrorCode {
  return ['invalid_phone', 'no_associated_account', 'unknown_error'].includes(
    error,
  );
}

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
