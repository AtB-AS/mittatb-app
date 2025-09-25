import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {Image, StyleProp, View, ViewStyle} from 'react-native';
import {SvgCssUri} from 'react-native-svg/css';

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
  const {enable_vehicle_operator_logo} = useRemoteConfigContext();
  function isSvgUrl(url: string) {
    try {
      const u = new URL(url);
      return u.pathname.toLowerCase().endsWith('.svg');
    } catch {
      return false;
    }
  }

  return (
    <View style={style}>
      {logoUrl && enable_vehicle_operator_logo ? (
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
