import React from 'react';
import {SvgProps} from 'react-native-svg';
import {View} from 'react-native';
import {StyleSheet} from '../../../theme';
type IllustrationProps = {
  Svg: React.FC<SvgProps>;
};
const Illustration: React.FC<IllustrationProps> = ({Svg}) => {
  const styles = useStyles();
  return (
    <View style={styles.svgContainer}>
      <Svg height="100%" width="100%" />
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  svgContainer: {
    backgroundColor: theme.background.level2,
    width: '100%',
    maxHeight: '50%',
  },
}));
export default Illustration;
