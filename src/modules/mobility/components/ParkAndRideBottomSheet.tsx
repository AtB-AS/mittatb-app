import {dictionary, useTranslation} from '@atb/translations';
import React from 'react';
import {WalkingDistance} from '@atb/components/walking-distance';
import {StyleSheet} from '@atb/theme';
import {BicycleFill, CarFill} from '@atb/assets/svg/mono-icons/transportation';
import {ParkAndRideTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ScrollView, View} from 'react-native';
import {
  NavigateToTripSearchCallback,
  ParkingType,
  ParkingVehicleTypes,
} from '@atb/modules/map';
import {Button} from '@atb/components/button';
import DeparturesDialogSheetTexts from '@atb/translations/components/DeparturesDialogSheet';
import {Feature, Point} from 'geojson';
import {SearchLocation} from '@atb/modules/favorites';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {MobilityStats} from './MobilityStats';
import {MobilityStat} from './MobilityStat';
import {Parking} from '@atb/assets/svg/mono-icons/places';
import {ThemedParkAndRide} from '@atb/theme/ThemedAssets';
import {BottomSheetMap} from '@atb/components/bottom-sheet-map';
import {Close} from '@atb/assets/svg/mono-icons/actions';

type Props = {
  name: string | undefined;
  capacity: number | undefined;
  distance: number | undefined;
  parkingFor: ParkingVehicleTypes;
  feature: Feature<Point, ParkingType>;
  onClose: () => void;
  navigateToTripSearch: NavigateToTripSearchCallback;
  positionArrowCallback: () => void;
};
export const ParkAndRideBottomSheet = ({
  name,
  capacity,
  parkingFor,
  feature,
  distance,
  onClose,
  navigateToTripSearch,
  positionArrowCallback,
}: Props) => {
  const {t} = useTranslation();
  const styles = useSheetStyle();
  const heading = `${t(ParkAndRideTexts.title)} ${name}`;

  const [longitude, latitude] = feature.geometry.coordinates;
  const searchLocation: SearchLocation = {
    id: feature.properties.id,
    name: heading,
    label: heading,
    locality: '',
    category: [],
    layer: 'venue',
    coordinates: {latitude, longitude},
    resultType: 'search',
  };

  return (
    <BottomSheetMap
      snapPoints={['80%']}
      closeCallback={onClose}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={t(ParkAndRideTexts.title)}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      positionArrowCallback={positionArrowCallback}
    >
      <ScrollView>
        <View style={styles.buttonsContainer}>
          <Button
            expanded={true}
            text={t(DeparturesDialogSheetTexts.travelFrom.title)}
            onPress={() => navigateToTripSearch(searchLocation, 'fromLocation')}
            mode="primary"
            style={styles.travelButton}
          />
          <Button
            expanded={true}
            text={t(DeparturesDialogSheetTexts.travelTo.title)}
            onPress={() => navigateToTripSearch(searchLocation, 'toLocation')}
            mode="primary"
            style={styles.travelButton}
          />
        </View>
        <ScrollView style={styles.container}>
          <Section>
            <GenericSectionItem>
              <View style={styles.parkingName}>
                <ThemeText typography="body__secondary" color="secondary">
                  {heading}
                </ThemeText>
                <WalkingDistance distance={distance} />
              </View>
            </GenericSectionItem>
            <GenericSectionItem>
              <View style={styles.mobilityStatContainer}>
                <MobilityStats
                  first={
                    <MobilityStat
                      svg={parkingFor === 'pedalCycle' ? BicycleFill : CarFill}
                      primaryStat={t(ParkAndRideTexts.parkingFor(parkingFor))}
                    />
                  }
                  second={
                    <MobilityStat
                      svg={Parking}
                      primaryStat={capacity ?? ''}
                      secondaryStat={
                        capacity
                          ? t(ParkAndRideTexts.capacity)
                          : t(ParkAndRideTexts.unknownCapacity)
                      }
                    />
                  }
                />
                <ThemedParkAndRide />
              </View>
              <MessageInfoBox
                style={styles.disclaimer}
                type="info"
                message={t(ParkAndRideTexts.disclaimer)}
              />
            </GenericSectionItem>
          </Section>
        </ScrollView>
      </ScrollView>
    </BottomSheetMap>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    buttonsContainer: {
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.large,
      flexDirection: 'row',
      gap: 8,
    },
    travelButton: {
      flexGrow: 1,
    },
    parkingName: {
      flexDirection: 'row',
    },
    mobilityStatContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    disclaimer: {
      marginTop: theme.spacing.medium,
    },
  };
});
