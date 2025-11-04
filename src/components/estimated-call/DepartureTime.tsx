import {EstimatedCall} from '@atb/api/types/departures';
import {dictionary, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeIcon} from '../theme-icon';
import {ThemeText} from '../text';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  formatLocaleTime,
  formatToClockOrRelativeMinutes,
  secondsBetween,
} from '@atb/utils/date';
import {ContrastColor} from '@atb-as/theme';
import {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';

type DepartureTimeProps = {
  color?: ContrastColor;
  departure: EstimatedCall | EstimatedCallWithQuayFragment;
};
export const DepartureTime = ({departure, color}: DepartureTimeProps) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {themeName} = useThemeContext();

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
          typography={
            departure.cancellation ? 'body__m__strike' : 'body__m__strong'
          }
          color={color}
          type={departure.cancellation ? 'secondary' : 'primary'}
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
          typography="body__xs__strike"
          color={color}
          type="secondary"
          style={styles.aimedTime}
        >
          {formatLocaleTime(departure.aimedDepartureTime, language)}
        </ThemeText>
      )}
    </View>
  );
};

const isMoreThanOneMinuteDelayed = (
  departure: EstimatedCall | EstimatedCallWithQuayFragment,
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
