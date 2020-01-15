import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Logo from '../../assets/Logo';
import colors from '../../assets/colors';
import useGeolocationPermission from './useGeolocationPermission';
import Form from './Form';

const App = () => {
  const hasPermission = useGeolocationPermission();

  if (hasPermission) {
    return <Form />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Logo />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.green,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
