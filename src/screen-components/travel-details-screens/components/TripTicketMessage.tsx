import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {NativeBlockButton} from '@atb/components/native-button';
import {InvalidFill} from '@atb/assets/svg/mono-icons/ticketing';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {useTranslation} from '@atb/translations';
import MessageBoxTexts from '@atb/translations/components/MessageBox';

type TripTicketMessageProps = {
  message: string;
  actionText: string;
  onPress: () => void;
};

export const TripTicketMessage: React.FC<TripTicketMessageProps> = ({
  message,
  actionText,
  onPress,
}) => {
  const styles = useStyle();
  const {t} = useTranslation();

  return (
    <NativeBlockButton
      style={styles.container}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={message}
      accessibilityHint={t(MessageBoxTexts.a11yHintActionPrefix) + actionText}
      testID="tripTicketMessage"
    >
      <ThemeIcon svg={InvalidFill} color="error" />
      <ThemeText typography="body__m" style={styles.message}>
        {message}
      </ThemeText>
      <View style={styles.action}>
        <ThemeText typography="body__s">{actionText}</ThemeText>
        <ThemeIcon svg={ChevronRight} />
      </View>
    </NativeBlockButton>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacing.medium,
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
