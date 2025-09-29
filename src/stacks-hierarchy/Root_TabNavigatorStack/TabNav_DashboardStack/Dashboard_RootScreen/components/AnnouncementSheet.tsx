import React, {useCallback} from 'react';
import {ActionType, BottomSheetAnnouncement} from '@atb/modules/announcements';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  DashboardTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Image, Linking, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  InAppReviewContext,
  useInAppReviewFlow,
} from '@atb/utils/use-in-app-review';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {useAnalyticsContext} from '@atb/modules/analytics';
import Bugsnag from '@bugsnag/react-native';
import {ArrowRight, ExternalLink} from '@atb/assets/svg/mono-icons/navigation';

type Props = {
  announcement: BottomSheetAnnouncement;
};

export const AnnouncementSheet = ({announcement}: Props) => {
  const {language} = useTranslation();
  const style = useStyle();
  const {requestReview} = useInAppReviewFlow();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  const sheetActionButton = announcement.actionButton.sheetActionButton;

  const summaryTitle = getTextForLanguage(
    announcement.summaryTitle ?? announcement.fullTitle,
    language,
  );

  const logPress = useCallback(() => {
    analytics.logEvent('AnnouncementSheet', 'Sheet action button pressed', {
      id: announcement.id,
    });
  }, [analytics, announcement.id]);

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
        {sheetActionButton && (
          <Button
            expanded={true}
            rightIcon={
              sheetActionButton.actionType === ActionType.external
                ? {svg: ExternalLink}
                : {svg: ArrowRight}
            }
            mode="primary"
            text={
              getTextForLanguage(sheetActionButton.label, language) ??
              t(
                DashboardTexts.announcements.buttonAction.defaultLabel(
                  summaryTitle,
                ),
              )
            }
            accessibilityHint={t(
              DashboardTexts.announcements.buttonAction.a11yHint[
                sheetActionButton.actionType
              ],
            )}
            accessibilityRole="link"
            onPress={async () => {
              logPress();

              const actionButtonURL = sheetActionButton.url;
              try {
                actionButtonURL && (await Linking.openURL(actionButtonURL));
              } catch (err: any) {
                Bugsnag.notify(err);
              }
            }}
          />
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
