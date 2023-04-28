import {useTheme} from '@atb/theme';
import React from 'react';
/* eslint-disable no-restricted-syntax, no-param-reassign */
import * as Light from '@atb/assets/svg/color/illustrations/ticket-type/light';
import * as Dark from '@atb/assets/svg/color/illustrations/ticket-type/dark';
/* eslint-enable no-restricted-syntax, no-param-reassign */
import {SvgProps} from 'react-native-svg';
import {FareProductTypeConfig} from '@atb/configuration';

export type FareProductIllustrationType = keyof typeof Light;
type FareProductIllustrationsProps = {
  config: FareProductTypeConfig;
} & SvgProps;

export const FareProductIllustration = ({
  config,
  ...props
}: FareProductIllustrationsProps): JSX.Element => {
  const {themeName} = useTheme();
  const illustrationName = getIllustrationFileName(config);
  const themeIllustrations = themeName === 'light' ? Light : Dark;
  const Illustration = themeIllustrations[illustrationName];
  return <Illustration {...props} />;
};

const getIllustrationFileName = (
  config: FareProductTypeConfig,
): FareProductIllustrationType => {
  switch (config.illustration) {
    case 'single':
      return 'Single';
    case 'period':
      return 'Period';
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
      return 'Boat';
    default:
      return 'Single';
  }
};
