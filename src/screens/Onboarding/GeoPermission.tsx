import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import WaitingForBus from '../../assets/svg/WaitingForBus';
import colors from '../../theme/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import Logo from '../../assets/svg/Logo';
import {StackNavigationProp} from '@react-navigation/stack';
import {OnboardingStackParamList} from './';
import {useGeolocationState} from '../../GeolocationContext';

type GeoPermissionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  'GeoPermission'
>;

type Props = {
  navigation: GeoPermissionScreenNavigationProp;
};

const GeoPermission: React.FC<Props> = ({navigation}) => {
  const {status, requestPermission} = useGeolocationState();
  const [requestedOnce, setRequestedOnce] = useState(false);

  useEffect(() => {
    if (
      status === 'granted' ||
      status === 'blocked' ||
      status === 'unavailable' ||
      (requestedOnce && status === 'denied')
    ) {
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
          <Text style={styles.description}>
            Se hvor nærmeste transport befinner seg.
          </Text>
          <Text style={styles.description}>
            Se fullstendige reiseforslag til jobb eller hjem fra der du er.
          </Text>
          <Text style={styles.description}>
            Få varsel om når du må reise for å komme dit du ønsker i tide.
          </Text>
        </View>
        <View style={styles.svgContainer}>
          <WaitingForBus width="100%" height="100%" style={styles.svg} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight
            style={styles.button}
            onPress={() => {
              setRequestedOnce(true);
              requestPermission();
            }}
          >
            <Text style={styles.buttonText}>Kom i gang</Text>
          </TouchableHighlight>
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
    maxHeight: 460,
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
