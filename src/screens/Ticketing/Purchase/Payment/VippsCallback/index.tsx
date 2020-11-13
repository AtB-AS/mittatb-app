import {RouteProp} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TicketingStackParams} from '../..';
import {Close} from '../../../../../assets/svg/icons/actions';
import ThemeText from '../../../../../components/text';
import ThemeIcon from '../../../../../components/theme-icon';
import {DismissableStackNavigationProp} from '../../../../../navigation/createDismissableStackNavigator';
import Header from '../../../../../ScreenHeader';
import {StyleSheet} from '../../../../../theme';
import {useTicketState} from '../../../../../TicketContext';

enum VippsPaymentStatus {
  Succeeded = '100',
  UserCancelled = '202',
}
type Props = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'VippsCallback'
  >;
  route: RouteProp<TicketingStackParams, 'VippsCallback'>;
};

export default function VippsCallback({
  navigation,
  route: {
    params: {status, transaction_id, payment_id},
  },
}: Props) {
  const styles = useStyles();
  const {activatePollingForNewTickets} = useTicketState();
  const closeModal = () => navigation.dismiss();

  useEffect(() => {
    if (status === VippsPaymentStatus.Succeeded) {
      activatePollingForNewTickets();
      closeModal();
    }
  }, [status]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Verifiserer betaling"
        leftButton={{
          icon: <ThemeIcon svg={Close} />,
          onPress: closeModal,
          accessibilityLabel: 'Lukk skjermbilde for verifisering av betaling',
        }}
      />
      <View style={styles.content}>
        <ThemeText>
          {status === VippsPaymentStatus.UserCancelled &&
            'Betaling ble avbrutt i vipps-appen..'}
          {status === VippsPaymentStatus.Succeeded &&
            'Videresender til billettoversikt..'}
        </ThemeText>
      </View>
    </SafeAreaView>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacings.medium,
    backgroundColor: theme.background.level2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
