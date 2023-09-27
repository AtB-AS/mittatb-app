import {StyleSheet} from '@atb/theme';
import {useEffect, useRef, useState} from 'react';
import {
  Linking,
  StyleProp,
  View,
  ViewStyle,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Camera as CameraKitCamera, CameraType} from 'react-native-camera-kit';
import {Processing} from '../loading';
import {MessageBox} from '../message-box';
import {CaptureButton} from './CaptureButton';
import {PhotoFile} from './types';
const {CKCameraManager} = NativeModules;

type Props = {
  style?: StyleProp<ViewStyle>;
  zoom?: number;
  modes?: ('photo' | 'video')[];
  onCapture: (photo: PhotoFile) => void;
};

export const Camera = ({style = {}, zoom = 1, onCapture}: Props) => {
  const camera = useRef<CameraKitCamera>(null);
  const styles = useStyles();
  const [isAuthorized, setIsAuthorized] = useState<boolean>();

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
          buttonPositive: 'Accept',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        setIsAuthorized(await requestCameraPermission());
      } else {
        let authStatus =
          await CKCameraManager.checkDeviceCameraAuthorizationStatus();
        if (authStatus === -1) {
          authStatus =
            await CKCameraManager.checkDeviceCameraAuthorizationStatus();
        }
        setIsAuthorized(authStatus);
      }
    })();
  }, [CameraKitCamera]);

  const handleCapture = async () => {
    const photo = await camera.current?.capture();
    if (photo) {
      onCapture({path: photo.path, height: photo.height, width: photo.width});
    }
  };

  if (isAuthorized === undefined) {
    return (
      <View style={styles.loadingIndicator}>
        <Processing message={'Starter kamera...'} />
      </View>
    );
  }

  if (isAuthorized) {
    return (
      <View style={style}>
        <CameraKitCamera
          ref={camera}
          cameraType={CameraType.Back}
          style={styles.camera}
          zoom={zoom}
        />
        <CaptureButton style={styles.captureButton} onCapture={handleCapture} />
      </View>
    );
  } else {
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
    marginTop: theme.spacings.medium,
    alignItems: 'center',
  },
}));
