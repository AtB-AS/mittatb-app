import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {useSystem} from '@atb/mobility/use-system';
import {
  BicycleTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {
  getAvailableVehicles,
  getBenefit,
  getRentalAppUri,
  insertValueCode,
  isBenefitOffered,
  isUserEligibleForBenefit,
} from '@atb/mobility/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {Parking as ParkingDark} from '@atb/assets/svg/color/icons/vehicles/dark';
import {Parking as ParkingLight} from '@atb/assets/svg/color/icons/vehicles/light';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';
import {ActivityIndicator, Alert, Linking, View} from 'react-native';
import {useTextForLanguage} from '@atb/translations/utils';
import {useBikeStation} from '@atb/mobility/use-bike-station';
import {MessageBox} from '@atb/components/message-box';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {WalkingDistance} from '@atb/components/walking-distance';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {useBenefits} from '@atb/mobility/use-benefits';
import {getValueCode} from '@atb/mobility/api/api';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import Clipboard from '@react-native-clipboard/clipboard';
import {useOperatorApp} from '@atb/mobility/use-operator-app';

type Props = {
  stationId: string;
  distance: number | undefined;
  close: () => void;
};

export const CityBikeStationSheet = ({stationId, distance, close}: Props) => {
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const style = useSheetStyle();
  const {
    station,
    isLoading: isLoadingStation,
    error,
  } = useBikeStation(stationId);
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} =
    useSystem(station);
  const rentalAppUri = getRentalAppUri(station);
  const stationName = useTextForLanguage(station?.name.translation);
  const availableBikes = getAvailableVehicles(
    station?.vehicleTypesAvailable,
    FormFactor.Bicycle,
  );
  const {userBenefits, operatorBenefits, callToAction} =
    useBenefits(operatorId);
  const [valueCode, setValueCode] = useState<string>();
  const [isLoadingValueCode, setIsLoadingValueCode] = useState(false);
  const [isValueCodeCopied, setIsValueCodeCopied] = useState(false);
  const isLoading = isLoadingStation || isLoadingValueCode;
  // The data model handles multiple benefits per operator,
  // but we currently know there is only one, and the UI has to change anyway
  // to support an undetermined number of benefits.
  const isUserEligibleForFreeUse = isUserEligibleForBenefit(
    'free-use',
    userBenefits,
  );
  const hasFreeUnlock =
    isUserEligibleForFreeUse && isBenefitOffered('free-use', operatorBenefits);
  const callToActionText =
    hasFreeUnlock && valueCode
      ? callToAction('free-use', operatorName).text
      : t(MobilityTexts.operatorAppSwitchButton(operatorName));
  const callToActionUrl = callToAction('free-use', operatorName).url;
  const {openOperatorApp} = useOperatorApp({
    operatorName,
    appStoreUri,
    rentalAppUri,
  });

  useEffect(() => {
    if (operatorId && hasFreeUnlock) {
      setIsLoadingValueCode(true);
      getValueCode(operatorId).then((valueCode) => {
        setValueCode(valueCode);
        setIsLoadingValueCode(false);
      });
    }
  }, [operatorId, hasFreeUnlock]);

  const onCallToAction = () =>
    callToActionUrl && hasFreeUnlock
      ? Linking.openURL(insertValueCode(callToActionUrl, valueCode))
      : openOperatorApp();

  const copyValueCode = (valueCode: string) => {
    Clipboard.setString(valueCode);
    Alert.alert(
      t(BicycleTexts.benefits.copyCodeAlert.title),
      t(BicycleTexts.benefits.copyCodeAlert.message),
    );
    setIsValueCodeCopied(true);
  };

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={stationName ?? ''}
        color={'background_1'}
        setFocusOnLoad={false}
      />
      <>
        {isLoading && (
          <View style={style.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !error && station && (
          <>
            <WalkingDistance
              style={style.walkingDistance}
              distance={distance}
            />
            <View style={style.container}>
              <Section>
                <GenericSectionItem>
                  <OperatorLogo
                    operatorName={operatorName}
                    logoUrl={brandLogoUrl}
                  />
                </GenericSectionItem>
              </Section>
              <VehicleStats
                left={
                  <VehicleStat
                    svg={Bicycle}
                    primaryStat={availableBikes}
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
              {hasFreeUnlock && valueCode && (
                <View style={style.valueCode}>
                  <ThemeText type={'body__primary--big'}>{valueCode}</ThemeText>
                </View>
              )}
              {valueCode && (
                <OperatorBenefit
                  benefit={getBenefit('free-use', operatorBenefits)}
                  isUserEligible={isUserEligibleForFreeUse}
                  style={style.benefit}
                />
              )}
              {hasFreeUnlock && valueCode && (
                <Button
                  onPress={() => copyValueCode(valueCode)}
                  text={t(BicycleTexts.benefits.copyCodeButton)}
                  mode={isValueCodeCopied ? 'secondary' : 'primary'}
                  interactiveColor={
                    isValueCodeCopied ? 'interactive_3' : 'interactive_0'
                  }
                  style={style.valueCodeButton}
                />
              )}
            </View>
            {(rentalAppUri || callToActionUrl) && (
              <View style={style.footer}>
                <Button
                  text={callToActionText}
                  onPress={onCallToAction}
                  mode={
                    hasFreeUnlock && valueCode && !isValueCodeCopied
                      ? 'secondary'
                      : 'primary'
                  }
                  interactiveColor={
                    hasFreeUnlock && valueCode && !isValueCodeCopied
                      ? 'interactive_3'
                      : 'interactive_0'
                  }
                />
              </View>
            )}
          </>
        )}
        {!isLoading && (error || !station) && (
          <View style={style.errorMessage}>
            <MessageBox
              type="error"
              message={t(BicycleTexts.loadingFailed)}
              onPressConfig={{
                action: close,
                text: t(ScreenHeaderTexts.headerButton.close.text),
              }}
            />
          </View>
        )}
      </>
    </BottomSheetContainer>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
    benefit: {
      marginBottom: theme.spacings.medium,
    },
    container: {
      paddingHorizontal: theme.spacings.medium,
    },
    stationName: {
      flex: 1,
      alignItems: 'center',
    },
    errorMessage: {
      marginHorizontal: theme.spacings.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    valueCode: {
      alignItems: 'center',
      marginBottom: theme.spacings.small,
    },
    valueCodeButton: {
      marginBottom: theme.spacings.medium,
    },
    walkingDistance: {
      marginBottom: theme.spacings.medium,
    },
  };
});
