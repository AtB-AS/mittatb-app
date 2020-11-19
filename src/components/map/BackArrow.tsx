import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ArrowLeft} from '../../assets/svg/icons/navigation';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
import ThemeIcon from '../theme-icon';
import shadows from './shadows';

const BackArrow: React.FC<{onBack(): void}> = ({onBack}) => {
  const styles = useStyles();
  return (
    <TouchableOpacity
      accessibilityLabel="Gå tilbake"
      accessibilityRole="button"
      onPress={onBack}
      hitSlop={insets.symmetric(12, 20)}
    >
      <View style={styles.backArrow}>
        <ThemeIcon svg={ArrowLeft} />
      </View>
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  backArrow: {
    backgroundColor: theme.button.primary2.backgroundColor,
    borderRadius: theme.border.radius.regular,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 28,
    ...shadows,
  },
}));

export default BackArrow;
