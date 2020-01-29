import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import WaitingForBus from '../../assets/svg/WaitingForBus';
import colors from '../../assets/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import Logo from '../../assets/svg/Logo';
import {StackNavigationProp} from '@react-navigation/stack';
import {OnboardingStackParamList} from './';
import {useGeolocationState} from '../../GeolocationContext';

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
  const {status, requestPermission} = useGeolocationState();

  useEffect(() => {
    if (status === 'granted') {
      navigation.replace('HomeLocation');
    }
  }, [status]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          <Logo width={48} style={{alignSelf: 'center'}} />
          <Text style={styles.title}>
            Velkommen til en enklere reisehverdag!
          </Text>
          <Text style={styles.description}>
            Reiseopplevelsen blir bedre med smidig samhandling. Derfor ber vi
            deg dele posisjon slik at du kan:
          </Text>
          <View>
            <ListItem text="Se hvor nærmeste transport befinner seg." />
            <ListItem text="Se fullstendige reiseforslag til jobb eller hjem fra der du er." />
            <ListItem text="Få varsel om når du må reise for å komme dit du ønsker i tide." />
          </View>
        </View>
        <View style={styles.svgContainer}>
          <WaitingForBus width="100%" height="100%" style={styles.svg} />
        </View>
        <View style={styles.buttonContainer}>
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
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: colors.general.white,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.general.white,
  },
  svgContainer: {
    width: '100%',
    maxHeight: 300,
    zIndex: -1,
  },
  svg: {
    opacity: 0.2,
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
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    padding: 24,
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowColor: colors.general.black,
  },
  button: {
    backgroundColor: colors.primary.gray,
    width: '100%',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.general.white,
  },
});

export default GeoPermission;
