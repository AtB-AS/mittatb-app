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
import {CompositeAccessibilityProvider} from '@atb/modules/composite-accessibility';
import {getDetailedSituationOrNoticeA11yLabel} from '@atb/modules/situations';
import {TravelCardNotices} from './TravelCardNotices';

export type TravelCardType = 'trip-search' | 'saved-trip' | 'booking';

type TravelCardProps = {
  tripPattern: TripPattern;
  onDetailsPressed(tripPattern: TripPattern, resultIndex?: number): void;
  cardIndex: number;
  numberOfCards: number;
  testID?: string;
  type: TravelCardType;
  isDisabled?: boolean;
  extraA11yLabels?: Record<string, string | undefined>;
  extraA11yOrder?: {before?: string[]; after?: string[]};
};

export const TravelCard: React.FC<TravelCardProps> = ({
  tripPattern,
  onDetailsPressed,
  cardIndex,
  numberOfCards,
  testID,
  type,
  isDisabled = false,
  extraA11yLabels,
  extraA11yOrder,
}) => {
  const styles = useThemeStyles();
  const [maxWidth, setMaxWidth] = useState(0);
  const {t, language} = useTranslation();

  const includeDayInfo = type === 'saved-trip';
  const includeFromToInfo = type === 'saved-trip';

  const uniqueModes = Array.from(
    new Set(tripPattern.legs.map((leg) => leg.mode)),
  );
  const modes = uniqueModes.map((mode) => t(getTranslatedModeName(mode)));

  const prefixA11yLabel = `${t(
    TravelCardTexts.card.typePrefix(type, cardIndex, numberOfCards),
  )}. ${t(TravelCardTexts.card.modesPrefix(modes))}.`;

  const situationOrNoticeA11yLabel =
    type === 'booking' && !isDisabled
      ? getDetailedSituationOrNoticeA11yLabel(tripPattern, language, t)
      : undefined;

  const baseOrder = ['cardPrefix', 'header', 'legs', 'situationOrNotice'];
  const order = [
    ...(extraA11yOrder?.before ?? []),
    ...baseOrder,
    ...(extraA11yOrder?.after ?? []),
  ];

  return (
    <Animated.View entering={FadeIn}>
      <CompositeAccessibilityProvider
        parentLabels={{
          cardPrefix: prefixA11yLabel,
          situationOrNotice: situationOrNoticeA11yLabel,
          ...extraA11yLabels,
        }}
        order={order}
      >
        {(accessibilityProps) => (
          <NativeBlockButton
            onPress={() => onDetailsPressed(tripPattern, cardIndex)}
            testID={testID}
            style={[styles.container, isDisabled && styles.containerDisabled]}
            accessibilityRole={isDisabled ? 'none' : 'button'}
            accessibilityHint={
              isDisabled ? undefined : t(TravelCardTexts.card.a11yHint)
            }
            {...accessibilityProps}
          >
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
                <TravelCardLegs
                  tripPattern={tripPattern}
                  maxWidth={maxWidth}
                  type={type}
                />
              </View>
              <View>
                <ThemeIcon svg={ChevronRight} />
              </View>
            </View>
            <TravelCardNotices tripPattern={tripPattern} language={language} />
          </NativeBlockButton>
        )}
      </CompositeAccessibilityProvider>
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
    marginVertical: theme.spacing.small,
  },
  containerDisabled: {
    backgroundColor: theme.color.background.neutral[2].background,
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
