import {useTheme} from '@atb/theme';
import React from 'react';
import * as Light from '@atb/assets/svg/color/illustrations/ticket-type/light';
import * as Dark from '@atb/assets/svg/color/illustrations/ticket-type/dark';
import {SvgProps} from 'react-native-svg';

export type TicketIllustration = keyof typeof Light;
type TicketIllustrationsProps = {name: TicketIllustration} & SvgProps;

const ThemedTicketIllustration = ({
  name,
  ...props
}: TicketIllustrationsProps): JSX.Element => {
  const {themeName} = useTheme();
  const themeIllustrations = themeName === 'light' ? Light : Dark;
  const Illustration = themeIllustrations[name];
  return <Illustration {...props} />;
};

export default ThemedTicketIllustration;
