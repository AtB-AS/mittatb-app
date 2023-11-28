import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {WalkingDistance} from '@atb/components/walking-distance';
import {StyleSheet, useTheme} from '@atb/theme';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {ParkAndRideTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Parking as ParkingDark} from '@atb/assets/svg/color/icons/vehicles/dark';
import {Parking as ParkingLight} from '@atb/assets/svg/color/icons/vehicles/light';
import {ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Car} from '@atb/assets/svg/mono-icons/transportation';
import {
  NavigateToTripSearchCallback,
  ParkingType,
  ParkingVehicleTypes,
} from '@atb/components/map';
import {Button} from '@atb/components/button';
import DeparturesDialogSheetTexts from '@atb/translations/components/DeparturesDialogSheet';
import {Feature, Point} from 'geojson';
import {SearchLocation} from '@atb/favorites';
import {MessageBox} from '@atb/components/message-box';

type Props = {
  name: string | undefined;
  capacity: number | undefined;
  distance: number | undefined;
  parkingFor: ParkingVehicleTypes;
  feature: Feature<Point, ParkingType>;
  close: () => void;
  navigateToTripSearch: NavigateToTripSearchCallback;
};
export const ParkAndRideBottomSheet = ({
  name,
  capacity,
  parkingFor,
  feature,
  distance,
  close,
  navigateToTripSearch,
}: Props) => {
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const style = useSheetStyle();
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
    <BottomSheetContainer maxHeightValue={0.5}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={heading}
        color="background_1"
        setFocusOnLoad={false}
      />
      <ScrollView>
        <WalkingDistance distance={distance} />
        <View style={style.buttonsContainer}>
          <View style={style.travelButton}>
            <Button
              text={t(DeparturesDialogSheetTexts.travelFrom.title)}
              onPress={() =>
                navigateToTripSearch(searchLocation, 'fromLocation')
              }
              mode="primary"
              style={style.travelFromButtonPadding}
            />
          </View>
          <View style={style.travelButton}>
            <Button
              text={t(DeparturesDialogSheetTexts.travelTo.title)}
              onPress={() => navigateToTripSearch(searchLocation, 'toLocation')}
              mode="primary"
              style={style.travelToButtonPadding}
            />
          </View>
        </View>
        <View style={style.container}>
          <MessageBox type="info" message={t(ParkAndRideTexts.disclaimer)} />
          <VehicleStats
            left={
              <VehicleStat
                svg={parkingFor === 'pedalCycle' ? Bicycle : Car}
                primaryStat=""
                secondaryStat={t(ParkAndRideTexts.parkingFor(parkingFor))}
              />
            }
            right={
              <VehicleStat
                svg={themeName === 'dark' ? ParkingDark : ParkingLight}
                primaryStat={capacity ?? ''}
                secondaryStat={
                  capacity
                    ? t(ParkAndRideTexts.capacity)
                    : t(ParkAndRideTexts.unknownCapacity)
                }
              />
            }
          />
        </View>
      </ScrollView>
    </BottomSheetContainer>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      paddingHorizontal: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
    buttonsContainer: {
      padding: theme.spacings.medium,
      flexDirection: 'row',
    },
    travelButton: {
      flex: 1,
    },
    travelFromButtonPadding: {
      marginRight: theme.spacings.medium / 2,
    },
    travelToButtonPadding: {
      marginLeft: theme.spacings.medium / 2,
    },
  };
});
