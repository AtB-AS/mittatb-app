import {TransportModePair} from '@atb/components/transportation-modes';
import {TransportationIconBox} from './TransportationIconBox';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {getTransportModeSvg} from './utils';
import {StyleSheet, Theme} from '@atb/theme';
import {CounterIconBox} from './CounterIconBox';

type Props = {
  modes: TransportModePair[];
  maxNumberOfBoxes?: number;
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
};

export const TransportationIconBoxList = ({
  modes,
  maxNumberOfBoxes = 2,
  iconSize,
  disabled,
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
    <>
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
          accessibilityLabel={t(
            FareContractTexts.transportModes.a11yLabelMultipleTravelModes(
              numberOfModes,
            ),
          )}
        />
      )}
    </>
  );
};

const useStyles = ({iconSize}: Pick<Props, 'iconSize'>) =>
  StyleSheet.createThemeHook((theme) => ({
    icon: {
      marginRight:
        iconSize === 'xSmall' ? theme.spacings.xSmall : theme.spacings.small,
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
