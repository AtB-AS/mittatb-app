import type {IconColor} from '@atb/components/theme-icon';
import type {SvgProps} from 'react-native-svg';
import {JSX} from 'react';

export type TripPatternStatusType =
  | 'ended'
  | 'started'
  | 'impossible'
  | 'stale'
  | 'requiresBooking'
  | 'bookingDeadlineExceeded';

export type TripPatternStatus = {
  type: TripPatternStatusType;
  svg: (props: SvgProps) => JSX.Element;
  color: IconColor;
  text: string;
};
