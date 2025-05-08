import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {getVenueIconTypes, LocationIcon} from '@atb/components/location-icon';
import {insets} from '@atb/utils/insets';
import {LocationSearchResultType} from '../types';
import {FavoriteIcon} from '@atb/modules/favorites';
import {ThemeText} from '@atb/components/text';
import {screenReaderPause} from '@atb/components/text';
import {
  LocationSearchTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {SearchLocation} from '@atb/modules/favorites';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type Props = {
  title?: string;
  locations: LocationSearchResultType[];
  onSelect: (location: LocationSearchResultType) => void;
  testIDItemPrefix: string;
};

export const LocationResults: React.FC<Props> = ({
  title,
  locations,
  onSelect,
  testIDItemPrefix,
}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  return (
    <>
      {title && (
        <View accessibilityRole="header" style={styles.subHeader}>
          <ThemeText typography="body__secondary">{title}</ThemeText>
        </View>
      )}
      <View>
        {locations.map(mapToVisibleSearchResult).map((searchResult, idx) => (
          <View style={styles.rowContainer} key={searchResult.key}>
            <View style={styles.locationButtonContainer}>
              <PressableOpacity
                accessible={true}
                accessibilityLabel={
                  getLocationIconAccessibilityLabel(searchResult.location, t) +
                  searchResult.location.label +
                  screenReaderPause
                }
                accessibilityHint={t(
                  LocationSearchTexts.locationResults.a11y.activateToUse,
                )}
                accessibilityRole="button"
                hitSlop={insets.symmetric(8, 1)}
                onPress={() => onSelect(searchResult.selectable)}
                style={styles.locationButton}
                testID={testIDItemPrefix + idx}
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
                  <ThemeText
                    style={styles.locationName}
                    testID={testIDItemPrefix + idx + 'Name'}
                  >
                    {searchResult.text}
                  </ThemeText>
                  <ThemeText style={styles.locality}>
                    {searchResult.subtext}
                  </ThemeText>
                </View>
              </PressableOpacity>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

function mapToVisibleSearchResult(searchResult: LocationSearchResultType) {
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

const getLocationIconAccessibilityLabel = (
  {layer, category}: SearchLocation,
  t: TranslateFunction,
) => {
  switch (layer) {
    case 'venue':
      return getVenueIconTypes(category)
        .map((c) => t(LocationSearchTexts.locationResults.category[c]))
        .join(',');
    case 'address':
    default:
      return t(LocationSearchTexts.locationResults.category.location);
  }
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  subHeader: {
    padding: theme.spacing.medium,
    margin: 0,
  },
  subLabel: {
    color: theme.color.foreground.dynamic.secondary,
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
    backgroundColor: theme.color.foreground.dynamic.primary,
  },
}));
