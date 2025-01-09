import {
  InitShmoOneStopBookingRequestBody,
  ShmoBookingEvent,
  ShmoBookingEventType,
} from '@atb/api/types/mobility';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {useGetIdsFromQrCodeMutation} from '@atb/mobility/queries/use-get-ids-from-qr-code-mutation';
import {useInitShmoOneStopBookingMutation} from '@atb/mobility/queries/use-init-shmo-one-stop-booking-mutation';
import {useSendShmoBookingEventMutation} from '@atb/mobility/queries/use-send-shmo-booking-event-mutation';
import {useShmoBookingQuery} from '@atb/mobility/queries/use-shmo-booking-query';
// eslint-disable-next-line no-restricted-imports
import {usePreviousPaymentMethods} from '@atb/stacks-hierarchy/saved-payment-utils';
import {useCallback, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {Button} from '@atb/components/button';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ShmoTestingProps = {selectedVehicleId?: string};

export const ShmoTesting = ({selectedVehicleId}: ShmoTestingProps) => {
  const [previousBookingId, setPreviousBookingId] = useState<string>();
  const [vehicleId, setVehicleId] = useState<string>();

  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const destructiveColor = theme.color.interactive.destructive;

  const styles = useStyles();
  const {height: windowHeight} = useWindowDimensions();
  const {top: safeAreaTop} = useSafeAreaInsets();

  const {recurringPaymentMethods} = usePreviousPaymentMethods();
  const lastRecurringPaymentMethod =
    !!recurringPaymentMethods && recurringPaymentMethods.length > 0
      ? recurringPaymentMethods[recurringPaymentMethods.length - 1]
      : undefined;

  const recurringPaymentId =
    lastRecurringPaymentMethod?.savedType === 'recurring'
      ? lastRecurringPaymentMethod?.recurringCard?.id
      : '';

  const {data: activeShmoBooking} = useActiveShmoBookingQuery();
  const {data: shmoBooking} = useShmoBookingQuery(previousBookingId);

  const {
    mutateAsync: getIdsFromQrCode,
    isLoading: getIdsFromQrCodeIsLoading,
    isError: getIdsFromQrCodeIsError,
  } = useGetIdsFromQrCodeMutation();

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

  const getVehicleIdFromQrCode = async () => {
    const idsFromQrCode = await getIdsFromQrCode({
      qrCodeUrl: 'https://m.ryde.vip/scooter.html?n=154197',
      latitude: 0,
      longitude: 0,
    });
    return idsFromQrCode.vehicleId;
  };

  const initShmoBooking = useCallback(() => {
    if (!!recurringPaymentId && !!selectedVehicleId) {
      const initReqBody: InitShmoOneStopBookingRequestBody = {
        recurringPaymentId,
        coordinates: {latitude: 0, longitude: 0},
        assetId: selectedVehicleId,
      };
      initShmoOneStopBooking(initReqBody);
    }
  }, [recurringPaymentId, initShmoOneStopBooking, selectedVehicleId]);

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
        fileData: 'c2FkZmRzZmFzZmJ2Cg==',
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
        compact={true}
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
        compact={true}
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
        compact={true}
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

      <Button
        expanded={false}
        style={styles.filterButton}
        compact={true}
        interactiveColor={
          getIdsFromQrCodeIsError ? destructiveColor : interactiveColor
        }
        accessibilityRole="button"
        onPress={async () => {
          //analytics.logEvent('Map', 'Qr to Ids Pressed');
          const vehicleIdFromQrCode = await getVehicleIdFromQrCode();
          setVehicleId(vehicleIdFromQrCode || '');
        }}
        text="Qr to Ids"
        loading={getIdsFromQrCodeIsLoading}
        hasShadow={true}
      />
    </View>
  );

  return (
    <>
      <View
        style={{
          position: 'absolute',
          left: 0,
          width: '50%',
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
            <ThemeText>VehicleId: {selectedVehicleId}</ThemeText>
          </View>
          <View style={{backgroundColor: 'rgba(100,100,100,0.25)'}}>
            <ThemeText>VehicleIdFromQr: {vehicleId}</ThemeText>
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
}));
