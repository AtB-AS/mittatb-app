import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {useFirestoreConfiguration} from '@atb/configuration';
import {DetailsContent, SimpleFareContract} from '@atb/fare-contracts';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {StyleSheet, Theme} from '@atb/theme';
import {FareContract, Reservation, TravelRightDirection} from '@atb/ticketing';
import {addDays} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {FirestoreTimestamp} from './utils';

const daysFromNow = (d: number) => addDays(new Date(), d);
const toTimeStamp = (date: Date) =>
  new FirestoreTimestamp(Math.floor(date.valueOf() / 1000), 0);
const NOW = new Date();

export const Profile_FareContractsScreen = () => {
  const styles = useStyles();

  const {preassignedFareProducts} = useFirestoreConfiguration();
  const getPreassignedFareProduct = (fcRef: string) =>
    findReferenceDataById(preassignedFareProducts, fcRef);

  const fareContracts = [
    WEEKLY_PASS,
    NIGHT_TICKET,
    SINGLE_BOAT_TICKET,
    WEEKLY_PASS_BOAT,
    CARNET_TICKET,
  ] as FareContract[];

  return (
    <View style={styles.container}>
      <FullScreenHeader title="Fare Contracts" leftButton={{type: 'back'}} />

      <ScrollView style={styles.content}>
        <FareContractOrReservation
          index={0}
          onPressFareContract={() => {}}
          fcOrReservation={RESERVATION}
          now={Date.now()}
        />
        {fareContracts.map((fc, i) => (
          <SimpleFareContract
            key={i}
            fareContract={fc}
            now={Date.now()}
            onPressDetails={() => {}}
          />
        ))}

        <ThemeText type="heading--jumbo">Details</ThemeText>
        {fareContracts.map((fc, i) => (
          <DetailsContent
            key={i}
            fareContract={fc}
            preassignedFareProduct={getPreassignedFareProduct(
              (fc.travelRights[0] as unknown as any).fareProductRef,
            )}
            now={Date.now()}
            onReceiptNavigate={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  content: {
    padding: theme.spacings.medium,
  },
}));

const WEEKLY_PASS_BOAT = {
  created: toTimeStamp(NOW),
  customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  eventTimestamp: toTimeStamp(daysFromNow(-1)),
  id: 'ATB:FareContract:V3TZT6NE-xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  minimumSecurityLevel: -200,
  orderId: 'V3TZT6NE',
  paymentType: ['VISA'],
  paymentTypeGroup: ['PAYMENTCARD'],
  qrCode:
    'CioKKBImCiRmM2I4ZjQ1NC0wNGZiLTRlY2UtODc5ZC0wNDY2MzhiOWEzNjgSUwo+MDwCHDde9IPYTgNlJVADldKpl5GnkVowFiejaqbAcF0CHDqRdXIKEoOg0O67eH9sg8hNOuCYH35KJQ0oq2gaAU4qDAiXr++oBhDol5+uAjAB',
  state: 2,
  totalAmount: '1755.00',
  totalTaxAmount: '188.04',
  travelRights: [
    {
      // authorityRef: 'ATB:Authority:2',
      // customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
      direction: TravelRightDirection.Both,
      endDateTime: toTimeStamp(daysFromNow(11)),
      endPointRef: 'NSR:StopPlace:74009',
      fareProductRef: 'ATB:PreassignedFareProduct:5f61ee14',
      id: 'ATB:CustomerPurchasePackage:MMLMWZUV',
      startDateTime: toTimeStamp(daysFromNow(-1)),
      startPointRef: 'NSR:StopPlace:74006',
      status: 5,
      type: 'PeriodBoatTicket',
      usageValidityPeriodRef: '',
      userProfileRef: 'ATB:UserProfile:8ee842e3',
    },
  ],
  version: '1',
};

const WEEKLY_PASS = {
  created: toTimeStamp(NOW),
  customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  eventTimestamp: toTimeStamp(NOW),
  id: 'ATB:FareContract:IBIEXQ2D-xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  minimumSecurityLevel: -200,
  orderId: 'IBIEXQ2D',
  paymentType: ['VISA'],
  paymentTypeGroup: ['PAYMENTCARD'],
  qrCode:
    'CioKKBImCiQyZWJjODk0YS00ZWU2LTQxNmEtYTMwZS0yMjQ3MDViMGQ2MDESUwo/MD0CHQDyzFVaDthzDaPMC39jmThDzhl13uBjDvkMvS4/AhwmmwPKawgborYo++ZbOEBJcl3fZv0FGPDNg30JGgFOKgsIhpjvqAYQvLDqGzAB',
  state: 2,
  totalAmount: '301.00',
  totalTaxAmount: '32.25',
  travelRights: [
    {
      startDateTime: toTimeStamp(daysFromNow(-1)),
      status: 5,
      usageValidityPeriodRef: '',
      fareProductRef: 'ATB:PreassignedFareProduct:6dd9beab',
      tariffZoneRefs: [
        'ATB:TariffZone:1',
        'ATB:TariffZone:2',
        'ATB:TariffZone:3',
      ],
      userProfileRef: 'ATB:UserProfile:8ee842e3',
      endDateTime: toTimeStamp(daysFromNow(3)),
      authorityRef: 'ATB:Authority:2',
      fareZoneRefs: ['ATB:FareZone:10'],
      type: 'PreActivatedPeriodTicket',
      customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
      id: 'ATB:CustomerPurchasePackage:KXGV0JCE',
    },
    {
      startDateTime: toTimeStamp(daysFromNow(-1)),
      status: 5,
      usageValidityPeriodRef: '',
      fareProductRef: 'ATB:PreassignedFareProduct:6dd9beab',
      tariffZoneRefs: [
        'ATB:TariffZone:1',
        'ATB:TariffZone:2',
        'ATB:TariffZone:3',
      ],
      userProfileRef: 'ATB:UserProfile:8ee842e3',
      endDateTime: toTimeStamp(daysFromNow(3)),
      authorityRef: 'ATB:Authority:2',
      fareZoneRefs: ['ATB:FareZone:10'],
      type: 'PreActivatedPeriodTicket',
      customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
      id: 'ATB:CustomerPurchasePackage:83HMVOBI',
    },
  ],
  version: '1',
};

const NIGHT_TICKET = {
  created: toTimeStamp(NOW),
  customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  eventTimestamp: toTimeStamp(NOW),
  id: 'ATB:FareContract:D4PTXXT6-xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  minimumSecurityLevel: -200,
  orderId: 'D4PTXXT6',
  paymentType: ['VISA'],
  paymentTypeGroup: ['PAYMENTCARD'],
  qrCode:
    'ChYKFBISGhDFs7X2FTBAW54vTJ45efWDEkUKPjA8AhwCR3WR/H+wYImQvA3MJ9ftthwybUu0/MpTAPedAhweXMZ4lJgBqyyQMtQxtiW30lkHV7CyKHzidLeeGgFOMAE=',
  state: 2,
  totalAmount: '100.00',
  totalTaxAmount: '10.71',
  travelRights: [
    {
      authorityRef: 'ATB:Authority:2',
      customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
      endDateTime: toTimeStamp(daysFromNow(3)),
      fareProductRef: 'ATB:PreassignedFareProduct:8f351521',
      id: 'ATB:CustomerPurchasePackage:Y1EGBK3C',
      startDateTime: toTimeStamp(daysFromNow(-1)),
      status: 5,
      type: 'NightTicket',
      usageValidityPeriodRef: '',
      userProfileRef: 'ATB:UserProfile:8ee842e3',
    },
  ],
  version: '1',
};

const RESERVATION: Reservation = {
  created: toTimeStamp(NOW),
  customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  // discount: 0,
  orderId: 'DW2N19A6',
  paymentId: 870266,
  paymentStatus: 'CREATE',
  paymentType: 3,
  // shouldStartNow: true,
  transactionId: 858879,
  url: 'https://test.epayment.nets.eu/Terminal/default.aspx?merchantId=12003727&transactionId=0643eeff83a1467f85a577cac32c36ed',
};

const SINGLE_BOAT_TICKET = {
  created: toTimeStamp(NOW),
  customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  eventTimestamp: {nanoseconds: 886321000, seconds: 1696504403},
  id: 'ATB:FareContract:MMIBK6JK-xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  minimumSecurityLevel: -200,
  orderId: 'MMIBK6JK',
  paymentType: ['VISA'],
  paymentTypeGroup: ['PAYMENTCARD'],
  qrCode:
    'ChYKFBISGhAolS++f7ZPTpOZHS2RfiDrEkYKPzA9AhwBqKNWy5FQBIvrSbSldC7yA6OiaBuEphc8XE/wAh0AyMbe+N0/GxLYYAAlgU/3vSXUSnOBLo1g7pT11BoBTjAB',
  state: 2,
  totalAmount: '590.00',
  totalTaxAmount: '63.21',
  travelRights: [
    {
      authorityRef: 'ATB:Authority:2',
      customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
      direction: '2',
      endDateTime: toTimeStamp(daysFromNow(3)),
      endPointRef: 'NSR:StopPlace:40114',
      fareProductRef: 'ATB:PreassignedFareProduct:c4467e3a',
      id: 'ATB:CustomerPurchasePackage:83HMVOBI',
      startDateTime: toTimeStamp(daysFromNow(-1)),
      startPointRef: 'NSR:StopPlace:74007',
      status: 5,
      type: 'SingleBoatTicket',
      usageValidityPeriodRef: '',
      userProfileRef: 'ATB:UserProfile:8ee842e3',
    },
  ],
  version: '1',
};

const CARNET_TICKET = {
  created: toTimeStamp(NOW),
  customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  eventTimestamp: {nanoseconds: 19473000, seconds: 1666258970},
  id: 'ATB:FareContract:CY24AW67-xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
  minimumSecurityLevel: -200,
  orderId: 'CY24AW67',
  paymentType: ['VISA'],
  paymentTypeGroup: ['PAYMENTCARD'],
  state: 1,
  totalAmount: '420.00',
  totalTaxAmount: '45.00',
  travelRights: [
    {
      authorityRef: 'ATB:Authority:2',
      customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
      endDateTime: toTimeStamp(daysFromNow(3)),
      fareProductRef: 'ATB:AmountOfPriceUnitProduct:KlippekortBuss',
      id: 'ATB:CustomerPurchasePackage:4cb81f08-4499-44c4-8e23-507256f782a6-1',
      maximumNumberOfAccesses: 30,
      numberOfUsedAccesses: 1,
      startDateTime: toTimeStamp(daysFromNow(-1)),
      status: 4,
      type: 'CarnetTicket',
      usageValidityPeriodRef: '',
      usedAccesses: [
        {
          startDateTime: toTimeStamp(daysFromNow(-1)),
          endDateTime: toTimeStamp(daysFromNow(1)),
        },
      ],
      userProfileRef: 'ATB:UserProfile:8ee842e3',
    },
  ],
  version: '1',
};
