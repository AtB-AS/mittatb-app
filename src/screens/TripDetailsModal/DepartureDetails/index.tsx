import React, {useEffect, useState} from 'react';
import {Leg, EstimatedCall} from '../../../sdk';
import {DetailsModalStackParams, DetailsModalNavigationProp} from '..';
import {RouteProp} from '@react-navigation/native';
import {View, Text, ActivityIndicator} from 'react-native';
import DotIcon from '../../../assets/svg/DotIcon';
import {formatToClock} from '../../../utils/date';
import colors from '../../../theme/colors';
import LocationRow from '../LocationRow';
import {StyleSheet} from '../../../theme';
import ScreenHeader from '../../../ScreenHeader';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Dash from 'react-native-dash';
import {getDepartures} from '../../../api/serviceJourney';
import UnfoldLess from './svg/UnfoldLess';
import UnfoldMore from './svg/UnfoldMore';
import ChevronLeftIcon from '../../../assets/svg/ChevronLeftIcon';
import TransportationIcon from '../../../components/transportation-icon';
import {getQuayName} from '../../../utils/transportation-names';

export type DepartureDetailsRouteParams = {
  title: string;
  serviceJourneyId: string;
  fromQuayId?: string;
  toQuayId?: string;
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
  const {title, serviceJourneyId, fromQuayId, toQuayId} = route.params;
  const styles = useStopsStyle();

  const [callGroups, isLoading] = useGroupedCallList(
    serviceJourneyId,
    fromQuayId,
    toQuayId,
  );

  const content = isLoading ? (
    <ActivityIndicator animating={true} size="large" style={styles.spinner} />
  ) : (
    <ScrollView style={styles.scrollView}>
      <View style={styles.allGroups}>
        {mapGroup(callGroups, (name, group) => (
          <CallGroup
            key={group[0]?.quay.id ?? name}
            calls={group}
            type={name}
          />
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        onClose={() => navigation.goBack()}
        iconElement={<ChevronLeftIcon />}
      >
        {title}
      </ScreenHeader>
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
};
function CallGroup({type, calls}: CallGroupProps) {
  const isOnRoute = type === 'trip';
  const isBefore = type === 'passed';
  const showCollapsable = isBefore && calls.length > 1;
  const dashColor = isOnRoute ? colors.primary.green : colors.general.gray200;
  const isStartPlace = (i: number) => isOnRoute && i === 0;
  const shouldDropMarginBottom = (i: number) =>
    (type === 'after' || isOnRoute) && i == calls.length - 1;
  const shouldHaveMarginTop = (i: number) => type === 'after' && i == 0;

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

  return (
    <View>
      <Dash
        dashGap={4}
        dashThickness={8}
        dashLength={8}
        dashColor={dashColor}
        style={styles.dash}
        dashStyle={{borderRadius: 50}}
      />

      {items.map((call, i) => (
        <>
          <LocationRow
            icon={
              isStartPlace(i) ? (
                <TransportationIcon
                  mode={call.serviceJourney.journeyPattern.line.transportMode}
                  isLive={call.realtime}
                  height={20}
                />
              ) : (
                <DotIcon fill={dashColor} />
              )
            }
            rowStyle={[
              styles.item,
              shouldDropMarginBottom(i) ? {marginBottom: 0} : undefined,
              shouldHaveMarginTop(i) ? {marginTop: 24} : undefined,
            ]}
            location={getQuayName(call.quay)}
            time={formatToClock(
              call.aimedDepartureTime ?? call.expectedDepartureTime,
            )}
            textStyle={[
              styles.textStyle,
              !isOnRoute ? styles.textStyleFaded : undefined,
            ]}
          />
          {i === 0 && collapseButton}
        </>
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
  const text = <Text style={styles.text}>{numberOfStops} Mellomstopp</Text>;
  const child = collapsed ? (
    <>
      <UnfoldMore />
      {text}
    </>
  ) : (
    <>
      <UnfoldLess />
      {text}
    </>
  );
  return (
    <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
      <View style={styles.container}>{child}</View>
    </TouchableOpacity>
  );
}
const useCollapseButtonStyle = StyleSheet.createThemeHook(theme => ({
  container: {
    backgroundColor: theme.background.modal_Level2,
    flexDirection: 'row',
    marginBottom: 28,
    marginLeft: 81,
  },
  text: {
    marginLeft: 12,
  },
}));

const useStopsStyle = StyleSheet.createThemeHook(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.modal_Level2,
  },
  allGroups: {
    marginBottom: 250,
  },
  spinner: {height: 280},
  dash: {
    marginLeft: 87,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
  item: {
    marginBottom: 28,
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

type CallListGroup = {
  passed: EstimatedCall[];
  trip: EstimatedCall[];
  after: EstimatedCall[];
};

function useGroupedCallList(
  serviceJourneyId: string,
  fromQuayId?: string,
  toQuayId?: string,
): [CallListGroup, boolean] {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [serviceJourney, setJourney] = useState<CallListGroup>({
    passed: [],
    trip: [],
    after: [],
  });

  useEffect(() => {
    async function getServiceJourneyDepartures() {
      setIsLoading(true);
      try {
        const deps = await getDepartures(serviceJourneyId);
        setJourney(groupAllCallsByQuaysInLeg(deps, fromQuayId, toQuayId));
      } finally {
        setIsLoading(false);
      }
    }
    getServiceJourneyDepartures();
  }, [serviceJourneyId]);

  return [serviceJourney, isLoading];
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
      if (call.quay.id === fromQuayId) {
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
      if (call.quay.id === toQuayId) {
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
