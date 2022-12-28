import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import React, {PropsWithChildren} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {SectionItem, useSectionItem, useSectionStyle} from '../section-utils';

export type InternalLabeledItemProps = SectionItem<
  PropsWithChildren<{
    label: string;
    accessibleLabel?: boolean;
    wrapperStyle?: StyleProp<ViewStyle>;
  }>
>;
export default function InternalLabeledItem({
  label,
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
      <ThemeText
        accessible={accessibleLabel}
        type="body__primary"
        style={itemStyle.label}
      >
        {label}
      </ThemeText>
      {children}
    </View>
  );
}

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  label: {
    // @TODO Find a better way to do this.
    minWidth: 60 - theme.spacings.medium,
    flex: 1,
    flexWrap: 'wrap',
  },
  content: {
    // flexGrow: 1,
    // flexShrink: 0,
    // alignItems: 'center',
  },
}));
