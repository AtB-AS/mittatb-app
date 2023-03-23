import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_OnboardingStack/Onboarding_WelcomeScreen';
import {SliderComponent} from '@atb/components/slider';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Button} from '@atb/components/button';
import {Props} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {DashboardBackground} from '@atb/assets/svg/color/images';

export const TicketAssistant_FrequencyScreen = ({navigation}: Props) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  // Create an array of every second number from 1 to 14
  const numbers = Array.from({length: 8}, (_, i) => i * 2);
  const [value, setValue] = React.useState(0);
  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.mainView}>
          <ThemeText
            type={'body__primary--jumbo--bold'}
            style={styles.header}
            color={themeColor}
            accessibilityLabel={t(TicketAssistantTexts.welcome.titleA11yLabel)}
          >
            {t(TicketAssistantTexts.frequency.title)}
          </ThemeText>
          <ThemeText color={themeColor} style={styles.description}>
            {t(TicketAssistantTexts.frequency.description)}
          </ThemeText>
          <View style={styles.horizontalLine}>
            {numbers.map((number) => (
              <ThemeText
                key={number}
                style={styles.number}
                type={'body__primary'}
                color={themeColor}
              >
                {number}
              </ThemeText>
            ))}
          </View>
          <SliderComponent
            style={styles.slider}
            maximumTrackTintColor={themeColor}
            maximumValue={14}
            minimumValue={0}
            step={1}
            tapToSeek={true}
            thumbTintColor={themeColor}
            onValueChange={(value) => setValue(value)}
          />
          <ThemeText
            type={'body__primary--bold'}
            color={themeColor}
            style={styles.number}
          >
            {value}
          </ThemeText>
        </View>

        <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={() =>
              navigation.navigate('TicketAssistant_FrequencyScreen')
            }
            text={t(TicketAssistantTexts.frequency.mainButton)}
            testID="nextButton"
          />
        </View>
      </ScrollView>
      <View style={styles.backdrop}>
        <DashboardBackground width={'100%'} height={'100%'} />
      </View>
    </>
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
    flex: 1,
    paddingHorizontal: theme.spacings.large,
    paddingBottom: theme.spacings.xLarge,
  },
  slider: {
    width: '100%',
    paddingTop: theme.spacings.xLarge,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
    paddingVertical: theme.spacings.xLarge,
  },
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  backdrop: {
    position: 'absolute',
    height: 250,
    left: 0,
    right: 0,
    bottom: 45,
    padding: 0,
    margin: 0,
  },
  horizontalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  number: {
    marginHorizontal: 8,
    alignSelf: 'center',
  },
}));
