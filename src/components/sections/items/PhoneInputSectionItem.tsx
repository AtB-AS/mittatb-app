import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  Keyboard,
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
import {SectionTexts, dictionary, useTranslation} from '@atb/translations';
import composeRefs from '@seznam/compose-react-refs';
import {ExpandMore, ExpandLess} from '@atb/assets/svg/mono-icons/navigation';
import {ScrollView} from 'react-native-gesture-handler';
import {countryPhoneData} from 'phone';
import {Section} from '../Section';
import {GenericClickableSectionItem} from '@atb/components/sections';
import {giveFocus, useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {loginPhoneInputId} from '@atb/test-ids';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {MessageInfoText} from '@atb/components/message-info-text';

type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;

type Props = SectionItemProps<
  InternalTextInputProps & {
    label: string;
    prefix: string | undefined;
    onChangePrefix: (prefix: string) => void;
    showClear?: boolean;
    onClear?: () => void;
    errorText?: string;
  }
>;

export const PhoneInputSectionItem = forwardRef<InternalTextInput, Props>(
  (
    {
      errorText = undefined,
      label,
      prefix,
      onChangePrefix,
      onFocus,
      onBlur,
      showClear,
      onClear,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const {topContainer, spacing} = useSectionItem(props);
    const {theme, themeName} = useTheme();
    const styles = useInputStyle(theme, themeName);
    const [isFocused, setIsFocused] = useState(Boolean(props?.autoFocus));
    const [isSelectingPrefix, setIsSelectingPrefix] = useState(false);
    const {t} = useTranslation();
    const myRef = useRef<InternalTextInput>(null);
    const combinedRef = composeRefs<InternalTextInput>(forwardedRef, myRef);
    const errorFocusRef = useRef(null);

    const prefixListRef = useFocusOnLoad();

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
      if (isSelectingPrefix) {
        setIsSelectingPrefix(false);
      }
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

    const onSelectPrefix = (country_code: string) => {
      setIsSelectingPrefix(false);
      onChangePrefix(country_code);
    };

    const onOpenPrefixSelection = () => {
      Keyboard.dismiss();
      setIsSelectingPrefix(!isSelectingPrefix);
    };

    const prefixes = countryPhoneData
      .filter((country) => {
        switch (country.country_code) {
          case '1':
            // Filter out non-US +1 prefixes
            return country.country_name === 'United States';
          default:
            return true;
        }
      })
      .sort((a, b) => (a.country_name > b.country_name ? 1 : -1));

    return (
      <View>
        <View
          style={[
            styles.container,
            label ? styles.containerMultiline : null,
            topContainerStyle,
            containerPadding,
            getBorderColor(),
          ]}
          onAccessibilityEscape={accessibilityEscapeKeyboard}
        >
          {label && (
            <ThemeText type="body__secondary" style={styles.label}>
              {label}
            </ThemeText>
          )}
          <View style={prefix ? styles.containerInline : null}>
            {prefix && (
              <PressableOpacity
                style={styles.prefix}
                onPress={onOpenPrefixSelection}
                accessibilityRole="button"
                accessibilityLabel={t(
                  SectionTexts.phoneInput.a11yLabel(prefix),
                )}
              >
                <ThemeText>+{prefix}</ThemeText>
                <ThemeIcon
                  style={styles.expandIcon}
                  svg={isSelectingPrefix ? ExpandLess : ExpandMore}
                  size="normal"
                />
              </PressableOpacity>
            )}
            <InternalTextInput
              ref={combinedRef}
              style={[styles.input, padding, style]}
              placeholderTextColor={theme.text.colors.secondary}
              onFocus={onFocusEvent}
              onBlur={onBlurEvent}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              testID={loginPhoneInputId}
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
        {isSelectingPrefix && (
          <ScrollView style={styles.prefixList} ref={prefixListRef}>
            <Section>
              {prefixes.map((country) => (
                <GenericClickableSectionItem
                  key={country.country_code + country.country_name}
                  onPress={() => onSelectPrefix(country.country_code)}
                >
                  <View style={styles.countryItem}>
                    <ThemeText style={styles.countryCode}>
                      {'+' + country.country_code + ' '}
                    </ThemeText>
                    <ThemeText style={styles.countryName}>
                      {country.country_name}
                    </ThemeText>
                  </View>
                </GenericClickableSectionItem>
              ))}
            </Section>
          </ScrollView>
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
    flexGrow: 1,
  },
  container: {
    backgroundColor: theme.static.background.background_0.background,
    borderWidth: theme.border.width.slim,
    borderColor: theme.static.background.background_0.background,
  },
  containerInline: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerMultiline: {
    paddingTop: theme.spacings.small,
  },
  label: {
    minWidth: 60 - theme.spacings.medium,
    paddingRight: theme.spacings.xSmall,
  },
  prefix: {
    flexDirection: 'row',
  },
  expandIcon: {
    marginLeft: theme.spacings.xSmall,
    marginRight: theme.spacings.small,
  },
  inputClear: {
    position: 'absolute',
    right: 0,
    bottom: theme.spacings.medium,
    alignSelf: 'center',
  },
  prefixList: {
    maxHeight: 300,
    borderRadius: theme.border.radius.regular,
  },
  countryItem: {
    flexDirection: 'row',
  },
  countryCode: {
    minWidth: '17%',
  },
  countryName: {
    width: '83%',
  },
  error: {
    paddingBottom: theme.spacings.medium,
  },
}));
