import React from 'react';
import {AnnouncementType} from '@atb/announcements/types';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {Image, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  announcement: AnnouncementType;
  close: () => void;
};

export const AnnouncementSheet = ({announcement, close}: Props) => {
  const {language} = useTranslation();
  const style = useStyle();

  return (
    <BottomSheetContainer
      title={getTextForLanguage(announcement.fullTitle, language)}
      close={close}
    >
      <ScrollView style={style.container}>
        {announcement.mainImage && (
          <View style={style.imageContainer}>
            <Image
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
              source={{uri: announcement.mainImage}}
            />
          </View>
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
      paddingHorizontal: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
      minHeight: 350,
    },
    imageContainer: {
      width: '100%',
      maxHeight: 150,
      marginBottom: theme.spacings.medium,
      borderRadius: theme.border.radius.regular,
      overflow: 'hidden',
    },
  };
});
