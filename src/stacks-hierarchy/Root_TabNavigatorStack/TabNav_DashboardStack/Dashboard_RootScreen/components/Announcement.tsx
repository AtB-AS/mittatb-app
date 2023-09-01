import {AnnouncementType} from '@atb/announcements/types';
import {ThemeText} from '@atb/components/text';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {Image, View} from 'react-native';
import {StyleSheet} from '@atb/theme';

type Props = {
  announcement: AnnouncementType;
};

export const Announcement = ({announcement}: Props) => {
  const style = useStyle();
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
      <View>
        <ThemeText type="body__primary--bold">
          {getTextForLanguage(
            announcement.summaryTitle ?? announcement.fullTitle,
            language,
          )}
        </ThemeText>
        <ThemeText>
          {getTextForLanguage(announcement.summary, language)}
        </ThemeText>
      </View>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
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
}));
