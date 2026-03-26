import {View} from 'react-native';

export const PrefixAccessibilityLabel = ({
  accessibilityLabel,
}: {
  accessibilityLabel: string;
}) => {
  return (
    <View
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      style={{position: 'absolute'}}
    />
  );
};
