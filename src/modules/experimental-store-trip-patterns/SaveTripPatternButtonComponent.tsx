import {TripPattern} from '@atb/api/types/trips';
import {useThemeContext} from '@atb/theme';
import {translation as _, useTranslation} from '@atb/translations';
import {useMemo} from 'react';
import {useStoredTripPatterns} from './StoredTripPatternsContext';
import {Button} from '@atb/components/button';
import {Save, SaveFill} from '@atb/assets/svg/mono-icons/actions';
import analytics from '@react-native-firebase/analytics';
import {wrapWithExperimentalFeatureToggledComponent} from '@atb/modules/experimental';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {getTripPatternAnalytics} from '@atb/screen-components/travel-details-screens';
import {AccessibilityInfo} from 'react-native';

type SaveTripPatternButtonComponentProps = {
  tripPattern: TripPattern;
  now: number;
};

export const SaveTripPatternButtonComponent =
  wrapWithExperimentalFeatureToggledComponent<SaveTripPatternButtonComponentProps>(
    'render-nothing-if-disabled',
    ({tripPattern, now}) => {
      const {
        addTripPattern,
        removeTripPattern,
        isTripPatternStored,
        canAddTripPattern,
      } = useStoredTripPatterns();
      const {t} = useTranslation();
      const {theme} = useThemeContext();
      const posthogAnalytics = useAnalyticsContext();
      const {fareZones} = useFirestoreConfigurationContext();

      const canAdd = useMemo(() => {
        return canAddTripPattern(tripPattern);
      }, [tripPattern, canAddTripPattern]);

      const isStored = useMemo(() => {
        if (!canAdd) {
          return false;
        }

        return isTripPatternStored(tripPattern);
      }, [tripPattern, isTripPatternStored, canAdd]);

      if (!canAdd) {
        return null;
      }

      return (
        <Button
          accessibilityHint={
            isStored
              ? t(SaveTripPatternButtonComponentTexts.removeTrip.a11yHint)
              : t(SaveTripPatternButtonComponentTexts.saveTrip.a11yHint)
          }
          onPress={() => {
            if (isStored) {
              analytics().logEvent('click_trip_remove_button');
              posthogAnalytics.logEvent(
                'Trip details',
                'Trip removed',
                getTripPatternAnalytics(tripPattern, fareZones, now),
              );
              removeTripPattern(tripPattern);
              setTimeout(
                () =>
                  AccessibilityInfo.announceForAccessibility(
                    t(
                      SaveTripPatternButtonComponentTexts.removeTrip
                        .a11yAnnouncement,
                    ),
                  ),
                100,
              );
            } else {
              analytics().logEvent('click_trip_save_button');
              posthogAnalytics.logEvent(
                'Trip details',
                'Trip saved',
                getTripPatternAnalytics(tripPattern, fareZones, now),
              );
              addTripPattern(tripPattern);
              setTimeout(
                () =>
                  AccessibilityInfo.announceForAccessibility(
                    t(
                      SaveTripPatternButtonComponentTexts.saveTrip
                        .a11yAnnouncement,
                    ),
                  ),
                100,
              );
            }
          }}
          text={
            isStored
              ? t(SaveTripPatternButtonComponentTexts.removeTrip.text)
              : t(SaveTripPatternButtonComponentTexts.saveTrip.text)
          }
          leftIcon={isStored ? {svg: SaveFill} : {svg: Save}}
          expanded={true}
          accessibilityRole="button"
          accessible={true}
          mode="secondary"
          backgroundColor={
            isStored
              ? theme.color.interactive[0].active
              : theme.color.background.neutral[0]
          }
        />
      );
    },
  );

const SaveTripPatternButtonComponentTexts = {
  saveTrip: {
    text: _('Lagre reise', 'Save trip', 'Lagre reise'),
    a11yHint: _(
      'Reise er ikke lagret. Aktivér for å lagre reise',
      'Trip is not saved. Activate to save trip',
      'Reise er ikke lagret. Aktivér for å lagre reise',
    ),
    a11yAnnouncement: _(
      'Reise lagret. Aktivér igjen for å fjern lagret reise',
      'Trip saved. Activate again to remove saved trip',
      'Reise lagret. Aktivér igjen for å fjern lagret reise',
    ),
  },
  removeTrip: {
    text: _('Fjern lagret reise', 'Remove saved trip', 'Fjern lagret reise'),
    a11yHint: _(
      'Reise er lagret. Aktivér for å fjern lagret reise',
      'Activate to remove saved trip',
      'Reise er lagret. Aktivér for å fjern lagret reise',
    ),
    a11yAnnouncement: _(
      'Reise fjernet. Aktivér igjen for å lagre reise',
      'Trip removed. Activate again to save trip',
      'Reise fjernet. Aktivér igjen for å lagre reise',
    ),
  },
};
