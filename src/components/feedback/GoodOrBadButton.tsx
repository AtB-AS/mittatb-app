import React from 'react';
import {GenericClickableItem} from '../sections';
import {StyleSheet, useTheme} from '@atb/theme';
import {View} from 'react-native';
import ThemeText from '../text';
import {Opinions} from '.';

export type GoodOrBadButtonProps = {
  opinion: Opinions;
  checked: boolean;
  setSelectedOpinion: (value: Opinions) => void;
};

export const GoodOrBadButton = ({
  checked,
  opinion,
  setSelectedOpinion,
}: GoodOrBadButtonProps) => {
  const styles = useButtonStyle();
  const {theme} = useTheme();

  return (
    <GenericClickableItem onPress={() => setSelectedOpinion(opinion)}>
      <View
        style={checked ? styles.button && styles.selectedButton : styles.button}
      >
        {opinion === Opinions.Good && <ThemeText>Bra greier</ThemeText>}
        {opinion === Opinions.Bad && <ThemeText>Dårlige greier</ThemeText>}
      </View>
    </GenericClickableItem>
  );
};

const useButtonStyle = StyleSheet.createThemeHook((theme) => ({
  button: {
    width: 200,
    height: 200,
    borderRadius: theme.border.radius.regular,
  },
  selectedButton: {
    width: 300,
  },
}));

export default GoodOrBadButton;
