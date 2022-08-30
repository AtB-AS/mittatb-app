import {StyleSheet} from '@atb/theme';
import {isPreactivatedTicket, useTicketState} from '@atb/tickets';
import {
  PurchaseOverviewTexts,
  TicketTexts,
  useTranslation,
} from '@atb/translations';
import useInterval from '@atb/utils/use-interval';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {TicketModalNavigationProp, TicketModalStackParams} from '.';
import DetailsContent from './DetailsContent';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import MessageBox from '@atb/components/message-box';
import {getValidityStatus} from '../utils';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {findReferenceDataById} from '@atb/reference-data/utils';

export type TicketDetailsRouteParams = {
  orderId: string;
};

export type TicketDetailsScreenRouteProp = RouteProp<
  TicketModalStackParams,
  'TicketDetails'
>;

type Props = {
  route: TicketDetailsScreenRouteProp;
  navigation: TicketModalNavigationProp;
};

function isOfFareProductRef(a: any): a is {fareProductRef: string} {
  return 'fareProductRef' in a;
}

export default function DetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);
  const {findFareContractByOrderId, customerProfile} = useTicketState();
  const fc = findFareContractByOrderId(route?.params?.orderId);
  const firstTravelRight = fc?.travelRights[0];
  const {t} = useTranslation();

  const {preassignedFareproducts} = useFirestoreConfiguration();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareproducts,
    isOfFareProductRef(firstTravelRight) ? firstTravelRight.fareProductRef : '',
  );

  const hasActiveTravelCard = !!customerProfile?.travelcard;

  const onReceiptNavigate = () =>
    fc &&
    navigation.push('TicketReceipt', {
      orderId: fc.orderId,
      orderVersion: fc.version,
    });

  const shouldShowValidTrainTicketNotice =
    fc &&
    isPreactivatedTicket(firstTravelRight) &&
    getValidityStatus(
      now,
      firstTravelRight.startDateTime.toMillis(),
      firstTravelRight.endDateTime.toMillis(),
      fc.state,
    ) === 'valid' &&
    firstTravelRight.tariffZoneRefs.every(
      (val: string) => val === 'ATB:TariffZone:1',
    );
  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'close'}}
        title={t(TicketTexts.details.header.title)}
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

        {shouldShowValidTrainTicketNotice && (
          <MessageBox
            message={
              preassignedFareProduct?.type === 'single'
                ? t(PurchaseOverviewTexts.samarbeidsbillettenInfo.single)
                : preassignedFareProduct?.type === 'hour24'
                ? t(PurchaseOverviewTexts.samarbeidsbillettenInfo.hour24)
                : t(PurchaseOverviewTexts.samarbeidsbillettenInfo.period)
            }
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
