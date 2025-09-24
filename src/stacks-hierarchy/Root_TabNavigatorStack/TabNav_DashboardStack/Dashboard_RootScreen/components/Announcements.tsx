import {Dimensions, StyleProp, View, ViewStyle} from 'react-native';
import {useAnnouncementsContext} from '@atb/modules/announcements';
import {ScrollView} from 'react-native-gesture-handler';
import {AnnouncementSection} from './AnnouncementSection';
import {DashboardTexts, useTranslation} from '@atb/translations';
import {isWithinTimeRange} from '@atb/utils/is-within-time-range';
import {useNow} from '@atb/utils/use-now';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useBeaconsContext} from '@atb/modules/beacons';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useTimeContext} from '@atb/modules/time';
import {useFareContracts} from '@atb/modules/ticketing';
import {ContentHeading} from '@atb/components/heading';
import {useOnboardingSectionIsOnboarded} from '@atb/modules/onboarding';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {findZoneInLocation} from '@atb/utils/use-find-zone-in-location';
import {useDebounce} from '@atb/utils/use-debounce';
import {useMemo} from 'react';

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

  const {serverNow} = useTimeContext();
  const {fareContracts: validFareContracts} = useFareContracts(
    {availability: 'available', status: 'valid'},
    serverNow,
  );
  const hasValidFareContract = validFareContracts.length > 0;

  const styles = useStyle();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const {location} = useGeolocationContext();
  const debouncedLocation = useDebounce(location, 5000) ?? undefined;
  const {carPoolingZones, fareZones, cityZones} =
    useFirestoreConfigurationContext();
  const {carPoolingZone, fareZone, cityZone} = useMemo(() => {
    const carPoolingZone = findZoneInLocation(
      debouncedLocation,
      carPoolingZones,
    );
    const fareZone = findZoneInLocation(debouncedLocation, fareZones);
    const cityZone = findZoneInLocation(debouncedLocation, cityZones);
    return {carPoolingZone, fareZone, cityZone};
  }, [debouncedLocation, carPoolingZones, fareZones, cityZones]);

  const ruleVariables = {
    isBeaconsConsentGranted: isConsentGranted ?? false,
    shareTravelHabitsIsOnboarded,
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
    <View style={[style, styles.container]} testID="announcements">
      <View style={styles.headerWrapper}>
        <ContentHeading
          color={theme.color.background.accent[0]}
          text={t(DashboardTexts.announcements.header)}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        horizontal={showHorizontally}
      >
        {filteredAnnouncements.map((a) => (
          <AnnouncementSection
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
