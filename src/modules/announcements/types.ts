import {z} from 'zod';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {AppPlatform} from '@atb/modules/global-messages';
import {Timestamp} from '@react-native-firebase/firestore';
import {Rule} from '@atb/modules/rule-engine';

const TimestampSchema = z
  .custom<Timestamp>((value) => value instanceof Timestamp)
  .transform((ts) => new Date(ts.toMillis()));

const b64ImagePrefix = 'data:image/';
const Base64ImageSchema = z
  .string()
  .min((b64ImagePrefix + 'png;base64,').length)
  .max(700000) // images should not be too large
  .startsWith(b64ImagePrefix)
  .refine(
    // ensure valid file type
    (imgStr) => {
      const end = imgStr.indexOf(';', b64ImagePrefix.length);
      if (end === -1) return false;
      const fileType = imgStr.slice(b64ImagePrefix.length, end);
      const allowedFileTypes = ['png', 'jpeg', 'jpg'];
      return allowedFileTypes.includes(fileType);
    },
    {message: 'Unsupported image file type'},
  )
  .refine(
    // ensure valid base64 data
    (imgStr) => {
      try {
        const base64Part = imgStr.split(',')[1];
        if (!base64Part) return false;
        // Due to performance concerns, only validate the first and last x chars as base64
        const numberOfChars = 4 * 10; // needs to be a number divisible by 4
        const start = base64Part.slice(0, numberOfChars);
        const end = base64Part.slice(
          base64Part.length - numberOfChars,
          base64Part.length,
        );
        z.string().base64().parse(start);
        z.string().base64().parse(end);
        return true;
      } catch {
        return false;
      }
    },
    {message: 'Invalid base64 payload'},
  );

export enum ActionType {
  external = 'external',
  deeplink = 'deeplink',
  bottom_sheet = 'bottom_sheet',
}
const BottomSheetActionButton = z.object({
  label: LanguageAndTextTypeArray.optional(),
  actionType: z.literal(ActionType.bottom_sheet),
});
const UrlActionButton = z.object({
  label: LanguageAndTextTypeArray.optional(),
  url: z.string().url(),
  actionType: z.union([
    z.literal(ActionType.external),
    z.literal(ActionType.deeplink),
  ]),
});
const ActionButton = z.union([BottomSheetActionButton, UrlActionButton]);

export const Announcement = z.object({
  id: z.string(),
  active: z.boolean(),
  summaryTitle: LanguageAndTextTypeArray.optional(),
  summary: LanguageAndTextTypeArray,
  summaryImage: Base64ImageSchema.optional(),
  fullTitle: LanguageAndTextTypeArray,
  body: LanguageAndTextTypeArray,
  mainImage: Base64ImageSchema.optional(),
  isDismissable: z.boolean().optional(),
  appPlatforms: z.array(AppPlatform).optional(),
  appVersionMin: z.string().optional(),
  appVersionMax: z.string().optional(),
  startDate: TimestampSchema.optional(),
  endDate: TimestampSchema.optional(),
  rules: z.array(Rule).optional(),
  actionButton: ActionButton.optional(),
});
export type Announcement = z.infer<typeof Announcement>;
