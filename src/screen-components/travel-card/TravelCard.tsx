import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import type {TripPattern} from '@atb/api/types/trips';
import {TravelCardLegs} from './TravelCardLegs';
import Animated, {FadeIn} from 'react-native-reanimated';
import {NativeBlockButton} from '@atb/components/native-button';
import {TravelCardHeader} from './TravelCardHeader';
import {LayoutChangeEvent, View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';

type TravelCardProps = {
  tripPattern: TripPattern;
  onDetailsPressed(tripPattern: TripPattern, resultIndex?: number): void;
  resultIndex: number;
  testID?: string;
};

export const TravelCard: React.FC<TravelCardProps> = ({
  tripPattern,
  onDetailsPressed,
  resultIndex,
  testID,
}) => {
  const styles = useThemeStyles();
  const [maxWidth, setMaxWidth] = useState(0);

  return (
    <Animated.View entering={FadeIn} accessible={false}>
      <NativeBlockButton
        style={styles.container}
        accessible={true}
        accessibilityRole="button"
        onPress={() => onDetailsPressed(tripPattern, resultIndex)}
        testID={testID}
      >
        <TravelCardHeader tripPattern={tripPattern} />
        <View style={styles.legsContainer}>
          <View
            style={styles.legsArea}
            onLayout={(e: LayoutChangeEvent) =>
              setMaxWidth(e.nativeEvent.layout.width)
            }
          >
            <TravelCardLegs tripPattern={tripPattern} maxWidth={maxWidth} />
          </View>
          <View>
            <ThemeIcon svg={ChevronRight} />
          </View>
        </View>
      </NativeBlockButton>
    </Animated.View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    gap: theme.spacing.medium,
    backgroundColor: theme.color.background.neutral[0].background,
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.small,
  },
  legsContainer: {
    gap: theme.spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legsArea: {
    flex: 1,
  },
}));
