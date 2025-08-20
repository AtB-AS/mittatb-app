import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {DepartureLiveActivityDemo} from '../index';

/**
 * Test screen for Live Activities Proof of Concept
 * Add this to your navigation or app to test Live Activities functionality
 */
export function LiveActivitiesTestScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <DepartureLiveActivityDemo />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
