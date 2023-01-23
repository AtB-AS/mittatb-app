import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import * as TransportIcons from '@atb/assets/svg/mono-icons/transportation';
import * as TransportEnturIcons from '@atb/assets/svg/mono-icons/transportation-entur';
export function getVehicleSvg(formFactor: FormFactor) {
  switch (formFactor) {
    case FormFactor.Bicycle:
      return TransportEnturIcons.Bicycle;
    case FormFactor.Car:
      return TransportIcons.Car;
    case FormFactor.Scooter:
      return TransportEnturIcons.Scooter;
    default:
      return TransportIcons.Unknown;
  }
}
