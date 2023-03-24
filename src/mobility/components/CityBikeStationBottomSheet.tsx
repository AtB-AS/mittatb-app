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
import {StyleSheet, useTheme} from '@atb/theme';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {Parking as ParkingDark} from '@atb/assets/svg/color/icons/vehicles/dark';
import {Parking as ParkingLight} from '@atb/assets/svg/color/icons/vehicles/light';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';

type Props = {
  station: StationFragment;
  close: () => void;
};
export const CityBikeStationSheet = ({station, close}: Props) => {
  const {t} = useTranslation();
  const {themeName} = useTheme();
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
      <VehicleStats
        left={
          <VehicleStat
            svg={Bicycle}
            primaryStat={station.numBikesAvailable}
            secondaryStat={t(BicycleTexts.stations.numBikesAvailable)}
          />
        }
        right={
          <VehicleStat
            svg={themeName === 'dark' ? ParkingDark : ParkingLight}
            primaryStat={
              station.numDocksAvailable ??
              t(BicycleTexts.stations.unknownDocksAvailable)
            }
            secondaryStat={t(BicycleTexts.stations.numDocksAvailable)}
          />
        }
      />
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
}));
