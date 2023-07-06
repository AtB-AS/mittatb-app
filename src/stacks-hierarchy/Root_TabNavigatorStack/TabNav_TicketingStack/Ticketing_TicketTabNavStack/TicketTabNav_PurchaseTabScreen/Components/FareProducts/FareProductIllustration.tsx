import React from 'react';

/* eslint-enable no-restricted-syntax, no-param-reassign */
import {SvgProps} from 'react-native-svg';
import {FareProductTypeConfig} from '@atb/configuration';

import {Boat} from '@atb/assets/svg/mono-icons/transportation/';
import {Klippekort} from '@atb/assets/svg/color/icons/ticketing/';
import {Date} from '@atb/assets/svg/mono-icons/time/';

import {
  H24,
  Moon,
  Ticket,
  Sun,
  Youth,
} from '@atb/assets/svg/mono-icons/ticketing/';

const fareProductIllustrations = {
  Ticket,
  PeriodTicket: Date,
  H24,
  Night: Moon,
  Summer: Sun,
  Youth,
  Carnet: Klippekort,
  Boat,
};

type FareProductIllustrationType = keyof typeof fareProductIllustrations;

type FareProductIllustrationsProps = {
  config: FareProductTypeConfig;
} & SvgProps;

export const FareProductIllustration = ({
  config,
  ...props
}: FareProductIllustrationsProps): JSX.Element => {
  const illustrationName = getIllustrationFileName(config);
  const Illustration = fareProductIllustrations[illustrationName];
  return <Illustration {...props} />;
};

const getIllustrationFileName = (
  config: FareProductTypeConfig,
): FareProductIllustrationType => {
  switch (config.illustration) {
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
      if (config.configuration.productSelectionMode === 'duration') {
        return 'PeriodTicket';
      } else {
        return 'Ticket';
      }
    default:
      return 'Ticket';
  }
};
