import React, {useState} from 'react';
import {KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {
  PhoneInputSectionItem,
  RadioGroupSection,
  Section,
  TextInputSectionItem,
} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ContactOperatorTexts} from '@atb/translations/screens/ContactOperator';
import {
  SendSupportRequestBody,
  SendSupportRequestBodySchema,
  SupportType,
} from '@atb/api/types/mobility';
import {useAuthContext} from '@atb/auth';
import {getParsedPrefixAndPhoneNumber} from '@atb/utils/phone-number-utils';
import {Button} from '@atb/components/button';
import {isValidPhoneNumber} from 'libphonenumber-js';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSendSupportRequestMutation} from '@atb/mobility/queries/use-send-support-request-mutation';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {getCurrentCoordinatesGlobal} from '@atb/GeolocationContext';
import {useProfileQuery} from '@atb/queries';
import {isValidEmail} from '@atb/utils/validation';
import {FullScreenHeader} from '@atb/components/screen-header';
import {getThemeColor} from './components/ScreenContainer';

export type Root_ScooterContactOperatorScreenProps =
  RootStackScreenProps<'Root_ScooterContactOperatorScreen'>;

export const Root_ScooterContactOperatorScreen = ({
  route,
}: Root_ScooterContactOperatorScreenProps) => {
  const {vehicleId, operatorId} = route.params;
  const style = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {t} = useTranslation();
  const {operatorName} = useVehicle(vehicleId);

  const onSuccess = () => {
    // TODO: navigate to next screen (in next PR)
  };

  const {
    formData,
    setFormData,
    isCommentValid,
    isPhoneNumberValid,
    isEmailValid,
    isContactInfoPresent,
    isAllInputValid,
    onSubmit,
    showError,
    supportRequestStatus,
  } = useScooterContactFormController(operatorId, vehicleId, onSuccess);

  return (
    <View style={style.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        setFocusOnLoad={false}
        color={themeColor}
      />
      <KeyboardAvoidingView behavior="padding" style={style.mainView}>
        <ScrollView keyboardShouldPersistTaps="handled" centerContent={true}>
          <View style={style.contentContainer}>
            <ThemeText style={style.title} typography="heading--medium">
              {t(ContactOperatorTexts.title(operatorName))}
            </ThemeText>
            <ContentHeading text={t(ContactOperatorTexts.supportType.header)} />
            <RadioGroupSection<SupportType>
              keyExtractor={(supportItem) => supportItem}
              selected={formData.supportType}
              items={Object.values(SupportType) as SupportType[]}
              onSelect={(supportType) =>
                setFormData((prev) => ({...prev, supportType}))
              }
              itemToText={(supportItem) =>
                t(
                  ContactOperatorTexts.supportType.supportTypeDescription(
                    supportItem,
                  ),
                )
              }
            />
            {formData.supportType === SupportType.UNABLE_TO_CLOSE && (
              <MessageInfoBox
                message={t(
                  ContactOperatorTexts.supportType.noEndInfo(operatorName),
                )}
                type="info"
              />
            )}
            <ContentHeading text={t(ContactOperatorTexts.comment.header)} />
            <Section>
              <TextInputSectionItem
                value={formData.comment}
                onChangeText={(comment) =>
                  setFormData((prev) => ({...prev, comment}))
                }
                label={t(ContactOperatorTexts.comment.label)}
                placeholder={t(ContactOperatorTexts.comment.placeholder)}
                inlineLabel={false}
                autoCapitalize="sentences"
                errorText={
                  !isCommentValid && showError
                    ? t(ContactOperatorTexts.comment.errorMessage)
                    : undefined
                }
              />
            </Section>
            <ContentHeading text={t(ContactOperatorTexts.contactInfo.header)} />
            <Section>
              <TextInputSectionItem
                value={formData.email}
                onChangeText={(email) =>
                  setFormData((prev) => ({...prev, email}))
                }
                label={t(ContactOperatorTexts.contactInfo.email.label)}
                placeholder={t(
                  ContactOperatorTexts.contactInfo.email.placeholder,
                )}
                showClear
                inlineLabel={false}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                errorText={
                  !isEmailValid && showError
                    ? t(ContactOperatorTexts.contactInfo.email.errorMessage)
                    : !isContactInfoPresent && showError
                    ? t(ContactOperatorTexts.contactInfo.errorMessage)
                    : undefined
                }
              />
            </Section>
            <Section>
              <PhoneInputSectionItem
                prefix={formData.phonePrefix}
                onChangePrefix={(phonePrefix) =>
                  setFormData((prev) => ({...prev, phonePrefix}))
                }
                onChangeText={(phoneNumber) =>
                  setFormData((prev) => ({...prev, phoneNumber}))
                }
                value={formData.phoneNumber}
                label={t(ContactOperatorTexts.contactInfo.phone.label)}
                placeholder={t(
                  ContactOperatorTexts.contactInfo.phone.placeholder,
                )}
                showClear
                keyboardType="number-pad"
                textContentType="telephoneNumber"
                errorText={
                  !isPhoneNumberValid && showError
                    ? t(ContactOperatorTexts.contactInfo.phone.errorMessage)
                    : !isContactInfoPresent && showError
                    ? t(ContactOperatorTexts.contactInfo.errorMessage)
                    : undefined
                }
              />
            </Section>
            <View style={style.description}>
              <ThemeText typography="body__secondary">
                {t(ContactOperatorTexts.location.header)}
              </ThemeText>
              <ThemeText typography="body__tertiary">
                {t(ContactOperatorTexts.location.description(operatorName))}
              </ThemeText>
            </View>
            {supportRequestStatus === 'error' &&
              isAllInputValid &&
              showError && (
                <MessageInfoBox
                  message={t(ContactOperatorTexts.submitError(operatorName))}
                  type="error"
                />
              )}
            <Button
              loading={supportRequestStatus === 'loading'}
              expanded={true}
              mode="primary"
              text={t(ContactOperatorTexts.submitButton)}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  mainView: {
    flex: 1,
  },
  contentContainer: {
    rowGap: theme.spacing.small,
    margin: theme.spacing.medium,
    paddingBottom: theme.spacing.xLarge,
  },
  title: {
    marginBottom: theme.spacing.large,
  },
  description: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.small,
  },
}));

type FormData = {
  supportType: SupportType;
  comment: string;
  phonePrefix: string;
  phoneNumber: string;
  email: string;
};

/*
 * Controller hook for handling scooter contact form operations.
 *
 * This controller manages the state and logic for the contact form for scooyer operator support requests.
 * It handles form validation, data submission, and integration with user profile and booking information.
 */
const useScooterContactFormController = (
  operatorId: string,
  vehicleId: string,
  onSuccess: () => void,
) => {
  const {data: activeShmoBooking} = useActiveShmoBookingQuery();
  const {data: customerProfile} = useProfileQuery();
  const {phoneNumber: authPhoneNumberWithPrefix} = useAuthContext();
  const {prefix: authPhonePrefix, phoneNumber: authPhoneNumber} =
    getParsedPrefixAndPhoneNumber(authPhoneNumberWithPrefix);

  const [formData, setFormData] = useState<FormData>({
    supportType: SupportType.OTHER,
    comment: '',
    phonePrefix: authPhonePrefix ?? '47',
    phoneNumber: authPhoneNumber ?? '',
    email: customerProfile?.email ?? '',
  });

  const [showError, setShowError] = useState(false);

  const {
    isCommentValid,
    isPhoneNumberValid,
    isEmailValid,
    isContactInfoPresent,
    isAllInputValid,
  } = validateFormData(formData);

  const {mutate: sendSupportRequest, status: supportRequestStatus} =
    useSendSupportRequestMutation(operatorId, onSuccess);

  const onSubmit = async () => {
    if (isAllInputValid) {
      const currentUserCoordinates = getCurrentCoordinatesGlobal();

      const requestBody: SendSupportRequestBody = {
        assetId: vehicleId,
        bookingId: activeShmoBooking?.bookingId,
        supportType: formData.supportType,
        comment: formData.comment,
        contactInformationEndUser: {
          phone: combinePhoneNumberAndPrefix(
            formData.phonePrefix,
            formData.phoneNumber,
          ),
          email: formData.email,
        },
        ...(currentUserCoordinates && {
          place: {
            coordinates: {
              latitude: currentUserCoordinates.latitude,
              longitude: currentUserCoordinates.longitude,
            },
          },
        }),
      };
      sendSupportRequest(requestBody);
    }
    setShowError(true);
  };

  return {
    formData,
    setFormData,
    isCommentValid,
    isPhoneNumberValid,
    isEmailValid,
    isContactInfoPresent,
    isAllInputValid,
    onSubmit,
    showError,
    supportRequestStatus,
  };
};

const validateFormData = (formData: FormData) => {
  const isCommentValid = SendSupportRequestBodySchema.shape.comment.safeParse(
    formData.comment,
  ).success;

  const isPhoneNumberValid =
    !formData.phoneNumber ||
    isValidPhoneNumber(
      combinePhoneNumberAndPrefix(formData.phonePrefix, formData.phoneNumber),
    );

  const isEmailValid = !formData.email || isValidEmail(formData.email);
  const isContactInfoPresent = !!formData.email || !!formData.phoneNumber;

  const isAllInputValid =
    isContactInfoPresent &&
    isPhoneNumberValid &&
    isEmailValid &&
    isCommentValid;

  return {
    isCommentValid,
    isPhoneNumberValid,
    isEmailValid,
    isContactInfoPresent,
    isAllInputValid,
  };
};

const combinePhoneNumberAndPrefix = (prefix: string, phoneNumber: string) =>
  '+' + prefix + phoneNumber;
