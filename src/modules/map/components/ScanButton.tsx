import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Qr} from '@atb/assets/svg/mono-icons/ticketing';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {MapTexts, useTranslation} from '@atb/translations';
import {useControlPositionsStyle} from '../hooks/use-control-styles';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {useMapContext} from '../MapContext';
import {MapStateActionType} from '../mapStateReducer';

export const ScanButton = ({
  navigateToScanQrCode,
}: {
  navigateToScanQrCode: () => void;
}) => {
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const styles = useStyles();
  const analytics = useAnalyticsContext();
  const {t} = useTranslation();
  const {mapButtonsContainer} = useControlPositionsStyle(false);
  const {close: closeBottomSheet} = useBottomSheetContext();
  const {dispatchMapState} = useMapContext();

  return (
    <Button
      expanded={false}
      style={{...styles.scanButton, bottom: mapButtonsContainer.bottom}}
      type="large"
      interactiveColor={interactiveColor}
      accessibilityRole="button"
      onPress={() => {
        closeBottomSheet();
        analytics.logEvent('Map', 'Scan');
        navigateToScanQrCode();
        dispatchMapState({type: MapStateActionType.None});
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
