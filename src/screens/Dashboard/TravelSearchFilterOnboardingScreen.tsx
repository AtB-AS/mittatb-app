import {TripSearchTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {ScrollView, View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import storage, {StorageModelKeysEnum} from '@atb/storage';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {DashboardScreenProps} from '@atb/screens/Dashboard/types';
import FilterOnboarding from '@atb/assets/svg/color/images/FilterOnboarding';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = DashboardScreenProps<'TravelSearchFilterOnboardingScreen'>;

export const TravelSearchFilterOnboardingScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const focusRef = useFocusOnLoad();

  const setOnboardingCompleted = async () => {
    await storage.set(
      StorageModelKeysEnum.HasReadTravelSearchFilterOnboarding,
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
          accessibilityLabel={t(TripSearchTexts.onboarding.a11yLabel)}
          ref={focusRef}
        >
          <ThemeText
            style={styles.title}
            color={themeColor}
            type="heading--big"
          >
            {t(TripSearchTexts.onboarding.title)}
          </ThemeText>
          <ThemeText color={themeColor} style={styles.body}>
            {t(TripSearchTexts.onboarding.body.part1)}
          </ThemeText>
          <View style={styles.illustration}>
            <FilterOnboarding />
          </View>
          <ThemeText color={themeColor} style={styles.body} isMarkdown={true}>
            {t(TripSearchTexts.onboarding.body.part2)}
          </ThemeText>
        </View>
        <Button
          text={t(TripSearchTexts.onboarding.button)}
          onPress={async () => {
            await setOnboardingCompleted();
            navigation.goBack();
          }}
          style={styles.button}
          testID="filterOnboardingConfirmButton"
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
