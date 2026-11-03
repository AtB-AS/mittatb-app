import React, {useState} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {dictionary, useTranslation} from '@atb/translations';
import {RootNavigationProps, RootStackScreenProps} from '@atb/stacks-hierarchy';
import {
  CheckboxSectionItem,
  PhoneInputSectionItem,
  Section,
  TextInputSectionItem,
} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {ContactShmoOperatorTexts} from '@atb/translations/screens/ContactScooterOperator';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {
  MAX_SUPPORT_COMMENT_LENGTH,
  SendDamageReportBodySchema,
  ShmoDamage,
  SupportType,
} from '@atb/api/types/mobility';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSendDamageReportMutation, useOperators} from '@atb/modules/mobility';
import {FullScreenView} from '@atb/components/screen-view';
import {
  getCurrentPlace,
  useSupportContactForm,
} from './use-support-contact-form';

// Used to display the free text input
const isOtherDamage = (damage: ShmoDamage) =>
  damage.vehicleComponentName === 'other';

export type Root_ReportShmoDamageScreenProps =
  RootStackScreenProps<'Root_ReportShmoDamageScreen'>;

export const Root_ReportShmoDamageScreen = ({
  route,
}: Root_ReportShmoDamageScreenProps) => {
  const {operatorId, bookingId} = route.params;

  /* Handed over by whoever opened the screen -- the operator's own damages ride
     along on the asset, so the caller already has them. An operator that
     publishes none leaves the user the empty state below. */
  const supportedDamages = route.params?.supportedDamages ?? [];

  const styles = useStyles();
  const {t} = useTranslation();
  const navigation = useNavigation<RootNavigationProps>();
  const operatorName = useOperators().byId(operatorId)?.name ?? '';

  const {
    selectedDamages,
    toggleDamage,
    requestBody,
    setRequestBody,
    isCommentMissing,
    isCommentTooLong,
    isPhoneNumberValid,
    isEmailValid,
    isDamageSelectionValid,
    isCommentRequired,
    unsentReports,
    onSubmit,
    showError,
    supportRequestStatus,
  } = useReportDamageController(operatorId, bookingId, () =>
    navigation.navigate('Root_ContactShmoOperatorConfirmationScreen', {
      operatorName,
      transitionOverride: 'slide-from-right',
    }),
  );

  return (
    <FullScreenView
      headerProps={{
        leftButton: {type: 'back'},
        title: t(MobilityTexts.reportDamage.title),
      }}
      avoidKeyboard={true}
      focusRef={undefined}
    >
      <View style={styles.contentContainer}>
        <ContentHeading text={t(MobilityTexts.reportDamage.damages.header)} />
        {supportedDamages.length === 0 ? (
          <MessageInfoBox
            message={t(
              MobilityTexts.reportDamage.damages.emptyList(operatorName),
            )}
            type="info"
          />
        ) : (
          /* One section rather than one per damage, so the rows sit flush with
             a divider between them instead of as separate cards. */
          <Section>
            {supportedDamages.map((damage) => (
              <CheckboxSectionItem
                key={damage.vehicleComponentName ?? damage.description}
                text={damage.description}
                selected={selectedDamages.includes(damage)}
                onPress={() => toggleDamage(damage)}
              />
            ))}
          </Section>
        )}
        {!isDamageSelectionValid && showError && (
          <MessageInfoBox
            message={t(MobilityTexts.reportDamage.damages.errorMessage)}
            type="error"
          />
        )}

        {isCommentRequired && (
          <>
            <ContentHeading
              text={t(ContactShmoOperatorTexts.comment.header(true))}
            />
            <Section>
              <TextInputSectionItem
                value={requestBody.comment ?? ''}
                onChangeText={(comment) =>
                  setRequestBody((prev) => ({...prev, comment}))
                }
                label={t(ContactShmoOperatorTexts.comment.label)}
                placeholder={t(MobilityTexts.reportDamage.comment.placeholder)}
                inlineLabel={false}
                multiline={true}
                maxLength={MAX_SUPPORT_COMMENT_LENGTH}
                scrollEnabled={false}
                autoCapitalize="sentences"
                errorText={
                  showError && isCommentMissing
                    ? t(MobilityTexts.reportDamage.comment.missingMessage)
                    : showError && isCommentTooLong
                      ? t(
                          ContactShmoOperatorTexts.comment.errorMessage(
                            MAX_SUPPORT_COMMENT_LENGTH,
                          ),
                        )
                      : undefined
                }
              />
            </Section>
          </>
        )}

        <ContentHeading text={t(ContactShmoOperatorTexts.contactInfo.header)} />
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
            label={t(ContactShmoOperatorTexts.contactInfo.email.label)}
            placeholder={t(
              ContactShmoOperatorTexts.contactInfo.email.placeholder,
            )}
            showClear
            inlineLabel={false}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            errorText={
              !isEmailValid && showError
                ? t(ContactShmoOperatorTexts.contactInfo.email.errorMessage)
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
            label={t(ContactShmoOperatorTexts.contactInfo.phone.label)}
            placeholder={t(
              ContactShmoOperatorTexts.contactInfo.phone.placeholder,
            )}
            showClear
            textContentType="telephoneNumber"
            errorText={
              !isPhoneNumberValid && showError
                ? t(ContactShmoOperatorTexts.contactInfo.phone.errorMessage)
                : undefined
            }
          />
        </Section>
        <View style={styles.description}>
          <ThemeText typography="body__s">
            {t(ContactShmoOperatorTexts.location.header)}
          </ThemeText>
          <ThemeText typography="body__xs">
            {t(ContactShmoOperatorTexts.location.description(operatorName))}
          </ThemeText>
        </View>
        {!!unsentReports?.length && showError && (
          <MessageInfoBox
            message={t(
              MobilityTexts.reportDamage.submitError(
                unsentReports.map((report) => report.damage?.description ?? ''),
              ),
            )}
            type="error"
          />
        )}
        <Button
          surfaceColor="accent"
          loading={supportRequestStatus === 'pending'}
          disabled={selectedDamages.length === 0}
          expanded={true}
          mode="primary"
          text={t(dictionary.next)}
          onPress={onSubmit}
        />
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    rowGap: theme.spacing.small,
    margin: theme.spacing.medium,
  },
  description: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.small,
  },
}));

const useReportDamageController = (
  operatorId: string,
  bookingId: string,
  onSuccess: () => void,
) => {
  const {
    requestBody,
    setRequestBody,
    showError,
    setShowError,
    isCommentValid,
    isPhoneNumberValid,
    isEmailValid,
    isAllInputValid,
    validatedRequestBody,
    /* A damage report only needs some way to reach the reporter, so a phone
       number alone is enough -- unlike the support form, which insists on an
       e-mail. */
  } = useSupportContactForm(
    SupportType.ACCIDENT_OR_BROKEN,
    SendDamageReportBodySchema,
  );

  const [selectedDamages, setSelectedDamages] = useState<ShmoDamage[]>([]);

  const isCommentRequired = selectedDamages.some(isOtherDamage);
  const hasComment = !!requestBody.comment?.trim();

  const isDamageSelectionValid = selectedDamages.length > 0;

  /* The send resolves with the cases it never got to, so a partial failure is
     ordinary data rather than an error: `unsentReports` is what is still
     missing, and empty once everything is through. */
  const {
    mutate: sendDamageReports,
    status: supportRequestStatus,
    data: unsentReports,
    reset: clearUnsentReports,
  } = useSendDamageReportMutation(operatorId, onSuccess);

  const toggleDamage = (damage: ShmoDamage) => {
    setSelectedDamages((prev) =>
      prev.includes(damage)
        ? prev.filter((selected) => selected !== damage)
        : [...prev, damage],
    );
    // Changing the selection invalidates what was left over from a failed send.
    clearUnsentReports();
  };

  const onSubmit = () => {
    const isValid =
      isAllInputValid &&
      isDamageSelectionValid &&
      (!isCommentRequired || hasComment);

    if (isValid && validatedRequestBody) {
      /* Each ticked damage becomes its own support case, carrying the damage
         exactly as the operator published it. The comment belongs to the free
         text choice, so it rides on that case alone. */
      sendDamageReports(
        unsentReports?.length
          ? unsentReports
          : selectedDamages.map((damage) => ({
              ...validatedRequestBody,
              bookingId,
              ...getCurrentPlace(),
              damage,
              comment: isOtherDamage(damage)
                ? requestBody.comment?.trim() || undefined
                : undefined,
            })),
      );
    }
    setShowError(true);
  };

  return {
    selectedDamages,
    toggleDamage,
    unsentReports,
    requestBody,
    setRequestBody,
    isCommentMissing: isCommentRequired && !hasComment,
    isCommentTooLong: !isCommentValid,
    isPhoneNumberValid,
    isEmailValid,
    isDamageSelectionValid,
    isCommentRequired,
    onSubmit,
    showError,
    supportRequestStatus,
  };
};
