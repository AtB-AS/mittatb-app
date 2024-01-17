import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import SvgPassengerCategoryChecked from '@atb/assets/svg/color/images/Periodebillett';
import {useEffect} from 'react';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = RootStackScreenProps<'Root_ConfirmationScreen'>;

export const Root_ConfirmationScreen = ({
  route: {
    params: {message, onCompleted},
  },
}: Props) => {
  const styles = useStyles();

  useEffect(() => {
    const timer = setTimeout(onCompleted, 3000);
    return () => clearTimeout(timer);
  }, [onCompleted]);

  return (
    <View style={styles.container}>
      <ThemeText
        type="body__primary--jumbo"
        color={themeColor}
        style={styles.message}
      >
        {message}
      </ThemeText>
      <SvgPassengerCategoryChecked style={styles.illustration} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.static.background[themeColor].background,
  },
  illustration: {
    marginTop: theme.spacings.xLarge,
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
}));
