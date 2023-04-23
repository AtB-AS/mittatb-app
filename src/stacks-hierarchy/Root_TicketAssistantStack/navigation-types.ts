import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps, NavigationProp} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {FareProductTypeConfig} from '@atb/configuration';
import {TicketAssistantData} from './types';

export type TicketAssistant_ZonePickerScreenParams = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  fareProductTypeConfig: FareProductTypeConfig;
};

export type TicketAssistantStackProps =
  NavigationProp<TicketAssistantStackParams>;

export type TicketAssistantStackParams = {
  TicketAssistant_WelcomeScreen: undefined;
  TicketAssistant_CategoryPickerScreen: undefined;
  TicketAssistant_FrequencyScreen: undefined;
  TicketAssistant_DurationScreen: undefined;
  TicketAssistant_ZonePickerScreen: undefined;
  TicketAssistant_SummaryScreen: TicketAssistantData;
};

export type TicketAssistantStackRootProps =
  RootStackScreenProps<'Root_TicketAssistantStack'>;

export type TicketAssistantScreenProps<
  T extends keyof TicketAssistantStackParams,
> = CompositeScreenProps<
  StackScreenProps<TicketAssistantStackParams, T>,
  TicketAssistantStackRootProps
>;
