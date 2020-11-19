import React, {PropsWithChildren} from 'react';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import TextInput from './text-input';
import ButtonInput from './button-input';
import {StyleSheet, Theme} from '../../theme';
import LocationInput from './location-input';

export type ListGroupProps = PropsWithChildren<{
  withPadding?: boolean;
}>;

function InputGroup({children, withPadding}: ListGroupProps) {
  const style = useInputGroupStyle();
  const len = React.Children.count(children) - 1;

  return (
    <View
      style={[
        style.container,
        withPadding ? style.container__padded : undefined,
      ]}
    >
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
  Location: LocationInput,
};

export default Input;

const useInputGroupStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    flexGrow: 1,
    height: 1,
  },
  container: {
    overflow: 'hidden',
  },
  container__padded: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.small,
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
