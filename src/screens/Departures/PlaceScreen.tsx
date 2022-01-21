import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {View} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import Button from '@atb/components/button';
import {useTranslation} from '@atb/translations';
import {Quay, StopPlacePosition} from '@atb/api/types/departures';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {DeparturesStackParams} from '.';
import QuayView from './QuayView';
import StopPlaceView from './StopPlaceView';

export type PlaceScreenParams = {
  stopPlacePosition: StopPlacePosition;
  selectedQuay?: Quay;
};

type PlaceScreenRouteProps = RouteProp<DeparturesStackParams, 'PlaceScreen'>;

type quayChipData = {
  item: Quay;
};

export type PlaceScreenProps = {
  navigation: StackNavigationProp<DeparturesStackParams>;
  route: PlaceScreenRouteProps;
};

export default function PlaceScreen({
  navigation,
  route: {
    params: {stopPlacePosition, selectedQuay},
  },
}: PlaceScreenProps) {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const stopPlace = stopPlacePosition.node?.place;

  const navigateToDetails = (
    serviceJourneyId?: string,
    date?: string,
    fromQuayId?: string,
  ) => {
    if (!serviceJourneyId || !date) return;
    navigation.navigate('DepartureDetails', {
      items: [
        {
          serviceJourneyId,
          date,
          fromQuayId,
        },
      ],
    });
  };
  const navigateToQuay = (quay: Quay) => {
    navigation.setParams({selectedQuay: quay});
  };

  return (
    <View style={styles.container}>
      <FullScreenHeader title={stopPlace?.name} leftButton={{type: 'back'}} />
      <FlatList
        data={stopPlace?.quays}
        style={styles.quayChipContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Button
            onPress={() => {
              navigation.setParams({selectedQuay: undefined});
            }}
            text={t(DeparturesTexts.quayChips.allStops)}
            color={selectedQuay ? 'secondary_2' : 'secondary_3'}
            style={[styles.quayChip, {marginLeft: theme.spacings.medium}]}
          ></Button>
        }
        renderItem={({item}: quayChipData) => (
          <Button
            onPress={() => {
              navigation.setParams({selectedQuay: item});
            }}
            text={
              item.publicCode ? item.name + ' ' + item.publicCode : item.name
            }
            color={selectedQuay?.id === item.id ? 'secondary_3' : 'secondary_2'}
            style={styles.quayChip}
          ></Button>
        )}
      />
      {selectedQuay ? (
        <QuayView
          quay={selectedQuay}
          navigateToDetails={navigateToDetails}
          navigateToQuay={navigateToQuay}
        />
      ) : (
        <StopPlaceView
          stopPlacePosition={stopPlacePosition}
          navigateToDetails={navigateToDetails}
          navigateToQuay={navigateToQuay}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  quayChipContainer: {
    backgroundColor: theme.colors.background_accent.backgroundColor,
    paddingVertical: theme.spacings.medium,
    flexShrink: 0,
    flexGrow: 0,
  },
  quayChip: {
    marginRight: theme.spacings.medium,
  },
}));
