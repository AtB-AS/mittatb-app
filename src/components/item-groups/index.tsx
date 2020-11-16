import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import ActionItem from './action-item';
import HeaderItem from './header-item';
import LinkItem from './link-item';
import useListStyle from './style';

export type ListGroupProps = PropsWithChildren<{
  withTopMargin?: boolean;
}>;

function ListGroup({children, withTopMargin = false}: ListGroupProps) {
  const style = useListStyle();
  const len = React.Children.count(children) - 1;

  return (
    <View
      style={[
        style.container,
        withTopMargin ? style.container__marginTop : undefined,
      ]}
    >
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

const List = {
  Group: ListGroup,
  Link: LinkItem,
  Action: ActionItem,
  Header: HeaderItem,
};

export default List;
