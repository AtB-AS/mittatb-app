import {z} from 'zod';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {AppPlatform} from '@atb/modules/global-messages';
import {Timestamp} from '@react-native-firebase/firestore';
import {Rule} from '@atb/modules/rule-engine';

const TimestampSchema = z
  .custom<Timestamp>((value) => value instanceof Timestamp)
  .transform((ts) => new Date(ts.toMillis()));

const Base64ImageSchema = z
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

export enum ActionType {
  external = 'external',
  deeplink = 'deeplink',
  bottom_sheet = 'bottom_sheet',
}

const UrlActionButton = z.object({
  label: LanguageAndTextTypeArray.optional(),
  url: z.string().url(),
  actionType: z.union([
    z.literal(ActionType.external),
    z.literal(ActionType.deeplink),
  ]),
});

export type UrlActionButton = z.infer<typeof UrlActionButton>;

const BottomSheetActionButton = z.object({
  label: LanguageAndTextTypeArray.optional(),
  actionType: z.literal(ActionType.bottom_sheet),
  /** Action button for bottom sheet, only shown in bottom sheet, only used for deeplinks or external links */
  sheetPrimaryButton: UrlActionButton.optional(),
});

export type BottomSheetActionButton = z.infer<typeof BottomSheetActionButton>;

const AnnouncementBase = z.object({
  id: z.string(),
  active: z.boolean(),

  /** Index used to sort by. The lower the integer, the earlier in the list it will be. Undefined values default to last. */
  sortByIndex: z.number().int().default(Infinity),

  /** Announcement card title */
  summaryTitle: LanguageAndTextTypeArray.optional(),
  /** Announcement card summary */
  summary: LanguageAndTextTypeArray,
  /** Announcement card image */
  summaryImage: Base64ImageSchema.optional(),

  /** Announcement bottom sheet title, also used as card title if no summaryTitle is provided */
  fullTitle: LanguageAndTextTypeArray,

  appPlatforms: z.array(AppPlatform).optional(),
  appVersionMin: z.string().optional(),
  appVersionMax: z.string().optional(),
  startDate: TimestampSchema.optional(),
  endDate: TimestampSchema.optional(),
  rules: z.array(Rule).optional(),
  actionButton: z.union([UrlActionButton, BottomSheetActionButton]).optional(),
});

export const LinkAnnouncement = AnnouncementBase.extend({
  actionButton: UrlActionButton,
});

export const BottomSheetAnnouncement = AnnouncementBase.extend({
  /** Announcement bottom sheet body */
  body: LanguageAndTextTypeArray,
  /** Announcement bottom sheet image */
  mainImage: Base64ImageSchema.optional(),

  actionButton: BottomSheetActionButton,
});

export const Announcement = z.union([
  BottomSheetAnnouncement,
  LinkAnnouncement,
  AnnouncementBase,
]);

export type LinkAnnouncement = z.infer<typeof LinkAnnouncement>;
export type BottomSheetAnnouncement = z.infer<typeof BottomSheetAnnouncement>;
export type Announcement = z.infer<typeof Announcement>;

export function isBottomSheetAnnouncement(
  announcement: Announcement,
): announcement is BottomSheetAnnouncement {
  return announcement.actionButton?.actionType === ActionType.bottom_sheet;
}

export function isLinkAnnouncement(
  announcement: Announcement,
): announcement is LinkAnnouncement {
  return (
    announcement.actionButton?.actionType === ActionType.external ||
    announcement.actionButton?.actionType === ActionType.deeplink
  );
}
