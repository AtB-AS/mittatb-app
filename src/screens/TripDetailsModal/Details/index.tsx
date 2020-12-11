import React, {useState, useCallback, useEffect} from 'react';
import {Leg, Situation, TripPattern} from '../../../sdk';
import {RouteProp, NavigationProp, useIsFocused} from '@react-navigation/core';
import {DetailsModalStackParams} from '..';
import CompactMap from '../Map/CompactMap';
import {useTheme, StyleSheet} from '../../../theme';

import Header from '../../../ScreenHeader';
import {View, ActivityIndicator} from 'react-native';
import ThemeIcon from '../../../components/theme-icon';
import {ScrollView} from 'react-native-gesture-handler';
import Pagination from './Pagination';
import ThemeText from '../../../components/text';
import {ArrowLeft} from '../../../assets/svg/icons/navigation';
import Axios, {AxiosError} from 'axios';
import MessageBox from '../../../message-box';
import {getAxiosErrorType} from '../../../api/utils';
import {secondsToDuration} from '../../../utils/date';
import {
  Duration,
  WalkingPerson,
} from '../../../assets/svg/icons/transportation';
import {getSingleTripPattern} from '../../../api/trips';
import usePollableResource from '../../../utils/use-pollable-resource';
import hexToRgba from 'hex-to-rgba';
import TripSection from './TripLeg';
import {is} from 'date-fns/locale';

export type DetailsRouteParams = {
  initialTripPatterns: TripPattern[];
  startIndex: number;
};

export type DetailScreenRouteProp = RouteProp<
  DetailsModalStackParams,
  'Details'
>;

export type DetailScreenNavigationProp = NavigationProp<
  DetailsModalStackParams
>;
// @TODO User setting?
const TIME_LIMIT_IN_MINUTES = 3;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};
const Details: React.FC<Props> = (props) => {
  const {
    params: {initialTripPatterns: initialTripPatterns, startIndex: startIndex},
  } = props.route;

  const {theme, themeName} = useTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);

  const isFocused = useIsFocused();

  const styles = useStyle();

  function navigate(page: number) {
    if (page > initialTripPatterns.length || page < 1) {
      return;
    }
    const newIndex = page - 1;
    setCurrentIndex(newIndex);
  }
  const [tripPattern, setTripPattern] = useState<TripPattern | undefined>(
    initialTripPatterns[currentIndex],
  );
  const [updatedTripPattern, , loading, error] = useTripPattern(
    currentIndex,
    initialTripPatterns[currentIndex],
    !isFocused,
  );
  const showActivityIndicator = (!tripPattern && !error) || loading;

  useEffect(() => {
    const currentPagePatternId = initialTripPatterns[currentIndex].id;
    setTripPattern(
      updatedTripPattern?.id === currentPagePatternId
        ? updatedTripPattern
        : initialTripPatterns[currentIndex],
    );
  }, [currentIndex, updatedTripPattern]);

  const [shortTime, setShortTime] = useState(false);

  return (
    <View style={styles.container}>
      <Header
        leftButton={{
          onPress: () => props.navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: 'Gå tilbake',
          icon: <ThemeIcon svg={ArrowLeft} />,
        }}
        title="Reisedetaljer"
        style={styles.header}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        bounces={false}
      >
        {showActivityIndicator && (
          <ActivityIndicator
            style={styles.activityIndicator}
            color={theme.text.colors.faded}
            animating={true}
            size="large"
          />
        )}
        {tripPattern && (
          <>
            <CompactMap
              legs={tripPattern.legs}
              darkMode={themeName === 'dark'}
              onExpand={() => {
                props.navigation.navigate('DetailsMap', {
                  legs: tripPattern.legs,
                });
              }}
            />
            <View style={styles.paddedContainer}>
              <Pagination
                page={currentIndex + 1}
                totalPages={initialTripPatterns.length}
                onNavigate={navigate}
                style={styles.pagination}
              ></Pagination>
              <View style={styles.line} />
              <Messages error={error} shortTime={shortTime} />
              {tripPattern.legs.map((leg, index) => {
                return (
                  <TripSection
                    key={index}
                    isFirst={index == 0}
                    isIntermediate={isIntermediateTravelLeg(
                      index,
                      tripPattern.legs,
                    )}
                    isLast={index == tripPattern.legs.length - 1}
                    {...leg}
                  />
                );
              })}
              <View style={styles.line} />
              <Summary {...tripPattern} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};
type JourneyMessagesProps = {
  shortTime: boolean;
  error?: AxiosError;
};
const Messages: React.FC<JourneyMessagesProps> = ({error, shortTime}) => {
  const styles = useStyle();
  return (
    <>
      {shortTime && (
        <MessageBox
          containerStyle={styles.message}
          type="info"
          message="Vær oppmerksom på kort byttetid."
        />
      )}
      {error && (
        <MessageBox
          containerStyle={styles.message}
          type="warning"
          message={translateError(error)}
        />
      )}
    </>
  );
};
function translateError(error: AxiosError): string {
  const errorType = getAxiosErrorType(error);
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return 'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil.';
    default:
      return 'Vi kunne ikke oppdatere reiseforslaget ditt. Det kan hende reisen har endra seg eller er utdatert?';
  }
}

const Summary: React.FC<TripPattern> = ({walkDistance, duration}) => {
  const styles = useStyle();
  return (
    <View style={styles.summary}>
      <View style={styles.summaryDetail}>
        <ThemeIcon colorType="faded" style={styles.leftIcon} svg={Duration} />
        <ThemeText color="faded">
          Reisetid: {secondsToDuration(duration)}
        </ThemeText>
      </View>
      <View style={styles.summaryDetail}>
        <ThemeIcon
          colorType="faded"
          style={styles.leftIcon}
          svg={WalkingPerson}
        />
        <ThemeText color="faded">
          Gangavstand: {walkDistance.toFixed()} m
        </ThemeText>
      </View>
    </View>
  );
};
function nextLeg(curent: number, legs: Leg[]): Leg | undefined {
  return legs[curent + 1];
}

function isIntermediateTravelLeg(index: number, legs: Leg[]) {
  const next = nextLeg(index, legs);
  if (!next) return false;
  if (next.mode === 'foot') return false;
  return true;
}
function useTripPattern(
  currentIndex: number,
  initialTripPattern?: TripPattern,
  disabled?: boolean,
) {
  const fetchTripPattern = useCallback(
    async function reload() {
      return await getSingleTripPattern(initialTripPattern?.id ?? '');
    },
    [currentIndex],
  );

  return usePollableResource<TripPattern | undefined, AxiosError>(
    fetchTripPattern,
    {
      initialValue: initialTripPattern,
      pollingTimeInSeconds: 10,
      filterError: (err) => !Axios.isCancel(err),
      disabled,
    },
  );
}
const useStyle = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.background.header,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background.level0,
  },
  scrollView: {
    flex: 1,
  },
  paddedContainer: {
    paddingHorizontal: theme.spacings.medium,
  },
  activityIndicator: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  scrollViewContent: {},
  pagination: {
    marginVertical: theme.spacings.medium,
  },
  line: {
    flex: 1,
    height: theme.border.width.slim,
    backgroundColor: theme.background.level1,
  },
  message: {
    marginTop: theme.spacings.medium,
  },
  summary: {
    marginVertical: theme.spacings.medium,
  },
  summaryDetail: {
    padding: theme.spacings.medium,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacings.small,
  },
}));

export default Details;
