import {z} from 'zod';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {AppPlatform} from '@atb/modules/global-messages';
import {Timestamp} from '@react-native-firebase/firestore';
import {Rule} from '@atb-as/utils';
import {Base64ImageSchema} from '@atb/utils/image';

const TimestampSchema = z
  .custom<Timestamp>((value) => value instanceof Timestamp)
  .transform((ts) => new Date(ts.toMillis()));

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
