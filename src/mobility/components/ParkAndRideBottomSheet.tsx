import {useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {WalkingDistance} from '@atb/components/walking-distance';
import {StyleSheet} from '@atb/theme';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {ParkAndRideTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  NavigateToTripSearchCallback,
  ParkingType,
  ParkingVehicleTypes,
} from '@atb/components/map';
import {Button} from '@atb/components/button';
import DeparturesDialogSheetTexts from '@atb/translations/components/DeparturesDialogSheet';
import {Feature, Point} from 'geojson';
import {SearchLocation} from '@atb/favorites';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {MobilityStats} from '@atb/mobility/components/MobilityStats';
import {MobilityStat} from '@atb/mobility/components/MobilityStat';
import {Parking} from '@atb/assets/svg/mono-icons/places';
import {Car} from '@atb/assets/svg/mono-icons/transportation-entur';
import {ThemedParkAndRide} from '@atb/theme/ThemedAssets';

type Props = {
  name: string | undefined;
  capacity: number | undefined;
  distance: number | undefined;
  parkingFor: ParkingVehicleTypes;
  feature: Feature<Point, ParkingType>;
  onClose: () => void;
  navigateToTripSearch: NavigateToTripSearchCallback;
};
export const ParkAndRideBottomSheet = ({
  name,
  capacity,
  parkingFor,
  feature,
  distance,
  onClose,
  navigateToTripSearch,
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
    <BottomSheetContainer
      title={t(ParkAndRideTexts.title)}
      onClose={onClose}
      maxHeightValue={0.5}
    >
      <ScrollView>
        <View style={styles.buttonsContainer}>
          <Button
            text={t(DeparturesDialogSheetTexts.travelFrom.title)}
            onPress={() => navigateToTripSearch(searchLocation, 'fromLocation')}
            mode="primary"
            style={styles.travelButton}
          />
          <Button
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
                      svg={parkingFor === 'pedalCycle' ? Bicycle : Car}
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
    </BottomSheetContainer>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      marginBottom: Math.max(bottom, theme.spacing.medium),
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
