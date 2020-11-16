import React, {useEffect} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {addMinutes} from 'date-fns';
import {TicketingStackParams} from '../';
import Header from '../../../../ScreenHeader';
import {Add, Close, Remove} from '../../../../assets/svg/icons/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import MessageBox from '../../../../message-box';
import {StyleSheet, useTheme} from '../../../../theme';
import ThemeText from '../../../../components/text';
import ThemeIcon from '../../../../components/theme-icon';
import Button from '../../../../components/button';
import {CreditCard, Vipps} from '../../../../assets/svg/icons/ticketing';
import useOfferState, {OfferError} from './use-offer-state';
import insets from '../../../../utils/insets';
import {DismissableStackNavigationProp} from '../../../../navigation/createDismissableStackNavigator';

type Props = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'Travellers'
  >;
  route: RouteProp<TicketingStackParams, 'Travellers'>;
};

const Travellers: React.FC<Props> = ({navigation, route: {params}}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const {
    offerId,
    offerSearchTime,
    count,
    isSearchingOffer,
    error,
    totalPrice,
    addCount,
    removeCount,
    refreshOffer,
  } = useOfferState();

  const offerExpirationTime =
    offerSearchTime && addMinutes(offerSearchTime, 30).getTime();

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
  }, [params?.refreshOffer]);

  const closeModal = () => navigation.dismiss();

  async function payWithVipps() {
    if (offerId && offerExpirationTime && count) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentVipps', {offer_id: offerId, count});
      }
    }
  }

  async function payWithCard() {
    if (offerId && offerExpirationTime && count) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentCreditCard', {offer_id: offerId, count});
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Reisende"
        leftButton={{
          icon: <ThemeIcon svg={Close} />,
          onPress: closeModal,
          accessibilityLabel: 'Lukk kjøpsprosessen',
        }}
      />

      {error ? (
        <MessageBox
          type="warning"
          title="Det oppstod en feil"
          message={translateError(error)}
        />
      ) : (
        <MessageBox type="info" title="Beta-begrensning">
          <ThemeText type="label">
            Det er foreløpig kun mulig å kjøpe enkeltbillett voksen for buss og
            trikk. Bruk{' '}
            <Text style={{textDecorationLine: 'underline'}}>AtB Mobillett</Text>{' '}
            for å kjøpe andre billetter.
          </ThemeText>
        </MessageBox>
      )}
      <View style={styles.ticketsContainer}>
        <ThemeText type="lead">
          Enkeltbillett, Sone A - Stor-Trondheim
        </ThemeText>
      </View>
      <View style={styles.travellerContainer}>
        <View style={styles.travellerCount}>
          <ThemeText type="paragraphHeadline">{count} voksen</ThemeText>
        </View>
        <View style={styles.travellerCountActions}>
          <ThemeText type="lead">40,-</ThemeText>
          <TouchableOpacity onPress={removeCount} hitSlop={insets.all(8)}>
            <ThemeIcon svg={Remove} />
          </TouchableOpacity>
          <TouchableOpacity onPress={addCount} hitSlop={insets.all(8)}>
            <ThemeIcon svg={Add} />
          </TouchableOpacity>
        </View>
      </View>
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
          rightIcon={() => <ThemeIcon svg={Vipps} />}
          onPress={payWithVipps}
        />
        <Button
          mode="primary"
          text="Betal med bankkort"
          disabled={isSearchingOffer}
          accessibilityLabel="Trykk for å betale billett med bankkort"
          rightIcon={() => <ThemeIcon svg={CreditCard} />}
          onPress={payWithCard}
        />
        <Button
          mode="secondary"
          text="Avbryt"
          accessibilityLabel="Trykk for å avbryte billettkjøp"
          leftIcon={() => <ThemeIcon svg={Close} />}
          onPress={closeModal}
        />
      </View>
    </SafeAreaView>
  );
};

function translateError(error: OfferError) {
  const {context, type} = error;
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
    alignItems: 'center',
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
}));

export default Travellers;
