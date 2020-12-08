import React, {useState} from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../navigation';
import Header from '../../../ScreenHeader';
import {StyleSheet} from '../../../theme';
import ThemeIcon from '../../../components/theme-icon';
import {Close} from '../../../assets/svg/icons/actions';
import ThemeText from '../../../components/text';
import {SafeAreaView} from 'react-native-safe-area-context';
import DetailedTicket from '../Ticket/DetailedTicket';
import useInterval from '../../../utils/use-interval';
import {useTicketState} from '../../../TicketContext';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

export type TicketDetailsRouteParams = {
  orderId: string;
};

export type TicketDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'TicketDetails'
>;

export type TicketDetailsScreenNavigationProp = NavigationProp<
  RootStackParamList
>;

type Props = {
  route: TicketDetailsScreenRouteProp;
  navigation: TicketDetailsScreenNavigationProp;
};

export default function TicketDetails({navigation, route}: Props) {
  const styles = useStyles();
  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);
  const {fareContracts} = useTicketState();
  const fc = fareContracts?.find(
    (fc) => fc.order_id === route?.params?.orderId,
  );

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
        {fc && <DetailedTicket fareContract={fc} now={now} />}
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
