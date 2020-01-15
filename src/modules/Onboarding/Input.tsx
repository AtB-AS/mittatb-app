import {TouchableOpacity, Text, View, ViewProperties} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import React from 'react';

type Props = {
  suggestions: string[];
  query: string;
  setQuery: (query: string) => void;
  selectSuggestion: (suggestion: string) => void;
} & ViewProperties;

const Input: React.FC<Props> = ({
  suggestions,
  query,
  setQuery,
  selectSuggestion,
  style,
}) => (
  <View style={style}>
    <Autocomplete
      data={suggestions}
      defaultValue={query}
      onChangeText={setQuery}
      renderItem={({item}: {item: string}) => (
        <TouchableOpacity key={item} onPress={() => selectSuggestion(item)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);

export default Input;
