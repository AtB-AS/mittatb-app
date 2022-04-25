import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {View, TouchableOpacity} from 'react-native';
import ThemeText from '../text';
import {Opinions} from '.';
import {useSectionItem} from '../sections/section-utils';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import hexToRgba from 'hex-to-rgba';
import {StaticColor, StaticColorByType} from '@atb/theme/colors';

export type GoodOrBadButtonProps = {
  opinion: Opinions;
  checked: boolean;
  setSelectedOpinion: (value: Opinions) => void;
};

const themeColor: StaticColorByType<'background'> = 'background_0';
const selectedThemeColor: StaticColorByType<'background'> =
  'background_accent_3';

export const GoodOrBadButton = ({
  checked,
  opinion,
  setSelectedOpinion,
}: GoodOrBadButtonProps) => {
  const styles = useButtonStyle();
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={styles.outerGoodOrBad}>
      <TouchableOpacity
        onPress={() =>
          setSelectedOpinion(checked ? Opinions.NotClickedYet : opinion)
        }
        accessibilityRole="radio"
        accessibilityState={{selected: checked}}
        accessibilityHint={
          checked
            ? t(FeedbackTexts.alternatives.a11yHints.checked)
            : t(FeedbackTexts.alternatives.a11yHints.unchecked)
        }
      >
        <View
          style={
            checked ? [styles.button, styles.selectedButton] : [styles.button]
          }
        >
          <ThemeText
            color={themeColor}
            type={checked ? 'body__primary--bold' : 'body__primary'}
          >
            {opinion === Opinions.Good && t(FeedbackTexts.goodOrBadTexts.good)}
            {opinion === Opinions.Bad && t(FeedbackTexts.goodOrBadTexts.bad)}
          </ThemeText>

          <View style={styles.emoji}>
            {opinion === Opinions.Good && (
              <ThemeText type={'body__primary--jumbo'}>🙌</ThemeText>
            )}
            {opinion === Opinions.Bad && (
              <ThemeText type={'body__primary--jumbo'}>👎</ThemeText>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const useButtonStyle = StyleSheet.createThemeHook((theme) => ({
  outerGoodOrBad: {
    flex: 1,
  },
  emoji: {
    marginTop: theme.spacings.xLarge,
  },
  button: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
    padding: theme.spacings.xLarge,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: theme.border.width.medium,
    borderRadius: theme.border.radius.regular,
    borderColor: theme.static.background[themeColor].background,
  },
  selectedButton: {
    backgroundColor: hexToRgba(
      theme.static.background[selectedThemeColor].background,
      0.2,
    ),
    borderColor: theme.static.background[selectedThemeColor].background,
  },
}));

export default GoodOrBadButton;
