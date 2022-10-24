import {useTheme} from '@atb/theme';
import React from 'react';
import * as Light from '@atb/assets/svg/color/illustrations/ticket-type/light';
import * as Dark from '@atb/assets/svg/color/illustrations/ticket-type/dark';
import {SvgProps} from 'react-native-svg';

export type FareProductIllustration = keyof typeof Light;
type FareProductIllustrationsProps = {name: FareProductIllustration} & SvgProps;

const ThemedFareProductIllustration = ({
  name,
  ...props
}: FareProductIllustrationsProps): JSX.Element => {
  const {themeName} = useTheme();
  const themeIllustrations = themeName === 'light' ? Light : Dark;
  const Illustration = themeIllustrations[name];
  return <Illustration {...props} />;
};

export default ThemedFareProductIllustration;
