import React, {RefObject, useCallback, useEffect} from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Alert, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {VehicleCard} from '../VehicleCard';
import {useActiveShmoBookingQuery} from '../../queries/use-active-shmo-booking-query';
import {
  ShmoBookingEvent,
  ShmoBookingEventType,
  ShmoBookingState,
} from '@atb/api/types/mobility';
import {useSendShmoBookingEventMutation} from '../../queries/use-send-shmo-booking-event-mutation';
import {ShmoTripCard} from '../ShmoTripCard';
import {
  formatFriendlyShmoErrorMessage,
  getTransportModeAndSubMode,
  isValidKey,
} from '../../utils';
import {MapView} from '@rnmapbox/maps';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useShmoWarnings} from '@atb/modules/map';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {ThemeText} from '@atb/components/text';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Loading} from '@atb/components/loading';
import {TransportationIconBox} from '@atb/components/icon-box';
import {
  FormFactor,
  PropulsionType,
} from '@atb/api/types/generated/mobility-types_v2';
import {PriceDetailsCard} from '../PriceDetailsCard';
import {useOperators} from '../../use-operators';
import {SupportButton} from '../SupportButton';
import {BrandingImage} from '../BrandingImage';

type Props = {
  navigateSupportCallback: () => void;
  photoNavigation: (bookingId: string) => void;
  onForceClose: () => void;
  mapViewRef: RefObject<MapView | null>;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
};

export const ActiveShmoSheet = ({
  navigateSupportCallback,
  photoNavigation,
  onForceClose,
  mapViewRef,
  locationArrowOnPress,
  navigateToScanQrCode,
}: Props) => {
  useKeepAwake();
  const isFocusedAndActive = useIsFocusedAndActive();
  const {
    data: activeBooking,
    isLoading,
    isError,
  } = useActiveShmoBookingQuery(isFocusedAndActive, ONE_SECOND_MS * 10);
  const {logEvent} = useAnalyticsContext();

  const {mode, subMode} = getTransportModeAndSubMode(
    activeBooking?.asset?.formFactor,
    activeBooking?.asset?.propulsionType,
  );

  const operator = useOperators().byId(activeBooking?.asset.operator.id);
  const operatorLogo = operator?.brandAssets?.brandImageUrl;

  const priceAdjustments =
    operator?.priceAdjustments &&
    activeBooking?.asset?.formFactor &&
    isValidKey(operator.priceAdjustments, activeBooking.asset.formFactor)
      ? operator.priceAdjustments[activeBooking.asset.formFactor]
      : [];

  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {geofencingZoneWarning, warningMessage} = useShmoWarnings(
    activeBooking?.asset.id ?? '',
    mapViewRef,
  );

  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  useEffect(() => {
    if (activeBooking === null) {
      onForceClose();
    }
  }, [activeBooking, onForceClose]);

  const {
    mutateAsync: sendShmoBookingEvent,
    isPending: sendShmoBookingEventIsLoading,
    isError: sendShmoBookingEventIsError,
    error: sendShmoBookingEventError,
  } = useSendShmoBookingEventMutation();

  const startFinishingShmoBooking = useCallback(async () => {
    if (activeBooking?.bookingId) {
      const startFinishingEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.START_FINISHING,
      };
      const res = await sendShmoBookingEvent({
        bookingId: activeBooking.bookingId,
        shmoBookingEvent: startFinishingEvent,
      });

      logEvent('Mobility', 'Shmo booking start finishing', {
        operatorId: activeBooking.asset.operator.id,
        bookingId: activeBooking.bookingId,
        finalAmount: res?.pricing?.finalAmount,
      });

      if (res?.state === ShmoBookingState.FINISHING) {
        photoNavigation(activeBooking?.bookingId);
      }
    }
  }, [
    activeBooking?.asset.operator.id,
    activeBooking?.bookingId,
    logEvent,
    photoNavigation,
    sendShmoBookingEvent,
  ]);

  const showEndAlert = async () => {
    Alert.alert(
      t(MobilityTexts.trip.button.end),
      t(MobilityTexts.trip.endAlert.header),

      [
        {
          text: t(MobilityTexts.trip.endAlert.continue),
          style: 'cancel',
        },
        {
          text: t(MobilityTexts.trip.endAlert.end),
          style: 'destructive',
          onPress: startFinishingShmoBooking,
        },
      ],
    );
  };

  return (
    <MapBottomSheet
      canMinimize={true}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={
        activeBooking?.asset?.propulsionType
          ? t(
              MobilityTexts.vehicleName(
                activeBooking?.asset?.formFactor ?? FormFactor.Other,
                false,
                activeBooking?.asset?.propulsionType,
              ),
            )
          : undefined
      }
      subText={activeBooking?.asset?.operator?.name}
      enablePanDownToClose={false}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
      logoIcon={
        operatorLogo ? (
          <BrandingImage logoUrl={operatorLogo} logoSize={28} rounded={true} />
        ) : (
          <TransportationIconBox mode={mode} subMode={subMode} rounded={true} />
        )
      }
      headerNode={
        activeBooking ? (
          <ShmoTripCard
            shmoBooking={activeBooking}
            isFocused={isFocusedAndActive}
            mode={mode}
            subMode={subMode}
          />
        ) : null
      }
      bottomSheetHeaderType={BottomSheetHeaderType.None}
    >
      {isShmoDeepIntegrationEnabled && (
        <>
          {isLoading && (
            <View style={styles.loading}>
              <Loading size="large" />
            </View>
          )}
          {!isLoading && !isError && activeBooking && (
            <>
              <View style={styles.container}>
                {!!activeBooking?.asset?.stateOfCharge &&
                  (activeBooking.asset.propulsionType ===
                    PropulsionType.ElectricAssist ||
                    activeBooking.asset.propulsionType ===
                      PropulsionType.Electric) && (
                    <VehicleCard
                      currentFuelPercent={
                        activeBooking.asset.stateOfCharge ?? 0
                      }
                      currentRangeMeters={
                        activeBooking.asset?.currentRangeKm
                          ? activeBooking.asset.currentRangeKm * 1000
                          : 0
                      }
                      formFactor={activeBooking.asset.formFactor ?? undefined}
                    />
                  )}
                <PriceDetailsCard
                  pricingPlan={activeBooking.pricingPlan}
                  priceAdjustments={priceAdjustments}
                  systemId={activeBooking.asset.systemId ?? ''}
                />

                <View style={styles.footer}>
                  <View style={styles.endTripWrapper}>
                    {geofencingZoneWarning && (
                      <View style={styles.geofencingZoneWarning}>
                        {geofencingZoneWarning.iconNode}
                        <View style={styles.geofencingZoneWarningText}>
                          <ThemeText typography="body__s">
                            {geofencingZoneWarning.description}
                          </ThemeText>
                        </View>
                      </View>
                    )}
                    {warningMessage && (
                      <MessageInfoText
                        type="warning"
                        message={warningMessage}
                      />
                    )}
                    {sendShmoBookingEventIsError && (
                      <MessageInfoBox
                        type="error"
                        message={formatFriendlyShmoErrorMessage(
                          sendShmoBookingEventError,
                          t,
                        )}
                      />
                    )}
                    <Button
                      mode="primary"
                      active={false}
                      disabled={sendShmoBookingEventIsLoading}
                      interactiveColor={theme.color.interactive.destructive}
                      expanded={true}
                      type="large"
                      accessibilityRole="button"
                      onPress={showEndAlert}
                      loading={sendShmoBookingEventIsLoading}
                      text={
                        sendShmoBookingEventIsLoading
                          ? t(MobilityTexts.trip.button.endLoading)
                          : t(MobilityTexts.trip.button.end)
                      }
                    />
                  </View>
                  <SupportButton navigateToSupport={navigateSupportCallback} />
                </View>
              </View>
            </>
          )}
          {!isLoading && (isError || !activeBooking) && (
            <View style={styles.footer}>
              <MessageInfoBox
                type="error"
                message={t(ScooterTexts.loadingFailed)}
              />
            </View>
          )}
        </>
      )}
    </MapBottomSheet>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    loading: {
      marginBottom: theme.spacing.medium,
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
      gap: theme.spacing.medium,
    },
    footer: {
      gap: theme.spacing.medium,
    },
    endTripWrapper: {
      gap: theme.spacing.medium,
    },
    tripWrapper: {
      marginBottom: theme.spacing.medium,
    },
    geofencingZoneWarning: {
      flexDirection: 'row',
      gap: theme.spacing.small,
      alignItems: 'center',
    },
    geofencingZoneWarningText: {
      flex: 1,
    },
  };
});
