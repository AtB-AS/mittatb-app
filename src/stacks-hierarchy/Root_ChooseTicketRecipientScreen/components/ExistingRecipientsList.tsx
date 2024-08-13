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
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {useDeleteRecipientMutation} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-delete-recipient-mutation.ts';
import {animateNextChange} from '@atb/utils/animation.ts';
import {screenReaderPause} from '@atb/components/text';

export const ExistingRecipientsList = ({
  state: {recipient},
  onSelect,
  onEmptyRecipients,
  themeColor,
}: {
  state: RecipientSelectionState;
  onSelect: (r?: ExistingRecipientType) => void;
  onEmptyRecipients: () => void;
  themeColor: StaticColor;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme, themeName} = useTheme();

  const recipientsQuery = useFetchRecipientsQuery();
  const {mutation: deleteMutation, activeDeletions} =
    useDeleteRecipientMutation();

  useLayoutEffect(() => {
    if (deleteMutation.status !== 'idle') animateNextChange();
  }, [deleteMutation.status]);

  useEffect(() => {
    if (recipientsQuery.status === 'success' && !recipientsQuery.data.length) {
      onEmptyRecipients();
    }
  }, [recipientsQuery.status, recipientsQuery.data, onEmptyRecipients]);

  const onDelete = ({accountId}: ExistingRecipientType) => {
    if (recipient?.accountId === accountId) {
      onSelect(undefined);
    }
    deleteMutation.mutate(accountId);
  };

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
      {deleteMutation.isError && (
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
          onSelect={(item) =>
            !activeDeletions.includes(item.accountId) && onSelect(item)
          }
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
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  loadingSpinner: {marginBottom: theme.spacings.medium},
  errorMessage: {marginBottom: theme.spacings.medium},
  recipientList: {marginBottom: theme.spacings.medium},
}));
