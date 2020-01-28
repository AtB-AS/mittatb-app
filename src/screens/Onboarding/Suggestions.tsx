import React from 'react';
import {FlatList, ViewStyle, StyleSheet, Platform} from 'react-native';

type Props<T> = {
  suggestions: T[];
  keyExtractor: (suggestion: T, index: number) => string;
  renderSuggestion: (suggestion: T) => React.ReactElement | null;
  noSuggestionsContent?: React.ReactElement;
  style: ViewStyle;
};

function Suggestions<T>({
  suggestions,
  keyExtractor,
  renderSuggestion,
  noSuggestionsContent,
  style,
}: Props<T>) {
  return (
    <FlatList<T>
      data={suggestions}
      keyExtractor={keyExtractor}
      renderItem={({item}) => renderSuggestion(item)}
      keyboardShouldPersistTaps="handled"
      style={[styles.list, style]}
      ListEmptyComponent={noSuggestionsContent}
    />
  );
}

const iosStyle = {
  list: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
};

const androidStyle = {
  list: {},
};

const styles = StyleSheet.create<Partial<{list: ViewStyle}>>({
  ...Platform.select({
    ios: iosStyle,
    android: androidStyle,
  }),
});

export default Suggestions;
