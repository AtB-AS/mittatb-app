import {Image, ImageStyle, View} from 'react-native';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {CarFill} from '@atb/assets/svg/mono-icons/transportation';
import {StyleSheet} from '@atb/theme';

type Props = {
  uri: string | undefined;
};

export const CarImage = ({uri}: Props) => {
  const style = useSheetStyle();

  return uri ? (
    <Image
      style={[style.container as ImageStyle, style.image as ImageStyle]}
      source={{uri}}
    />
  ) : (
    <DefaultCarImage />
  );
};

const DefaultCarImage = () => {
  const style = useSheetStyle();
  return (
    <View style={[style.container, style.defaultImage]}>
      <ThemeIcon size="large" color="secondary" svg={CarFill} />
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook(() => {
  return {
    container: {
      height: 40,
      width: 40,
      borderRadius: 8,
      backgroundColor: '#d8d8d8',
    },
    image: {
      resizeMode: 'cover',
    },
    defaultImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});
