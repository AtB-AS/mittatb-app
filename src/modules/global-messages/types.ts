import {LanguageAndTextSchema} from '@atb/translations';
import {Rule} from '@atb-as/utils';

import {z} from 'zod';

export const AppPlatform = z.enum(['ios', 'android']);
export type AppPlatform = z.infer<typeof AppPlatform>;

export enum GlobalMessageContextEnum {
  appAssistant = 'app-assistant',
  appDepartures = 'app-departures',
  appTicketing = 'app-ticketing',
  appProfile = 'app-profile',
  appPurchaseOverview = 'app-purchase-overview',
  appPurchaseConfirmation = 'app-purchase-confirmation',
  appPurchaseConfirmationBottom = 'app-purchase-confirmation-bottom',
  appFareContractDetails = 'app-fare-contract-details',
  appDepartureDetails = 'app-departure-details',
  appTripDetails = 'app-trip-details',
  appTripResults = 'app-trip-results',
  appServiceDisruptions = 'app-service-disruptions',
  appLogin = 'app-login',
  appLoginPhone = 'app-login-phone',
  appPointsScreen = 'app-points-screen',
}

export const GlobalMessageSchema = z.object({
  id: z.string(),
  active: z.boolean(),
  title: z.array(LanguageAndTextSchema).optional(),
  body: z.array(LanguageAndTextSchema),
  link: z.array(LanguageAndTextSchema).optional(),
  linkText: z.array(LanguageAndTextSchema).optional(),
  type: z.enum(['error', 'valid', 'info', 'warning']),
  subtle: z.boolean().optional(),
  context: z.array(z.nativeEnum(GlobalMessageContextEnum)),
  isDismissable: z.boolean().optional(),
  appPlatforms: z.array(AppPlatform).optional(),
  appVersionMin: z.string().optional(),
  appVersionMax: z.string().optional(),
  startDate: z.number().optional(),
  endDate: z.number().optional(),
  rules: z.array(Rule).optional(),
});
export type GlobalMessageType = z.infer<typeof GlobalMessageSchema>;
