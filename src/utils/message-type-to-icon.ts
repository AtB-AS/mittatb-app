import {Check, Error, Info, Warning} from '../assets/svg/mono-icons/status';
import {Statuses} from '@atb/theme';

export const messageTypeToIcon = (messageType: Statuses) => {
  switch (messageType) {
    case 'warning':
      return Warning;
    case 'error':
      return Error;
    case 'valid':
      return Check;
    default:
      return Info;
  }
};
