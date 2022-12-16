import {MessageBox} from '@atb/components/message-box';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {useFareProductTypeConfig} from '@atb/configuration/utils';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
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

type OverviewProps = PurchaseScreenProps<'PurchaseOverview'>;

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

  const onSelectPreassignedFareProduct = (fp: PreassignedFareProduct) => {
    navigation.setParams({
      preassignedFareProduct: fp,
    });
  };
  const [travellerSelection, setTravellerSelection] =
    useState(selectableTravellers);
  const hasSelection = travellerSelection.some((u) => u.count);
  const [travelDate, setTravelDate] = useState<string | undefined>();
  const fareProductTypeConfig = useFareProductTypeConfig(
    preassignedFareProduct.type,
  );
  const {configuration: fareProductTypeConfiguration, availability} =
    fareProductTypeConfig;
  const {
    timeSelectionMode,
    productSelectionMode,
    travellerSelectionMode,
    zoneSelectionMode,
    offerEndpoint,
  } = fareProductTypeConfiguration;
  // TODO: Remove it when tests are not needed, in that case, use `availability` instead!
  const availabilityDummy = {
    alwaysEnableAt: [
      {
        from: firestore.Timestamp.fromDate(new Date('2022-12-16T15:25:00')),
        to: firestore.Timestamp.fromDate(new Date('2022-12-17T15:30:00')),
      },
      {
        from: firestore.Timestamp.fromDate(new Date('2022-12-12T15:25:00')),
        to: firestore.Timestamp.fromDate(new Date('2022-12-12T15:30:00')),
      },
    ],
    disableAt: [
      {
        from: firestore.Timestamp.fromDate(new Date('2022-12-15T14:00:00')),
        to: firestore.Timestamp.fromDate(new Date('2022-12-20T15:00:00')),
      },
      {
        from: firestore.Timestamp.fromDate(new Date('2022-12-15T14:00:00')),
        to: firestore.Timestamp.fromDate(new Date('2022-12-15T15:00:00')),
      },
    ],
  } as FareProductTypeAvailability;

  const restrictionMessage = useAvailabilityMessage(availabilityDummy);

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
        title={t(
          PurchaseOverviewTexts.header.title[preassignedFareProduct.type],
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
            selectionMode={zoneSelectionMode}
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
            fareProductTypeConfig={fareProductTypeConfig}
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
  const {language} = useTranslation();

  if (!availability) return;

  let currentDate = new Date(); // TODO: Replace with a more trusted time source
  let isEnabledForToday = availability.alwaysEnableAt.some((tr) =>
    isDateBetweenWeekAndTime(currentDate, tr.from, tr.to),
  );
  let disableAt = availability.disableAt.find((tr) =>
    isBetween(currentDate, tr.from.toDate(), tr.to.toDate()),
  );

  // TODO: Use translated texts
  if (disableAt) {
    return `ikke tilgjenjelig mellom ${formatToVerboseDateTime(
      disableAt.from.toDate(),
      language,
    )} til ${formatToVerboseDateTime(disableAt.to.toDate(), language)}`;
  }

  if (!isEnabledForToday) {
    const formatedDates = availability.alwaysEnableAt.map((tr) =>
      formatDatesRange(tr.from.toDate(), tr.to.toDate(), language),
    );
    return `kun tilgjenjelig ${formatedDates.join(' og ')}`;
  }

  return undefined;
};

const formatDatesRange = (fromDate: Date, toDate: Date, language: Language) => {
  return `${formatWeekDaysRange(
    fromDate,
    toDate,
    language,
  )} mellom ${formatLocaleTime(fromDate, language)} - ${formatLocaleTime(
    toDate,
    language,
  )}`;
};

const formatWeekDaysRange = (
  fromDate: Date,
  toDate: Date,
  language: Language,
) => {
  if (fromDate.getDay() === toDate.getDay()) {
    return formatToFullWeekday(fromDate, language);
  }

  return `${formatToFullWeekday(fromDate, language)} til ${formatToFullWeekday(
    toDate,
    language,
  )}`;
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
