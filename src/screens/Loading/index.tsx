import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import ThemeText from '../../components/text';
import colors from '../../theme/colors';

const Loading: React.FC<{text?: string}> = ({text}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        size="large"
        color={colors.general.white}
      />
      {text ? (
        <ThemeText type="paragraphHeadline" style={styles.text}>
          {text}
        </ThemeText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary.cyan,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
  },
});

export default Loading;
