import {StyleSheet} from '@atb/theme';
import {useEffect, useRef, useState} from 'react';
import {Linking, StyleProp, View, ViewStyle} from 'react-native';
import {
  CameraPermissionRequestResult,
  Camera as VisionCamera,
  useCameraDevices,
} from 'react-native-vision-camera';
import {Processing} from '../loading';
import {MessageBox} from '../message-box';
import {CaptureButton} from './CaptureButton';
import {PhotoFile} from './types';

type Props = {
  style?: StyleProp<ViewStyle>;
  zoom?: number;
  modes?: ('photo' | 'video')[];
  onCapture: (photo: PhotoFile) => void;
};

export const Camera = ({
  style = {},
  zoom = 1,
  modes = ['photo'],
  onCapture,
}: Props) => {
  const camera = useRef<VisionCamera>(null);
  const styles = useStyles();
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionRequestResult>();
  const devices = useCameraDevices();
  const cameraDevice = devices.back;

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus =
        await VisionCamera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  const handleCapture = async () => {
    const photo = await camera.current?.takePhoto();
    if (photo) {
      onCapture({path: photo.path, height: photo.height, width: photo.width});
    }
  };

  if (cameraPermission === 'denied') {
    return (
      <View style={styles.loadingIndicator}>
        <MessageBox
          title="Gi tilgang til kamera"
          message="For å bruke denne funksjonen må du gi AtB-appen tilgang til å bruke kamera. Det gjør du under Personvern og sikkerhet i Innstillinger."
          type={'warning'}
          onPressConfig={{
            action: () => Linking.openSettings(),
            text: 'Gå til Innstilinger',
          }}
        />
      </View>
    );
  }

  if (cameraDevice && cameraPermission === 'authorized') {
    return (
      <View style={style}>
        <VisionCamera
          ref={camera}
          device={cameraDevice}
          isActive={true}
          style={styles.camera}
          zoom={zoom}
          photo={modes.includes('photo')}
          video={modes.includes('video')}
        />
        <CaptureButton style={styles.captureButton} onCapture={handleCapture} />
      </View>
    );
  }
  if (!cameraDevice && cameraPermission === 'authorized') {
    return (
      <View style={styles.loadingIndicator}>
        <MessageBox
          message="Her må det inn en forklaring. Mest sannsynlig er du på Simulator"
          title="Tilkobling til kamera feilet"
          type="error"
        />
      </View>
    );
  }
  return (
    <View style={styles.loadingIndicator}>
      <Processing message={'Starter kamera...'} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacings.medium,
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
}));
