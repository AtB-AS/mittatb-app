import {TextInputSectionItem} from '@atb/components/sections';
import React, {useState} from 'react';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';

type Props = {
  headerKey: string;
  headerValue: string;
  onChange: (newKey: string, newValue: string) => void;
  onDelete: (keyToDelete: string) => void;
};

export function HeaderOverride(props: Props) {
  const style = useStyles();
  const {theme} = useThemeContext();
  const [key, setKey] = useState(props.headerKey);
  const [value, setValue] = useState(props.headerValue);

  return (
    <View style={style.container}>
      <View style={style.inputs}>
        <TextInputSectionItem
          label="Key"
          placeholder="Authorization"
          onChangeText={(val) => {
            setKey(val);
          }}
          onEndEditing={() => {
            props.onChange(key, value);
          }}
          value={key}
          autoCapitalize="none"
        />
        <TextInputSectionItem
          label="Value"
          placeholder="Bearer ..."
          onChangeText={(val) => {
            setValue(val);
          }}
          onEndEditing={() => props.onChange(key, value)}
          value={value}
          autoCapitalize="none"
        />
      </View>
      <View style={style.button}>
        <Button
          onPress={() => props.onDelete(props.headerKey)}
          expanded={false}
          type="small"
          text="Remove"
          mode="secondary"
          backgroundColor={theme.color.background.neutral[1]}
        />
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.medium,
  },
  inputs: {
    gap: theme.spacing.small,
  },
  button: {},
}));
