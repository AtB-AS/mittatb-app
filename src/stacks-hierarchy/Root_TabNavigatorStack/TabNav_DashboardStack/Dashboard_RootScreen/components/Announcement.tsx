import {AnnouncementType} from '@atb/announcements/types';
import {ThemeText} from '@atb/components/text';
import {
  DashboardTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Image, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {iconSizes} from '@atb-as/theme/lib/sizes';

type Props = {
  announcement: AnnouncementType;
  onDismiss: (announcement: AnnouncementType) => void;
};

export const Announcement = ({announcement, onDismiss}: Props) => {
  const closeIconSize = 'normal';
  const style = useStyle(closeIconSize)();
  const {t} = useTranslation();
  const {language} = useTranslation();

  return (
    <View style={style.container}>
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
        <ThemeText style={style.title} type="body__primary--bold">
          {getTextForLanguage(
            announcement.summaryTitle ?? announcement.fullTitle,
            language,
          )}
        </ThemeText>
        <ThemeText>
          {getTextForLanguage(announcement.summary, language)}
        </ThemeText>
      </View>
      <PressableOpacity
        style={style.close}
        role="button"
        hitSlop={12}
        accessibilityHint={t(
          DashboardTexts.announcemens.announcement.closeA11yHint,
        )}
        onPress={() => onDismiss(announcement)}
      >
        <ThemeIcon size={closeIconSize} svg={Close} />
      </PressableOpacity>
    </View>
  );
};

const useStyle = (closeIconSize: keyof typeof iconSizes) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
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
    title: {
      marginRight: theme.spacings.medium + theme.icon.size[closeIconSize],
    },
    close: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  }));
