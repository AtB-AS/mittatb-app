import {StyleSheet} from '@atb/theme';
import {
  ShareTravelHabitsTexts,
  useTranslation,
  getTextForLanguage,
} from '@atb/translations';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackScreenProps} from './navigation-types';
import {Button} from '@atb/components/button';
import {Linking, View} from 'react-native';
import {Beacons} from '@atb/assets/svg/color/images';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

export type SearchStopPlaceProps =
  RootStackScreenProps<'Root_ShareTravelHabitsScreen'>;

export const Root_ShareTravelHabitsScreen = ({
  navigation,
}: SearchStopPlaceProps) => {
  const {t, language} = useTranslation();
  const styles = useThemeStyles();

  const {configurableLinks} = useFirestoreConfiguration();

  const choosePermissions = () => {
    // todo: add permission requests here

    // then close the screen
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Beacons height={132} />
        <ThemeText
          type="body__primary--big--bold"
          color="background_accent_0"
          style={styles.title}
        >
          {t(ShareTravelHabitsTexts.title)}
        </ThemeText>
        <ThemeText
          type="body__primary"
          color="background_accent_0"
          style={styles.description}
        >
          {t(ShareTravelHabitsTexts.description.improvement) +
            '\n\n' +
            t(ShareTravelHabitsTexts.description.safety)}
        </ThemeText>
        <PressableOpacity
          onPress={() => {
            const dataSharingInfoUrl =
              getTextForLanguage(
                configurableLinks?.dataSharingInfo,
                language,
              ) ??
              'https://www.atb.no/forside/aktuelt/nar-du-deler-reisevaner-med-oss'; // todo: remove fallback when implemented in firestore
            dataSharingInfoUrl && Linking.openURL(dataSharingInfoUrl);
          }}
          accessibilityRole="link"
          accessibilityHint={t(
            ShareTravelHabitsTexts.readMoreAboutDataSharingA11yHint,
          )}
        >
          <ThemeText
            type="body__primary--underline"
            color="background_accent_0"
            style={styles.readMoreAboutDataSharingLink}
          >
            {t(ShareTravelHabitsTexts.readMoreAboutDataSharing)}
          </ThemeText>
        </PressableOpacity>
      </View>
      <View style={styles.footer}>
        <ThemeText
          type="body__tertiary"
          color="background_accent_0"
          style={styles.bluetoothInfo}
        >
          {t(ShareTravelHabitsTexts.bluetoothInfo)}
        </ThemeText>
        <Button
          interactiveColor="interactive_0"
          onPress={choosePermissions}
          text={t(ShareTravelHabitsTexts.choosePermissions)}
        />
      </View>
    </SafeAreaView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacings.xLarge,
  },
  header: {
    marginTop: theme.spacings.large * 2,
    alignItems: 'center',
  },
  title: {
    marginTop: theme.spacings.xLarge,
    textAlign: 'center',
  },
  description: {
    marginVertical: theme.spacings.medium,
    textAlign: 'center',
  },
  readMoreAboutDataSharingLink: {
    textAlign: 'center',
  },
  bluetoothInfo: {
    padding: theme.spacings.medium,
    marginVertical: theme.spacings.small,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
}));
