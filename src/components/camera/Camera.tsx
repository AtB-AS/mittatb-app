import {StyleSheet, useThemeContext} from '@atb/theme';
import {RefObject, useRef, useState} from 'react';
import {Linking, Platform, StyleProp, View, ViewStyle} from 'react-native';
import {Processing} from '../loading';
import {MessageInfoBox} from '../message-info-box';
import {CaptureButton} from './CaptureButton';
import {PhotoFile} from './types';
import {usePermissions} from './use-permissions';
import CameraTexts from '@atb/translations/components/Camera';
import {useTranslation} from '@atb/translations';
import {Button} from '../button';
import {
  Camera as CameraApi,
  Camera as VisionCamera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Flash, NoFlash} from '@atb/assets/svg/mono-icons/miscellaneous';

type PhotoProps = {
  mode: 'photo';
  onCapture: (photo: PhotoFile) => void;
};
type QrProps = {
  mode: 'qr';
  onCapture: (qr: string) => void;
};

type Props = {
  style?: StyleProp<ViewStyle>;
  focusRef?: RefObject<any>;
  bottomButtonNode?: React.ReactNode;
} & (PhotoProps | QrProps);

export const Camera = ({
  style = {},
  mode,
  onCapture,
  focusRef,
  bottomButtonNode,
}: Props) => {
  const camera = useRef<CameraApi>(null);
  const styles = useStyles();
  const {isAuthorized} = usePermissions();
  const {t} = useTranslation();
  const [torch, setTorch] = useState<'on' | 'off'>('off');
  const {theme} = useThemeContext();
  const device = useCameraDevice('back');
  const [footerHeight, setFooterHeight] = useState(0);
  const {bottom: safeBottomInset} = useSafeAreaInsets();

  const handleCapture = async () => {
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
        console.error('takePhoto error', e);
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

  if (isAuthorized === undefined) {
    return (
      <View style={styles.loadingIndicator}>
        <Processing message={t(CameraTexts.loading)} />
      </View>
    );
  }

  if (isAuthorized) {
    return (
      <View style={style}>
        {device && (
          <VisionCamera
            ref={camera}
            style={StyleSheet.absoluteFill}
            enableZoomGesture={true}
            device={device}
            isActive
            photo={mode === 'photo'}
            torch={torch}
            resizeMode="cover"
            codeScanner={mode === 'qr' ? codeScanner : undefined}
          />
        )}
        {mode === 'qr' && <View pointerEvents="none" style={styles.qrFrame} />}
        <View
          pointerEvents="box-none"
          style={[
            styles.cameraButtonsWrapper,
            footerHeight > 0
              ? {paddingBottom: theme.spacing.medium}
              : {paddingBottom: safeBottomInset + theme.spacing.medium},
          ]}
        >
          <Button
            mode="primary"
            onPress={() => setTorch(torch === 'on' ? 'off' : 'on')}
            style={[styles.flashlightButton, {marginBottom: footerHeight}]}
            text={t(CameraTexts.flashlight.default)}
            expanded={false}
            active={torch === 'on'}
            interactiveColor={theme.color.interactive[2]}
            rightIcon={torch === 'on' ? {svg: Flash} : {svg: NoFlash}}
            accessibilityLabel={t(CameraTexts.flashlight[torch])}
          />
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
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.loadingIndicator}>
        <MessageInfoBox
          title={t(CameraTexts.permissionRequired.title)}
          message={t(CameraTexts.permissionRequired.message)}
          type="warning"
          onPressConfig={{
            action: () => Linking.openSettings(),
            text: t(CameraTexts.permissionRequired.action),
          }}
        />
      </View>
    );
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom: safeBottomInset} = useSafeAreaInsets();
  return {
    loadingIndicator: {
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.medium,
    },
    qrFrame: {
      position: 'absolute',
      alignSelf: 'center',
      top: '25%',
      width: 200,
      height: 200,
      borderColor: 'white',
      borderWidth: 2,
    },
    cameraButtonsWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      gap: theme.spacing.large,
    },
    captureButton: {
      marginTop: theme.spacing.medium,
      alignItems: 'center',
    },
    flashlightButton: {
      alignSelf: 'center',
      gap: theme.spacing.large,
    },
    footerWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: theme.spacing.large,
      paddingBottom: safeBottomInset + theme.spacing.medium,
      alignItems: 'center',
      gap: theme.spacing.large,
      backgroundColor: 'black',
    },
  };
});
