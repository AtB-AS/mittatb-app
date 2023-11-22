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
const LOGO_SIZES = {"small": 20, "large": 50}

/**
 * @param operatorName will only be displayed on small logo
 * 
 * @param logoUrl logo to be displayed, can be SVG or PNG, 
 *                if SVG, show using <SvgCssUri>, otherwise use <Image> 
 * 
 * @param logoSize determines small or large logo (see Figma)
 * 
 * @param fallback logo to be used when the logo URL is null
 * 
 */
type OperatorNameAndLogoProps = {
  operatorName: string;
  logoUrl: string | undefined;
  logoSize?: "small" | "large";
  fallback?: JSX.Element
};

export const OperatorNameAndLogo = ({
  operatorName,
  logoUrl,
  logoSize = "small",
  fallback
}: OperatorNameAndLogoProps) => {
  const {enable_vehicle_operator_logo} = useRemoteConfig();
  const isSvg = (url: string) => url.endsWith('.svg');
  const style = useSheetStyle();

  const logoContainerStyle = logoSize === 'small' ? style.logoContainerSmall : style.logoContainerLarge;

  // don't show operator name if it is a large logo
  const logoOperatorName = logoSize === 'small' ? operatorName : undefined

  return (
    <View style={logoContainerStyle}>
      {logoUrl &&
        enable_vehicle_operator_logo ?
        (isSvg(logoUrl) ? (
          <SvgCssUri
            style={style.logo}
            height={LOGO_SIZES[logoSize]}
            width={LOGO_SIZES[logoSize]}
            uri={logoUrl}
          />
        ) : (
          <Image
            source={{uri: logoUrl}}
            style={{height: LOGO_SIZES[logoSize], width: LOGO_SIZES[logoSize]}}
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
