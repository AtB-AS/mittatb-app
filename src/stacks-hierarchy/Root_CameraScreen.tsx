import {ThemeText} from '@atb/components/text';
import {Camera, CameraType} from 'expo-camera';
import {useEffect} from 'react';
import {View} from 'react-native';
import {RootStackScreenProps} from './navigation-types';

export type Props = RootStackScreenProps<'Root_CameraScreen'>;

export function Root_CameraScreen({}: Props) {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission)
    return (
      <View>
        <ThemeText>Ingen tilgang til kamera</ThemeText>
      </View>
    );

  return (
    <View style={{height: '100%'}}>
      <Camera type={CameraType.front}></Camera>
    </View>
  );
}
