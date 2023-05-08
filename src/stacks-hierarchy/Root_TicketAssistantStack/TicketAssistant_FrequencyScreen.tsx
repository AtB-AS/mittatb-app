import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {Slider} from '@atb/components/slider';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {Button} from '@atb/components/button';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useTicketAssistantState} from './TicketAssistantContext';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {SectionSeparator} from '@atb/components/sections';

type FrequencyScreenProps =
  TicketAssistantScreenProps<'TicketAssistant_FrequencyScreen'>;

// This would be travelling to and from work 4 days a week
const DEFAULT_SLIDER_VALUE = 8;
export const TicketAssistant_FrequencyScreen = ({
  navigation,
}: FrequencyScreenProps) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {inputParams, updateInputParams} = useTicketAssistantState();
  const [sliderValue, setSliderValue] = useState<number>(
    inputParams.frequency ?? DEFAULT_SLIDER_VALUE,
  );
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

  const updateFrequency = () => {
    updateInputParams({frequency: sliderValue});
  };

  const unsubscribe = navigation.addListener('blur', () => {
    updateFrequency();
  });

  useEffect(() => {
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <DashboardBackground width={'100%'} height={'100%'} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainView}>
          <ThemeText
            type={'heading--big'}
            style={styles.header}
            color={themeColor}
            accessibilityLabel={t(
              TicketAssistantTexts.frequency.titleA11yLabel,
            )}
          >
            {t(TicketAssistantTexts.frequency.title)}
          </ThemeText>
          <ThemeText
            color={themeColor}
            type={'body__secondary'}
            style={styles.description}
            accessibilityLabel={t(TicketAssistantTexts.frequency.description)}
          >
            {t(TicketAssistantTexts.frequency.description)}
          </ThemeText>
          {a11yContext.isScreenReaderEnabled ? (
            <View style={styles.screenReaderButtons}>
              {numbers.map((number) => {
                return (
                  <Button
                    key={number}
                    interactiveColor="interactive_2"
                    onPress={() => {
                      navigation.navigate('TicketAssistant_DurationScreen');
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
                <View style={styles.horizontalLine}>
                  {numbersAsStrings.map((number) => {
                    return (
                      <View key={number} style={styles.numberContainer}>
                        <ThemeText
                          key={number}
                          style={styles.number}
                          type={'body__primary'}
                          color={themeColor}
                        >
                          {number}
                        </ThemeText>
                      </View>
                    );
                  })}
                </View>
                <Slider
                  style={styles.slider}
                  interactiveColor={'interactive_0'}
                  maximumValue={sliderMax}
                  minimumValue={2}
                  step={1}
                  value={sliderValue}
                  tapToSeek={true}
                  onValueChange={(value) => {
                    setSliderValue(value);
                  }}
                />
                <SectionSeparator />

                <ThemeText type={'body__secondary'} style={styles.travelText}>
                  {resultString}
                </ThemeText>
              </View>
            </View>
          )}
        </View>
        {!a11yContext.isScreenReaderEnabled && (
          <View style={styles.bottomView}>
            <Button
              interactiveColor="interactive_0"
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
    backgroundColor: theme.static.background[themeColor].background,
    width: '100%',
  },
  mainView: {
    flex: 1,
    paddingHorizontal: theme.spacings.large,
    paddingBottom: theme.spacings.xLarge,
    width: '100%',
  },
  sliderContainer: {
    width: '100%',
    backgroundColor: theme.static.background.background_0.background,
    paddingVertical: theme.spacings.medium,
    paddingHorizontal: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    marginVertical: theme.spacings.medium,
  },
  slider: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: theme.spacings.medium,
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
    alignSelf: 'center',
  },
  screenReaderButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: theme.spacings.medium,
  },
  numberContainer: {
    width: 30,
    alignContent: 'center',
  },
  number: {
    width: '100%',
    textAlign: 'center',
    color: theme.text.colors.primary,
  },

  travelText: {
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacings.medium,
  },
}));
