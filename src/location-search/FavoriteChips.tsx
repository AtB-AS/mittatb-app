import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../theme/colors';
import {useFavorites} from '../favorites/FavoritesContext';
import {Location} from '../favorites/types';
import {useGeolocationState} from '../GeolocationContext';
import {useReverseGeocoder} from './useGeocoder';
import LocationArrow from '../assets/svg/LocationArrow';

type Props = {
  onSelectLocation: (location: Location) => void;
};

const FavoriteChips: React.FC<Props> = ({onSelectLocation}) => {
  const {favorites} = useFavorites();
  const {location} = useGeolocationState();
  const reverseLookupLocations = useReverseGeocoder(location) ?? [];
  const currentLocation = reverseLookupLocations.length
    ? reverseLookupLocations[1]
    : null;

  return (
    <View
      style={{
        marginBottom: 24,
        height: 44,
      }}
    >
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {currentLocation && (
          <FavoriteChip
            text="Min posisjon"
            icon={<LocationArrow />}
            onPress={() => onSelectLocation(currentLocation)}
          />
        )}
        {favorites.map(fav => (
          <FavoriteChip
            key={fav.name}
            text={fav.name}
            icon={<Text>{fav.emoji}</Text>}
            onPress={() => onSelectLocation(fav.location)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default FavoriteChips;

type ChipProps = {
  text?: string;
  icon: JSX.Element;
  onPress: () => void;
};

const FavoriteChip: React.FC<ChipProps> = ({text, icon, onPress}) => {
  return (
    <TouchableOpacity style={chipStyles.container} onPress={onPress}>
      {icon}
      <Text style={chipStyles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const chipStyles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 4,
    borderTopLeftRadius: 16,
    backgroundColor: colors.secondary.cyan,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 12,
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
});
