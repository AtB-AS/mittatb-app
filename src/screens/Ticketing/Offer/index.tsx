import React, {useEffect, useReducer} from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {TicketingStackParams} from '../';
import ArrowRight from '../../../assets/svg/ArrowRight';
import ChevronDownIcon from '../../../assets/svg/ChevronDownIcon';
import {searchOffers} from '../../../api/';
import {UserType, Offer} from '../../../api/fareContracts';
import OfferGroup from './Group';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'Offer'>;
};

type Group = {
  name: string;
  user_type: UserType;
};

const groups = new Map<string, Group>();
groups.set('adult_group', {name: 'voksen', user_type: 'ADULT'});
const groupArr = Array.from(groups.entries()).map(([id, {user_type}]) => ({
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

const offerReducer: OfferReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_OFFERS':
      return action.offers
        .map<[string, OfferGroup]>((o) => [
          o.traveller_id,
          {
            offer_id: o.offer_id,
            price:
              o.prices.find((p) => p.currency === 'NOK')?.amount_float ?? 0,
            name: groups.get(o.traveller_id)?.name ?? 'unknown',
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
  const [state, dispatch] = useReducer(offerReducer, {});

  const offerGroups = Object.entries(state);
  const hasPassengers = offerGroups.some(([_, {count}]) => !!count);
  const total = offerGroups.reduce(
    (sum, [_, {price, count}]) => sum + price * count,
    0,
  );

  useEffect(() => {
    async function getBaseOffers() {
      try {
        const offers = await searchOffers(['ATB:TariffZone:1'], groupArr, [
          'ATB:PreassignedFareProduct:61be5f93',
        ]);

        dispatch({
          type: 'SET_OFFERS',
          offers,
        });
      } catch (err) {
        console.warn(err);
      }
    }
    getBaseOffers();
  }, []);

  return (
    <View style={styles.container}>
      {!offerGroups.length ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={styles.heading}>Kjøp reise</Text>
          <View style={[styles.borderedTextContainer, styles.grayBorder]}>
            <Text style={styles.text}>Bussreise</Text>
            <ChevronDownIcon opacity="0.2" />
          </View>
          <View style={[styles.borderedTextContainer, styles.grayBorder]}>
            <Text style={styles.text}>Sone A - Stor Trondheim</Text>
            <ChevronDownIcon opacity="0.2" />
          </View>
          {offerGroups.map(([group_id, group]) => (
            <OfferGroup
              key={group_id}
              name={group.name}
              price={group.price}
              count={group.count}
              increment={() => dispatch({type: 'INCREMENT', group_id})}
              decrement={() => dispatch({type: 'DECREMENT', group_id})}
            />
          ))}
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  borderedTextContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginRight: 3,
    padding: 12,
  },
  button: {padding: 12, backgroundColor: 'black'},
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  buttonText: {color: 'white', fontSize: 16},
  container: {padding: 24, backgroundColor: 'white', flex: 1},
  grayBorder: {
    borderColor: '#cccccc',
  },
  heading: {
    fontSize: 26,
    color: 'black',
    letterSpacing: 0.35,
    paddingBottom: 12,
  },
  text: {fontSize: 16},
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
  },
  textWithPadding: {fontSize: 16, paddingVertical: 24},
});

export default OfferRoot;
