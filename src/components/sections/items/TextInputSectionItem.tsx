import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  NativeSyntheticEvent,
  Platform,
  TextInput as InternalTextInput,
  TextInputFocusEventData,
  TextInputProps as InternalTextInputProps,
  View,
} from 'react-native';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, useTheme} from '@atb/theme';
import {insets} from '@atb/utils/insets';
import {ThemeText, MAX_FONT_SCALE} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {dictionary, SectionTexts, useTranslation} from '@atb/translations';
import composeRefs from '@seznam/compose-react-refs';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {Error} from '@atb/assets/svg/color/icons/status';
import {giveFocus} from '@atb/utils/use-focus-on-load';

type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;

type TextProps = SectionItemProps<
  InternalTextInputProps & {
    label: string;
    inlineLabel?: boolean;
    showClear?: boolean;
    onClear?: () => void;
    errorText?: string;
  }
>;

export const TextInputSectionItem = forwardRef<InternalTextInput, TextProps>(
  (
    {
      errorText = undefined,
      label,
      inlineLabel = true,
      onFocus,
      onBlur,
      showClear,
      onClear,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const {topContainer, spacing, contentContainer} = useSectionItem(props);
    const {theme, themeName} = useTheme();
    const styles = useInputStyle(theme, themeName);
    const [isFocused, setIsFocused] = useState(Boolean(props?.autoFocus));
    const {t} = useTranslation();
    const myRef = useRef<InternalTextInput>(null);
    const combinedRef = composeRefs<InternalTextInput>(forwardedRef, myRef);
    const errorFocusRef = useRef(null);

    useEffect(() => {
      giveFocus(errorFocusRef);
    }, [errorText]);
    function accessibilityEscapeKeyboard() {
      setTimeout(
        () =>
          AccessibilityInfo.announceForAccessibility(
            t(SectionTexts.textInput.closeKeyboard),
          ),
        50,
      );
      myRef.current?.blur();
    }

    const onFocusEvent = (e: FocusEvent) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const onBlurEvent = (e: FocusEvent) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const onClearEvent = () => {
      if (onClear) onClear();
      else if (props.onChangeText) props.onChangeText('');
    };

    const getBorderColor = () => {
      if (isFocused) {
        return {borderColor: theme.border.focus};
      } else if (errorText) {
        return {
          borderColor:
            theme.interactive.interactive_destructive.destructive.background,
        };
      } else {
        return undefined;
      }
    };

    const padding = {
      // There are some oddities with handling padding
      // on Android and fonts: https://codeburst.io/react-native-quirks-2fb1ae0bbf80
      paddingBottom: spacing - Platform.select({android: 4, default: 0}),
      paddingTop: spacing - Platform.select({android: 5, default: 0}),
    };

    // Remove padding from topContainerStyle
    const {padding: _dropThis, ...topContainerStyle} = topContainer;
    const containerPadding = {
      paddingHorizontal: spacing,
    };

    return (
      <View
        style={[
          styles.container,
          inlineLabel ? styles.containerInline : styles.containerMultiline,
          topContainerStyle,
          containerPadding,
          getBorderColor(),
        ]}
        onAccessibilityEscape={accessibilityEscapeKeyboard}
      >
        <ThemeText type="body__secondary" style={styles.label}>
          {label}
        </ThemeText>
        <View style={inlineLabel ? contentContainer : undefined}>
          <InternalTextInput
            ref={combinedRef}
            style={[styles.input, padding, style]}
            placeholderTextColor={theme.text.colors.secondary}
            onFocus={onFocusEvent}
            onBlur={onBlurEvent}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            {...props}
          />
          {showClear ? (
            <View style={styles.inputClear}>
              <PressableOpacity
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={t(SectionTexts.textInput.clear)}
                hitSlop={insets.all(8)}
                onPress={onClearEvent}
              >
                <ThemeIcon svg={Close} />
              </PressableOpacity>
            </View>
          ) : null}
        </View>
        {errorText !== undefined && (
          <View
            ref={errorFocusRef}
            accessible={true}
            style={styles.error}
            accessibilityRole="alert"
            accessibilityLabel={`${t(
              dictionary.messageTypes.error,
            )}, ${errorText}`}
          >
            <ThemeIcon svg={Error} />
            <ThemeText type="body__secondary" style={styles.errorMessage}>
              {errorText}
            </ThemeText>
          </View>
        )}
      </View>
    );
  },
);

const useInputStyle = StyleSheet.createTheme((theme) => ({
  input: {
    color: theme.text.colors.primary,
    paddingRight: 40,

    fontSize: theme.typography.body__primary.fontSize,
  },
  container: {
    backgroundColor: theme.static.background.background_0.background,
    borderWidth: theme.border.width.slim,
    borderColor: theme.static.background.background_0.background,
  },
  containerInline: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerMultiline: {
    paddingTop: theme.spacings.small,
  },
  label: {
    minWidth: 60 - theme.spacings.medium,
    paddingRight: theme.spacings.xSmall,
  },
  inputContainer: {
    position: 'relative',
  },
  inputClear: {
    position: 'absolute',
    right: 0,
    bottom: theme.spacings.medium,
  },
  clearButton: {
    alignSelf: 'center',
  },
  error: {flexDirection: 'row'},
  errorMessage: {
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.small,
    flex: 1,
  },
}));
