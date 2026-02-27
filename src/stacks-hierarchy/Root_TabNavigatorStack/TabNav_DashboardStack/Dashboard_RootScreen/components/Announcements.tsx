import {Dimensions, StyleProp, View, ViewStyle} from 'react-native';
import {useAnnouncementsContext} from '@atb/modules/announcements';
import {ScrollView} from 'react-native-gesture-handler';
import {AnnouncementSection} from './AnnouncementSection';
import {DashboardTexts, useTranslation} from '@atb/translations';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {StyleSheet} from '@atb/theme';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useTimeContext} from '@atb/modules/time';
import {useFareContracts} from '@atb/modules/ticketing';
import {ContentHeading} from '@atb/components/heading';
import {useStableLocation} from '@atb/modules/geolocation';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {findZoneInLocation} from '@atb/utils/use-find-zone-in-location';
import {useMemo} from 'react';
import Animated, {LinearTransition} from 'react-native-reanimated';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const Announcements = ({style}: Props) => {
  const {findAnnouncements} = useAnnouncementsContext();
  const {t} = useTranslation();
  const now = useNow(10000);

  const {serverNow} = useTimeContext();
  const {fareContracts: validFareContracts} = useFareContracts(
    {availability: 'available', status: 'valid'},
    serverNow,
  );
  const hasValidFareContract = validFareContracts.length > 0;

  const styles = useStyle();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const {fareZone, cityZone, carPoolingZone} = useZones();

  const ruleVariables = {
    hasValidFareContract,
    fareZoneId: fareZone?.id ?? null,
    cityZoneId: cityZone?.id ?? null,
    carPoolingZoneId: carPoolingZone?.id ?? null,
  };

  const filteredAnnouncements = findAnnouncements(ruleVariables).filter((a) =>
    isWithinTimeRange(
      {startDate: a.startDate?.valueOf(), endDate: a.endDate?.valueOf()},
      now,
    ),
  );

  if (filteredAnnouncements.length === 0) return null;

  const showHorizontally =
    !isScreenReaderEnabled && filteredAnnouncements.length > 1;

  return (
    <Animated.View
      style={[style, styles.container]}
      testID="announcements"
      layout={LinearTransition}
    >
      <View style={styles.headerWrapper}>
        <ContentHeading text={t(DashboardTexts.announcements.header)} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        horizontal={showHorizontally}
        showsHorizontalScrollIndicator={false}
      >
        {filteredAnnouncements.map((a) => (
          <AnnouncementSection
            key={a.id}
            announcement={a}
            style={showHorizontally && styles.announcement}
          />
        ))}
      </ScrollView>
    </Animated.View>
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

const useZones = () => {
  const location = useStableLocation();

  const {carPoolingZones, fareZones, cityZones} =
    useFirestoreConfigurationContext();

  const {carPoolingZone, fareZone, cityZone} = useMemo(() => {
    const carPoolingZone = findZoneInLocation(location, carPoolingZones);
    const fareZone = findZoneInLocation(location, fareZones);
    const cityZone = findZoneInLocation(location, cityZones);
    return {carPoolingZone, fareZone, cityZone};
  }, [location, carPoolingZones, fareZones, cityZones]);

  return {carPoolingZone, fareZone, cityZone};
};
