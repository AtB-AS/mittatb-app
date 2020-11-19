import React, {PropsWithChildren} from 'react';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import TextInput from './text-input';
import ButtonInput from './button-input';
import {StyleSheet, Theme} from '../../theme';

export type ListGroupProps = PropsWithChildren<{}>;

function InputGroup({children}: ListGroupProps) {
  const style = useInputGroupStyle();
  const len = React.Children.count(children) - 1;

  return (
    <View style={style.container}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        let previous: StyleProp<ViewStyle | TextStyle | ImageStyle> = [];
        if (hasStyle(child)) {
          previous = Array.isArray(child.style) ? child.style : [child.style];
        }

        const first = index === 0 ? style.first : undefined;
        const last = index === len ? style.last : undefined;

        const props = {
          style: previous.concat([first, last]),
        };

        return (
          <>
            {React.cloneElement(child, props)}
            {index !== len && <View style={style.separator} />}
          </>
        );
      })}
    </View>
  );
}

type WithStyle = {
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
};
function hasStyle(a: any): a is Required<WithStyle> {
  return 'style' in a;
}

const Input = {
  Group: InputGroup,
  Text: TextInput,
  Button: ButtonInput,
};

export default Input;

const useInputGroupStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    flexGrow: 1,
    height: 1,
  },
  container: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.small,
    overflow: 'hidden',
  },
  first: {
    borderTopLeftRadius: theme.border.radius.regular,
    borderTopRightRadius: theme.border.radius.regular,
  },
  last: {
    borderBottomLeftRadius: theme.border.radius.regular,
    borderBottomRightRadius: theme.border.radius.regular,
  },
}));
