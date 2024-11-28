import {StyleSheet, useTheme} from '@atb/theme';
import {hasProp} from '@atb/utils/object';
import {RefObject, useRef} from 'react';
import {Linking, StyleProp, View, ViewStyle} from 'react-native';
import {Camera as CameraKitCamera, CameraType} from 'react-native-camera-kit';
import {Processing} from '../loading';
import {MessageInfoBox} from '../message-info-box';
import {CaptureButton} from './CaptureButton';
import {PhotoFile} from './types';
import {usePermissions} from './use-permissions';
import CameraTexts from '@atb/translations/components/Camera';
import {useTranslation} from '@atb/translations';

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
  focusRef?: RefObject<any>;
} & (PhotoProps | QrProps);

export const Camera = ({
  style = {},
  zoom = 1,
  mode,
  onCapture,
  focusRef,
}: Props) => {
  const camera = useRef<CameraKitCamera>(null);
  const styles = useStyles();
  const {isAuthorized} = usePermissions();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const handleCapture = async () => {
    if (mode === 'photo') {
      try {
        const photo = await camera.current?.capture();
        if (photo) {
          onCapture({
            path: photo.uri,
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
        <Processing message={t(CameraTexts.loading)} />
      </View>
    );
  }

  if (isAuthorized) {
    return (
      <View style={style}>
        <CameraKitCamera
          ref={camera}
          cameraType={CameraType.Back}
          style={{
            ...styles.camera,
            backgroundColor: 'transparent',
          }}
          zoom={zoom}
          scanBarcode={mode === 'qr'}
          showFrame={mode === 'qr'}
          frameColor={theme.color.interactive[0].default.background}
          laserColor="transparent"
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
        {mode !== 'qr' && (
          <CaptureButton
            style={styles.captureButton}
            onCapture={handleCapture}
            focusRef={focusRef}
          />
        )}
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.medium,
  },
  camera: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
  captureButton: {
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.large,
    alignItems: 'center',
  },
}));
