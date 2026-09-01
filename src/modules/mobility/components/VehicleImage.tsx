import {Image, ImageStyle, View} from 'react-native';
import React, {useState} from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {StyleSheet} from '@atb/theme';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {getTransportModeAndSubMode} from '../utils';

type Props = {
  uri: string | null | undefined;
  formFactor: FormFactor;
  size?: 'small' | 'large';
};

export const VehicleImage = ({uri, formFactor, size = 'small'}: Props) => {
  const style = useSheetStyle();
  const [largeImageAspectRatio, setLargeImageAspectRatio] = useState(1);

  if (!uri) {
    return <DefaultVehicleImage formFactor={formFactor} size={size} />;
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

const DefaultVehicleImage = ({
  formFactor,
  size,
}: {
  formFactor: FormFactor;
  size: 'small' | 'large';
}) => {
  const style = useSheetStyle();
  return (
    <View
      style={[
        size === 'large' ? style.largeDefaultImage : style.smallImage,
        style.defaultImage,
      ]}
    >
      <ThemeIcon
        size="large"
        color="secondary"
        svg={
          getTransportModeSvg(getTransportModeAndSubMode(formFactor).mode).svg
        }
      />
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
