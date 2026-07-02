import React from 'react';
import {View} from 'react-native';
import {ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {NativeBlockButton} from '@atb/components/native-button';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Loading} from '@atb/components/loading';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {useIsExperimentalEnabled} from '@atb/modules/experimental';

type Props = {
  loadMoreTrips?: () => void;
  isSearching: boolean;
  hasResults: boolean;
  tripsIsError: boolean;
  tripSearchEnabled: boolean;
};

export const LoadMoreButton = ({
  loadMoreTrips,
  isSearching,
  hasResults,
  tripsIsError,
  tripSearchEnabled,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const isNewTripSearch = useIsExperimentalEnabled('isNewTripSearchEnabled');

  if (tripsIsError || !tripSearchEnabled || (isNewTripSearch && isSearching))
    return null;

  if (isSearching && hasResults) {
    return (
      <View style={styles.loadMoreButton}>
        <View style={styles.loadingIndicator}>
          <Loading style={styles.loadingSpinner} />
          <ThemeText type="secondary" testID="searchingForResults">
            {t(TripSearchTexts.results.fetchingMore)}
          </ThemeText>
        </View>
      </View>
    );
  }

  // Can be removed when old ResultRow code branch is deleted
  if (isSearching) {
    return (
      <View style={styles.loadMoreButton}>
        <View style={styles.loadingIndicator}>
          <ThemeText type="secondary" testID="searchingForResults">
            {t(TripSearchTexts.searchState.searching)}
          </ThemeText>
        </View>
      </View>
    );
  }

  if (!loadMoreTrips) return null;

  return (
    <NativeBlockButton
      onPress={loadMoreTrips}
      style={styles.loadMoreButton}
      testID="loadMoreButton"
    >
      <ThemeIcon color="secondary" svg={ExpandMore} size="normal" />
      <ThemeText type="secondary" testID="resultsLoaded">
        {' '}
        {t(TripSearchTexts.results.fetchMore)}
      </ThemeText>
    </NativeBlockButton>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  loadMoreButton: {
    paddingVertical: theme.spacing.medium,
    marginBottom: theme.spacing.xLarge,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    marginRight: theme.spacing.medium,
  },
}));
