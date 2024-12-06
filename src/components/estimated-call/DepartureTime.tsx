import {EstimatedCall} from '@atb/api/types/departures';
import {dictionary, useTranslation} from '@atb/translations';
import {ColorValue, View} from 'react-native';
import {ThemeIcon} from '../theme-icon';
import {ThemeText} from '../text';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {Statuses, StyleSheet, useTheme} from '@atb/theme';
import {
  formatLocaleTime,
  formatToClockOrRelativeMinutes,
  secondsBetween,
} from '@atb/utils/date';
import {EstimatedCallWithMetadata} from '@atb/travel-details-screens/use-departure-data.ts';
import {ContrastColor, TextColor} from '@atb/theme/colors.ts';

type DepartureTimeProps = {
  departure: EstimatedCall | EstimatedCallWithMetadata;
  color?: ContrastColor | Statuses | TextColor | ColorValue;
};
export const DepartureTime = ({departure, color}: DepartureTimeProps) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {themeName} = useTheme();

  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {departure.realtime && !departure.cancellation && (
          <ThemeIcon
            style={styles.realtimeIcon}
            svg={themeName == 'dark' ? RealtimeDark : RealtimeLight}
            size="xSmall"
          />
        )}
        <ThemeText
          type={
            departure.cancellation
              ? 'body__primary--strike'
              : 'body__primary--bold'
          }
          color={
            color ? color : departure.cancellation ? 'secondary' : 'primary'
          }
        >
          {formatToClockOrRelativeMinutes(
            departure.expectedDepartureTime,
            language,
            t(dictionary.date.units.now),
          )}
        </ThemeText>
      </View>
      {isMoreThanOneMinuteDelayed(departure) && (
        <ThemeText
          type="body__tertiary--strike"
          color={color ? color : 'secondary'}
          style={styles.aimedTime}
        >
          {formatLocaleTime(departure.aimedDepartureTime, language)}
        </ThemeText>
      )}
    </View>
  );
};

const isMoreThanOneMinuteDelayed = (
  departure: EstimatedCall | EstimatedCallWithMetadata,
) =>
  secondsBetween(
    departure.aimedDepartureTime,
    departure.expectedDepartureTime,
  ) >= 60;

const useStyles = StyleSheet.createThemeHook((theme) => ({
  realtimeIcon: {
    marginRight: theme.spacing.xSmall,
  },
  aimedTime: {textAlign: 'right'},
}));
