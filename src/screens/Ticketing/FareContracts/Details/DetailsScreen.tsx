import {MessageBox} from '@atb/components/message-box';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {isPreActivatedTravelRight, useTicketingState} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import useInterval from '@atb/utils/use-interval';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {getValidityStatus} from '../utils';
import DetailsContent from './DetailsContent';
import {FareContractModalScreenProps} from './types';
import {getValidOnTrainNoticeText} from '../../utils';

export type FareContractDetailsRouteParams = {
  orderId: string;
};

type Props = FareContractModalScreenProps<'FareContractDetails'>;

function isOfFareProductRef(a: any): a is {fareProductRef: string} {
  return 'fareProductRef' in a;
}

export default function DetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);
  const {findFareContractByOrderId, customerProfile} = useTicketingState();
  const fc = findFareContractByOrderId(route?.params?.orderId);
  const firstTravelRight = fc?.travelRights[0];
  const {t} = useTranslation();

  const {preassignedFareProducts} = useFirestoreConfiguration();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    isOfFareProductRef(firstTravelRight) ? firstTravelRight.fareProductRef : '',
  );

  const hasActiveTravelCard = !!customerProfile?.travelcard;

  const onReceiptNavigate = () =>
    fc &&
    navigation.push('PurchaseReceipt', {
      orderId: fc.orderId,
      orderVersion: fc.version,
    });

  const shouldShowValidOnTrainNotice =
    fc &&
    isPreActivatedTravelRight(firstTravelRight) &&
    getValidityStatus(
      now,
      firstTravelRight.startDateTime.toMillis(),
      firstTravelRight.endDateTime.toMillis(),
      fc.state,
    ) === 'valid' &&
    firstTravelRight.tariffZoneRefs.every(
      (val: string) => val === 'ATB:TariffZone:1',
    ) &&
    preassignedFareProduct?.type !== 'night';

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'close'}}
        title={t(FareContractTexts.details.header.title)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {fc && (
          <DetailsContent
            fareContract={fc}
            preassignedFareProduct={preassignedFareProduct}
            now={now}
            onReceiptNavigate={onReceiptNavigate}
            hasActiveTravelCard={hasActiveTravelCard}
          />
        )}

        {shouldShowValidOnTrainNotice && (
          <MessageBox
            message={getValidOnTrainNoticeText(t, preassignedFareProduct?.type)}
            type="info"
          />
        )}
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
  content: {
    padding: theme.spacings.medium,
    paddingBottom: theme.spacings.xLarge,
  },
}));
