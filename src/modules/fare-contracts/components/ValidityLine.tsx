import React, {ReactElement} from 'react';
import {useThemeContext} from '@atb/theme';
import {ValidityStatus} from '../utils';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {LineWithVerticalBars} from '@atb/components/line-with-vertical-bars';
import {useFareProductColor} from '../use-fare-product-color';
import {TransportMode} from '@atb/modules/fare-contracts';

type Props =
  | {
      status: 'valid';
      transportModes: TransportMode[];
      animate?: boolean;
    }
  | {status: Exclude<ValidityStatus, 'valid'>};

export const ValidityLine = (props: Props): ReactElement => {
  const {status} = props;

  const {theme} = useThemeContext();
  const fareProductColor = useFareProductColor(
    status === 'valid' ? props.transportModes : undefined,
  );
  const {isInspectable} = useMobileTokenContext();

  switch (status) {
    case 'reserving':
      return (
        <LineWithVerticalBars
          backgroundColor={theme.color.foreground.dynamic.disabled}
        />
      );
    case 'approved':
      return (
        <LineWithVerticalBars
          backgroundColor={theme.color.interactive[0].default.background}
        />
      );
    case 'valid':
      return isInspectable ? (
        <LineWithVerticalBars
          backgroundColor={fareProductColor.background}
          animate={props.animate}
        />
      ) : (
        <></>
      );
    case 'upcoming':
    case 'refunded':
    case 'expired':
    case 'inactive':
    case 'rejected':
    case 'cancelled':
    case 'sent':
      return <></>;
  }
};
