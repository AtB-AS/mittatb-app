import React, {useCallback, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
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
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ScooterOperatorContactTexts} from '@atb/translations/screens/ScooterOperatorContact';
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
import {getThemeColor} from './components/ScreenContainer';
import {CustomerProfile} from '@atb/api/types/profile';
import {useNavigation} from '@react-navigation/native';

export type Root_ContactScooterOperatorScreenProps =
  RootStackScreenProps<'Root_ContactScooterOperatorScreen'>;

export const Root_ContactScooterOperatorScreen = ({
  route,
}: Root_ContactScooterOperatorScreenProps) => {
  const {vehicleId} = route.params;
  const styles = useStyles();
  const {theme} = useThemeContext();
  const themeColor = getThemeColor(theme);
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();
  const {operatorName} = useVehicle(vehicleId);

  const operatorId = 'YAL:Operator:Altair';

  const onSuccess = () => {
    navigation.navigate('Root_ContactScooterOperatorConfirmationScreen', {
      operatorName: operatorName,
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
        leftButton={{type: 'back'}}
        setFocusOnLoad={false}
        color={themeColor}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.mainView}>
        <ScrollView keyboardShouldPersistTaps="handled" centerContent={true}>
          <View style={styles.contentContainer}>
            <ThemeText style={styles.title} typography="heading--medium">
              {t(ScooterOperatorContactTexts.title(operatorName))}
            </ThemeText>
            <ContentHeading
              text={t(ScooterOperatorContactTexts.supportType.header)}
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
                  ScooterOperatorContactTexts.supportType.supportTypeDescription(
                    supportType,
                  ),
                )
              }
            />
            {requestBody.supportType === SupportType.UNABLE_TO_CLOSE && (
              <MessageInfoBox
                message={t(
                  ScooterOperatorContactTexts.supportType.noEndInfo(
                    operatorName,
                  ),
                )}
                type="info"
              />
            )}
            <ContentHeading
              text={t(ScooterOperatorContactTexts.comment.header)}
            />
            <Section>
              <TextInputSectionItem
                value={requestBody.comment ?? ''}
                onChangeText={(comment) =>
                  setRequestBody((prev) => ({...prev, comment}))
                }
                label={t(ScooterOperatorContactTexts.comment.label)}
                placeholder={t(ScooterOperatorContactTexts.comment.placeholder)}
                inlineLabel={false}
                autoCapitalize="sentences"
                errorText={
                  !isCommentValid && showError
                    ? t(
                        ScooterOperatorContactTexts.comment.errorMessage(
                          MAX_SUPPORT_COMMENT_LENGTH,
                        ),
                      )
                    : undefined
                }
              />
            </Section>
            <ContentHeading
              text={t(ScooterOperatorContactTexts.contactInfo.header)}
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
                label={t(ScooterOperatorContactTexts.contactInfo.email.label)}
                placeholder={t(
                  ScooterOperatorContactTexts.contactInfo.email.placeholder,
                )}
                showClear
                inlineLabel={false}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                errorText={
                  !isEmailValid && showError
                    ? t(
                        ScooterOperatorContactTexts.contactInfo.email
                          .errorMessage,
                      )
                    : !isContactInfoPresent && showError
                    ? t(ScooterOperatorContactTexts.contactInfo.errorMessage)
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
                label={t(ScooterOperatorContactTexts.contactInfo.phone.label)}
                placeholder={t(
                  ScooterOperatorContactTexts.contactInfo.phone.placeholder,
                )}
                showClear
                keyboardType="number-pad"
                textContentType="telephoneNumber"
                errorText={
                  !isPhoneNumberValid && showError
                    ? t(
                        ScooterOperatorContactTexts.contactInfo.phone
                          .errorMessage,
                      )
                    : !isContactInfoPresent && showError
                    ? t(ScooterOperatorContactTexts.contactInfo.errorMessage)
                    : undefined
                }
              />
            </Section>
            <View style={styles.description}>
              <ThemeText typography="body__secondary">
                {t(ScooterOperatorContactTexts.location.header)}
              </ThemeText>
              <ThemeText typography="body__tertiary">
                {t(
                  ScooterOperatorContactTexts.location.description(
                    operatorName,
                  ),
                )}
              </ThemeText>
            </View>
            {supportRequestStatus === 'error' &&
              isAllInputValid &&
              showError && (
                <MessageInfoBox
                  message={t(
                    ScooterOperatorContactTexts.submitError(operatorName),
                  )}
                  type="error"
                />
              )}
            <Button
              loading={supportRequestStatus === 'loading'}
              expanded={true}
              mode="primary"
              text={t(ScooterOperatorContactTexts.submitButton)}
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
