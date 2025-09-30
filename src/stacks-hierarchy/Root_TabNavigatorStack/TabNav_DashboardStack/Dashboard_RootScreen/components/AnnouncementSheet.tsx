import React, {useCallback} from 'react';
import {
  ActionType,
  BottomSheetAnnouncementContent,
} from '@atb/modules/announcements';
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
  announcementId: string;
  content: BottomSheetAnnouncementContent;
};

export const AnnouncementSheet = ({announcementId, content}: Props) => {
  const {language} = useTranslation();
  const style = useStyle();
  const {requestReview} = useInAppReviewFlow();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  const {title, body, image, primaryButton} = content;

  const logPress = useCallback(() => {
    analytics.logEvent('AnnouncementSheet', 'Sheet action button pressed', {
      id: announcementId,
    });
  }, [analytics, announcementId]);

  return (
    <BottomSheetContainer
      title={t(DashboardTexts.announcements.header)}
      onClose={() => {
        requestReview(InAppReviewContext.Announcement);
      }}
    >
      <ScrollView contentContainerStyle={style.container}>
        {content.image && (
          <View style={style.imageContainer}>
            <Image
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
              source={{uri: image}}
            />
          </View>
        )}
        <Section>
          <GenericSectionItem type="spacious" style={style.articleContainer}>
            <ThemeText typography="heading--big">
              {getTextForLanguage(title, language)}
            </ThemeText>
            <ThemeText isMarkdown={true}>
              {getTextForLanguage(body, language)}
            </ThemeText>
          </GenericSectionItem>
        </Section>
        {primaryButton && (
          <Button
            expanded={true}
            rightIcon={
              primaryButton.actionType === ActionType.external
                ? {svg: ExternalLink}
                : {svg: ArrowRight}
            }
            mode="primary"
            text={
              getTextForLanguage(primaryButton.label, language) ??
              t(
                DashboardTexts.announcements.buttonAction.defaultLabel(
                  getTextForLanguage(title, language),
                ),
              )
            }
            accessibilityHint={t(
              DashboardTexts.announcements.buttonAction.a11yHint[
                primaryButton.actionType
              ],
            )}
            accessibilityRole="link"
            onPress={async () => {
              logPress();

              const actionButtonURL = primaryButton.url;
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
