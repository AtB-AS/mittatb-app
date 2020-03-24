import {LegMode} from '../../sdk';
import LegTransportMethodIcon, {
  LegTransportMethodIconProps,
} from './svg/LegTransportMethodIcon';
import BusLegIcon from './svg/BusLegIcon';
import TramLegIcon from './svg/TramLegIcon';
import React from 'react';

export type TransportationIconProps = LegTransportMethodIconProps & {
  mode: LegMode;
};

export default function TransportationIcon({
  mode,
  ...props
}: TransportationIconProps) {
  switch (mode) {
    case 'bus':
      return <BusLegIcon {...props} />;
    case 'tram':
      return <TramLegIcon {...props} />;
    default:
      return <LegTransportMethodIcon {...props} />;
  }
}
