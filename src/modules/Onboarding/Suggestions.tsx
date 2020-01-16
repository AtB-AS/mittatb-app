import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  ViewStyle,
  StyleSheet,
} from 'react-native';

type Props = {
  suggestions: string[];
  renderItem: (info: ListRenderItemInfo<string>) => React.ReactElement | null;
  style: ViewStyle;
};

const Suggestions: React.FC<Props> = ({suggestions, renderItem, style}) => {
  return suggestions.length > 0 ? (
    <FlatList<string>
      data={suggestions}
      renderItem={renderItem}
      keyboardShouldPersistTaps="always"
      style={[styles.list, style]}
    />
  ) : null;
};

const styles = StyleSheet.create({
  list: {
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
});

export default Suggestions;
