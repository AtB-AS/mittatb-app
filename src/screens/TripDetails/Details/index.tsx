import {NavigationProp, RouteProp, useIsFocused} from '@react-navigation/core';
import Axios, {AxiosError} from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {DetailsStackParams} from '..';
import {getSingleTripPattern} from '../../../api/trips';
import {ArrowLeft} from '../../../assets/svg/icons/navigation';
import Pagination from '../../../components/pagination';
import ThemeIcon from '../../../components/theme-icon';
import Header from '../../../ScreenHeader';
import {TripPattern} from '../../../sdk';
import {StyleSheet, useTheme} from '../../../theme';
import {TripDetailsTexts, useTranslation} from '../../../translations';
import usePollableResource from '../../../utils/use-pollable-resource';
import Trip from '../components/Trip';
import CompactMap from '../Map/CompactMap';

export type DetailsRouteParams = {
  tripPatternId?: string;
  tripPatterns?: TripPattern[];
  startIndex?: number;
};

export type DetailScreenRouteProp = RouteProp<DetailsStackParams, 'Details'>;

export type DetailScreenNavigationProp = NavigationProp<DetailsStackParams>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};
const Details: React.FC<Props> = (props) => {
  const {
    params: {tripPatternId, tripPatterns: initialTripPatterns, startIndex},
  } = props.route;
  const {theme} = useTheme();
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const styles = useStyle();

  const [currentIndex, setCurrentIndex] = useState<number>(startIndex ?? 0);

  const [tripPattern, setTripPattern] = useState<TripPattern | undefined>(
    initialTripPatterns ? initialTripPatterns[currentIndex] : undefined,
  );
  const [updatedTripPattern, , loading, error] = useTripPattern(
    currentIndex,
    tripPatternId,
    initialTripPatterns ? initialTripPatterns[currentIndex] : undefined,
    !isFocused,
  );
  const tripPatterns = initialTripPatterns ?? [updatedTripPattern];

  const showActivityIndicator = (!tripPattern && !error) || loading;

  useEffect(() => {
    const initialPatternForPage = tripPatterns[currentIndex];
    if (initialPatternForPage) {
      setTripPattern(
        updatedTripPattern?.id === initialPatternForPage.id
          ? updatedTripPattern
          : initialPatternForPage,
      );
    } else if (updatedTripPattern) {
      setTripPattern(updatedTripPattern);
    }
  }, [currentIndex, updatedTripPattern]);

  function navigate(page: number) {
    const newIndex = page - 1;
    if (page > tripPatterns.length || page < 1 || currentIndex === newIndex) {
      return;
    }
    setCurrentIndex(newIndex);
  }

  const {top: paddingTop} = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, {paddingTop}]}>
        <Header
          leftButton={{
            onPress: () => props.navigation.goBack(),
            accessible: true,
            accessibilityRole: 'button',
            accessibilityLabel: t(TripDetailsTexts.header.leftButton.a11yLabel),
            icon: <ThemeIcon svg={ArrowLeft} />,
          }}
          title={t(TripDetailsTexts.header.title)}
        />
      </View>
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
              mapLegs={tripPattern.legs}
              fromPlace={tripPattern.legs[0].fromPlace}
              toPlace={tripPattern.legs[tripPattern.legs.length - 1].toPlace}
              onExpand={() => {
                props.navigation.navigate('DetailsMap', {
                  legs: tripPattern.legs,
                  fromPlace: tripPattern.legs[0].fromPlace,
                  toPlace:
                    tripPattern.legs[tripPattern.legs.length - 1].toPlace,
                });
              }}
            />
            <View style={styles.paddedContainer}>
              {tripPatterns.length > 1 && (
                <Pagination
                  page={currentIndex + 1}
                  totalPages={tripPatterns.length}
                  onNavigate={navigate}
                  style={styles.pagination}
                  currentDate={tripPattern.legs[0]?.expectedStartTime}
                />
              )}
              <Trip tripPattern={tripPattern} error={error} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

function useTripPattern(
  currentIndex: number,
  id?: string,
  initialTripPattern?: TripPattern,
  disabled?: boolean,
) {
  const fetchTripPattern = useCallback(
    async function reload() {
      return await getSingleTripPattern(id ?? initialTripPattern?.id ?? '');
    },
    [currentIndex],
  );

  return usePollableResource<TripPattern | undefined, AxiosError>(
    fetchTripPattern,
    {
      initialValue: initialTripPattern,
      pollingTimeInSeconds: 30,
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
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.background.level0,
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
}));

export default Details;
