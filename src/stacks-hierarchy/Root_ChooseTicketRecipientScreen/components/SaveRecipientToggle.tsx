import {RecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
import {dictionary, OnBehalfOfTexts, useTranslation} from '@atb/translations';
import {Checkbox} from '@atb/components/checkbox';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {StaticColor} from '@atb/theme/colors.ts';
import {useFetchRecipientsQuery} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-fetch-recipients-query.ts';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {PressableOpacity} from '@atb/components/pressable-opacity';

const MAX_RECIPIENTS = 10;

export const SaveRecipientToggle = ({
  state: {settingPhone, settingName},
  onPress,
  themeColor,
}: {
  state: RecipientSelectionState;
  onPress: () => void;
  themeColor: StaticColor;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {data: recipients} = useFetchRecipientsQuery();
  if (!settingPhone) return null;

  const isAtMaxRecipients = (recipients?.length || 0) >= MAX_RECIPIENTS;

  const a11yLabel =
    t(OnBehalfOfTexts.saveCheckBoxLabel) +
    screenReaderPause +
    t(settingName ? dictionary.checked : dictionary.unchecked);

  return (
    <>
      {isAtMaxRecipients && (
        <MessageInfoBox
          type="warning"
          message={t(OnBehalfOfTexts.tooManyRecipients)}
          style={styles.maxRecipientsWarning}
        />
      )}
      <PressableOpacity
        style={[styles.container, isAtMaxRecipients && {opacity: 0.2}]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        disabled={isAtMaxRecipients}
      >
        <Checkbox checked={settingName} />
        <ThemeText color={themeColor}>
          {t(OnBehalfOfTexts.saveCheckBoxLabel)}
        </ThemeText>
      </PressableOpacity>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacings.medium,
    flexDirection: 'row',
    gap: theme.spacings.medium,
  },
  maxRecipientsWarning: {marginTop: theme.spacings.medium},
}));
