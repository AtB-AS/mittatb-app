import {z} from 'zod';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {AppPlatformSchema} from '@atb/modules/global-messages';
import {Timestamp} from '@react-native-firebase/firestore';
import {RuleSchema} from '@atb/modules/rule-engine';

const TimestampSchema = z.custom<Timestamp>(
  (value) => value instanceof Timestamp,
);

export enum ActionType {
  external = 'external',
  deeplink = 'deeplink',
  bottom_sheet = 'bottom_sheet',
}

const BottomSheetActionButtonSchema = z.object({
  label: LanguageAndTextTypeArray.optional(),
  actionType: z.literal(ActionType.bottom_sheet),
});

const UrlActionButtonSchema = z.object({
  label: LanguageAndTextTypeArray.optional(),
  url: z.string().url(),
  actionType: z.union([
    z.literal(ActionType.external),
    z.literal(ActionType.deeplink),
  ]),
});

const ActionButtonSchema = z.union([
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

export const AnnouncementTypeSchema = AnnouncementRawSchema.transform(
  (data) => ({
    ...data,
    startDate: data.startDate?.toMillis(),
    endDate: data.endDate?.toMillis(),
  }),
);

export type AnnouncementRaw = z.infer<typeof AnnouncementRawSchema>;
export type AnnouncementType = z.infer<typeof AnnouncementTypeSchema>;
export type AnnouncementId = AnnouncementType['id'];
