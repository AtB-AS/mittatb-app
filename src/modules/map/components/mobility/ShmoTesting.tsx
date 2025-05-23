import React, {useEffect} from 'react';
import {
  InitShmoOneStopBookingRequestBody,
  ShmoBookingEvent,
  ShmoBookingEventType,
} from '@atb/api/types/mobility';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {useActiveShmoBookingQuery} from '@atb/modules/mobility';
import {useGetAssetFromQrCodeMutation} from '@atb/modules/mobility';
import {useInitShmoOneStopBookingMutation} from '@atb/modules/mobility';
import {useSendShmoBookingEventMutation} from '@atb/modules/mobility';
import {useShmoBookingQuery} from '@atb/modules/mobility';
// eslint-disable-next-line no-restricted-imports
import {usePreviousPaymentMethods} from '@atb/modules/payment/previous-payment-utils';
import {useCallback, useState} from 'react';
import {TextInput, useWindowDimensions, View} from 'react-native';
import {Button} from '@atb/components/button';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useVehicle} from '@atb/modules/mobility';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {ToggleSectionItem} from '@atb/components/sections';

type ShmoTestingProps = {
  selectedVehicleId?: string;
  showSelectedFeature: boolean;
  setShowSelectedFeature: (showSelectedFeature: boolean) => void;
};

export const ShmoTesting = ({
  selectedVehicleId,
  showSelectedFeature,
  setShowSelectedFeature,
}: ShmoTestingProps) => {
  const [previousBookingId, setPreviousBookingId] = useState<string>();
  const [vehicleId, setVehicleId] = useState<string | undefined>(
    selectedVehicleId,
  );
  const [vehicleCode, setVehicleCode] = useState<string>('146030');
  const {operatorId} = useVehicle(vehicleId ?? '');

  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const destructiveColor = theme.color.interactive.destructive;

  const navigation = useNavigation<RootNavigationProps>();
  const styles = useStyles();
  const {height: windowHeight} = useWindowDimensions();
  const {top: safeAreaTop} = useSafeAreaInsets();

  const {recurringPaymentMethods} = usePreviousPaymentMethods();
  const lastRecurringPaymentMethod =
    !!recurringPaymentMethods && recurringPaymentMethods.length > 0
      ? recurringPaymentMethods[recurringPaymentMethods.length - 1]
      : undefined;

  const recurringPaymentId =
    lastRecurringPaymentMethod?.recurringPayment?.id ?? '';

  const {data: activeShmoBooking} = useActiveShmoBookingQuery();
  const {data: shmoBooking} = useShmoBookingQuery(previousBookingId);

  const {close: closeBottomSheet} = useBottomSheetContext();

  useEffect(() => {
    if (selectedVehicleId) {
      setVehicleId(selectedVehicleId);
    }
  }, [selectedVehicleId]);

  const {
    mutateAsync: getAssetFromQrCode,
    isLoading: getAssetFromQrCodeIsLoading,
    isError: getAssetFromQrCodeIsError,
  } = useGetAssetFromQrCodeMutation();

  const {
    mutateAsync: initShmoOneStopBooking,
    isLoading: initShmoOneStopBookingIsLoading,
    isError: initShmoOneStopBookingIsError,
  } = useInitShmoOneStopBookingMutation();

  const {
    mutateAsync: sendShmoBookingEvent,
    isLoading: sendShmoBookingEventIsLoading,
    isError: sendShmoBookingEventIsError,
  } = useSendShmoBookingEventMutation();

  const getAssetIdFromQrCode = async () => {
    const assetFromQrCode = await getAssetFromQrCode({
      qrCodeUrl: `https://m.ryde.vip/scooter.html?n=${vehicleCode}`,
      latitude: 0,
      longitude: 0,
    });
    return assetFromQrCode.id;
  };

  const initShmoBooking = useCallback(() => {
    if (!!recurringPaymentId && !!vehicleId) {
      const initReqBody: InitShmoOneStopBookingRequestBody = {
        recurringPaymentId,
        coordinates: {latitude: 0, longitude: 0},
        assetId: vehicleId,
        operatorId: operatorId ?? 'YRY:Operator:Ryde',
      };
      initShmoOneStopBooking(initReqBody);
    }
  }, [recurringPaymentId, initShmoOneStopBooking, vehicleId, operatorId]);

  const startFinishingShmoBooking = useCallback(() => {
    if (activeShmoBooking?.bookingId) {
      const startFinishingEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.START_FINISHING,
      };
      sendShmoBookingEvent({
        bookingId: activeShmoBooking?.bookingId,
        shmoBookingEvent: startFinishingEvent,
      });
    }
  }, [activeShmoBooking?.bookingId, sendShmoBookingEvent]);

  const finishShmoBooking = useCallback(() => {
    if (activeShmoBooking?.bookingId) {
      const finishEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.FINISH,
        fileName: 'evidence.png',
        fileType: 'image/png',
        fileData:
          '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',
      };
      sendShmoBookingEvent({
        bookingId: activeShmoBooking?.bookingId,
        shmoBookingEvent: finishEvent,
      });
      setPreviousBookingId(activeShmoBooking.bookingId);
    }
  }, [activeShmoBooking?.bookingId, sendShmoBookingEvent]);

  const ShmoTestingButtons = (
    <View
      style={{
        paddingLeft: 5,
        pointerEvents: 'auto',
      }}
    >
      <Button
        expanded={false}
        style={styles.filterButton}
        type="small"
        interactiveColor={
          initShmoOneStopBookingIsError ? destructiveColor : interactiveColor
        }
        accessibilityRole="button"
        onPress={() => {
          //analytics.logEvent('Map', 'Init Booking Pressed');
          initShmoBooking();
        }}
        text="Init Booking"
        loading={initShmoOneStopBookingIsLoading}
        hasShadow={true}
      />

      <Button
        expanded={false}
        style={styles.filterButton}
        type="small"
        interactiveColor={
          sendShmoBookingEventIsError ? destructiveColor : interactiveColor
        }
        accessibilityRole="button"
        onPress={() => {
          //analytics.logEvent('Map', 'Start Finishing Pressed');
          startFinishingShmoBooking();
        }}
        text="Start Finishing"
        loading={sendShmoBookingEventIsLoading}
        hasShadow={true}
      />

      <Button
        expanded={false}
        style={styles.filterButton}
        type="small"
        interactiveColor={
          sendShmoBookingEventIsError ? destructiveColor : interactiveColor
        }
        accessibilityRole="button"
        onPress={() => {
          //analytics.logEvent('Map', 'Finish Pressed');
          finishShmoBooking();
        }}
        text="Finish"
        loading={sendShmoBookingEventIsLoading}
        hasShadow={true}
      />

      <TextInput
        style={styles.textInput}
        onChangeText={(text) => setVehicleCode(text)}
        value={vehicleCode}
      />

      <Button
        expanded={false}
        style={styles.filterButton}
        type="small"
        interactiveColor={
          getAssetFromQrCodeIsError ? destructiveColor : interactiveColor
        }
        accessibilityRole="button"
        onPress={async () => {
          //analytics.logEvent('Map', 'Qr to Ids Pressed');
          const vehicleIdFromQrCode = await getAssetIdFromQrCode();

          setVehicleId(vehicleIdFromQrCode || '');
        }}
        text="Qr to Ids"
        loading={getAssetFromQrCodeIsLoading}
        hasShadow={true}
      />
      <Button
        expanded={false}
        style={styles.filterButton}
        type="small"
        interactiveColor={interactiveColor}
        accessibilityRole="button"
        onPress={() => {
          closeBottomSheet();
          if (vehicleId) {
            navigation.navigate('Root_ScooterHelpScreen', {
              vehicleId: vehicleId,
              operatorId: operatorId ?? 'YRY:Operator:Ryde',
            });
          } else if (activeShmoBooking) {
            navigation.navigate('Root_ScooterHelpScreen', {
              operatorId: operatorId ?? 'YRY:Operator:Ryde',
              bookingId: activeShmoBooking.bookingId,
            });
          }
        }}
        text="Help"
        hasShadow={true}
      />
      <ToggleSectionItem
        text="Show selected map feature"
        value={showSelectedFeature}
        onValueChange={setShowSelectedFeature}
      />
    </View>
  );

  return (
    <>
      <View
        style={{
          position: 'absolute',
          left: 0,
          width: '35%',
          paddingTop: safeAreaTop,
        }}
      >
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.75)',
            height: windowHeight,
            pointerEvents: 'auto',
          }}
        >
          <ThemeText>RecurringPaymentId: {recurringPaymentId}</ThemeText>

          <View style={{backgroundColor: 'rgba(0,255,0,0.25)'}}>
            <ThemeText>VehicleId: {vehicleId}</ThemeText>
          </View>

          <View style={{backgroundColor: 'rgba(225, 0, 255, 0.25)'}}>
            <ThemeText>VehicleCode: {vehicleCode}</ThemeText>
          </View>

          <View style={{backgroundColor: 'yellow'}}>
            <ThemeText>OperatorId: {operatorId}</ThemeText>
          </View>

          <View style={{backgroundColor: 'rgba(0,0,255,0.25)'}}>
            <ThemeText>
              Active Booking:
              {'\n' + JSON.stringify(activeShmoBooking)}
            </ThemeText>
          </View>
          <View
            style={{
              paddingTop: 5,
              backgroundColor: 'rgba(255,0,0,0.25)',
              marginBottom: 10,
            }}
          >
            <ThemeText>
              Previous Booking:
              {'\n' + JSON.stringify(shmoBooking)}
            </ThemeText>
          </View>
          <View style={{height: windowHeight * 0.75, pointerEvents: 'none'}} />
        </ScrollView>
      </View>
      <View
        style={{
          position: 'absolute',
          paddingTop: 50,
          right: 0,
        }}
      >
        {ShmoTestingButtons}
      </View>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  filterButton: {
    marginBottom: theme.spacing.small,
    pointerEvents: 'auto',
  },
  textInput: {
    marginBottom: theme.spacing.small,
    pointerEvents: 'auto',
    borderWidth: 1,
    backgroundColor: 'white',
    color: 'black',
    padding: 8,
  },
}));
