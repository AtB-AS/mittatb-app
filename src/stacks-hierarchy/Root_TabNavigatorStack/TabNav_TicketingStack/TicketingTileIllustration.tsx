import React from 'react';

/* eslint-enable no-restricted-syntax, no-param-reassign */
import {SvgProps} from 'react-native-svg';

import {Boat} from '@atb/assets/svg/mono-icons/transportation/';
import {Klippekort} from '@atb/assets/svg/color/icons/ticketing/';
import {Date} from '@atb/assets/svg/mono-icons/time/';

import {
  H24,
  Moon,
  Ticket,
  Sun,
  Youth,
  TicketMultiple,
} from '@atb/assets/svg/mono-icons/ticketing/';

const ticketingTileIllustrations = {
  Ticket,
  PeriodTicket: Date,
  H24,
  Night: Moon,
  Summer: Sun,
  Youth,
  Carnet: Klippekort,
  Boat,
  TicketMultiple,
};

type ticketingTileIllustrationType = keyof typeof ticketingTileIllustrations;

type ticketingTileIllustrationsProps = {
  illustrationName: string;
} & SvgProps;

export const TicketingTileIllustration = ({
  illustrationName,
  ...props
}: ticketingTileIllustrationsProps): JSX.Element => {
  const illustrationFileName = getIllustrationFileName(illustrationName);
  const Illustration = ticketingTileIllustrations[illustrationFileName];
  return <Illustration {...props} />;
};

const getIllustrationFileName = (
  illustrationName?: string,
): ticketingTileIllustrationType => {
  switch (illustrationName) {
    case 'single':
      return 'Ticket';
    case 'period':
      return 'PeriodTicket';
    case 'hour24':
      return 'H24';
    case 'carnet':
      return 'Carnet';
    case 'night':
      return 'Night';
    case 'summer':
      return 'Summer';
    case 'youth':
      return 'Youth';
    case 'boat':
      return 'Ticket';
    case 'boat-period':
      return 'PeriodTicket';
    case 'ticketMultiple':
      return 'TicketMultiple';
    default:
      return 'Ticket';
  }
};
