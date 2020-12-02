import React from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import Header from '../../../../ScreenHeader';
import {Close} from '../../../../assets/svg/icons/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from '../../../../theme';
import ThemeText from '../../../../components/text';
import ThemeIcon from '../../../../components/theme-icon';
import Button from '../../../../components/button';
import useTravellerCountState from './use-traveller-count-state';
import {DismissableStackNavigationProp} from '../../../../navigation/createDismissableStackNavigator';
import {ArrowRight} from '../../../../assets/svg/icons/navigation';
import TravellerCounter from './TravellerCounter';

type Props = {
  navigation: DismissableStackNavigationProp<
    TicketingStackParams,
    'Travellers'
  >;
  route: RouteProp<TicketingStackParams, 'Travellers'>;
};

const Travellers: React.FC<Props> = ({navigation, route: {params}}) => {
  const styles = useStyles();

  const {travellerCountState, addCount, removeCount} = useTravellerCountState();

  const closeModal = () => navigation.dismiss();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Reisende"
        leftButton={{
          icon: <ThemeIcon svg={Close} />,
          onPress: closeModal,
          accessibilityLabel: 'Avbryt kjøpsprosessen',
        }}
        style={styles.header}
      />

      {travellerCountState.map((travellerWithCount, index) => {
        return (
          <TravellerCounter
            key={travellerWithCount.type}
            travellerWithCount={travellerWithCount}
            addCount={addCount}
            removeCount={removeCount}
            firstItem={index === 0}
            lastItem={index === travellerCountState.length - 1}
          />
        );
      })}

      <View style={styles.buttons}>
        <ThemeText type="body__link" style={styles.informationLink}>
          Informasjon og vilkår
        </ThemeText>
        <Button
          mode="primary"
          text="Gå til betaling"
          accessibilityLabel="Trykk for å betale billett med bankkort"
          icon={ArrowRight}
          iconPosition="right"
          onPress={() =>
            navigation.push('PaymentOptions', {travellers: travellerCountState})
          }
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacings.medium,
    backgroundColor: theme.background.level2,
  },
  header: {
    marginBottom: theme.spacings.medium,
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
