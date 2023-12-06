import {AnnouncementType} from '@atb/announcements/types';
import {ThemeText} from '@atb/components/text';
import {
  DashboardTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Image, Linking, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {insets} from '@atb/utils/insets';
import {
  GenericClickableSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import Bugsnag from '@bugsnag/react-native';
import {AnnouncementSheet} from './AnnouncementSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {animateNextChange} from '@atb/utils/animation';
import {useAnalytics} from '@atb/analytics';
import {useAnnouncementsState} from '@atb/announcements';

type Props = {
  announcement: AnnouncementType;
  style?: StyleProp<ViewStyle>;
};

export const Announcement = ({announcement, style}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {language} = useTranslation();
  const {theme} = useTheme();
  const analytics = useAnalytics();
  const {dismissAnnouncement} = useAnnouncementsState();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();

  const handleDismiss = (announcement: AnnouncementType) => {
    animateNextChange();
    dismissAnnouncement(announcement);
    analytics.logEvent('Dashboard', 'Announcement dismissed', {
      id: announcement.id,
    });
  };

  const isOpenUrlEnabled = announcement.openUrl?.link !== undefined;
  const openUrlLink = announcement.openUrl?.link;

  return (
    <Section style={style} key={announcement.id} testID="announcement">
      <GenericClickableSectionItem
        accessible={false}
        disabled={isOpenUrlEnabled}
        onPress={async () => {
          openBottomSheet(() => (
            <AnnouncementSheet
              announcement={announcement}
              close={closeBottomSheet}
            />
          ));
        }}
      >
        <View style={styles.container}>
          <View
            style={styles.content}
            accessible={true}
            accessibilityRole={!isOpenUrlEnabled ? 'button' : undefined}
            accessibilityHint={
              !isOpenUrlEnabled
                ? t(DashboardTexts.announcemens.button.accessibility)
                : undefined
            }
          >
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
          <PressableOpacity
            style={styles.close}
            role="button"
            hitSlop={insets.all(theme.spacings.medium)}
            accessibilityHint={t(
              DashboardTexts.announcemens.announcement.closeA11yHint,
            )}
            onPress={() => handleDismiss(announcement)}
            testID="closeAnnouncement"
          >
            <ThemeIcon svg={Close} />
          </PressableOpacity>
        </View>
      </GenericClickableSectionItem>
      {announcement.openUrl && (
        <LinkSectionItem
          text={getTextForLanguage(announcement.openUrl.title, language) ?? ''}
          icon={
            announcement.openUrl.linkType === 'external'
              ? 'external-link'
              : 'arrow-right'
          }
          accessibility={{
            accessibilityHint: t(
              DashboardTexts.announcemens.openUrl[
                announcement.openUrl.linkType
              ],
            ),
          }}
          onPress={async () => {
            try {
              openUrlLink && (await Linking.openURL(openUrlLink));
            } catch (err: any) {
              Bugsnag.notify(err);
            }
          }}
        />
      )}
    </Section>
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
