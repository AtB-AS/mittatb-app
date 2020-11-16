import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import ThemeText from '../../components/text';
import {StyleSheet, useTheme} from '../../theme';

const Loading: React.FC<{text?: string}> = ({text}) => {
  const {theme} = useTheme();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={true}
        size="large"
        color={theme.text.colors.primary}
      />
      {text ? (
        <ThemeText type="paragraphHeadline" style={styles.text}>
          {text}
        </ThemeText>
      ) : null}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.accent,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
  },
}));

export default Loading;
