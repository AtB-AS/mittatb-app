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

export type DetailsRouteParams = {
  tripPatterns: TripPattern[];
  currentIndex: number;
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
    params: {tripPatterns, currentIndex: startIndex},
  } = props.route;
  if (!tripPatterns || tripPatterns.length < startIndex + 1) {
    return null;
  }
  const {theme, themeName} = useTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);

  const styles = useStyle();

  function navigate(page: number) {
    if (page > tripPatterns.length || page < 1) {
      return;
    }
    const newIndex = page - 1;
    setCurrentIndex(newIndex);
  }

  const initialTripPattern = tripPatterns[currentIndex];
  const isFocused = useIsFocused();
  const [updatedTripPattern, , isLoading, error] = useTripPattern(
    initialTripPattern.id ?? '',
    initialTripPattern,
    !isFocused,
  );
  const tripPattern = updatedTripPattern ?? tripPatterns[currentIndex]; // Fallback to initial

  const showActivityIndicator = (!tripPattern || isLoading) && !error;

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
                totalPages={tripPatterns.length}
                onNavigate={navigate}
                style={styles.pagination}
              ></Pagination>
              <View style={styles.line} />
              <Messages error={error} shortTime={shortTime} />
              {tripPattern.legs.map((leg, key) => {
                return <TripSection key={key} {...leg} />;
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
        <ThemeIcon style={styles.leftIcon} svg={Duration} />
        <ThemeText>Reisetid: {secondsToDuration(duration)}</ThemeText>
      </View>
      <View style={styles.summaryDetail}>
        <ThemeIcon style={styles.leftIcon} svg={WalkingPerson} />
        <ThemeText>Gangavstand: {walkDistance.toFixed()} m</ThemeText>
      </View>
    </View>
  );
};
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
    height: '100%',
    backgroundColor: hexToRgba(theme.background.level0, 0.5),
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

function useTripPattern(
  tripPatternId: string,
  initialTripPattern?: TripPattern,
  disabled?: boolean,
) {
  const fetchTripPattern = useCallback(
    async function reload() {
      return await getSingleTripPattern(tripPatternId);
    },
    [tripPatternId],
  );
  return usePollableResource<TripPattern | null, AxiosError>(fetchTripPattern, {
    initialValue: initialTripPattern ?? null,
    pollingTimeInSeconds: 60,
    filterError: (err) => !Axios.isCancel(err),
    disabled,
  });
}

export default Details;
