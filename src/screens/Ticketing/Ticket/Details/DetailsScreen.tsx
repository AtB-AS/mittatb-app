import React, {useState} from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import Header from '../../../../ScreenHeader';
import {StyleSheet} from '../../../../theme';
import ThemeIcon from '../../../../components/theme-icon';
import {Close} from '../../../../assets/svg/icons/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import useInterval from '../../../../utils/use-interval';
import {useTicketState} from '../../../../TicketContext';
import {View} from 'react-native';
import DetailsContent from './DetailsContent';
import {TicketModalNavigationProp, TicketModalStackParams} from '.';

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
  const {fareContracts} = useTicketState();
  const fc = fareContracts?.find(
    (fc) => fc.order_id === route?.params?.orderId,
  );

  const onReceiptNavigate = () =>
    fc &&
    navigation.push('TicketReceipt', {
      orderId: fc.order_id,
      orderVersion: fc.order_version,
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftButton={{
          onPress: () => navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: 'Gå tilbake',
          icon: <ThemeIcon svg={Close} />,
        }}
        title="Billettdetaljer"
        style={styles.header}
      />
      <View style={styles.content}>
        {fc && (
          <DetailsContent
            fareContract={fc}
            now={now}
            onReceiptNavigate={onReceiptNavigate}
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
