import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import HomeBanner from '../../assets/svg/HomeBanner';
import colors from '../../assets/colors';
import {SafeAreaView} from 'react-native-safe-area-context';

const Planner = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HomeBanner width="100%" style={styles.banner} />
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary.gray,
    flex: 1,
  },
  banner: {},
  spinner: {padding: 72},
});

export default Planner;
