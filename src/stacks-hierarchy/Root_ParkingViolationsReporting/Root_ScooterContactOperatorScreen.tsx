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

const supportItems: SupportType[] = [
  SupportType.UNABLE_TO_OPEN,
  SupportType.UNABLE_TO_CLOSE,
  SupportType.REFUND,
  SupportType.ACCIDENT_OR_BROKEN,
  SupportType.OTHER,
];

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
  const {phoneNumber: authPhoneNumberWithPrefix} = useAuthContext();
  const {prefix: authPhonePrefix, phoneNumber: authPhoneNumber} =
    getParsedPrefixAndPhoneNumber(authPhoneNumberWithPrefix);

  const onSuccess = () => {
    // TODO: navigate to next screen
  };

  const {
    mutate: sendSupportRequest,
    isLoading: isLoadingSupportRequest,
    isError: isErrorSupportRequest,
  } = useSendSupportRequestMutation(operatorId, onSuccess);

  const {data: activeShmoBooking} = useActiveShmoBookingQuery();
  const {data: customerProfile} = useProfileQuery();

  const [selectedSupportType, setSelectedSupportType] = useState<SupportType>(
    SupportType.OTHER,
  );
  const [isContactInfoPresent, setIsContactInfoPresent] =
    useState<boolean>(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean>(true);
  const [phoneNumber, setPhoneNumber] = useState(authPhoneNumber);
  const [phonePrefix, setPhonePrefix] = useState(authPhonePrefix ?? '47');
  const [email, setEmail] = useState<string>(customerProfile?.email ?? '');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [comment, setComment] = useState<string>('');
  const [isCommentValid, setIsCommentValid] = useState(true);

  const isAllInputValid =
    isContactInfoPresent &&
    isPhoneNumberValid &&
    isEmailValid &&
    isCommentValid;

  const setAllInputIsValid = () => {
    setIsCommentValid(true);
    setIsContactInfoPresent(true);
    setIsPhoneNumberValid(true);
    setIsEmailValid(true);
  };

  const onSubmit = async () => {
    const newIsCommentValid =
      SendSupportRequestBodySchema.shape.comment.safeParse(comment).success;
    const newPhoneNumberWithPrefix = '+' + phonePrefix + phoneNumber;
    const newIsPhoneNumberValid =
      !phoneNumber || isValidPhoneNumber(newPhoneNumberWithPrefix);

    const newIsEmailValid = !email || isValidEmail(email);
    const newIsContactInfoPresent = !!email || !!phoneNumber;

    const isRequestValid =
      newIsContactInfoPresent &&
      newIsPhoneNumberValid &&
      newIsEmailValid &&
      newIsCommentValid;

    if (isRequestValid) {
      setAllInputIsValid();
      const currentUserCoordinates = getCurrentCoordinatesGlobal();

      const requestBody: SendSupportRequestBody = {
        assetId: vehicleId,
        bookingId: activeShmoBooking ? activeShmoBooking.bookingId : undefined,
        supportType: selectedSupportType,
        comment: comment,
        contactInformationEndUser: {
          phone: newPhoneNumberWithPrefix,
          email: email,
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
    } else {
      setIsContactInfoPresent(newIsContactInfoPresent);
      setIsPhoneNumberValid(newIsPhoneNumberValid);
      setIsEmailValid(newIsEmailValid);
      setIsCommentValid(newIsCommentValid);
    }
  };

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
              selected={selectedSupportType}
              items={supportItems}
              onSelect={setSelectedSupportType}
              itemToText={(supportItem) =>
                t(
                  ContactOperatorTexts.supportType.supportTypeDescription(
                    supportItem,
                  ),
                )
              }
            />
            {selectedSupportType === SupportType.UNABLE_TO_CLOSE && (
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
                value={comment}
                onChangeText={setComment}
                label={t(ContactOperatorTexts.comment.label)}
                placeholder={t(ContactOperatorTexts.comment.placeholder)}
                inlineLabel={false}
                autoCapitalize="sentences"
                errorText={
                  !isCommentValid
                    ? t(ContactOperatorTexts.comment.errorMessage)
                    : undefined
                }
              />
            </Section>
            <ContentHeading text={t(ContactOperatorTexts.contactInfo.header)} />
            <Section>
              <TextInputSectionItem
                value={email}
                onChangeText={setEmail}
                label={t(ContactOperatorTexts.contactInfo.email.label)}
                placeholder={t(
                  ContactOperatorTexts.contactInfo.email.placeholder,
                )}
                inlineLabel={false}
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                errorText={
                  !isEmailValid
                    ? t(ContactOperatorTexts.contactInfo.email.errorMessage)
                    : undefined
                }
              />
            </Section>
            <Section>
              <PhoneInputSectionItem
                prefix={phonePrefix}
                onChangePrefix={setPhonePrefix}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                }}
                value={phoneNumber}
                label={t(ContactOperatorTexts.contactInfo.phone.label)}
                placeholder={t(
                  ContactOperatorTexts.contactInfo.phone.placeholder,
                )}
                keyboardType="number-pad"
                textContentType="telephoneNumber"
                errorText={
                  !isPhoneNumberValid
                    ? t(ContactOperatorTexts.contactInfo.phone.errorMessage)
                    : !isContactInfoPresent
                    ? t(
                        ContactOperatorTexts.contactInfo.errorMessage(
                          operatorName,
                        ),
                      )
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
            {isErrorSupportRequest && isAllInputValid && (
              <MessageInfoBox
                message={t(ContactOperatorTexts.submitError(operatorName))}
                type="error"
              />
            )}
            <Button
              loading={isLoadingSupportRequest}
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
