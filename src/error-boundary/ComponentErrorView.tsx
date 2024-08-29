import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {MessageInfoBox} from '@atb/components/message-info-box';

type ErrorProps = {
  message: string;
};

export function ComponentErrorView({message}: ErrorProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <MessageInfoBox message={message} type="error" />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    margin: theme.spacing.medium,
  },
}));
