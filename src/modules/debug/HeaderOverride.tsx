import {TextInputSectionItem} from '@atb/components/sections';
import React from 'react';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';

type Props = {
  headerKey: string;
  headerValue: string;
  onKeyChange: (newKey: string) => void;
  onValueChange: (newValue: string) => void;
  onDelete: () => void;
};

export function HeaderOverride({
  headerKey,
  headerValue,
  onKeyChange,
  onValueChange,
  onDelete,
}: Props) {
  const style = useStyles();
  const {theme} = useThemeContext();

  return (
    <View style={style.container}>
      <View style={style.inputs}>
        <TextInputSectionItem
          label="Key"
          placeholder="Authorization"
          onChangeText={onKeyChange}
          value={headerKey}
          autoCapitalize="none"
        />
        <TextInputSectionItem
          label="Value"
          placeholder="Bearer ..."
          onChangeText={onValueChange}
          value={headerValue}
          autoCapitalize="none"
        />
      </View>
      <View style={style.button}>
        <Button
          onPress={onDelete}
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
