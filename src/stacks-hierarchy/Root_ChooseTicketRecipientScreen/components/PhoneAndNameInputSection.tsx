import {RecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types';
import {
  OnBehalfOfTexts,
  PhoneInputTexts,
  useTranslation,
} from '@atb/translations';
import {
  PhoneInputSectionItem,
  Section,
  TextInputSectionItem,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ContrastColor} from '@atb/theme/colors';
import {StyleSheet} from '@atb/theme';

export const PhoneAndNameInputSection = ({
  state: {settingPhone, settingName, prefix, phone, name, error},
  onChangePrefix,
  onChangePhone,
  onChangeName,
  themeColor,
}: {
  state: RecipientSelectionState;
  onChangePrefix: (p: string) => void;
  onChangePhone: (p: string) => void;
  onChangeName: (n: string) => void;
  themeColor: ContrastColor;
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  if (!settingPhone && !settingName) return null;
  return (
    <>
      {settingName && (
        <ThemeText
          typography="body__secondary"
          color={themeColor}
          style={styles.newRecipientLabel}
        >
          {t(OnBehalfOfTexts.newRecipientLabel)}
        </ThemeText>
      )}
      <Section>
        <PhoneInputSectionItem
          label={t(PhoneInputTexts.input.title)}
          value={phone}
          onChangeText={onChangePhone}
          prefix={prefix}
          onChangePrefix={onChangePrefix}
          showClear={true}
          placeholder={t(PhoneInputTexts.input.placeholder.sendTicket)}
          autoFocus={true}
          textContentType="telephoneNumber"
          errorText={
            error === 'invalid_phone' ||
            error === 'no_associated_account' ||
            error === 'phone_already_exists'
              ? t(PhoneInputTexts.errors[error])
              : undefined
          }
        />
        {settingName && (
          <TextInputSectionItem
            label={t(OnBehalfOfTexts.nameInputLabel)}
            placeholder={t(OnBehalfOfTexts.nameInputPlaceholder)}
            onChangeText={onChangeName}
            value={name}
            inlineLabel={false}
            autoFocus={true}
            errorText={
              error === 'missing_recipient_name' ||
              error === 'too_long_recipient_name' ||
              error === 'name_already_exists'
                ? t(OnBehalfOfTexts.errors[error])
                : undefined
            }
          />
        )}
      </Section>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  newRecipientLabel: {
    marginLeft: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
}));
