import {InvalidTicket, ValidTicket} from '@atb/assets/svg/icons/ticketing';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useTheme} from '@atb/theme';
import colors from '@atb/theme/colors';
import React from 'react';
import {View} from 'react-native';

const ValidityIcon: React.FC<{isValid: boolean}> = ({isValid}) => {
  const {theme} = useTheme();

  return (
    <View style={{marginRight: theme.spacings.medium}}>
      {isValid ? (
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
