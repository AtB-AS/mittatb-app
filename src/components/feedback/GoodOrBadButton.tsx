import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {View, TouchableOpacity} from 'react-native';
import ThemeText from '../text';
import {Opinions} from '.';
import {useSectionItem} from '../sections/section-utils';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import hexToRgba from 'hex-to-rgba';

export type GoodOrBadButtonProps = {
  opinion: Opinions;
  checked: boolean;
  setSelectedOpinion: (value: Opinions) => void;
};

export const GoodOrBadButton = ({
  checked,
  opinion,
  setSelectedOpinion,
  ...props
}: GoodOrBadButtonProps) => {
  const styles = useButtonStyle();
  const {theme} = useTheme();
  const {topContainer} = useSectionItem(props);
  const {language, t} = useTranslation();

  return (
    <View style={styles.outerGoodOrBad}>
      <TouchableOpacity
        onPress={() =>
          setSelectedOpinion(checked ? Opinions.NotClickedYet : opinion)
        }
      >
        <View
          style={
            checked
              ? [topContainer, styles.button, styles.selectedButton]
              : [topContainer, styles.button]
          }
        >
          <ThemeText type={checked ? 'body__primary--bold' : 'body__primary'}>
            {opinion === Opinions.Good && t(FeedbackTexts.goodOrBadTexts.good)}
            {opinion === Opinions.Bad && t(FeedbackTexts.goodOrBadTexts.bad)}
          </ThemeText>

          <View style={styles.emoji}>
            {opinion === Opinions.Good && <ThemeText>🙌</ThemeText>}
            {opinion === Opinions.Bad && <ThemeText>👎</ThemeText>}
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
    flex: 1,
    padding: theme.spacings.xLarge,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderWidth: theme.border.width.medium,
    borderRadius: theme.border.radius.regular,
    borderColor: theme.colors.background_0.backgroundColor,
  },
  selectedButton: {
    backgroundColor: hexToRgba(theme.colors.primary_1.backgroundColor, 0.2),
    borderColor: theme.colors.primary_2.backgroundColor,
  },
}));

export default GoodOrBadButton;
