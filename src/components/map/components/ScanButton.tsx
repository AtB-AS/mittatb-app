import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {Qr} from '@atb/assets/svg/mono-icons/ticketing';
import {useAnalytics} from '@atb/analytics';
import {MapTexts, useTranslation} from '@atb/translations';
import {useControlPositionsStyle} from '../hooks/use-control-styles';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useBottomSheet} from '@atb/components/bottom-sheet';

export const ScanButton = () => {
  const styles = useStyles();
  const analytics = useAnalytics();
  const navigation = useNavigation<RootNavigationProps>();
  const {t} = useTranslation();
  const {controlsContainer} = useControlPositionsStyle();
  const {close: closeBottomSheet} = useBottomSheet();

  return (
    <Button
      style={{...styles.scanButton, bottom: controlsContainer.bottom}}
      type="medium"
      compact={true}
      interactiveColor="interactive_2"
      accessibilityRole="button"
      onPress={() => {
        closeBottomSheet();
        analytics.logEvent('Map', 'Scan');
        navigation.navigate('Root_ScanQrCodeToSelectVehicleScreen');
      }}
      text={t(MapTexts.qr.scan)}
      rightIcon={{svg: Qr}}
      hasShadow={true}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  scanButton: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'center',
    pointerEvents: 'auto',
    marginBottom: theme.spacings.small,
  },
}));
