import {AnnouncementType} from '@atb/announcements/types';
import {ThemeText} from '@atb/components/text';
import {
  DashboardTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Image, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {insets} from '@atb/utils/insets';

type Props = {
  announcement: AnnouncementType;
  onDismiss: (announcement: AnnouncementType) => void;
};

export const Announcement = ({announcement, onDismiss}: Props) => {
  const style = useStyle();
  const {t} = useTranslation();
  const {language} = useTranslation();
  const {theme} = useTheme();

  return (
    <View style={style.container}>
      <View
        style={style.content}
        accessible={true}
        accessibilityRole="button"
        accessibilityHint={t(DashboardTexts.announcemens.button.accessibility)}
      >
        {announcement.summaryImage && (
          <View style={style.imageContainer}>
            <Image
              height={50}
              width={50}
              source={{uri: announcement.summaryImage}}
            />
          </View>
        )}
        <View style={style.textContainer}>
          <ThemeText type="body__primary--bold">
            {getTextForLanguage(
              announcement.summaryTitle ?? announcement.fullTitle,
              language,
            )}
          </ThemeText>
          <ThemeText isMarkdown={true}>
            {getTextForLanguage(announcement.summary, language)}
          </ThemeText>
          {announcement.openUrl?.title && (
            <ThemeText type="body__primary--underline" style={style.spacing}>
              {getTextForLanguage(announcement.openUrl.title, language)}
            </ThemeText>
          )}
        </View>
      </View>
      <PressableOpacity
        style={style.close}
        role="button"
        hitSlop={insets.all(theme.spacings.medium)}
        accessibilityHint={t(
          DashboardTexts.announcemens.announcement.closeA11yHint,
        )}
        onPress={() => onDismiss(announcement)}
        testID="closeAnnouncement"
      >
        <ThemeIcon svg={Close} />
      </PressableOpacity>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    padding: -theme.border.radius.regular,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
  },
  spacing: {
    marginTop: theme.spacings.medium,
  },
  close: {
    flexGrow: 0,
  },
}));
