import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Opinions} from './Feedback';
import {FeedbackTexts, useTranslation} from '@atb/translations';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import { Theme } from '@atb-as/theme';

export type GoodOrBadButtonProps = {
  opinion: Opinions;
  checked: boolean;
  setSelectedOpinion: (value: Opinions) => void;
};

const getThemeColor = (theme: Theme) => theme.background[0];
const getInteractiveColor = (theme: Theme) => theme.interactive[2];

export const GoodOrBadButton = ({
  checked,
  opinion,
  setSelectedOpinion,
}: GoodOrBadButtonProps) => {
  const styles = useButtonStyle();
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <View style={styles.outerGoodOrBad}>
      <PressableOpacity
        onPress={() =>
          setSelectedOpinion(checked ? Opinions.NotClickedYet : opinion)
        }
        accessibilityRole="radio"
        accessibilityState={{selected: checked}}
        accessibilityHint={`${
          opinion === Opinions.Good && t(FeedbackTexts.goodOrBadTexts.good)
        }
        ${opinion === Opinions.Bad && t(FeedbackTexts.goodOrBadTexts.bad)}
        ${
          checked
            ? t(FeedbackTexts.alternatives.a11yHints.checked)
            : t(FeedbackTexts.alternatives.a11yHints.unchecked)
        }`}
      >
        <View
          style={
            checked ? [styles.button, styles.selectedButton] : [styles.button]
          }
        >
          <ThemeText
            color={getThemeColor(theme)}
            type={checked ? 'body__primary--bold' : 'body__primary'}
          >
            {opinion === Opinions.Good && t(FeedbackTexts.goodOrBadTexts.good)}
            {opinion === Opinions.Bad && t(FeedbackTexts.goodOrBadTexts.bad)}
          </ThemeText>

          <View style={styles.emoji}>
            {opinion === Opinions.Good && (
              <ThemeText type="body__primary--jumbo">🙌</ThemeText>
            )}
            {opinion === Opinions.Bad && (
              <ThemeText type="body__primary--jumbo">👎</ThemeText>
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
    borderRadius: theme.border.radius.medium,
    borderColor: getInteractiveColor(theme).default.background,
  },
  selectedButton: {
    backgroundColor: getInteractiveColor(theme).active.background,
    borderColor: getInteractiveColor(theme).outline.background,
  },
}));
