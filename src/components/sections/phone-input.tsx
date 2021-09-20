import React, {forwardRef, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  ListViewComponent,
  NativeSyntheticEvent,
  Platform,
  TextInput as InternalTextInput,
  TextInputFocusEventData,
  TextInputProps as InternalTextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {Close} from '@atb/assets/svg/icons/actions';
import {StyleSheet, useTheme} from '@atb/theme';
import insets from '@atb/utils/insets';
import ThemeText, {MAX_FONT_SCALE} from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {SectionItem, useSectionItem} from './section-utils';
import {SectionTexts, useTranslation} from '@atb/translations';
import composeRefs from '@seznam/compose-react-refs';
import {
  ArrowRight,
  ArrowUpLeft,
  Expand,
  ExpandLess,
} from '@atb/assets/svg/icons/navigation';
import {ScrollView} from 'react-native-gesture-handler';
import {phone, countryPhoneData} from 'phone';

type FocusEvent = NativeSyntheticEvent<TextInputFocusEventData>;

type TextProps = SectionItem<
  InternalTextInputProps & {
    label: string;
    prefix: boolean;
    showClear?: boolean;
    onClear?: () => void;
  }
>;

const PhoneInput = forwardRef<InternalTextInput, TextProps>(
  (
    {label, prefix, onFocus, onBlur, showClear, onClear, style, ...props},
    forwardedRef,
  ) => {
    const {topContainer, spacing, contentContainer} = useSectionItem(props);
    const {theme, themeName} = useTheme();
    const styles = useInputStyle(theme, themeName);
    const [isFocused, setIsFocused] = useState(Boolean(props?.autoFocus));
    const [isSelectingPrefix, setIsSelectingPrefix] = useState(false);
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

    const onPrefixSelection = () => {
      setIsSelectingPrefix(!isSelectingPrefix);
    };

    const prefixes = countryPhoneData
      .filter((country) => {
        switch (country.country_code) {
          case '1':
            // Filter out non-US +1 prefixes
            return country.country_name === 'United States';
          case '47':
            // Filter out Svalbard / Jan Mayen
            return country.country_name === 'Norway';
          default:
            return true;
        }
      })
      .sort((a, b) => (a.country_name > b.country_name ? 1 : -1));

    const prefixList = (
      <ScrollView>
        {prefixes.map((country) => (
          <View key={country.country_code + country.country_name}>
            <ThemeText>
              +{country.country_code} {country.country_name}
            </ThemeText>
          </View>
        ))}
      </ScrollView>
    );
    return (
      <View>
        <View
          style={[
            styles.container,
            label ? styles.containerMultiline : null,
            topContainerStyle,
            containerPadding,
            borderColor,
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
              <TouchableOpacity
                style={styles.prefix}
                onPress={onPrefixSelection}
              >
                <ThemeText>+123</ThemeText>
                <ThemeIcon svg={isSelectingPrefix ? ExpandLess : Expand} />
              </TouchableOpacity>
            )}
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
        </View>
        {isSelectingPrefix && prefixList}
      </View>
    );
  },
);

export default PhoneInput;

const useInputStyle = StyleSheet.createTheme((theme) => ({
  input: {
    color: theme.text.colors.primary,
    paddingRight: 40,

    fontSize: theme.typography.body__primary.fontSize,
  },
  container: {
    backgroundColor: theme.colors.background_0.backgroundColor,
    borderWidth: theme.border.width.slim,
    borderColor: theme.colors.background_0.backgroundColor,
  },
  containerInline: {
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-between',
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
  inputClear: {
    position: 'absolute',
    right: 0,
    bottom: theme.spacings.medium,
    alignSelf: 'center',
  },
}));
