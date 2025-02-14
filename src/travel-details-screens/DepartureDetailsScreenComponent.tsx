import {QuayFragment} from '@atb/api/types/generated/fragments/quays';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {Map} from '@atb/assets/svg/mono-icons/map';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {FullScreenView} from '@atb/components/screen-view';
import {AccessibleText, ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {CancelledDepartureMessage} from '@atb/travel-details-screens/components/CancelledDepartureMessage';
import {SituationMessageBox} from '@atb/modules/situations';
import {useGetServiceJourneyVehiclesQuery} from '@atb/travel-details-screens/use-get-service-journey-vehicles';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  DepartureDetailsTexts,
  DeparturesTexts,
  FavoriteDeparturesTexts,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';
import {animateNextChange} from '@atb/utils/animation';
import {
  formatToVerboseFullDate,
  isInThePast,
  isWithinSameDate,
} from '@atb/utils/date';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';
import React, {RefObject, useCallback, useRef, useState} from 'react';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {ActivityIndicator, View} from 'react-native';
import {Time} from './components/Time';
import {TripLegDecoration} from './components/TripLegDecoration';
import {TripRow} from './components/TripRow';
import {ServiceJourneyDeparture} from './types';
import {
  EstimatedCallWithMetadata,
  useDepartureData,
} from './use-departure-data';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {PaginatedDetailsHeader} from '@atb/travel-details-screens/components/PaginatedDetailsHeader';
import {useRealtimeText} from '@atb/travel-details-screens/use-realtime-text';
import {Divider} from '@atb/components/divider';
import {useMapData} from '@atb/travel-details-screens/use-map-data';
import {useAnalyticsContext} from '@atb/analytics';
import {VehicleStatusEnumeration} from '@atb/api/types/generated/vehicles-types_v1';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {canSellTicketsForSubMode} from '@atb/operator-config';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {
  getBookingStatus,
  getLineAndTimeA11yLabel,
  getShouldShowLiveVehicle,
} from '@atb/travel-details-screens/utils';
import {BookingOptions} from '@atb/travel-details-screens/components/BookingOptions';
import {BookingInfoBox} from '@atb/travel-details-screens/components/BookingInfoBox';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {usePreferencesContext} from '@atb/preferences';
import {DepartureTime, LineChip} from '@atb/components/estimated-call';
import {useOnMarkFavouriteDepartures} from '@atb/favorites';
import {getFavoriteIcon} from '@atb/favorites';
import type {LineFragment} from '@atb/api/types/generated/fragments/lines';
import type {FavouriteDepartureLine} from '@atb/favorites/use-on-mark-favourite-departures';
import {useInAppReviewFlow} from '@atb/utils/use-in-app-review';
import {useFocusEffect} from '@react-navigation/native';

export type DepartureDetailsScreenParams = {
  items: ServiceJourneyDeparture[];
  activeItemIndex: number;
};

type Props = DepartureDetailsScreenParams & {
  onPressDetailsMap: (params: TravelDetailsMapScreenParams) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
  onPressTravelAid: () => void;
};

export const DepartureDetailsScreenComponent = ({
  items,
  activeItemIndex,
  onPressDetailsMap,
  onPressQuay,
  onPressTravelAid,
}: Props) => {
  const [activeItemIndexState, setActiveItem] = useState(activeItemIndex);
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[1];
  const ctaColor = theme.color.interactive[0];
  const backgroundColor = theme.color.background.neutral[0];
  const themeColor = theme.color.background.accent[0];

  const analytics = useAnalyticsContext();
  const {enable_ticketing} = useRemoteConfigContext();
  const {modesWeSellTicketsFor} = useFirestoreConfigurationContext();

  const activeItem = items[activeItemIndexState];
  const hasMultipleItems = items.length > 1;

  const styles = useStopsStyle();
  const {t, language} = useTranslation();

  const {requestReview} = useInAppReviewFlow();

  const [
    {
      estimatedCallsWithMetadata,
      title,
      publicCode,
      mode,
      subMode,
      situations,
      notices,
      line,
    },
    isLoading,
  ] = useDepartureData(activeItem, 20);

  const fromCall = estimatedCallsWithMetadata.find(
    (c) => c.stopPositionInPattern === activeItem.fromStopPosition,
  );
  const toCall = estimatedCallsWithMetadata.find(
    (c) => c.stopPositionInPattern === activeItem.toStopPosition,
  );

  const mapData = useMapData(
    activeItem.serviceJourneyId,
    fromCall?.quay.id,
    toCall?.quay.id,
  );

  const {isRealtimeMapEnabled, isTravelAidEnabled} = useFeatureTogglesContext();
  const screenReaderEnabled = useIsScreenReaderEnabled();

  const {
    preferences: {journeyAidEnabled: travelAidPreferenceEnabled},
  } = usePreferencesContext();
  const shouldShowTravelAid =
    travelAidPreferenceEnabled &&
    isTravelAidEnabled &&
    !activeItem.isTripCancelled;

  const shouldShowLive = getShouldShowLiveVehicle(
    estimatedCallsWithMetadata,
    isRealtimeMapEnabled,
  );

  const {data: vehiclePositions} = useGetServiceJourneyVehiclesQuery(
    [activeItem.serviceJourneyId],
    shouldShowLive,
  );

  const translatedModeName = getTranslatedModeName(mode);

  const vehiclePosition = vehiclePositions?.find(
    (s) => s.serviceJourney?.id === activeItem.serviceJourneyId,
  );

  const realtimeText = useRealtimeText(estimatedCallsWithMetadata);

  const isJourneyFinished =
    vehiclePosition?.vehicleStatus === VehicleStatusEnumeration.Completed ||
    estimatedCallsWithMetadata.every((e) => e.actualArrivalTime);

  const shouldShowDepartureTime =
    (fromCall && !isInThePast(fromCall.expectedDepartureTime)) || false;

  const canSellTicketsForDeparture = canSellTicketsForSubMode(
    subMode,
    modesWeSellTicketsFor,
  );

  const onPaginationPress = (newPage: number) => {
    animateNextChange();
    setActiveItem(newPage - 1);
  };

  const alreadyShownSituationNumbers = situations
    .map((s) => s.situationNumber)
    .filter((s): s is string => !!s);

  const shouldShowMapButton =
    mapData &&
    !screenReaderEnabled &&
    !isLoading &&
    estimatedCallsWithMetadata.length > 0 &&
    !isJourneyFinished;
  const shouldShowFavoriteButton = !!fromCall && !!line;
  const shouldShowButtonsRow = shouldShowMapButton || shouldShowFavoriteButton;

  const a11yLabel =
    fromCall && publicCode
      ? getLineAndTimeA11yLabel(fromCall, publicCode, t, language)
      : undefined;
  const lineChipServiceJourney = {
    line: {publicCode},
    transportMode: mode,
    transportSubmode: subMode,
  };

  const handleTravelAidPress = () => {
    analytics.logEvent('Journey aid', 'Open journey aid clicked', {
      screenReaderEnabled,
    });
    onPressTravelAid();
  };

  const shouldShowRequestReview = useRef(false);

  const handleMapButtonPress = () => {
    if (!mapData) return;
    if (vehiclePosition) {
      analytics.logEvent('Departure details', 'See live bus clicked', {
        fromPlace: mapData.start,
        toPlace: mapData?.stop,
        mode: mode,
        subMode: subMode,
      });
    }
    shouldShowRequestReview.current = true;
    onPressDetailsMap({
      legs: mapData.mapLegs,
      fromPlace: mapData.start,
      toPlace: mapData.stop,
      vehicleWithPosition: vehiclePosition,
      mode: mode,
      subMode: subMode,
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (shouldShowRequestReview.current) {
        shouldShowLive && requestReview();
        shouldShowRequestReview.current = false;
      }
    }, [requestReview, shouldShowLive]),
  );

  return (
    <View style={styles.container}>
      <FullScreenView
        headerProps={{
          leftButton: {type: 'back', withIcon: true},
          title: t(DepartureDetailsTexts.header.alternateTitle),
        }}
        parallaxContent={(focusRef) => (
          <View style={styles.parallaxContent}>
            <View
              style={styles.headerContainer}
              ref={focusRef}
              accessible={true}
              accessibilityLabel={a11yLabel}
            >
              <LineChip serviceJourney={lineChipServiceJourney} />
              <ThemeText
                typography="heading__title"
                color={themeColor}
                style={styles.headerTitle}
                testID="lineName"
              >
                {title ?? t(DepartureDetailsTexts.header.notFound)}
              </ThemeText>
              {fromCall && shouldShowDepartureTime && (
                <DepartureTime departure={fromCall} color={themeColor} />
              )}
            </View>
            {shouldShowTravelAid && (
              <Button
                expanded={true}
                style={styles.travelAidButton}
                onPress={handleTravelAidPress}
                text={t(DepartureDetailsTexts.header.journeyAid)}
                interactiveColor={ctaColor}
                testID="journeyAidButton"
              />
            )}
            {shouldShowButtonsRow && (
              <View style={styles.actionButtons}>
                {shouldShowFavoriteButton && (
                  <FavoriteButton fromCall={fromCall} line={line} />
                )}
                {shouldShowMapButton && (
                  <View style={{flex: 1}}>
                    <Button
                      type="small"
                      expanded={true}
                      leftIcon={{svg: Map}}
                      text={t(
                        vehiclePosition
                          ? DepartureDetailsTexts.live(t(translatedModeName))
                          : DepartureDetailsTexts.map,
                      )}
                      interactiveColor={interactiveColor}
                      onPress={handleMapButtonPress}
                    />
                  </View>
                )}
              </View>
            )}
            {realtimeText && !activeItem.isTripCancelled && (
              <View style={styles.headerSubSection}>
                <LastPassedStop realtimeText={realtimeText} />
              </View>
            )}
          </View>
        )}
      >
        <View
          style={styles.scrollView__content}
          testID="departureDetailsContentView"
        >
          {screenReaderEnabled ? ( // Let users navigate other departures if screen reader is enabled
            activeItem ? (
              <PaginatedDetailsHeader
                page={activeItemIndexState + 1}
                totalPages={items.length}
                onNavigate={onPaginationPress}
                showPagination={hasMultipleItems}
                currentDate={activeItem?.date}
                isTripCancelled={activeItem?.isTripCancelled}
              />
            ) : (
              <MessageInfoBox
                type="error"
                message={t(DepartureDetailsTexts.messages.noActiveItem)}
              />
            )
          ) : !isWithinSameDate(new Date(), activeItem.date) ? (
            <>
              <View style={styles.date}>
                <ThemeText typography="body__primary" color="secondary">
                  {formatToVerboseFullDate(activeItem.date, language)}
                </ThemeText>
              </View>
              <Divider style={styles.border} />
            </>
          ) : null}

          {subMode === TransportSubmode.RailReplacementBus && (
            <MessageInfoBox
              type="warning"
              message={t(
                TripDetailsTexts.messages.departureIsRailReplacementBus,
              )}
              style={styles.messageBox}
            />
          )}

          {activeItem?.isTripCancelled && <CancelledDepartureMessage />}

          {situations.map((situation) => (
            <SituationMessageBox
              key={situation.id}
              situation={situation}
              style={styles.messageBox}
            />
          ))}

          {notices.map(
            (notice) =>
              notice.text && (
                <MessageInfoBox
                  type="info"
                  message={notice.text}
                  style={styles.messageBox}
                />
              ),
          )}

          {isLoading && (
            <View>
              <ActivityIndicator
                color={theme.color.foreground.dynamic.primary}
                style={styles.spinner}
                animating={true}
                size="large"
              />
              <ScreenReaderAnnouncement
                message={t(DepartureDetailsTexts.messages.loading)}
              />
            </View>
          )}

          <GlobalMessage
            globalMessageContext={GlobalMessageContextEnum.appDepartureDetails}
            ruleVariables={{
              ticketingEnabled: enable_ticketing,
              canSellTicketsForDeparture: canSellTicketsForDeparture,
              mode: mode || null,
              subMode: subMode || null,
              fromZones:
                fromCall?.quay?.tariffZones.map((zone) => zone.id) || null,
              toZones: toCall?.quay?.tariffZones.map((zone) => zone.id) || null,
            }}
            style={styles.messageBox}
            textColor={backgroundColor}
          />

          <EstimatedCallRows
            calls={estimatedCallsWithMetadata}
            mode={mode}
            subMode={subMode}
            toStopPosition={activeItem.toStopPosition}
            alreadyShownSituationNumbers={alreadyShownSituationNumbers}
            onPressQuay={onPressQuay}
          />
        </View>
      </FullScreenView>
    </View>
  );
};

function LastPassedStop({realtimeText}: {realtimeText: string}) {
  const styles = useStopsStyle();
  const {theme} = useThemeContext();
  const themeColor = theme.color.background.accent[0];

  return (
    <View style={styles.passedSection}>
      <ThemeText
        typography="body__secondary"
        color={themeColor}
        style={styles.passedText}
      >
        {realtimeText}
      </ThemeText>
    </View>
  );
}

type CallGroupProps = {
  calls: EstimatedCallWithMetadata[];
  mode?: TransportMode;
  subMode?: TransportSubmode;
  toStopPosition?: number;
  alreadyShownSituationNumbers: string[];
  onPressQuay: Props['onPressQuay'];
};

function EstimatedCallRows({
  calls,
  mode,
  subMode,
  toStopPosition,
  alreadyShownSituationNumbers,
  onPressQuay,
}: CallGroupProps) {
  const styles = useStopsStyle();
  const passedCalls = calls.filter((c) => c.metadata.group === 'passed');
  const showCollapsable = passedCalls.length > 1;
  const {t} = useTranslation();
  const [collapsed, setCollapsed] = useState(true);

  if (!calls?.length) {
    return null;
  }

  const collapsePress = (c: boolean) => {
    animateNextChange();
    setCollapsed(c);
  };

  const estimatedCallsToShow = collapsed
    ? calls.filter((c, i) => i === 0 || c.metadata.group !== 'passed')
    : calls;

  const collapseButton = showCollapsable ? (
    <CollapseButtonRow
      collapsed={collapsed}
      setCollapsed={collapsePress}
      label={t(DepartureDetailsTexts.collapse.label(passedCalls.length - 1))}
      testID="intermediateStops"
    />
  ) : null;

  return (
    <View style={styles.estimatedCallRows}>
      {estimatedCallsToShow.map((call) => (
        <EstimatedCallRow
          key={call.stopPositionInPattern}
          call={call}
          mode={mode}
          subMode={subMode}
          collapseButton={
            call.metadata.isStartOfServiceJourney ? collapseButton : null
          }
          situations={getSituationsToShowForCall(
            call,
            alreadyShownSituationNumbers,
            toStopPosition,
          )}
          onPressQuay={onPressQuay}
        />
      ))}
    </View>
  );
}

/**
 * Get the situations to show for an estimated call. Based on the following
 * rules:
 * - We don't show situations on passed calls or calls which are after the trip
 * - We don't show situations which are already shown at the top, above the
 *   service journey
 * - If the trip have an end quay we only show situations on the end quay of the
 *   trip, or else we show situations on all intermediate quays on the trip
 */
const getSituationsToShowForCall = (
  {situations, metadata: {group, isEndOfGroup}}: EstimatedCallWithMetadata,
  alreadyShownSituationNumbers: string[],
  toStopPosition?: number,
) => {
  if (group === 'passed' || group === 'after') return [];
  if (toStopPosition && !isEndOfGroup) return [];
  return situations.filter(
    (s) =>
      !s.situationNumber ||
      !alreadyShownSituationNumbers.includes(s.situationNumber),
  );
};

type TripItemProps = {
  call: EstimatedCallWithMetadata;
  mode: TransportMode | undefined;
  subMode: TransportSubmode | undefined;
  collapseButton: JSX.Element | null;
  situations: SituationFragment[];
  onPressQuay: Props['onPressQuay'];
};

function EstimatedCallRow({
  call,
  mode,
  subMode,
  collapseButton,
  situations,
  onPressQuay,
}: TripItemProps) {
  const {t} = useTranslation();
  const styles = useStopsStyle();

  const {group, isStartOfGroup, isEndOfGroup, isStartOfServiceJourney} =
    call.metadata;
  const isStartOfTripGroup = group === 'trip' && isStartOfGroup;

  const isBetween = !isStartOfGroup && !isEndOfGroup;
  const tripLegDecorationColor = useTransportColor(
    group === 'trip' ? mode : undefined,
    subMode,
  ).secondary.background;

  const {flex_booking_number_of_days_available} = useRemoteConfigContext();
  const bookingStatus = getBookingStatus(
    call.bookingArrangements,
    call.aimedDepartureTime,
    Date.now(),
    flex_booking_number_of_days_available,
  );

  return (
    <View style={[styles.place, isStartOfGroup && styles.startPlace]}>
      <TripLegDecoration
        hasStart={isStartOfGroup}
        hasCenter={isBetween}
        hasEnd={isEndOfGroup}
        color={tripLegDecorationColor}
      />
      <TripRow
        rowLabel={
          <Time
            timeValues={{
              aimedTime: call.aimedDepartureTime,
              expectedTime: call.expectedDepartureTime,
              missingRealTime: !call.realtime && isStartOfServiceJourney,
            }}
            roundingMethod="floor"
          />
        }
        alignChildren={
          isStartOfGroup ? 'flex-start' : isEndOfGroup ? 'flex-end' : 'center'
        }
        style={[styles.row, isBetween && styles.middleRow]}
        onPress={() => handleQuayPress(call.quay)}
        testID={'legType_' + group}
      >
        <ThemeText testID="quayName">{getQuayName(call.quay)}</ThemeText>
        {!call.forAlighting && !call.metadata.isStartOfServiceJourney && (
          <AccessibleText
            typography="body__secondary"
            color="secondary"
            style={styles.boardingInfo}
            pause="before"
          >
            {t(DepartureDetailsTexts.messages.noAlighting)}
          </AccessibleText>
        )}
        {!call.forBoarding && !call.metadata.isEndOfServiceJourney && (
          <AccessibleText
            typography="body__secondary"
            color="secondary"
            style={styles.boardingInfo}
            pause="before"
          >
            {t(DepartureDetailsTexts.messages.noBoarding)}
          </AccessibleText>
        )}
      </TripRow>
      {situations.map((situation) => (
        <TripRow
          key={situation.situationNumber}
          style={styles.situationTripRow}
        >
          <SituationMessageBox situation={situation} />
        </TripRow>
      ))}

      {isStartOfTripGroup && bookingStatus !== 'none' && (
        <TripRow accessible={false}>
          <BookingInfoBox
            bookingArrangements={call.bookingArrangements}
            aimedStartTime={call.aimedDepartureTime}
            now={Date.now()}
          />
        </TripRow>
      )}

      {isStartOfTripGroup &&
        !call.cancellation &&
        bookingStatus === 'bookable' && (
          <TripRow accessible={false}>
            <BookingOptions bookingArrangements={call.bookingArrangements} />
          </TripRow>
        )}

      {collapseButton}
    </View>
  );

  async function handleQuayPress(quay: QuayFragment | undefined) {
    const stopPlace = quay?.stopPlace;
    if (!stopPlace) return;

    onPressQuay(stopPlace, quay.id);
  }
}

type CollapseButtonRowProps = {
  label: string;
  collapsed: boolean;
  setCollapsed(collapsed: boolean): void;
  testID?: string;
};

function CollapseButtonRow({
  label,
  collapsed,
  setCollapsed,
  testID,
}: CollapseButtonRowProps) {
  const styles = useCollapseButtonStyle();
  const text = (
    <ThemeText color="secondary" style={styles.text}>
      {label}
    </ThemeText>
  );
  const child = collapsed ? (
    <>
      {text}
      <ThemeIcon svg={ExpandMore} />
    </>
  ) : (
    <>
      {text}
      <ThemeIcon svg={ExpandLess} />
    </>
  );
  return (
    <PressableOpacity
      accessibilityRole="button"
      onPress={() => setCollapsed(!collapsed)}
      testID={testID}
      style={styles.container}
    >
      {child}
    </PressableOpacity>
  );
}

const FavoriteButton = ({
  fromCall,
  line,
}: {
  fromCall: EstimatedCallWithMetadata;
  line: LineFragment;
}) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const analytics = useAnalyticsContext();
  const {onMarkFavourite, getExistingFavorite} = useOnMarkFavouriteDepartures(
    fromCall.quay,
    false,
  );
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const favouriteDepartureLine: FavouriteDepartureLine = {
    id: line.id,
    transportMode: line.transportMode,
    transportSubmode: line.transportSubmode,
    lineNumber: line.publicCode,
    destinationDisplay: fromCall.destinationDisplay,
  };
  const existingFavorite = getExistingFavorite(favouriteDepartureLine);

  return (
    <Button
      type="small"
      expanded={false}
      leftIcon={{svg: getFavoriteIcon(existingFavorite)}}
      text={t(FavoriteDeparturesTexts.favoriteButton)}
      interactiveColor={theme.color.interactive['1']}
      accessibilityLabel={
        existingFavorite &&
        (existingFavorite.destinationDisplay
          ? t(DeparturesTexts.favorites.favoriteButton.oneVariation)
          : t(DeparturesTexts.favorites.favoriteButton.allVariations))
      }
      accessibilityHint={
        !!existingFavorite
          ? t(FavoriteDeparturesTexts.favoriteItemDelete.a11yHint)
          : t(FavoriteDeparturesTexts.favoriteItemAdd.a11yHint)
      }
      onPress={() => {
        analytics.logEvent('Departure details', 'Add to Favourite clicked', {
          line: favouriteDepartureLine?.id,
          lineNumber: favouriteDepartureLine?.lineNumber,
        });
        onMarkFavourite(
          favouriteDepartureLine,
          existingFavorite,
          onCloseFocusRef,
        );
      }}
      ref={onCloseFocusRef}
    />
  );
};

const useCollapseButtonStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    paddingBottom: theme.spacing.medium,
    marginLeft:
      theme.tripLegDetail.labelWidth +
      theme.tripLegDetail.decorationContainerWidth,
  },
  text: {
    marginRight: theme.spacing.xSmall,
  },
}));

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    marginRight: theme.spacing.medium,
  },
  parallaxContent: {marginHorizontal: theme.spacing.medium},
  date: {
    alignItems: 'center',
  },
  headerTitleIcon: {
    marginRight: theme.spacing.small,
  },
  headerSubSection: {
    marginTop: theme.spacing.medium,
    borderTopWidth: theme.border.width.slim,
    borderTopColor: theme.color.background.neutral[0].background,
    paddingTop: theme.spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  border: {
    borderColor: theme.color.background.neutral[3].background,
    marginVertical: theme.spacing.medium,
  },
  passedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '50%',
    flex: 1,
  },
  passedText: {
    alignItems: 'center',
  },
  startPlace: {
    marginTop: theme.spacing.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
    marginTop: theme.spacing.medium,
  },
  travelAidButton: {
    marginTop: theme.spacing.medium,
  },
  place: {
    marginBottom: -theme.tripLegDetail.decorationLineWidth,
  },
  row: {
    paddingVertical: theme.spacing.small,
  },
  middleRow: {
    minHeight: 60,
  },
  estimatedCallRows: {
    backgroundColor: theme.color.background.neutral[1].background,
    marginBottom: theme.spacing.xLarge,
  },
  spinner: {
    paddingTop: theme.spacing.medium,
  },
  messageBox: {
    marginBottom: theme.spacing.medium,
  },
  scrollView__content: {
    padding: theme.spacing.medium,
    paddingBottom: theme.spacing.large,
  },
  boardingInfo: {
    marginTop: theme.spacing.xSmall,
  },
  situationTripRow: {
    paddingTop: 0,
    paddingBottom: theme.spacing.xLarge,
  },
}));
