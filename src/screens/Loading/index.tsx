import React from 'react';
import {ActivityIndicator, Text, View, StyleSheet} from 'react-native';
import colors from '../../theme/colors';

const Loading: React.FC<{text?: string}> = ({text}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        size="large"
        color={colors.general.white}
      />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary.cyan,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.general.white,
    marginTop: 10,
  },
});

export default Loading;
