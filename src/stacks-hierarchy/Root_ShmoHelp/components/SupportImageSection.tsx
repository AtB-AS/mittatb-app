import {useRef, useState} from 'react';
import {ActionSheetIOS, Alert, Platform, View} from 'react-native';
import {Button} from '@atb/components/button';
import {ContentHeading} from '@atb/components/heading';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ButtonSectionItem, Section} from '@atb/components/sections';
import {BottomSheetModalMethods} from '@atb/components/bottom-sheet';
import {ImageConfirmationBottomSheet} from '@atb/components/PhotoCapture';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {dictionary, useTranslation} from '@atb/translations';
import {ContactShmoOperatorTexts} from '@atb/translations/screens/ContactScooterOperator';
import {MAX_UPLOAD_IMAGE_COUNT} from '@atb/api/types/mobility';
import {SUPPORT_IMAGE_FILE_TYPE, SupportImage} from '../use-support-images';

type Props = {
  images: SupportImage[];
  isAddingImages: boolean;
  hasPickerError: boolean;
  onPickFromLibrary: () => void;
  onRemoveImage: (id: string) => void;
  onTakePhoto: () => void;
};

export const SupportImageSection = ({
  images,
  isAddingImages,
  hasPickerError,
  onPickFromLibrary,
  onRemoveImage,
  onTakePhoto,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const isFull = images.length >= MAX_UPLOAD_IMAGE_COUNT;

  const previewSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const onCloseFocusRef = useRef<View | null>(null);

  const [previewed, setPreviewed] = useState<{
    image: SupportImage;
    position: number;
  } | null>(null);

  const promptForSource = () => {
    const title = t(ContactShmoOperatorTexts.image.source.title);
    const camera = t(ContactShmoOperatorTexts.image.source.camera);
    const library = t(ContactShmoOperatorTexts.image.source.library);
    const cancel = t(dictionary.cancel);

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {title, options: [camera, library, cancel], cancelButtonIndex: 2},
        (index) => {
          if (index === 0) onTakePhoto();
          if (index === 1) onPickFromLibrary();
        },
      );
    } else {
      Alert.alert(title, undefined, [
        {text: camera, onPress: onTakePhoto},
        {text: library, onPress: onPickFromLibrary},
        {text: cancel, style: 'cancel'},
      ]);
    }
  };

  const openPreview = (image: SupportImage, position: number) => {
    setPreviewed({image, position});
    previewSheetRef.current?.present();
  };

  return (
    <View style={styles.container} ref={onCloseFocusRef}>
      <ContentHeading
        text={t(ContactShmoOperatorTexts.image.header(MAX_UPLOAD_IMAGE_COUNT))}
      />
      {!isFull && (
        <Button
          mode="secondary"
          expanded={true}
          onPress={promptForSource}
          loading={isAddingImages}
          text={t(ContactShmoOperatorTexts.image.addButton)}
          backgroundColor={theme.color.background.neutral[0]}
        />
      )}
      {hasPickerError && (
        <MessageInfoBox
          type="error"
          message={t(ContactShmoOperatorTexts.image.error)}
          a11yLiveRegion="polite"
        />
      )}
      {images.length > 0 && (
        <Section>
          {images.map((image, index) => (
            <ButtonSectionItem
              key={image.id}
              label={t(ContactShmoOperatorTexts.image.label(index + 1))}
              value={t(ContactShmoOperatorTexts.image.view)}
              containerStyle={styles.rowValue}
              accessibilityHint={t(
                ContactShmoOperatorTexts.image.removeA11yHint(index + 1),
              )}
              onPress={() => openPreview(image, index + 1)}
            />
          ))}
        </Section>
      )}

      <ImageConfirmationBottomSheet
        file={
          previewed
            ? `data:${SUPPORT_IMAGE_FILE_TYPE};base64,${previewed.image.fileData}`
            : undefined
        }
        bottomSheetModalRef={previewSheetRef}
        onCloseFocusRef={onCloseFocusRef}
        heading={
          previewed
            ? t(ContactShmoOperatorTexts.image.label(previewed.position))
            : undefined
        }
        confirmText={t(ContactShmoOperatorTexts.image.keep)}
        onConfirm={() => previewSheetRef.current?.dismiss()}
        dismissText={t(dictionary.remove)}
        onDismiss={() => previewed && onRemoveImage(previewed.image.id)}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  rowValue: {
    alignItems: 'flex-end',
  },
  container: {
    rowGap: theme.spacing.small,
  },
}));
