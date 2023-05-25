import React, {PropsWithChildren} from 'react';
import {AccessibilityProps, View, ViewStyle} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {ContainerSizingType} from './types';
import {BaseSectionItemProps} from './use-section-item';

export type SectionProps = PropsWithChildren<{
  withPadding?: boolean;
  withFullPadding?: boolean;
  withTopPadding?: boolean;
  withBottomPadding?: boolean;
  type?: ContainerSizingType;
  style?: ViewStyle;
  testID?: string;
}> &
  AccessibilityProps;

export function Section({
  children,
  withPadding = false,
  withFullPadding = false,
  withTopPadding = false,
  withBottomPadding = false,
  type = 'block',
  style,
  ...props
}: SectionProps) {
  const styles = useStyles();
  const validChildren: boolean[] =
    React.Children.map(children, React.isValidElement) ?? [];
  const firstIndex = validChildren.indexOf(true);
  const lastIndex = validChildren.lastIndexOf(true);

  const containerStyle: Array<ViewStyle | undefined> = [
    style,
    withPadding ? styles.container__padded : undefined,
    withFullPadding ? styles.container__fullPadded : undefined,
    withTopPadding ? styles.container__topPadded : undefined,
    withBottomPadding ? styles.container__bottomPadded : undefined,
  ];

  return (
    <View style={containerStyle} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        if (child == null) return child;

        let additionalProps: Partial<BaseSectionItemProps> = {
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

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    flexGrow: 1,
    backgroundColor: theme.static.background.background_2.background,
    height: 1,
  },
  container__padded: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.small,
  },
  container__fullPadded: {
    margin: theme.spacings.medium,
  },
  container__topPadded: {
    marginTop: theme.spacings.large,
  },
  container__bottomPadded: {
    marginBottom: theme.spacings.large,
  },
}));
