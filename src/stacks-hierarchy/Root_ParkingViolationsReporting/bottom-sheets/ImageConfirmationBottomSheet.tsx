import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {PhotoFile} from '@atb/components/camera';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {Image, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Coordinates} from '@atb/utils/coordinates';
import {UserPositionMap} from '../components/UserPositionMap';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';

type Props = {
  file: PhotoFile;
  position: Coordinates | undefined;
  onConfirm: () => void;
  close: () => void;
};

export const ImageConfirmationBottomSheet = ({
  file,
  position,
  onConfirm,
  close,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        color={'background_1'}
        setFocusOnLoad={false}
        title={t(ParkingViolationTexts.imageConfirmation.title)}
      />
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
            <UserPositionMap
              style={styles.fullHeight}
              userPosition={position}
            />
          </View>
        </View>
        <Button
          style={styles.button}
          onPress={onConfirm}
          text={t(ParkingViolationTexts.imageConfirmation.confirmButton)}
        />
        <Button
          style={styles.button}
          mode="secondary"
          interactiveColor={'interactive_2'}
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
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    imageAndPosition: {
      flexDirection: 'row',
      columnGap: theme.spacings.medium,
    },
    fullHeight: {
      flex: 1,
    },
    button: {
      marginTop: theme.spacings.medium,
    },
  };
});
