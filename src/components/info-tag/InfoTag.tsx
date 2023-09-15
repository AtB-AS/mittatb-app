import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {InfoChip} from '../info-chip';
import {InfoTagTexts, useTranslation} from '@atb/translations';

type Props = {
  mode: 'beta' | 'new';
  style?: StyleProp<ViewStyle>;
};
export const InfoTag = ({mode, style}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const getLocalizedText = () => {
    if (mode === 'new') return t(InfoTagTexts.newText);
    else {
      return 'Beta';
    }
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
