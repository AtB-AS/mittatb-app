import {Statuses, StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';
import {usePreferencesContext} from '@atb/preferences';
import {LineChip, LineChipServiceJourney} from './LineChip';
import {ThemeIcon} from '../theme-icon';
import {PinInvalid} from '@atb/assets/svg/mono-icons/map';
import {ThemeText} from '@atb/components/text';
import {DestinationDisplay} from '@atb/api/types/generated/journey_planner_v3_types';

type EstimatedCallItemDeparture = {
  destinationDisplay?: DestinationDisplay;
  cancellation: boolean;
  predictionInaccurate: boolean;
  serviceJourney: LineChipServiceJourney;
};
type EstimatedCallProps = {
  departure: EstimatedCallItemDeparture;
  ignoreSituationsAndCancellations?: boolean;
  messageType?: Exclude<Statuses, 'valid'>;
  testID?: string;
};
export function EstimatedCallInfo({
  departure,
  ignoreSituationsAndCancellations = false,
  messageType,
  testID = 'estimatedCallItem',
}: EstimatedCallProps) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {
    preferences: {debugPredictionInaccurate},
  } = usePreferencesContext();

  const lineName = formatDestinationDisplay(t, departure.destinationDisplay);
  const showAsCancelled =
    departure.cancellation && !ignoreSituationsAndCancellations;

  return (
    <View style={styles.transportInfo}>
      <LineChip
        serviceJourney={departure.serviceJourney}
        messageType={
          !ignoreSituationsAndCancellations ? messageType : undefined
        }
        testID={testID}
      />
      {debugPredictionInaccurate && departure.predictionInaccurate && (
        <ThemeIcon svg={PinInvalid} color="warning" />
      )}
      <ThemeText
        typography={showAsCancelled ? 'body__primary--strike' : 'body__primary'}
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
    marginRight: theme.spacing.medium,
    minWidth: '30%',
  },
}));
