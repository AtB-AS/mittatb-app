import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {addMinutes} from 'date-fns';
import {TicketingStackParams} from '../';
import Header from '../../../../ScreenHeader';
import {Close} from '../../../../assets/svg/icons/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import MessageBox from '../../../../message-box';
import {StyleSheet, useTheme} from '../../../../theme';
import ThemeText from '../../../../components/text';
import ThemeIcon from '../../../../components/theme-icon';
import Button from '../../../../components/button';
import {CreditCard, Vipps} from '../../../../assets/svg/icons/ticketing';
import useOfferState, {OfferError} from './use-offer-state';
import {DismissableStackNavigationProp} from '../../../../navigation/createDismissableStackNavigator';
import {ArrowLeft} from '../../../../assets/svg/icons/navigation';

type Props = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'PaymentOptions'
  >;
  route: RouteProp<TicketingStackParams, 'PaymentOptions'>;
};

const PaymentOptions: React.FC<Props> = ({navigation, route: {params}}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const travellers = params.travellers;

  const {
    offerId,
    offerSearchTime,
    isSearchingOffer,
    error,
    totalPrice,
    refreshOffer,
  } = useOfferState(travellers);

  const offerExpirationTime =
    offerSearchTime && addMinutes(offerSearchTime, 30).getTime();

  useEffect(() => {}, []);

  const closeModal = () => navigation.dismiss();
  const goBack = () => navigation.pop();
  const count = travellers.find((t) => t.type === 'ADULT')!.count;

  async function payWithVipps() {
    if (offerId && offerExpirationTime && count) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentVipps', {
          offers: [{offer_id: offerId, count}],
          travellers,
        });
      }
    }
  }

  async function payWithCard() {
    if (offerId && offerExpirationTime && count) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentCreditCard', {
          offers: [{offer_id: offerId, count}],
          travellers,
        });
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Betaling"
        leftButton={{
          icon: <ThemeIcon svg={Close} />,
          onPress: closeModal,
          accessibilityLabel: 'Avbryt kjøpsprosessen',
        }}
      />

      {error && (
        <MessageBox
          type="warning"
          title="Det oppstod en feil"
          message={translateError(error)}
        />
      )}

      <View style={styles.totalContainer}>
        <View style={{flexDirection: 'column'}}>
          <ThemeText type="body">Total</ThemeText>
          <ThemeText type="body">Inkl. 6% mva</ThemeText>
        </View>

        {!isSearchingOffer ? (
          <ThemeText type="heroTitle">{totalPrice} kr</ThemeText>
        ) : (
          <ActivityIndicator
            color={theme.text.colors.primary}
            style={{margin: 12}}
          />
        )}
      </View>

      <View style={styles.buttons}>
        <ThemeText type="body__link" style={styles.informationLink}>
          Informasjon og vilkår
        </ThemeText>
        <Button
          mode="primary"
          text="Betal med Vipps"
          disabled={isSearchingOffer}
          accessibilityLabel="Trykk for å betale billett med Vipps"
          icon={Vipps}
          iconPosition="right"
          onPress={payWithVipps}
          style={styles.button}
        />
        <Button
          mode="primary"
          text="Betal med bankkort"
          disabled={isSearchingOffer}
          accessibilityLabel="Trykk for å betale billett med bankkort"
          icon={CreditCard}
          iconPosition="right"
          onPress={payWithCard}
          style={styles.button}
        />
        <Button
          mode="secondary"
          text="Endre reise"
          accessibilityLabel="Endre reise"
          icon={ArrowLeft}
          onPress={goBack}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

function translateError(error: OfferError) {
  const {context} = error;
  switch (context) {
    case 'failed_offer_search':
      return 'Klarte ikke å søke opp pris';
    case 'failed_reservation':
      return 'Klarte ikke å reservere billett';
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacings.medium,
    backgroundColor: theme.background.level2,
  },
  ticketsContainer: {
    backgroundColor: theme.background.level0,
    borderTopEndRadius: theme.border.radius.regular,
    borderTopLeftRadius: theme.border.radius.regular,
    borderBottomWidth: 1,
    borderBottomColor: theme.background.level1,
    padding: theme.spacings.medium,
    marginTop: theme.spacings.small,
  },
  travellerContainer: {
    backgroundColor: theme.background.level0,
    borderBottomEndRadius: theme.border.radius.regular,
    borderBottomLeftRadius: theme.border.radius.regular,
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.small,
    flexDirection: 'row',
    alignItems: 'center',
  },
  travellerCount: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  travellerCountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacings.medium,
  },
  informationLink: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.small,
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    margin: theme.spacings.medium,
  },
  button: {
    marginBottom: theme.spacings.small,
  },
}));

export default PaymentOptions;
