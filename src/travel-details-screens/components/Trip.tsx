import {Leg, TripPattern} from '@atb/api/types/trips';
import {Feedback} from '@atb/components/feedback';
import {StyleSheet} from '@atb/theme';
import {
  formatToVerboseFullDate,
  isWithinSameDate,
  secondsBetween,
} from '@atb/utils/date';
import {AxiosError} from 'axios';
import React from 'react';
import {View} from 'react-native';
import {getPlaceName, InterchangeDetails, TripSection} from './TripSection';
import {TripSummary} from './TripSummary';
import {WaitDetails} from './WaitSection';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {
  getFilteredLegsByWalkOrWaitTime,
  getShouldShowLiveVehicle,
  hasShortWaitTime,
  hasShortWaitTimeAndNotGuaranteedCorrespondence,
  withinZoneIds,
} from '@atb/travel-details-screens/utils';
import {
  CompactTravelDetailsMap,
  TravelDetailsMapScreenParams,
} from '@atb/travel-details-map-screen';
import {useGetServiceJourneyVehicles} from '@atb/travel-details-screens/use-get-service-journey-vehicles';
import {MapFilterType, useRealtimeMapEnabled} from '@atb/components/map';
import {Divider} from '@atb/components/divider';
import {
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {ServiceJourneyMapInfoData_v3} from '@atb/api/types/serviceJourney';
import {GlobalMessage, GlobalMessageContextEnum} from '@atb/global-messages';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {hasLegsWeCantSellTicketsFor} from '@atb/operator-config';
import {useFirestoreConfiguration} from '@atb/configuration';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {getAxiosErrorType} from '@atb/api/utils';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {isDefined} from '@atb/utils/presence';

export type TripProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
  onPressDetailsMap: (params: TravelDetailsMapScreenParams) => void;
  onPressDeparture: (
    items: ServiceJourneyDeparture[],
    activeItemIndex: number,
  ) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
};
export const Trip: React.FC<TripProps> = ({
  tripPattern,
  error,
  onPressDetailsMap,
  onPressDeparture,
  onPressQuay,
}) => {
  const styles = useStyle();
  const {t, language} = useTranslation();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const {enable_ticketing} = useRemoteConfig();
  const {modesWeSellTicketsFor} = useFirestoreConfiguration();

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);

  const realtimeMapEnabled = useRealtimeMapEnabled();

  const liveVehicleIds = tripPattern.legs
    .filter((leg) =>
      getShouldShowLiveVehicle(
        leg.serviceJourneyEstimatedCalls,
        realtimeMapEnabled,
      ),
    )
    .map((leg) => leg.serviceJourney?.id)
    .filter(isDefined);
  const {vehiclePositions} = useGetServiceJourneyVehicles(liveVehicleIds);

  const tripPatternLegs = tripPattern?.legs;

  const mapFilter: MapFilterType = {
    mobility: {
      [FormFactor.Bicycle]: {
        showAll: tripPatternLegs.some((leg) => leg.rentedBike),
        operators: [],
      },
    },
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

  return (
    <View style={styles.container}>
      {shouldShowDate && (
        <>
          <View style={styles.date}>
            <ThemeText type="body__secondary" color="secondary">
              {formatToVerboseFullDate(tripPattern.expectedStartTime, language)}
            </ThemeText>
          </View>
          <Divider style={styles.divider} />
        </>
      )}
      {shortWaitTime && (
        <MessageInfoBox
          style={styles.messageBox}
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
        style={styles.messageBox}
        textColor="background_0"
        ruleVariables={{
          ticketingEnabled: enable_ticketing,
          hasLegsWeCantSellTicketsFor: tripHasLegsWeCantSellTicketsFor,
          modes: tripPattern.legs.map((l) => l.mode),
          withinZoneIds: containingZones,
        }}
      />
      {error && (
        <>
          <ScreenReaderAnnouncement message={translatedError(error, t)} />
          <MessageInfoBox
            style={styles.messageBox}
            type="warning"
            message={translatedError(error, t)}
          />
        </>
      )}
      <View style={styles.trip}>
        {tripPattern &&
          filteredLegs.map((leg, index) => {
            const legVehiclePosition = vehiclePositions?.find(
              (vehicle) =>
                vehicle.serviceJourney?.id === leg.serviceJourney?.id,
            );

            return (
              <TripSection
                key={index}
                isFirst={index == 0}
                wait={legWaitDetails(index, filteredLegs)}
                isLast={index == filteredLegs.length - 1}
                step={index + 1}
                interchangeDetails={getInterchangeDetails(
                  filteredLegs,
                  leg.interchangeTo?.toServiceJourney?.id,
                )}
                leg={leg}
                testID={'legContainer' + index}
                onPressShowLive={
                  legVehiclePosition
                    ? (mapData: ServiceJourneyMapInfoData_v3) =>
                        onPressDetailsMap({
                          legs: mapData.mapLegs,
                          fromPlace: mapData.start,
                          toPlace: mapData.stop,
                          vehicleWithPosition: legVehiclePosition,
                          mode: leg.mode,
                          subMode: leg.transportSubmode,
                        })
                    : undefined
                }
                onPressDeparture={onPressDeparture}
                onPressQuay={onPressQuay}
              />
            );
          })}
      </View>
      <Divider style={styles.divider} />
      {tripPatternLegs && (
        <CompactTravelDetailsMap
          mapLegs={tripPatternLegs}
          fromPlace={tripPatternLegs[0]?.fromPlace}
          toPlace={tripPatternLegs[tripPatternLegs.length - 1].toPlace}
          buttonText={t(TripDetailsTexts.trip.summary.showTripInMap.label)}
          onExpand={() => {
            onPressDetailsMap({
              legs: tripPatternLegs,
              fromPlace: tripPatternLegs[0]?.fromPlace,
              toPlace: tripPatternLegs[tripPatternLegs.length - 1].toPlace,
              mapFilter,
            });
          }}
        />
      )}
      <TripSummary {...tripPattern} />
      <Feedback metadata={tripPattern} viewContext="assistant" />
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

    const mustWaitForNextLeg = waitTimeInSeconds > 0;
    return {mustWaitForNextLeg, waitTimeInSeconds};
  }
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginTop: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  date: {
    alignItems: 'center',
    marginBottom: theme.spacings.medium,
  },
  divider: {
    marginBottom: theme.spacings.medium,
  },
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  trip: {
    marginTop: theme.spacings.medium,
    marginBottom: theme.spacings.xSmall,
  },
}));

function getInterchangeDetails(
  legs: Leg[],
  id: string | undefined,
): InterchangeDetails | undefined {
  if (!id) return undefined;
  const interchangeLeg = legs.find(
    (leg) => leg.line && leg.serviceJourney?.id === id,
  );

  if (interchangeLeg?.line?.publicCode) {
    return {
      publicCode: interchangeLeg.line.publicCode,
      fromPlace: getPlaceName(interchangeLeg.fromPlace),
    };
  }
  return undefined;
}
function translatedError(error: AxiosError, t: TranslateFunction): string {
  const errorType = getAxiosErrorType(error);
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return t(TripDetailsTexts.messages.errorNetwork);
    default:
      return t(TripDetailsTexts.messages.errorDefault);
  }
}
