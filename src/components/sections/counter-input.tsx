import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import ThemeText from '@atb/components/text';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';
import insets from '@atb/utils/insets';
import ThemeIcon from '@atb/components/theme-icon';
import {Add, Remove} from '@atb/assets/svg/icons/actions';
import {StyleSheet, useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';

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
  const {theme} = useTheme();
  const removeButtonDisabled = count === 0;
  return (
    <View style={[topContainer, counterStyles.countContainer]}>
      <View style={[style.spaceBetween, contentContainer]}>
        <ThemeText accessibilityLabel={`${count} ${text}`}>{text}</ThemeText>
      </View>
      <View style={counterStyles.countActions}>
        <TouchableOpacity
          disabled={removeButtonDisabled}
          onPress={() => removeCount()}
          accessibilityRole="button"
          accessibilityLabel={t(
            SectionTexts.counterInput.decreaseButton.a11yLabel,
          )}
          accessibilityHint={
            removeButtonDisabled
              ? ''
              : t(
                  SectionTexts.counterInput.decreaseButton.a11yHint(
                    text,
                    count,
                  ),
                )
          }
          accessibilityState={{disabled: removeButtonDisabled}}
          hitSlop={insets.all(theme.spacings.medium)}
          style={counterStyles.removeCount}
        >
          <ThemeIcon
            svg={Remove}
            fill={
              removeButtonDisabled
                ? theme.text.colors.disabled
                : theme.text.colors.primary
            }
          />
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
    marginRight: theme.spacings.xLarge,
  },
  addCount: {
    marginLeft: theme.spacings.xLarge,
  },
}));
