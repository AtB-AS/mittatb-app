import React from 'react';
import {Text, View} from 'react-native';
import {StyleSheet} from '../../theme';

const SectionHeader: React.FC = ({children}) => {
  const css = useProfileStyle();
  return (
    <View style={css.header}>
      <Text style={css.headerText}>{children}</Text>
      <View style={css.headerDecorator}></View>
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
