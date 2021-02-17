import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import {Dot} from '@atb/assets/svg/icons/other';
import Button from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';

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
      <Button
        onPress={onNavigate}
        text={title}
        icon={arrow ? ArrowRight : undefined}
        color="primary_2"
        iconPosition="right"
      />
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
}));
export default NavigationControls;
