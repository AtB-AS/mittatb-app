import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';

type Props = {
  active: boolean;
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
};

/**
 * Total
 */
const CARNET_DIVIDER = 10;

export const CarnetFooter: React.FC<Props> = ({
  active,
  maximumNumberOfAccesses,
  numberOfUsedAccesses,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const {accessesRemaining, multiCarnetArray, unusedArray, usedArray} =
    calculateCarnetData(active, maximumNumberOfAccesses, numberOfUsedAccesses);

  return (
    <View
      style={{flexDirection: 'column', flex: 1}}
      accessible={true}
      accessibilityLabel={t(
        FareContractTexts.carnet.numberOfUsedAccessesRemaining(
          accessesRemaining,
        ),
      )}
    >
      <View>
        <ThemeText type="body__secondary">
          {t(
            FareContractTexts.carnet.numberOfUsedAccessesRemaining(
              accessesRemaining,
            ),
          )}
        </ThemeText>
      </View>
      <View style={styles.container}>
        {multiCarnetArray.map((count, idx) => (
          <MultiCarnet key={idx} count={count} />
        ))}
        {unusedArray.map((_, idx) => (
          <View key={idx} style={styles.dot} />
        ))}
        {active && (
          <View style={styles.dot}>
            <View style={styles.dotFill__active} />
          </View>
        )}
        {usedArray.map((_, idx) => (
          <View key={idx} style={[styles.dot, styles.dot__unused]} />
        ))}
      </View>
    </View>
  );
};

/**
 * Function to get the arrays required to display the carnet footer dots.
 *
 * @param active the ticket status (active | inactive).
 * @param maximumNumberOfAccesses total amount of available access that the carnet has.
 * @param numberOfUsedAccesses total amount of used access that the carnet has.
 * @returns values to display the carnet footer, it will be displayed in this order :
 *
 * `multi-carnet dots --- unused dots --- active dots --- used dots`
 *
 */

function calculateCarnetData(
  active: boolean,
  maximumNumberOfAccesses: number,
  numberOfUsedAccesses: number,
) {
  /**
   * If the ticket status is active, it should be considered into calculation.
   */
  const activeAccess = active ? 1 : 0;

  /**
   * The number of the remaining access, calculated by the following formula :
   *
   * `maximumNumberOfAccesses - numberOfUsedAccesses`
   */
  const accessesRemaining = maximumNumberOfAccesses - numberOfUsedAccesses;

  /**
   * Calculates the amount of padding needed,
   * if `maximumNumberOfAccesses` are not divisible by `CARNET_DIVIDER`.
   */
  const padding =
    Math.abs(CARNET_DIVIDER - maximumNumberOfAccesses) % CARNET_DIVIDER;

  /**
   * Number of additional dots that should be added when the padding is there.
   */
  const numberOfAdditionalDots =
    maximumNumberOfAccesses > CARNET_DIVIDER
      ? CARNET_DIVIDER - padding
      : padding;

  /**
   * Determines whether we should add extra multi-carnet dots or not.
   *
   * Should only add extra carnet when:
   * - accessesRemaining is divisible by CARNET_DIVIDER
   * - status is currently active
   */
  const shouldAddExtraMultiCarnet =
    accessesRemaining % CARNET_DIVIDER === 0 && active ? 1 : 0;

  /**
   * Calculates the amount of dots showing for the multi-carnet part
   */
  const numberOfMultiCarnets =
    Math.ceil(accessesRemaining / CARNET_DIVIDER - 1) +
    shouldAddExtraMultiCarnet;

  /**
   * Calculates the amount of dots showing for the used part
   */
  const numberOfUsedDots =
    (numberOfUsedAccesses + numberOfAdditionalDots - activeAccess) %
    CARNET_DIVIDER;

  /**
   * Calculates the amount of dots showing for the unused part
   */
  const numberOfUnusedDots = CARNET_DIVIDER - numberOfUsedDots - activeAccess;

  const multiCarnetArray = Array(numberOfMultiCarnets).fill(CARNET_DIVIDER);
  const unusedArray = Array(numberOfUnusedDots).fill(true);
  const usedArray = Array(numberOfUsedDots).fill(false);

  return {
    accessesRemaining,
    multiCarnetArray,
    unusedArray,
    usedArray,
  };
}

function MultiCarnet({count}: {count: number}) {
  const styles = useStyles();
  return (
    <View>
      <View style={[styles.dot, {marginRight: 8}]} />
      <View
        style={[styles.dot, {opacity: 0.8, position: 'absolute', left: 8}]}
      />
      <View style={styles.box}>
        <View style={styles.triangle} />
      </View>
      <View style={styles.count}>
        <ThemeText type="body__tertiary">{count}</ThemeText>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: theme.spacings.medium,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.static.background.background_1.background,
  },
  box: {
    alignItems: 'center',
    marginTop: theme.spacings.small,
    flex: 1,
  },
  count: {
    alignItems: 'center',
    paddingVertical: theme.spacings.xSmall,
    borderRadius: 3,
    backgroundColor: theme.static.background.background_1.background,
  },
  dot: {
    backgroundColor: theme.static.background.background_accent_1.background,
    borderRadius: 20,
    borderColor: theme.static.background.background_accent_1.background,
    borderWidth: 2,
    width: 16,
    height: 16,
  },
  dot__unused: {
    backgroundColor: theme.static.background.background_0.background,
  },
  dotFill__active: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    height: '100%',
    width: '50%',
    marginLeft: '50%',
    backgroundColor: theme.static.background.background_0.background,
  },
}));
