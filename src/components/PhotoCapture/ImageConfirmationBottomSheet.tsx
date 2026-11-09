import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useState} from 'react';
import {Image, useWindowDimensions, View} from 'react-native';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
  BottomSheetModalMethods,
} from '../bottom-sheet';
import {giveFocus} from '@atb/utils/use-focus-on-load';

type Props = {
  file: string | undefined;
  onConfirm: () => void;
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods | null>;
  onCloseFocusRef: React.RefObject<View | null>;
  heading: string | undefined;
  confirmText: string;
  dismissText: string;
  onDismiss?: () => void;
};

export const ImageConfirmationBottomSheet = ({
  file,
  onConfirm,
  bottomSheetModalRef,
  onCloseFocusRef,
  heading,
  confirmText,
  dismissText,
  onDismiss,
}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {height: windowHeight} = useWindowDimensions();
  const [availableWidth, setAvailableWidth] = useState(0);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  }>();

  const framePadding = theme.spacing.small;
  const maxWidth = availableWidth - 2 * framePadding;
  const maxHeight = windowHeight * 0.3;
  const scale = imageSize
    ? Math.min(maxWidth / imageSize.width, maxHeight / imageSize.height)
    : 1;
  const imageDimensions = imageSize
    ? {width: imageSize.width * scale, height: imageSize.height * scale}
    : {width: maxWidth, height: maxHeight};

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={heading}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => {
        giveFocus(onCloseFocusRef);
      }}
    >
      <View style={styles.container}>
        {!!file && (
          <View onLayout={(e) => setAvailableWidth(e.nativeEvent.layout.width)}>
            {availableWidth > 0 && (
              <View style={styles.frame}>
                <Image
                  source={{uri: file}}
                  style={[styles.image, imageDimensions]}
                  resizeMode="contain"
                  onLoad={(e) =>
                    setImageSize({
                      width: e.nativeEvent.source.width,
                      height: e.nativeEvent.source.height,
                    })
                  }
                />
              </View>
            )}
          </View>
        )}
        <Button
          surfaceColor="accent"
          expanded={true}
          style={styles.button}
          onPress={onConfirm}
          text={confirmText}
        />
        <Button
          surfaceColor="accent"
          expanded={true}
          style={styles.button}
          mode="secondary"
          onPress={() => {
            bottomSheetModalRef.current?.dismiss();
            onDismiss?.();
          }}
          text={dismissText}
        />
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      marginHorizontal: theme.spacing.medium,
    },
    frame: {
      alignSelf: 'center',
      padding: theme.spacing.small,
      borderRadius: theme.border.radius.regular,
      backgroundColor: theme.color.background.neutral[0].background,
    },
    image: {
      borderRadius: theme.border.radius.small,
    },
    button: {
      marginTop: theme.spacing.medium,
    },
  };
});
