import React from 'react';
import {View, Text} from 'react-native';
import {StyleSheet} from '../../theme';

type ResultItemProps = {};

function Line() {
  const styles = useThemeStyles();

  return <View style={styles.line} />;
}

const SearchGroup: React.FC<ResultItemProps> = ({children}) => {
  const styles = useThemeStyles();
  const numChildren = React.Children.count(children);

  return (
    <View style={styles.container}>
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
    padding: 12,
    borderWidth: 1,
    borderColor: '#C3C6C9',
    borderStyle: 'solid',
    borderRadius: 8,
    marginHorizontal: 12,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#F5F5F6',
    marginVertical: 8,
  },
}));
