import {getTextForLanguage, useTranslation} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {FareProductTypeConfig} from '@atb/configuration';
import React, {forwardRef} from 'react';
import {TransportModesWithText} from '@atb/components/transportation-modes';

type Props = {
  fareProductTypeConfig: FareProductTypeConfig;
  style?: StyleProp<ViewStyle>;
};
export const FareProductHeader = forwardRef<View, Props>(
  ({fareProductTypeConfig, style}: Props, ref) => {
    const {language} = useTranslation();

    return (
      <View style={style}>
        <TransportModesWithText
          ref={ref}
          modes={fareProductTypeConfig.transportModes}
          iconSize="normal"
          textType="heading--medium"
          textColor="background_accent_0"
          accessibilityRole="header"
          text={getTextForLanguage(fareProductTypeConfig.name, language) ?? ''}
        />
      </View>
    );
  },
);
