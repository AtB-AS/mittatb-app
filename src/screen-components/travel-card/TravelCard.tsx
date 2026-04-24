import React, {useState} from 'react';
import {StyleSheet, Statuses} from '@atb/theme';
import type {TripPattern} from '@atb/api/types/trips';
import {TravelCardLegs} from './TravelCardLegs';
import Animated, {FadeIn} from 'react-native-reanimated';
import {NativeBlockButton} from '@atb/components/native-button';
import {TravelCardHeader} from './TravelCardHeader';
import {LayoutChangeEvent, View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {dictionary, TravelCardTexts, useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {CompositeAccessibilityProvider} from '@atb/modules/composite-accessibility';
import {getDetailedSituationOrNoticeA11yLabel} from '@atb/modules/situations';
import {TravelCardNotices} from './TravelCardNotices';
import {Tag} from '@atb/components/tag';

type TravelCardProps = {
  tripPattern: TripPattern;
  onDetailsPressed(tripPattern: TripPattern): void;
  testID?: string;
  a11yLabelPrefix: string;
  includeDayInfo?: boolean;
  includeFromToInfo?: boolean;
  includeLegNotifications?: boolean;
  includeSituationNotices?: boolean;
  isDisabled?: boolean;
  tagLabel?: string;
  tagType?: Statuses;
};

export const TravelCard: React.FC<TravelCardProps> = ({
  tripPattern,
  onDetailsPressed,
  testID,
  a11yLabelPrefix,
  includeDayInfo = false,
  includeFromToInfo = false,
  includeLegNotifications = false,
  includeSituationNotices = false,
  isDisabled = false,
  tagLabel,
  tagType = 'info',
}) => {
  const styles = useThemeStyles();
  const [maxWidth, setMaxWidth] = useState(0);
  const {t, language} = useTranslation();

  const uniqueModes = Array.from(
    new Set(tripPattern.legs.map((leg) => leg.mode)),
  );
  const modes = uniqueModes.map((mode) => t(getTranslatedModeName(mode)));

  const prefixA11yLabel = `${a11yLabelPrefix}. ${t(TravelCardTexts.card.modesPrefix(modes))}.`;

  const situationOrNoticeA11yLabel =
    includeSituationNotices && !isDisabled
      ? getDetailedSituationOrNoticeA11yLabel(tripPattern, language, t)
      : undefined;

  const tagA11yLabel = tagLabel
    ? `.. ${t(dictionary.messageTypes[tagType])}.. ${tagLabel}`
    : undefined;

  return (
    <Animated.View entering={FadeIn}>
      <CompositeAccessibilityProvider
        parentLabels={{
          cardPrefix: prefixA11yLabel,
          situationOrNotice: situationOrNoticeA11yLabel,
          tag: tagA11yLabel,
        }}
        order={['cardPrefix', 'header', 'legs', 'situationOrNotice', 'tag']}
      >
        {(accessibilityProps) => (
          <NativeBlockButton
            onPress={() => onDetailsPressed(tripPattern)}
            testID={testID}
            style={[styles.container, isDisabled && styles.containerDisabled]}
            disabled={isDisabled}
            accessibilityRole={isDisabled ? 'none' : 'button'}
            accessibilityHint={
              isDisabled ? undefined : t(TravelCardTexts.card.a11yHint)
            }
            {...accessibilityProps}
          >
            {tagLabel && (
              <View aria-hidden={true}>
                <Tag labels={[tagLabel]} tagType={tagType} />
              </View>
            )}
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
                  includeLegNotifications={includeLegNotifications}
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
