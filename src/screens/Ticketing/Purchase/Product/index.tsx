import React, {useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import Header from '../../../../ScreenHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, useTheme} from '../../../../theme';
import {DismissableStackNavigationProp} from '../../../../navigation/createDismissableStackNavigator';
import * as Sections from '../../../../components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {ProductTexts, useTranslation} from '../../../../translations';
import Button from '../../../../components/button';
import {getReferenceDataName} from '../../../../reference-data/utils';
import {useRemoteConfig} from '../../../../RemoteConfigContext';
import {PreassignedFareProduct} from '../../../../reference-data/types';

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
  const {theme} = useTheme();
  const {t, language} = useTranslation();

  const {
    preassigned_fare_products: preassignedFareProducts,
  } = useRemoteConfig();

  const findProduct = (id: string) =>
    preassignedFareProducts.find((p) => p.id === id);

  const [selectedProduct, setSelectedProduct] = useState(
    findProduct(params.preassignedFareProductId),
  );

  const {top: safeAreaTop, bottom: safeAreBottom} = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: safeAreaTop}]}>
      <Header
        title={t(ProductTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView style={styles.productsSection}>
        <Sections.Section>
          <Sections.RadioSection<PreassignedFareProduct>
            items={preassignedFareProducts}
            itemToText={(p) => getReferenceDataName(p, language)}
            keyExtractor={(p) => p.id}
            onSelect={setSelectedProduct}
            selected={selectedProduct}
          />
        </Sections.Section>
      </ScrollView>

      <View
        style={[
          styles.saveButton,
          {
            paddingBottom: Math.max(safeAreBottom, theme.spacings.medium),
          },
        ]}
      >
        <Button
          mode="primary"
          text={t(ProductTexts.primaryButton.text)}
          onPress={() => {
            navigation.navigate('PurchaseOverview', {
              preassignedFareProduct: selectedProduct,
            });
          }}
        />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
  productsSection: {
    margin: theme.spacings.medium,
  },
  saveButton: {
    marginHorizontal: theme.spacings.medium,
  },
}));

export default Product;
