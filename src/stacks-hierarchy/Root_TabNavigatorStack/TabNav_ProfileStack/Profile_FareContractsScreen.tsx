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

export const Profile_FareContractsScreen = () => {
  const styles = useStyles();

  const {preassignedFareProducts} = useFirestoreConfiguration();
  const getPreassignedFareProduct = (fcRef: string) =>
    findReferenceDataById(preassignedFareProducts, fcRef);

  const daysFromNow = (d: number) => addDays(new Date(), d);
  const toTimeStamp = (date: Date) =>
    new FirestoreTimestampMock(Math.floor(date.valueOf() / 1000), 0);
  const NOW = new Date();

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

  const BASE = {
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
    version: '1',
    travelRights: [
      {
        authorityRef: 'ATB:Authority:2',
        customerAccountId: 'ATB:CustomerAccount:xPWkGQzzmaRCdQ1JmERtk8eQtQA2',
        endDateTime: toTimeStamp(daysFromNow(11)),
        startDateTime: toTimeStamp(daysFromNow(-1)),
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
        type: 'PeriodBoatTicket',
        fareProductRef: 'ATB:PreassignedFareProduct:5f61ee14',
        id: 'ATB:CustomerPurchasePackage:MMLMWZUV',
        direction: TravelRightDirection.Both,
        startPointRef: 'NSR:StopPlace:74006',
        endPointRef: 'NSR:StopPlace:74009',
      },
    ],
  };

  const NIGHT_TICKET = {
    ...BASE,
    travelRights: [
      {
        ...BASE.travelRights[0],
        type: 'NightTicket',
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
        type: 'PreActivatedPeriodTicket',
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
        type: 'SingleBoatTicket',
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
        type: 'CarnetTicket',
        fareProductRef: 'ATB:AmountOfPriceUnitProduct:KlippekortBuss',
        id: 'ATB:CustomerPurchasePackage:4cb81f08-4499-44c4-8e23-507256f782a6-1',
        maximumNumberOfAccesses: 10,
        numberOfUsedAccesses: 8,
        status: 5,
        usedAccesses: [
          {
            startDateTime: toTimeStamp(daysFromNow(-1)),
            endDateTime: toTimeStamp(daysFromNow(1)),
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
        type: 'CarnetTicket',
        fareProductRef: 'ATB:AmountOfPriceUnitProduct:KlippekortBuss',
        id: 'ATB:CustomerPurchasePackage:4cb81f08-4499-44c4-8e23-507256f782a6-1',
        maximumNumberOfAccesses: 50,
        numberOfUsedAccesses: 3,
        status: 1,
        usedAccesses: [
          {
            startDateTime: toTimeStamp(daysFromNow(-2)),
            endDateTime: toTimeStamp(daysFromNow(-1)),
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
  ] as FareContract[];

  return (
    <View style={styles.container}>
      <FullScreenHeader title="Fare Contracts" leftButton={{type: 'back'}} />
      <ScrollView style={styles.content}>
        <ThemeText type="heading--jumbo">Reservation</ThemeText>
        <FareContractOrReservation
          index={0}
          onPressFareContract={() => {}}
          fcOrReservation={RESERVATION}
          now={Date.now()}
        />
        <ThemeText type="heading--jumbo">Fare Contracts</ThemeText>
        {fareContracts.map((fc, i) => (
          <SimpleFareContract
            key={i}
            fareContract={fc}
            now={Date.now()}
            onPressDetails={() => {}}
          />
        ))}
        <ThemeText type="heading--jumbo">Fare contract details</ThemeText>
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

/*
Mocks the Firestore Timestamp class, since importing it from the SDK is not
possible. Not a complete implementation, only what is needed for the tests.

Copied from here, with some modifications:
https://github.com/invertase/react-native-firebase/blob/305d38b/packages/firestore/lib/modular/Timestamp.d.ts

LICENSE:

  Copyright (c) 2016-present Invertase Limited <oss@invertase.io>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
class FirestoreTimestampMock {
  _seconds: number;
  _nanoseconds: number;
  static now = () => FirestoreTimestampMock.fromMillis(Date.now());
  static fromDate = (date: Date) =>
    FirestoreTimestampMock.fromMillis(date.getTime());
  static fromMillis(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const nanoseconds = (milliseconds - seconds * 1000) * 1e6;
    return new FirestoreTimestampMock(seconds, nanoseconds);
  }
  constructor(seconds: number, nanoseconds: number) {
    this._seconds = seconds;
    this._nanoseconds = nanoseconds;
  }
  get seconds() {
    return this._seconds;
  }
  get nanoseconds() {
    return this._nanoseconds;
  }
  isEqual = (other: FirestoreTimestampMock) =>
    other.seconds === this._seconds && other.nanoseconds === this._nanoseconds;
  toDate = () => new Date(this.toMillis());
  toMillis = () => this._seconds * 1000 + this._nanoseconds / 1e6;
  toString = () =>
    `FirestoreTimestamp(seconds=${this.seconds}, nanoseconds=${this.nanoseconds})`;
  toJSON = () => ({seconds: this.seconds, nanoseconds: this.nanoseconds});
  valueOf() {
    const MIN_SECONDS = -62135596800;
    const adjustedSeconds = this.seconds - MIN_SECONDS;
    const formattedSeconds = String(adjustedSeconds).padStart(12, '0');
    const formattedNanoseconds = String(this.nanoseconds).padStart(9, '0');
    return formattedSeconds + '.' + formattedNanoseconds;
  }
}
