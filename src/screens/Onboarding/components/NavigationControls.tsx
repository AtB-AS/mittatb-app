import React from 'react';
import {View} from 'react-native';
import {Dot} from '../../../assets/svg/icons/other';
import {TouchableOpacity} from 'react-native';
import {ArrowRight} from '../../../assets/svg/icons/navigation';
import {StyleSheet} from '../../../theme';
import colors from '../../../theme/colors';
import ThemeIcon from '../../../components/theme-icon';
import ThemeText from '../../../components/text';

type NavigateButtonProps = {
  onNavigate(): void;
  title?: string;
  arrow?: boolean;
  currentPage: number;
};
const NavigationControls: React.FC<NavigateButtonProps> = ({
  onNavigate,
  title = 'Fortsett',
  arrow = true,
  children,
  currentPage,
}) => {
  const styles = useStyles();
  const numberDots = 3;
  return (
    <View style={styles.navigationContainer}>
      <View style={styles.bulletContainer}>
        {[...Array(numberDots)].map((v, i) => (
          <Dot
            style={styles.bullet}
            fill={currentPage === i + 1 ? '#007C92' : '#C3C6C9'}
            key={i}
            width={12}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onNavigate}>
        <ThemeText type="paragraphHeadline">{title}</ThemeText>
        {arrow && <ThemeIcon svg={ArrowRight} style={styles.buttonIcon} />}
      </TouchableOpacity>
      {children}
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme) => ({
  navigationContainer: {
    width: '100%',
    padding: theme.spacings.xLarge,
    minHeight: 170,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bullet: {
    marginHorizontal: theme.spacings.medium / 2,
    marginVertical: theme.spacings.medium,
  },
  button: {
    backgroundColor: theme.button.primary.bg,
    width: '100%',
    height: 44,
    borderRadius: theme.border.radius.regular,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonIcon: {
    position: 'absolute',
    right: theme.spacings.medium,
  },
}));
export default NavigationControls;
