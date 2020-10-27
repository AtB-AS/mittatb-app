import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTicketState} from '../TicketContext';

function Expired() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {padding: 24, backgroundColor: 'white', flex: 1},
});

export default Expired;
