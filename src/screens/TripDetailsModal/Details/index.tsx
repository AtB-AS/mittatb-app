import React, {useState, useCallback, useEffect} from 'react';
import {TripPattern} from '../../../sdk';
import {RouteProp, NavigationProp, useIsFocused} from '@react-navigation/core';
import {DetailsModalStackParams} from '..';
import CompactMap from '../Map/CompactMap';
import {useTheme, StyleSheet} from '../../../theme';

import Header from '../../../ScreenHeader';
import {View, ActivityIndicator} from 'react-native';
import ThemeIcon from '../../../components/theme-icon';
import {ScrollView} from 'react-native-gesture-handler';
import Pagination from '../../../components/pagination';
import Axios, {AxiosError} from 'axios';
import {getSingleTripPattern} from '../../../api/trips';
import usePollableResource from '../../../utils/use-pollable-resource';
import Trip from '../components/Trip';
import {TripDetailsTexts, useTranslation} from '../../../translations';
import {Close} from '../../../assets/svg/icons/actions';

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

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};
const Details: React.FC<Props> = (props) => {
  const {
    params: {initialTripPatterns: initialTripPatterns, startIndex: startIndex},
  } = props.route;

  const {theme, themeName} = useTheme();
  const {t} = useTranslation();
  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);

  const isFocused = useIsFocused();

  const styles = useStyle();
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

  function navigate(page: number) {
    const newIndex = page - 1;
    if (
      page > initialTripPatterns.length ||
      page < 1 ||
      currentIndex === newIndex
    ) {
      return;
    }
    setCurrentIndex(newIndex);
  }

  return (
    <View style={styles.container}>
      <Header
        leftButton={{
          onPress: () => props.navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: t(TripDetailsTexts.header.leftButton.a11yLabel),
          icon: <ThemeIcon svg={Close} />,
        }}
        title={t(TripDetailsTexts.header.title)}
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
}));

export default Details;
