import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {Image, StyleProp, View, ViewStyle} from 'react-native';
import {SvgCssUri} from 'react-native-svg/css';

const DEFAULT_LOGO_SIZE = 50;

type BrandingImageProps = {
  logoUrl: string | undefined;
  fallback?: JSX.Element;
  style?: StyleProp<ViewStyle>;
  logoSize?: number;
  alwaysVisibleEnabled?: boolean;
};

export const BrandingImage = ({
  logoUrl,
  fallback,
  style,
  logoSize = DEFAULT_LOGO_SIZE,
  alwaysVisibleEnabled = false,
}: BrandingImageProps) => {
  const styles = useSheetStyle();
  const {enable_vehicle_operator_logo} = useRemoteConfigContext();
  const isSvg = (url: string) => url.endsWith('.svg');

  return (
    <View style={style}>
      {logoUrl && (enable_vehicle_operator_logo || alwaysVisibleEnabled) ? (
        isSvg(logoUrl) ? (
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

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    logo: {
      marginEnd: theme.spacing.small,
      overflow: 'hidden',
    },
  };
});
