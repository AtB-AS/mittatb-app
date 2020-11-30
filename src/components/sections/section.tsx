import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import {StyleSheet, Theme} from '../../theme';
import {ContainerSizingType, SectionItemProps} from './section-utils';

export type SectionProps = PropsWithChildren<{
  withPadding?: boolean;
  withTopPadding?: boolean;
  type?: ContainerSizingType;
}>;

export default function SectionGroup({
  children,
  withPadding = false,
  withTopPadding = false,
  type = 'block',
}: SectionProps) {
  const style = useInputGroupStyle();
  const len =
    (React.Children.map(children, (child) =>
      Number(React.isValidElement(child)),
    )?.reduce((a, b) => a + b, 0) ?? 1) - 1;

  const containerStyle = [
    withPadding ? style.container__padded : undefined,
    withTopPadding ? style.container__topPadded : undefined,
  ];

  return (
    <View style={containerStyle}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        let additionalProps: Partial<SectionItemProps> = {
          radius: toRadius(index, len),
          radiusSize: 'regular',
          type,
          ...child.props,
        };

        return (
          <>
            {React.cloneElement(child, additionalProps)}
            {index !== len && <View style={style.separator} />}
          </>
        );
      })}
    </View>
  );
}

function toRadius(index: number, len: number) {
  const isFirst = index === 0;
  const isLast = index === len;

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
  container__topPadded: {
    marginTop: theme.spacings.large,
  },
}));
