import {InvalidTicket, ValidTicket} from '@atb/assets/svg/icons/ticketing';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useTheme} from '@atb/theme';
import colors from '@atb/theme/colors';
import React from 'react';
import {View} from 'react-native';
import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';

const ValidityIcon: React.FC<{status: ValidityStatus}> = ({status}) => {
  const {theme} = useTheme();

  return (
    <View style={{marginRight: theme.spacings.medium}}>
      {status === 'valid' || status === 'upcoming' ? (
        <ValidTicket
          fill={colors.primary.green_500}
          accessibilityLabel={'Gyldig billett' + screenReaderPause}
        />
      ) : (
        <InvalidTicket
          fill={theme.border.error}
          accessibilityLabel={'Utløpt billett' + screenReaderPause}
        />
      )}
    </View>
  );
};

export default ValidityIcon;
