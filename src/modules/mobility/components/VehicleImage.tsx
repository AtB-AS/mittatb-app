import {Image, ImageStyle, View} from 'react-native';
import React, {useState} from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {CarFill} from '@atb/assets/svg/mono-icons/transportation';
import {StyleSheet} from '@atb/theme';

type Props = {
  uri: string | null | undefined;
  size?: 'small' | 'large';
};

export const VehicleImage = ({uri, size = 'small'}: Props) => {
  const style = useSheetStyle();
  const [largeImageAspectRatio, setLargeImageAspectRatio] = useState(1);

  if (!uri) {
    return <DefaultVehicleImage size={size} />;
  }

  if (size === 'large') {
    return (
      <Image
        style={
          [style.largeImage, {aspectRatio: largeImageAspectRatio}] as ImageStyle
        }
        source={{uri}}
        onLoad={(e) => {
          const {width, height} = e.nativeEvent.source;
          if (width && height) setLargeImageAspectRatio(width / height);
        }}
      />
    );
  }

  return <Image style={style.smallImage as ImageStyle} source={{uri}} />;
};

const DefaultVehicleImage = ({size}: {size: 'small' | 'large'}) => {
  const style = useSheetStyle();
  return (
    <View
      style={[
        size === 'large' ? style.largeDefaultImage : style.smallImage,
        style.defaultImage,
      ]}
    >
      <ThemeIcon size="large" color="secondary" svg={CarFill} />
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook(() => {
  const imageBase = {
    borderRadius: 8,
    backgroundColor: '#d8d8d8',
  };
  return {
    smallImage: {
      height: 40,
      width: 40,
      resizeMode: 'cover',
      ...imageBase,
    },
    largeImage: {
      height: 150,
      maxWidth: '100%',
      alignSelf: 'center',
      resizeMode: 'cover',
      ...imageBase,
    },
    largeDefaultImage: {
      height: 150,
      maxWidth: '100%',
      alignSelf: 'center',
      aspectRatio: 16 / 9,
      ...imageBase,
    },
    defaultImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});
