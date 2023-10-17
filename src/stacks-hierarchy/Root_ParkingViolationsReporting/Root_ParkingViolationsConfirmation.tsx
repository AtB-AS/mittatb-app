import {View} from 'react-native';
import {ScreenContainer, themeColor} from './components/ScreenContainer';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useEffect} from 'react';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useAnalytics} from '@atb/analytics';

export type ConfirmationScreenProps =
  RootStackScreenProps<'Root_ParkingViolationsConfirmation'>;

export const Root_ParkingViolationsConfirmation = ({
  navigation,
  route: {params},
}: ConfirmationScreenProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const analytics = useAnalytics();

  const closeReporting = () => {
    analytics.logEvent('Mobility', 'Parking violation report sent');
    navigation.popToTop();
  };

  useEffect(() => {
    // Automatically close this screen after 5 seconds
    const timer = setTimeout(closeReporting, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenContainer
      rightHeaderButton={{type: 'close', onPress: closeReporting}}
    >
      <View style={styles.confirmation}>
        <ThemeText color={themeColor} type="heading--big">
          {t(ParkingViolationTexts.confirmation.title)}
        </ThemeText>
        <ThemeText style={styles.description} color={themeColor}>
          {t(
            ParkingViolationTexts.confirmation.description(params.providerName),
          )}
        </ThemeText>
        <PressableOpacity style={styles.checkmark} onPress={closeReporting}>
          <ThemeIcon
            stroke={'#fff'}
            fill={'#fff'}
            size={'large'}
            svg={Confirm}
          />
        </PressableOpacity>
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
  description: {
    marginVertical: theme.spacings.medium,
  },
  checkmark: {
    marginTop: theme.spacings.medium,
    height: 72,
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: theme.interactive.interactive_0.default.background,
  },
}));
