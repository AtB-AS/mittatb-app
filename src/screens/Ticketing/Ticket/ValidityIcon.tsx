import React from 'react';
import {View} from 'react-native';
import {InvalidTicket, ValidTicket} from '../../../assets/svg/icons/ticketing';
import {screenReaderPause} from '../../../components/accessible-text';
import {useTheme} from '../../../theme';
import colors from '../../../theme/colors';

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
