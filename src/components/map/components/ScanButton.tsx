import React from 'react';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {Qr} from '@atb/assets/svg/mono-icons/ticketing';
import {useAnalytics} from '@atb/analytics';
import {MapTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {useControlPositionsStyle} from '../hooks/use-control-styles';

type ScanButtonProps = {
  onPress: () => void;
};
export const ScanButton = ({onPress}: ScanButtonProps) => {
  const styles = useStyles();
  const analytics = useAnalytics();
  const {t} = useTranslation();

  const {controlsContainer} = useControlPositionsStyle();

  return (
    <View
      style={{
        ...styles.scanButtonContainer,
        bottom: controlsContainer.bottom,
      }}
    >
      <Button
        style={styles.scanButton}
        type="medium"
        compact={true}
        interactiveColor="interactive_2"
        accessibilityRole="button"
        onPress={() => {
          analytics.logEvent('Map', 'Scan');
          onPress();
        }}
        text={t(MapTexts.qr.scan)}
        rightIcon={{svg: Qr}}
        hasShadow={true}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  scanButtonContainer: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scanButton: {
    marginBottom: theme.spacings.small,
  },
}));
