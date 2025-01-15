import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {calculateCarnetData} from './calculate-carnet-data';

type Props = {
  active: boolean;
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
};

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
        <ThemeText typography="body__secondary">
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
            <View style={styles.dotFill__activeViewBox}>
              <View style={styles.dotFill__activeFill} />
            </View>
          </View>
        )}
        {usedArray.map((_, idx) => (
          <View key={idx} style={[styles.dot, styles.dot__unused]} />
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
        <ThemeText typography="body__tertiary">{count}</ThemeText>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: theme.spacing.medium,
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
    borderBottomColor: theme.color.background.neutral[1].background,
  },
  box: {
    alignItems: 'center',
    marginTop: theme.spacing.small,
    flex: 1,
  },
  count: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xSmall,
    borderRadius: 3,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  dot: {
    backgroundColor: theme.color.foreground.dynamic.secondary,
    borderRadius: 20,
    borderColor: theme.color.foreground.dynamic.secondary,
    borderWidth: 2,
    width: 16,
    height: 16,
  },
  dot__unused: {
    backgroundColor: 'transparent',
  },
  dotFill__activeViewBox: {
    height: '100%',
    width: '50%',
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  dotFill__activeFill: {
    borderRadius: 20,
    height: '100%',
    width: '200%',
    alignSelf: 'flex-end',
    backgroundColor: theme.color.background.neutral[0].background,
  },
}));
