import React, {forwardRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  TextInput as InternalTextInput,
  TextInputFocusEventData,
  TextInputProps as InternalTextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {Close} from '../../assets/svg/icons/actions';
import {StyleSheet, useTheme} from '../../theme';
import insets from '../../utils/insets';
import ThemeText from '../text';
import ThemeIcon from '../theme-icon';

type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;

type TextProps = InternalTextInputProps & {
  label: string;
  showClear?: boolean;
  onClear?: () => void;
};

const TextInput = forwardRef<InternalTextInput, TextProps>(
  ({label, onFocus, onBlur, showClear, onClear, ...props}, ref) => {
    const {theme, themeName} = useTheme();
    const style = useInputStyle(theme, themeName);
    const [isFocused, setIsFocused] = useState(Boolean(props?.autoFocus));

    const onFocusEvent = (e: FocusEvent) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const onBlurEvent = (e: FocusEvent) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const borderColor = !isFocused
      ? undefined
      : {borderColor: theme.border.focus};

    return (
      <View style={style.container}>
        <InternalTextInput
          ref={ref}
          style={[style.input, borderColor]}
          placeholderTextColor={theme.text.colors.faded}
          onFocus={onFocusEvent}
          onBlur={onBlurEvent}
          {...props}
        />
        {showClear ? (
          <View style={style.inputClear}>
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Tøm redigeringsfelt"
              hitSlop={insets.all(8)}
              onPress={onClear}
            >
              <ThemeIcon svg={Close} />
            </TouchableOpacity>
          </View>
        ) : null}
        <ThemeText type="lead" style={style.label}>
          {label}
        </ThemeText>
      </View>
    );
  },
);

export default TextInput;

const useInputStyle = StyleSheet.createTheme((theme) => ({
  input: {
    backgroundColor: theme.background.level1,
    color: theme.text.colors.primary,
    borderWidth: theme.border.width.slim,
    borderRadius: theme.border.radius.regular,
    borderColor: theme.background.level1,
    paddingLeft: 60,
    paddingRight: 40,
    padding: theme.spacings.medium,
    fontSize: theme.text.body.fontSize,
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: theme.spacings.medium,
  },
  inputClear: {
    position: 'absolute',
    right: 14,
    alignSelf: 'center',
  },
}));
