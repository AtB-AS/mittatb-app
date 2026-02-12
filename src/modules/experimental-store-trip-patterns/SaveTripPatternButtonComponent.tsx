import {TripPattern} from '@atb/api/types/trips';
import {useThemeContext} from '@atb/theme';
import {translation as _, useTranslation} from '@atb/translations';
import {useMemo} from 'react';
import {useStoredTripPatterns} from './StoredTripPatternsContext';
import {Button} from '@atb/components/button';
import {Save, SaveFill} from '@atb/assets/svg/mono-icons/actions';
import analytics from '@react-native-firebase/analytics';
import {wrapWithNullComponent} from '../experimental/null-component';

type SaveTripPatternButtonComponentProps = {
  tripPattern: TripPattern;
};

export const SaveTripPatternButtonComponent =
  wrapWithNullComponent<SaveTripPatternButtonComponentProps>(
    ({tripPattern}) => {
      const {addTripPattern, removeTripPattern, isTripPatternStored} =
        useStoredTripPatterns();
      const {t} = useTranslation();
      const {theme} = useThemeContext();
      const isStored = useMemo(() => {
        return isTripPatternStored(tripPattern);
      }, [tripPattern, isTripPatternStored]);

      return (
        <Button
          accessibilityLabel={t(
            SaveTripPatternButtonComponentTexts.removeTrip.a11yLabel,
          )}
          onPress={() => {
            if (isStored) {
              analytics().logEvent('click_trip_remove_button');
              removeTripPattern(tripPattern);
            } else {
              analytics().logEvent('click_trip_save_button');
              addTripPattern(tripPattern);
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
    a11yLabel: _(
      'Aktiver for å lagre reise',
      'Activate to save trip',
      'Aktiver for å lagre reise',
    ),
  },
  removeTrip: {
    text: _('Fjern lagret reise', 'Remove saved trip', 'Fjern lagret reise'),
    a11yLabel: _(
      'Aktiver for å fjern lagret reise',
      'Activate to remove saved trip',
      'Aktiver for å fjern lagret reise',
    ),
  },
};
