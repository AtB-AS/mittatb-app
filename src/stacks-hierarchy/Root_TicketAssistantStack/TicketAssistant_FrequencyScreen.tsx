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
  const {inputParams, updateInputParams} = useTicketAssistantState();
  const [sliderValue, setSliderValue] = useState<number>(
    inputParams.frequency ?? DEFAULT_SLIDER_VALUE,
  );
  const focusRef = useFocusOnLoad(true, 200);

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
          <View style={styles.textBox} ref={focusRef} accessible={true}>
            <ThemeText
              type={'heading--big'}
              style={styles.header}
              color={themeColor}
              accessibilityRole={'header'}
              accessibilityLabel={t(
                TicketAssistantTexts.frequency.titleA11yLabel,
              )}
            >
              {t(TicketAssistantTexts.frequency.title)}
            </ThemeText>
            <ThemeText
              color={themeColor}
              type={'body__primary'}
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
                    interactiveColor="interactive_2"
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
    gap: theme.spacings.xLarge,
    paddingHorizontal: theme.spacings.large,
    paddingBottom: theme.spacings.xLarge,
    width: '100%',
  },
  sliderContainer: {
    width: '100%',
    backgroundColor: theme.static.background.background_0.background,
    paddingBottom: theme.spacings.medium,
    paddingTop: theme.spacings.large,
    paddingHorizontal: theme.spacings.large,
    borderRadius: theme.border.radius.regular,
  },
  slider: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: theme.spacings.medium,
  },
  textBox: {
    gap: theme.spacings.medium,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
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
  travelText: {
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacings.medium,
  },
}));
