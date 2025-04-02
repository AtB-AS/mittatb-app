import React, {useCallback, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {RootNavigationProps, RootStackScreenProps} from '@atb/stacks-hierarchy';
import {
  PhoneInputSectionItem,
  RadioGroupSection,
  Section,
  TextInputSectionItem,
} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {ContactScooterOperatorTexts} from '@atb/translations/screens/ContactScooterOperator';
import {
  MAX_SUPPORT_COMMENT_LENGTH,
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
import {CustomerProfile} from '@atb/api/types/profile';
import {useNavigation} from '@react-navigation/native';
import {useOperators} from '@atb/mobility/use-operators';

export type Root_ContactScooterOperatorScreenProps =
  RootStackScreenProps<'Root_ContactScooterOperatorScreen'>;

export const Root_ContactScooterOperatorScreen = ({
  route,
}: Root_ContactScooterOperatorScreenProps) => {
  const {operatorId, vehicleId} = route.params;
  const operators = useOperators();
  const operatorName = operators.byId(operatorId)?.name;
  const styles = useStyles();
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();

  const onSuccess = () => {
    navigation.navigate('Root_ContactScooterOperatorConfirmationScreen', {
      operatorName: operatorName ?? '',
      transitionOverride: 'slide-from-right',
    });
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
        leftButton={{type: 'back', withIcon: true}}
        setFocusOnLoad={false}
        title={t(ContactScooterOperatorTexts.title(operatorName ?? ''))}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView keyboardShouldPersistTaps="handled" centerContent={true}>
          <View style={styles.contentContainer}>
            <ContentHeading
              text={t(ContactScooterOperatorTexts.supportType.header)}
            />
            <RadioGroupSection<SupportType>
              keyExtractor={(supportType) => supportType}
              selected={requestBody.supportType}
              items={Object.values(SupportType) as SupportType[]}
              onSelect={(supportType) =>
                setRequestBody((prev) => ({...prev, supportType}))
              }
              itemToText={(supportType) =>
                t(
                  ContactScooterOperatorTexts.supportType.supportTypeDescription(
                    supportType,
                  ),
                )
              }
            />
            {requestBody.supportType === SupportType.UNABLE_TO_CLOSE && (
              <MessageInfoBox
                message={t(
                  ContactScooterOperatorTexts.supportType.noEndInfo(
                    operatorName ?? '',
                  ),
                )}
                type="info"
              />
            )}
            <ContentHeading
              text={t(ContactScooterOperatorTexts.comment.header)}
            />
            <Section>
              <TextInputSectionItem
                value={requestBody.comment ?? ''}
                onChangeText={(comment) =>
                  setRequestBody((prev) => ({...prev, comment}))
                }
                label={t(ContactScooterOperatorTexts.comment.label)}
                placeholder={t(ContactScooterOperatorTexts.comment.placeholder)}
                inlineLabel={false}
                autoCapitalize="sentences"
                errorText={
                  !isCommentValid && showError
                    ? t(
                        ContactScooterOperatorTexts.comment.errorMessage(
                          MAX_SUPPORT_COMMENT_LENGTH,
                        ),
                      )
                    : undefined
                }
              />
            </Section>
            <ContentHeading
              text={t(ContactScooterOperatorTexts.contactInfo.header)}
            />
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
                label={t(ContactScooterOperatorTexts.contactInfo.email.label)}
                placeholder={t(
                  ContactScooterOperatorTexts.contactInfo.email.placeholder,
                )}
                showClear
                inlineLabel={false}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                errorText={
                  !isEmailValid && showError
                    ? t(
                        ContactScooterOperatorTexts.contactInfo.email
                          .errorMessage,
                      )
                    : !isContactInfoPresent && showError
                    ? t(ContactScooterOperatorTexts.contactInfo.errorMessage)
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
                label={t(ContactScooterOperatorTexts.contactInfo.phone.label)}
                placeholder={t(
                  ContactScooterOperatorTexts.contactInfo.phone.placeholder,
                )}
                showClear
                textContentType="telephoneNumber"
                errorText={
                  !isPhoneNumberValid && showError
                    ? t(
                        ContactScooterOperatorTexts.contactInfo.phone
                          .errorMessage,
                      )
                    : !isContactInfoPresent && showError
                    ? t(ContactScooterOperatorTexts.contactInfo.errorMessage)
                    : undefined
                }
              />
            </Section>
            <View style={styles.description}>
              <ThemeText typography="body__secondary">
                {t(ContactScooterOperatorTexts.location.header)}
              </ThemeText>
              <ThemeText typography="body__tertiary">
                {t(
                  ContactScooterOperatorTexts.location.description(
                    operatorName ?? '',
                  ),
                )}
              </ThemeText>
            </View>
            {supportRequestStatus === 'error' &&
              isAllInputValid &&
              showError && (
                <MessageInfoBox
                  message={t(
                    ContactScooterOperatorTexts.submitError(operatorName ?? ''),
                  )}
                  type="error"
                />
              )}
            <Button
              loading={supportRequestStatus === 'loading'}
              expanded={true}
              mode="primary"
              text={t(ContactScooterOperatorTexts.submitButton)}
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
  vehicleId: string | null,
  onSuccess: () => void,
) => {
  const {phoneNumber: authPhoneNumberWithPrefix} = useAuthContext();
  const {prefix: authPhonePrefix, phoneNumber: authPhoneNumber} =
    getParsedPrefixAndPhoneNumber(authPhoneNumberWithPrefix);
  const {data: activeShmoBooking} = useActiveShmoBookingQuery();

  const [requestBody, setRequestBody] = useState<SendSupportRequestBodyInput>({
    supportType: SupportType.OTHER,
    comment: '',
    contactInformationEndUser: {
      phonePrefix: authPhonePrefix ?? '47',
      phoneNumber: authPhoneNumber ?? '',
      email: '',
    },
  });

  const profileOnSuccess = useCallback((data: CustomerProfile) => {
    setRequestBody((prev) => ({
      ...prev,
      contactInformationEndUser: {
        ...prev.contactInformationEndUser,
        email: data?.email,
      },
    }));
  }, []);

  useProfileQuery(profileOnSuccess);

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
    isCommentValid: !formattedErrors?.comment?._errors?.length,
    isPhoneNumberValid:
      !formattedErrors?.contactInformationEndUser?.phoneNumber?._errors?.length,
    isEmailValid:
      !formattedErrors?.contactInformationEndUser?.email?._errors?.length,
    isContactInfoPresent:
      !formattedErrors?.contactInformationEndUser?._errors?.length,
    isAllInputValid: result.success,
    validatedRequestBody: result.success ? result.data : undefined,
  };
};
