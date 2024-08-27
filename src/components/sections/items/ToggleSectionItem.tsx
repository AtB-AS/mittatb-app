import React, {useEffect, useState} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {Toggle} from '@atb/components/toggle';
import {InteractiveColor, TextNames} from '@atb/theme/colors';
import {LabelType} from '@atb/configuration';
import {LabelInfo} from '@atb/components/label-info';
import {SectionTexts, useTranslation} from '@atb/translations';

type Props = SectionItemProps<{
  text: string;
  subtext?: string;
  label?: LabelType;
  onValueChange: (checked: boolean) => void;
  value?: boolean;
  leftImage?: JSX.Element;
  interactiveColor?: InteractiveColor;
  accessibility?: AccessibilityProps;
  textType?: TextNames;
  disabled?: boolean;
}>;
export function ToggleSectionItem({
  text,
  subtext,
  label,
  onValueChange,
  leftImage,
  value = false,
  accessibility,
  testID,
  interactiveColor,
  textType,
  disabled = false,
  ...props
}: Props) {
  const {topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useStyles();
  const {t} = useTranslation();

  /*
   Need to maintain a internal copy of the checked state for the accessibility
   state to be read correctly. This is because we need an immediate rerender of
   the component so the accessibilityState is updated before the screen reader
   announces the value. This is also why we use the setTimeout-trick on the
   onValueChange callback, so the rerender doesn't need to wait until that
   method has finished execution.
   */
  const [checked, setChecked] = useState(value);
  useEffect(() => setChecked(value), [value]);
  const onChange = (v: boolean) => {
    if (disabled) return;
    setChecked(v);
    setTimeout(() => onValueChange(v), 0);
  };

  return (
    <View
      style={topContainer}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{checked: checked, disabled: disabled}}
      accessibilityActions={[{name: 'activate'}]}
      onAccessibilityAction={() => onChange(!checked)}
      accessibilityHint={
        disabled ? t(SectionTexts.toggleInput.disabled) : undefined
      }
      {...accessibility}
    >
      <View style={{flexDirection: 'row'}}>
        {leftImage && (
          <View style={styles.leftImageContainer}>
            {leftImage}
          </View>
        )}
        <View style={{flexDirection: 'column', flex: 1}}>
          <View style={sectionStyle.spaceBetween}>
            <View style={styles.textContainer}>
              <ThemeText type={textType}>{text}</ThemeText>
            </View>
            {label && <LabelInfo label={label} />}
            <Toggle
              importantForAccessibility="no-hide-descendants"
              accessible={false}
              value={checked}
              onValueChange={onChange}
              testID={testID}
              interactiveColor={interactiveColor}
              disabled={disabled}
            />
          </View>
          {subtext && (
            <ThemeText
              type="body__secondary"
              color="secondary"
              style={styles.subtext}
            >
              {subtext}
            </ThemeText>
          )}
        </View>
      </View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  leftImageContainer: {
    marginRight: theme.spacing.small,
    justifyContent: 'center',
  },
  textContainer: {flex: 1, marginRight: theme.spacing.small},
  subtext: {marginTop: theme.spacing.xSmall},
}));
