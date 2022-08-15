import FullScreenHeader from '@atb/components/screen-header/full-header';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, Theme} from '@atb/theme';
import {useTranslation, TripSearchTexts} from '@atb/translations';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {DashboardParams} from '../Dashboard';

export type TripSearchScreenNavigationParams = StackNavigationProp<
  DashboardParams,
  'TripSearch'
>;

type TripSearchScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  TripSearchScreenNavigationParams
>;

type TripSearchScreenProps = {
  navigation: TripSearchScreenNavigationProp;
};

export default function TripSearch({navigation}: TripSearchScreenProps) {
  const style = useStyle();
  const {t} = useTranslation();

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(TripSearchTexts.header.title)}
        rightButton={{type: 'chat'}}
      />

      <ScrollView
        contentContainerStyle={style.scrollView}
        testID="profileHomeScrollView"
      ></ScrollView>
    </View>
  );
}

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  scrollView: {
    paddingVertical: theme.spacings.medium,
  },
}));
