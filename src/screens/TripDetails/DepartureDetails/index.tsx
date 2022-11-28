import {getServiceJourneyMapLegs} from '@atb/api/serviceJourney';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {QuayFragment} from '@atb/api/types/generated/serviceJourney';
import {ServiceJourneyMapInfoData_v3} from '@atb/api/types/serviceJourney';
import {Info, Warning} from '@atb/assets/svg/color/icons/status';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import ContentWithDisappearingHeader from '@atb/components/disappearing-header/content';
import MessageBox, {TinyMessageBox} from '@atb/components/message-box';
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
import {SituationMessagesBox} from '@atb/situations';
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
import {filterSituations} from '@atb/situations/utils';

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
    {
      estimatedCallsWithMetadata,
      title,
      mode,
      subMode,
      serviceJourneySituations,
    },
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
          <SituationMessagesBox
            situations={serviceJourneySituations}
            containerStyle={styles.situationsContainer}
          />

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
              containerStyle={styles.ticketMessage}
              type="warning"
              message={
                t(DepartureDetailsTexts.messages.ticketsWeDontSell) +
                (someLegsAreByTrain
                  ? `\n\n` + t(DepartureDetailsTexts.messages.collabTicketInfo)
                  : ``)
              }
            />
          )}

          <EstimatedCallRows
            calls={estimatedCallsWithMetadata}
            mode={mode}
            subMode={subMode}
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
};

function EstimatedCallRows({calls, mode, subMode}: CallGroupProps) {
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
          // Quay and ServiceJourney ID is not a unique key if a ServiceJourney
          // passes by the same stop several times, (e.g. Ringen in Oslo)
          // which is why it is used in combination with aimedDepartureTime.
          key={`${call.quay?.id} ${call.serviceJourney?.id} ${call.aimedDepartureTime}`}
          call={call}
          mode={mode}
          subMode={subMode}
          collapseButton={
            call.metadata.isStartOfServiceJourney ? collapseButton : null
          }
        />
      ))}
    </View>
  );
}

type TripItemProps = {
  call: EstimatedCallWithMetadata;
  mode: TransportMode | undefined;
  subMode: TransportSubmode | undefined;
  collapseButton: JSX.Element | null;
};
function EstimatedCallRow({
  call,
  mode,
  subMode,
  collapseButton,
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
  // Make sure there is text to show in the situation message
  const quaySituations =
    group !== 'passed' ? filterSituations(call?.quay?.situations) : undefined;
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
      {quaySituations?.length ? (
        <TripRow rowLabel={<ThemeIcon svg={Warning} />}>
          <SituationMessagesBox mode="no-icon" situations={quaySituations} />
        </TripRow>
      ) : null}
      {call.notices &&
        call.notices.map((notice, index) => {
          if (!notice.text) return null;
          return (
            <TripRow
              key={'notice-' + index}
              rowLabel={<ThemeIcon svg={Info} />}
            >
              <TinyMessageBox type="info" message={notice.text} />
            </TripRow>
          );
        })}
      {!call.forAlighting && (
        <TripRow>
          <TinyMessageBox
            type="info"
            message={t(DepartureDetailsTexts.messages.noAlighting)}
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
        selectedQuay: quay,
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
  ticketMessage: {
    marginTop: theme.spacings.medium,
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
