import {Leg, TripPattern} from '@atb/api/types/trips';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  formatToClock,
  formatToShortDate,
  formatToVerboseFullDate,
  isWithinSameDate,
  secondsBetween,
} from '@atb/utils/date';
import React, {useCallback, useRef} from 'react';
import {View} from 'react-native';
import {TripSection} from './TripSection';
import {WaitDetails} from './WaitSection';
import {ServiceJourneyDeparture} from '../types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {
  getFilteredLegsByWalkOrWaitTime,
  getShouldShowLiveVehicle,
  hasShortWaitTime,
  hasShortWaitTimeAndNotGuaranteedCorrespondence,
  nextDisplayedDeparture,
  withinZoneIds,
} from '../utils';
import {isTransferInto} from '@atb/modules/trip-patterns';
import {
  CompactTravelDetailsMap,
  TravelDetailsMapScreenParams,
} from '@atb/screen-components/travel-details-map-screen';
import {useGetServiceJourneyVehiclesQuery} from '../use-get-service-journey-vehicles';
import {MapFilterType} from '@atb/modules/map';
import {
  TravelTokenTexts,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {useAccessibilityContext} from '@atb/modules/accessibility';
import {GlobalMessage} from '@atb/modules/global-messages';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {hasLegsWeCantSellTicketsFor} from '@atb/modules/operator-config';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {isDefined} from '@atb/utils/presence';
import {
  InAppReviewContext,
  useInAppReviewFlow,
} from '@atb/utils/use-in-app-review';
// eslint-disable-next-line rulesdir/navigation-only-in-screens
import {useFocusEffect} from '@react-navigation/native';
import {ErrorResponse} from '@atb-as/utils';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {SaveTripPatternButtonComponent} from '@atb/modules/experimental-store-trip-patterns';
import {useIsExperimentalEnabled} from '@atb/modules/experimental';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {TripTicketCard, TripTicketCardMode} from './TripTicketCard';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Travelcard} from '@atb/assets/svg/mono-icons/ticketing';
import {TicketingFill} from '@atb/assets/svg/mono-icons/tab-bar';

export type TripProps = {
  tripPattern: TripPattern;
  error?: ErrorResponse;
  onPressDetailsMap: (params: TravelDetailsMapScreenParams) => void;
  onPressDeparture: (
    items: ServiceJourneyDeparture[],
    activeItemIndex: number,
  ) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
  purchaseSelection?: PurchaseSelectionType;
  onPressBuyTicket: () => void;
  onPressShowTicket: () => void;
  /** No ticket card is shown when undefined */
  ticketCardMode?: TripTicketCardMode;
  ticketCardValidUntil?: Date;
  ticketCardExpiresBeforeArrival?: boolean;
  now: number;
};
export const Trip: React.FC<TripProps> = ({
  tripPattern,
  error,
  onPressDetailsMap,
  onPressDeparture,
  onPressQuay,
  purchaseSelection,
  onPressBuyTicket,
  onPressShowTicket,
  ticketCardMode,
  ticketCardValidUntil,
  ticketCardExpiresBeforeArrival,
  now,
}) => {
  const styles = useStyle();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const {isScreenReaderEnabled} = useAccessibilityContext();
  const {enable_ticketing} = useRemoteConfigContext();
  const isTripTicketCardEnabled = useIsExperimentalEnabled(
    'isTripTicketCardEnabled',
  );
  const {modesWeSellTicketsFor} = useFirestoreConfigurationContext();
  const {requestReview} = useInAppReviewFlow();
  const {mobileTokenStatus, tokens} = useMobileTokenContext();
  const inspectableTokenOnOtherDevice =
    mobileTokenStatus === 'success-not-inspectable'
      ? tokens.find((token) => token.isInspectable)
      : undefined;

  const ticketCardValidUntilTime =
    ticketCardValidUntil &&
    (isWithinSameDate(ticketCardValidUntil, new Date(now))
      ? formatToClock(ticketCardValidUntil, language, 'floor')
      : formatToShortDate(ticketCardValidUntil, language));
  const hasTicketCardValidUntilPassed =
    !!ticketCardValidUntil && ticketCardValidUntil.getTime() <= now;
  // The states that lead to buying a ticket are only shown when there is
  // something to buy.
  const shouldShowTicketCard =
    isTripTicketCardEnabled &&
    !!ticketCardMode &&
    (ticketCardMode === 'valid' ||
      ticketCardMode === 'activate' ||
      !!purchaseSelection);
  // A ticket that can't be inspected on this device is the bigger problem, so
  // where the ticket is replaces the rest of the card when the user has one.
  const ticketOnOtherDeviceContent =
    inspectableTokenOnOtherDevice &&
    (ticketCardMode === 'valid' || ticketCardMode === 'activate')
      ? {
          icon:
            inspectableTokenOnOtherDevice.type === 'travel-card'
              ? {svg: Travelcard, color: 'valid'}
              : {svg: Phone, color: theme.color.foreground.dynamic.primary},
          message:
            inspectableTokenOnOtherDevice.type === 'travel-card'
              ? t(TripDetailsTexts.trip.ticketCard.ticketOnTravelCard)
              : t(
                  TripDetailsTexts.trip.ticketCard.ticketOnDevice(
                    inspectableTokenOnOtherDevice.name ||
                      t(TravelTokenTexts.toggleToken.unnamedDevice),
                  ),
                ),
          actionText: t(TripDetailsTexts.trip.ticketCard.showShort),
          onPress: onPressShowTicket,
        }
      : undefined;
  const ticketCardContent =
    ticketCardMode &&
    {
      valid: {
        message: t(
          ticketCardExpiresBeforeArrival
            ? TripDetailsTexts.trip.ticketCard.expiresBeforeArrivalMessage
            : TripDetailsTexts.trip.ticketCard.validMessage,
        ),
        actionText: t(TripDetailsTexts.trip.ticketCard.showTicket),
        onPress: onPressShowTicket,
      },
      activate: {
        icon: {
          svg: TicketingFill,
          color: theme.color.foreground.dark.disabled,
        },
        message: t(TripDetailsTexts.trip.ticketCard.activateMessage),
        actionText: t(TripDetailsTexts.trip.ticketCard.showShort),
        onPress: onPressShowTicket,
      },
      expired: {
        message: t(
          hasTicketCardValidUntilPassed
            ? TripDetailsTexts.trip.ticketCard.expiredMessage
            : TripDetailsTexts.trip.ticketCard.expiresBeforeNextBoardingMessage,
        ),
        actionText: t(TripDetailsTexts.trip.ticketCard.buyTicket),
        onPress: onPressBuyTicket,
      },
      invalid: {
        message: t(TripDetailsTexts.trip.ticketCard.invalidMessage),
        actionText: t(TripDetailsTexts.trip.ticketCard.buyTicket),
        onPress: onPressBuyTicket,
      },
    }[ticketCardMode];
  const getTicketCardDetailText = () => {
    switch (ticketCardMode) {
      case 'valid':
      case 'activate':
        if (
          ticketCardMode === 'valid' &&
          ticketCardExpiresBeforeArrival &&
          ticketCardValidUntilTime
        ) {
          return t(
            TripDetailsTexts.trip.ticketCard.validUntil(
              ticketCardValidUntilTime,
            ),
          );
        }
        return undefined;
      case 'expired':
        if (!ticketCardValidUntilTime) return undefined;
        return t(
          hasTicketCardValidUntilPassed
            ? TripDetailsTexts.trip.ticketCard.expiredAt(
                ticketCardValidUntilTime,
              )
            : TripDetailsTexts.trip.ticketCard.validUntil(
                ticketCardValidUntilTime,
              ),
        );
      default:
        return undefined;
    }
  };
  const ticketCardDetailText = getTicketCardDetailText();

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);

  const isFocusedAndActive = useIsFocusedAndActive();

  const liveVehicleIds = tripPattern.legs
    .filter((leg) => getShouldShowLiveVehicle(leg.serviceJourneyEstimatedCalls))
    .map((leg) => leg.serviceJourney?.id)
    .filter(isDefined);
  const {data: vehiclePositions} = useGetServiceJourneyVehiclesQuery(
    liveVehicleIds,
    isFocusedAndActive,
  );
  const hasLiveVehicle = (vehiclePositions?.length ?? 0) > 0;

  const tripPatternLegs = tripPattern?.legs;

  const mapFilter: MapFilterType = {
    mobility: {
      [FormFactor.Bicycle]: {
        showAll: tripPatternLegs.some((leg) => leg.rentedBike),
        operators: [],
      },
    },
    showFareZones: false,
  };

  const shouldShowDate =
    !isWithinSameDate(new Date(), tripPattern.expectedStartTime) ||
    isScreenReaderEnabled;

  const containingZones = withinZoneIds(tripPattern.legs);
  const shortWaitTimeAndNotGuaranteedCorrespondence =
    hasShortWaitTimeAndNotGuaranteedCorrespondence(tripPattern.legs);
  const shortWaitTime = hasShortWaitTime(tripPattern.legs);
  const tripHasLegsWeCantSellTicketsFor = hasLegsWeCantSellTicketsFor(
    tripPattern,
    modesWeSellTicketsFor,
  );

  const shouldShowRequestReview = useRef(false);

  // eslint-disable-next-line rulesdir/navigation-only-in-screens
  useFocusEffect(
    useCallback(() => {
      if (shouldShowRequestReview.current) {
        requestReview(InAppReviewContext.TripDetails);
        shouldShowRequestReview.current = false;
      }
    }, [requestReview]),
  );

  return (
    <View style={styles.container}>
      {!isScreenReaderEnabled && tripPatternLegs && (
        <CompactTravelDetailsMap
          serviceJourneyPolylines={tripPatternLegs}
          fromPlace={tripPatternLegs[0]?.fromPlace}
          toPlace={tripPatternLegs[tripPatternLegs.length - 1].toPlace}
          isLive={hasLiveVehicle}
          buttonText={t(
            hasLiveVehicle
              ? TripDetailsTexts.trip.summary.followTripInMap.label
              : TripDetailsTexts.trip.summary.showTripInMap.label,
          )}
          onExpand={() => {
            shouldShowRequestReview.current = true;
            onPressDetailsMap({
              serviceJourneyPolylines: tripPatternLegs,
              fromPlace: tripPatternLegs[0]?.fromPlace,
              toPlace: tripPatternLegs[tripPatternLegs.length - 1].toPlace,
              vehicles: vehiclePositions?.map((vehicleWithPosition) => {
                const leg = tripPatternLegs.find(
                  (l) =>
                    l.serviceJourney?.id ===
                    vehicleWithPosition.serviceJourney?.id,
                );
                return {
                  vehicleWithPosition,
                  mode: leg?.mode,
                  subMode: leg?.transportSubmode,
                };
              }),
              mapFilter,
            });
          }}
        />
      )}
      {shouldShowDate && (
        <>
          <ThemeText typography="body__s" type="secondary" style={styles.date}>
            {formatToVerboseFullDate(tripPattern.expectedStartTime, language)}
          </ThemeText>
        </>
      )}
      {shouldShowTicketCard && ticketCardContent && (
        <TripTicketCard
          mode={ticketCardMode}
          {...(ticketOnOtherDeviceContent ?? {
            ...ticketCardContent,
            detailText: ticketCardDetailText,
          })}
        />
      )}
      {shortWaitTime && (
        <MessageInfoBox
          type="info"
          message={[
            t(TripDetailsTexts.messages.shortTime),
            shortWaitTimeAndNotGuaranteedCorrespondence
              ? t(TripDetailsTexts.messages.correspondenceNotGuaranteed)
              : '',
          ].join(' ')}
        />
      )}
      <GlobalMessage
        globalMessageContext={GlobalMessageContextEnum.appTripDetails}
        textColor={theme.color.background.neutral[0]}
        ruleVariables={{
          ticketingEnabled: enable_ticketing,
          hasLegsWeCantSellTicketsFor: tripHasLegsWeCantSellTicketsFor,
          modes: tripPattern.legs.map((l) => l.mode),
          subModes: tripPattern.legs
            .map((l) => l.transportSubmode)
            .filter(isDefined),
          withinZoneIds: containingZones,
          publicCodes: tripPattern.legs
            .map((l) => l.line?.publicCode)
            .filter(isDefined),
        }}
      />
      {error && isNetworkError(error) && (
        <>
          <ScreenReaderAnnouncement
            message={t(TripDetailsTexts.messages.errorNetwork)}
          />
          <MessageInfoBox
            type="warning"
            message={t(TripDetailsTexts.messages.errorNetwork)}
          />
        </>
      )}
      {tripPattern.status === 'stale' && (
        <MessageInfoBox
          type="warning"
          message={t(TripDetailsTexts.messages.errorDefault)}
        />
      )}
      <View style={styles.trip}>
        {tripPattern &&
          filteredLegs.map((leg, index) => {
            return (
              <TripSection
                key={index}
                isFirst={index == 0}
                wait={legWaitDetails(index, filteredLegs)}
                isLast={index == filteredLegs.length - 1}
                step={index + 1}
                leg={leg}
                nextLegStartTime={nextDisplayedDeparture(filteredLegs, index)}
                testID={'leg' + index}
                onPressDeparture={onPressDeparture}
                onPressQuay={onPressQuay}
              />
            );
          })}
      </View>
      <SaveTripPatternButtonComponent tripPattern={tripPattern} now={now} />
    </View>
  );
};

function legWaitDetails(index: number, legs: Leg[]): WaitDetails | undefined {
  const current = legs[index];
  const next = legs[index + 1];

  if (current && next) {
    const waitTimeInSeconds = secondsBetween(
      current.expectedEndTime,
      next.expectedStartTime,
    );

    const mustWaitForNextLeg = isTransferInto(legs, index + 1)
      ? waitTimeInSeconds >= 0
      : waitTimeInSeconds > 0;
    return {
      mustWaitForNextLeg,
      waitTimeInSeconds,
      // The BFF stamps the risk on the leg you might miss, which is the one
      // this wait leads into. Transit legs are never filtered out, so the
      // warning survives `getFilteredLegsByWalkOrWaitTime`.
      transferRisk: next.transferRisk,
    };
  }
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.medium,
  },
  date: {
    textAlign: 'center',
  },
  trip: {
    marginTop: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
    paddingBottom: theme.spacing.large,
    rowGap: theme.spacing.large,
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.regular,
  },
}));

function isNetworkError(error: ErrorResponse): boolean {
  return error.kind === 'AXIOS_NETWORK_ERROR' || error.kind === 'AXIOS_TIMEOUT';
}
