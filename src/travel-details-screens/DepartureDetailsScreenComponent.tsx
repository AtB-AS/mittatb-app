import {QuayFragment} from '@atb/api/types/generated/fragments/quays';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Map} from '@atb/assets/svg/mono-icons/map';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {TransportationIconBox} from '@atb/components/icon-box';
import {useRealtimeMapEnabled} from '@atb/components/map';
import {MessageBox} from '@atb/components/message-box';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {FullScreenView} from '@atb/components/screen-view';
import {AccessibleText, ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {CancelledDepartureMessage} from '@atb/travel-details-screens/components/CancelledDepartureMessage';
import {SituationMessageBox, SituationOrNoticeIcon} from '@atb/situations';
import {useGetServiceJourneyVehicles} from '@atb/travel-details-screens/use-get-service-journey-vehicles';
import {StyleSheet, useTheme} from '@atb/theme';
import {DepartureDetailsTexts, useTranslation} from '@atb/translations';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';
import {animateNextChange} from '@atb/utils/animation';
import {formatToVerboseFullDate, isWithinSameDate} from '@atb/utils/date';
import {getQuayName} from '@atb/utils/transportation-names';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import React, {useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {Time} from './components/Time';
import {TripLegDecoration} from './components/TripLegDecoration';
import {TripRow} from './components/TripRow';
import {ServiceJourneyDeparture} from './types';
import {
  useDepartureData,
  EstimatedCallWithMetadata,
} from './use-departure-data';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {PaginatedDetailsHeader} from '@atb/travel-details-screens/components/PaginatedDetailsHeader';
import {useRealtimeText} from '@atb/travel-details-screens/use-realtime-text';
import {Divider} from '@atb/components/divider';
import {useMapData} from '@atb/travel-details-screens/use-map-data';
import {useAnalytics} from '@atb/analytics';
import {VehicleStatusEnumeration} from '@atb/api/types/generated/vehicles-types_v1';
import {GlobalMessage, GlobalMessageContextEnum} from '@atb/global-messages';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useFirestoreConfiguration} from '@atb/configuration';
import {canSellTicketsForSubMode} from '@atb/operator-config';

export type DepartureDetailsScreenParams = {
  items: ServiceJourneyDeparture[];
  activeItemIndex: number;
};

type Props = DepartureDetailsScreenParams & {
  onPressDetailsMap: (params: TravelDetailsMapScreenParams) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
};

export const DepartureDetailsScreenComponent = ({
  items,
  activeItemIndex,
  onPressDetailsMap,
  onPressQuay,
}: Props) => {
  const [activeItemIndexState, setActiveItem] = useState(activeItemIndex);
  const {theme} = useTheme();
  const analytics = useAnalytics();
  const {enable_ticketing} = useRemoteConfig();
  const {modesWeSellTicketsFor} = useFirestoreConfiguration();

  const activeItem = items[activeItemIndexState];
  const hasMultipleItems = items.length > 1;

  const styles = useStopsStyle();
  const {t, language} = useTranslation();

  const [
    {estimatedCallsWithMetadata, title, mode, subMode, situations, notices},
    isLoading,
  ] = useDepartureData(activeItem, 20);

  const mapData = useMapData(
    activeItem.serviceJourneyId,
    activeItem.fromQuayId,
    activeItem.toQuayId,
  );

  const realtimeMapEnabled = useRealtimeMapEnabled();
  const screenReaderEnabled = useIsScreenReaderEnabled();

  const shouldShowLive =
    !estimatedCallsWithMetadata.find((a) => !a.realtime) && realtimeMapEnabled;

  const {vehiclePositions} = useGetServiceJourneyVehicles(
    shouldShowLive ? [activeItem.serviceJourneyId] : undefined,
  );

  const vehiclePosition = vehiclePositions?.find(
    (s) => s.serviceJourney?.id === activeItem.serviceJourneyId,
  );

  const realtimeText = useRealtimeText(estimatedCallsWithMetadata);

  const isJourneyFinished =
    vehiclePosition?.vehicleStatus === VehicleStatusEnumeration.Completed ||
    estimatedCallsWithMetadata.every((e) => e.actualArrivalTime);

  const toQuay = estimatedCallsWithMetadata.find(
    (estimatedCall) => estimatedCall.quay?.id === activeItem.toQuayId,
  );
  const fromQuay = estimatedCallsWithMetadata.find(
    (estimatedCall) => estimatedCall.quay?.id === activeItem.fromQuayId,
  );
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

  return (
    <View style={styles.container}>
      <FullScreenView
        headerProps={{
          leftButton: {type: 'back', withIcon: true},
          title: t(DepartureDetailsTexts.header.alternateTitle),
        }}
        parallaxContent={(focusRef?: React.MutableRefObject<null>) => (
          <View style={styles.parallaxContent}>
            <View style={styles.headerTitle} ref={focusRef} accessible={true}>
              {mode && (
                <TransportationIconBox
                  mode={mode}
                  subMode={subMode}
                  style={styles.headerTitleIcon}
                />
              )}
              <ThemeText
                type="heading--medium"
                color="background_accent_0"
                style={{flexShrink: 1}}
              >
                {title ?? t(DepartureDetailsTexts.header.notFound)}
              </ThemeText>
            </View>
            {shouldShowMapButton || realtimeText ? (
              <View style={styles.headerSubSection}>
                {realtimeText && <LastPassedStop realtimeText={realtimeText} />}
                {shouldShowMapButton ? (
                  <Button
                    type="pill"
                    leftIcon={{svg: Map}}
                    style={realtimeText ? styles.liveButton : undefined}
                    text={t(
                      vehiclePosition
                        ? DepartureDetailsTexts.live
                        : DepartureDetailsTexts.map,
                    )}
                    interactiveColor="interactive_1"
                    onPress={() => {
                      vehiclePosition &&
                        analytics.logEvent(
                          'Departure details',
                          'See live bus clicked',
                          {
                            fromPlace: mapData.start,
                            toPlace: mapData?.stop,
                            mode: mode,
                            subMode: subMode,
                          },
                        );
                      onPressDetailsMap({
                        legs: mapData.mapLegs,
                        fromPlace: mapData.start,
                        toPlace: mapData.stop,
                        vehicleWithPosition: vehiclePosition,
                        mode: mode,
                        subMode: subMode,
                      });
                    }}
                  />
                ) : null}
              </View>
            ) : null}
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
              <MessageBox
                type="error"
                message={t(DepartureDetailsTexts.messages.noActiveItem)}
              />
            )
          ) : !isWithinSameDate(new Date(), activeItem.date) ? (
            <>
              <View style={styles.date}>
                <ThemeText type={'body__primary'} color={'secondary'}>
                  {formatToVerboseFullDate(activeItem.date, language)}
                </ThemeText>
              </View>
              <Divider style={styles.border} />
            </>
          ) : null}
          {activeItem?.isTripCancelled && <CancelledDepartureMessage />}
          {situations.map((situation) => (
            <SituationMessageBox
              situation={situation}
              style={styles.messageBox}
            />
          ))}
          {notices.map(
            (notice) =>
              notice.text && (
                <MessageBox
                  type="info"
                  message={notice.text}
                  style={styles.messageBox}
                />
              ),
          )}

          {isLoading && (
            <View>
              <ActivityIndicator
                color={theme.text.colors.primary}
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
              fromZones:
                fromQuay?.quay?.tariffZones.map((zone) => zone.id) || null,
              toZones: toQuay?.quay?.tariffZones.map((zone) => zone.id) || null,
            }}
            style={styles.messageBox}
          />

          <EstimatedCallRows
            calls={estimatedCallsWithMetadata}
            mode={mode}
            subMode={subMode}
            toQuayId={activeItem.toQuayId}
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

  return (
    <View style={styles.passedSection}>
      <ThemeIcon
        svg={RealtimeDark}
        size="small"
        style={styles.passedSectionRealtimeIcon}
      />
      <ThemeText
        type="body__secondary"
        color="background_accent_0"
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
  toQuayId?: string;
  alreadyShownSituationNumbers: string[];
  onPressQuay: Props['onPressQuay'];
};

function EstimatedCallRows({
  calls,
  mode,
  subMode,
  toQuayId,
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
          // Quay ID is not a unique key if a ServiceJourney passes by the
          // same stop several times, (e.g. Ringen in Oslo) which is why it
          // is used in combination with aimedDepartureTime.
          key={`${call.quay?.id}-${call.aimedDepartureTime}`}
          call={call}
          mode={mode}
          subMode={subMode}
          collapseButton={
            call.metadata.isStartOfServiceJourney ? collapseButton : null
          }
          situations={getSituationsToShowForCall(
            call,
            alreadyShownSituationNumbers,
            toQuayId,
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
  toQuayId?: string,
) => {
  if (group === 'passed' || group === 'after') return [];
  if (toQuayId && !isEndOfGroup) return [];
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

  const isBetween = !isStartOfGroup && !isEndOfGroup;
  const iconColor = useTransportationColor(
    group === 'trip' ? mode : undefined,
    subMode,
  );
  return (
    <View style={[styles.place, isStartOfGroup && styles.startPlace]}>
      <TripLegDecoration
        hasStart={isStartOfGroup}
        hasCenter={isBetween}
        hasEnd={isEndOfGroup}
        color={iconColor}
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
            type="body__secondary"
            color="secondary"
            style={styles.boardingInfo}
            pause="before"
          >
            {t(DepartureDetailsTexts.messages.noAlighting)}
          </AccessibleText>
        )}
        {!call.forBoarding && !call.metadata.isEndOfServiceJourney && (
          <AccessibleText
            type="body__secondary"
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
          rowLabel={<SituationOrNoticeIcon situation={situation} />}
          style={styles.situationTripRow}
        >
          <SituationMessageBox noStatusIcon={true} situation={situation} />
        </TripRow>
      ))}

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
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => setCollapsed(!collapsed)}
      testID={testID}
    >
      <View style={styles.container}>{child}</View>
    </TouchableOpacity>
  );
}
const useCollapseButtonStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    paddingBottom: theme.spacings.medium,
    marginLeft:
      theme.tripLegDetail.labelWidth +
      theme.tripLegDetail.decorationContainerWidth,
  },
  text: {
    marginRight: theme.spacings.xSmall,
  },
}));

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parallaxContent: {marginHorizontal: theme.spacings.medium},
  date: {
    alignItems: 'center',
  },
  headerTitleIcon: {
    marginRight: theme.spacings.small,
  },
  headerSubSection: {
    marginTop: theme.spacings.medium,
    borderTopWidth: theme.border.width.slim,
    borderTopColor: theme.static.background.background_accent_1.background,
    paddingTop: theme.spacings.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  border: {
    borderColor: theme.static.background.background_3.background,
    marginVertical: theme.spacings.medium,
  },
  passedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '50%',
    flex: 1,
  },
  passedSectionRealtimeIcon: {
    marginRight: theme.spacings.xSmall,
  },
  passedText: {
    flexShrink: 1,
  },
  startPlace: {
    marginTop: theme.spacings.medium,
  },
  liveButton: {
    marginLeft: theme.spacings.small,
  },
  place: {
    marginBottom: -theme.tripLegDetail.decorationLineWidth,
  },
  row: {
    paddingVertical: theme.spacings.small,
  },
  middleRow: {
    minHeight: 60,
  },
  estimatedCallRows: {
    backgroundColor: theme.static.background.background_1.background,
    marginBottom: theme.spacings.xLarge,
  },
  spinner: {
    paddingTop: theme.spacings.medium,
  },
  messageBox: {
    marginBottom: theme.spacings.medium,
  },
  scrollView__content: {
    padding: theme.spacings.medium,
    paddingBottom: theme.spacings.large,
  },
  boardingInfo: {
    marginTop: theme.spacings.xSmall,
  },
  situationTripRow: {
    paddingTop: 0,
    paddingBottom: theme.spacings.xLarge,
  },
}));
