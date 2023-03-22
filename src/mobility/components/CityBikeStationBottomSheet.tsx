import {StationFragment} from '@atb/api/types/generated/fragments/stations';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {useSystem} from '@atb/mobility/use-system';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {
  BicycleTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {getRentalAppUri} from '@atb/mobility/utils';
import {StyleSheet} from '@atb/theme';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {View} from 'react-native';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {Bicycle, Parking} from '@atb/assets/svg/mono-icons/vehicles';

type Props = {
  station: StationFragment;
  close: () => void;
};
export const CityBikeStationSheet = ({station, close}: Props) => {
  const {t} = useTranslation();
  const style = useSheetStyle();
  const {appStoreUri, brandLogoUrl, operatorName} = useSystem(station);
  const rentalAppUri = getRentalAppUri(station);
  const {openOperatorApp} = useOperatorApp({
    operatorName,
    appStoreUri,
    rentalAppUri,
  });

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        color={'background_1'}
        setFocusOnLoad={false}
      />
      <Section withPadding>
        <GenericSectionItem>
          <OperatorLogo operatorName={operatorName} logoUrl={brandLogoUrl} />
        </GenericSectionItem>
      </Section>
      <View style={style.vehicleInfo}>
        <View style={[style.vehicleInfoItem, style.vehicleInfoItem__first]}>
          <VehicleStat
            svg={Bicycle}
            primaryStat={station.numBikesAvailable}
            secondaryStat={t(BicycleTexts.stations.numBikesAvailable)}
          />
        </View>
        <View style={[style.vehicleInfoItem, style.vehicleInfoItem__last]}>
          <VehicleStat
            svg={Parking}
            primaryStat={
              station.numDocksAvailable ??
              t(BicycleTexts.stations.unknownDocksAvailable)
            }
            secondaryStat={t(BicycleTexts.stations.numDocksAvailable)}
          />
        </View>
      </View>
      {rentalAppUri && (
        <FullScreenFooter>
          <Button
            style={style.button}
            text={t(MobilityTexts.operatorAppSwitchButton(operatorName))}
            onPress={openOperatorApp}
            mode="primary"
            interactiveColor={'interactive_0'}
          />
        </FullScreenFooter>
      )}
    </BottomSheetContainer>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => ({
  button: {
    marginTop: theme.spacings.medium,
  },
  vehicleInfo: {
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'row',
    padding: theme.spacings.medium,
  },
  vehicleInfoItem: {
    flex: 1,
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacings.medium,
  },
  // Hack until 'gap' is supported properly.
  // https://github.com/styled-components/styled-components/issues/3628
  vehicleInfoItem__first: {
    marginRight: theme.spacings.medium,
  },
  vehicleInfoItem__last: {
    marginLeft: theme.spacings.medium,
  },
  vehicleStat: {
    marginBottom: theme.spacings.medium,
  },
}));
