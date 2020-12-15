import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import Header from '../../../../ScreenHeader';
import {Edit} from '../../../../assets/svg/icons/actions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, useTheme} from '../../../../theme';
import ThemeText from '../../../../components/text';
import ThemeIcon from '../../../../components/theme-icon';
import Button from '../../../../components/button';
import useUserCountState from './use-user-count-state';
import {DismissableStackNavigationProp} from '../../../../navigation/createDismissableStackNavigator';
import useOfferState, {OfferError} from './use-offer-state';
import {addMinutes} from 'date-fns';
import MessageBox from '../../../../message-box';
import {CreditCard, Vipps} from '../../../../assets/svg/icons/ticketing';
import * as Sections from '../../../../components/sections';
import {ScrollView} from 'react-native-gesture-handler';

export type TravellersProps = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'Travellers'
  >;
  route: RouteProp<TicketingStackParams, 'Travellers'>;
};

const Travellers: React.FC<TravellersProps> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const {userProfilesWithCount, addCount, removeCount} = useUserCountState();

  const {
    offerSearchTime,
    isSearchingOffer,
    error,
    totalPrice,
    refreshOffer,
    offers,
  } = useOfferState(params.preassignedFareProduct, userProfilesWithCount);

  const offerExpirationTime =
    offerSearchTime && addMinutes(offerSearchTime, 30).getTime();

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
  }, [params?.refreshOffer]);

  const closeModal = () => navigation.dismiss();

  async function payWithVipps() {
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentVipps', {
          offers,
          preassignedFareProduct: params.preassignedFareProduct,
        });
      }
    }
  }

  async function payWithCard() {
    if (offerExpirationTime && totalPrice > 0) {
      if (offerExpirationTime < Date.now()) {
        refreshOffer();
      } else {
        navigation.push('PaymentCreditCard', {
          offers,
          preassignedFareProduct: params.preassignedFareProduct,
        });
      }
    }
  }

  const {top: safeAreaTop, bottom: safeAreBottom} = useSafeAreaInsets();

  return (
    <View style={[styles.container, {paddingTop: safeAreaTop}]}>
      <Header
        title={params.preassignedFareProduct.name.value}
        leftButton={{
          icon: <ThemeText>Avbryt</ThemeText>,
          onPress: closeModal,
          accessibilityLabel: 'Avbryt kjøpsprosessen',
        }}
        style={styles.header}
      />

      <ScrollView>
        {error && (
          <MessageBox
            type="warning"
            title="Det oppstod en feil"
            message={translateError(error)}
          />
        )}

        <Sections.Section withPadding>
          <Sections.LinkItem
            text="Reise gjennom 1 sone (Sone A)"
            onPress={() => {}}
            icon={<ThemeIcon svg={Edit} />}
          />
        </Sections.Section>

        <Sections.Section withPadding>
          {userProfilesWithCount.map((u) => (
            <Sections.CounterInput
              key={u.userTypeString}
              text={u.name.value}
              count={u.count}
              addCount={() => addCount(u.userTypeString)}
              removeCount={() => removeCount(u.userTypeString)}
            />
          ))}
        </Sections.Section>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(safeAreBottom, theme.spacings.medium),
          },
        ]}
      >
        <View style={styles.totalContainer}>
          <View style={styles.totalContainerHeadings}>
            <ThemeText type="body">Totalt</ThemeText>
            <ThemeText type="label" color={'faded'}>
              Inkl. 6% mva
            </ThemeText>
          </View>

          {!isSearchingOffer ? (
            <ThemeText type="heroTitle">{totalPrice} kr</ThemeText>
          ) : (
            <ActivityIndicator
              size={theme.spacings.medium}
              color={theme.text.colors.primary}
              style={{margin: 12}}
            />
          )}
        </View>
        <View style={styles.buttons}>
          <Button
            mode="primary2"
            text="Betal med Vipps"
            disabled={isSearchingOffer}
            accessibilityLabel="Trykk for å betale billett med Vipps"
            icon={Vipps}
            iconPosition="left"
            onPress={payWithVipps}
            viewContainerStyle={[
              styles.paymentButton,
              styles.vippsPaymentButton,
            ]}
            style={{flex: 1}}
            textContainerStyle={{marginLeft: 30}}
          />
          <Button
            mode="primary2"
            text="Betal med bankkort"
            disabled={isSearchingOffer}
            accessibilityLabel="Trykk for å betale billett med bankkort"
            icon={CreditCard}
            iconPosition="left"
            onPress={payWithCard}
            viewContainerStyle={[
              styles.paymentButton,
              styles.cardPaymentButton,
            ]}
            textContainerStyle={{marginLeft: 30}}
          />
        </View>
      </View>
    </View>
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
  header: {
    paddingHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacings.medium,
    backgroundColor: theme.background.level0,
    borderRadius: theme.border.radius.regular,
  },
  totalContainerHeadings: {
    flexDirection: 'column',
    paddingVertical: theme.spacings.xSmall,
  },
  footer: {
    padding: theme.spacings.medium,
    backgroundColor: theme.background.header,
  },
  buttons: {
    flexDirection: 'row',
  },
  paymentButton: {
    marginTop: theme.spacings.medium,
    flex: 1,
  },
  vippsPaymentButton: {
    marginRight: 6,
  },
  cardPaymentButton: {
    marginLeft: 6,
  },
}));

export default Travellers;
