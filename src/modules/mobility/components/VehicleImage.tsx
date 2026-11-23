import {Image, ImageStyle} from 'react-native';
import React, {useState} from 'react';
import {TransportationIconBox} from '@atb/components/icon-box';
import {StyleSheet} from '@atb/theme';
import {
  FormFactor,
  PropulsionType,
} from '@atb/api/types/generated/mobility-types_v2';
import {getTransportModeAndSubMode} from '../utils';

type Props = {
  uri: string | null | undefined;
  formFactor: FormFactor;
  size?: 'small' | 'large';
  propulsionType: PropulsionType;
};

export const VehicleImage = ({
  uri,
  formFactor,
  size = 'small',
  propulsionType,
}: Props) => {
  const style = useSheetStyle();
  const [largeImageAspectRatio, setLargeImageAspectRatio] = useState(1);

  if (!uri) {
    const {mode, subMode} = getTransportModeAndSubMode(
      formFactor,
      propulsionType,
    );
    return (
      <TransportationIconBox
        mode={mode}
        subMode={subMode}
        rounded={true}
        iconSize={size}
      />
    );
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
  };
});
