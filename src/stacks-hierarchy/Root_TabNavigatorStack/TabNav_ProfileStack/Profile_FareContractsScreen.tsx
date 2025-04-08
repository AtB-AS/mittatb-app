import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {DetailsContent} from '@atb/modules/fare-contracts';
import {FareContractOrReservation} from '@atb/modules/fare-contracts';
import {findReferenceDataById} from '@atb/configuration';
import {StyleSheet, Theme} from '@atb/theme';
import {Reservation} from '@atb/ticketing';
import {TravelRightDirection, FareContractType} from '@atb-as/utils';
import {addDays} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useAuthContext} from '@atb/auth';

export const Profile_FareContractsScreen = () => {
  const styles = useStyles();

  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const getPreassignedFareProduct = (fcRef: string) =>
    findReferenceDataById(preassignedFareProducts, fcRef);

  const daysFromNow = (d: number) => addDays(new Date(), d);
  const NOW = new Date();
  const {abtCustomerId} = useAuthContext();

  const RESERVATION: Reservation = {
    created: NOW,
    customerAccountId: abtCustomerId,
    // discount: 0,
    orderId: 'DW2N19A6',
    paymentId: 870266,
    paymentStatus: 'CREATE',
    paymentType: 2,
    // shouldStartNow: true,
    transactionId: 858879,
    url: 'https://test.epayment.nets.eu/Terminal/default.aspx?merchantId=12003727&transactionId=0643eeff83a1467f85a577cac32c36ed',
  };

  const BASE = {
    created: NOW,
    customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
    purchasedBy: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
    id: 'ATB:FareContract:V3TZT6NE-xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
    orderId: 'V3TZT6NE',
    paymentType: ['VISA'],
    qrCode:
      'CioKKBImCiRmM2I4ZjQ1NC0wNGZiLTRlY2UtODc5ZC0wNDY2MzhiOWEzNjgSUwo+MDwCHDde9IPYTgNlJVADldKpl5GnkVowFiejaqbAcF0CHDqRdXIKEoOg0O67eH9sg8hNOuCYH35KJQ0oq2gaAU4qDAiXr++oBhDol5+uAjAB',
    state: 2,
    totalAmount: '1755.00',
    totalTaxAmount: '188.04',
    version: '1',
    travelRights: [
      {
        authorityRef: 'ATB:Authority:2',
        customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
        endDateTime: daysFromNow(11),
        startDateTime: daysFromNow(-1),
        status: 5,
        usageValidityPeriodRef: '',
        userProfileRef: 'ATB:UserProfile:8ee842e3',
        direction: TravelRightDirection.Unspecified,
      },
    ],
  };

  const WEEKLY_PASS_BOAT = {
    ...BASE,
    travelRights: [
      {
        ...BASE.travelRights[0],
        fareProductRef: 'ATB:PreassignedFareProduct:5f61ee14',
        id: 'ATB:CustomerPurchasePackage:MMLMWZUV',
        direction: TravelRightDirection.Both,
        startPointRef: 'NSR:StopPlace:74006',
        endPointRef: 'NSR:StopPlace:74009',
      },
    ],
  };

  const YOUTH_TICKET = {
    ...BASE,
    travelRights: [
      {
        ...BASE.travelRights[0],
        fareProductRef: 'ATB:PreassignedFareProduct:47bb613e',
        id: 'ATB:CustomerPurchasePackage:Y1EGBK3C',
      },
    ],
  };

  const NIGHT_TICKET = {
    ...BASE,
    travelRights: [
      {
        ...BASE.travelRights[0],
        fareProductRef: 'ATB:PreassignedFareProduct:8f351521',
        id: 'ATB:CustomerPurchasePackage:Y1EGBK3C',
      },
    ],
  };
  const WEEKLY_PASS = {
    ...BASE,
    travelRights: [
      {
        ...BASE.travelRights[0],
        fareProductRef: 'ATB:PreassignedFareProduct:6dd9beab',
        id: 'ATB:CustomerPurchasePackage:83HMVOBI',
        tariffZoneRefs: [
          'ATB:TariffZone:1',
          'ATB:TariffZone:2',
          'ATB:TariffZone:3',
        ],
      },
    ],
  };

  const SINGLE_BOAT_TICKET = {
    ...BASE,
    travelRights: [
      {
        ...BASE.travelRights[0],
        fareProductRef: 'ATB:PreassignedFareProduct:c4467e3a',
        id: 'ATB:CustomerPurchasePackage:83HMVOBI',
        direction: TravelRightDirection.Forwards,
        endPointRef: 'NSR:StopPlace:40114',
        startPointRef: 'NSR:StopPlace:74007',
      },
    ],
  };

  const CARNET_TICKET = {
    ...BASE,
    travelRights: [
      {
        ...BASE.travelRights[0],
        fareProductRef: 'ATB:AmountOfPriceUnitProduct:KlippekortBuss',
        id: 'ATB:CustomerPurchasePackage:4cb81f08-4499-44c4-8e23-507256f782a6-1',
        maximumNumberOfAccesses: 10,
        numberOfUsedAccesses: 1,
        status: 5,
        usedAccesses: [
          {
            startDateTime: daysFromNow(-5),
            endDateTime: daysFromNow(-4),
          },
        ],
      },
      {
        ...BASE.travelRights[0],
        fareProductRef: 'ATB:AmountOfPriceUnitProduct:KlippekortBuss',
        id: 'ATB:CustomerPurchasePackage:4cb81f08-4499-44c4-8e23-507256f782a6-2',
        maximumNumberOfAccesses: 10,
        numberOfUsedAccesses: 1,
        status: 5,
        usedAccesses: [
          {
            startDateTime: daysFromNow(-2),
            endDateTime: daysFromNow(1),
          },
        ],
      },
    ],
  };

  const CARNET_TICKET_INACTIVE = {
    ...BASE,
    state: 1,
    travelRights: [
      {
        ...BASE.travelRights[0],
        fareProductRef: 'ATB:AmountOfPriceUnitProduct:KlippekortBuss',
        id: 'ATB:CustomerPurchasePackage:4cb81f08-4499-44c4-8e23-507256f782a6-1',
        maximumNumberOfAccesses: 50,
        numberOfUsedAccesses: 3,
        status: 1,
        usedAccesses: [
          {
            startDateTime: daysFromNow(-2),
            endDateTime: daysFromNow(-1),
          },
        ],
      },
    ],
  };

  const fareContracts = [
    WEEKLY_PASS,
    NIGHT_TICKET,
    SINGLE_BOAT_TICKET,
    WEEKLY_PASS_BOAT,
    CARNET_TICKET,
    CARNET_TICKET_INACTIVE,
    YOUTH_TICKET,
  ] as FareContractType[];

  return (
    <View style={styles.container}>
      <FullScreenHeader title="Fare Contracts" leftButton={{type: 'back'}} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <ThemeText typography="heading--jumbo">Reservation</ThemeText>
        <FareContractOrReservation
          index={0}
          onPressFareContract={() => {}}
          fcOrReservation={RESERVATION}
          now={Date.now()}
        />
        <ThemeText typography="heading--jumbo">Fare Contracts</ThemeText>
        {fareContracts.map((fc, i) => (
          <FareContractOrReservation
            key={i}
            index={i}
            fcOrReservation={fc}
            now={Date.now()}
            onPressFareContract={() => {}}
          />
        ))}
        <ThemeText typography="heading--jumbo">Fare contract details</ThemeText>
        {fareContracts.map((fc, i) => (
          <DetailsContent
            key={i}
            fareContract={fc}
            preassignedFareProduct={getPreassignedFareProduct(
              (fc.travelRights[0] as unknown as any).fareProductRef,
            )}
            now={Date.now()}
            onReceiptNavigate={() => {}}
            onNavigateToMap={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[1].background,
    flex: 1,
  },
  content: {
    padding: theme.spacing.medium,
  },
  contentContainer: {
    rowGap: theme.spacing.large,
  },
}));
