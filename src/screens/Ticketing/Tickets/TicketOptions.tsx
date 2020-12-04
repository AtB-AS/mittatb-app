import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {FareContractType} from '../../../api/fareContracts';
import {StyleSheet, useTheme} from '../../../theme';
import Button from '../../../components/button';
import {TicketingScreenNavigationProp} from './Tabs';

type Props = {
  fareContractTypes: FareContractType[];
  isRefreshingTypes: boolean;
  navigation: TicketingScreenNavigationProp;
};

const TicketOptions: React.FC<Props> = ({
  fareContractTypes,
  isRefreshingTypes,
  navigation,
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  if (isRefreshingTypes) {
    return (
      <ActivityIndicator
        size={'large'}
        color={theme.text.colors.primary}
        style={{margin: theme.spacings.medium}}
      />
    );
  }
  const buttons = fareContractTypes.map((fareContractType) => (
    <View key={fareContractType.id} style={styles.buttonContainer}>
      <Button
        mode="primary"
        text={fareContractType.name.value}
        onPress={() =>
          navigation.navigate('TicketPurchase', {fareContractType})
        }
      />
    </View>
  ));
  return <>{buttons}</>;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  buttonContainer: {
    width: '100%',
    paddingHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));

export default TicketOptions;
