import ImageResizer from '@bam.tech/react-native-image-resizer';
import {readFile} from '@dr.pogodin/react-native-fs';
import {z} from 'zod';
import {notifyBugsnag} from './bugsnag-utils';

export const Base64ImageSchema = z
  .string()
  .max(700000) // images should not be too large
  .regex(/^data:image\/(png|jpeg|jpg);base64,.+$/, {
    message: 'Invalid image data URI',
  })
  .refine(
    (imgStr) => {
      const base64Part = imgStr.split(',')[1];
      if (!base64Part || base64Part.length % 4 !== 0) return false;
      // Due to performance concerns, only validate the start and end as base64 data
      const numberOfChars = 4 * 10; // must be divisible by 4
      const start = base64Part.slice(0, numberOfChars);
      const end = base64Part.slice(-numberOfChars);
      return [start, end].every(
        (part) => z.string().base64().safeParse(part).success,
      );
    },
    {message: 'Invalid base64 payload'},
  );

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
