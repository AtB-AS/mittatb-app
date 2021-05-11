import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {StyleSheet} from '../theme';
import LocationIcon from '../components/location-icon';
import insets from '../utils/insets';
import {ArrowUpLeft} from '../assets/svg/icons/navigation';
import {LocationSearchResult} from './types';
import {FavoriteIcon} from '../favorites';
import ThemeText from '../components/text';
import ThemeIcon from '../components/theme-icon';
import {screenReaderPause} from '../components/accessible-text';
import {LocationSearchTexts, useTranslation} from '@atb/translations';

type Props = {
  title?: string;
  locations: LocationSearchResult[];
  onSelect: (location: LocationSearchResult) => void;
  onPrefillText: (text: string) => void;
};

const LocationResults: React.FC<Props> = ({
  title,
  locations,
  onSelect,
  onPrefillText,
}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  return (
    <>
      {title && (
        <View accessibilityRole="header" style={styles.subHeader}>
          <ThemeText type="body__secondary">{title}</ThemeText>
        </View>
      )}
      <View>
        {locations.map(mapToVisibleSearchResult).map((searchResult) => (
          <View style={styles.rowContainer} key={searchResult.key}>
            <View style={styles.locationButtonContainer}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={
                  searchResult.location.label + screenReaderPause
                }
                accessibilityHint={t(
                  LocationSearchTexts.locationResults.a11y.activateToUse,
                )}
                accessibilityRole="button"
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
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={t(
                LocationSearchTexts.locationResults.a11y.activateToSearch(
                  searchResult.prefill,
                ),
              )}
              accessibilityRole="button"
              hitSlop={insets.all(8)}
              onPress={() => onPrefillText(searchResult.prefill + ' ')}
            >
              <ThemeIcon svg={ArrowUpLeft} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </>
  );
};

function mapToVisibleSearchResult(searchResult: LocationSearchResult) {
  const location = searchResult.location;
  if (!searchResult.favoriteInfo) {
    return {
      key: location.id,
      selectable: searchResult,
      location,
      text: location.name,
      subtext: location.locality,
      prefill: location.name,
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
    prefill: location.name,
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
