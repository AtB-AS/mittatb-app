import {getTransportModeText} from '@atb/components/transportation-modes';
import {TransportationIconBox} from './TransportationIconBox';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {getTransportModeSvg} from './utils';
import {StyleSheet, Theme} from '@atb/theme';
import {CounterIconBox} from './CounterIconBox';
import {AccessibilityProps, View} from 'react-native';
import {TransportModeType, TransportSubmodeType} from '@atb-as/config-specs';

export const TRANSPORTATION_ICON_BOX_LIST_MAX_ITEMS = 2;

export type TransportModePair = {
  mode: TransportModeType;
  subMode?: TransportSubmodeType;
};

type Props = {
  modes: TransportModePair[];
  maxNumberOfBoxes?: number;
  iconSize?: keyof Theme['icon']['size'];
} & AccessibilityProps;

export const TransportationIconBoxList = ({
  modes,
  iconSize,
  ...props
}: Props) => {
  const styles = useStyles({iconSize})();
  const {t} = useTranslation();
  const numberOfModes: number = modes.length;
  const hasOverflow = numberOfModes > TRANSPORTATION_ICON_BOX_LIST_MAX_ITEMS;
  const numberOfModesToDisplay = hasOverflow
    ? TRANSPORTATION_ICON_BOX_LIST_MAX_ITEMS - 1
    : numberOfModes;
  const modesToDisplay = modes
    .filter(removeDuplicatesByIconNameFilter)
    .slice(0, numberOfModesToDisplay);

  return (
    <View
      accessible={true}
      accessibilityLabel={getTransportModeText(modes, t)}
      style={styles.container}
      {...props}
    >
      {modesToDisplay.map(({mode, subMode}) => (
        <TransportationIconBox
          key={mode + subMode}
          mode={mode}
          subMode={subMode}
          iconSize={iconSize}
        />
      ))}
      {hasOverflow && (
        <CounterIconBox
          count={numberOfModes - numberOfModesToDisplay}
          size={iconSize}
          textType={iconSize === 'xSmall' ? 'heading__xs' : 'body__s'}
        />
      )}
    </View>
  );
};

const useStyles = ({iconSize}: Pick<Props, 'iconSize'>) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
      flexDirection: 'row',
      gap: iconSize === 'xSmall' ? theme.spacing.xSmall : theme.spacing.small,
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
