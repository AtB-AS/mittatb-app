import React, {useRef} from 'react';
import {View, TouchableOpacity, NativeMethods} from 'react-native';
import {StyleSheet} from '../theme';
import LocationIcon from '../components/location-icon';
import insets from '../utils/insets';
import {LocationSearchResult} from './types';
import {FavoriteIcon} from '../favorites';
import ThemeText from '../components/text';
import {screenReaderPause} from '../components/accessible-text';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import {Location} from '@atb/favorites/types';

type Props = {
  title?: string;
  locations: LocationSearchResult[];
  onSelect: (location: LocationSearchResult) => void;
  onScrollTo: (nativeElement: NativeMethods) => void;
};

const LocationResults: React.FC<Props> = ({
  title,
  locations,
  onSelect,
  onScrollTo,
}) => {
  const styles = useThemeStyles();
  return (
    <>
      {title && (
        <View accessibilityRole="header" style={styles.subHeader}>
          <ThemeText type="body__secondary">{title}</ThemeText>
        </View>
      )}
      <View>
        {locations.map(mapToVisibleSearchResult).map((searchResult) => (
          <SearchResultRow
            key={searchResult.key}
            searchResult={searchResult}
            onScrollTo={onScrollTo}
            onSelect={onSelect}
          />
        ))}
      </View>
    </>
  );
};

function SearchResultRow({
  searchResult,
  onSelect,
  onScrollTo,
}: {
  searchResult: VisibleSearchResult;
  onSelect: (location: LocationSearchResult) => void;
  onScrollTo: (nativeElement: NativeMethods) => void;
}) {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const buttonRef = useRef<TouchableOpacity>(null);

  return (
    <View style={styles.rowContainer}>
      <View style={styles.locationButtonContainer}>
        <TouchableOpacity
          ref={buttonRef}
          accessible={true}
          accessibilityLabel={searchResult.location.label + screenReaderPause}
          accessibilityHint={t(
            LocationSearchTexts.locationResults.a11y.activateToUse,
          )}
          accessibilityRole="button"
          onFocus={() => buttonRef.current && onScrollTo(buttonRef.current)}
          hitSlop={insets.symmetric(8, 1)}
          onPress={() => onSelect(searchResult.selectable)}
          style={styles.locationButton}
        >
          <View style={{flexDirection: 'column'}}>
            {searchResult.emoji ? (
              <FavoriteIcon favorite={searchResult} />
            ) : (
              <LocationIcon
                location={searchResult.location}
                fill={String(styles.locationIcon.backgroundColor)}
                multiple={true}
              />
            )}
          </View>
          <View style={styles.locationTextContainer}>
            <ThemeText style={styles.locationName}>
              {searchResult.text}
            </ThemeText>
            <ThemeText style={styles.locality}>
              {searchResult.subtext}
            </ThemeText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type VisibleSearchResult = {
  key: string;
  selectable: LocationSearchResult;
  location: Location;
  text: string;
  subtext: string;
  emoji?: string;
};

function mapToVisibleSearchResult(
  searchResult: LocationSearchResult,
): VisibleSearchResult {
  const location = searchResult.location;
  if (!searchResult.favoriteInfo) {
    return {
      key: location.id,
      selectable: searchResult,
      location,
      text: location.name,
      subtext: location.locality,
    };
  }

  const text = searchResult.favoriteInfo.name ?? location.name;
  const subtext = searchResult.favoriteInfo.name
    ? `${location.name}, ${location.locality}`
    : location.locality;

  return {
    key: searchResult.favoriteInfo.id,
    selectable: searchResult,
    location,
    text,
    subtext,
    emoji: searchResult.favoriteInfo.emoji,
  };
}

export default LocationResults;

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  subHeader: {
    padding: theme.spacings.medium,
    margin: 0,
  },
  subLabel: {
    color: theme.text.colors.secondary,
    fontSize: 12,
    marginRight: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  locationButtonContainer: {
    padding: 12,
    flex: 1,
    minHeight: 84,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    marginLeft: 16,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  locality: {
    fontSize: 12,
    marginTop: 4,
  },
  locationIcon: {
    backgroundColor: theme.text.colors.primary,
  },
}));
