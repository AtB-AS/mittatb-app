import React from 'react';
import {BottomSheetAnnouncement} from '@atb/modules/announcements';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  DashboardTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Image, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  InAppReviewContext,
  useInAppReviewFlow,
} from '@atb/utils/use-in-app-review';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {useActionButtonProps} from './hooks';

type Props = {
  announcement: BottomSheetAnnouncement;
};

export const AnnouncementSheet = ({announcement}: Props) => {
  const {language, t} = useTranslation();
  const style = useStyle();
  const {requestReview} = useInAppReviewFlow();

  const primaryButtonProps = useActionButtonProps(
    announcement,
    announcement.actionButton.sheetPrimaryButton,
    'AnnouncementSheet',
  );

  return (
    <BottomSheetContainer
      title={t(DashboardTexts.announcements.header)}
      onClose={() => {
        requestReview(InAppReviewContext.Announcement);
      }}
    >
      <ScrollView contentContainerStyle={style.container}>
        {announcement.mainImage && (
          <View style={style.imageContainer}>
            <Image
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
              source={{uri: announcement.mainImage}}
            />
          </View>
        )}
        <Section>
          <GenericSectionItem type="spacious" style={style.articleContainer}>
            <ThemeText typography="heading--big">
              {getTextForLanguage(announcement.fullTitle, language)}
            </ThemeText>
            <ThemeText isMarkdown={true}>
              {getTextForLanguage(announcement.body, language)}
            </ThemeText>
          </GenericSectionItem>
        </Section>
        {primaryButtonProps && (
          <Button expanded={true} mode="primary" {...primaryButtonProps} />
        )}
      </ScrollView>
    </BottomSheetContainer>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom: bottomSafeAreaInset} = useSafeAreaInsets();
  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      minHeight: 350,
      gap: theme.spacing.medium,
      paddingBottom: bottomSafeAreaInset + theme.spacing.medium,
    },
    articleContainer: {
      gap: theme.spacing.medium,
    },
    imageContainer: {
      width: '100%',
      maxHeight: 150,
      borderRadius: theme.border.radius.regular,
      overflow: 'hidden',
    },
  };
});
