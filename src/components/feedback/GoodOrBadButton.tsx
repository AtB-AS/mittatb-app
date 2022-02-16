import React from 'react';
import {GenericClickableItem} from '../sections';
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
          <Svg
            width={24}
            height={24}
            fill="none"
            viewBox="0 0 24 24"
            {...props}
          >
            <Path
              d="M12.75 22C18.2728 22 22.75 17.5228 22.75 12C22.75 6.47715 18.2728 2 12.75 2C7.22715 2 2.75 6.47715 2.75 12C2.75 17.5228 7.22715 22 12.75 22Z"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M8.75 14C8.75 14 10.25 16 12.75 16C15.25 16 16.75 14 16.75 14"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M9.75 9H9.76"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M15.75 9H15.76"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        )}

        {opinion === Opinions.Bad && (
          <Svg
            width={24}
            height={24}
            fill="none"
            viewBox="0 0 24 24"
            {...props}
          >
            <Path
              d="M12.25 22C17.7728 22 22.25 17.5228 22.25 12C22.25 6.47715 17.7728 2 12.25 2C6.72715 2 2.25 6.47715 2.25 12C2.25 17.5228 6.72715 22 12.25 22Z"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M16.25 16C16.25 16 14.75 14 12.25 14C9.75 14 8.25 16 8.25 16"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M9.25 9H9.26"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M15.25 9H15.26"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
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
