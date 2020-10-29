import React from 'react';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import colors from '../../theme/colors';
import {ArrowRight} from '../../assets/svg/icons/navigation';
import {Info, Warning} from '../../assets/svg/icons/status';
import {Location} from '../../favorites/types';
import LocationIcon from '../../components/location-icon';
import {StyleSheet} from '../../theme';
import shadows from '../../components/map/shadows';
import {ErrorType} from '../../api/utils';
import ThemeText from '../../components/text';

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
              <ArrowRight />
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
  const styles = useStyles();
  return (
    <View style={{marginHorizontal: 12}}>
      {isSearching ? (
        <ActivityIndicator animating={true} color={colors.general.gray200} />
      ) : location ? (
        <LocationIcon location={location} />
      ) : hasError ? (
        <Warning />
      ) : (
        <Info />
      )}
    </View>
  );
};

const LocationText: React.FC<{
  location?: Location;
  error?: ErrorType;
}> = ({location, error}) => {
  const styles = useStyles();
  const {title, subtitle} = getLocationText(location, error);

  return (
    <>
      <ThemeText style={styles.title}>{title}</ThemeText>
      <ThemeText style={styles.subtitle}>{subtitle}</ThemeText>
    </>
  );
};

function getLocationText(
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
          title: 'Vi kan ikke oppdatere kartet.',
          subtitle: 'Nettforbindelsen din mangler eller er ustabil.',
        };
      default:
        return {
          title: 'Oops - vi feila med å oppdatere kartet.',
          subtitle: 'Supert om du prøver igjen 🤞',
        };
    }
  }

  return {
    title: 'Akkurat her finner vi ikke noe reisetilbud.',
    subtitle: 'Er du i nærheten av en adresse, vei eller stoppested?',
  };
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    ...shadows,
  },
  innerContainer: {
    paddingRight: theme.spacings.small,
    paddingVertical: theme.spacings.small,
    borderRadius: theme.border.borderRadius.regular,
    backgroundColor: theme.background.level0,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  locationContainer: {flexDirection: 'row', alignItems: 'center', height: 44},
  title: {
    fontSize: theme.text.sizes.lead,
    lineHeight: theme.text.lineHeight.body,
  },
  subtitle: {
    fontSize: theme.text.sizes.label,
    lineHeight: theme.text.lineHeight.label,
  },
  button: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default LocationBar;
