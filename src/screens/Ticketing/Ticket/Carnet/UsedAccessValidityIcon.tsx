import {InvalidTicket, ValidTicket} from '@atb/assets/svg/icons/ticketing';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useTheme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {Wait} from '@atb/assets/svg/icons/transportation';
import {TicketTexts, useTranslation} from '@atb/translations';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {UsedAccessStatus} from './types';

const ValidityIcon: React.FC<{status: UsedAccessStatus}> = ({status}) => {
  const {theme} = useTheme();
  return (
    <View style={{marginRight: theme.spacings.medium}}>
      <ValidityIconSvg status={status} />
    </View>
  );
};

const ValidityIconSvg = ({status}: {status: UsedAccessStatus}) => {
  const {t} = useTranslation();
  const a11yLabel =
    t(TicketTexts.usedAccessValidityIcon[status]) + screenReaderPause;

  switch (status) {
    case 'valid':
      return (
        <ThemeIcon
          svg={ValidTicket}
          colorType="disabled"
          accessibilityLabel={a11yLabel}
        />
      );
    case 'inactive':
      return (
        <ThemeIcon
          svg={InvalidTicket}
          colorType="disabled"
          accessibilityLabel={a11yLabel}
        />
      );
    case 'upcoming':
      return (
        <ThemeIcon
          svg={Wait}
          colorType="disabled"
          accessibilityLabel={a11yLabel}
        />
      );
  }
};

export default ValidityIcon;
