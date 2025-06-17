import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import {LinkSectionItem, Section} from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import {ContentHeading} from '@atb/components/heading';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProps} from '@atb/stacks-hierarchy';

export const Profile_SmartParkAndRideScreen = () => {
  const {t} = useTranslation();
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProps>();

  return (
    <FullScreenView
      headerProps={{
        title: t(SmartParkAndRideTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
    >
      <View style={styles.container}>
        <ContentHeading text={t(SmartParkAndRideTexts.content.heading)} />
        <Section>
          <LinkSectionItem
            text={t(SmartParkAndRideTexts.content.addVehicle)}
            onPress={() =>
              navigation.navigate('Root_SmartParkAndRideAddScreen', {
                transitionOverride: 'slide-from-right',
              })
            }
            icon={<ThemeIcon svg={Add} />}
          />
        </Section>
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
