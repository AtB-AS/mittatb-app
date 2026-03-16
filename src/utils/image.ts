import ImageResizer from '@bam.tech/react-native-image-resizer';
import {readFile} from '@dr.pogodin/react-native-fs';
import {notifyBugsnag} from './bugsnag-utils';

const EMPTY_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAABJRu5ErkJggg==';

export async function compressImageToBase64(
  path: string,
  maxWidth: number,
  maxHeight: number,
): Promise<string> {
  try {
    const compressed = await ImageResizer.createResizedImage(
      path,
      maxHeight,
      maxWidth,
      'JPEG',
      70,
    );
    const base64 = await readFile(compressed.uri, 'base64');
    return base64;
  } catch (error) {
    notifyBugsnag('Image compression error', {metadata: {error}});
    //on error, return a 1x1 transparent png
    return EMPTY_IMAGE_BASE64;
  }
}
