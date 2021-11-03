import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import MessageBox from '@atb/components/message-box';
import {StyleSheet, Theme} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {StopPlaceDetails} from '@atb/sdk';
import {StackNavigationProp} from '@react-navigation/stack';
import {NearbyStackParams} from '../Nearby';
import {RouteProp} from '@react-navigation/native';

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

  console.log(stopPlaceDetails);

  // const stopPlace = ;

  return (
    <View style={style.container}>
      <FullScreenHeader title="Stop place" leftButton={{type: 'back'}} />

      <ScrollView>
        <Sections.Section withPadding withTopPadding>
          {/* <Sections.HeaderItem
            text={stopPlaceDetails && stopPlaceDetails.name}
          /> */}

          <Sections.GenericItem>
            <MessageBox message="This is a message" />
          </Sections.GenericItem>
        </Sections.Section>
      </ScrollView>
    </View>
  );
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
}));
