import React from 'react';
import {Text, View} from 'react-native';
import {StyleSheet} from '../../theme';

const SectionHeader: React.FC = ({children}) => {
  const styles = useProfileStyle();
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{children}</Text>
      <View style={styles.headerDecorator}></View>
    </View>
  );
};
const useProfileStyle = StyleSheet.createThemeHook(theme => ({
  header: {
    flexDirection: 'row',
  },
  headerDecorator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.text.primary,
    flex: 1,
    marginBottom: 3,
  },
  headerText: {
    backgroundColor: theme.background.primary,
    paddingEnd: 10,
    fontSize: 12,
    lineHeight: 16,
  },
}));

export default SectionHeader;
