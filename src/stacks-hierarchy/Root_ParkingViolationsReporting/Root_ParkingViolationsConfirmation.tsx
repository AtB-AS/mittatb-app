import {View} from 'react-native';
import {ScreenContainer, themeColor} from './components/ScreenContainer';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';

export type ConfirmationScreenProps =
  RootStackScreenProps<'Root_ParkingViolationsConfirmation'>;

export const Root_ParkingViolationsConfirmation = ({
  navigation,
}: ConfirmationScreenProps) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <ScreenContainer
      rightHeaderButton={{type: 'close', onPress: () => navigation.popToTop()}}
    >
      <View style={styles.confirmation}>
        <ThemeText color={themeColor} type="heading--big">
          {t(ParkingViolationTexts.confirmation.title)}
        </ThemeText>
        <View style={styles.checkmark}>
          <ThemeIcon stroke={'white'} fill={'white'} svg={Confirm} />
        </View>
      </View>
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  confirmation: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    marginTop: theme.spacings.medium,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: theme.interactive.interactive_0.default.background,
  },
}));
