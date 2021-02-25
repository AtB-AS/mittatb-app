import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

const StepOuterContainer: React.FC = ({children}) => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.innerContainer}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    maxWidth: 500,
    justifyContent: 'space-between',
  },
}));
export default StepOuterContainer;
