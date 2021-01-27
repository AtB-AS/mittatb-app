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
    <View style={[topContainer, counterStyles.countContainer]}>
      <View style={[style.spaceBetween, contentContainer]}>
        <ThemeText accessibilityLabel={`${count} ${text}`}>{text}</ThemeText>
      </View>
      <View style={counterStyles.countActions}>
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
          style={counterStyles.removeCount}
        >
          {count > 0 && <ThemeIcon svg={Remove} />}
        </TouchableOpacity>
        <ThemeText
          accessible={false}
          style={counterStyles.countText}
          type="paragraphHeadline"
        >
          {count}
        </ThemeText>
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
          style={counterStyles.addCount}
        >
          <ThemeIcon svg={Add} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  countContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  countText: {
    width: theme.spacings.large,
    textAlign: 'center',
  },
  removeCount: {
    marginRight: theme.spacings.large,
  },
  addCount: {
    marginLeft: theme.spacings.large,
  },
}));
