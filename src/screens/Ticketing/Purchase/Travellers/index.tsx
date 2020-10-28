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
import {StyleSheet} from '../../../../theme';

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

const OfferRoot: React.FC<Props> = ({navigation}) => {
  const styles = useStyles();
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
        <Text>
          Det er foreløpig kun mulig å kjøpe enkeltbillett voksen for buss og
          trikk. Bruk{' '}
          <Text style={{textDecorationLine: 'underline'}}>AtB Mobillett</Text>{' '}
          for å kjøpe andre billetter.
        </Text>
      </MessageBox>

      <View
        style={{
          backgroundColor: 'white',
          borderTopEndRadius: 8,
          borderTopLeftRadius: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#F5F5F6',
          padding: 12,
          marginTop: 8,
        }}
      >
        <Text
          style={{
            color: '#37424A',
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '400',
          }}
        >
          Enkeltbillett, Sone A - Stor-Trondheim
        </Text>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          borderBottomEndRadius: 8,
          borderBottomLeftRadius: 8,
          padding: 12,
          marginBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 20,
              fontWeight: '600',
            }}
          >
            {count} voksen
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 100,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              fontWeight: '400',
            }}
          >
            40,-
          </Text>
          <TouchableOpacity onPress={remove}>
            <Remove />
          </TouchableOpacity>
          <TouchableOpacity onPress={add}>
            <Add />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textWithPadding}>Total</Text>
        <Text style={styles.textWithPadding}>{total},00 kr</Text>
      </View>
      <TouchableHighlight
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
          <Text style={styles.buttonText}>Velg betalingsmiddel</Text>
          <ArrowRight fill="white" width={14} height={14} />
        </View>
      </TouchableHighlight>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, padding: 12, backgroundColor: '#E5E5E5'},
  button: {padding: 12, backgroundColor: 'black'},
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  buttonText: {color: 'white', fontSize: 16},
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  textWithPadding: {fontSize: 16, paddingVertical: 24},
}));

export default OfferRoot;
