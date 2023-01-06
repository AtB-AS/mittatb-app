import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';

type ButtonGroupProps = PropsWithChildren<{}>;

export function ButtonGroup({children}: ButtonGroupProps) {
  const style = useGroupStyle();
  const len = React.Children.count(children) - 1;

  return (
    <View>
      {React.Children.map(children, (child, index) => {
        if (index === len) {
          return child;
        }
        return (
          <>
            {child}
            <View style={style.separator} />
          </>
        );
      })}
    </View>
  );
}

const useGroupStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    height: theme.spacings.small,
  },
}));
