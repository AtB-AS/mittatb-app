import React from 'react';
import {BottomSheetAnnouncement} from '@atb/modules/announcements';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  DashboardTexts,
  dictionary,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Image, View} from 'react-native';
import {
  InAppReviewContext,
  useInAppReviewFlow,
} from '@atb/utils/use-in-app-review';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {useActionButtonProps} from './hooks';
import {BottomSheetModal} from '@atb/components/bottom-sheet-v2';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {giveFocus} from '@atb/utils/use-focus-on-load';

type Props = {
  announcement: BottomSheetAnnouncement;
  bottomSheetModalRef: React.RefObject<any>;
  onCloseFocusRef: React.RefObject<View | null>;
};

export const AnnouncementSheet = ({
  announcement,
  bottomSheetModalRef,
  onCloseFocusRef,
}: Props) => {
  const {language, t} = useTranslation();
  const style = useStyle();
  const {requestReview} = useInAppReviewFlow();

  const primaryButtonProps = useActionButtonProps(
    announcement,
    announcement.actionButton.sheetPrimaryButton,
    'AnnouncementSheet',
    bottomSheetModalRef,
  );

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(DashboardTexts.announcements.header)}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      closeCallback={() => {
        requestReview(InAppReviewContext.Announcement);
        giveFocus(onCloseFocusRef);
      }}
    >
      <View style={style.container}>
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
            <ThemeText typography="heading__xl">
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
      </View>
    </BottomSheetModal>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      minHeight: 350,
      gap: theme.spacing.medium,
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
