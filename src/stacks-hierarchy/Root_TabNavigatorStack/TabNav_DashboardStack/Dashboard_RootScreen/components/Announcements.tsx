import {Dimensions, StyleProp, View, ViewStyle} from 'react-native';
import {useAnnouncementsContext} from '@atb/modules/announcements';
import {ScrollView} from 'react-native-gesture-handler';
import {Announcement} from './Announcement';
import {DashboardTexts, useTranslation} from '@atb/translations';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useBeaconsContext} from '@atb/beacons/BeaconsContext';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {ContentHeading} from '@atb/components/heading';
import {useOnboardingSectionIsOnboarded} from '@atb/onboarding';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Announcements = ({style}: Props) => {
  const {findAnnouncements} = useAnnouncementsContext();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const now = useNow(10000);
  const {isConsentGranted} = useBeaconsContext();

  const shareTravelHabitsIsOnboarded =
    useOnboardingSectionIsOnboarded('shareTravelHabits');

  const styles = useStyle();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const ruleVariables = {
    isBeaconsConsentGranted: isConsentGranted ?? false,
    shareTravelHabitsIsOnboarded,
  };

  const filteredAnnouncements = findAnnouncements(ruleVariables).filter((a) =>
    isWithinTimeRange(a, now),
  );

  if (filteredAnnouncements.length === 0) return null;

  const showHorizontally =
    !isScreenReaderEnabled && filteredAnnouncements.length > 1;

  return (
    <View style={[style, styles.container]} testID="announcements">
      <View style={styles.headerWrapper}>
        <ContentHeading
          color={theme.color.background.accent[0]}
          text={t(DashboardTexts.announcemens.header)}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        horizontal={showHorizontally}
      >
        {filteredAnnouncements.map((a) => (
          <Announcement
            key={a.id}
            announcement={a}
            style={showHorizontally && styles.announcement}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
  headerWrapper: {
    marginHorizontal: theme.spacing.medium,
  },
  scrollView: {
    paddingHorizontal: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
  announcement: {
    width: Dimensions.get('window').width * 0.9 - 2 * theme.spacing.medium,
  },
}));
