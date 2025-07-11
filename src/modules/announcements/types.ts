import {z} from 'zod';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {AppPlatformSchema} from '@atb/modules/global-messages';
import {Timestamp} from '@react-native-firebase/firestore';
import {Rule} from '@atb/modules/rule-engine';

const TimestampSchema = z
  .custom<Timestamp>((value) => value instanceof Timestamp)
  .transform((ts) => new Date(ts.toMillis()));

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
  summaryImage: z.string().startsWith('data:image/').optional(),
  fullTitle: LanguageAndTextTypeArray,
  body: LanguageAndTextTypeArray,
  mainImage: z.string().startsWith('data:image/').optional(),
  isDismissable: z.boolean().optional(),
  appPlatforms: z.array(AppPlatformSchema).optional(),
  appVersionMin: z.string().optional(),
  appVersionMax: z.string().optional(),
  startDate: TimestampSchema.optional(),
  endDate: TimestampSchema.optional(),
  rules: z.array(Rule).optional(),
  actionButton: ActionButton.optional(),
});
export type Announcement = z.infer<typeof Announcement>;
