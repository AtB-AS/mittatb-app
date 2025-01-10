import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import React, {PropsWithChildren} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {SvgProps} from 'react-native-svg';
import {ThemeIcon} from '@atb/components/theme-icon';

export type InternalLabeledItemProps = SectionItemProps<
  PropsWithChildren<{
    label: string;
    subtext?: string;
    leftIcon?: (props: SvgProps) => JSX.Element;
    accessibleLabel?: boolean;
    wrapperStyle?: StyleProp<ViewStyle>;
  }>
>;
export function InternalLabeledSectionItem({
  label,
  subtext,
  leftIcon,
  children,
  wrapperStyle,
  accessibleLabel = false,
  ...props
}: InternalLabeledItemProps) {
  const {topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const itemStyle = useStyle();

  return (
    <View style={[style.spaceBetween, topContainer, wrapperStyle]}>
      {leftIcon && <ThemeIcon svg={leftIcon} style={itemStyle.icon} />}
      <View accessible={accessibleLabel} style={itemStyle.label}>
        <ThemeText accessible={accessibleLabel} typography="body__primary">
          {label}
        </ThemeText>
        {subtext && (
          <ThemeText
            typography="body__secondary"
            color="secondary"
            style={itemStyle.label}
            accessible={accessibleLabel}
          >
            {subtext}
          </ThemeText>
        )}
      </View>
      {children}
    </View>
  );
}

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  icon: {marginRight: theme.spacing.small},
  label: {flex: 1},
  subtext: {
    marginTop: theme.spacing.small,
  },
}));
