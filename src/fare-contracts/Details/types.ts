import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {CarnetDetailsRouteParams} from './CarnetDetailsScreen';
import {FareContractDetailsRouteParams} from './DetailsScreen';
import {ReceiptScreenRouteParams} from './ReceiptScreen';

export type FareContractModalStackParams = {
  FareContractDetails: FareContractDetailsRouteParams;
  PurchaseReceipt: ReceiptScreenRouteParams;
  CarnetDetailsScreen: CarnetDetailsRouteParams;
};

export type FareContractModalStackRootProps =
  RootStackScreenProps<'Root_FareContractModal'>;

export type FareContractModalScreenProps<
  T extends keyof FareContractModalStackParams,
> = CompositeScreenProps<
  StackScreenProps<FareContractModalStackParams, T>,
  FareContractModalStackRootProps
>;
