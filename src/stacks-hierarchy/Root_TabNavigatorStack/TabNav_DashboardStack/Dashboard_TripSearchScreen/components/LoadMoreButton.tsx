import React from 'react';
import {View} from 'react-native';
import {ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {NativeBlockButton} from '@atb/components/native-button';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Loading} from '@atb/components/loading';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';

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

  if (tripsIsError || !tripSearchEnabled) return null;

  const renderContent = () => {
    if (isSearching && hasResults) {
      return (
        <View style={styles.loadingIndicator}>
          <Loading style={styles.loadingSpinner} />
          <ThemeText type="secondary" testID="searchingForResults">
            {t(TripSearchTexts.results.fetchingMore)}
          </ThemeText>
        </View>
      );
    }

    if (isSearching) {
      return (
        <View style={styles.loadingIndicator}>
          <ThemeText type="secondary" testID="searchingForResults">
            {t(TripSearchTexts.searchState.searching)}
          </ThemeText>
        </View>
      );
    }

    if (!loadMoreTrips) return null;

    return (
      <>
        <ThemeIcon color="secondary" svg={ExpandMore} size="normal" />
        <ThemeText type="secondary" testID="resultsLoaded">
          {' '}
          {t(TripSearchTexts.results.fetchMore)}
        </ThemeText>
      </>
    );
  };

  return (
    <NativeBlockButton
      onPress={loadMoreTrips}
      disabled={isSearching}
      style={[styles.loadMoreButton, {opacity: 1}]}
      testID="loadMoreButton"
    >
      {renderContent()}
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
