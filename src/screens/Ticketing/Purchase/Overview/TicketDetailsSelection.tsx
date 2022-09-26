import MessageBox from '@atb/components/message-box';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {
  PreassignedFareProduct,
  PreassignedFareProductType,
} from '@atb/reference-data/types';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {TariffZoneWithMetadata} from '../TariffZones';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import {getPurchaseFlow} from '../utils';
import DurationSelection from './components/DurationSelection';
import PurchaseMessages from './components/PurchaseMessages';
import StartTimeSelection from './components/StartTimeSelection';
import Summary from './components/Summary';
import TravellerSelection from './components/TravellerSelection';
import Zones from './components/Zones';
import useOfferState from './use-offer-state';

export type TicketDetailsSelectionProps = {
  preassignedFareProduct: PreassignedFareProduct;
  refreshOffer?: boolean;
  selectableTravellers: UserProfileWithCount[];
  selectableProductType?: PreassignedFareProductType;
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  travelDate?: string;
};

const TicketDetailsSelection: React.FC<TicketDetailsSelectionProps> = (
  params,
) => {
  const {fromTariffZone, toTariffZone} = params;
  const styles = useStyles();
  const {t} = useTranslation();

  const [preassignedFareProduct, setPreassignedFareProduct] = useState(
    params.preassignedFareProduct,
  );

  const [travellerSelection, setTravellerSelection] = useState(
    params.selectableTravellers,
  );
  const hasSelection = params.selectableTravellers.some((u) => u.count);

  const [travelDate, setTravelDate] = useState<string | undefined>();

  const {isSearchingOffer, error, totalPrice, refreshOffer} = useOfferState(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    travellerSelection,
    travelDate,
  );

  const {travelDateSelectionEnabled} = getPurchaseFlow(preassignedFareProduct);

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
  }, [params?.refreshOffer]);

  return (
    <>
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

        {preassignedFareProduct.type === 'period' && (
          <DurationSelection
            color="interactive_2"
            selectedProduct={preassignedFareProduct}
            setSelectedProduct={setPreassignedFareProduct}
            style={styles.selectionComponent}
          />
        )}

        <TravellerSelection
          setTravellerSelection={setTravellerSelection}
          preassignedFareProduct={preassignedFareProduct}
          selectableUserProfiles={params.selectableTravellers}
          style={styles.selectionComponent}
        />

        <Zones
          fromTariffZone={fromTariffZone}
          toTariffZone={toTariffZone}
          style={styles.selectionComponent}
          isApplicableOnSingleZoneOnly={
            preassignedFareProduct.isApplicableOnSingleZoneOnly
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
        preassignedFareProduct={preassignedFareProduct}
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
        />
      </FullScreenFooter>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  selectionComponent: {
    marginVertical: theme.spacings.medium,
  },
  selectionLinks: {margin: theme.spacings.medium},
  totalSection: {flex: 1, textAlign: 'center'},
  toPaymentButton: {marginHorizontal: theme.spacings.medium},
  warning: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  summary: {marginTop: theme.spacings.medium},
}));

export default TicketDetailsSelection;
