import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {IconColor, ThemeIcon, ThemeIconProps} from '@atb/components/theme-icon';
import {GenericClickableSectionItem} from '@atb/components/sections';
import {InvalidFill, ValidFill} from '@atb/assets/svg/mono-icons/ticketing';
import {Info, Warning} from '@atb/assets/svg/mono-icons/status';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {useTranslation} from '@atb/translations';
import MessageBoxTexts from '@atb/translations/components/MessageBox';

export type TripTicketCardMode = 'valid' | 'activate' | 'expired' | 'invalid';

type TripTicketCardProps = {
  mode: TripTicketCardMode;
  /** Replaces the icon of the mode */
  icon?: {svg: ThemeIconProps['svg']; color: IconColor};
  message: string;
  detailText?: string;
  actionText: string;
  onPress: () => void;
};

export const TripTicketCard: React.FC<TripTicketCardProps> = ({
  mode,
  icon,
  message,
  detailText,
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
      accessibilityLabel={[message, detailText].filter(Boolean).join('. ')}
      accessibilityHint={t(MessageBoxTexts.a11yHintActionPrefix) + actionText}
      testID="tripTicketCard"
    >
      <View style={styles.content}>
        {icon ? (
          <ThemeIcon svg={icon.svg} color={icon.color} />
        ) : mode === 'valid' ? (
          <ThemeIcon svg={ValidFill} color="valid" />
        ) : mode === 'activate' ? (
          <ThemeIcon svg={Info} color="info" />
        ) : mode === 'expired' ? (
          <ThemeIcon svg={Warning} color="warning" />
        ) : (
          <ThemeIcon svg={InvalidFill} color="error" />
        )}
        <View style={styles.message}>
          <ThemeText typography="body__m">{message}</ThemeText>
          {detailText && (
            <ThemeText typography="body__s" type="secondary">
              {detailText}
            </ThemeText>
          )}
        </View>
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
