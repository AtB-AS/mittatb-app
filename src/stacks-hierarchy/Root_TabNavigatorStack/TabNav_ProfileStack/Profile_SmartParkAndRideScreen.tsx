import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ThemeText} from '@atb/components/text';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';

export const Profile_SmartParkAndRideScreen = () => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <FullScreenView
      headerProps={{
        title: t(SmartParkAndRideTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
    >
      <View style={styles.container}>
        <ThemeText typography="body__primary--jumbo--bold" style={styles.text}>
          {t(SmartParkAndRideTexts.todo)}
        </ThemeText>
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
    marginTop: theme.spacing.large,
    margin: theme.spacing.medium,
    display: 'flex',
  },
  text: {
    textAlign: 'center',
  },
}));
