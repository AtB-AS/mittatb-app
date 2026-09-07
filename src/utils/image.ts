import {
  ImageFormat,
  Skia,
  type SkData,
  type SkImage,
  type SkSurface,
} from '@shopify/react-native-skia';
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
  let data: SkData | undefined;
  let source: SkImage | null | undefined;
  let surface: SkSurface | null | undefined;
  let snapshot: SkImage | undefined;
  try {
    data = await Skia.Data.fromURI(path);
    source = Skia.Image.MakeImageFromEncoded(data);
    if (!source) return EMPTY_IMAGE_BASE64;

    const srcW = source.width();
    const srcH = source.height();
    const scale = Math.min(maxWidth / srcW, maxHeight / srcH, 1);
    const dstW = Math.max(1, Math.round(srcW * scale));
    const dstH = Math.max(1, Math.round(srcH * scale));

    surface = Skia.Surface.MakeOffscreen(dstW, dstH);
    if (!surface) return EMPTY_IMAGE_BASE64;

    const paint = Skia.Paint();
    paint.setAntiAlias(true);
    surface
      .getCanvas()
      .drawImageRect(
        source,
        {x: 0, y: 0, width: srcW, height: srcH},
        {x: 0, y: 0, width: dstW, height: dstH},
        paint,
      );
    surface.flush();

    snapshot = surface.makeImageSnapshot();
    return snapshot.encodeToBase64(ImageFormat.JPEG, 70);
  } catch (error) {
    notifyBugsnag('Image compression error', {metadata: {error}});
    //on error, return a 1x1 transparent png
    return EMPTY_IMAGE_BASE64;
  } finally {
    snapshot?.dispose();
    surface?.dispose();
    source?.dispose();
    data?.dispose();
  }
}
