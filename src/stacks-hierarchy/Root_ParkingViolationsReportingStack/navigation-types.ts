import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';

export type ParkingViolationsReportingStackParams = {
  ParkingViolations_SelectViolation: undefined;
  ParkingViolations_Photo: undefined;
};

export type ParkingViolationsReportingStackRootProps =
  RootStackScreenProps<'Root_ParkingViolationsReportingStack'>;

export type ParkingViolationsScreenProps<
  T extends keyof ParkingViolationsReportingStackParams,
> = CompositeScreenProps<
  StackScreenProps<ParkingViolationsReportingStackParams, T>,
  ParkingViolationsReportingStackRootProps
>;
