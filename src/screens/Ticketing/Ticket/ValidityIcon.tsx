import {InvalidTicket, ValidTicket} from '@atb/assets/svg/mono-icons/ticketing';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useTheme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {Wait} from '@atb/assets/svg/mono-icons/transportation';
import {TicketTexts, useTranslation} from '@atb/translations';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';

const ValidityIcon: React.FC<{
  status: ValidityStatus;
  isInspectable: boolean;
}> = ({status, isInspectable}) => {
  const {theme} = useTheme();
  return (
    <View style={{marginRight: theme.spacings.medium}}>
      <ValidityIconSvg status={status} isInspectable={isInspectable} />
    </View>
  );
};

const ValidityIconSvg = ({
  status,
  isInspectable,
}: {
  status: ValidityStatus;
  isInspectable: boolean;
}) => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const a11yLabel = t(TicketTexts.validityIcon[status]) + screenReaderPause;
  switch (status) {
    case 'valid':
      if (isInspectable)
        return (
          <ThemeIcon
            svg={ValidTicket}
            colorType="valid"
            accessibilityLabel={a11yLabel}
          />
        );
      else
        return (
          <ThemeIcon
            svg={ValidTicket}
            colorType="secondary"
            accessibilityLabel={a11yLabel}
          />
        );
    case 'reserving':
      return (
        <ThemeIcon
          svg={ValidTicket}
          colorType="info"
          accessibilityLabel={a11yLabel}
        />
      );
    case 'unknown':
      return (
        <ThemeIcon
          svg={ValidTicket}
          colorType="primary"
          accessibilityLabel={a11yLabel}
        />
      );
    case 'expired':
    case 'refunded':
      return (
        <ThemeIcon
          svg={InvalidTicket}
          colorType="error"
          accessibilityLabel={a11yLabel}
        />
      );
    case 'upcoming':
      return (
        <ThemeIcon
          svg={Wait}
          colorType="primary"
          accessibilityLabel={a11yLabel}
        />
      );
  }
};

export default ValidityIcon;
