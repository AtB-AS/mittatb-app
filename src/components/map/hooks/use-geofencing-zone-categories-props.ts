import {GeofencingZoneCategoriesProps} from '@atb/components/map';

export const useGeofencingZoneCategoriesProps = () => {
  // const {theme, themeName} = useTheme();
  // console.log('themeName', themeName);
  // console.log('JSON.stringify(theme)', JSON.stringify(theme));

  // todo: use base colors + prepare for light + dark mode?

  const geofencingZoneCategoriesProps: GeofencingZoneCategoriesProps = {
    Allowed: {
      code: 'Allowed',
      color: '#007C92', // blue_500
      fillOpacity: 0.075,
      strokeOpacity: 0.5,
      layerIndexWeight: 1,
    },
    Slow: {
      code: 'Slow',
      color: '#F0E973', // yellow_100
      fillOpacity: 0.6,
      strokeOpacity: 0.8,
      layerIndexWeight: 2,
    },
    StationParking: {
      code: 'StationParking',
      color: '#C75B12', // orange_500
      fillOpacity: 0.5,
      strokeOpacity: 0.7,
      layerIndexWeight: 1,
    },
    NoParking: {
      code: 'NoParking',
      color: '#C76B89', // red_400
      fillOpacity: 0.5,
      strokeOpacity: 0.7,
      layerIndexWeight: 3,
    },
    NoEntry: {
      code: 'NoEntry',
      color: '#380616', // red_900
      fillOpacity: 0.55,
      strokeOpacity: 0.75,
      layerIndexWeight: 5,
    },
    Unspecified: {
      code: 'Unspecified',
      color: '#FFFFFF', // gray_0
      fillOpacity: 0,
      strokeOpacity: 0,
      layerIndexWeight: 0,
    },
  };
  return geofencingZoneCategoriesProps;
};
