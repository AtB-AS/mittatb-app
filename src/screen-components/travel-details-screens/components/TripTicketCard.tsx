import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {GenericClickableSectionItem} from '@atb/components/sections';
import {InvalidFill} from '@atb/assets/svg/mono-icons/ticketing';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {useTranslation} from '@atb/translations';
import MessageBoxTexts from '@atb/translations/components/MessageBox';

type TripTicketCardProps = {
  message: string;
  actionText: string;
  onPress: () => void;
};

export const TripTicketCard: React.FC<TripTicketCardProps> = ({
  message,
  actionText,
  onPress,
}) => {
  const styles = useStyle();
  const {t} = useTranslation();

  return (
    <GenericClickableSectionItem
      radius="top-bottom"
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={message}
      accessibilityHint={t(MessageBoxTexts.a11yHintActionPrefix) + actionText}
      testID="tripTicketCard"
    >
      <View style={styles.content}>
        <ThemeIcon svg={InvalidFill} color="error" />
        <ThemeText typography="body__m" style={styles.message}>
          {message}
        </ThemeText>
        <View style={styles.action}>
          <ThemeText typography="body__s">{actionText}</ThemeText>
          <ThemeIcon svg={ChevronRight} />
        </View>
      </View>
    </GenericClickableSectionItem>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },
  message: {
    flex: 1,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
}));
