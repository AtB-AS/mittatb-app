import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {MessageBox} from '@atb/components/message-box';

type ErrorProps = {
  message: string;
};

export default function ComponentErrorView({message}: ErrorProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <MessageBox message={message} type="error" />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    margin: theme.spacings.medium,
  },
}));
