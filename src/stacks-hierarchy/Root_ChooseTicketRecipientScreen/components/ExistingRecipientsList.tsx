import {
  ExistingRecipientType,
  RecipientSelectionState,
} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
import {dictionary, useTranslation} from '@atb/translations';
import {RecipientsQuery} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-fetch-recipients-query.ts';
import {useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RadioGroupSection} from '@atb/components/sections';
import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor, StaticColor} from '@atb/theme/colors.ts';

export const ExistingRecipientsList = ({
  state: {recipient},
  recipientsQuery,
  onSelect,
  onErrorOrEmpty,
  themeColor,
}: {
  state: RecipientSelectionState;
  recipientsQuery: RecipientsQuery;
  onSelect: (r: ExistingRecipientType) => void;
  onErrorOrEmpty: () => void;
  themeColor: StaticColor;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();

  useEffect(() => {
    const isError = recipientsQuery.status === 'error';
    const isEmpty =
      recipientsQuery.status === 'success' && !recipientsQuery.data.length;
    if (isError || isEmpty) {
      onErrorOrEmpty();
    }
  }, [recipientsQuery.status, recipientsQuery.data, onErrorOrEmpty]);

  switch (recipientsQuery.status) {
    case 'loading':
      return (
        <ActivityIndicator
          style={styles.loadingSpinner}
          size="large"
          color={getStaticColor(themeName, themeColor).text}
        />
      );
    case 'error':
      return (
        <MessageInfoBox
          type="error"
          message="Kunne ikke hente mottakere"
          onPressConfig={{
            action: recipientsQuery.refetch,
            text: t(dictionary.retry),
          }}
          style={styles.errorMessage}
        />
      );
    case 'success':
      return recipientsQuery.data?.length ? (
        <RadioGroupSection
          items={recipientsQuery.data}
          itemToText={(i) => i.name}
          itemToSubtext={(i) => i.phoneNumber}
          keyExtractor={(i) => i.name}
          selected={recipient}
          onSelect={onSelect}
          color="interactive_2"
          style={styles.recipientList}
        />
      ) : null;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  loadingSpinner: {marginBottom: theme.spacings.medium},
  errorMessage: {marginBottom: theme.spacings.medium},
  recipientList: {marginBottom: theme.spacings.medium},
}));
