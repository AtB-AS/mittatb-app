import React, {useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import Header from '../../../../ScreenHeader';
import {StyleSheet} from '../../../../theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import useInterval from '../../../../utils/use-interval';
import {useTicketState} from '../../../../TicketContext';
import {View} from 'react-native';
import DetailsContent from './DetailsContent';
import {TicketModalNavigationProp, TicketModalStackParams} from '.';
import {TicketTexts, useTranslation} from '../../../../translations';

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
      orderId: fc.order_id,
      orderVersion: fc.order_version,
    });

  const onInspectionNavigate = () =>
    fc &&
    navigation.push('TicketInspection', {
      orderId: fc.order_id,
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftButton={{type: 'close'}}
        title={t(TicketTexts.details.header.title)}
        style={styles.header}
      />
      <View style={styles.content}>
        {fc && (
          <DetailsContent
            fareContract={fc}
            now={now}
            onReceiptNavigate={onReceiptNavigate}
            onInspectionNavigate={onInspectionNavigate}
          />
        )}
      </View>
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
