import {
  createGlobalMessageSchema,
  GenericGlobalMessageType,
} from '@atb-as/utils';
import {z} from 'zod';

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
const GlobalMessageContextSchema = z.enum(GlobalMessageContextEnum);

export const GlobalMessageSchema = createGlobalMessageSchema(
  GlobalMessageContextSchema,
);
export type GlobalMessageType = GenericGlobalMessageType<
  typeof GlobalMessageContextSchema
>;
