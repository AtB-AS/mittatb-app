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
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {PrefixAccessibilityLabel} from './PrefixAccessibilityLabel';

export type TravelCardType = 'trip-search' | 'saved-trip';

type TravelCardProps = {
  tripPattern: TripPattern;
  onDetailsPressed(tripPattern: TripPattern, resultIndex?: number): void;
  cardIndex: number;
  numberOfCards: number;
  testID?: string;
  type: TravelCardType;
};

export const TravelCard: React.FC<TravelCardProps> = ({
  tripPattern,
  onDetailsPressed,
  cardIndex,
  numberOfCards,
  testID,
  type,
}) => {
  const styles = useThemeStyles();
  const [maxWidth, setMaxWidth] = useState(0);
  const {t} = useTranslation();

  const includeDayInfo = type === 'saved-trip';
  const includeFromToInfo = type === 'saved-trip';

  const accessibilityLabel = useAccessibilityLabel(
    tripPattern,
    type,
    cardIndex,
    numberOfCards,
  );

  return (
    <Animated.View entering={FadeIn} accessible={false}>
      <NativeBlockButton
        style={styles.container}
        accessible={true}
        accessibilityRole="button"
        accessibilityHint={t(TravelCardTexts.card.a11yHint)}
        onPress={() => onDetailsPressed(tripPattern, cardIndex)}
        testID={testID}
      >
        <PrefixAccessibilityLabel accessibilityLabel={accessibilityLabel} />
        <TravelCardHeader
          tripPattern={tripPattern}
          includeDayInfo={includeDayInfo}
          includeFromToInfo={includeFromToInfo}
        />
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

const useAccessibilityLabel = (
  tripPattern: TripPattern,
  type: TravelCardType,
  cardIndex: number,
  numberOfCards: number,
) => {
  const {t} = useTranslation();
  const prefix = t(
    TravelCardTexts.card.typePrefix(type, cardIndex, numberOfCards),
  );
  const uniqueModes = Array.from(
    new Set(tripPattern.legs.map((leg) => leg.mode)),
  );
  const modes = uniqueModes.map((mode) => t(getTranslatedModeName(mode)));

  return `${prefix}. ${t(TravelCardTexts.card.modesPrefix(modes))}.`;
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
