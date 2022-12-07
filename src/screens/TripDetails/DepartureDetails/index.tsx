import {getServiceJourneyMapLegs} from '@atb/api/serviceJourney';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {QuayFragment} from '@atb/api/types/generated/fragments/quays';
import {ServiceJourneyMapInfoData_v3} from '@atb/api/types/serviceJourney';
import {Info} from '@atb/assets/svg/color/icons/status';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import ContentWithDisappearingHeader from '@atb/components/disappearing-header/content';
import {MessageBox} from '@atb/components/message-box';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {canSellTicketsForSubMode} from '@atb/operator-config';
import {usePreferenceItems} from '@atb/preferences';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import CancelledDepartureMessage from '@atb/screens/TripDetails/components/CancelledDepartureMessage';
import PaginatedDetailsHeader from '@atb/screens/TripDetails/components/PaginatedDetailsHeader';
import {SituationOrNoticeIcon, SituationMessageBox} from '@atb/situations';
import {StyleSheet, useTheme} from '@atb/theme';
import {DepartureDetailsTexts, useTranslation} from '@atb/translations';
import {animateNextChange} from '@atb/utils/animation';
import {getQuayName} from '@atb/utils/transportation-names';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import Time from '../components/Time';
import TripLegDecoration from '../components/TripLegDecoration';
import TripRow from '../components/TripRow';
import CompactMap from '../Map/CompactMap';
import {TripDetailsScreenProps} from '../types';
import {ServiceJourneyDeparture} from './types';
import useDepartureData, {
  EstimatedCallWithMetadata,
} from './use-departure-data';
import {TicketingMessages} from '@atb/screens/TripDetails/components/DetailsMessages';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';

export type DepartureDetailsRouteParams = {
  items: ServiceJourneyDeparture[];
  activeItemIndex: number;
};

type Props = TripDetailsScreenProps<'DepartureDetails'>;

export default function DepartureDetails({navigation, route}: Props) {
  const {activeItemIndex, items} = route.params;
  const [activeItemIndexState, setActiveItem] = useState(activeItemIndex);
  const {theme} = useTheme();
  const {modesWeSellTicketsFor} = useFirestoreConfiguration();
  const {enable_ticketing} = useRemoteConfig();

  const activeItem = items[activeItemIndexState];
  const hasMultipleItems = items.length > 1;

  const styles = useStopsStyle();
  const {t} = useTranslation();

  const isFocused = useIsFocused();
  const [
    {estimatedCallsWithMetadata, title, mode, subMode, situations, notices},
    isLoading,
  ] = useDepartureData(activeItem, 30, !isFocused);
  const mapData = useMapData(activeItem);

  const canSellTicketsForDeparture = canSellTicketsForSubMode(
    subMode,
    modesWeSellTicketsFor,
  );

  const someLegsAreByTrain = mode === TransportMode.Rail;
  const isTicketingEnabledAndWeCantSellTicketForDeparture =
    enable_ticketing && !canSellTicketsForDeparture;

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
            <CompactMap
              mapLegs={mapData.mapLegs}
              fromPlace={mapData.start}
              toPlace={mapData.stop}
              onExpand={() => {
                navigation.navigate('DetailsMap', {
                  legs: mapData.mapLegs,
                  fromPlace: mapData.start,
                  toPlace: mapData.stop,
                });
              }}
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

          {isTicketingEnabledAndWeCantSellTicketForDeparture && (
            <MessageBox
              containerStyle={styles.messageBox}
              type="info"
              message={t(DepartureDetailsTexts.messages.ticketsWeDontSell)}
            />
          )}

          {someLegsAreByTrain && (
            <MessageBox
              containerStyle={styles.messageBox}
              type="info"
              message={t(DepartureDetailsTexts.messages.collabTicketInfo)}
            />
          )}

          <EstimatedCallRows
            calls={estimatedCallsWithMetadata}
            mode={mode}
            subMode={subMode}
            toQuayId={activeItem.toQuayId}
            alreadyShownSituationNumbers={alreadyShownSituationNumbers}
          />
        </View>
      </ContentWithDisappearingHeader>
    </View>
  );
}

type CallGroupProps = {
  calls: EstimatedCallWithMetadata[];
  mode?: TransportMode;
  subMode?: TransportSubmode;
  toQuayId?: string;
  alreadyShownSituationNumbers: string[];
};

function EstimatedCallRows({
  calls,
  mode,
  subMode,
  toQuayId,
  alreadyShownSituationNumbers,
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
};
function EstimatedCallRow({
  call,
  mode,
  subMode,
  collapseButton,
  situations,
}: TripItemProps) {
  const navigation = useNavigation<Props['navigation']>();
  const {t} = useTranslation();
  const styles = useStopsStyle();

  const {group, isStartOfGroup, isEndOfGroup, isStartOfServiceJourney} =
    call.metadata;

  const isBetween = !isStartOfGroup && !isEndOfGroup;
  const iconColor = useTransportationColor(
    group === 'trip' ? mode : undefined,
    subMode,
  );
  const {newDepartures} = usePreferenceItems();
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
            aimedTime={call.aimedDepartureTime}
            expectedTime={call.expectedDepartureTime}
            missingRealTime={!call.realtime && isStartOfServiceJourney}
          />
        }
        alignChildren={
          isStartOfGroup ? 'flex-start' : isEndOfGroup ? 'flex-end' : 'center'
        }
        style={[styles.row, isBetween && styles.middleRow]}
        onPress={() => handleQuayPress(call.quay)}
        testID={'legType_' + group}
      >
        <ThemeText testID="quayName">{getQuayName(call.quay)} </ThemeText>
      </TripRow>
      {situations.map((situation) => (
        <TripRow rowLabel={<SituationOrNoticeIcon situation={situation} />}>
          <SituationMessageBox noStatusIcon={true} situation={situation} />
        </TripRow>
      ))}
      {!call.forAlighting && (
        <TripRow>
          <MessageBox
            noStatusIcon={true}
            type="info"
            message={t(DepartureDetailsTexts.messages.noAlighting)}
          />
        </TripRow>
      )}
      {!call.forBoarding && (
        <TripRow>
          <MessageBox
            noStatusIcon={true}
            type="info"
            message={t(DepartureDetailsTexts.messages.noBoarding)}
          />
        </TripRow>
      )}

      {collapseButton}
    </View>
  );

  async function handleQuayPress(quay: QuayFragment | undefined) {
    const stopPlace = quay?.stopPlace;
    if (!stopPlace) return;

    if (newDepartures) {
      navigation.push('PlaceScreen', {
        place: {
          id: stopPlace.id,
          name: stopPlace.name,
        },
        selectedQuay: {...quay, situations: []},
        mode: 'Departure',
      });
    } else {
      navigation.navigate('QuayDepartures', {stopPlace});
    }
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
  situationsContainer: {
    marginBottom: theme.spacings.small,
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
