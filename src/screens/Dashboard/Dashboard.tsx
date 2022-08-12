import FullScreenHeader from '@atb/components/screen-header/full-header';

import {RootStackParamList} from '@atb/navigation';

import {StyleSheet, Theme} from '@atb/theme';
import {DashboardTexts, useTranslation} from '@atb/translations';

import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {AssistantParams} from '../Assistant';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';

export type DashboardScreenNavigationParams = StackNavigationProp<
  AssistantParams,
  'Dashboard'
>;

type DashboardScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList>,
  DashboardScreenNavigationParams
>;

type DashboardScreenProps = {
  navigation: DashboardScreenNavigationProp;
};

export default function Dashboard({navigation}: DashboardScreenProps) {
  const style = useStyle();
  const {t} = useTranslation();
  const {leftButton: serviceDisruptionButton} = useServiceDisruptionSheet();

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(DashboardTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={serviceDisruptionButton}
      />

      <ScrollView
        contentContainerStyle={style.scrollView}
        testID="dashboardScrollView"
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
