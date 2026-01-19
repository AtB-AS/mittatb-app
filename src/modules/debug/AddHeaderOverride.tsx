import {TextInputSectionItem} from '@atb/components/sections';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';

type Props = {
  existingHeaderKey: string;
  existingHeaderValue: string;
  onSave: (key: string, value: string) => void;
};

export function AddHeaderOverride(props: Props) {
  const theme = useStyles();
  const [headerKey, setHeaderKey] = useState<string>('');
  const [headerValue, setHeaderValue] = useState<string>('');

  useEffect(() => {
    if (props.existingHeaderKey) {
      setHeaderKey(props.existingHeaderKey);
    }
    if (props.existingHeaderValue) {
      setHeaderValue(props.existingHeaderValue);
    }
  }, [props.existingHeaderKey, props.existingHeaderValue]);

  return (
    <View style={theme.container}>
      <View style={theme.inputs}>
        <TextInputSectionItem
          label="Key"
          placeholder="Authorization"
          onChangeText={(key) => {
            setHeaderKey(key);
          }}
          value={headerKey}
          autoCapitalize="none"
        />
        <TextInputSectionItem
          label="Value"
          placeholder="Bearer ..."
          onChangeText={(value) => {
            setHeaderValue(value);
          }}
          value={headerValue}
          autoCapitalize="none"
        />
      </View>
      <View style={theme.button}>
        <Button
          onPress={() => props.onSave(headerKey, headerValue)}
          expanded={false}
          text="Add header"
          type="small"
        />
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {gap: theme.spacing.medium},
  inputs: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    width: '100%',
    borderWidth: 1,
    borderColor: 'red',
    borderStyle: 'solid',
  },
  button: {},
}));
