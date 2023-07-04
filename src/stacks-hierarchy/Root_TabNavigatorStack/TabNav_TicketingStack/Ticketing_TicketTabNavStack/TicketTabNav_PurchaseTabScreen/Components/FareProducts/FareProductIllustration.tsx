import {useTheme} from '@atb/theme';
import React from 'react';

/* eslint-enable no-restricted-syntax, no-param-reassign */
import {SvgProps} from 'react-native-svg';
import {FareProductTypeConfig} from '@atb/configuration';

import Boat from '@atb/assets/svg/mono-icons/transportation/Boat';
import Klippekort from '@atb/assets/svg/color/icons/ticketing/Klippekort';
import H24 from '@atb/assets/svg/mono-icons/ticketing/H24';
import Moon from '@atb/assets/svg/mono-icons/ticketing/Moon';
import Date from '@atb/assets/svg/mono-icons/time/Date';
import Ticket from '@atb/assets/svg/mono-icons/ticketing/Ticket';
import Sun from '@atb/assets/svg/mono-icons/ticketing/Sun';
import Youth from '@atb/assets/svg/mono-icons/ticketing/Youth';

const themeIllustrationsLight = {
  Ticket,
  PeriodTicket: Date,
  H24,
  Night: Moon,
  Summer: Sun,
  Youth,
  Carnet: Klippekort,
  Boat,
};
const themeIllustrationsDark = {...themeIllustrationsLight}; // currently no difference

type FareProductIllustrationType = keyof typeof themeIllustrationsLight;

type FareProductIllustrationsProps = {
  config: FareProductTypeConfig;
} & SvgProps;

export const FareProductIllustration = ({
  config,
  ...props
}: FareProductIllustrationsProps): JSX.Element => {
  const {themeName} = useTheme();
  const illustrationName = getIllustrationFileName(config);
  const themeIllustrations =
    themeName === 'light' ? themeIllustrationsLight : themeIllustrationsDark;
  const Illustration = themeIllustrations[illustrationName];
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
