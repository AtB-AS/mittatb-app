import React from 'react';
import {Text, View, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '../../theme';

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
    backgroundColor: theme.background.level1,
    paddingEnd: 10,
    fontSize: 12,
    lineHeight: 16,
  },
}));

export default SectionHeader;
