import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Qr} from '@atb/assets/svg/mono-icons/ticketing';
import {useAnalyticsContext} from '@atb/analytics';
import {MapTexts, useTranslation} from '@atb/translations';
import {useControlPositionsStyle} from '../hooks/use-control-styles';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';

type ScanButtonProps = {
  /*
    onPressCallback is currently used to reset selectedFeature state from useUpdateBottomSheetWhenSelectedEntityChanges.
    This can be removed if the reset function comes from MapContext instead.
   */
  onPressCallback: () => void;
  tabBarHeight?: number;
};
export const ScanButton = ({
  onPressCallback,
  tabBarHeight,
}: ScanButtonProps) => {
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const styles = useStyles();
  const analytics = useAnalyticsContext();
  const navigation = useNavigation<RootNavigationProps>();
  const {t} = useTranslation();
  const {mapButtonsContainer} = useControlPositionsStyle(false, tabBarHeight);
  const {close: closeBottomSheet} = useBottomSheetContext();

  return (
    <Button
      expanded={false}
      style={{...styles.scanButton, bottom: mapButtonsContainer.bottom}}
      type="small"
      interactiveColor={interactiveColor}
      accessibilityRole="button"
      onPress={() => {
        closeBottomSheet();
        analytics.logEvent('Map', 'Scan');
        navigation.navigate('Root_ScanQrCodeScreen');
        onPressCallback();
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
    marginBottom: theme.spacing.small,
  },
}));
