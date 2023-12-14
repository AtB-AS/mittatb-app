import {Linking, StyleProp, View, ViewStyle} from 'react-native';
import {useAnnouncementsState} from '@atb/announcements';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {Announcement} from './Announcement';
import {AnnouncementSheet} from './AnnouncementSheet';
import {SectionHeading} from './SectionHeading';
import {StyleSheet} from '@atb/theme';
import {DashboardTexts, useTranslation} from '@atb/translations';
import {animateNextChange} from '@atb/utils/animation';
import {useAnalytics} from '@atb/analytics';
import {AnnouncementType} from '@atb/announcements/types';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {useHasSeenShareTravelHabitsScreen} from '@atb/beacons/use-has-seen-share-travel-habits-screen';
import Bugsnag from '@bugsnag/react-native';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Announcements = ({style: containerStyle}: Props) => {
  const {findAnnouncements, dismissAnnouncement} = useAnnouncementsState();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const {t} = useTranslation();
  const style = useStyle();
  const analytics = useAnalytics();
  const now = useNow(10000);
  const {kettleInfo} = useBeaconsState();
  const [hasSeenShareTravelHabitsScreen, _] =
    useHasSeenShareTravelHabitsScreen();

  const ruleVariables = {
    isBeaconsOnboarded: kettleInfo?.isBeaconsOnboarded ?? false,
    hasSeenShareTravelHabitsScreen,
  };

  const filteredAnnouncements = findAnnouncements(ruleVariables).filter((a) =>
    isWithinTimeRange(a, now),
  );

  if (filteredAnnouncements.length === 0) return null;

  const handleDismiss = (announcement: AnnouncementType) => {
    animateNextChange();
    dismissAnnouncement(announcement);
    analytics.logEvent('Dashboard', 'Announcement dismissed', {
      id: announcement.id,
    });
  };

  return (
    <View style={containerStyle} testID="announcements">
      <SectionHeading>{t(DashboardTexts.announcemens.header)}</SectionHeading>
      <ScrollView>
        {filteredAnnouncements.map((a, i) => (
          <Section
            key={a.id}
            style={i < filteredAnnouncements.length - 1 && style.announcement}
            testID="announcement"
          >
            <GenericClickableSectionItem
              accessible={false}
              onPress={async () => {
                if (a.openUrl?.link !== undefined) {
                  try {
                    await Linking.openURL(a.openUrl.link);
                  } catch (err: any) {
                    Bugsnag.notify(err);
                  }
                } else {
                  openBottomSheet(() => (
                    <AnnouncementSheet
                      announcement={a}
                      close={closeBottomSheet}
                    />
                  ));
                }
              }}
            >
              <Announcement
                announcement={a}
                onDismiss={() => handleDismiss(a)}
              />
            </GenericClickableSectionItem>
          </Section>
        ))}
      </ScrollView>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  return {
    announcement: {
      marginBottom: theme.spacings.medium,
    },
  };
});
