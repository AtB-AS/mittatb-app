import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, Theme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

export const Profile_FareContractsScreen = () => {
  const style = useStyles();

  return (
    <View style={style.container}>
      <FullScreenHeader title="Fare Contracts" leftButton={{type: 'back'}} />

      <ScrollView></ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
}));
