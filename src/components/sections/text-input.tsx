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
import {SectionItem, useSectionItem} from './section-utils';

type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;

type TextProps = SectionItem<
  InternalTextInputProps & {
    label: string;
    showClear?: boolean;
    onClear?: () => void;
  }
>;

const TextInput = forwardRef<InternalTextInput, TextProps>(
  ({label, onFocus, onBlur, showClear, onClear, style, ...props}, ref) => {
    const {topContainer, spacing} = useSectionItem(props);
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

    const padding = {
      // There are some oddities with handling padding
      // on Android and fonts: https://codeburst.io/react-native-quirks-2fb1ae0bbf80
      paddingBottom: spacing - Platform.select({android: 4, default: 0}),
      paddingTop: spacing - Platform.select({android: 5, default: 0}),
    };

    return (
      <View style={styles.container}>
        <ThemeText type="lead" style={styles.label}>
          {label}
        </ThemeText>
        <InternalTextInput
          ref={ref}
          style={[styles.input, topContainer, padding, style, borderColor]}
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

    fontSize: theme.text.body.fontSize,
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: theme.spacings.medium,
    zIndex: 2,
  },
  inputClear: {
    position: 'absolute',
    right: 14,
    alignSelf: 'center',
  },
}));
