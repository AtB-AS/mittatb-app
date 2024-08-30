import {RecipientSelectionState} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
import {OnBehalfOfTexts, useTranslation} from '@atb/translations';
import {TouchableOpacity} from 'react-native';
import {Checkbox} from '@atb/components/checkbox';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {ContrastColor} from '@atb/theme/colors.ts';

export const SaveRecipientToggle = ({
  state: {settingPhone, settingName},
  onPress,
  themeColor,
}: {
  state: RecipientSelectionState;
  onPress: () => void;
  themeColor: ContrastColor;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  if (!settingPhone) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{checked: settingPhone}}
    >
      <Checkbox checked={settingName} />
      <ThemeText color={themeColor}>
        {t(OnBehalfOfTexts.saveCheckBoxLabel)}
      </ThemeText>
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacing.medium,
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
}));
