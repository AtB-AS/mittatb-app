import ImageResizer, {Response} from '@bam.tech/react-native-image-resizer';
import {notifyBugsnag} from './bugsnag-utils';

export async function compressImage(
  path: string,
  maxWidth: number,
  maxHeight: number,
): Promise<Response | undefined> {
  try {
    const compressed = await ImageResizer.createResizedImage(
      path,
      maxHeight,
      maxWidth,
      'JPEG',
      70,
    );
    return compressed;
  } catch (error) {
    notifyBugsnag('Image compression error', {metadata: {error}});
  }
}
