import {StyleProp, View, ViewStyle} from 'react-native';
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

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Announcements = ({style: containerStyle}: Props) => {
  const {announcements, dismissAnnouncement} = useAnnouncementsState();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();
  const {t} = useTranslation();
  const style = useStyle();
  const analytics = useAnalytics();
  const now = useNow(10000);

  const filteredAnnouncements = announcements.filter((a) =>
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
              onPress={() =>
                openBottomSheet(() => (
                  <AnnouncementSheet
                    announcement={a}
                    close={closeBottomSheet}
                  />
                ))
              }
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
