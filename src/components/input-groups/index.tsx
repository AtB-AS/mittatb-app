import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
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

const Input = {
  Group: InputGroup,
  Text: TextInput,
  Button: ButtonInput,
};

export default Input;

const useInputGroupStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    flexGrow: 1,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  container: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.small,
    overflow: 'hidden',
  },
}));
