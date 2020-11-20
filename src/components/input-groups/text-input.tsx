import React, {forwardRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  Platform,
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
  ({label, onFocus, onBlur, showClear, onClear, style, ...props}, ref) => {
    const {theme, themeName} = useTheme();
    const styles = useInputStyle(theme, themeName);
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
      <View style={styles.container}>
        <InternalTextInput
          ref={ref}
          style={[styles.input, style, borderColor]}
          placeholderTextColor={theme.text.colors.faded}
          onFocus={onFocusEvent}
          onBlur={onBlurEvent}
          {...props}
        />
        {showClear ? (
          <View style={styles.inputClear}>
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
        <ThemeText type="lead" style={styles.label}>
          {label}
        </ThemeText>
      </View>
    );
  },
);

export default TextInput;

const useInputStyle = StyleSheet.createTheme((theme) => ({
  input: {
    backgroundColor: theme.background.level0,
    color: theme.text.colors.primary,
    borderWidth: theme.border.width.slim,
    borderColor: theme.background.level0,
    paddingLeft: 60,
    paddingRight: 40,

    // There are some oddities with handling padding
    // on Android and fonts: https://codeburst.io/react-native-quirks-2fb1ae0bbf80
    paddingBottom:
      theme.spacings.medium - Platform.select({android: 4, default: 0}),
    paddingTop:
      theme.spacings.medium - Platform.select({android: 5, default: 0}),
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
