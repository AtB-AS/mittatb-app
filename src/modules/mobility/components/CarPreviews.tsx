import {CarAvailabilityFragment} from '@atb/api/types/generated/fragments/stations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {View} from 'react-native';
import {CarImage} from './CarImage';
import {ThemeText} from '@atb/components/text';

type Props = {
  stationCapacity: number;
  vehicleTypesAvailable: Array<CarAvailabilityFragment>;
};

export const CarPreviews = ({
  stationCapacity,
  vehicleTypesAvailable,
}: Props) => {
  const style = useSheetStyle();

  const previewArray = createPreviewArray(
    stationCapacity,
    vehicleTypesAvailable,
  );
  const carPreview = previewArray.map((vehicle, i) => (
    <View
      key={vehicle.vehicleType.id}
      style={[
        style.carImage,
        i === stationCapacity - 1 ? style.carImageLast : {},
      ]}
    >
      <CarImage uri={vehicle.vehicleType.vehicleImage} />
      {previewArray.length === 1 && vehicle.count == 2 && (
        /**
         * show duplicate image if only 1 vehicle type is available
         * and there are more than 1 of that specific vehicle type.
         */
        <View style={style.duplicateImage}>
          <CarImage uri={vehicle.vehicleType.vehicleImage} />
        </View>
      )}
    </View>
  ));

  return (
    <View style={style.carDetailsContainer}>
      {carPreview}
      {stationCapacity > 2 && <MoreCarsIndicator count={stationCapacity - 1} />}
    </View>
  );
};

type MoreCarsProps = {
  count: number;
};

const MoreCarsIndicator = ({count}: MoreCarsProps) => {
  const style = useSheetStyle();
  const {theme} = useThemeContext();
  return (
    <View style={style.moreCarsContainer}>
      <ThemeText color={theme.color.background.neutral[2]}>+{count}</ThemeText>
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    carDetailsContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    carImage: {
      flexShrink: 1,
      flexGrow: 0,
      flexDirection: 'row',
      marginRight: theme.spacing.small,
    },
    carImageLast: {
      marginRight: 0,
    },
    duplicateImage: {
      marginLeft: theme.spacing.small,
    },
    moreCarsContainer: {
      height: 40,
      width: 40,
      borderRadius: 8,
      backgroundColor: theme.color.background.neutral[2].background,
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});

/**
 *  This function returns an array of vehicles that is shown
 *  on the bottom sheet for car station mobility.
 *
 *  Case can be accessed in Figma link below
 *  https://www.figma.com/file/zdZwvobgpEWSagKt0tderx/App?node-id=20471-12079
 *
 *  Case on version 1.44 :
 *  - If the station capacity is 2 or less : show car image(s)
 *  - If the station capacity is 3 or more : show 1 car image and the plus text
 *
 *  @param stationCapacity: Station capacity
 *  @param vehicleTypesAvailable: Types of available cars, array of CarAvailabilityFragment
 *  @returns array of vehicle types to show
 */
function createPreviewArray(
  stationCapacity: number,
  vehicleTypesAvailable: CarAvailabilityFragment[],
): CarAvailabilityFragment[] {
  return vehicleTypesAvailable.slice(stationCapacity == 2 ? -2 : -1);
}
