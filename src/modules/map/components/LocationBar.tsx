import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import SvgError from '@atb/assets/svg/mono-icons/status/Error';
import SvgInfo from '@atb/assets/svg/mono-icons/status/Info';
import {LocationIcon} from '@atb/components/location-icon';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import React, {useMemo} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {GeoLocation, Location, SearchLocation} from '@atb/modules/favorites';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {
  LocationSearchTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {coordinatesDistanceInMetres} from '@atb/utils/location';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {Coordinates} from '@atb/utils/coordinates';
import {NativeBlockButton} from '@atb/components/native-button';
import {useReverseGeocoderQuery} from '@atb/modules/geocoder';
import {RequestError} from '@atb/api/utils';

type Props = {
  coordinates?: Coordinates;
  onSelect?: (selectedLocation: GeoLocation | SearchLocation) => void;
};

/**
 * How many meters from the current location GPS coordinates can the map arrow
 * icon be and still be considered "My position"
 */
const CURRENT_LOCATION_THRESHOLD_METERS = 30;

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];
const getBackgroundColor = (theme: Theme) => theme.color.background.neutral[0];

export const LocationBar: React.FC<Props> = ({coordinates, onSelect}) => {
  const styles = useStyles();
  const {location: geolocation} = useGeolocationContext();

  const {
    data,
    isLoading,
    error: queryError,
  } = useReverseGeocoderQuery(coordinates || null);
  const error = queryError as RequestError | null;
  const closestLocation = data?.[0];

  const onPress = () => {
    if (location && onSelect) {
      onSelect(location);
    }
  };

  const location = useMemo(() => {
    if (!coordinates) return undefined;
    if (!geolocation) return closestLocation;

    const pinIsCloseToGeolocation =
      coordinatesDistanceInMetres(geolocation.coordinates, coordinates) <
      CURRENT_LOCATION_THRESHOLD_METERS;

    return pinIsCloseToGeolocation ? geolocation : closestLocation;
  }, [geolocation, closestLocation, coordinates]);

  return (
    <View style={styles.container}>
      <NativeBlockButton style={{flex: 1}} onPress={onPress}>
        <View style={styles.innerContainer}>
          <View style={styles.locationContainer}>
            <Icon
              location={location}
              isLoading={isLoading}
              hasError={!!error}
            />
            <View style={{opacity: isLoading ? 0.6 : 1}}>
              <LocationText
                location={location}
                isLoading={isLoading}
                error={error}
              />
            </View>
          </View>
          {!isLoading && !!location && (
            <View style={styles.button}>
              <ThemeIcon svg={ArrowRight} />
            </View>
          )}
        </View>
      </NativeBlockButton>
    </View>
  );
};

const Icon: React.FC<{
  location?: Location;
  isLoading: boolean;
  hasError: boolean;
}> = ({isLoading, location, hasError}) => {
  const {theme} = useThemeContext();
  return (
    <View style={{marginHorizontal: 12}}>
      {isLoading ? (
        <ActivityIndicator
          animating={true}
          color={getBackgroundColor(theme).foreground.primary}
        />
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
  isLoading?: boolean;
  error?: RequestError | null;
}> = ({location, error, isLoading}) => {
  const {t} = useTranslation();
  const {title, subtitle} = getLocationText(t, location, isLoading, error);
  return (
    <>
      <ThemeText typography="body__s">{title}</ThemeText>
      {subtitle && <ThemeText typography="body__xs">{subtitle}</ThemeText>}
    </>
  );
};

function getLocationText(
  t: TranslateFunction,
  location?: Location,
  isLoading?: boolean,
  error?: RequestError | null,
): {title: string; subtitle?: string} {
  if (location) {
    return {
      title: location.name,
      subtitle:
        location.resultType === 'geolocation'
          ? undefined
          : (location.postalcode ? location.postalcode + ', ' : '') +
            location.locality,
    };
  }

  if (isLoading) {
    return {
      title: t(LocationSearchTexts.mapSelection.messages.loading.title),
      subtitle: undefined,
    };
  }

  if (error?.kind) {
    switch (error.kind) {
      case 'AXIOS_NETWORK_ERROR':
      case 'AXIOS_TIMEOUT':
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
    padding: theme.spacing.medium,
    backgroundColor: getThemeColor(theme).background,
  },
  innerContainer: {
    paddingRight: theme.spacing.small,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.border.radius.regular,
    backgroundColor: getBackgroundColor(theme).background,
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
