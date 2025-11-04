import {
  TransportModePair,
  getTransportModeText,
} from '@atb/components/transportation-modes';
import {TransportationIconBox} from './TransportationIconBox';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {getTransportModeSvg} from './utils';
import {StyleSheet, Theme} from '@atb/theme';
import {CounterIconBox} from './CounterIconBox';
import {AccessibilityProps, View} from 'react-native';

type Props = {
  modes: TransportModePair[];
  maxNumberOfBoxes?: number;
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
} & AccessibilityProps;

export const TransportationIconBoxList = ({
  modes,
  maxNumberOfBoxes = 2,
  iconSize,
  disabled,
  ...props
}: Props) => {
  const styles = useStyles({iconSize})();
  const {t} = useTranslation();
  const numberOfModes: number = modes.length;
  const hasOverflow = numberOfModes > maxNumberOfBoxes;
  const numberOfModesToDisplay = hasOverflow
    ? maxNumberOfBoxes - 1
    : numberOfModes;
  const modesToDisplay = modes
    .filter(removeDuplicatesByIconNameFilter)
    .slice(0, numberOfModesToDisplay);

  return (
    <View
      accessible={true}
      accessibilityLabel={getTransportModeText(modes, t)}
      style={{flexDirection: 'row'}}
      {...props}
    >
      {modesToDisplay.map(({mode, subMode}) => (
        <TransportationIconBox
          style={styles.icon}
          key={mode + subMode}
          mode={mode}
          subMode={subMode}
          size={iconSize}
          disabled={disabled}
        />
      ))}
      {hasOverflow && (
        <CounterIconBox
          count={numberOfModes - numberOfModesToDisplay}
          style={styles.icon}
          size={iconSize}
          textType={iconSize === 'xSmall' ? 'heading__xs' : 'body__s'}
        />
      )}
    </View>
  );
};

const useStyles = ({iconSize}: Pick<Props, 'iconSize'>) =>
  StyleSheet.createThemeHook((theme) => ({
    icon: {
      marginRight:
        iconSize === 'xSmall' ? theme.spacing.xSmall : theme.spacing.small,
    },
  }));

const removeDuplicatesByIconNameFilter = (
  val: TransportModePair,
  i: number,
  arr: TransportModePair[],
): boolean =>
  arr
    .map((m) => getTransportModeSvg(m.mode, m.subMode).name)
    .indexOf(getTransportModeSvg(val.mode, val.subMode).name) === i;
