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

        {opinion === Opinions.Good && (
          <Svg width={24} height={24} fill="none" {...props}>
            <Path
              d="M12.75 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8.75 14s1.5 2 4 2 4-2 4-2M9.75 9h.01M15.75 9h.01"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}

        {opinion === Opinions.Bad && (
          <Svg width={24} height={24} fill="none" {...props}>
            <Path
              d="M12.25 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M16.25 16s-1.5-2-4-2-4 2-4 2M9.25 9h.01M15.25 9h.01"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
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
