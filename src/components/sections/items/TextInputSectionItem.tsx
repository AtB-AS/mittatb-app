import React, {forwardRef, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  NativeSyntheticEvent,
  Platform,
  TextInput as InternalTextInput,
  TextInputFocusEventData,
  TextInputProps as InternalTextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet, useTheme} from '@atb/theme';
import {insets} from '@atb/utils/insets';
import {ThemeText, MAX_FONT_SCALE} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {SectionTexts, useTranslation} from '@atb/translations';
import composeRefs from '@seznam/compose-react-refs';

type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;

type TextProps = SectionItemProps<
  InternalTextInputProps & {
    label: string;
    inlineLabel?: boolean;
    showClear?: boolean;
    onClear?: () => void;
  }
>;

export const TextInputSectionItem = forwardRef<InternalTextInput, TextProps>(
  (
    {
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

    const borderColor = !isFocused
      ? undefined
      : {borderColor: theme.border.focus};

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
          borderColor,
        ]}
        onAccessibilityEscape={accessibilityEscapeKeyboard}
      >
        <ThemeText type="body__secondary" style={styles.label}>
          {label}
        </ThemeText>
        <InternalTextInput
          ref={combinedRef}
          style={[
            styles.input,
            inlineLabel ? contentContainer : undefined,
            padding,
            style,
          ]}
          placeholderTextColor={theme.text.colors.secondary}
          onFocus={onFocusEvent}
          onBlur={onBlurEvent}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          {...props}
        />
        {showClear ? (
          <View style={styles.inputClear}>
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t(SectionTexts.textInput.clear)}
              hitSlop={insets.all(8)}
              onPress={onClearEvent}
            >
              <ThemeIcon svg={Close} />
            </TouchableOpacity>
          </View>
        ) : null}
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
  inputClear: {
    position: 'absolute',
    right: theme.spacings.medium,
    bottom: theme.spacings.medium,
    alignSelf: 'center',
  },
}));
