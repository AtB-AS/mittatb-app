import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import WaitingForBus from '../../assets/svg/WaitingForBus';
import colors from '../../assets/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import Logo from '../../assets/svg/Logo';
import {requestGeolocationPermission} from '../../geolocation';
import {StackNavigationProp} from '@react-navigation/stack';
import {OnboardingStackParamList} from './';

const ListItem: React.FC<{text: string}> = ({text}) => (
  <View style={styles.bulletListItem}>
    <Text style={styles.bulletListText}>{'\u2022'}</Text>
    <Text style={[styles.bulletListText, {paddingLeft: 12}]}>{text}</Text>
  </View>
);

type GeoPermissionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'GeoPermission'
>;

type Props = {
  navigation: GeoPermissionScreenNavigationProp;
};

const GeoPermission: React.FC<Props> = ({navigation}) => {
  const requestPermission = async function() {
    const status = await requestGeolocationPermission();
    if (status === 'granted') {
      navigation.replace('HomeLocation');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          <Logo width={48} style={{alignSelf: 'center'}} />
          <Text
            style={{
              fontSize: 28,
              textAlign: 'center',
              color: colors.general.white,
            }}
          >
            Velkommen til en enklere reisehverdag!
          </Text>
          <Text
            style={{
              fontSize: 15,
              textAlign: 'center',
              color: colors.general.white,
            }}
          >
            Reiseopplevelsen blir bedre med smidig samhandling. Derfor ber vi
            deg dele posisjon slik at du kan:
          </Text>
          <View>
            <ListItem text="Se hvor nærmeste transport befinner seg." />
            <ListItem text="Se fullstendige reiseforslag til jobb eller hjem fra der du er." />
            <ListItem text="Få varsel om når du må reise for å komme dit du ønsker i tide." />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            maxHeight: 300,
            zIndex: -1,
          }}
        >
          <WaitingForBus width="100%" height="100%" />
        </View>
        <View
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            padding: 24,
            shadowOffset: {width: 5, height: 5},
            shadowOpacity: 0.75,
            shadowRadius: 10,
            shadowColor: colors.general.black,
          }}
        >
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Kom i gang</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary.blue,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 48,
  },
  bulletList: {},
  bulletListItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  bulletListText: {
    fontSize: 17,
    color: colors.general.white,
  },
  button: {
    backgroundColor: colors.primary.green,
    width: '100%',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
  },
});

export default GeoPermission;
