import {useTranslation} from '@atb/translations';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import TravelDocumentOnboardingTexts from '@atb/translations/screens/subscreens/TravelDocumentOnboarding';
import Button from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {StaticColorByType} from '@atb/theme/colors';
import {Crash} from '@atb/assets/svg/color/images';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

export function NoTravelDocument({}: {}): JSX.Element {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <ThemeText
          type="body__primary--jumbo--bold"
          style={styles.alignCenter}
          color={themeColor}
        >
          {t(TravelDocumentOnboardingTexts.error.heading)}
        </ThemeText>
      </View>
      <View style={styles.svgContainer}>
        <Crash width="185px" height="185px" />
      </View>
      <ThemeText style={styles.description} color={themeColor}>
        {t(TravelDocumentOnboardingTexts.error.description)}
      </ThemeText>
      <View style={styles.bottomView}>
        <Button
          interactiveColor="interactive_0"
          onPress={() => {
            navigation.navigate('Info4');
          }}
          text={t(TravelDocumentOnboardingTexts.next)}
          testID="nextButton"
        />
      </View>
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  svgContainer: {
    marginTop: 46,
    marginLeft: 95,
  },
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
    paddingHorizontal: theme.spacings.xLarge,
  },
  alignCenter: {
    textAlign: 'center',
  },
  topView: {
    marginTop: 100,
  },
  description: {
    marginTop: 34,
    textAlign: 'center',
  },
  bottomView: {
    marginTop: 34,
  },
}));
