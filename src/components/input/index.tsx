import React, {useState, useRef, forwardRef} from 'react';
import {
  Text,
  TextInput,
  TextInputProperties,
  StyleProp,
  ViewStyle,
  View,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import {StyleSheet, useTheme} from '../../theme';
import colors from '../../theme/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Close} from '../../assets/svg/icons/actions';
import insets from '../../utils/insets';

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
    const {theme} = useTheme();
    const style = useInputStyle(theme);
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
          placeholderTextColor={theme.text.faded}
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
              <Close />
            </TouchableOpacity>
          </View>
        ) : null}
        <Text style={style.label}>{label}</Text>
      </View>
    );
  },
);

export default Input;

const useInputStyle = StyleSheet.createTheme((theme) => ({
  input: {
    backgroundColor: theme.background.level1,
    color: theme.text.primary,
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 60,
    paddingRight: 40,
    padding: 12,
    fontSize: 16,
  },
  container: {
    marginBottom: 12,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  inputClear: {
    position: 'absolute',
    right: 14,
    alignSelf: 'center',
  },
}));
