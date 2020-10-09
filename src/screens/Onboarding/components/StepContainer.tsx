import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {StyleSheet} from '../../../theme';
const StepOuterContainer: React.FC = ({children}) => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>{children}</View>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    maxWidth: 500,
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  },
}));
export default StepOuterContainer;
