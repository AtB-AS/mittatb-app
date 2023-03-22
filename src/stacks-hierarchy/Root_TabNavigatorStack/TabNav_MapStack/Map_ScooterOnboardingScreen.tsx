import {useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {ScrollView, View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import storage, {StorageModelKeysEnum} from '@atb/storage';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ScooterOnboarding} from '@atb/assets/svg/color/images';
import {MapScreenProps} from './navigation-types';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = MapScreenProps<'Map_ScooterOnboardingScreen'>;

export const Map_ScooterOnboardingScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const focusRef = useFocusOnLoad();

  const setOnboardingCompleted = async () => {
    await storage.set(
      StorageModelKeysEnum.HasReadScooterOnboarding,
      JSON.stringify(true),
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        bounces={false}
      >
        <View
          accessible={true}
          accessibilityLabel={t(ScooterTexts.onboarding.a11yLabel)}
          ref={focusRef}
        >
          <ThemeText
            style={styles.title}
            color={themeColor}
            type="heading--big"
          >
            {t(ScooterTexts.onboarding.title)}
          </ThemeText>
          <View style={styles.illustration}>
            <ScooterOnboarding />
          </View>
          <ThemeText color={themeColor} style={styles.body}>
            {t(ScooterTexts.onboarding.body)}
          </ThemeText>
        </View>
        <Button
          text={t(ScooterTexts.onboarding.button)}
          onPress={async () => {
            await setOnboardingCompleted();
            navigation.goBack();
          }}
          style={styles.button}
          testID="mapScootersOnboardingConfirmButton"
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
