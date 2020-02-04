import React, {Dispatch} from 'react';
import {View, Text, StyleSheet, Switch, Alert} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import ProfileIcon from '../../../assets/svg/ProfileIcon';
import colors from '../../../assets/colors';
import {useAppState} from '../../../AppContext';
import {OverviewReducerAction, Origin} from './';

type Props = {
  dispatch: Dispatch<OverviewReducerAction>;
  origin: Origin;
  geolocationDisabled: boolean;
};

const Header: React.FC<Props> = ({dispatch, origin, geolocationDisabled}) => {
  const {restartOnboarding} = useAppState();
  console.log(geolocationDisabled);
  return (
    <View style={styles.headerContainer}>
      <TouchableWithoutFeedback
        style={styles.headerButtonContainer}
        onPress={restartOnboarding}
      >
        <ProfileIcon />
        <Text style={styles.headerButtonText}>Endre {'\n'}adresser</Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        style={[
          styles.headerButtonContainer,
          {opacity: geolocationDisabled ? 0.6 : 1},
        ]}
        onPress={
          geolocationDisabled
            ? () =>
                Alert.alert(
                  'Posisjonsdata er avskrudd',
                  'Du har avskrudd posisjonsdata.',
                )
            : () => dispatch({type: 'TOGGLE_ORIGIN'})
        }
      >
        <Text style={[styles.headerButtonText, {textAlign: 'right'}]}>
          Søk fra min {'\n'}posisjon
        </Text>
        <Switch
          ios_backgroundColor={colors.general.white}
          trackColor={{
            false: colors.general.white,
            true: colors.primary.green,
          }}
          disabled={geolocationDisabled}
          value={origin === 'current'}
          onValueChange={() => dispatch({type: 'TOGGLE_ORIGIN'})}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9FA0D',
    marginBottom: 8,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 12,
    color: colors.general.white,
    marginHorizontal: 10,
  },
});
