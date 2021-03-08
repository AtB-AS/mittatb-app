import {getFeatureFromVenue} from '@atb/api/geocoder';
import {getServiceJourneyMapLegs} from '@atb/api/serviceJourney';
import {Expand, ExpandLess} from '@atb/assets/svg/icons/navigation';
import ContentWithDisappearingHeader from '@atb/components/disappearing-header/content';
import PaginatedDetailsHeader from '@atb/components/pagination';
import ScreenHeader from '@atb/components/screen-header';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {searchByStopPlace} from '@atb/geocoder/search-for-location';
import {mapFeatureToLocation} from '@atb/geocoder/utils';
import {
  EstimatedCall,
  FeatureCategory,
  ServiceJourneyMapInfoData,
  Situation,
  TransportMode,
  TransportSubmode,
} from '@atb/sdk';
import SituationMessages from '@atb/situations';
import {StyleSheet, useTheme} from '@atb/theme';
import {DepartureDetailsTexts, useTranslation} from '@atb/translations';
import {animateNextChange} from '@atb/utils/animation';
import {getQuayName} from '@atb/utils/transportation-names';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {
  NavigationProp,
  RouteProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DetailsModalNavigationProp, DetailsStackParams} from '..';
import Time from '../components/Time';
import TripLegDecoration from '../components/TripLegDecoration';
import TripRow from '../components/TripRow';
import CompactMap from '../Map/CompactMap';
import SituationRow from '../SituationRow';
import {ServiceJourneyDeparture} from './types';
import useDepartureData, {CallListGroup} from './use-departure-data';

export type DepartureDetailsRouteParams = {
  items: ServiceJourneyDeparture[];
  activeItemIndex?: number;
};

export type DetailScreenRouteProp = RouteProp<
  DetailsStackParams,
  'DepartureDetails'
>;

export type DepartureDetailScreenNavigationProp = NavigationProp<DetailsStackParams>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DepartureDetailScreenNavigationProp;
};

export default function DepartureDetails({navigation, route}: Props) {
  const {activeItemIndex = 0, items} = route.params;
  const [activeItemIndexState, setActiveItem] = useState(activeItemIndex);
  const {theme} = useTheme();

  const activeItem: ServiceJourneyDeparture | undefined =
    items[activeItemIndexState];
  const hasMultipleItems = items.length > 1;

  const styles = useStopsStyle();
  const {t} = useTranslation();
  const {top: paddingTop} = useSafeAreaInsets();

  const isFocused = useIsFocused();
  const [
    {callGroups, title, mode, subMode, situations: parentSituations},
    isLoading,
  ] = useDepartureData(activeItem, 30, !isFocused);
  const mapData = useMapData(activeItem);

  const onPaginactionPress = (newPage: number) => {
    animateNextChange();
    setActiveItem(newPage - 1);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop}]}>
        <ScreenHeader
          leftButton={{type: 'back'}}
          title={title ?? t(DepartureDetailsTexts.header.notFound)}
        />
      </View>
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
        //
      >
        <View style={styles.scrollView__content}>
          <PaginatedDetailsHeader
            page={activeItemIndexState + 1}
            totalPages={items.length}
            onNavigate={onPaginactionPress}
            showPagination={hasMultipleItems}
            currentDate={activeItem?.date}
          />
          <SituationMessages
            situations={parentSituations}
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

          <View style={styles.allGroups}>
            {mapGroup(callGroups, (name, group) => (
              <CallGroup
                key={group[0]?.quay?.id ?? name}
                calls={group}
                type={name}
                mode={mode}
                subMode={subMode}
                parentSituations={parentSituations}
              />
            ))}
          </View>
        </View>
      </ContentWithDisappearingHeader>
    </View>
  );
}
function mapGroup<T>(
  groups: CallListGroup,
  map: (group: keyof CallListGroup, calls: EstimatedCall[]) => T,
) {
  return Object.entries(groups).map(([name, group]) =>
    map(name as keyof CallListGroup, group),
  );
}

type CallGroupProps = {
  calls: EstimatedCall[];
  type: keyof CallListGroup;
  mode?: TransportMode;
  subMode?: TransportSubmode;
  parentSituations: Situation[];
};
function CallGroup({
  type,
  calls,
  mode,
  subMode,
  parentSituations,
}: CallGroupProps) {
  const isOnRoute = type === 'trip';
  const isBefore = type === 'passed';
  const showCollapsable = isBefore && calls.length > 1;
  const isStartPlace = (i: number) => isOnRoute && i === 0;
  const {t} = useTranslation();
  const [collapsed, setCollapsed] = useState(isBefore);

  if (!calls?.length) {
    return null;
  }

  const collapsePress = (c: boolean) => {
    animateNextChange();
    setCollapsed(c);
  };

  const items = collapsed ? [calls[0]] : calls;
  const collapseButton = showCollapsable ? (
    <CollapseButtonRow
      key={`collapse-button-${type}`}
      collapsed={collapsed}
      setCollapsed={collapsePress}
      label={t(DepartureDetailsTexts.collapse.label(calls.length - 1))}
    />
  ) : null;

  return (
    <>
      {items.map((call, i) => {
        return (
          <TripItem
            key={call.quay?.id + call.serviceJourney.id}
            isStartPlace={isStartPlace(i)}
            isStart={isStartPlace(i) || i === 0}
            isEnd={i === items.length - 1 && !collapsed}
            call={call}
            type={type}
            mode={mode}
            subMode={subMode}
            parentSituations={parentSituations}
            collapseButton={i === 0 ? collapseButton : null}
          />
        );
      })}
    </>
  );
}

type TripItemProps = {
  isStartPlace: boolean;
  call: EstimatedCall;
  type: string;
  mode: TransportMode | undefined;
  subMode: TransportSubmode | undefined;
  parentSituations: Situation[];
  collapseButton: JSX.Element | null;
  isStart: boolean;
  isEnd: boolean;
};
function TripItem({
  isStartPlace,
  call,
  type,
  mode,
  subMode,
  parentSituations,
  collapseButton,
  isStart,
  isEnd,
}: TripItemProps) {
  const navigation = useNavigation<DetailsModalNavigationProp>();

  const styles = useStopsStyle();
  const isBetween = !isStart && !isEnd;
  const iconColor = useTransportationColor(
    type === 'passed' || type === 'after' ? undefined : mode,
    subMode,
  );

  return (
    <View style={[styles.place, isStart && styles.startPlace]}>
      <TripLegDecoration
        hasStart={isStart}
        hasCenter={isBetween}
        hasEnd={isEnd}
        color={iconColor}
      />
      <TripRow
        rowLabel={
          <Time
            aimedTime={call.aimedDepartureTime}
            expectedTime={call.expectedDepartureTime}
            missingRealTime={!call.realtime && isStartPlace}
          />
        }
        alignChildren={isStart ? 'flex-start' : isEnd ? 'flex-end' : 'center'}
        style={[styles.row, isBetween && styles.middleRow]}
        onPress={async () => {
          const stopPlace = call.quay?.stopPlace;
          if (!stopPlace || !stopPlace?.latitude || !stopPlace?.longitude) {
            // should not happen, but just in case.
            return;
          }
          const location = await searchByStopPlace({
            name: stopPlace.name,
            coordinates: {
              latitude: stopPlace.latitude,
              longitude: stopPlace.longitude,
            },
          });
          if (!location) {
            return;
          }
          navigation.navigate('Nearest', {
            screen: 'NearbyRoot',
            params: {location},
          });
        }}
      >
        <ThemeText>{getQuayName(call.quay)} </ThemeText>
      </TripRow>

      {type !== 'passed' && (
        <SituationRow
          situations={call.situations}
          parentSituations={parentSituations}
        />
      )}
      {collapseButton}
    </View>
  );
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
      <ThemeIcon svg={Expand} />
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
    backgroundColor: theme.background.level0,
  },
  header: {
    backgroundColor: theme.background.header,
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
  allGroups: {
    backgroundColor: theme.background.level0,
    marginBottom: theme.spacings.xLarge,
  },
  spinner: {
    paddingTop: theme.spacings.medium,
  },
  scrollView__content: {
    padding: theme.spacings.medium,
    paddingBottom: theme.spacings.large,
  },
}));

function useMapData(activeItem: ServiceJourneyDeparture) {
  const [mapData, setMapData] = useState<ServiceJourneyMapInfoData>();
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
