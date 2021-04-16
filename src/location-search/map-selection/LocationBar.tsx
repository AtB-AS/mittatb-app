import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import SvgError from '@atb/assets/svg/icons/status/Error';
import SvgInfo from '@atb/assets/svg/icons/status/Info';
import LocationIcon from '@atb/components/location-icon';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import React from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {ErrorType} from '@atb/api/utils';
import {Location} from '@atb/favorites/types';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  LocationSearchTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';

type Props = {
  location?: Location;
  error?: ErrorType;
  onSelect(): void;
  isSearching: boolean;
};

const LocationBar: React.FC<Props> = ({
  location,
  error,
  onSelect,
  isSearching,
}) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{flex: 1}} onPress={onSelect}>
        <View style={styles.innerContainer}>
          <View style={styles.locationContainer}>
            <Icon
              isSearching={isSearching}
              location={location}
              hasError={!!error}
            />
            <View style={{opacity: isSearching ? 0.6 : 1}}>
              <LocationText location={location} error={error} />
            </View>
          </View>
          {!isSearching && !!location && (
            <View style={styles.button}>
              <ThemeIcon svg={ArrowRight} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Icon: React.FC<{
  isSearching: boolean;
  location?: Location;
  hasError: boolean;
}> = ({isSearching, location, hasError}) => {
  const {theme} = useTheme();
  return (
    <View style={{marginHorizontal: 12}}>
      {isSearching ? (
        <ActivityIndicator animating={true} color={theme.text.colors.primary} />
      ) : location ? (
        <LocationIcon location={location} />
      ) : hasError ? (
        <ThemeIcon svg={SvgError} />
      ) : (
        <ThemeIcon svg={SvgInfo} />
      )}
    </View>
  );
};

const LocationText: React.FC<{
  location?: Location;
  error?: ErrorType;
}> = ({location, error}) => {
  const {t} = useTranslation();
  const {title, subtitle} = getLocationText(t, location, error);
  return (
    <>
      <ThemeText type="body__secondary">{title}</ThemeText>
      <ThemeText type="body__tertiary">{subtitle}</ThemeText>
    </>
  );
};

function getLocationText(
  t: TranslateFunction,
  location?: Location,
  error?: ErrorType,
): {title: string; subtitle: string} {
  if (location) {
    return {
      title: location.name,
      subtitle:
        (location.postalcode ? location.postalcode + ', ' : '') +
        location.locality,
    };
  }

  if (error) {
    switch (error) {
      case 'network-error':
      case 'timeout':
        return {
          title: t(
            LocationSearchTexts.mapSelection.messages.networkError.title,
          ),
          subtitle: t(
            LocationSearchTexts.mapSelection.messages.networkError.message,
          ),
        };
      default:
        return {
          title: t(LocationSearchTexts.mapSelection.messages.updateError.title),
          subtitle: t(
            LocationSearchTexts.mapSelection.messages.updateError.message,
          ),
        };
    }
  }

  return {
    title: t(LocationSearchTexts.mapSelection.messages.noResult.title),
    subtitle: t(LocationSearchTexts.mapSelection.messages.noResult.message),
  };
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacings.medium,
    backgroundColor: theme.background.header,
  },
  innerContainer: {
    paddingRight: theme.spacings.small,
    paddingVertical: theme.spacings.small,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.colors.background_0.backgroundColor,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  locationContainer: {flexDirection: 'row', alignItems: 'center', height: 44},
  button: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default LocationBar;
