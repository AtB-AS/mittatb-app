import {StyleSheet} from '@atb/theme';
import {useTicketState} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import useInterval from '@atb/utils/use-interval';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {TicketModalNavigationProp, TicketModalStackParams} from '../Details';
import FullScreenHeader from '@atb/components/screen-header/full-header';

import CarnetDetailedView from '@atb/screens/Ticketing/Ticket/Carnet/CarnetDetailedView';

export type CarnetDetailsRouteParams = {
  orderId: string;
  isInspectable: boolean;
};

export type CarnetDetailsScreenRouteProp = RouteProp<
  TicketModalStackParams,
  'CarnetDetailsScreen'
>;

type Props = {
  route: CarnetDetailsScreenRouteProp;
  navigation: TicketModalNavigationProp;
};

export default function CarnetDetailsScreen({navigation, route}: Props) {
  const styles = useStyles();
  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);
  const {findFareContractByOrderId} = useTicketState();
  const fc = findFareContractByOrderId(route?.params?.orderId);
  const {t} = useTranslation();

  const onReceiptNavigate = () =>
    fc &&
    navigation.push('TicketReceipt', {
      orderId: fc.orderId,
      orderVersion: fc.version,
    });

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'close'}}
        title={t(TicketTexts.details.header.title)}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {fc && (
          <CarnetDetailedView
            fareContract={fc}
            now={now}
            onReceiptNavigate={onReceiptNavigate}
            isInspectable={route?.params?.isInspectable}
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
