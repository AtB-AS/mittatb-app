import {StyleSheet} from '@atb/theme';
import {hasProp} from '@atb/utils/object';
import {useRef} from 'react';
import {Linking, StyleProp, View, ViewStyle} from 'react-native';
import {Camera as CameraKitCamera, CameraType} from 'react-native-camera-kit';
import {Processing} from '../loading';
import {MessageBox} from '../message-box';
import {CaptureButton} from './CaptureButton';
import {PhotoFile} from './types';
import {usePermissions} from './use-permissions';

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
  zoom?: number;
} & (PhotoProps | QrProps);

export const Camera = ({style = {}, zoom = 1, mode, onCapture}: Props) => {
  const camera = useRef<CameraKitCamera>(null);
  const styles = useStyles();
  const {isAuthorized} = usePermissions();

  const handleCapture = async () => {
    if (mode === 'photo') {
      try {
        const photo = await camera.current?.capture();
        if (photo) {
          onCapture({
            path: photo.path,
            height: photo.height,
            width: photo.width,
          });
        }
      } catch (e) {
        console.error(e);
      }
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
          scanBarcode={mode === 'qr'}
          showFrame={mode === 'qr'}
          onReadCode={(e: unknown) => {
            if (
              mode === 'qr' &&
              hasProp(e, 'nativeEvent') &&
              hasProp(e.nativeEvent, 'codeStringValue') &&
              typeof e.nativeEvent.codeStringValue === 'string'
            ) {
              onCapture(e.nativeEvent.codeStringValue);
            }
          }}
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
