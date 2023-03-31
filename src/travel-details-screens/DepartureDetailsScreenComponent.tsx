import {getServiceJourneyMapLegs} from '@atb/api/serviceJourney';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {QuayFragment} from '@atb/api/types/generated/fragments/quays';
import {ServiceJourneyMapInfoData_v3} from '@atb/api/types/serviceJourney';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {ContentWithDisappearingHeader} from '@atb/components/disappearing-header';
import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {AccessibleText, ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import CancelledDepartureMessage from '@atb/travel-details-screens/components/CancelledDepartureMessage';
import PaginatedDetailsHeader from '@atb/travel-details-screens/components/PaginatedDetailsHeader';
import {SituationMessageBox, SituationOrNoticeIcon} from '@atb/situations';
import {StyleSheet, useTheme} from '@atb/theme';
import {DepartureDetailsTexts, useTranslation} from '@atb/translations';
import {animateNextChange} from '@atb/utils/animation';
import {getQuayName} from '@atb/utils/transportation-names';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import Time from './components/Time';
import TripLegDecoration from './components/TripLegDecoration';
import TripRow from './components/TripRow';
import {CompactTravelDetailsMap} from '@atb/travel-details-map-screen';
import {ServiceJourneyDeparture} from './types';
import useDepartureData, {
  EstimatedCallWithMetadata,
} from './use-departure-data';
import {TicketingMessages} from '@atb/travel-details-screens/components/DetailsMessages';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {formatToClock} from '@atb/utils/date';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {TravelDetailsMapScreenParams} from '@atb/travel-details-map-screen/TravelDetailsMapScreenComponent';
import {usePreferences} from '@atb/preferences';
import {useRealtimeMapEnabled} from '@atb/components/map/hooks/use-realtime-map-enabled';
import {useGetServiceJourneyVehicles} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-get-service-journey-vehicles';
import {Button} from '@atb/components/button';
import {Map} from '@atb/assets/svg/mono-icons/map';

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
  const {theme, themeName} = useTheme();
  const {
    preferences: {debugShowSeconds},
  } = usePreferences();

  const activeItem = items[activeItemIndexState];
  const hasMultipleItems = items.length > 1;

  const styles = useStopsStyle();
  const {t, language} = useTranslation();

  const isFocused = useIsFocused();
  const [
    {estimatedCallsWithMetadata, title, mode, subMode, situations, notices},
    isLoading,
  ] = useDepartureData(activeItem, 20, !isFocused);
  const mapData = useMapData(activeItem);

  const realtimeMapEnabled = useRealtimeMapEnabled();

  const shouldShowLive =
    !estimatedCallsWithMetadata.find((a) => !a.realtime) && realtimeMapEnabled;

  const {vehiclePositions} = useGetServiceJourneyVehicles(
    shouldShowLive ? [activeItem.serviceJourneyId] : undefined,
  );

  const vehiclePosition = vehiclePositions?.find(
    (s) => s.serviceJourney?.id === activeItem.serviceJourneyId,
  );

  const lastPassedStop = estimatedCallsWithMetadata
    .filter((a) => a.actualDepartureTime)
    .pop();

  const onPaginationPress = (newPage: number) => {
    animateNextChange();
    setActiveItem(newPage - 1);
  };

  const alreadyShownSituationNumbers = situations
    .map((s) => s.situationNumber)
    .filter((s): s is string => !!s);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        title={title ?? t(DepartureDetailsTexts.header.notFound)}
      />

      <ContentWithDisappearingHeader
        header={
          mapData && (
            <CompactTravelDetailsMap
              mapLegs={mapData.mapLegs}
              fromPlace={mapData.start}
              toPlace={mapData.stop}
              onExpand={() =>
                onPressDetailsMap({
                  legs: mapData.mapLegs,
                  fromPlace: mapData.start,
                  toPlace: mapData.stop,
                })
              }
            />
          )
        }
      >
        <View
          style={styles.scrollView__content}
          testID="departureDetailsContentView"
        >
          {activeItem ? (
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
          )}
          {realtimeMapEnabled && mapData ? (
            <Button
              type="pill"
              leftIcon={{svg: Map}}
              text={t(
                vehiclePosition
                  ? DepartureDetailsTexts.live
                  : DepartureDetailsTexts.map,
              )}
              interactiveColor="interactive_1"
              onPress={() =>
                onPressDetailsMap({
                  legs: mapData.mapLegs,
                  fromPlace: mapData.start,
                  toPlace: mapData.stop,
                  _initialVehiclePosition: vehiclePosition,
                })
              }
            />
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

          <TicketingMessages
            item={items[0]}
            trip={estimatedCallsWithMetadata}
            mode={mode}
            subMode={subMode}
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
      </ContentWithDisappearingHeader>
      {lastPassedStop?.quay?.name && (
        <View style={styles.realtime}>
          <ThemeIcon
            svg={themeName == 'dark' ? RealtimeDark : RealtimeLight}
            size={'small'}
            style={styles.realtimeIcon}
          ></ThemeIcon>
          <ThemeText type={'body__secondary'}>
            {t(
              DepartureDetailsTexts.lastPassedStop(
                lastPassedStop.quay?.name,
                formatToClock(
                  lastPassedStop?.actualDepartureTime,
                  language,
                  'nearest',
                  debugShowSeconds,
                ),
              ),
            )}
          </ThemeText>
        </View>
      )}
    </View>
  );
};

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
            showRealtimeIcon={false}
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
};
function CollapseButtonRow({
  label,
  collapsed,
  setCollapsed,
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
    backgroundColor: theme.static.background.background_0.background,
  },
  header: {
    backgroundColor: theme.static.background.background_accent_3.background,
  },
  startPlace: {
    marginTop: theme.spacings.large,
  },
  place: {
    marginBottom: -theme.tripLegDetail.decorationLineWidth,
  },
  endPlace: {
    marginBottom: theme.spacings.large,
  },
  row: {
    paddingVertical: theme.spacings.small,
  },
  middleRow: {
    minHeight: 60,
  },
  estimatedCallRows: {
    backgroundColor: theme.static.background.background_0.background,
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
  realtime: {
    padding: theme.spacings.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: theme.static.background.background_1.background,
  },
  realtimeIcon: {marginRight: theme.spacings.xSmall},
}));

function useMapData(activeItem: ServiceJourneyDeparture) {
  const [mapData, setMapData] = useState<ServiceJourneyMapInfoData_v3>();
  useEffect(() => {
    const getData = async () => {
      if (!activeItem) {
        return;
      }

      try {
        const result = await getServiceJourneyMapLegs(
          activeItem.serviceJourneyId,
          activeItem.fromQuayId,
          activeItem.toQuayId,
        );
        setMapData(result);
      } catch (e) {}
    };

    getData();
  }, [activeItem]);
  return mapData;
}
