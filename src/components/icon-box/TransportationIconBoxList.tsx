import {TransportModePair} from '@atb/components/transportation-modes';
import {TransportationIconBox} from './TransportationIconBox';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {getTransportModeSvg} from './utils';
import {StyleSheet, Theme} from '@atb/theme';
import {CounterIconBox} from './CounterIconBox';

type Props = {
  modes: TransportModePair[];
  modesDisplayLimit?: number;
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
};

export const TransportationIconBoxList = ({
  modes,
  modesDisplayLimit = 2,
  iconSize,
  disabled,
}: Props) => {
  const styles = useStyles({iconSize})();
  const {t} = useTranslation();
  const modesCount: number = modes.length;
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
      {modesCount > modesDisplayLimit && (
        <CounterIconBox
          count={modesCount - modesDisplayLimit}
          style={styles.icon}
          size={iconSize}
          accessibilityLabel={t(
            FareContractTexts.transportModes.a11yLabelMultipleTravelModes(
              modesCount,
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
