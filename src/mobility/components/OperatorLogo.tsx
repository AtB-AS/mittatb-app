import React from 'react';
import {Image, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {SvgCssUri} from 'react-native-svg';
import {StyleSheet} from '@atb/theme';

const LOGO_MAX_HEIGHT = 50;
const LOGO_MAX_WIDTH = 120;

type OperatorLogoProps = {
  operatorName: string;
  logoUrl: string | undefined;
  maxHeight?: number;
  maxWidth?: number;
};

export const OperatorLogo = ({
  operatorName,
  logoUrl,
  maxHeight = LOGO_MAX_HEIGHT,
  maxWidth = LOGO_MAX_WIDTH,
}: OperatorLogoProps) => {
  const {enable_vehicle_operator_logo} = useRemoteConfig();
  const isSvg = (url: string) => url.endsWith('.svg');
  const style = useSheetStyle();

  return (
    <View style={style.logoContainer}>
      {logoUrl &&
        enable_vehicle_operator_logo &&
        (isSvg(logoUrl) ? (
          <SvgCssUri
            style={style.logo}
            height={maxHeight}
            width={maxWidth}
            uri={logoUrl}
          />
        ) : (
          <Image
            source={{uri: logoUrl}}
            style={{height: maxHeight, width: maxWidth}}
            resizeMode="contain"
          />
        ))}
      <ThemeText type="body__primary--bold">{operatorName}</ThemeText>
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    logoContainer: {
      flex: 1,
      alignItems: 'flex-start',
      flexDirection: 'row',
    },
    logo: {
      marginEnd: theme.spacings.small,
    },
  };
});
