import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import Header from '../../../../ScreenHeader';
import {Close} from '../../../../assets/svg/icons/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, useTheme} from '../../../../theme';
import ThemeText from '../../../../components/text';
import ThemeIcon from '../../../../components/theme-icon';
import Button from '../../../../components/button';
import useUserCountState, {
  FetchUserProfilesError,
} from './use-user-count-state';
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

  const {
    userProfilesWithCount,
    userProfilesLoading,
    userProfilesError,
    addCount,
    removeCount,
  } = useUserCountState();

  const {
    offerSearchTime,
    isSearchingOffer,
    error,
    totalPrice,
    refreshOffer,
    offers,
  } = useOfferState(params.fareContractType, userProfilesWithCount);

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
          fareContractType: params.fareContractType,
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
          fareContractType: params.fareContractType,
        });
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={params.fareContractType.name.value}
        leftButton={{
          icon: <ThemeIcon svg={Close} />,
          onPress: closeModal,
          accessibilityLabel: 'Avbryt kjøpsprosessen',
        }}
      />

      <ScrollView style={{overflow: 'hidden'}}>
        {error && (
          <MessageBox
            type="warning"
            title="Det oppstod en feil"
            message={translateError(error)}
          />
        )}
        {userProfilesError && (
          <MessageBox
            type="warning"
            title="Det oppstod en feil"
            message={translateUserProfilesError(userProfilesError)}
          />
        )}

        {userProfilesLoading ? (
          <View>
            <ThemeText>LOADING!!</ThemeText>
            <ActivityIndicator />
          </View>
        ) : (
          <Sections.Section withTopPadding>
            <Sections.HeaderItem
              text="Enkeltbillett, Sone A - Stor-Trondheim"
              mode="subheading"
            />
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
      </ScrollView>

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
          text="Avbryt"
          accessibilityLabel="Trykk for å avbryte billettkjøp"
          icon={Close}
          onPress={closeModal}
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

function translateUserProfilesError(_: FetchUserProfilesError) {
  return 'Klarte ikke å hente reiseprofiler';
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

export default Travellers;
