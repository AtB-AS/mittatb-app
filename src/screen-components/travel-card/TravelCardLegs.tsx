import {CounterIconBox} from '@atb/components/icon-box';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {screenReaderHidden} from '@atb/utils/accessibility';
import React from 'react';
import {View} from 'react-native';
import {TripPattern} from '@atb/api/types/trips';
import {getFilteredLegsByWalkOrWaitTime} from '@atb/screen-components/travel-details-screens';
import {OverflowContainer} from '@atb/components/overflow-container';
import {TransportationLeg, FootLeg} from './legs';

type TravelCardContentProps = {
  tripPattern: TripPattern;
  maxWidth: number;
};

export const TravelCardLegs: React.FC<TravelCardContentProps> = ({
  tripPattern,
  maxWidth,
}) => {
  const {theme} = useThemeContext();
  const styles = useThemeStyles();
  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);

  const staySeated = (idx: number): boolean => {
    const previousLeg = filteredLegs[idx - 1];
    return previousLeg && previousLeg.interchangeTo?.staySeated === true;
  };

  return (
    <View style={styles.detailsContainer} {...screenReaderHidden}>
      <View style={styles.flexRow}>
        <View style={styles.row}>
          <View style={styles.legs}>
            <OverflowContainer
              maxWidth={maxWidth}
              gap={theme.spacing.xSmall}
              overflow={(n) => (
                <CounterIconBox
                  count={n}
                  spacing="standard"
                  textType="body__m__strong"
                />
              )}
            >
              {filteredLegs.map((leg, i) => (
                <View key={`leg-${leg.id ?? i}`}>
                  {leg.mode === 'foot' ? (
                    <FootLeg leg={leg} nextLeg={filteredLegs[i + 1]} />
                  ) : staySeated(i) ? null : (
                    <TransportationLeg leg={leg} />
                  )}
                </View>
              ))}
            </OverflowContainer>
          </View>
        </View>
      </View>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  walkContainer: {
    backgroundColor: theme.color.background.neutral[2].background,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
  },
  walkDuration: {
    color: theme.color.foreground.dynamic.primary,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.small,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  legs: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    flexWrap: 'wrap',
  },
}));
