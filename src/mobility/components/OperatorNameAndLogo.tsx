import React from 'react';
import {Image, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {SvgCssUri} from 'react-native-svg';
import {StyleSheet} from '@atb/theme';

/**
 * Large logo is shown at the empty part of the bottom sheet.
 * Small logo is shown near the operator name.
 * 
 * Please see figma page below for reference
 * https://www.figma.com/file/zdZwvobgpEWSagKt0tderx/App?node-id=20467-42962
 */
const LARGE_LOGO_MAX_HEIGHT_WIDTH = 50;
const SMALL_LOGO_MAX_HEIGHT_WIDTH = 20;

/**
 * @param operatorName will only be displayed on small logo
 * 
 * @param logoUrl logo to be displayed, can be SVG or PNG, 
 *                if SVG, show using <SvgCssUri>, otherwise use <Image> 
 * 
 * @param isSmallLogo determines small or large logo (see Figma)
 * 
 * @param fallback logo to be used when the logo URL is null
 * 
 */
type OperatorNameAndLogoProps = {
  operatorName: string;
  logoUrl: string | undefined;
  isSmallLogo: boolean;
  fallback?: JSX.Element
};

export const OperatorNameAndLogo = ({
  operatorName,
  logoUrl,
  isSmallLogo,
  fallback
}: OperatorNameAndLogoProps) => {
  const {enable_vehicle_operator_logo} = useRemoteConfig();
  const isSvg = (url: string) => url.endsWith('.svg');
  const style = useSheetStyle();

  const logoHeight = isSmallLogo ? SMALL_LOGO_MAX_HEIGHT_WIDTH : LARGE_LOGO_MAX_HEIGHT_WIDTH;
  const logoWidth = isSmallLogo ? SMALL_LOGO_MAX_HEIGHT_WIDTH : LARGE_LOGO_MAX_HEIGHT_WIDTH;
  const logoContainerStyle = isSmallLogo ? style.logoContainerSmall : style.logoContainerLarge;

  // don't show operator name if it is a large logo
  const logoOperatorName = isSmallLogo ? operatorName : undefined

  return (
    <View style={logoContainerStyle}>
      {logoUrl &&
        enable_vehicle_operator_logo ?
        (isSvg(logoUrl) ? (
          <SvgCssUri
            style={style.logo}
            height={logoHeight}
            width={logoWidth}
            uri={logoUrl}
          />
        ) : (
          <Image
            source={{uri: logoUrl}}
            style={{height: logoHeight, width: logoWidth}}
            resizeMode="contain"
          />
        )) : fallback }
      <ThemeText type="body__primary--bold">{logoOperatorName}</ThemeText>
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    logoContainerSmall: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
    logoContainerLarge: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    logo: {
      marginEnd: theme.spacings.small,
    },
  };
});
