import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {StyleSheet} from '@atb/theme';
import {PaymentCreditCardTexts, useTranslation,} from '@atb/translations';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import {TicketingStackParams} from '../..';
import {TicketTabsNavigatorParams} from '../../../Tickets';
import useTerminalState from './use-terminal-state';
import FullScreenHeader from '@atb/components/screen-header/full-header';

type NavigationProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<TicketTabsNavigatorParams>,
  DismissableStackNavigationProp<TicketingStackParams, 'PaymentCreditCard'>
>;

type Props = {
  navigation: NavigationProp;
  route: RouteProp<TicketingStackParams, 'PaymentCreditCard'>;
};

const CreditCard: React.FC<Props> = ({route, navigation}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {offers} = route.params;
  const [showWebView, setShowWebView] = useState<boolean>(true);

  React.useEffect(
    () => navigation.addListener('blur', () => setShowWebView(false)),
    [navigation],
  );

  const navigateBackFromTerminal = () => {
    navigation.pop();
  };

  const {paymentMethod} = route.params;
  const {paymentType} = paymentMethod;

  const recurringPaymentId =
    'recurringPaymentId' in paymentMethod
      ? paymentMethod.recurringPaymentId
      : undefined;

  const saveRecurringCard =
    'save' in paymentMethod ? paymentMethod.save : false;

  const terminalUrl = useTerminalState(
    offers,
    paymentType,
    recurringPaymentId,
    saveRecurringCard,
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(PaymentCreditCardTexts.header.title)}
        leftButton={{
          type: 'cancel',
          onPress: async () => {
            navigateBackFromTerminal();
          },
        }}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        {terminalUrl && showWebView && <WebView source={{uri: terminalUrl}} />}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  messageBox: {marginBottom: theme.spacings.small},
  button: {marginBottom: theme.spacings.small},
}));

export default CreditCard;
