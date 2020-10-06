import React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import colors from '../../theme/colors';
import {ArrowRight} from '../../assets/svg/icons/navigation';
import {Info, Warning} from '../../assets/svg/icons/status';
import {Location} from '../../favorites/types';
import LocationIcon from '../../components/location-icon';
import {StyleSheet} from '../../theme';
import shadows from '../../components/map/shadows';
import {ErrorType} from '../../api/utils';

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
  return location ? (
    <>
      <Text style={styles.name}>{location.name}</Text>
      <Text style={styles.locality}>
        {location.postalcode ? <Text>{location.postalcode}, </Text> : null}
        {location.locality}
      </Text>
    </>
  ) : error ? (
    <>
      <Text style={styles.name}>{translateErrorType(error)}</Text>
      <Text style={styles.locality}>Vennligst prøv igjen</Text>
    </>
  ) : (
    <>
      <Text style={styles.name}>Fant ikke noe her :(</Text>
      <Text style={styles.locality}>Vennligst prøv et annet sted</Text>
    </>
  );
};

function translateErrorType(errorType: ErrorType): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return 'Nettverksfeil under stedsoppslag';
    default:
      return 'Det oppstod en feil ved stedsoppslag.';
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    ...shadows,
  },
  innerContainer: {
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.general.white,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  locationContainer: {flexDirection: 'row', alignItems: 'center', height: 44},
  name: {fontSize: 14, lineHeight: 20},
  locality: {fontSize: 12, lineHeight: 16},
  button: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationBar;
