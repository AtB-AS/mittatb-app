import {MessageBox} from '@atb/components/message-box';
import {FullScreenFooter} from '@atb/components/screen-footer';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {PurchaseScreenProps} from '../types';
import ProductSelection from './components/ProductSelection';
import PurchaseMessages from './components/PurchaseMessages';
import StartTimeSelection from './components/StartTimeSelection';
import Summary from './components/Summary';
import TravellerSelection from './components/TravellerSelection';
import ZonesSelection from './components/ZonesSelection';
import {useOfferDefaults} from './use-offer-defaults';
import useOfferState from './use-offer-state';

type OverviewProps = PurchaseScreenProps<'PurchaseOverview'>;

const PurchaseOverview: React.FC<OverviewProps> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const {
    preassignedFareProduct,
    selectableTravellers,
    fromTariffZone,
    toTariffZone,
  } = useOfferDefaults(
    params.preassignedFareProduct,
    params.fareProductTypeConfig.type,
    params.userProfilesWithCount,
    params.fromTariffZone,
    params.toTariffZone,
  );

  const onSelectPreassignedFareProduct = (fp: PreassignedFareProduct) => {
    navigation.setParams({
      preassignedFareProduct: fp,
    });
  };
  const [travellerSelection, setTravellerSelection] =
    useState(selectableTravellers);
  const hasSelection = travellerSelection.some((u) => u.count);
  const [travelDate, setTravelDate] = useState<string | undefined>();

  const {
    timeSelectionMode,
    productSelectionMode,
    travellerSelectionMode,
    offerEndpoint,
  } = params.fareProductTypeConfig.configuration;

  const {isSearchingOffer, error, totalPrice, refreshOffer} = useOfferState(
    offerEndpoint,
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    travellerSelection,
    travelDate,
  );

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
  }, [params?.refreshOffer]);

  const closeModal = () =>
    navigation.navigate('TabNavigator', {
      screen: 'Ticketing',
      params: {
        screen: 'PurchaseTab',
      },
    });

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={getTextForLanguage(params.fareProductTypeConfig.name, language)}
        leftButton={{
          type: 'cancel',
          onPress: closeModal,
        }}
        globalMessageContext="app-ticketing"
      />

      <ScrollView testID="ticketingScrollView">
        <View style={styles.selectionLinks}>
          {error && (
            <MessageBox
              type="error"
              title={t(PurchaseOverviewTexts.errorMessageBox.title)}
              message={t(PurchaseOverviewTexts.errorMessageBox.message)}
              onPressConfig={{
                action: refreshOffer,
                text: t(dictionary.retry),
              }}
              style={styles.selectionComponent}
            />
          )}

          <ProductSelection
            preassignedFareProduct={preassignedFareProduct}
            selectionMode={productSelectionMode}
            setSelectedProduct={onSelectPreassignedFareProduct}
            style={styles.selectionComponent}
          />

          <TravellerSelection
            setTravellerSelection={setTravellerSelection}
            fareProductType={preassignedFareProduct.type}
            selectionMode={travellerSelectionMode}
            selectableUserProfiles={selectableTravellers}
            style={styles.selectionComponent}
          />

          <ZonesSelection
            fromTariffZone={fromTariffZone}
            toTariffZone={toTariffZone}
            style={styles.selectionComponent}
            fareProductTypeConfig={params.fareProductTypeConfig}
          />

          <StartTimeSelection
            selectionMode={timeSelectionMode}
            color="interactive_2"
            travelDate={travelDate}
            setTravelDate={setTravelDate}
            validFromTime={travelDate}
            style={styles.selectionComponent}
          />
        </View>

        <PurchaseMessages
          preassignedFareProductType={preassignedFareProduct.type}
          fromTariffZone={fromTariffZone}
          toTariffZone={toTariffZone}
        />

        <FullScreenFooter>
          <Summary
            isLoading={isSearchingOffer}
            isError={!!error || !hasSelection}
            price={totalPrice}
            fromTariffZone={fromTariffZone}
            toTariffZone={toTariffZone}
            userProfilesWithCount={travellerSelection}
            preassignedFareProduct={preassignedFareProduct}
            travelDate={travelDate}
            style={styles.summary}
            fareProductTypeConfig={params.fareProductTypeConfig}
          />
        </FullScreenFooter>
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
  selectionComponent: {
    marginVertical: theme.spacings.medium,
  },
  selectionLinks: {margin: theme.spacings.medium},
  summary: {marginTop: theme.spacings.medium},
}));

export default PurchaseOverview;
