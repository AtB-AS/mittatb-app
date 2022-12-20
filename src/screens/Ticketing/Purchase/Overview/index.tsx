import {MessageBox} from '@atb/components/message-box';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  getTextForLanguage,
  Language,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {FareProductTypeAvailability} from '../../FareContracts/utils';
import {PurchaseScreenProps} from '../types';
import ProductSelection from './components/ProductSelection';
import PurchaseMessages from './components/PurchaseMessages';
import StartTimeSelection from './components/StartTimeSelection';
import Summary from './components/Summary';
import TravellerSelection from './components/TravellerSelection';
import ZonesSelection from './components/ZonesSelection';
import {useOfferDefaults} from './use-offer-defaults';
import useOfferState from './use-offer-state';
import {Timestamp} from '@atb/ticketing';
import {
  formatToVerboseDateTime,
  formatLocaleTime,
  formatToFullWeekday,
  isBetween,
  replaceTimeOn,
} from '@atb/utils/date';
import firestore from '@react-native-firebase/firestore';
import {TFunc} from '@leile/lobo-t';

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

  const {configuration: fareProductTypeConfiguration, availability} =
    params.fareProductTypeConfig;
  const {
    timeSelectionMode,
    productSelectionMode,
    travellerSelectionMode,
    offerEndpoint,
  } = fareProductTypeConfiguration;
  const restrictionMessage = useAvailabilityMessage(availability);

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
            restrictionMessage={restrictionMessage}
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
            disablePurchaseButton={!!restrictionMessage}
          />
        </FullScreenFooter>
      </ScrollView>
    </View>
  );
};

export const isDateBetweenWeekAndTime = (
  currentDate: Date,
  fromTimestamp: Timestamp,
  toTimestamp: Timestamp,
) => {
  const fromDate = fromTimestamp.toDate();
  const toDate = toTimestamp.toDate();
  const newfromDate = replaceTimeOn(currentDate, fromDate);
  const newtoDate = replaceTimeOn(currentDate, toDate);
  // Swap sundays from 0 to 7
  const fromWeekDay = fromDate.getDay() == 0 ? 7 : fromDate.getDay();
  const toWeekDay = toDate.getDay() == 0 ? 7 : toDate.getDay();

  return (
    currentDate.getDay() >= fromWeekDay &&
    currentDate.getDay() <= toWeekDay &&
    isBetween(currentDate, newfromDate, newtoDate)
  );
};

export const useAvailabilityMessage = (
  availability?: FareProductTypeAvailability,
) => {
  const {t, language} = useTranslation();

  if (!availability) return;

  let currentDate = new Date();
  let isBetweenAvailableTime = availability.alwaysEnableAt.some((tr) =>
    isDateBetweenWeekAndTime(currentDate, tr.from, tr.to),
  );
  let isEnabledAt = availability.enabledAt.some((tr) =>
    isBetween(currentDate, tr.from.toDate(), tr.to.toDate()),
  );
  let disableAt = availability.disableAt.find((tr) =>
    isBetween(currentDate, tr.from.toDate(), tr.to.toDate()),
  );

  if (disableAt) {
    return t(
      PurchaseOverviewTexts.availability.disabled(
        formatToVerboseDateTime(disableAt.from.toDate(), language),
        formatToVerboseDateTime(disableAt.to.toDate(), language),
      ),
    );
  }

  if (isEnabledAt) {
    return;
  }

  if (!isBetweenAvailableTime) {
    const formatedDates = availability.alwaysEnableAt.map((tr) =>
      formatDatesRange(tr.from.toDate(), tr.to.toDate(), t, language),
    );
    return t(
      PurchaseOverviewTexts.availability.isNotBetweenAvailableTime(
        formatedDates.join(t(PurchaseOverviewTexts.availability.separator)),
      ),
    );
  }

  return;
};

const formatDatesRange = (
  fromDate: Date,
  toDate: Date,
  t: TFunc<typeof Language>,
  language: Language,
) => {
  return `${formatWeekDaysRange(fromDate, toDate, t, language)} ${t(
    PurchaseOverviewTexts.availability.between,
  )} ${formatLocaleTime(fromDate, language)} - ${formatLocaleTime(
    toDate,
    language,
  )}`;
};

const formatWeekDaysRange = (
  fromDate: Date,
  toDate: Date,
  t: TFunc<typeof Language>,
  language: Language,
) => {
  if (fromDate.getDay() === toDate.getDay()) {
    return formatToFullWeekday(fromDate, language);
  }

  return `${formatToFullWeekday(fromDate, language)} ${t(
    PurchaseOverviewTexts.availability.to,
  )} ${formatToFullWeekday(toDate, language)}`;
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
