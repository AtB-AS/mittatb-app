import {AnnouncementType} from '@atb/announcements/types';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  ScreenHeaderTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  announcement: AnnouncementType;
  close: () => void;
};

export const AnnouncementSheet = ({announcement, close}: Props) => {
  const {t, language} = useTranslation();
  const style = useStyle();

  return (
    <BottomSheetContainer maxHeightValue={0.8}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={getTextForLanguage(announcement.fullTitle, language)}
        color={'background_1'}
        setFocusOnLoad={false}
      />
      <ScrollView style={style.container}>
        {announcement.mainImage && (
          <Image source={{uri: announcement.mainImage}} />
        )}
        <ThemeText isMarkdown={true}>
          {getTextForLanguage(announcement.body, language)}
        </ThemeText>
      </ScrollView>
    </BottomSheetContainer>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      padding: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
      minHeight: '50%',
    },
  };
});
