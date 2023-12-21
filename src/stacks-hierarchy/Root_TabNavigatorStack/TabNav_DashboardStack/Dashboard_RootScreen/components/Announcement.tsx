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
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {AnnouncementSheet} from './AnnouncementSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {animateNextChange} from '@atb/utils/animation';
import {useAnalytics} from '@atb/analytics';
import {useAnnouncementsState} from '@atb/announcements';
import Bugsnag from '@bugsnag/react-native';

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

  const handleDismiss = () => {
    animateNextChange();
    dismissAnnouncement(announcement);
    analytics.logEvent('Dashboard', 'Announcement dismissed', {
      id: announcement.id,
    });
  };

  return (
    <Section style={style} key={announcement.id} testID="announcement">
      <GenericSectionItem>
        <View style={styles.container}>
          <View style={styles.content} accessible={true}>
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
              <ThemeText style={styles.summary}>
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
            onPress={() => handleDismiss()}
            testID="closeAnnouncement"
          >
            <ThemeIcon svg={Close} />
          </PressableOpacity>
        </View>
      </GenericSectionItem>
      {announcement.actionButton?.actionType &&
        announcement.actionButton?.label && (
          <LinkSectionItem
            text={
              getTextForLanguage(announcement.actionButton.label, language) ??
              ''
            }
            icon={
              announcement.actionButton?.actionType === 'external'
                ? 'external-link'
                : 'arrow-right'
            }
            accessibility={{
              accessibilityHint: t(
                DashboardTexts.announcemens.buttonAction[
                  announcement.actionButton.actionType
                ],
              ),
            }}
            onPress={async () => {
              if (announcement.actionButton?.actionType === 'bottom_sheet') {
                openBottomSheet(() => (
                  <AnnouncementSheet
                    announcement={announcement}
                    close={closeBottomSheet}
                  />
                ));
              } else {
                const actionButtonURL = announcement.actionButton?.url;
                try {
                  actionButtonURL && (await Linking.openURL(actionButtonURL));
                } catch (err: any) {
                  Bugsnag.notify(err);
                }
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
  summary: {
    marginTop: theme.spacings.xSmall,
  },
  close: {
    flexGrow: 0,
  },
}));
