import {RecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types';
import {dictionary, useTranslation} from '@atb/translations';
import {useEffect, useLayoutEffect} from 'react';
import {ActivityIndicator, Alert} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RadioGroupSection} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ContrastColor} from '@atb/theme/colors';
import OnBehalfOfTexts from '@atb/translations/screens/subscreens/OnBehalfOf';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {useDeleteRecipientMutation} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-delete-recipient-mutation';
import {animateNextChange} from '@atb/utils/animation';
import {screenReaderPause} from '@atb/components/text';
import {
  useFetchOnBehalfOfAccountsQuery,
  OnBehalfOfAccountType,
} from '@atb/modules/on-behalf-of';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {spellOut} from '@atb/utils/accessibility';

export const ExistingRecipientsList = ({
  state: {recipient},
  onSelect,
  onEmptyRecipients,
  onDelete,
  themeColor,
}: {
  state: RecipientSelectionState;
  onSelect: (r?: OnBehalfOfAccountType) => void;
  onEmptyRecipients: () => void;
  onDelete: () => void;
  themeColor: ContrastColor;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  const recipientsQuery = useFetchOnBehalfOfAccountsQuery({enabled: true});
  const {mutation: deleteMutation, activeDeletions} =
    useDeleteRecipientMutation();

  useLayoutEffect(() => {
    if (deleteMutation.status !== 'idle') animateNextChange();
    if (deleteMutation.status === 'success') onDelete();
  }, [deleteMutation.status, onDelete]);

  useEffect(() => {
    if (recipientsQuery.status === 'success' && !recipientsQuery.data.length) {
      onEmptyRecipients();
    }
  }, [recipientsQuery.status, recipientsQuery.data, onEmptyRecipients]);

  const onDeletePress = ({accountId, name}: OnBehalfOfAccountType) => {
    if (recipient?.accountId === accountId) {
      onSelect(undefined);
    }

    Alert.alert(
      t(OnBehalfOfTexts.deleteAlert.title(name)),
      t(OnBehalfOfTexts.deleteAlert.message),
      [
        {text: t(dictionary.cancel), style: 'cancel'},
        {
          text: t(dictionary.remove),
          style: 'destructive',
          onPress: () => deleteMutation.mutate(accountId),
        },
      ],
    );
  };

  return (
    <>
      {recipientsQuery.status === 'loading' && (
        <ActivityIndicator
          style={styles.loadingSpinner}
          size="large"
          color={themeColor.foreground.primary}
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
          itemToSubtext={(i) => formatPhoneNumber(i.phoneNumber)}
          itemToA11yLabel={(i) =>
            i.name + screenReaderPause + spellOut(i.phoneNumber)
          }
          keyExtractor={(i) => i.accountId}
          selected={recipient}
          onSelect={(item) =>
            !activeDeletions.includes(item.accountId) && onSelect(item)
          }
          style={styles.recipientList}
          itemToRightAction={(item) => ({
            icon: (props) => (
              <Delete
                {...props}
                fill={theme.color.status.error.primary.background}
              />
            ),
            onPress: () => onDeletePress(item),
            isLoading: activeDeletions.includes(item.accountId),
          })}
        />
      ) : null}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  loadingSpinner: {marginBottom: theme.spacing.medium},
  errorMessage: {marginBottom: theme.spacing.medium},
  recipientList: {marginBottom: theme.spacing.medium},
}));
