import React, {PropsWithChildren, Ref} from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ContainerSizingType} from './types';
import {BaseSectionItemProps} from './use-section-item';

export type SectionProps = PropsWithChildren<{
  type?: ContainerSizingType;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  ref?: Ref<View>;
}> &
  AccessibilityProps;

export function Section({
  children,
  type = 'block',
  style,
  ...props
}: SectionProps) {
  const styles = useStyles();
  const validChildren: boolean[] =
    React.Children.map(children, React.isValidElement) ?? [];
  const firstIndex = validChildren.indexOf(true);
  const lastIndex = validChildren.lastIndexOf(true);

  return (
    <View style={style} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        if (child == null) return child;

        const additionalProps: Partial<BaseSectionItemProps> = {
          radius: toRadius(index, lastIndex, firstIndex),
          radiusSize: 'regular',
          type,
          ...child.props,
        };

        return (
          <>
            {React.cloneElement(child, additionalProps)}
            {index !== lastIndex && <View style={styles.separator} />}
          </>
        );
      })}
    </View>
  );
}

function toRadius(index: number, lastIndex: number, firstIndex: number) {
  const isFirst = index === firstIndex;
  const isLast = index === lastIndex;

  if (isFirst && isLast) {
    return 'top-bottom';
  }
  if (isFirst) {
    return 'top';
  }
  if (isLast) {
    return 'bottom';
  }
  return undefined;
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  separator: {
    flexGrow: 0,
    backgroundColor: theme.static.background.background_2.background,
    height: 1,
  },
}));
