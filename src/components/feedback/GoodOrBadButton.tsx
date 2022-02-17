import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {View, TouchableOpacity} from 'react-native';
import ThemeText from '../text';
import {Opinions} from '.';
import {useSectionItem} from '../sections/section-utils';
import {useTranslation} from '@atb/translations';
import Svg, {Path} from 'react-native-svg';

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
  const {language} = useTranslation();

  return (
    <TouchableOpacity onPress={() => setSelectedOpinion(opinion)}>
      <View
        style={
          checked
            ? [topContainer, styles.button, styles.selectedButton]
            : [topContainer, styles.button]
        }
      >
        <ThemeText type={checked ? 'body__primary--bold' : 'body__primary'}>
          {opinion === Opinions.Good && (language === 'nb' ? 'Bra' : 'Good')}
          {opinion === Opinions.Bad && (language === 'nb' ? 'Dårlig' : 'Bad')}
        </ThemeText>

        {opinion === Opinions.Good && <ThemeText>🙌</ThemeText>}
        {opinion === Opinions.Bad && <ThemeText>👎</ThemeText>}
      </View>
    </TouchableOpacity>
  );
};

const useButtonStyle = StyleSheet.createThemeHook((theme) => ({
  button: {
    width: 170,
    height: 100,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
    // borderColor: theme.colors.background_accent,
  },
  selectedButton: {
    // backgroundColor: theme.colors.background_0,
    borderWidth: 1,
  },
}));

export default GoodOrBadButton;
