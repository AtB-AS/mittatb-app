export {useVehicleRegistrationsQuery} from './queries/use-get-vehicle-registrations-query';
export {useAddVehicleRegistrationMutation} from './queries/use-add-vehicle-registration-mutation';
export {useEditVehicleRegistrationMutation} from './queries/use-edit-vehicle-registration-mutation';
export {useDeleteVehicleRegistrationMutation} from './queries/use-delete-vehicle-registration-mutation';
export type {VehicleRegistration, SvvVehicleInfo} from './types';
export {searchVehicleInformation} from './api/api';
export {LicensePlateSection} from './components/LicensePlateSection';
export {useSearchVehicleInformationQuery} from './queries/use-search-vehicle-information-query';
export {SmartParkAndRideOnboarding_InformationScreen} from './enrollment/SmartParkAndRideOnboarding_InformationScreen';
export {SmartParkAndRideOnboarding_AutomaticRegistrationScreen} from './enrollment/SmartParkAndRideOnboarding_AutomaticRegistrationScreen';
export {useSmartParkAndRideTexts} from './useSmartParkAndRideTexts';

export {
  sparEnrollmentConfig,
  sparPilotEnrollmentId,
  type SparPilotEnrollmentScreenNames,
} from './enrollment';
