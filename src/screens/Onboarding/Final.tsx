import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Check from '../../assets/svg/Check';
import colors from '../../assets/colors';
import {SafeAreaView} from 'react-native-safe-area-context';

const Final = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Check />
      <Text>Takk!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary.blue,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Final;
