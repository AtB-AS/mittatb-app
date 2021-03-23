import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

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
    backgroundColor: theme.colors.background_1.backgroundColor,
    flex: 1,
  },
  innerContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
}));
export default StepOuterContainer;
