import React from 'react';
import {Image, ImageStyle, StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {SvgCssUri} from 'react-native-svg/css';
import {StyleSheet} from '@atb/theme';

const LOGO_SIZE = 20;

/**
 * @param operatorName operator name
 *
 * @param logoUrl logo to be displayed, can be SVG or PNG,
 *                if SVG, show using <SvgCssUri>, otherwise use <Image>
 *
 * @param fallback logo to be used when the logo URL is null
 *
 */
type OperatorNameAndLogoProps = {
  operatorName: string;
  logoUrl: string | undefined;
  fallback?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
};

export const OperatorNameAndLogo = ({
  operatorName,
  logoUrl,
  style,
}: OperatorNameAndLogoProps) => {
  const {enable_vehicle_operator_logo} = useRemoteConfigContext();
  const isSvg = (url: string) => url.endsWith('.svg');
  const styles = useSheetStyle();

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
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            style={styles.logo as ImageStyle}
            resizeMode="contain"
          />
        )
      ) : null}
      <ThemeText typography="body__m__strong">{operatorName}</ThemeText>
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
