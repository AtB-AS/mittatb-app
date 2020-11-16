import {LegMode} from '@entur/sdk';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import React, {Fragment, useCallback, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import Dash from 'react-native-dash';
import {ScrollView} from 'react-native-gesture-handler';
import {DetailsModalNavigationProp, DetailsModalStackParams} from '..';
import {getDepartures} from '../../../api/serviceJourney';
import {Close} from '../../../assets/svg/icons/actions';
import {
  ArrowLeft,
  Expand,
  ExpandLess,
} from '../../../assets/svg/icons/navigation';
import {Dot} from '../../../assets/svg/icons/other';
import TransportationIcon from '../../../components/transportation-icon';
import ScreenHeader from '../../../ScreenHeader';
import {EstimatedCall, Situation} from '../../../sdk';
import SituationMessages from '../../../situations';
import {StyleSheet} from '../../../theme';
import {formatToClock, missingRealtimePrefix} from '../../../utils/date';
import transportationColor from '../../../utils/transportation-color';
import {getQuayName} from '../../../utils/transportation-names';
import usePollableResource from '../../../utils/use-pollable-resource';
import LocationRow from '../LocationRow';
import SituationRow from '../SituationRow';
import {getAimedTimeIfLargeDifference} from '../utils';
import ThemeIcon from '../../../components/theme-icon';
import ThemeText from '../../../components/text';

export type DepartureDetailsRouteParams = {
  title: string;
  serviceJourneyId: string;
  fromQuayId?: string;
  toQuayId?: string;
  isBack?: boolean;
};

export type DetailScreenRouteProp = RouteProp<
  DetailsModalStackParams,
  'DepartureDetails'
>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailsModalNavigationProp;
};

export default function DepartureDetails({navigation, route}: Props) {
  const {
    title,
    serviceJourneyId,
    fromQuayId,
    toQuayId,
    isBack = false,
  } = route.params;
  const styles = useStopsStyle();

  const isFocused = useIsFocused();
  const [
    {callGroups, mode, publicCode, situations: parentSituations},
    _,
    isLoading,
  ] = useDepartureData(serviceJourneyId, fromQuayId, toQuayId, 30, !isFocused);

  const content = isLoading ? (
    <View accessibilityLabel={'Laster søkeresultat'} accessible={true}>
      <ActivityIndicator style={styles.spinner} animating={true} size="large" />
    </View>
  ) : (
    <ScrollView style={styles.scrollView}>
      <SituationMessages
        situations={parentSituations}
        containerStyle={styles.situationsContainer}
      />
      <View style={styles.allGroups}>
        {mapGroup(callGroups, (name, group) => (
          <CallGroup
            key={group[0]?.quay?.id ?? name}
            calls={group}
            type={name}
            mode={mode}
            publicCode={publicCode}
            parentSituations={parentSituations}
          />
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: <ThemeIcon svg={isBack ? ArrowLeft : Close} />,
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: 'Gå tilbake',
        }}
        title={title}
      />
      {content}
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
  mode?: LegMode;
  publicCode?: string;
  parentSituations: Situation[];
};
function CallGroup({
  type,
  calls,
  mode,
  publicCode,
  parentSituations,
}: CallGroupProps) {
  const isOnRoute = type === 'trip';
  const isBefore = type === 'passed';
  const showCollapsable = isBefore && calls.length > 1;
  const isStartPlace = (i: number) => isOnRoute && i === 0;
  const shouldDropMarginBottom = (i: number) =>
    (type === 'after' || isOnRoute) && i == calls.length - 1;
  const shouldHaveMarginTop = (i: number) => type === 'after' && i == 0;
  const departureTimeString = (
    call: EstimatedCall,
    indicateMissingRealtime: boolean = false,
  ) => {
    const timeString = formatToClock(call.expectedDepartureTime);
    if (call.realtime || !indicateMissingRealtime) {
      return timeString;
    } else {
      return missingRealtimePrefix + timeString;
    }
  };

  const [collapsed, setCollapsed] = useState(isBefore);
  const styles = useStopsStyle();
  if (!calls?.length) {
    return null;
  }

  const items = collapsed ? [calls[0]] : calls;
  const collapseButton = showCollapsable ? (
    <CollapseButtonRow
      key={`collapse-button-${type}`}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      numberOfStops={calls.length - 1}
    />
  ) : null;

  const dashColor = isOnRoute
    ? transportationColor(mode, publicCode).fill
    : transportationColor().fill;

  return (
    <View>
      {isOnRoute && (
        <View style={styles.dashContainer}>
          <Dash
            dashGap={0}
            dashThickness={8}
            dashLength={8}
            dashColor={dashColor}
            style={styles.dash}
          />
        </View>
      )}

      {items.map((call, i) => (
        <Fragment key={call.quay?.id + call.serviceJourney.id}>
          <LocationRow
            key={call.quay?.id + call.serviceJourney.id}
            icon={
              isStartPlace(i) ? (
                <TransportationIcon
                  mode={call.serviceJourney.journeyPattern?.line.transportMode}
                  publicCode={
                    call.serviceJourney.journeyPattern?.line.publicCode
                  }
                />
              ) : (
                <Dot fill={dashColor} style={{marginHorizontal: 4}} />
              )
            }
            iconContainerStyle={{paddingVertical: 2}}
            rowStyle={[
              styles.item,
              shouldDropMarginBottom(i) ? {marginBottom: 0} : undefined,
              shouldHaveMarginTop(i) ? {marginTop: 24} : undefined,
            ]}
            label={getQuayName(call.quay)}
            time={departureTimeString(call, isStartPlace(i))}
            timeStyle={
              isStartPlace(i) ? {fontWeight: 'bold', fontSize: 16} : undefined
            }
            aimedTime={
              isStartPlace(i) && call.realtime
                ? getAimedTimeIfLargeDifference(call)
                : undefined
            }
            textStyle={[
              styles.textStyle,
              !isOnRoute ? styles.textStyleFaded : undefined,
            ]}
            dashThroughIcon={true}
          />
          {type !== 'passed' && (
            <SituationRow
              situations={call.situations}
              parentSituations={parentSituations}
            />
          )}
          {i === 0 && collapseButton}
        </Fragment>
      ))}
    </View>
  );
}

type CollapseButtonRowProps = {
  numberOfStops: number;
  collapsed: boolean;
  setCollapsed(collapsed: boolean): void;
};
function CollapseButtonRow({
  numberOfStops,
  collapsed,
  setCollapsed,
}: CollapseButtonRowProps) {
  const styles = useCollapseButtonStyle();
  const text = (
    <ThemeText color="faded" style={styles.text}>
      {numberOfStops} Mellomstopp
    </ThemeText>
  );
  const child = collapsed ? (
    <>
      <ThemeIcon svg={Expand} />
      {text}
    </>
  ) : (
    <>
      <ThemeIcon svg={ExpandLess} />
      {text}
    </>
  );
  return (
    <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
      <View style={styles.container}>{child}</View>
    </TouchableOpacity>
  );
}
const useCollapseButtonStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    marginLeft: 89,
  },
  text: {
    marginLeft: 12,
  },
}));

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
  situationsContainer: {
    marginBottom: theme.spacings.small,
  },
  allGroups: {
    marginBottom: 250,
    backgroundColor: theme.background.level1,
    borderRadius: 10,
    paddingVertical: 12,
  },
  spinner: {height: 280},
  dashContainer: {
    marginLeft: 95,
    position: 'absolute',
    height: '100%',
    paddingVertical: 10,
  },
  dash: {
    flexDirection: 'column',
    height: '100%',
  },
  item: {
    marginBottom: 12,
  },
  itemNoMargin: {
    marginBottom: 0,
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  textStyle: {
    fontSize: 16,
  },
  textStyleFaded: {
    opacity: 0.6,
  },
}));

type DepartureData = {
  callGroups: CallListGroup;
  mode?: LegMode;
  publicCode?: string;
  situations: Situation[];
};

type CallListGroup = {
  passed: EstimatedCall[];
  trip: EstimatedCall[];
  after: EstimatedCall[];
};

function useDepartureData(
  serviceJourneyId: string,
  fromQuayId?: string,
  toQuayId?: string,
  pollingTimeInSeconds: number = 0,
  disabled?: boolean,
): [DepartureData, () => void, boolean, Error?] {
  const getService = useCallback(
    async function getServiceJourneyDepartures(): Promise<DepartureData> {
      const deps = await getDepartures(serviceJourneyId);
      const callGroups = groupAllCallsByQuaysInLeg(deps, fromQuayId, toQuayId);
      const line = callGroups.trip[0]?.serviceJourney?.journeyPattern?.line;
      const parentSituation = callGroups.trip[0]?.situations;

      return {
        mode: line?.transportMode,
        publicCode: line?.publicCode,
        callGroups,
        situations: parentSituation,
      };
    },
    [serviceJourneyId, fromQuayId, toQuayId],
  );

  return usePollableResource<DepartureData>(getService, {
    initialValue: {
      callGroups: {
        passed: [],
        trip: [],
        after: [],
      },
      situations: [],
    },
    pollingTimeInSeconds,
    disabled,
  });
}

const onType = (
  obj: CallListGroup,
  key: keyof CallListGroup,
  call: EstimatedCall,
): CallListGroup => ({
  ...obj,
  [key]: obj[key].concat(call),
});
function groupAllCallsByQuaysInLeg(
  calls: EstimatedCall[],
  fromQuayId?: string,
  toQuayId?: string,
): CallListGroup {
  let isAfterStart = false;
  let isAfterStop = false;

  if (!fromQuayId && !toQuayId) {
    return {
      passed: [],
      trip: calls,
      after: [],
    };
  }

  return calls.reduce(
    (obj, call) => {
      // We are at start quay, update flag
      if (call.quay?.id === fromQuayId) {
        isAfterStart = true;
      }

      if (!isAfterStart && !isAfterStop) {
        // is the first group
        obj = onType(obj, 'passed', call);
      } else if (isAfterStart && !isAfterStop) {
        // is the current route (between start/stop)
        obj = onType(obj, 'trip', call);
      } else {
        // is quays after stop
        obj = onType(obj, 'after', call);
      }

      // We are at stop, update flag
      if (call.quay?.id === toQuayId) {
        isAfterStop = true;
      }

      return obj;
    },
    {
      passed: [],
      trip: [],
      after: [],
    } as CallListGroup,
  );
}
