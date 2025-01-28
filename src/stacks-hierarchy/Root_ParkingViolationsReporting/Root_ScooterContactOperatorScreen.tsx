import React, {useEffect, useState} from 'react';
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
  MAX_SUPPORT_COMMENT_LENGTH,
  SendSupportCustomErrorType,
  SendSupportRequestBody,
  SendSupportRequestBodyInput,
  SendSupportRequestBodySchema,
  SupportType,
} from '@atb/api/types/mobility';
import {useAuthContext} from '@atb/auth';
import {getParsedPrefixAndPhoneNumber} from '@atb/utils/phone-number-utils';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSendSupportRequestMutation} from '@atb/mobility/queries/use-send-support-request-mutation';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {getCurrentCoordinatesGlobal} from '@atb/GeolocationContext';
import {useProfileQuery} from '@atb/queries';
import {FullScreenHeader} from '@atb/components/screen-header';
import {getThemeColor} from './components/ScreenContainer';
import {CustomerProfile} from '@atb/ticketing';

export type Root_ScooterContactOperatorScreenProps =
  RootStackScreenProps<'Root_ScooterContactOperatorScreen'>;

export const Root_ScooterContactOperatorScreen = ({
  route,
}: Root_ScooterContactOperatorScreenProps) => {
  const {vehicleId, operatorId} = route.params;
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {t} = useTranslation();
  const {operatorName} = useVehicle(vehicleId);

  const onSuccess = () => {
    // TODO: navigate to next screen (in next PR)
  };

  const {
    requestBody,
    setRequestBody,
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
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        setFocusOnLoad={false}
        color={themeColor}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView keyboardShouldPersistTaps="handled" centerContent={true}>
          <View style={styles.contentContainer}>
            <ThemeText style={styles.title} typography="heading--medium">
              {t(ContactOperatorTexts.title(operatorName))}
            </ThemeText>
            <ContentHeading text={t(ContactOperatorTexts.supportType.header)} />
            <RadioGroupSection<SupportType>
              keyExtractor={(supportType) => supportType}
              selected={requestBody.supportType}
              items={Object.values(SupportType) as SupportType[]}
              onSelect={(supportType) =>
                setRequestBody((prev) => ({...prev, supportType}))
              }
              itemToText={(supportType) =>
                t(
                  ContactOperatorTexts.supportType.supportTypeDescription(
                    supportType,
                  ),
                )
              }
            />
            {requestBody.supportType === SupportType.UNABLE_TO_CLOSE && (
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
                value={requestBody.comment ?? ''}
                onChangeText={(comment) =>
                  setRequestBody((prev) => ({...prev, comment}))
                }
                label={t(ContactOperatorTexts.comment.label)}
                placeholder={t(ContactOperatorTexts.comment.placeholder)}
                inlineLabel={false}
                autoCapitalize="sentences"
                errorText={
                  !isCommentValid && showError
                    ? t(
                        ContactOperatorTexts.comment.errorMessage(
                          MAX_SUPPORT_COMMENT_LENGTH,
                        ),
                      )
                    : undefined
                }
              />
            </Section>
            <ContentHeading text={t(ContactOperatorTexts.contactInfo.header)} />
            <Section>
              <TextInputSectionItem
                value={requestBody.contactInformationEndUser.email ?? ''}
                onChangeText={(email) =>
                  setRequestBody((prev) => ({
                    ...prev,
                    contactInformationEndUser: {
                      ...prev.contactInformationEndUser,
                      email,
                    },
                  }))
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
                prefix={requestBody.contactInformationEndUser.phonePrefix ?? ''}
                onChangePrefix={(phonePrefix) =>
                  setRequestBody((prev) => ({
                    ...prev,
                    contactInformationEndUser: {
                      ...prev.contactInformationEndUser,
                      phonePrefix,
                    },
                  }))
                }
                onChangeText={(phoneNumber) =>
                  setRequestBody((prev) => ({
                    ...prev,
                    contactInformationEndUser: {
                      ...prev.contactInformationEndUser,
                      phoneNumber,
                    },
                  }))
                }
                value={requestBody.contactInformationEndUser.phoneNumber ?? ''}
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
            <View style={styles.description}>
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
  const {phoneNumber: authPhoneNumberWithPrefix} = useAuthContext();
  const {prefix: authPhonePrefix, phoneNumber: authPhoneNumber} =
    getParsedPrefixAndPhoneNumber(authPhoneNumberWithPrefix);

  const [requestBody, setRequestBody] = useState<SendSupportRequestBodyInput>({
    supportType: SupportType.OTHER,
    comment: '',
    contactInformationEndUser: {
      phonePrefix: authPhonePrefix ?? '47',
      phoneNumber: authPhoneNumber ?? '',
      email: '',
    },
  });

  const profileOnSuccess = (data: CustomerProfile) => {
    setRequestBody((prev) => ({
      ...prev,
      contactInformationEndUser: {
        ...prev.contactInformationEndUser,
        email: data?.email,
      },
    }));
  };

  useProfileQuery(profileOnSuccess);
  console.log(requestBody);

  const [showError, setShowError] = useState(false);

  const {
    isCommentValid,
    isPhoneNumberValid,
    isEmailValid,
    isContactInfoPresent,
    isAllInputValid,
    validatedRequestBody,
  } = validateSchema(requestBody);

  const {mutate: sendSupportRequest, status: supportRequestStatus} =
    useSendSupportRequestMutation(operatorId, onSuccess);

  const onSubmit = async () => {
    if (isAllInputValid && validatedRequestBody) {
      const currentUserCoordinates = getCurrentCoordinatesGlobal();
      const {data: activeShmoBooking} = useActiveShmoBookingQuery();
      const requestBody: SendSupportRequestBody = {
        ...validatedRequestBody,
        assetId: vehicleId,
        bookingId: activeShmoBooking?.bookingId,
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
    requestBody,
    setRequestBody,
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

export const validateSchema = (body: SendSupportRequestBodyInput) => {
  const result = SendSupportRequestBodySchema.safeParse(body);
  const formattedErrors = result.success ? undefined : result?.error?.format();
  return {
    isCommentValid: !formattedErrors?.comment?._errors,
    isPhoneNumberValid:
      !formattedErrors?.contactInformationEndUser?.phoneNumber?._errors,
    isEmailValid: !formattedErrors?.contactInformationEndUser?.email?._errors,
    isContactInfoPresent:
      !formattedErrors?.contactInformationEndUser?._errors?.includes(
        SendSupportCustomErrorType.NO_CONTACT_INFO,
      ),
    isAllInputValid: result.success,
    validatedRequestBody: result.success ? result.data : undefined,
  };
};
