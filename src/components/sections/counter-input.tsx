import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import ThemeText from '@atb/components/text';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';
import insets from '@atb/utils/insets';
import ThemeIcon from '@atb/components/theme-icon';
import {Add, Subtract} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {InteractiveColor} from '@atb/theme/colors';

export type CounterInputProps = SectionItem<{
  text: string;
  subtext?: string;
  color?: InteractiveColor;
  count: number;
  addCount: () => void;
  removeCount: () => void;
}>;
export default function CounterInput({
  text,
  subtext,
  color,
  count,
  addCount,
  removeCount,
  testID,
  ...props
}: CounterInputProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const counterStyles = useStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const removeButtonDisabled = count === 0;
  const activeColor =
    count > 0 && color ? theme.interactive[color].active : undefined;

  return (
    <View style={[topContainer, counterStyles.countContainer]} testID={testID}>
      <View
        style={[
          style.spaceBetween,
          contentContainer,
          counterStyles.infoContainer,
        ]}
        accessible={true}
        accessibilityLabel={`${count} ${text}, ${subtext || ''}`}
      >
        <ThemeText>{text}</ThemeText>
        {subtext && (
          <ThemeText
            type="body__secondary"
            color="secondary"
            style={counterStyles.infoSubtext}
          >
            {subtext}
          </ThemeText>
        )}
      </View>
      <View style={counterStyles.countActions}>
        <TouchableOpacity
          disabled={removeButtonDisabled}
          onPress={() => removeCount()}
          accessibilityRole="button"
          accessibilityLabel={t(
            SectionTexts.counterInput.decreaseButton.a11yLabel(text),
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
          testID={testID + '_rem'}
        >
          <ThemeIcon
            svg={Subtract}
            fill={
              removeButtonDisabled
                ? theme.text.colors.disabled
                : theme.text.colors.primary
            }
          />
        </TouchableOpacity>
        <View
          style={[
            counterStyles.countTextContainer,
            activeColor && {backgroundColor: activeColor.background},
          ]}
        >
          <ThemeText
            accessible={false}
            style={[
              counterStyles.countText,
              activeColor && {color: activeColor.text},
            ]}
            type="body__primary--bold"
          >
            {count}
          </ThemeText>
        </View>
        <TouchableOpacity
          onPress={() => addCount()}
          accessibilityRole="button"
          accessibilityLabel={t(
            SectionTexts.counterInput.increaseButton.a11yLabel(text),
          )}
          accessibilityHint={t(
            SectionTexts.counterInput.increaseButton.a11yHint(text, count),
          )}
          hitSlop={insets.all(8)}
          style={counterStyles.addCount}
          testID={testID + '_add'}
        >
          <ThemeIcon svg={Add} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: theme.spacings.medium,
  },
  infoSubtext: {
    marginTop: theme.spacings.medium,
  },
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
  countTextContainer: {
    aspectRatio: 1,
    borderRadius: theme.border.radius.circle,
    justifyContent: 'center',
  },
  countText: {
    minWidth: theme.spacings.large,
    margin: theme.spacings.small,
    textAlign: 'center',
  },
  removeCount: {
    marginRight: theme.spacings.xLarge,
  },
  addCount: {
    marginLeft: theme.spacings.xLarge,
  },
}));
