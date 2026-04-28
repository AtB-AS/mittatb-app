import {ThemeText} from '@atb/components/text';
import {DashboardTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {NativeBorderlessButton} from '@atb/components/native-button';
import {insets} from '@atb/utils/insets';
import {JSX} from 'react';

type Props = {
  title: string | undefined;
  summary: string | undefined;
  image?: JSX.Element;
  handleDismiss: () => void;
};

export const EndManualTripCard = ({
  title,
  summary,
  image,
  handleDismiss,
}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  return (
    <View style={styles.content}>
      {image && <View style={styles.imageContainer}>{image}</View>}
      <View style={styles.textContainer}>
        <View style={styles.summaryTitle}>
          <ThemeText
            style={styles.summaryTitleText}
            typography="body__m__strong"
          >
            {title}
          </ThemeText>
          <NativeBorderlessButton
            style={styles.close}
            role="button"
            hitSlop={insets.all(theme.spacing.medium)}
            accessibilityHint={t(
              DashboardTexts.announcements.announcement.closeA11yHint,
            )}
            onPress={() => handleDismiss()}
            testID="closeAnnouncement"
          >
            <ThemeIcon svg={Close} />
          </NativeBorderlessButton>
        </View>
        <ThemeText style={styles.summary}>{summary}</ThemeText>
      </View>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  content: {
    flex: 1,
    padding: theme.spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.regular,
  },
  imageContainer: {
    marginRight: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
    padding: theme.border.radius.regular,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
  },
  summaryTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTitleText: {
    flexShrink: 1,
  },
  summary: {
    marginTop: theme.spacing.xSmall,
  },
  close: {
    flexGrow: 0,
  },
}));
