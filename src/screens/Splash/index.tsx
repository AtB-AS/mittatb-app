import React from 'react';
import {View, StyleSheet} from 'react-native';
import Logo from '../../assets/svg/Logo';
import colors from '../../theme/colors';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Logo />
    </View>
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

export default Splash;
