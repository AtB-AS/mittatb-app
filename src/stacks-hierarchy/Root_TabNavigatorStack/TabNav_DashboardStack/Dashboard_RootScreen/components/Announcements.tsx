import {Dimensions, StyleProp, View, ViewStyle} from 'react-native';
import {useAnnouncementsState} from '@atb/announcements';
import {ScrollView} from 'react-native-gesture-handler';
import {Announcement} from './Announcement';
import {DashboardTexts, useTranslation} from '@atb/translations';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {StyleSheet} from '@atb/theme';
import {useHasSeenShareTravelHabitsScreen} from '@atb/beacons/use-has-seen-share-travel-habits-screen';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';
import {ContentHeading} from '@atb/components/content-heading';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Announcements = ({style}: Props) => {
  const {findAnnouncements} = useAnnouncementsState();
  const {t} = useTranslation();
  const now = useNow(10000);
  const {kettleInfo} = useBeaconsState();
  const [hasSeenShareTravelHabitsScreen, _] =
    useHasSeenShareTravelHabitsScreen();
  const styles = useStyle();

  const ruleVariables = {
    isBeaconsOnboarded: kettleInfo?.isBeaconsOnboarded ?? false,
    hasSeenShareTravelHabitsScreen,
  };

  const filteredAnnouncements = findAnnouncements(ruleVariables).filter((a) =>
    isWithinTimeRange(a, now),
  );

  if (filteredAnnouncements.length === 0) return null;

  return (
    <View style={[style, styles.container]} testID="announcements">
      <View style={styles.headerWrapper}>
        <ContentHeading
          color="background_accent_0"
          text={t(DashboardTexts.announcemens.header)}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        horizontal={filteredAnnouncements.length > 1}
      >
        {filteredAnnouncements.map((a) => (
          <Announcement
            key={a.id}
            announcement={a}
            style={filteredAnnouncements.length > 1 && styles.announcement}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacings.small,
  },
  headerWrapper: {
    marginHorizontal: theme.spacings.medium,
  },
  scrollView: {
    paddingHorizontal: theme.spacings.medium,
    columnGap: theme.spacings.medium,
  },
  announcement: {
    width: Dimensions.get('window').width * 0.9 - 2 * theme.spacings.medium,
  },
}));
