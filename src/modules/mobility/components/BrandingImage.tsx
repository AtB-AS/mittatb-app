import {StyleSheet} from '@atb/theme';
import React from 'react';
import {Image, StyleProp, View, ViewStyle} from 'react-native';
import {SvgCssUri} from 'react-native-svg/css';
import {isSvgUrl} from '../utils';

const DEFAULT_LOGO_SIZE = 50;

type BrandingImageProps = {
  logoUrl: string | undefined;
  fallback?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  logoSize?: number;
};

export const BrandingImage = ({
  logoUrl,
  fallback,
  style,
  logoSize = DEFAULT_LOGO_SIZE,
}: BrandingImageProps) => {
  const styles = useSheetStyle();
  return (
    <View style={style}>
      {logoUrl ? (
        isSvgUrl(logoUrl) ? (
          <SvgCssUri
            style={styles.logo}
            height={logoSize}
            width={logoSize}
            uri={logoUrl}
          />
        ) : (
          <Image
            source={{uri: logoUrl}}
            height={logoSize}
            width={logoSize}
            resizeMode="contain"
          />
        )
      ) : (
        fallback
      )}
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook(() => {
  return {
    logo: {
      overflow: 'hidden',
    },
  };
});
