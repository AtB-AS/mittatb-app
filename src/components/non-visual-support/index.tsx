import React, {Props} from 'react';
import {Text} from 'react-native';
import {StyleSheet} from '../../theme';

type LabelProps = {text?: string};

const NonVisualSupportLabel: React.FC<LabelProps> = ({ text }) => {
  return <Text style={styles.accessibleLabel}>{text}</Text>;
};
const styles = StyleSheet.create({
  accessibleLabel: {
    fontSize: 0,
  },
});
export default NonVisualSupportLabel;
