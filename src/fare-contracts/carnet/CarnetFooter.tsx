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

const CARNET_DIVIDER = 10;

export const CarnetFooter: React.FC<Props> = ({
  active,
  maximumNumberOfAccesses,
  numberOfUsedAccesses,
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const activeAccess = active ? 1 : 0;

  const accessesRemaining = maximumNumberOfAccesses - numberOfUsedAccesses;

  // The number of accesses remaining, including the active one
  const shownAccessesRemaining = accessesRemaining + activeAccess;

  // If any active, the remaining count is the active index
  const activeIndex = active
    ? (shownAccessesRemaining - 1) % CARNET_DIVIDER
    : undefined;

  // Figure out how many unused travel rights there are left
  // does not need to match actual number of travel rights
  const carnetsLeftCount = Math.ceil(
    (shownAccessesRemaining + activeAccess) / CARNET_DIVIDER,
  );

  // For the ones not displayed as "multi carnets"
  // how many accesses are used in the travel right
  const restUsed =
    carnetsLeftCount > 0
      ? (numberOfUsedAccesses - activeAccess) % CARNET_DIVIDER
      : CARNET_DIVIDER;

  const numberOfMultiCarnets = Math.floor(
    Math.max(0, shownAccessesRemaining - 1) / CARNET_DIVIDER,
  );

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
        {Array(numberOfMultiCarnets)
          .fill(CARNET_DIVIDER)
          .map((count, idx) => (
            <MultiCarnet key={idx} count={count} />
          ))}
        {Array(CARNET_DIVIDER)
          .fill(true)
          .map((_, idx) => idx < restUsed)
          .reverse()
          .map((isUnused, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                isUnused && idx !== activeIndex
                  ? styles.dot__unused
                  : undefined,
              ]}
            >
              {idx === activeIndex && <View style={styles.dotFill__active} />}
            </View>
          ))}
      </View>
    </View>
  );
};

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
