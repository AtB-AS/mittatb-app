import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {StyleSheet} from '@atb/theme';
import {Image, StyleProp, View, ViewStyle} from 'react-native';
import {SvgCssUri} from 'react-native-svg/css';

const LOGO_SIZE = 50;

type BrandingImageProps = {
  logoUrl: string | undefined;
  fallback?: JSX.Element;
  style?: StyleProp<ViewStyle>;
};

export const BrandingImage = ({
  logoUrl,
  fallback,
  style,
}: BrandingImageProps) => {
  const styles = useSheetStyle();
  const {enable_vehicle_operator_logo} = useRemoteConfigContext();
  const isSvg = (url: string) => url.endsWith('.svg');

  return (
    <View style={style}>
      {logoUrl && enable_vehicle_operator_logo ? (
        isSvg(logoUrl) ? (
          <SvgCssUri
            style={styles.logo}
            height={LOGO_SIZE}
            width={LOGO_SIZE}
            uri={logoUrl}
          />
        ) : (
          <Image
            source={{uri: logoUrl}}
            height={LOGO_SIZE}
            width={LOGO_SIZE}
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
    },
  };
});
