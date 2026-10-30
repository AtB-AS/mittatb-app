import {StyleSheet, useThemeContext} from '@atb/theme';
import React from 'react';
import {Image, StyleProp, View, ViewStyle} from 'react-native';
import {SvgCssUri} from 'react-native-svg/css';
import {isSvgUrl} from '../utils';

const DEFAULT_LOGO_SIZE = 50;

type BrandingImageProps = {
  logoUrl: string | undefined | null;
  fallback?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  logoSize?: number;
  rounded?: boolean;
};

export const BrandingImage = ({
  logoUrl,
  fallback,
  style,
  logoSize = DEFAULT_LOGO_SIZE,
  rounded = false,
}: BrandingImageProps) => {
  const styles = useSheetStyle();
  const {theme} = useThemeContext();
  const borderRadius = rounded ? logoSize / 2 : theme.border.radius.small;
  return (
    <View style={style}>
      {logoUrl ? (
        isSvgUrl(logoUrl) ? (
          <SvgCssUri
            style={{...styles.logo, borderRadius}}
            height={logoSize}
            width={logoSize}
            uri={logoUrl}
          />
        ) : (
          <Image
            source={{uri: logoUrl}}
            height={logoSize}
            width={logoSize}
            borderRadius={borderRadius}
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
