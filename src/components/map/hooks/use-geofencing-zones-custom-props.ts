import {GeofencingZonesCustomProps} from '@atb/components/map';

export const useGeofencingZonesCustomProps = () => {
  //const {theme, themeName} = useTheme();
  // console.log('themeName', themeName);
  // console.log('JSON.stringify(theme)', JSON.stringify(theme));

  // todo: use base colors + prepare for light + dark mode?

  const geofencingZonesCustomProps: GeofencingZonesCustomProps = {
    Allowed: {
      code: 'Allowed',
      color: {background: '#007C92', text: 'white'}, // blue_500
      fillOpacity: 0.075,
      strokeOpacity: 0.5,
      layerIndexWeight: 1,
    },
    Slow: {
      code: 'Slow',
      color: {background: '#F0E973', text: 'white'}, // yellow_100
      fillOpacity: 0.6,
      strokeOpacity: 0.8,
      layerIndexWeight: 2,
    },
    NoParking: {
      code: 'NoParking',
      color: {background: '#C76B89', text: 'white'}, // red_400
      fillOpacity: 0.5,
      strokeOpacity: 0.7,
      layerIndexWeight: 3,
    },
    NoEntry: {
      code: 'NoEntry',
      color: {background: '#380616', text: 'white'}, // red_900
      fillOpacity: 0.55,
      strokeOpacity: 0.75,
      layerIndexWeight: 5,
    },
  };
  return geofencingZonesCustomProps;
};
