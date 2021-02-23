import Header from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {useTicketState} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import useInterval from '@atb/utils/use-interval';
import {RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TicketModalNavigationProp, TicketModalStackParams} from '.';
import DetailsContent from './DetailsContent';

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

export default function DetailsScreen({navigation, route}: Props) {
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
    <SafeAreaView style={styles.container}>
      <Header
        leftButton={{type: 'close'}}
        title={t(TicketTexts.details.header.title)}
        style={styles.header}
      />
      <ScrollView style={styles.content}>
        {fc && (
          <DetailsContent
            fareContract={fc}
            now={now}
            onReceiptNavigate={onReceiptNavigate}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.background.level2,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
  content: {
    padding: theme.spacings.medium,
  },
}));
