import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {ParkingViolationType} from '@atb/api/types/mobility';

type PhotoParams = {selectedViolations: ParkingViolationType[]};
type QrParams = PhotoParams & {
  photo: string;
};
type ConfirmationParams = QrParams & {
  providerId: number;
};

export type ParkingViolationsReportingStackParams = {
  ParkingViolations_SelectViolation: undefined;
  ParkingViolations_Photo: PhotoParams;
  ParkingViolations_Qr: QrParams;
  ParkingViolations_Confirmation: ConfirmationParams;
};

export type ParkingViolationsReportingStackRootProps =
  RootStackScreenProps<'Root_ParkingViolationsReportingStack'>;

export type ParkingViolationsScreenProps<
  T extends keyof ParkingViolationsReportingStackParams,
> = CompositeScreenProps<
  StackScreenProps<ParkingViolationsReportingStackParams, T>,
  ParkingViolationsReportingStackRootProps
>;
