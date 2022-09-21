import MessageBox from '@atb/components/message-box';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {TicketOverviewProps} from '..';
import PurchaseMessages from '../components/PurchaseWarnings';
import Summary from '../components/Summary';
import TravellerSelection from '../components/TravellerSelection';
import Zones from '../components/Zones';
import useOfferState from '../use-offer-state';

const SingleTicketOverview: React.FC<TicketOverviewProps> = (props) => {
  const {fromTariffZone, toTariffZone, preassignedFareProduct} = props;
  const styles = useStyles();
  const {t} = useTranslation();

  const [travellerSelection, setTravellerSelection] = useState(
    props.selectableTravellers,
  );

  const {isSearchingOffer, error, totalPrice, refreshOffer} = useOfferState(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    travellerSelection,
    undefined,
  );
  useEffect(() => {
    if (props?.refreshOffer) {
      refreshOffer();
    }
  }, [props?.refreshOffer]);

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

        <TravellerSelection
          setTravellerSelection={setTravellerSelection}
          preassignedFareProduct={preassignedFareProduct}
          selectableUserProfiles={props.selectableTravellers}
          style={styles.selectionComponent}
          mode="multiple"
        />

        <Zones
          fromTariffZone={fromTariffZone}
          toTariffZone={toTariffZone}
          style={styles.selectionComponent}
          isApplicableOnSingleZoneOnly={
            preassignedFareProduct.isApplicableOnSingleZoneOnly
          }
        />
      </View>

      <PurchaseMessages
        preassignedFareProduct={preassignedFareProduct}
        fromTariffZone={fromTariffZone}
        toTariffZone={toTariffZone}
      />

      <FullScreenFooter>
        <Summary
          isLoading={isSearchingOffer}
          isError={!!error}
          price={totalPrice}
          fromTariffZone={fromTariffZone}
          toTariffZone={toTariffZone}
          userProfilesWithCount={travellerSelection}
          preassignedFareProduct={preassignedFareProduct}
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
  summary: {marginTop: theme.spacings.medium},
}));

export default SingleTicketOverview;
