import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '../../theme';
import ThemedText from '../text';

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
      <ThemedText style={styles.headerText}>{children}</ThemedText>
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
    lineHeight: 16,
  },
}));

export default SectionHeader;
