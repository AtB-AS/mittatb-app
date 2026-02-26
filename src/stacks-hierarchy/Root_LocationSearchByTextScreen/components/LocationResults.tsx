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
import {NativeButton} from '@atb/components/native-button';

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
          <ThemeText typography="body__s">{title}</ThemeText>
        </View>
      )}
      <View>
        {locations.map(mapToVisibleSearchResult).map((searchResult, idx) => (
          <View style={styles.rowContainer} key={searchResult.key}>
            <View style={styles.locationButtonContainer}>
              <NativeButton
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
                    typography="body__m__strong"
                    testID={testIDItemPrefix + idx + 'Name'}
                  >
                    {searchResult.text}
                  </ThemeText>
                  <ThemeText typography="body__xs" style={styles.locality}>
                    {searchResult.subtext}
                  </ThemeText>
                </View>
              </NativeButton>
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
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  locationButtonContainer: {
    padding: theme.spacing.medium,
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    marginLeft: theme.spacing.medium,
  },
  locality: {
    marginTop: theme.spacing.xSmall,
  },
  locationIcon: {
    backgroundColor: theme.color.foreground.dynamic.primary,
  },
}));
