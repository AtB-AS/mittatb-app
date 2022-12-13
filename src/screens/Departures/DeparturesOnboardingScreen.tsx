import {useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import Button from '@atb/components/button';
import {ScrollView, View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DeparturesStackProps} from '@atb/screens/Departures/types';
import storage, {StorageModelKeysEnum} from '@atb/storage';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {DeparturesOnboarding} from '@atb/assets/svg/color/images';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {updateMetadata} from '@atb/chat/metadata';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = DeparturesStackProps<'DeparturesOnboardingScreen'>;

export const DeparturesOnboardingScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const focusRef = useFocusOnLoad();
  const {enable_departures_v2_as_default} = useRemoteConfig();

  const setOnboardingCompleted = async () => {
    await storage.set(
      StorageModelKeysEnum.HasReadDeparturesV2Onboarding,
      JSON.stringify(true),
    );
    if (enable_departures_v2_as_default) {
      updateMetadata({
        'AtB-Departures-V2': 'enabled',
      });
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        bounces={false}
      >
        <View
          accessible={true}
          accessibilityLabel={t(DeparturesTexts.onboarding.a11yLabel)}
          ref={focusRef}
        >
          <ThemeText
            style={styles.title}
            color={themeColor}
            type="heading--big"
          >
            {t(DeparturesTexts.onboarding.title)}
          </ThemeText>
          <ThemeText color={themeColor} style={styles.body}>
            {t(DeparturesTexts.onboarding.body.part1)}
          </ThemeText>
          <View style={styles.illustration}>
            <DeparturesOnboarding />
          </View>
          <ThemeText color={themeColor} style={styles.body} isMarkdown={true}>
            {t(DeparturesTexts.onboarding.body.part2)}
          </ThemeText>
        </View>
        <Button
          text={t(DeparturesTexts.onboarding.button)}
          onPress={async () => {
            await setOnboardingCompleted();
            navigation.goBack();
          }}
          style={styles.button}
          testID="departuresOnboardingConfirmButton"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
  title: {
    marginBottom: theme.spacings.xLarge,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
  illustration: {
    alignItems: 'center',
    marginVertical: theme.spacings.xLarge,
  },
  button: {marginVertical: theme.spacings.xLarge},
}));
