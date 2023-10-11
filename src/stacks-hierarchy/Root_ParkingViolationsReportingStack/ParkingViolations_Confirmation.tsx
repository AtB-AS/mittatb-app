import {View} from 'react-native';
import {ScreenContainer} from './ScreenContainer';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {themeColor} from './Root_ParkingViolationsReportingStack';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {ParkingViolationsScreenProps} from './navigation-types';
import {useEffect} from 'react';

export type ConfirmationScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Confirmation'>;

export const ParkingViolations_Confirmation = ({
  route: {params},
}: ConfirmationScreenProps) => {
  const styles = useStyles();

  useEffect(() => {
    //TODO: Save
    console.log(params);
  }, []);

  return (
    <ScreenContainer rightHeaderButton={{type: 'close'}}>
      <View style={styles.confirmation}>
        <ThemeText color={themeColor} type="heading--big">
          Feilparkering rapportert!
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
