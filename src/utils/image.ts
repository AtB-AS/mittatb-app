import ImageResizer from '@bam.tech/react-native-image-resizer';
import {notifyBugsnag} from './bugsnag-utils';

export async function compressImage(
  path: string,
  maxWidth: number,
  maxHeight: number,
): Promise<Blob | undefined> {
  try {
    const compressed = await ImageResizer.createResizedImage(
      path,
      maxHeight,
      maxWidth,
      'JPEG',
      70,
    );
    const result = await fetch(compressed.uri);
    return await result.blob();
  } catch (error) {
    notifyBugsnag('Image compression error', {metadata: {error}});
  }
}
