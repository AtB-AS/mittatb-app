import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {PreassignedFareProduct} from '../../../api/fareContracts';
import {StyleSheet, useTheme} from '../../../theme';
import Button from '../../../components/button';
import {TicketingScreenNavigationProp} from './Tabs';

type Props = {
  preassignedFareProducts: PreassignedFareProduct[];
  isRefreshingTypes: boolean;
  navigation: TicketingScreenNavigationProp;
};

const TicketOptions: React.FC<Props> = ({
  preassignedFareProducts,
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
  const buttons = preassignedFareProducts.map((preassignedFareProduct) => (
    <View key={preassignedFareProduct.id} style={styles.buttonContainer}>
      <Button
        mode="primary"
        text={preassignedFareProduct.name.value}
        onPress={() =>
          navigation.navigate('TicketPurchase', {preassignedFareProduct})
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
