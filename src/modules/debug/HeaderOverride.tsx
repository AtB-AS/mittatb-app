import {Section, TextInputSectionItem} from '@atb/components/sections';
import React from 'react';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';

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
      <Section>
        <TextInputSectionItem
          InputComponent={BottomSheetTextInput}
          label="Key"
          placeholder="Authorization"
          onChangeText={onKeyChange}
          value={headerKey}
          autoCapitalize="none"
        />
        <TextInputSectionItem
          InputComponent={BottomSheetTextInput}
          label="Value"
          placeholder="Bearer ..."
          onChangeText={onValueChange}
          value={headerValue}
          autoCapitalize="none"
        />
      </Section>
      <Button
        onPress={onDelete}
        expanded={false}
        type="small"
        text="Remove"
        mode="secondary"
        backgroundColor={theme.color.background.neutral[1]}
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.small,
  },
}));
