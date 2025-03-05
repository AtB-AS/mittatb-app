import React, {ReactElement} from 'react';
import {useThemeContext} from '@atb/theme';
import {ValidityStatus} from '../utils';
import {useValidityLineColors} from '../use-validity-line-colors';
import {useMobileTokenContext} from '@atb/mobile-token';
import {LineWithVerticalBars} from '@atb/components/line-with-vertical-bars';

type Props =
  | {
      status: 'valid';
      fareProductType?: string;
      animate?: boolean;
    }
  | {status: Exclude<ValidityStatus, 'valid'>};

export const ValidityLine = (props: Props): ReactElement => {
  const {status} = props;

  const {theme} = useThemeContext();
  const {backgroundColor} = useValidityLineColors(
    status === 'valid' ? props.fareProductType : undefined,
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
          backgroundColor={backgroundColor.background}
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
