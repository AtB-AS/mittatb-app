import {z} from 'zod';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {AppPlatform} from '@atb/modules/global-messages';
import {Timestamp} from '@react-native-firebase/firestore';
import {Rule} from '@atb/modules/rule-engine';
import {Announcement as OldAnnouncement} from './deprecated-types';

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
  actionType: z.union([
    z.literal(ActionType.external),
    z.literal(ActionType.deeplink),
  ]),
  label: LanguageAndTextTypeArray.optional(),
  url: z.string().url(),
});

const BottomSheetActionButton = z.object({
  actionType: z.literal(ActionType.bottom_sheet),
  label: LanguageAndTextTypeArray.optional(),
});

export const AnnouncementConfiguration = z.object({
  active: z.boolean(),
  appPlatforms: z.array(AppPlatform).optional(),
  appVersionMin: z.string().optional(),
  appVersionMax: z.string().optional(),
  startDate: TimestampSchema.optional(),
  endDate: TimestampSchema.optional(),
  rules: z.array(Rule).optional(),
});

export const AnnouncementCardContent = z.object({
  title: LanguageAndTextTypeArray,
  body: LanguageAndTextTypeArray,
  image: Base64ImageSchema.optional(),
});

export const BottomSheetAnnouncementContent = z.object({
  title: LanguageAndTextTypeArray,
  body: LanguageAndTextTypeArray,
  image: Base64ImageSchema.optional(),
  primaryButton: UrlActionButton.optional(),
});

export const GenericAnnouncement = z.object({
  id: z.string(),
  cardActionType: z.undefined(),
  card: AnnouncementCardContent,
  config: AnnouncementConfiguration,
});

export const LinkAnnouncement = GenericAnnouncement.extend({
  cardActionType: z.union([
    z.literal(ActionType.external),
    z.literal(ActionType.deeplink),
  ]),
  cardActionButton: UrlActionButton,
});

export const BottomSheetAnnouncement = GenericAnnouncement.extend({
  cardActionType: z.literal(ActionType.bottom_sheet),
  cardActionButton: BottomSheetActionButton,
  bottomSheet: BottomSheetAnnouncementContent,
});

export const Announcement = z.discriminatedUnion('cardActionType', [
  GenericAnnouncement,
  LinkAnnouncement,
  BottomSheetAnnouncement,
]);

export type GenericAnnouncement = z.infer<typeof GenericAnnouncement>;
export type LinkAnnouncement = z.infer<typeof LinkAnnouncement>;
export type BottomSheetAnnouncement = z.infer<typeof BottomSheetAnnouncement>;
export type Announcement = z.infer<typeof Announcement>;

export type BottomSheetAnnouncementContent = z.infer<
  typeof BottomSheetAnnouncementContent
>;

/**
 * Transformer that converts OldAnnouncement to new Announcement format
 */
export const OldAnnouncementToNewTransformer = OldAnnouncement.transform(
  (oldAnnouncement: OldAnnouncement): Announcement => {
    const announcement: GenericAnnouncement = {
      id: oldAnnouncement.id,
      card: {
        title: oldAnnouncement.summaryTitle || oldAnnouncement.fullTitle,
        body: oldAnnouncement.summary,
        image: oldAnnouncement.summaryImage,
      },
      config: {
        active: oldAnnouncement.active,
        appPlatforms: oldAnnouncement.appPlatforms,
        appVersionMin: oldAnnouncement.appVersionMin,
        appVersionMax: oldAnnouncement.appVersionMax,
        startDate: oldAnnouncement.startDate,
        endDate: oldAnnouncement.endDate,
        rules: oldAnnouncement.rules,
      },
    };

    if (!oldAnnouncement.actionButton) {
      return announcement;
    }

    const {actionType, label} = oldAnnouncement.actionButton;

    if (actionType === ActionType.bottom_sheet) {
      return {
        ...announcement,
        cardActionType: actionType,
        cardActionButton: {
          actionType,
          label,
        },
        bottomSheet: {
          title: oldAnnouncement.fullTitle,
          body: oldAnnouncement.body,
          image: oldAnnouncement.mainImage,
        },
      };
    } else {
      return {
        ...announcement,
        cardActionType: actionType,
        cardActionButton: {
          actionType,
          label,
          url: oldAnnouncement.actionButton.url,
        },
      };
    }
  },
).pipe(Announcement);
