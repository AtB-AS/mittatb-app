import React, {useReducer, useState} from 'react';
import {Text, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {TicketingStackParams} from '../';
import {ArrowRight} from '../../../../assets/svg/icons/navigation';
import {UserType, Offer, OfferPrice} from '../../../../api/fareContracts';
import OfferGroup from './Group';
import Header from '../../../../ScreenHeader';
import {Add, Close, Remove} from '../../../../assets/svg/icons/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import MessageBox from '../../../../message-box';
import {StyleSheet, useTheme} from '../../../../theme';
import ThemeText from '../../../../components/text';
import ThemeIcon from '../../../../components/theme-icon';
import Button from '../../../../components/button';
import {CreditCard, Vipps} from '../../../../assets/svg/icons/ticketing';

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
  id,
  user_type,
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
  const {theme} = useTheme();
  const [state, dispatch] = useReducer(offerReducer, {});

  const offerGroups = Object.entries(state);
  const hasPassengers = offerGroups.some(([_, {count}]) => !!count);
  const total = offerGroups.reduce(
    (sum, [_, {price, count}]) => sum + price * count,
    0,
  );

  const [count, setCount] = useState<number>(1);
  const canRemove = count > 1;
  const add = () => setCount(count + 1);
  const remove = () => canRemove && setCount(count - 1);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Reisende"
        leftButton={{
          icon: <Close />,
          onPress: () => navigation.goBack(),
          accessibilityLabel: 'Lukk kjøpsprosessen',
        }}
      />
      <MessageBox type="info" title="Beta-begrensning">
        <ThemeText type="label">
          Det er foreløpig kun mulig å kjøpe enkeltbillett voksen for buss og
          trikk. Bruk{' '}
          <Text style={{textDecorationLine: 'underline'}}>AtB Mobillett</Text>{' '}
          for å kjøpe andre billetter.
        </ThemeText>
      </MessageBox>
      <View
        style={{
          backgroundColor: theme.background.level0,
          borderTopEndRadius: 8,
          borderTopLeftRadius: 8,
          borderBottomWidth: 1,
          borderBottomColor: theme.background.level1,
          padding: 12,
          marginTop: 8,
        }}
      >
        <ThemeText type="lead">
          Enkeltbillett, Sone A - Stor-Trondheim
        </ThemeText>
      </View>
      <View
        style={{
          backgroundColor: theme.background.level0,
          borderBottomEndRadius: 8,
          borderBottomLeftRadius: 8,
          padding: 12,
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
          <ThemeText type="paragraphHeadline">{count} voksen</ThemeText>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 100,
          }}
        >
          <ThemeText
            style={{
              fontSize: 14,
              lineHeight: 20,
              fontWeight: '400',
            }}
          >
            40,-
          </ThemeText>
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
        <ThemeText style={styles.totalPrice}>{total} kr</ThemeText>
      </View>
      <ThemeText type="body__link" style={styles.informationLink}>
        Informasjon og vilkår
      </ThemeText>
      <Button
        mode="primary"
        text="Betal med vipps"
        accessibilityLabel="Trykk for å betale billett med vipps"
        rightIcon={() => <ThemeIcon svg={Vipps} />}
        onPress={() => navigation.goBack()}
      />
      <Button
        mode="primary"
        text="Betal med bankkort"
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
  container: {flex: 1, padding: 12, backgroundColor: theme.background.level2},
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacings.medium,
  },
  totalPrice: {
    fontSize: 32,
    lineHeight: 40,
  },
  informationLink: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.small,
  },
}));

export default Travellers;
