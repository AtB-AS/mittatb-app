import {
  Announcement,
  useAnnouncementsContext,
  isBottomSheetAnnouncement,
} from '@atb/modules/announcements';
import {ThemeText} from '@atb/components/text';
import {
  DashboardTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Image, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {NativeBorderlessButton} from '@atb/components/native-button';
import {insets} from '@atb/utils/insets';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {animateNextChange} from '@atb/utils/animation';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useActionButtonProps} from './hooks';
import {useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {AnnouncementSheet} from './AnnouncementSheet';

type Props = {
  announcement: Announcement;
  style?: StyleProp<ViewStyle>;
};

export const AnnouncementSection = ({announcement, style}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {language} = useTranslation();
  const {theme} = useThemeContext();
  const analytics = useAnalyticsContext();
  const {dismissAnnouncement} = useAnnouncementsContext();
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  const actionButtonProps = useActionButtonProps(
    announcement,
    announcement.actionButton,
    'Dashboard',
    bottomSheetModalRef,
  );

  const onCloseFocusRef = useRef<View | null>(null);

  const handleDismiss = () => {
    animateNextChange();
    dismissAnnouncement(announcement);
    analytics.logEvent('Dashboard', 'Announcement dismissed', {
      id: announcement.id,
    });
  };

  const summaryTitle = getTextForLanguage(
    announcement.summaryTitle ?? announcement.fullTitle,
    language,
  );

  return (
    <>
      <Section style={style} key={announcement.id} testID="announcement">
        <GenericSectionItem style={styles.sectionItem}>
          <View style={styles.content}>
            {announcement.summaryImage && (
              <View style={styles.imageContainer}>
                <Image
                  height={50}
                  width={50}
                  source={{uri: announcement.summaryImage}}
                />
              </View>
            )}
            <View style={styles.textContainer}>
              <View style={styles.summaryTitle}>
                <ThemeText
                  style={styles.summaryTitleText}
                  typography="body__m__strong"
                >
                  {summaryTitle}
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
              <ThemeText style={styles.summary}>
                {getTextForLanguage(announcement.summary, language)}
              </ThemeText>
            </View>
          </View>
        </GenericSectionItem>
        {actionButtonProps && (
          <LinkSectionItem
            ref={onCloseFocusRef}
            {...actionButtonProps}
            textType="body__s"
            accessibility={{
              accessibilityHint: actionButtonProps.accessibilityHint,
              accessibilityRole: actionButtonProps.accessibilityRole,
            }}
          />
        )}
      </Section>
      {isBottomSheetAnnouncement(announcement) && (
        <AnnouncementSheet
          bottomSheetModalRef={bottomSheetModalRef}
          onCloseFocusRef={onCloseFocusRef}
          announcement={announcement}
        />
      )}
    </>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  sectionItem: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
    padding: -theme.border.radius.regular,
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
