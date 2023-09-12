import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {InfoChip} from '../info-chip';
import {InfoTagTexts, useTranslation} from '@atb/translations';

type Props = {
  text: 'beta' | 'new' | string; // Restricting text to either 'beta', 'new' or any other string
  style?: StyleProp<ViewStyle>;
};
export const InfoTag = ({text, style}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const getLocalizedText = () => {
    if (text === 'beta') return 'Beta'; // beta is same in all languages
    if (text === 'new') return t(InfoTagTexts.newText);
    return text; // If neither 'beta' nor 'new', return original text
  };

  return (
    <InfoChip
      text={getLocalizedText()}
      interactiveColor="interactive_0"
      style={[styles.infoLabel, style]}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  infoLabel: {
    backgroundColor: theme.static.status.info.background,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.circle,
  },
}));
