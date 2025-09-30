import {
  ActionType,
  Announcement,
  BottomSheetAnnouncement,
  LinkAnnouncement,
  useAnnouncementsContext,
} from '@atb/modules/announcements';
import {useCallback} from 'react';
import {ThemeText} from '@atb/components/text';
import {
  DashboardTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {Image, Linking, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
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
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {animateNextChange} from '@atb/utils/animation';
import {useAnalyticsContext} from '@atb/modules/analytics';
import Bugsnag from '@bugsnag/react-native';
import {RefObject, useRef} from 'react';
import {ArrowRight, ExternalLink} from '@atb/assets/svg/mono-icons/navigation';

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

  const handleDismiss = () => {
    animateNextChange();
    dismissAnnouncement(announcement);
    analytics.logEvent('Dashboard', 'Announcement dismissed', {
      id: announcement.id,
    });
  };

  const {title, body, image} = announcement.card;

  return (
    <Section style={style} key={announcement.id} testID="announcement">
      <GenericSectionItem style={styles.sectionItem}>
        <View style={styles.content}>
          {image && (
            <View style={styles.imageContainer}>
              <Image height={50} width={50} source={{uri: image}} />
            </View>
          )}
          <View style={styles.textContainer}>
            <View style={styles.summaryTitle}>
              <ThemeText
                style={styles.summaryTitleText}
                typography="body__primary--bold"
              >
                {getTextForLanguage(title, language)}
              </ThemeText>
              <PressableOpacity
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
              </PressableOpacity>
            </View>
            <ThemeText style={styles.summary}>
              {getTextForLanguage(body, language)}
            </ThemeText>
          </View>
        </View>
      </GenericSectionItem>
      {announcement.cardActionType && (
        <AnnouncementActionButton announcement={announcement} />
      )}
    </Section>
  );
};

function AnnouncementActionButton({
  announcement,
}: {
  announcement: BottomSheetAnnouncement | LinkAnnouncement;
}) {
  const {t} = useTranslation();
  const {language} = useTranslation();
  const analytics = useAnalyticsContext();
  const {open: openBottomSheet} = useBottomSheetContext();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const {cardActionType} = announcement;

  const summaryTitle = getTextForLanguage(announcement.card.title, language);

  const buttonText =
    getTextForLanguage(announcement.cardActionButton.label, language) ??
    t(DashboardTexts.announcements.buttonAction.defaultLabel(summaryTitle));

  const accessibilityHint = t(
    DashboardTexts.announcements.buttonAction.a11yHint[cardActionType],
  );

  const logPress = useCallback(() => {
    analytics.logEvent('Dashboard', 'Announcement pressed', {
      id: announcement.id,
    });
  }, [analytics, announcement.id]);

  if (cardActionType === ActionType.bottom_sheet) {
    return (
      <LinkSectionItem
        text={buttonText}
        textType="body__secondary"
        rightIcon={{svg: ArrowRight}}
        accessibility={{
          accessibilityHint,
          accessibilityRole: 'button',
        }}
        ref={onCloseFocusRef}
        onPress={async () => {
          logPress();

          openBottomSheet(
            () => (
              <AnnouncementSheet
                announcementId={announcement.id}
                content={announcement.bottomSheet}
              />
            ),
            onCloseFocusRef,
          );
        }}
      />
    );
  }

  if (
    cardActionType === ActionType.external ||
    cardActionType === ActionType.deeplink
  ) {
    return (
      <LinkSectionItem
        text={buttonText}
        textType="body__secondary"
        rightIcon={
          cardActionType === ActionType.external
            ? {svg: ExternalLink}
            : {svg: ArrowRight}
        }
        accessibility={{
          accessibilityHint,
          accessibilityRole: 'link',
        }}
        onPress={async () => {
          logPress();

          const actionButtonURL = announcement.cardActionButton.url;
          try {
            actionButtonURL && (await Linking.openURL(actionButtonURL));
          } catch (err: any) {
            Bugsnag.notify(err);
          }
        }}
      />
    );
  }
}

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
