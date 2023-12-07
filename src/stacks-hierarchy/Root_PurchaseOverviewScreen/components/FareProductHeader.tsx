import {getTextForLanguage, useTranslation} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {FareProductTypeConfig} from '@atb/configuration';
import {TransportModes} from '@atb/components/transportation-modes';
import React, {forwardRef} from 'react';

type Props = {
  fareProductTypeConfig: FareProductTypeConfig;
  style?: StyleProp<ViewStyle>;
};
export const FareProductHeader = forwardRef<View, Props>(
  ({fareProductTypeConfig, style}: Props, ref) => {
    const {language} = useTranslation();

    return (
      <View style={style} ref={ref}>
        <TransportModes
          modes={fareProductTypeConfig.transportModes}
          iconSize="normal"
          textType="heading--medium"
          textColor="background_accent_0"
          customTransportModeText={getTextForLanguage(
            fareProductTypeConfig.name,
            language,
          )}
        />
      </View>
    );
  },
);
