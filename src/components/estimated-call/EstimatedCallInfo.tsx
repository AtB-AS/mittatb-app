import {EstimatedCall} from '@atb/api/types/departures';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {formatDestinationDisplay} from '@atb/travel-details-screens/utils';
import {usePreferences} from '@atb/preferences';
import {LineChip} from './LineChip';
import {ThemeIcon} from '../theme-icon';
import {PinInvalid} from '@atb/assets/svg/mono-icons/map';
import {ThemeText} from '@atb/components/text';

type EstimatedCallProps = {
  departure: EstimatedCall;
  ignoreSituationsAndCancellations?: boolean;
  testID?: string;
};
export function EstimatedCallInfo({
  departure,
  ignoreSituationsAndCancellations = false,
  testID = 'estimatedCallItem',
}: EstimatedCallProps) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    preferences: {debugPredictionInaccurate},
  } = usePreferences();

  const lineName = formatDestinationDisplay(t, departure.destinationDisplay);
  const showAsCancelled =
    departure.cancellation && !ignoreSituationsAndCancellations;

  return (
    <View style={styles.transportInfo}>
      <LineChip
        departure={departure}
        ignoreSituationsAndCancellations={ignoreSituationsAndCancellations}
        testID={testID}
      />
      {debugPredictionInaccurate && departure.predictionInaccurate && (
        <ThemeIcon svg={PinInvalid} colorType="warning" />
      )}
      <ThemeText
        type={showAsCancelled ? 'body__primary--strike' : 'body__primary'}
        color={showAsCancelled ? 'secondary' : 'primary'}
        style={styles.lineName}
        testID={`${testID}LineName`}
      >
        {lineName}
      </ThemeText>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  lineName: {
    flexGrow: 1,
    flexShrink: 1,
    marginRight: theme.spacings.medium,
    minWidth: '30%',
  },
}));
