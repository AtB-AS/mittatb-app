import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  Platform,
  TextInput as InternalTextInput,
  FocusEvent,
  TextInputProps as InternalTextInputProps,
  View,
} from 'react-native';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {insets} from '@atb/utils/insets';
import {ThemeText, MAX_FONT_SCALE} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {dictionary, SectionTexts, useTranslation} from '@atb/translations';
import composeRefs from '@seznam/compose-react-refs';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {MessageInfoText} from '@atb/components/message-info-text';

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
    const {topContainer, contentContainer} = useSectionItem(props);
    const {theme, themeName} = useThemeContext();
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
        return {borderColor: theme.color.border.focus.background};
      } else if (errorText) {
        return {
          borderColor: theme.color.interactive.destructive.default.background,
        };
      } else {
        return undefined;
      }
    };

    /*
        Android handles padding and fonts a little oddly.
        The short story is that we in some cases have to hard code
        padding like this to get it to look the same on iOS
        and Android.
        See https://codeburst.io/react-native-quirks-2fb1ae0bbf8
     */
    const androidPaddingOverwrite =
      Platform.OS === 'android' ? {paddingTop: 7, paddingBottom: 8} : undefined;

    const containerPadding = {
      paddingHorizontal: theme.spacing.medium,
    };

    return (
      <View
        style={[
          styles.container,
          inlineLabel ? styles.containerInline : styles.containerMultiline,
          topContainer,
          androidPaddingOverwrite,
          containerPadding,
          getBorderColor(),
        ]}
        onAccessibilityEscape={accessibilityEscapeKeyboard}
      >
        <ThemeText typography="body__secondary" style={styles.label}>
          {label}
        </ThemeText>
        <View
          style={[
            styles.internalInputContainer,
            inlineLabel ? contentContainer : undefined,
          ]}
        >
          <InternalTextInput
            ref={combinedRef}
            style={[styles.input, style]}
            placeholderTextColor={theme.color.foreground.dynamic.secondary}
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
            <MessageInfoText message={errorText} type="error" />
          </View>
        )}
      </View>
    );
  },
);

const useInputStyle = StyleSheet.createTheme((theme) => ({
  input: {
    color: theme.color.foreground.dynamic.primary,
    paddingRight: 40,
    paddingVertical: 0,

    fontSize: theme.typography.body__primary.fontSize,
  },
  container: {
    backgroundColor: theme.color.background.neutral[0].background,
    borderWidth: theme.border.width.slim,
    borderColor: theme.color.background.neutral[0].background,
  },
  containerInline: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerMultiline: {
    paddingTop: theme.spacing.small,
    rowGap: theme.spacing.small,
  },
  internalInputContainer: {
    justifyContent: 'center',
  },
  label: {
    minWidth: 60 - theme.spacing.medium,
    paddingRight: theme.spacing.xSmall,
  },
  inputClear: {
    position: 'absolute',
    right: 0,
  },
  clearButton: {
    alignSelf: 'center',
  },
  error: {
    paddingBottom: theme.spacing.medium,
  },
}));
