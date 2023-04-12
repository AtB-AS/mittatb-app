import {MessageBox} from '@atb/components/message-box';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {FullScreenHeader} from '@atb/components/screen-header';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import ProductSelection from './components/ProductSelection';
import PurchaseMessages from './components/PurchaseMessages';
import StartTimeSelection from './components/StartTimeSelection';
import Summary from './components/Summary';
import TravellerSelection from './components/TravellerSelection';
import ZonesSelection from './components/ZonesSelection';
import {useOfferDefaults} from './use-offer-defaults';
import useOfferState from './use-offer-state';
import {FlexTicketDiscountInfo} from './components/FlexTicketDiscountInfo';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {defaultTariffZone} from '@atb/configuration/defaults';

type Props = RootStackScreenProps<'Root_PurchaseOverviewScreen'>;

export const Root_PurchaseOverviewScreen: React.FC<Props> = ({
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
  const [travelDate, setTravelDate] = useState<string | undefined>(
    params.travelDate,
  );

  const {timeSelectionMode, travellerSelectionMode, zoneSelectionMode} =
    params.fareProductTypeConfig.configuration;

  const {
    isSearchingOffer,
    error,
    totalPrice,
    refreshOffer,
    userProfilesWithCountAndOffer,
  } = useOfferState(
    zoneSelectionMode === 'none' ? 'authority' : 'zones',
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    travellerSelection,
    travelDate,
  );

  const isEmptyOffer = error?.type === 'empty-offers';

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
  }, [params?.refreshOffer]);

  const closeModal = () => navigation.goBack();

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
        {params.mode === 'TravelSearch' && (
          <MessageBox
            style={styles.travelSearchInfo}
            type={'valid'}
            message={t(PurchaseOverviewTexts.travelSearchInfo)}
          />
        )}
        <View style={styles.selectionLinks}>
          {error && (
            <MessageBox
              type="error"
              title={t(PurchaseOverviewTexts.errorMessageBox.title)}
              message={
                isEmptyOffer
                  ? t(
                      PurchaseOverviewTexts.errorMessageBox.productUnavailable(
                        getReferenceDataName(preassignedFareProduct, language),
                      ),
                    )
                  : t(PurchaseOverviewTexts.errorMessageBox.message)
              }
              onPressConfig={
                !isEmptyOffer
                  ? {
                      action: refreshOffer,
                      text: t(dictionary.retry),
                    }
                  : undefined
              }
              style={styles.selectionComponent}
            />
          )}

          <ProductSelection
            preassignedFareProduct={preassignedFareProduct}
            fareProductTypeConfig={params.fareProductTypeConfig}
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
            fromTariffZone={fromTariffZone || defaultTariffZone}
            toTariffZone={toTariffZone || defaultTariffZone}
            fareProductTypeConfig={params.fareProductTypeConfig}
            onSelect={(t) =>
              navigation.push('Root_PurchaseTariffZonesSearchByMapScreen', t)
            }
            style={styles.selectionComponent}
          />

          <StartTimeSelection
            selectionMode={timeSelectionMode}
            color="interactive_2"
            travelDate={travelDate}
            setTravelDate={setTravelDate}
            validFromTime={travelDate}
            style={styles.selectionComponent}
          />

          <FlexTicketDiscountInfo
            userProfiles={userProfilesWithCountAndOffer}
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
            userProfilesWithCount={travellerSelection}
            fareProductTypeConfig={params.fareProductTypeConfig}
            onPressBuy={() =>
              navigation.navigate('Root_PurchaseConfirmationScreen', {
                fareProductTypeConfig: params.fareProductTypeConfig,
                fromTariffZone,
                toTariffZone,
                userProfilesWithCount: travellerSelection,
                preassignedFareProduct,
                travelDate,
                headerLeftButton: {type: 'back'},
                mode: params.mode,
              })
            }
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
    backgroundColor: theme.static.background.background_1.background,
  },
  selectionComponent: {
    marginVertical: theme.spacings.medium,
  },
  selectionLinks: {
    margin: theme.spacings.medium,
  },
  summary: {
    marginTop: theme.spacings.medium,
  },
  travelSearchInfo: {
    marginHorizontal: theme.spacings.medium,
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.medium,
  },
}));
