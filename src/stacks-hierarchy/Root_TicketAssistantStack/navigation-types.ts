import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type TicketAssistantStackParams = {
  TicketAssistant_WelcomeScreen: undefined;
  TicketAssistant_FrequencyScreen: undefined;
  TicketAssistant_CategoryPickerScreen: undefined;
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
