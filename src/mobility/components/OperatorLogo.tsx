import React from 'react';
import {Image, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {SvgUri} from 'react-native-svg';

const LOGO_MAX_HEIGHT = 50;
const LOGO_MAX_WIDTH = 120;

type OperatorLogoProps = {
  operatorName: string;
  logoUrl: string | undefined;
};
export const OperatorLogo = ({operatorName, logoUrl}: OperatorLogoProps) => {
  const {enable_vehicle_operator_logo} = useRemoteConfig();
  const isSvg = (url: string) => url.endsWith('.svg');

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {logoUrl && enable_vehicle_operator_logo ? (
        isSvg(logoUrl) ? (
          <SvgUri
            height={LOGO_MAX_HEIGHT}
            width={LOGO_MAX_WIDTH}
            uri={logoUrl}
          />
        ) : (
          <Image
            source={{uri: logoUrl}}
            style={{height: LOGO_MAX_HEIGHT, width: LOGO_MAX_WIDTH}}
            resizeMode="contain"
          />
        )
      ) : (
        <ThemeText type={'body__primary--big--bold'}>{operatorName}</ThemeText>
      )}
    </View>
  );
};
