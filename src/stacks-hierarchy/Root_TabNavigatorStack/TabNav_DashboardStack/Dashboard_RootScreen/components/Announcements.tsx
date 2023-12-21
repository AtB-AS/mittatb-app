import {StyleProp, View, ViewStyle} from 'react-native';
import {useAnnouncementsState} from '@atb/announcements';
import {ScrollView} from 'react-native-gesture-handler';
import {Announcement} from './Announcement';
import {SectionHeading} from './SectionHeading';
import {DashboardTexts, useTranslation} from '@atb/translations';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {StyleSheet} from '@atb/theme';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';
import {useAppState} from '@atb/AppContext';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Announcements = ({style: containerStyle}: Props) => {
  const {findAnnouncements} = useAnnouncementsState();
  const {t} = useTranslation();
  const now = useNow(10000);
  const {kettleInfo} = useBeaconsState();

  const {shareTravelHabitsOnboarded} = useAppState();
  const style = useStyle();

  const ruleVariables = {
    isBeaconsOnboarded: kettleInfo?.isBeaconsOnboarded ?? false,
    shareTravelHabitsOnboarded,
  };

  const filteredAnnouncements = findAnnouncements(ruleVariables).filter((a) =>
    isWithinTimeRange(a, now),
  );

  if (filteredAnnouncements.length === 0) return null;

  return (
    <View style={containerStyle} testID="announcements">
      <SectionHeading>{t(DashboardTexts.announcemens.header)}</SectionHeading>
      <ScrollView>
        {filteredAnnouncements.map((a, i) => (
          <Announcement
            announcement={a}
            style={i < filteredAnnouncements.length - 1 && style.announcement}
          />
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
