import {Statuses, StyleSheet, useThemeContext} from '@atb/theme';
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
  const {theme, themeName} = useThemeContext();
  const {transportMode, transportSubmode} = serviceJourney;
  const publicCode = serviceJourney.line?.publicCode;

  const transportColor = useTransportationColor(
    transportMode,
    transportSubmode,
  ).primary;
  const {svg} = getTransportModeSvg(transportMode, transportSubmode);
  const icon = messageType && messageTypeToIcon(messageType, true, themeName);

  if (!publicCode && !transportMode) return null;

  return (
    <View
      style={[styles.lineChip, {backgroundColor: transportColor.background}]}
    >
      <ThemeIcon
        color={transportColor.foreground.primary}
        style={{marginRight: publicCode ? theme.spacing.small : 0}}
        svg={svg}
      />
      {publicCode && (
        <ThemeText
          style={[
            styles.lineChipText,
            {
              color: transportColor.foreground.primary,
              minWidth: fontScale * 20,
            },
          ]}
          typography="body__primary--bold"
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
    padding: theme.spacing.small,
    borderRadius: theme.border.radius.regular,
    marginRight: theme.spacing.medium,
    flexDirection: 'row',
  },
  lineChipIcon: {
    position: 'absolute',
    top: -theme.spacing.small,
    left: -theme.spacing.small,
  },
  lineChipText: {
    color: theme.color.background.accent[3].foreground.primary,
    textAlign: 'center',
  },
}));
