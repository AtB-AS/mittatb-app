import React, {useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import {StyleSheet} from '@atb/theme';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import * as Sections from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {ProductTexts, useTranslation} from '@atb/translations';
import Button from '@atb/components/button';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';

export type ProductRouteParams = {
  preassignedFareProductId: string;
};

type ProductNavigationProp = DismissableStackNavigationProp<
  TicketingStackParams,
  'Product'
>;

type ProductRouteProp = RouteProp<TicketingStackParams, 'Product'>;

const Product: React.FC<{
  navigation: ProductNavigationProp;
  route: ProductRouteProp;
}> = ({navigation, route: {params}}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const {
    preassigned_fare_products: preassignedFareProducts,
  } = useRemoteConfig();

  const findProduct = (id: string) =>
    preassignedFareProducts.find((p) => p.id === id)!;

  const [selectedProduct, setSelectedProduct] = useState(
    findProduct(params.preassignedFareProductId),
  );

  const selectableProducts = preassignedFareProducts.filter(
    (p) => p.type === selectedProduct.type,
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(ProductTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView style={styles.productsSection}>
        <Sections.Section>
          <Sections.RadioSection<PreassignedFareProduct>
            items={selectableProducts}
            itemToText={(p) => getReferenceDataName(p, language)}
            keyExtractor={(p) => p.id}
            onSelect={setSelectedProduct}
            selected={selectedProduct}
          />
        </Sections.Section>
      </ScrollView>

      <FullScreenFooter>
        <Button
          color="primary_2"
          text={t(ProductTexts.primaryButton.text)}
          onPress={() => {
            navigation.navigate('PurchaseOverview', {
              preassignedFareProduct: selectedProduct,
            });
          }}
        />
      </FullScreenFooter>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_2.backgroundColor,
  },
  productsSection: {
    margin: theme.spacings.medium,
  },
  saveButton: {
    marginHorizontal: theme.spacings.medium,
  },
}));

export default Product;
