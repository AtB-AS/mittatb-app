import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '../../../theme';
import Button from '../../../components/button';
import {TicketingScreenNavigationProp} from './Tabs';
import {PreassignedFareProduct} from '../../../reference-data/types';
import {getReferenceDataName} from '../../../reference-data/utils';
import {useTranslation} from '../../../translations';

type Props = {
  preassignedFareProducts: PreassignedFareProduct[];
  navigation: TicketingScreenNavigationProp;
};

const TicketOptions: React.FC<Props> = ({
  preassignedFareProducts,
  navigation,
}) => {
  const styles = useStyles();
  const {language} = useTranslation();
  const buttons = preassignedFareProducts.map((preassignedFareProduct) => (
    <View key={preassignedFareProduct.id} style={styles.buttonContainer}>
      <Button
        mode="primary"
        text={getReferenceDataName(preassignedFareProduct, language)}
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
