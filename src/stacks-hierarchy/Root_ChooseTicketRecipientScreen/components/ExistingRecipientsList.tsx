import {
  ExistingRecipientType,
  RecipientSelectionState,
} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
import {dictionary, useTranslation} from '@atb/translations';
import {useFetchRecipientsQuery} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-fetch-recipients-query.ts';
import {useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RadioGroupSection} from '@atb/components/sections';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColor} from '@atb/theme/colors.ts';
import OnBehalfOfTexts from "@atb/translations/screens/subscreens/OnBehalfOf.ts";

export const ExistingRecipientsList = ({
  state: {recipient},
  onSelect,
  onErrorOrEmpty,
  themeColor,
}: {
  state: RecipientSelectionState;
  onSelect: (r: ExistingRecipientType) => void;
  onErrorOrEmpty: () => void;
  themeColor: StaticColor;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();

  const recipientsQuery = useFetchRecipientsQuery();

  useEffect(() => {
    const isError = recipientsQuery.status === 'error';
    const isEmpty =
      recipientsQuery.status === 'success' && !recipientsQuery.data.length;
    if (isError || isEmpty) {
      onErrorOrEmpty();
    }
  }, [recipientsQuery.status, recipientsQuery.data, onErrorOrEmpty]);

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
          message={t(OnBehalfOfTexts.errors.fetchRecipients)}
          onPressConfig={{
            action: recipientsQuery.refetch,
            text: t(dictionary.retry),
          }}
          style={styles.errorMessage}
        />
      )}
      {recipientsQuery.status === 'success' && recipientsQuery.data?.length ? (
        <RadioGroupSection
          items={recipientsQuery.data}
          itemToText={(i) => i.name}
          itemToSubtext={(i) => i.phoneNumber}
          keyExtractor={(i) => i.accountId}
          selected={recipient}
          onSelect={onSelect}
          color="interactive_2"
          style={styles.recipientList}
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
