import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {Image, StyleProp, View, ViewStyle} from 'react-native';

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
      <Image
        height={size}
        width={size}
        source={{
          uri: `data:image/png;base64,${provider.image.base64}`,
        }}
      />
    </View>
  );
};
