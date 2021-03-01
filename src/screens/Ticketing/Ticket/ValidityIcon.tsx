import {InvalidTicket, ValidTicket} from '@atb/assets/svg/icons/ticketing';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useTheme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {Wait} from '@atb/assets/svg/icons/transportation';
import {TicketTexts, useTranslation} from '@atb/translations';

const ValidityIcon: React.FC<{status: ValidityStatus}> = ({status}) => {
  const {theme} = useTheme();
  return (
    <View style={{marginRight: theme.spacings.medium}}>
      <ValidityIconSvg status={status} />
    </View>
  );
};

const ValidityIconSvg = ({status}: {status: ValidityStatus}) => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const a11yLabel = t(TicketTexts.validityIcon[status]) + screenReaderPause;
  switch (status) {
    case 'valid':
      return (
        <ValidTicket
          fill={theme.colors.primary_1.backgroundColor}
          accessibilityLabel={a11yLabel}
        />
      );
    case 'reserving':
      return (
        <ValidTicket
          fill={theme.colors.primary_3.backgroundColor}
          accessibilityLabel={a11yLabel}
        />
      );
    case 'unknown':
      return (
        <ValidTicket
          fill={theme.colors.secondary_1.backgroundColor}
          accessibilityLabel={a11yLabel}
        />
      );
    case 'expired':
      return (
        <InvalidTicket
          fill={theme.colors.primary_destructive.backgroundColor}
          accessibilityLabel={a11yLabel}
        />
      );
    case 'refunded':
      return (
        <InvalidTicket
          fill={theme.colors.primary_destructive.backgroundColor}
          accessibilityLabel={a11yLabel}
        />
      );
    case 'upcoming':
      return (
        <Wait fill={theme.text.colors.primary} accessibilityLabel={a11yLabel} />
      );
  }
};

export default ValidityIcon;
