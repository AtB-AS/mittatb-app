import type {IconColor} from '@atb/components/theme-icon';
import type {SvgProps} from 'react-native-svg';
import {JSX} from 'react';

export type TripPatternStatus =
  | 'started'
  | 'ended'
  | 'impossible'
  | 'stale'
  | 'cancelled'
  | 'requiresBooking'
  | 'bookingDeadlineExceeded';

export type StatusTextConfig = {
  type: TripPatternStatus;
  svg: (props: SvgProps) => JSX.Element;
  color: IconColor;
  text: string;
};
