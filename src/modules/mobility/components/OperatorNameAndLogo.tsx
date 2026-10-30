import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {BrandingImage} from './BrandingImage';

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
  logoUrl: string | undefined | null;
  fallback?: React.JSX.Element;
  style?: StyleProp<ViewStyle>;
};

export const OperatorNameAndLogo = ({
  operatorName,
  logoUrl,
  style,
}: OperatorNameAndLogoProps) => {
  const styles = useSheetStyle();

  return (
    <View style={style}>
      {logoUrl ? (
        <BrandingImage
          logoUrl={logoUrl}
          logoSize={LOGO_SIZE}
          style={styles.logo}
        />
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
