import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {Image, View} from 'react-native';
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
          <Image
            source={{uri: file}}
            style={styles.image}
            resizeMode="contain"
          />
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
    image: {
      width: '100%',
      aspectRatio: 4 / 3,
      backgroundColor: theme.color.background.neutral[1].background,
    },
    button: {
      marginTop: theme.spacing.medium,
    },
  };
});
