import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {PhotoFile} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {Image, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Coordinates} from '@atb/utils/coordinates';
import {UserCoordinatesMap} from '../components/UserCoordinatesMap';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';

type Props = {
  file: PhotoFile;
  coordinates: Coordinates | undefined;
  onConfirm: () => void;
};

export const ImageConfirmationBottomSheet = ({
  file,
  coordinates,
  onConfirm,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {close} = useBottomSheetContext();
  return (
    <BottomSheetContainer
      title={t(ParkingViolationTexts.imageConfirmation.title)}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageAndPosition}>
          <View style={styles.fullHeight}>
            <Image
              source={{uri: file.path}}
              style={{
                resizeMode: 'cover',
                aspectRatio: 3 / 4,
              }}
            />
          </View>
          <View style={styles.fullHeight}>
            <UserCoordinatesMap
              style={styles.fullHeight}
              userCoordinates={coordinates}
            />
          </View>
        </View>
        <Button
          expand={true}
          style={styles.button}
          onPress={onConfirm}
          text={t(ParkingViolationTexts.imageConfirmation.confirmButton)}
        />
        <Button
          expand={true}
          style={styles.button}
          mode="secondary"
          onPress={close}
          text={t(ParkingViolationTexts.imageConfirmation.retryButton)}
        />
      </ScrollView>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      flexGrow: 1,
      flexShrink: 0,
      marginBottom: Math.max(bottom, theme.spacing.medium),
      marginHorizontal: theme.spacing.medium,
    },
    imageAndPosition: {
      flexDirection: 'row',
      columnGap: theme.spacing.medium,
    },
    fullHeight: {
      flex: 1,
    },
    button: {
      marginTop: theme.spacing.medium,
    },
  };
});
