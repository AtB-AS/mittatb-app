import {StyleSheet, useThemeContext} from '@atb/theme';
import {RefObject, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {CaptureButton} from './CaptureButton';
import {PhotoFile} from './types';
import CameraTexts from '@atb/translations/components/Camera';
import {useTranslation} from '@atb/translations';
import {FilterChip} from '../filter-chip';
import {
  Camera as CameraApi,
  Camera as VisionCamera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Flash, NoFlash} from '@atb/assets/svg/mono-icons/miscellaneous';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {errorToMetadata, logToBugsnag} from '@atb/utils/bugsnag-utils';
import DeviceInfo from 'react-native-device-info';
import {SessionReplayMask} from '@atb/modules/analytics';

type PhotoProps = {
  mode: 'photo';
  onCapture: (photo: PhotoFile) => void;
};
type QrProps = {
  mode: 'qr';
  onCapture: (qr: string) => void;
};

type Props = {
  focusRef?: RefObject<any>;
  bottomButtonNode?: React.ReactNode;
} & (PhotoProps | QrProps);

export const Camera = ({
  mode,
  onCapture,
  focusRef,
  bottomButtonNode,
}: Props) => {
  const camera = useRef<CameraApi>(null);
  const styles = useStyles();
  const {t} = useTranslation();
  const [torch, setTorch] = useState<'on' | 'off'>('off');
  const {theme} = useThemeContext();
  const device = useCameraDevice('back');
  const [footerHeight, setFooterHeight] = useState(0);
  const {bottom: safeBottomInset} = useSafeAreaInsets();
  const isFocused = useIsFocusedAndActive();

  const handleCapture = async () => {
    const isEmulator = await DeviceInfo.isEmulator();
    if (__DEV__ && isEmulator && mode === 'photo') {
      onCapture({path: 'https://picsum.photos/1080/1920'});
      return;
    }

    if (mode === 'photo') {
      try {
        const photo: PhotoFile | undefined = await camera.current?.takePhoto({
          flash: 'off',
          enableShutterSound: Platform.OS === 'android',
        });
        if (photo?.path) {
          const path =
            Platform.OS === 'android' ? `file://${photo.path}` : photo.path;
          onCapture({path});
        }
      } catch (e) {
        console.error('Capture error', e);
        logToBugsnag(`Camera campture error ${e}`, errorToMetadata(e));
      }
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (mode !== 'qr') return;
      const value = codes[0]?.value;
      if (value) onCapture(value);
    },
  });

  return (
    <>
      {device && (
        <View style={styles.container}>
          <SessionReplayMask style={StyleSheet.absoluteFill}>
            <VisionCamera
              ref={camera}
              style={StyleSheet.absoluteFill}
              enableZoomGesture={true}
              device={device}
              isActive={isFocused}
              resizeMode="cover"
              video={false}
              audio={false}
              photo={mode === 'photo'}
              torch={device?.hasTorch ? torch : undefined}
              codeScanner={mode === 'qr' ? codeScanner : undefined}
            />
          </SessionReplayMask>

          {mode === 'qr' && (
            <View pointerEvents="none" style={styles.qrFrame} />
          )}
          <FilterChip
            onPress={() => setTorch(torch === 'on' ? 'off' : 'on')}
            style={[
              styles.flashlightButton,
              footerHeight > 0
                ? {marginBottom: theme.spacing.medium + footerHeight}
                : {marginBottom: safeBottomInset + theme.spacing.medium},
            ]}
            text={t(CameraTexts.flashlight.default)}
            selected={torch === 'on'}
            rightIcon={torch === 'on' ? {svg: Flash} : {svg: NoFlash}}
          />
        </View>
      )}
      {mode !== 'qr' || bottomButtonNode ? (
        <View
          style={styles.footerWrapper}
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
        >
          {mode !== 'qr' && (
            <CaptureButton
              style={styles.captureButton}
              onCapture={handleCapture}
              focusRef={focusRef}
            />
          )}
          {bottomButtonNode}
        </View>
      ) : null}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme, {bottom}, {height}) => {
  return {
    container: {
      flex: 1,
    },
    qrFrame: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: height / 2,
      transform: [{translateY: 100}],
      width: 200,
      height: 200,
      borderColor: 'white',
      borderWidth: 2,
    },
    captureButton: {
      marginTop: theme.spacing.medium,
      alignItems: 'center',
    },
    flashlightButton: {
      position: 'absolute',
      bottom: 0,
      alignSelf: 'center',
    },
    footerWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: theme.spacing.large,
      paddingBottom: bottom + theme.spacing.medium,
      alignItems: 'center',
      gap: theme.spacing.large,
      backgroundColor: 'black',
    },
  };
});
