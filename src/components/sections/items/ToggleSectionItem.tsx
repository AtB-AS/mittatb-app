import React, {useEffect, useState} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {Toggle} from '@atb/components/toggle';
import {InteractiveColor, TextNames} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import {LabelType} from '@atb-as/config-specs';
import {LabelInfo} from '@atb/components/label-info';

type Props = SectionItemProps<{
  text: string;
  subtext?: string;
  label?: LabelType;
  onValueChange: (checked: boolean) => void;
  value?: boolean;
  leftIcon?: (props: SvgProps) => JSX.Element;
  interactiveColor?: InteractiveColor;
  accessibility?: AccessibilityProps;
  textType?: TextNames;
}>;
export function ToggleSectionItem({
  text,
  subtext,
  label,
  onValueChange,
  leftIcon,
  value = false,
  accessibility,
  testID,
  interactiveColor,
  textType,
  ...props
}: Props) {
  const {topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useStyles();

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
    setChecked(v);
    setTimeout(() => onValueChange(v), 0);
  };

  return (
    <View
      style={topContainer}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{checked: checked}}
      accessibilityActions={[{name: 'activate'}]}
      onAccessibilityAction={() => onChange(!checked)}
      {...accessibility}
    >
      <View style={sectionStyle.spaceBetween}>
        {leftIcon && <ThemeIcon svg={leftIcon} style={styles.leftIcon} />}
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
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  leftIcon: {marginRight: theme.spacings.small},
  textContainer: {flex: 1, marginRight: theme.spacings.small},
  subtext: {marginTop: theme.spacings.xSmall},
}));
