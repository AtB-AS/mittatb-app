import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet} from '../../theme';

type ResultItemProps = {
  containerStyle?: StyleProp<ViewStyle>;
};

function Line() {
  const styles = useThemeStyles();

  return <View style={styles.line} />;
}

const SearchGroup: React.FC<ResultItemProps> = ({children, containerStyle}) => {
  const styles = useThemeStyles();
  const numChildren = React.Children.count(children);

  return (
    <View style={[styles.container, containerStyle]}>
      {React.Children.map(children, function (item, index) {
        if (index === numChildren - 1) return item;
        return (
          <>
            {item}
            <Line />
          </>
        );
      })}
    </View>
  );
};

export default SearchGroup;

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level0,
    borderRadius: theme.border.radius.regular,
    marginHorizontal: 12,
  },
  line: {
    height: theme.border.width.slim,
    backgroundColor: theme.background.level1,
    width: '100%',
  },
}));
