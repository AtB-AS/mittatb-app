import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useIsFocused,
  useRoute,
} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Text, TextInput, View, TouchableWithoutFeedback} from 'react-native';

import MapboxGL from '@react-native-mapbox-gl/maps';

const MapSelection: React.FC<any> = ({}) => {
  const [pos, setPos] = useState();
  return (
    <View style={{}}>
      <MapboxGL.MapView
        style={{
          flex: 1,
          height: 300,
        }}
        onRegionDidChange={(some) => setPos(some)}
      >
        <MapboxGL.Camera
          zoomLevel={15}
          centerCoordinate={[10.399331, 63.436657]}
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
        <View
          style={{
            position: 'absolute',
            top: '50%',
            right: '50%',
            width: 10,
            height: 10,
          }}
        >
          <View style={{position: 'absolute', top: -10, right: -4}}>
            <Text>x</Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            height: 20,
            width: 20,
            position: 'absolute',
            top: '10%',
            right: '5%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>+</Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 5,
            height: 20,
            width: 20,
            position: 'absolute',
            top: '20%',
            right: '5%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback>
            <Text>-</Text>
          </TouchableWithoutFeedback>
        </View>
      </MapboxGL.MapView>
      <Text>{JSON.stringify(pos)}</Text>
    </View>
  );
};

export default MapSelection;
