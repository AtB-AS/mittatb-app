import React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import colors from '../../theme/colors';
import {MapPointPin} from '../../assets/svg/icons/places';
import {LocationWithSearchMetadata} from '..';
import {ArrowRight} from '../../assets/svg/icons/navigation';
import {Location} from '../../favorites/types';

type Props = {
  location?: Location;
  onSelect(location: LocationWithSearchMetadata): void;
};

const LocationBar: React.FC<Props> = ({location, onSelect}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <View
        style={{
          paddingRight: 8,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: colors.general.white,
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MapPointPin style={{marginHorizontal: 12}} />
          {location ? (
            <View>
              <Text style={{fontSize: 14, lineHeight: 20}}>
                {location.name}
              </Text>
              <Text style={{fontSize: 12, lineHeight: 16}}>
                {location.postalcode ? (
                  <Text>{location.postalcode}, </Text>
                ) : null}
                {location.locality}
              </Text>
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => {
            location && onSelect({...location, resultType: 'search'});
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              marginLeft: 8,
              backgroundColor: colors.secondary.cyan,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!location ? <ActivityIndicator /> : <ArrowRight />}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationBar;
