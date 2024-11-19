import {ScrollView, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  getThemeColor,
  getInteractiveColor,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {Slider} from '@atb/components/slider';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {Button} from '@atb/components/button';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useTicketAssistantState} from './TicketAssistantContext';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {SectionSeparator} from '@atb/components/sections';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {TICKET_ASSISTANT_DURATION_SCREEN} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/Root_TicketAssistantStack';

type FrequencyScreenProps =
  TicketAssistantScreenProps<'TicketAssistant_FrequencyScreen'>;

// This would be travelling to and from work 4 days a week
const DEFAULT_SLIDER_VALUE = 8;
export const TicketAssistant_FrequencyScreen = ({
  navigation,
}: FrequencyScreenProps) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const themeColor = getThemeColor(theme);
  const interactiveColor = getInteractiveColor(theme);
  const {inputParams, updateInputParams} = useTicketAssistantState();
  const [sliderValue, setSliderValue] = useState<number>(
    inputParams.frequency ?? DEFAULT_SLIDER_VALUE,
  );
  const focusRef = useFocusOnLoad();

  const a11yContext = useAccessibilityContext();

  const sliderMax = 14;

  //Creating an array of numbers to sliderMax with a step size of 2
  // if it is odd, it starts at 1 and if it is even it starts at 2
  const numbers = [];
  for (let i = sliderMax % 2 ? 1 : 2; i <= sliderMax; i += 2) {
    numbers.push(i);
  }
  //Numbers as strings and adding a '+' to the last element
  const numbersAsStrings = numbers.map((num) => num.toString());
  const endIndex = numbersAsStrings.length - 1;
  numbersAsStrings[endIndex] = numbersAsStrings[endIndex] + '+';

  const resultString = t(
    sliderValue === sliderMax
      ? TicketAssistantTexts.frequency.resultMoreThanMax({value: sliderMax})
      : TicketAssistantTexts.frequency.result({value: sliderValue}),
  );

  const updateFrequency = useCallback(() => {
    updateInputParams({frequency: sliderValue});
  }, [updateInputParams, sliderValue]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      updateFrequency();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, updateFrequency]);

  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <DashboardBackground width="100%" height="100%" />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainView}>
          <View style={styles.textBox} ref={focusRef} accessible={true}>
            <ThemeText
              type="heading--big"
              style={styles.header}
              color={themeColor}
              accessibilityRole="header"
              accessibilityLabel={t(
                TicketAssistantTexts.frequency.titleA11yLabel,
              )}
            >
              {t(TicketAssistantTexts.frequency.title)}
            </ThemeText>
            <ThemeText
              color={themeColor}
              type="body__primary"
              style={styles.description}
              accessibilityLabel={t(TicketAssistantTexts.frequency.description)}
            >
              {t(TicketAssistantTexts.frequency.description)}
            </ThemeText>
          </View>
          {a11yContext.isScreenReaderEnabled ? (
            <View style={styles.screenReaderButtons}>
              {numbers.map((number) => {
                return (
                  <Button
                    key={number}
                    interactiveColor={theme.color.interactive[2]}
                    onPress={() => {
                      setSliderValue(number);
                      navigation.navigate(TICKET_ASSISTANT_DURATION_SCREEN);
                    }}
                    text={number.toString()}
                    accessibilityHint={t(
                      TicketAssistantTexts.frequency.a11yFrequencySelectionHint(
                        {
                          value: number,
                        },
                      ),
                    )}
                  >
                    {number}
                  </Button>
                );
              })}
            </View>
          ) : (
            <View>
              <View style={styles.sliderContainer}>
                <Slider
                  containerStyle={styles.slider}
                  maximumValue={sliderMax}
                  minimumValue={2}
                  step={1}
                  value={sliderValue}
                  trackMarks={numbers}
                  trackMarkComponent={(index) => {
                    return (
                      <ThemeText
                        style={{
                          top: -30,
                          textAlign: 'center',
                          minWidth: 20,
                        }}
                      >
                        {numbersAsStrings[index]}
                      </ThemeText>
                    );
                  }}
                  onValueChange={(value) => {
                    setSliderValue(value);
                  }}
                />
                <SectionSeparator />

                <ThemeText type="body__secondary" style={styles.travelText}>
                  {resultString}
                </ThemeText>
              </View>
            </View>
          )}
        </View>
        {!a11yContext.isScreenReaderEnabled && (
          <View style={styles.bottomView}>
            <Button
              interactiveColor={interactiveColor}
              onPress={() => {
                navigation.navigate('TicketAssistant_DurationScreen');
              }}
              text={t(TicketAssistantTexts.frequency.mainButton)}
              testID="nextButton"
              accessibilityHint={t(
                TicketAssistantTexts.frequency.a11yNextPageHint,
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: getThemeColor(theme).background,
    width: '100%',
  },
  mainView: {
    flex: 1,
    gap: theme.spacing.xLarge,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xLarge,
    width: '100%',
  },
  sliderContainer: {
    width: '100%',
    backgroundColor: theme.color.background.neutral[0].background,
    paddingBottom: theme.spacing.medium,
    paddingTop: theme.spacing.large,
    paddingHorizontal: theme.spacing.large,
    borderRadius: theme.border.radius.regular,
  },
  slider: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: theme.spacing.medium,
  },
  textBox: {
    gap: theme.spacing.medium,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xLarge,
  },
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xLarge,
  },
  bottomView: {
    paddingHorizontal: theme.spacing.xLarge,
    paddingBottom: theme.spacing.xLarge,
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
    alignSelf: 'center',
  },
  screenReaderButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.medium,
  },
  travelText: {
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacing.medium,
  },
}));
