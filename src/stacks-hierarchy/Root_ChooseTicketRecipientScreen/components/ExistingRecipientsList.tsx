import {
  ExistingRecipientType,
  RecipientSelectionState,
} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
import {dictionary, useTranslation} from '@atb/translations';
import {useFetchRecipientsQuery} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-fetch-recipients-query.ts';
import {useEffect, useLayoutEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RadioGroupSection} from '@atb/components/sections';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColor} from '@atb/theme/colors.ts';
import OnBehalfOfTexts from '@atb/translations/screens/subscreens/OnBehalfOf.ts';
import {Add, Delete} from '@atb/assets/svg/mono-icons/actions';
import {useDeleteRecipientMutation} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-delete-recipient-mutation.ts';
import {animateNextChange} from '@atb/utils/animation.ts';
import {screenReaderPause} from '@atb/components/text';
import {Button} from '@atb/components/button';

const MAX_RECIPIENTS = 10;

export const ExistingRecipientsList = ({
  state: {settingPhone, recipient},
  onSelect,
  onAddOther,
  onErrorOrEmpty,
  themeColor,
}: {
  state: RecipientSelectionState;
  onSelect: (r?: ExistingRecipientType) => void;
  onAddOther: () => void;
  onErrorOrEmpty: () => void;
  themeColor: StaticColor;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme, themeName} = useTheme();

  const recipientsQuery = useFetchRecipientsQuery();
  const {mutation, activeDeletions} = useDeleteRecipientMutation();

  useLayoutEffect(() => {
    if (mutation.status !== 'idle') animateNextChange();
  }, [mutation.status]);

  useEffect(() => {
    const isError = recipientsQuery.status === 'error';
    const isEmpty =
      recipientsQuery.status === 'success' && !recipientsQuery.data.length;
    if (isError || isEmpty) {
      onErrorOrEmpty();
    }
  }, [recipientsQuery.status, recipientsQuery.data, onErrorOrEmpty]);

  const onDelete = ({accountId}: ExistingRecipientType) => {
    if (recipient?.accountId === accountId) {
      onSelect(undefined);
    }
    mutation.mutate(accountId);
  };

  const isAtMaxRecipients =
    (recipientsQuery.data?.length || 0) >= MAX_RECIPIENTS;

  return (
    <>
      {recipientsQuery.status === 'loading' && (
        <ActivityIndicator
          style={styles.loadingSpinner}
          size="large"
          color={getStaticColor(themeName, themeColor).text}
        />
      )}
      {recipientsQuery.status === 'error' && (
        <MessageInfoBox
          type="error"
          message={t(OnBehalfOfTexts.errors.fetch_recipients_failed)}
          onPressConfig={{
            action: recipientsQuery.refetch,
            text: t(dictionary.retry),
          }}
          style={styles.errorMessage}
        />
      )}
      {mutation.isError && (
        <MessageInfoBox
          type="error"
          message={t(OnBehalfOfTexts.errors.delete_recipient_failed)}
          style={styles.errorMessage}
        />
      )}
      {recipientsQuery.status === 'success' && recipientsQuery.data?.length ? (
        <RadioGroupSection
          items={recipientsQuery.data}
          itemToText={(i) => i.name}
          itemToSubtext={(i) => i.phoneNumber}
          itemToA11yLabel={(i) =>
            i.name +
            screenReaderPause +
            i.phoneNumber.split('').join(screenReaderPause)
          }
          keyExtractor={(i) => i.name}
          selected={recipient}
          onSelect={(item) => onSelect(item)}
          color="interactive_2"
          style={styles.recipientList}
          itemToRightAction={(item) => ({
            icon: (props) => (
              <Delete {...props} fill={theme.status.error.primary.background} />
            ),
            onPress: () => onDelete(item),
            isLoading: activeDeletions.includes(item.accountId),
          })}
        />
      ) : null}
      {isAtMaxRecipients && (
        <MessageInfoBox
          type="warning"
          message={t(OnBehalfOfTexts.tooManyRecipients)}
          style={styles.maxRecipientsWarning}
        />
      )}
      {!settingPhone && (
        <Button
          text={t(OnBehalfOfTexts.sendToOtherButton)}
          onPress={onAddOther}
          mode="secondary"
          type="medium"
          compact={true}
          backgroundColor={themeColor}
          leftIcon={{svg: Add}}
          disabled={isAtMaxRecipients}
        />
      )}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  loadingSpinner: {marginBottom: theme.spacings.medium},
  errorMessage: {marginBottom: theme.spacings.medium},
  recipientList: {marginBottom: theme.spacings.medium},
  maxRecipientsWarning: {marginBottom: theme.spacings.medium},
}));
