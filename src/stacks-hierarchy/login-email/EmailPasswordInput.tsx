import React, {useState} from 'react';
import {TextInputProps} from 'react-native';
import {TextInputSectionItem} from '@atb/components/sections';
import {NativeTouchable} from '@atb/components/native-touchable';
import {ThemeText} from '@atb/components/text';
import {insets} from '@atb/utils/insets';
import {LoginTexts, useTranslation} from '@atb/translations';

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  /** `new` for choosing a password, `current` for logging in. */
  kind: 'new' | 'current';
  autoFocus?: boolean;
  testID?: string;
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
};

/** Password field with a show/hide toggle and password manager hints. */
export const EmailPasswordInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  kind,
  autoFocus,
  testID,
  onSubmitEditing,
}: Props) => {
  const {t} = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextInputSectionItem
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!isVisible}
      autoComplete={kind === 'new' ? 'new-password' : 'current-password'}
      textContentType={kind === 'new' ? 'newPassword' : 'password'}
      autoCapitalize="none"
      autoCorrect={false}
      inlineLabel={false}
      autoFocus={autoFocus}
      testID={testID}
      onSubmitEditing={onSubmitEditing}
      suffixNode={
        <NativeTouchable
          variant="borderless"
          accessibilityRole="button"
          accessibilityLabel={t(
            isVisible
              ? LoginTexts.email.passwordToggle.hideA11yLabel
              : LoginTexts.email.passwordToggle.showA11yLabel,
          )}
          hitSlop={insets.all(8)}
          onPress={() => setIsVisible((visible) => !visible)}
          testID={testID ? `${testID}VisibilityToggle` : undefined}
        >
          <ThemeText typography="body__m__underline">
            {t(
              isVisible
                ? LoginTexts.email.passwordToggle.hide
                : LoginTexts.email.passwordToggle.show,
            )}
          </ThemeText>
        </NativeTouchable>
      }
    />
  );
};
