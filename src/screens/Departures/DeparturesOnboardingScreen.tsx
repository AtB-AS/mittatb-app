import {useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import Button from '@atb/components/button';
import {ScrollView, View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StaticColorByType} from '@atb/theme/colors';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DeparturesStackProps} from '@atb/screens/Departures/types';
import storage from '@atb/storage';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {screenReaderPause} from '@atb/components/accessible-text';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

type Props = DeparturesStackProps<'DeparturesOnboardingScreen'>;

export const DeparturesOnboardingScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const focusRef = useFocusOnLoad();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        bounces={false}
      >
        <View
          accessible={true}
          accessibilityLabel={
            t(DeparturesTexts.onboarding.title) +
            screenReaderPause +
            t(DeparturesTexts.onboarding.body)
          }
          ref={focusRef}
        >
          <ThemeText
            style={styles.title}
            color={themeColor}
            type="heading--jumbo"
            accessible={true}
          >
            {t(DeparturesTexts.onboarding.title)}
          </ThemeText>
          <ThemeText color={themeColor} style={styles.body}>
            {t(DeparturesTexts.onboarding.body)}
          </ThemeText>
        </View>
      </ScrollView>
      <Button
        text={t(DeparturesTexts.onboarding.button)}
        icon={Confirm}
        iconPosition="right"
        onPress={async () => {
          await storage.set(
            '@ATB_has_read_departures_v2_onboarding',
            JSON.stringify(true),
          );
          navigation.goBack();
        }}
        style={styles.button}
      />
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
  title: {marginBottom: theme.spacings.medium},
  body: {marginBottom: theme.spacings.medium},
  button: {margin: theme.spacings.xLarge},
}));
