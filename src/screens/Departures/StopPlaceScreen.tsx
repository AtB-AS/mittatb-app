import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {StopPlaceDetails} from '@atb/sdk';
import {StackNavigationProp} from '@react-navigation/stack';
import {NearbyStackParams} from '../Nearby';
import {RouteProp} from '@react-navigation/native';
import Button from '@atb/components/button';

export type StopPlaceScreenParams = {
  stopPlaceDetails: StopPlaceDetails;
};

type StopPlaceScreenRouteProps = RouteProp<
  NearbyStackParams,
  'StopPlaceScreen'
>;

export type LoginOnboardingProps = {
  navigation: StackNavigationProp<NearbyStackParams>;
  route: StopPlaceScreenRouteProps;
};

export default function StopPlaceScreen({
  navigation,
  route: {
    params: {stopPlaceDetails},
  },
}: LoginOnboardingProps) {
  const style = useProfileHomeStyle();
  const {theme} = useTheme();

  useMemo(
    () =>
      stopPlaceDetails.quays?.sort((a, b) =>
        publicCodeCompare(a.publicCode, b.publicCode),
      ),
    [stopPlaceDetails],
  );

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={stopPlaceDetails.name}
        leftButton={{type: 'back'}}
      />

      <ScrollView
        style={style.quayChipContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <Button
          onPress={() => {}}
          text="Alle stopp"
          color="secondary_3"
          style={[style.quayChip, {marginLeft: theme.spacings.medium}]}
        ></Button>
        {stopPlaceDetails.quays?.map((quay) => (
          <Button
            key={quay.id}
            onPress={() => {}}
            text={
              quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
            }
            color="secondary_4"
            style={style.quayChip}
          ></Button>
        ))}
      </ScrollView>
      <ScrollView style={style.contentContainer}>
        {stopPlaceDetails.quays?.map((quay) => (
          <Sections.Section withPadding withTopPadding key={quay.id}>
            <Sections.HeaderItem
              text={
                quay.publicCode ? quay.name + ' ' + quay.publicCode : quay.name
              }
            />
            <Sections.ActionItem text={quay.description} />
          </Sections.Section>
        ))}
      </ScrollView>
    </View>
  );
}

function publicCodeCompare(a: string, b: string): number {
  // Show quays with no public code first
  if (!a) return -1;
  if (!b) return 1;
  // If both public codes are numbers, compare as numbers (e.g. 2 < 10)
  if (parseInt(a) && parseInt(b)) {
    return parseInt(a) - parseInt(b);
  }
  // Otherwise compare as strings (e.g. K1 < K2)
  return a.localeCompare(b);
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  quayChipContainer: {
    backgroundColor: theme.colors.secondary_1.backgroundColor,
    paddingVertical: theme.spacings.medium,
    flexShrink: 0,
    flexGrow: 0,
  },
  quayChip: {
    marginRight: theme.spacings.medium,
  },
  contentContainer: {},
}));
