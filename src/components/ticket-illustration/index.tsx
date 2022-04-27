import {useTheme} from '@atb/theme';
import React from 'react';
import * as Light from '@atb/assets/svg/color/illustrations/ticket-type/light';
import * as Dark from '@atb/assets/svg/color/illustrations/ticket-type/dark';

export type TicketIllustration = keyof typeof Light;

const ThemedTicketIllustration = ({
  name,
}: {
  name: TicketIllustration;
}): JSX.Element => {
  const {themeName} = useTheme();
  const themeIcons = themeName === 'light' ? Light : Dark;
  return themeIcons[name]({});
};

export default ThemedTicketIllustration;
