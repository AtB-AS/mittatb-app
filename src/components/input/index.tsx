import React, {useState, useRef, forwardRef} from 'react';
import {
  TextInput,
  TextInputProperties,
  StyleProp,
  ViewStyle,
  View,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableOpacity,
} from 'react-native';
import {StyleSheet, useTheme} from '../../theme';
import colors from '../../theme/colors';
import {Close} from '../../assets/svg/icons/actions';
import insets from '../../utils/insets';
import ThemeText from '../text';
import ThemeIcon from '../theme-icon';

type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;

type InputProps = TextInputProperties & {
  label: string;
  showClear?: boolean;
  onClear?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};

const Input = forwardRef<TextInput, InputProps>(
  (
    {label, containerStyle, onFocus, onBlur, showClear, onClear, ...props},
    ref,
  ) => {
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
      ? colors.general.gray
      : colors.secondary.blue;

    return (
      <View style={[style.container, containerStyle]}>
        <TextInput
          ref={ref}
          style={[style.input, {borderColor}]}
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

export default Input;

const useInputStyle = StyleSheet.createTheme((theme) => ({
  input: {
    backgroundColor: theme.background.level1,
    color: theme.text.colors.primary,
    borderWidth: 1,
    borderRadius: theme.border.borderRadius.small,
    paddingLeft: 60,
    paddingRight: 40,
    padding: theme.spacings.medium,
    fontSize: theme.text.body.fontSize,
  },
  container: {
    marginBottom: theme.spacings.medium,
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
