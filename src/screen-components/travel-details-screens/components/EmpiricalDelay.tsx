import {usePreferencesContext} from '@atb/modules/preferences';
import {ThemeText} from '@atb/components/text';
import {formatDuration, parseDuration} from '@atb/utils/durations';
import {EstimatedCallWithMetadata} from '../DepartureDetailsScreenComponent';
import {View} from 'react-native';

export function EmpiricalDelay({call}: {call: EstimatedCallWithMetadata}) {
  const {
    preferences: {debugShowEmpiricalDelay},
  } = usePreferencesContext();
  if (!debugShowEmpiricalDelay || !call.empiricalDelay) return null;

  const p50 = parseDuration(call.empiricalDelay.p50);
  const p90 = parseDuration(call.empiricalDelay.p90);
  if (!p50 && !p90) return null;

  return (
    <View>
      {!!p50 && (
        <ThemeText typography="body__xs" color="secondary">
          p50 = {formatDuration(p50)}
        </ThemeText>
      )}
      {!!p90 && (
        <ThemeText typography="body__xs" color="secondary">
          p90 = {formatDuration(p90)}
        </ThemeText>
      )}
    </View>
  );
}
