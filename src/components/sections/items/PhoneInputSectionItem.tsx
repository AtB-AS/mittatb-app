import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  AccessibilityInfo,
  Keyboard,
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
import {SectionTexts, dictionary, useTranslation} from '@atb/translations';
import composeRefs from '@seznam/compose-react-refs';
import {ExpandMore, ExpandLess} from '@atb/assets/svg/mono-icons/navigation';
import {ScrollView} from 'react-native-gesture-handler';
import {countryPhoneData} from 'phone';
import {Section} from '../Section';
import {GenericClickableSectionItem} from '@atb/components/sections';
import {giveFocus, useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {MessageInfoText} from '@atb/components/message-info-text';

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
      ...props
    },
    forwardedRef,
  ) => {
    const {topContainer} = useSectionItem(props);
    const {theme, themeName} = useThemeContext();
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
        return {borderColor: theme.color.border.focus.background};
      } else if (errorText) {
        return {
          borderColor: theme.color.interactive.destructive.default.background,
        };
      } else {
        return undefined;
      }
    };

    const containerPadding = {
      paddingHorizontal: theme.spacing.medium,
    };

    /*
        Android handles padding and fonts a little oddly.
        The short story is that we in some cases have to hard code
        padding like this to get it to look the same on iOS
        and Android.
        See https://codeburst.io/react-native-quirks-2fb1ae0bbf8
     */
    const androidRowGapOverwrite =
      Platform.OS === 'android' ? {rowGap: 3} : undefined;

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
      <View
        style={[
          styles.container,
          label ? styles.containerMultiline : null,
          topContainer,
          containerPadding,
          androidRowGapOverwrite,
          getBorderColor(),
        ]}
      >
        <View style={styles.inputWrapper}>
          <View
            onAccessibilityEscape={accessibilityEscapeKeyboard}
            style={styles.inputMainContent}
          >
            {label && (
              <ThemeText typography="body__secondary" style={styles.label}>
                {label}
              </ThemeText>
            )}
            <View style={styles.inputRow}>
              {prefix && (
                <PressableOpacity
                  style={styles.inputPrefix}
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
                style={styles.inputPhoneNumber}
                placeholderTextColor={theme.color.foreground.dynamic.secondary}
                onFocus={onFocusEvent}
                onBlur={onBlurEvent}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                testID="loginPhoneInput"
                keyboardType="number-pad"
                {...props}
              />
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
  container: {
    backgroundColor: theme.color.background.neutral[0].background,
    borderWidth: theme.border.width.slim,
    borderColor: theme.color.background.neutral[0].background,
  },
  containerMultiline: {
    paddingTop: theme.spacing.small,
    rowGap: theme.spacing.small,
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  inputMainContent: {
    flex: 1,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    minWidth: 60 - theme.spacing.medium,
    paddingRight: theme.spacing.xSmall,
  },
  inputPrefix: {
    flexDirection: 'row',
  },
  inputPhoneNumber: {
    color: theme.color.foreground.dynamic.primary,
    fontSize: theme.typography.body__primary.fontSize,
    flex: 1,
  },
  expandIcon: {
    marginLeft: theme.spacing.xSmall,
    marginRight: theme.spacing.small,
  },
  inputClear: {
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
    paddingBottom: theme.spacing.medium,
  },
}));
