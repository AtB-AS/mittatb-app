import React from 'react';
import {StyleSheet} from '@atb/theme';
import {TouchableOpacity, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {Opinions} from '.';
import {FeedbackTexts, useTranslation} from '@atb/translations';
import {StaticColorByType} from '@atb/theme/colors';

export type GoodOrBadButtonProps = {
  opinion: Opinions;
  checked: boolean;
  setSelectedOpinion: (value: Opinions) => void;
};

const themeColor: StaticColorByType<'background'> = 'background_0';

export const GoodOrBadButton = ({
  checked,
  opinion,
  setSelectedOpinion,
}: GoodOrBadButtonProps) => {
  const styles = useButtonStyle();
  const {t} = useTranslation();

  return (
    <View style={styles.outerGoodOrBad}>
      <TouchableOpacity
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
    backgroundColor: theme.interactive.interactive_2.default.background,
    flex: 1,
    padding: theme.spacings.xLarge,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: theme.border.width.medium,
    borderRadius: theme.border.radius.regular,
    borderColor: theme.interactive.interactive_2.default.background,
  },
  selectedButton: {
    backgroundColor: theme.interactive.interactive_2.active.background,
    borderColor: theme.interactive.interactive_2.outline.background,
  },
}));

export default GoodOrBadButton;
