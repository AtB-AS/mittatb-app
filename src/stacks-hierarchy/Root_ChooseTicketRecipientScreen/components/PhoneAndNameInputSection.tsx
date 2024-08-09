import {RecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
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
import {StaticColor} from '@atb/theme/colors.ts';
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
  themeColor: StaticColor;
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  if (!settingPhone && !settingName) return null; // What if recipients is empty?
  return (
    <>
      {settingName && (
        <ThemeText
          type="body__secondary"
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
          keyboardType="number-pad"
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
              error === 'missing_recipient_name' || error === 'name_already_exists'
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
    marginLeft: theme.spacings.medium,
    marginBottom: theme.spacings.small,
  },
}));
