import {useCallback, useEffect, useState} from 'react';
import {v4 as uuid} from 'uuid';
import {
  MAX_UPLOAD_IMAGE_COUNT,
  SUPPORT_IMAGE_MAX_SIZE,
} from '@atb/api/types/mobility';
import {compressImageToBase64} from '@atb/utils/image';
import {launchImageLibrary} from 'react-native-image-picker';
import {errorToMetadata, notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {create} from 'zustand';

export const SUPPORT_IMAGE_FILE_TYPE = 'image/jpeg';

type PendingSupportPhotoStore = {
  pendingPhoto: {path: string} | null;
  setPendingPhoto: (path: string) => void;
  clearPendingPhoto: () => void;
};

// used to get a picture from the camera screen back to the support form
export const usePendingSupportPhotoStore = create<PendingSupportPhotoStore>(
  (set) => ({
    pendingPhoto: null,
    setPendingPhoto: (path) => set({pendingPhoto: {path}}),
    clearPendingPhoto: () => set({pendingPhoto: null}),
  }),
);

export type SupportImage = {
  id: string;
  fileData: string;
};

export const useSupportImages = () => {
  const [images, setImages] = useState<SupportImage[]>([]);
  const [isAddingImages, setIsAddingImages] = useState(false);
  const [hasPickerError, setHasPickerError] = useState(false);
  const pendingPhoto = usePendingSupportPhotoStore(
    (state) => state.pendingPhoto,
  );
  const clearPendingPhoto = usePendingSupportPhotoStore(
    (state) => state.clearPendingPhoto,
  );

  const addImages = useCallback(async (paths: string[]) => {
    setIsAddingImages(true);
    try {
      const added = await Promise.all(
        paths.map(async (path) => {
          const compressed = await compressImageToBase64(
            path,
            SUPPORT_IMAGE_MAX_SIZE,
            SUPPORT_IMAGE_MAX_SIZE,
          );
          // compressImageToBase64 returns bare base64; the split only guards
          // against it gaining a data URI prefix later.
          return {id: uuid(), fileData: compressed.split(',').pop() ?? ''};
        }),
      );
      setImages((prev) => [...prev, ...added].slice(0, MAX_UPLOAD_IMAGE_COUNT));
    } finally {
      setIsAddingImages(false);
    }
  }, []);

  const pickFromLibrary = useCallback(async () => {
    setHasPickerError(false);
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: MAX_UPLOAD_IMAGE_COUNT - images.length,
      });
      if (result.didCancel) return;
      // A refusal comes back as an errorCode, while an unregistered native
      // module throws outright. Both are the same failure to the user.
      if (result.errorCode) {
        throw new Error(`${result.errorCode}: ${result.errorMessage ?? ''}`);
      }
      const paths =
        result.assets
          ?.map((asset) => asset.uri)
          .filter((uri): uri is string => !!uri) ?? [];
      if (paths.length) await addImages(paths);
    } catch (e) {
      notifyBugsnag('Support image library picker failed', {
        metadata: errorToMetadata(e),
      });
      setHasPickerError(true);
    }
  }, [images.length, addImages]);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
  }, []);

  useEffect(() => {
    if (!pendingPhoto) return;
    addImages([pendingPhoto.path]);
    clearPendingPhoto();
  }, [pendingPhoto, addImages, clearPendingPhoto]);

  return {
    images,
    isAddingImages,
    hasPickerError,
    addImages,
    pickFromLibrary,
    removeImage,
  };
};
