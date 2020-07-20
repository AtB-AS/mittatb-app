import React from 'react';
import {
  RefreshControl,
  Text,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  ScrollViewProps,
} from 'react-native';
import MessageBox from '../../message-box';
import {TripPattern} from '../../sdk';
import {StyleSheet, useTheme} from '../../theme';
import {AssistantScreenNavigationProp} from './';
import ResultItem from './ResultItem';

type Props = Animated.AnimatedProps<ScrollViewProps> & {
  tripPatterns: TripPattern[] | null;
  isSearching: boolean;
  onRefresh: () => void;
  navigation: AssistantScreenNavigationProp;
  onDetailsPressed(tripPattern: TripPattern): void;
  onScroll?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | undefined;
  offsetTop?: number;
};

export type ResultTabParams = {
  [key: string]: {tripPattern: TripPattern};
};

const Results: React.FC<Props> = ({
  tripPatterns,
  isSearching,
  onRefresh,
  onDetailsPressed,
  onScroll,
  offsetTop,
  style,
  ...rest
}) => {
  const {theme} = useTheme();
  const styles = useThemeStyles(theme);

  if (!tripPatterns && !isSearching) {
    return null;
  }

  if (!isSearching && !tripPatterns?.length) {
    return (
      <View style={[styles.container, {marginTop: offsetTop}]}>
        <MessageBox>
          <Text style={styles.infoBoxText}>
            Vi fant dessverre ingen reiseruter som passer til ditt søk.
            Vennligst prøv et annet avreisested eller destinasjon.
          </Text>
        </MessageBox>
      </View>
    );
  }

  return (
    <Animated.ScrollView
      {...rest}
      contentContainerStyle={[styles.container, style]}
      refreshControl={
        <RefreshControl
          refreshing={isSearching}
          onRefresh={onRefresh}
          progressViewOffset={300}
        />
      }
      onScroll={onScroll}
      contentInset={{
        top: offsetTop,
      }}
    >
      {tripPatterns?.map((item, i) => (
        <ResultItem
          key={String(item.id ?? i)}
          tripPattern={item}
          onDetailsPressed={onDetailsPressed}
        />
      ))}
    </Animated.ScrollView>
  );
};

export default Results;

const useThemeStyles = StyleSheet.createTheme((theme) => ({
  scrollContainerOuter: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  infoBoxText: {fontSize: 16},
  spinner: {height: 280},
  detailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    zIndex: 1,
    position: 'absolute',
  },
  button: {
    zIndex: 1,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPager: {height: 280, width: '100%'},
  timeText: {
    fontSize: 28,
    color: theme.text.primary,
  },
  locationText: {
    fontSize: 12,
    color: theme.text.primary,
    marginTop: 8,
  },
}));
