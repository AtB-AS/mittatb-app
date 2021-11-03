import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import MessageBox from '@atb/components/message-box';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import React from 'react';
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
        <Sections.Section withPadding withTopPadding>
          <Sections.HeaderItem
            text={stopPlaceDetails && stopPlaceDetails.name}
          />

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
  },
  quayChipContainer: {
    backgroundColor: theme.colors.secondary_1.backgroundColor,
    flexShrink: 1,
    paddingVertical: theme.spacings.medium,
  },
  quayChip: {
    marginRight: theme.spacings.medium,
  },
  contentContainer: {
    flexGrow: 1,
  },
}));
