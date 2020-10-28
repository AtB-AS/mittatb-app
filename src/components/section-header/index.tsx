import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '../../theme';
import Text from '../text';

type SectionHeaderProps = {
  styles?: StyleProp<ViewStyle>;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  children,
  styles: extraStyles,
}) => {
  const styles = useProfileStyle();
  return (
    <View style={[styles.header, extraStyles]}>
      <Text style={styles.headerText}>{children}</Text>
      <View style={styles.headerDecorator}></View>
    </View>
  );
};
const useProfileStyle = StyleSheet.createThemeHook((theme) => ({
  header: {
    flexDirection: 'row',
  },
  headerDecorator: {
    flex: 1,
    marginBottom: 3,
  },
  headerText: {
    paddingEnd: 10,
    fontSize: theme.text.sizes.label,
    lineHeight: theme.text.lineHeight.label,
  },
}));

export default SectionHeader;
