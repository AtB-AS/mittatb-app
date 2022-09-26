import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet} from '@atb/theme';
import {useTicketState} from '@atb/tickets';
import {useTranslation, TicketTexts} from '@atb/translations';
import useInterval from '@atb/utils/use-interval';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CarnetDetailedView from '../Carnet/CarnetDetailedView';
import {TicketModalScreenProps} from './types';

export type CarnetDetailsRouteParams = {
  orderId: string;
  isInspectable: boolean;
};

type Props = TicketModalScreenProps<'CarnetDetailsScreen'>;

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
