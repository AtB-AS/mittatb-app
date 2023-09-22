import {StyleSheet} from '@atb/theme';
import {RootStackScreenProps} from './navigation-types';
import {FullScreenHeader} from '@atb/components/screen-header';
import {View} from 'react-native';
import {Camera, PhotoFile} from '@atb/components/camera';

export type Props = RootStackScreenProps<'Root_CameraScreen'>;

export function Root_CameraScreen({}: Props) {
  const styles = useStyles();

  const handleCapture = (photo: PhotoFile) => {
    console.log(photo);
  };

  return (
    <>
      <FullScreenHeader leftButton={{type: 'cancel'}} />
      <View style={styles.container}>
        <Camera onCapture={handleCapture} />
      </View>
    </>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  container: {
    flex: 1,
  },
}));
