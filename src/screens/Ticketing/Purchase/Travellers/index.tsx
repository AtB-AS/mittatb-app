import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '../';
import {UserType, Offer, OfferPrice} from '../../../../api/fareContracts';
import OfferGroup from './Group';
import Header from '../../../../ScreenHeader';
import {Add, Close, Remove} from '../../../../assets/svg/icons/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import MessageBox from '../../../../message-box';
import {StyleSheet} from '../../../../theme';
import ThemeText from '../../../../components/text';
import ThemeIcon from '../../../../components/theme-icon';
import Button from '../../../../components/button';
import {CreditCard, Vipps} from '../../../../assets/svg/icons/ticketing';
import {searchOffers} from '../../../../api';
import {SINGLE_TICKET_PRODUCT_ID} from '@env';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Travellers'>;
};

type Group = {
  name: string;
  user_type: UserType;
};

const groups: {[key: string]: Group} = {
  ['adult_group']: {name: 'voksen', user_type: 'ADULT'},
};
const groupArr = Object.entries(groups).map(([id, {user_type}]) => ({
  id: 'adult_group',
  user_type: {
    id: 'adult_group',
    user_type: 'ADULT',
  },
}));

type OfferGroup = {
  offer_id: string;
  name: string;
  price: number;
  count: number;
};

type OfferState = {
  [group_id: string]: OfferGroup;
};

type OfferReducerAction =
  | {
      type: 'SET_OFFERS';
      offers: Offer[];
    }
  | {type: 'INCREMENT'; group_id: string}
  | {type: 'DECREMENT'; group_id: string};

type OfferReducer = (
  prevState: OfferState,
  action: OfferReducerAction,
) => OfferState;

const getCurrencyAsFloat = (prices: OfferPrice[], currency: string) =>
  prices.find((p) => p.currency === 'NOK')?.amount_float ?? 0;

const offerReducer: OfferReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_OFFERS':
      return action.offers
        .map<[string, OfferGroup]>((o) => [
          o.traveller_id,
          {
            offer_id: o.offer_id,
            price: getCurrencyAsFloat(o.prices, 'NOK'),
            name: groups[o.traveller_id]?.name ?? 'unknown',
            count: 1,
          },
        ])
        .reduce((acc, [group_id, group]) => {
          acc[group_id] = group;
          return acc;
        }, {} as OfferState);
    case 'INCREMENT': {
      const prevGroup = prevState[action.group_id];
      if (!prevGroup) return prevState;

      return {
        ...prevState,
        [action.group_id]: {
          ...prevGroup,
          count: prevGroup.count + 1,
        },
      };
    }
    case 'DECREMENT': {
      const prevGroup = prevState[action.group_id];
      if (!prevGroup || prevGroup.count === 0) return prevState;

      return {
        ...prevState,
        [action.group_id]: {
          ...prevGroup,
          count: prevGroup.count - 1,
        },
      };
    }
  }
};

const Travellers: React.FC<Props> = ({navigation}) => {
  const styles = useStyles();
  const closeModal = () => navigation.goBack();

  const [count, setCount] = useState<number>(1);
  const canRemove = count > 1;
  const add = () => setCount(count + 1);
  const remove = () => canRemove && setCount(count - 1);

  const [offers, setOffers] = useState<Offer[] | null>(null);

  const total = offers?.length
    ? getCurrencyAsFloat(offers?.[0].prices, 'NOK') * count
    : 0;

  const hasOffer = !!total;

  useEffect(() => {
    async function getOffers() {
      try {
        const response = await searchOffers(
          ['ATB:TariffZone:1'],
          [
            {
              id: 'adult_group',
              user_type: 'ADULT',
            },
          ],
          [SINGLE_TICKET_PRODUCT_ID],
        );

        setOffers(response);
      } catch (err) {
        console.warn(err);
        setOffers(null);
      }
    }
    getOffers();
  }, [count]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Reisende"
        leftButton={{
          icon: <Close />,
          onPress: closeModal,
          accessibilityLabel: 'Lukk kjøpsprosessen',
        }}
      />
      <MessageBox type="info" title="Beta-begrensning">
        <ThemeText type="label">
          Det er foreløpig kun mulig å kjøpe enkeltbillett voksen for buss og
          trikk. Bruk{' '}
          <Text style={{textDecorationLine: 'underline'}}>AtB Mobillett</Text>
          for å kjøpe andre billetter.
        </ThemeText>
      </MessageBox>
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
          <TouchableOpacity onPress={remove}>
            <ThemeIcon svg={Remove} />
          </TouchableOpacity>
          <TouchableOpacity onPress={add}>
            <ThemeIcon svg={Add} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.totalContainer}>
        <View style={{flexDirection: 'column'}}>
          <ThemeText type="body">Total</ThemeText>
          <ThemeText type="body">Inkl. 6% mva</ThemeText>
        </View>

        {hasOffer ? (
          <ThemeText type="heroTitle">{total} kr</ThemeText>
        ) : (
          <ActivityIndicator style={{margin: 12}} />
        )}
      </View>

      <View style={styles.buttons}>
        <ThemeText type="body__link" style={styles.informationLink}>
          Informasjon og vilkår
        </ThemeText>
        <Button
          mode="primary"
          text="Betal med vipps"
          disabled={!hasOffer}
          accessibilityLabel="Trykk for å betale billett med vipps"
          rightIcon={() => <ThemeIcon svg={Vipps} />}
          onPress={closeModal}
        />
        <Button
          mode="primary"
          text="Betal med bankkort"
          disabled={!hasOffer}
          accessibilityLabel="Trykk for å betale billett med bankkort"
          rightIcon={() => <ThemeIcon svg={CreditCard} />}
          onPress={() => navigation.goBack()}
        />
        <Button
          mode="secondary"
          text="Avbryt"
          accessibilityLabel="Trykk for å avbryte billettkjøp"
          leftIcon={() => <ThemeIcon svg={Close} />}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* <TouchableHighlight
        disabled={!hasPassengers}
        onPress={() =>
          hasPassengers &&
          navigation.push('PaymentMethod', {
            offers: offerGroups
              .map(([_, {offer_id, count}]) => ({
                offer_id,
                count,
              }))
              .filter(({count}) => count),
          })
        }
        style={styles.button}
      >
        <View
          style={[
            styles.buttonContentContainer,
            {opacity: hasPassengers ? 1 : 0.2},
          ]}
        >
          <ThemeText style={styles.buttonText}>Velg betalingsmiddel</ThemeText>
          <ArrowRight fill="white" width={14} height={14} />
        </View>
      </TouchableHighlight> */}
    </SafeAreaView>
  );
};

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
