import {View} from 'react-native';

export const HiddenAccessibilityLabel = ({
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
