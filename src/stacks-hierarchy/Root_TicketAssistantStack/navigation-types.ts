import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps, NavigationProp} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';

export type TicketAssistant_ZonePickerScreenParams = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
};

export type TicketAssistantStackProps =
  NavigationProp<TicketAssistantStackParams>;

export type TicketAssistantStackParams = {
  TicketAssistant_WelcomeScreen: undefined;
  TicketAssistant_CategoryPickerScreen: undefined;
  TicketAssistant_FrequencyScreen: undefined;
  TicketAssistant_DurationScreen: undefined;
  TicketAssistant_ZonePickerScreen: undefined;
  TicketAssistant_SummaryScreen: undefined;
};

export type TicketAssistantStackRootProps =
  RootStackScreenProps<'Root_TicketAssistantStack'>;

export type TicketAssistantScreenProps<
  T extends keyof TicketAssistantStackParams,
> = CompositeScreenProps<
  StackScreenProps<TicketAssistantStackParams, T>,
  TicketAssistantStackRootProps
>;
