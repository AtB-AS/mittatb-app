import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {LinkSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';

type Props = {
  navigateToSupport: () => void;
};

export const SupportButton = ({navigateToSupport}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.supportButton}>
      <LinkSectionItem
        text={t(MobilityTexts.helpText)}
        onPress={navigateToSupport}
        radius="top-bottom"
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook(() => {
  return {
    supportButton: {
      width: '100%',
      marginTop: 'auto',
    },
  };
});
