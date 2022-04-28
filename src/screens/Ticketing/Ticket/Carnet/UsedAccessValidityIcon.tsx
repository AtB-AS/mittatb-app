import {TicketInvalid, TicketValid} from '@atb/assets/svg/mono-icons/ticketing';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useTheme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {TicketTexts, useTranslation} from '@atb/translations';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {UsedAccessStatus} from './types';

type Props = {
  status: UsedAccessStatus;
  isInspectable: boolean;
};

const ValidityIcon: React.FC<Props> = (props) => {
  const {theme} = useTheme();
  return (
    <View style={{marginRight: theme.spacings.medium}}>
      <ValidityIconSvg {...props} />
    </View>
  );
};

const ValidityIconSvg = ({status, isInspectable}: Props) => {
  const {t} = useTranslation();
  const a11yLabel =
    t(TicketTexts.usedAccessValidityIcon[status]) + screenReaderPause;

  switch (status) {
    case 'valid':
      if (isInspectable) {
        return (
          <ThemeIcon
            svg={TicketValid}
            colorType="valid"
            accessibilityLabel={a11yLabel}
          />
        );
      } else {
        return (
          <ThemeIcon
            svg={TicketValid}
            colorType="secondary"
            accessibilityLabel={a11yLabel}
          />
        );
      }
    case 'inactive':
      return (
        <ThemeIcon
          svg={TicketInvalid}
          colorType="secondary"
          accessibilityLabel={a11yLabel}
        />
      );
    case 'upcoming':
      return (
        <ThemeIcon
          svg={Time}
          colorType="primary"
          accessibilityLabel={a11yLabel}
        />
      );
  }
};

export default ValidityIcon;
