import {z} from 'zod';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {AppPlatformSchema} from '@atb/modules/global-messages';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {RuleSchema} from '@atb/modules/rule-engine';

const TimestampSchema = z.custom<FirebaseFirestoreTypes.Timestamp>(
  (value) => value instanceof FirebaseFirestoreTypes.Timestamp,
);

export enum ActionType {
  external = 'external',
  deeplink = 'deeplink',
  bottom_sheet = 'bottom_sheet',
}

export const BottomSheetActionButtonSchema = z.object({
  label: LanguageAndTextTypeArray.optional(),
  actionType: z.literal(ActionType.bottom_sheet),
});

export const UrlActionButtonSchema = z.object({
  label: LanguageAndTextTypeArray.optional(),
  url: z.string().url(),
  actionType: z.union([
    z.literal(ActionType.external),
    z.literal(ActionType.deeplink),
  ]),
});

export const ActionButtonSchema = z.union([
  BottomSheetActionButtonSchema,
  UrlActionButtonSchema,
]);

export type ActionButton = z.infer<typeof ActionButtonSchema>;

export const AnnouncementRawSchema = z.object({
  id: z.string(),
  active: z.boolean(),
  summaryTitle: LanguageAndTextTypeArray.optional(),
  summary: LanguageAndTextTypeArray,
  summaryImage: z.string().base64().optional(),
  fullTitle: LanguageAndTextTypeArray,
  body: LanguageAndTextTypeArray,
  mainImage: z.string().base64().optional(),
  isDismissable: z.boolean().optional(),
  appPlatforms: z.array(AppPlatformSchema),
  appVersionMin: z.string(),
  appVersionMax: z.string(),
  startDate: TimestampSchema.optional(),
  endDate: TimestampSchema.optional(),
  rules: z.array(RuleSchema).optional(),
  actionButton: ActionButtonSchema.optional(),
});

export type AnnouncementRaw = z.infer<typeof AnnouncementRawSchema>;
export type AnnouncementId = AnnouncementRaw['id'];

export const AnnouncementTypeSchema = AnnouncementRawSchema.omit({
  appPlatforms: true,
  appVersionMin: true,
  appVersionMax: true,
  startDate: true,
  endDate: true,
}).extend({
  startDate: z.number().optional(),
  endDate: z.number().optional(),
  actionButton: ActionButtonSchema,
});

export type AnnouncementType = z.infer<typeof AnnouncementTypeSchema>;
