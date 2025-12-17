import React from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Opinions} from './Feedback';
import {FeedbackTexts, useTranslation} from '@atb/translations';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {Theme} from '@atb/theme/colors';
import {getRadioA11y} from '@atb/components/radio';

export type GoodOrBadButtonProps = {
  opinion: Opinions;
  checked: boolean;
  setSelectedOpinion: (value: Opinions) => void;
};

const getThemeColor = (theme: Theme) => theme.color.background.neutral[0];
const getInteractiveColor = (theme: Theme) => theme.color.interactive[2];

export const GoodOrBadButton = ({
  checked,
  opinion,
  setSelectedOpinion,
}: GoodOrBadButtonProps) => {
  const styles = useButtonStyle();
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  const text =
    opinion === Opinions.Good
      ? t(FeedbackTexts.goodOrBadTexts.good)
      : t(FeedbackTexts.goodOrBadTexts.bad);

  return (
    <View style={styles.outerGoodOrBad}>
      <PressableOpacity
        onPress={() =>
          setSelectedOpinion(checked ? Opinions.NotClickedYet : opinion)
        }
        {...getRadioA11y(text, checked, t)}
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
            color={getThemeColor(theme)}
            typography={checked ? 'body__m__strong' : 'body__m'}
          >
            {opinion === Opinions.Good && t(FeedbackTexts.goodOrBadTexts.good)}
            {opinion === Opinions.Bad && t(FeedbackTexts.goodOrBadTexts.bad)}
          </ThemeText>

          <View style={styles.emoji}>
            {opinion === Opinions.Good && (
              <ThemeText typography="heading__xl">🙌</ThemeText>
            )}
            {opinion === Opinions.Bad && (
              <ThemeText typography="heading__xl">👎</ThemeText>
            )}
          </View>
        </View>
      </PressableOpacity>
    </View>
  );
};

const useButtonStyle = StyleSheet.createThemeHook((theme) => ({
  outerGoodOrBad: {
    flex: 1,
  },
  emoji: {
    marginTop: theme.spacing.xLarge,
  },
  button: {
    backgroundColor: getInteractiveColor(theme).default.background,
    flex: 1,
    padding: theme.spacing.xLarge,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: theme.border.width.medium,
    borderRadius: theme.border.radius.regular,
    borderColor: getInteractiveColor(theme).default.background,
  },
  selectedButton: {
    backgroundColor: getInteractiveColor(theme).active.background,
    borderColor: getInteractiveColor(theme).outline.background,
  },
}));
