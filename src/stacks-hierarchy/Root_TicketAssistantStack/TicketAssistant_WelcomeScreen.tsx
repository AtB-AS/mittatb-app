import {ScrollView, useWindowDimensions, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {TicketSplash} from '@atb/assets/svg/color/images';
import React from 'react';
import {Button} from '@atb/components/button';
import {StaticColorByType} from '@atb/theme/colors';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';

export const themeColor: StaticColorByType<'background'> =
  'background_accent_0';

export type WelcomeScreenProps =
  TicketAssistantScreenProps<'TicketAssistant_WelcomeScreen'>;
export const TicketAssistant_WelcomeScreen = ({
  navigation,
}: WelcomeScreenProps) => {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const {width: windowWidth} = useWindowDimensions();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.mainView}>
        <ThemeText
          type="body__primary--jumbo--bold"
          style={styles.header}
          color={themeColor}
          accessibilityLabel={t(TicketAssistantTexts.welcome.titleA11yLabel)}
        >
          {t(TicketAssistantTexts.welcome.title)}
        </ThemeText>
        <TicketSplash width={windowWidth} height={windowWidth * (2 / 3)} />
        <View>
          <ThemeText color={themeColor} style={styles.description}>
            {t(TicketAssistantTexts.welcome.description.part1)}
          </ThemeText>
        </View>
      </View>
      <View style={styles.bottomView}>
        <Button
          interactiveColor="interactive_0"
          onPress={() => navigation.navigate('TicketAssistant_FrequencyScreen')}
          text={t(TicketAssistantTexts.welcome.mainButton)}
          testID="nextButton"
          accessibilityHint={t(TicketAssistantTexts.welcome.a11yStartHint)}
        />
      </View>
    </ScrollView>
  );
};
const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: theme.static.background[themeColor].background,
  },
  mainView: {
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
}));
