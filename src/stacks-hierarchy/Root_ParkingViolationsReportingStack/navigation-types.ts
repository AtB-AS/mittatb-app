import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {ParkingViolationType} from '@atb/api/types/mobility';

export type ParkingViolationsReportingStackParams = {
  ParkingViolations_SelectViolation: undefined;
  ParkingViolations_Photo: {selectedViolations: ParkingViolationType[]};
  ParkingViolations_Qr: undefined;
  ParkingViolations_Providers: undefined;
  ParkingViolations_Summary: undefined;
};

export type ParkingViolationsReportingStackRootProps =
  RootStackScreenProps<'Root_ParkingViolationsReportingStack'>;

export type ParkingViolationsScreenProps<
  T extends keyof ParkingViolationsReportingStackParams,
> = CompositeScreenProps<
  StackScreenProps<ParkingViolationsReportingStackParams, T>,
  ParkingViolationsReportingStackRootProps
>;
