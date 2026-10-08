import React from 'react';
import {ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {NativeTouchable} from '@atb/components/native-touchable';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';

type Props = {
  loadMoreTrips?: () => void;
  isSearching: boolean;
  tripsIsError: boolean;
  tripSearchEnabled: boolean;
};

export const LoadMoreButton = ({
  loadMoreTrips,
  isSearching,
  tripsIsError,
  tripSearchEnabled,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  if (tripsIsError || !tripSearchEnabled || isSearching || !loadMoreTrips)
    return null;

  return (
    <NativeTouchable
      variant="block"
      onPress={loadMoreTrips}
      style={styles.loadMoreButton}
      testID="loadMoreButton"
    >
      <ThemeIcon color="secondary" svg={ExpandMore} size="normal" />
      <ThemeText type="secondary" testID="resultsLoaded">
        {' '}
        {t(TripSearchTexts.results.fetchMore)}
      </ThemeText>
    </NativeTouchable>
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
}));
