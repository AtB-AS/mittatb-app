import {Dimensions, StyleProp, View, ViewStyle} from 'react-native';
import {useAnnouncementsState} from '@atb/announcements';
import {ScrollView} from 'react-native-gesture-handler';
import {Announcement} from './Announcement';
import {SectionHeading} from './SectionHeading';
import {DashboardTexts, useTranslation} from '@atb/translations';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {StyleSheet} from '@atb/theme';
import {useHasSeenShareTravelHabitsScreen} from '@atb/beacons/use-has-seen-share-travel-habits-screen';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Announcements = ({style: containerStyle}: Props) => {
  const {findAnnouncements} = useAnnouncementsState();
  const {t} = useTranslation();
  const now = useNow(10000);
  const {kettleInfo} = useBeaconsState();
  const [hasSeenShareTravelHabitsScreen, _] =
    useHasSeenShareTravelHabitsScreen();
  const style = useStyle();

  const ruleVariables = {
    isBeaconsOnboarded: kettleInfo?.isBeaconsOnboarded ?? false,
    hasSeenShareTravelHabitsScreen,
  };

  const filteredAnnouncements = findAnnouncements(ruleVariables).filter((a) =>
    isWithinTimeRange(a, now),
  );

  if (filteredAnnouncements.length === 0) return null;

  return (
    <View style={containerStyle} testID="announcements">
      <View style={style.headerWrapper}>
        <SectionHeading>{t(DashboardTexts.announcemens.header)}</SectionHeading>
      </View>
      <ScrollView
        contentContainerStyle={style.scrollView}
        horizontal={filteredAnnouncements.length > 1}
      >
        {filteredAnnouncements.map((a) => (
          <Announcement
            key={a.id}
            announcement={a}
            style={filteredAnnouncements.length > 1 && style.announcement}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  headerWrapper: {
    marginHorizontal: theme.spacings.medium,
  },
  scrollView: {
    marginHorizontal: theme.spacings.medium,
  },
  announcement: {
    width: Dimensions.get('window').width * 0.9 - 2 * theme.spacings.medium,
    marginRight: theme.spacings.medium,
  },
}));
