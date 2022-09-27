import MessageBox from '@atb/components/message-box';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {TicketPurchaseScreenProps} from '../types';
import {getPurchaseFlow} from '../utils';
import DurationSelection from './components/DurationSelection';
import PurchaseMessages from './components/PurchaseMessages';
import StartTimeSelection from './components/StartTimeSelection';
import Summary from './components/Summary';
import TravellerSelection from './components/TravellerSelection';
import Zones from './components/Zones';
import {useOfferDefaults} from './use-offer-defaults';
import useOfferState from './use-offer-state';

type OverviewProps = TicketPurchaseScreenProps<'PurchaseOverview'>;

const PurchaseOverview: React.FC<OverviewProps> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const {
    preassignedFareProduct,
    selectableTravellers,
    fromTariffZone,
    toTariffZone,
  } = useOfferDefaults(
    params.preassignedFareProduct,
    params.selectableProductType,
    params.userProfilesWithCount,
    params.fromTariffZone,
    params.toTariffZone,
  );

  const [selectedPreassignedFareProduct, setSelectedPreassignedFareProduct] =
    useState(preassignedFareProduct);
  const [travellerSelection, setTravellerSelection] =
    useState(selectableTravellers);
  const hasSelection = travellerSelection.some((u) => u.count);
  const [travelDate, setTravelDate] = useState<string | undefined>();

  const {isSearchingOffer, error, totalPrice, refreshOffer} = useOfferState(
    selectedPreassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    travellerSelection,
    travelDate,
  );

  const {travelDateSelectionEnabled, durationSelectionEnabled} =
    getPurchaseFlow(preassignedFareProduct.type);

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
  }, [params?.refreshOffer]);

  const closeModal = () =>
    navigation.navigate('TabNavigator', {
      screen: 'Ticketing',
      params: {
        screen: 'BuyTickets',
      },
    });

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(
          PurchaseOverviewTexts.header.title[
            selectedPreassignedFareProduct.type
          ],
        )}
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
              onPress={refreshOffer}
              onPressText={t(MessageBoxTexts.tryAgainButton)}
              containerStyle={styles.selectionComponent}
            />
          )}

          {durationSelectionEnabled && (
            <DurationSelection
              color="interactive_2"
              selectedProduct={selectedPreassignedFareProduct}
              setSelectedProduct={setSelectedPreassignedFareProduct}
              style={styles.selectionComponent}
            />
          )}

          <TravellerSelection
            setTravellerSelection={setTravellerSelection}
            preassignedFareProduct={preassignedFareProduct}
            selectableUserProfiles={selectableTravellers}
            style={styles.selectionComponent}
          />

          <Zones
            fromTariffZone={fromTariffZone}
            toTariffZone={toTariffZone}
            style={styles.selectionComponent}
            isApplicableOnSingleZoneOnly={
              selectedPreassignedFareProduct.isApplicableOnSingleZoneOnly
            }
          />

          {travelDateSelectionEnabled && (
            <StartTimeSelection
              color="interactive_2"
              travelDate={travelDate}
              setTravelDate={setTravelDate}
              validFromTime={travelDate}
              style={styles.selectionComponent}
            />
          )}
        </View>

        <PurchaseMessages
          preassignedFareProduct={selectedPreassignedFareProduct}
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
            preassignedFareProduct={selectedPreassignedFareProduct}
            travelDate={travelDate}
            style={styles.summary}
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
