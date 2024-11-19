import React from 'react';
import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {Image, StyleProp, View, ViewStyle} from 'react-native';
import {useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';

type Props = {
  provider: ViolationsReportingProvider;
  size?: number;
  style?: StyleProp<ViewStyle>;
};
export const ProviderLogo = ({provider, size = 50, style}: Props) => {
  return (
    <View
      style={[
        style,
        {
          borderRadius: size / 2,
          overflow: 'hidden',
        },
      ]}
    >
      {provider.image ? (
        <Image
          height={size}
          width={size}
          source={{
            uri: `data:image/png;base64,${provider.image.base64}`,
          }}
        />
      ) : (
        <UnknownProvider height={size} width={size} />
      )}
    </View>
  );
};

const UnknownProvider = ({height, width}: {height: number; width: number}) => {
  const {theme} = useTheme();
  const themeColor = theme.color.background.accent[0];
  return (
    <View
      style={{
        backgroundColor: themeColor.background,
        height,
        width,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ThemeText type="body__primary--big--bold" color={themeColor}>
        ?
      </ThemeText>
    </View>
  );
};
