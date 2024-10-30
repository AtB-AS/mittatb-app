import {EstimatedCall} from '@atb/api/types/departures';
import {dictionary, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeIcon} from '../theme-icon';
import {ThemeText} from '../text';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  formatLocaleTime,
  formatToClockOrRelativeMinutes,
  secondsBetween,
} from '@atb/utils/date';

type DepartureTimeProps = {
  departure: EstimatedCall;
};
export const DepartureTime = ({departure}: DepartureTimeProps) => {
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
          color={departure.cancellation ? 'secondary' : 'primary'}
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
          color="secondary"
          style={styles.aimedTime}
        >
          {formatLocaleTime(departure.aimedDepartureTime, language)}
        </ThemeText>
      )}
    </View>
  );
};

const isMoreThanOneMinuteDelayed = (departure: EstimatedCall) =>
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
