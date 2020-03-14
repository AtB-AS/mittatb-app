import React from 'react';
import {View, Text} from 'react-native';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {StyleSheet} from '../theme';
import {Location} from '../favorites/types';

type Props = {
  title: string;
  locations: Location[];
  onSelect: (location: Location) => void;
};

const LocationResults: React.FC<Props> = ({title, locations, onSelect}) => {
  const styles = useThemeStyles();
  return (
    <>
      <View style={styles.subHeader}>
        <Text style={styles.subLabel}>{title}</Text>
        <View style={styles.subBar} />
      </View>
      <FlatList
        data={locations}
        renderItem={({item: location}) => (
          <TouchableWithoutFeedback
            onPress={() => onSelect?.(location)}
            style={{padding: 12, marginVertical: 12}}
          >
            <Text>
              <Text style={{fontWeight: 'bold'}}>{location.name}</Text>
              <Text>, {location.locality}</Text>
            </Text>
          </TouchableWithoutFeedback>
        )}
      />
    </>
  );
};

export default LocationResults;

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  subHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  subLabel: {
    color: theme.text.faded,
    fontSize: 12,
    marginRight: 12,
  },
  subBar: {
    height: 12,
    flexGrow: 1,
    borderBottomColor: theme.text.faded,
    borderBottomWidth: 1,
  },
}));
