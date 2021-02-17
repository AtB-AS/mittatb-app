import React, {PropsWithChildren} from 'react';
import {View, ViewStyle} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {ContainerSizingType, SectionItemProps} from './section-utils';

export type SectionProps = PropsWithChildren<{
  withPadding?: boolean;
  withFullPadding?: boolean;
  withTopPadding?: boolean;
  withBottomPadding?: boolean;
  type?: ContainerSizingType;
}>;

export default function SectionGroup({
  children,
  withPadding = false,
  withFullPadding = false,
  withTopPadding = false,
  withBottomPadding = false,
  type = 'block',
}: SectionProps) {
  const style = useInputGroupStyle();
  const validChildren: boolean[] =
    React.Children.map(children, React.isValidElement) ?? [];
  const firstIndex = validChildren.indexOf(true);
  const lastIndex = validChildren.lastIndexOf(true);

  const containerStyle: Array<ViewStyle | undefined> = [
    withPadding ? style.container__padded : undefined,
    withFullPadding ? style.container__fullPadded : undefined,
    withTopPadding ? style.container__topPadded : undefined,
    withBottomPadding ? style.container__bottomPadded : undefined,
  ];

  return (
    <View style={containerStyle}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        if (child == null) return child;

        let additionalProps: Partial<SectionItemProps> = {
          radius: toRadius(index, lastIndex, firstIndex),
          radiusSize: 'regular',
          type,
          ...child.props,
        };

        return (
          <>
            {React.cloneElement(child, additionalProps)}
            {index !== lastIndex && <View style={style.separator} />}
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

const useInputGroupStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    flexGrow: 1,
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
