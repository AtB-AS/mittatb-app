import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {PhotoFile} from '@atb/components/camera';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {Image, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  file: PhotoFile;
  onConfirm: () => void;
  close: () => void;
};

export const ImageConfirmationBottomSheet = ({
  file,
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
        title="Er du fornøyd med bildet?"
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageAndPosition}>
          <View style={styles.image}>
            <Image
              source={{uri: file.path}}
              style={{
                resizeMode: 'cover',
                aspectRatio: 3 / 4,
              }}
            />
          </View>
          <View style={styles.position}></View>
        </View>
        <Button style={styles.button} onPress={onConfirm} text="Ja" />
        <Button
          style={styles.button}
          mode="secondary"
          interactiveColor={'interactive_2'}
          onPress={close}
          text="Ta nytt bilde"
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
    image: {
      backgroundColor: 'lightblue',
      flex: 1,
      // minHeight: 200,
    },
    position: {
      backgroundColor: 'lightgreen',
      flex: 1,
    },
    button: {
      marginTop: theme.spacings.medium,
    },
  };
});
