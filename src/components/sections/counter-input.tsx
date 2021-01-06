import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import ThemeText from '../text';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';
import insets from '../../utils/insets';
import ThemeIcon from '../theme-icon';
import {Add, Remove} from '../../assets/svg/icons/actions';
import {StyleSheet} from '../../theme';
import {SectionTexts, useTranslation} from '../../translations';

export type CounterInputProps = SectionItem<{
  text: string;
  count: number;
  addCount: () => void;
  removeCount: () => void;
}>;
export default function CounterInput({
  text,
  count,
  addCount,
  removeCount,
  ...props
}: CounterInputProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const counterStyles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={[topContainer, counterStyles.travellerCount]}>
      <View style={[style.spaceBetween, contentContainer]}>
        <ThemeText>
          {count} {text}
        </ThemeText>
      </View>
      <View style={counterStyles.travellerCountActions}>
        <TouchableOpacity
          disabled={count === 0}
          onPress={() => removeCount()}
          accessibilityRole="button"
          accessibilityLabel={t(
            SectionTexts.counterInput.decreaseButton.a11yLabel,
          )}
          accessibilityHint={t(
            SectionTexts.counterInput.decreaseButton.a11yHint(text, count),
          )}
          accessibilityElementsHidden={count < 1}
          importantForAccessibility={count >= 1 ? 'yes' : 'no-hide-descendants'}
          hitSlop={insets.all(8)}
        >
          <ThemeIcon
            style={count === 0 && counterStyles.disabled}
            svg={Remove}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => addCount()}
          accessibilityRole="button"
          accessibilityLabel={t(
            SectionTexts.counterInput.increaseButton.a11yLabel,
          )}
          accessibilityHint={t(
            SectionTexts.counterInput.increaseButton.a11yHint(text, count),
          )}
          hitSlop={insets.all(8)}
        >
          <ThemeIcon svg={Add} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  travellerCount: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  travellerCountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 70,
  },
  disabled: {
    opacity: 0.4,
  },
}));
