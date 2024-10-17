import {Statuses, StyleSheet, useTheme} from '@atb/theme';
import {ThemeIcon} from '../theme-icon';
import {ThemeText} from '../text';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {getTransportModeSvg} from '../icon-box';
import {View} from 'react-native';
import {useFontScale} from '@atb/utils/use-font-scale';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';

export type LineChipServiceJourney = {
  line?: {publicCode?: string | undefined};
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
};
type LineChipProps = {
  serviceJourney: LineChipServiceJourney;
  messageType?: Exclude<Statuses, 'valid'>;
  testID?: string;
};
export function LineChip({
  serviceJourney,
  messageType,
  testID = '',
}: LineChipProps) {
  const styles = useStyles();
  const fontScale = useFontScale();
  const {theme, themeName} = useTheme();
  const {transportMode, transportSubmode} = serviceJourney;
  const publicCode = serviceJourney.line?.publicCode;

  const transportColor = useTransportationColor(
    transportMode,
    transportSubmode,
  );
  const transportTextColor = useTransportationColor(
    transportMode,
    transportSubmode,
    false,
    'text',
  );
  const {svg} = getTransportModeSvg(transportMode, transportSubmode);
  const icon = messageType && messageTypeToIcon(messageType, true, themeName);

  if (!publicCode && !transportMode) return null;

  return (
    <View style={[styles.lineChip, {backgroundColor: transportColor}]}>
      <ThemeIcon
        fill={transportTextColor}
        style={{marginRight: publicCode ? theme.spacings.small : 0}}
        svg={svg}
      />
      {publicCode && (
        <ThemeText
          style={[
            styles.lineChipText,
            {color: transportTextColor, minWidth: fontScale * 20},
          ]}
          type="body__primary--bold"
          testID={`${testID}PublicCode`}
        >
          {publicCode}
        </ThemeText>
      )}
      {icon && <ThemeIcon svg={icon} style={styles.lineChipIcon} />}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  lineChip: {
    padding: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
    marginRight: theme.spacings.medium,
    flexDirection: 'row',
  },
  lineChipIcon: {
    position: 'absolute',
    top: -theme.spacings.small,
    left: -theme.spacings.small,
  },
  lineChipText: {
    color: theme.static.background.background_accent_3.text,
    textAlign: 'center',
  },
}));
