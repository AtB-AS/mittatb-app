import {getTextForLanguage, useTranslation} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {FareProductTypeConfig} from '@atb/configuration';
import React, {forwardRef} from 'react';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {TransportationIconBoxList} from '@atb/components/icon-box';

type Props = {
  fareProductTypeConfig: FareProductTypeConfig;
  style?: StyleProp<ViewStyle>;
};
export const FareProductHeader = forwardRef<View, Props>(
  ({fareProductTypeConfig, style}: Props, ref) => {
    const {language} = useTranslation();
    const styles = useStyle();

    return (
      <View style={[style, styles.header]} ref={ref} accessible={true}>
        <TransportationIconBoxList
          modes={fareProductTypeConfig.transportModes}
          iconSize="normal"
        />
        <ThemeText
          type="heading--medium"
          color="background_accent_0"
          style={{flexShrink: 1}}
        >
          {getTextForLanguage(fareProductTypeConfig.name, language) ?? ''}
        </ThemeText>
      </View>
    );
  },
);
const useStyle = StyleSheet.createThemeHook((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacings.small,
  },
}));
