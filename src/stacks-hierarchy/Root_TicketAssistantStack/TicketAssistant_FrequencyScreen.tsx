import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {SliderComponent} from '@atb/components/slider';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {Button} from '@atb/components/button';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {StaticColorByType} from '@atb/theme/colors';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useTicketAssistantState} from './TicketAssistantContext';
import {useAccessibilityContext} from '@atb/AccessibilityContext';

export const sliderColorMax: StaticColorByType<'background'> =
  'background_accent_2';

export const sliderColorMin: StaticColorByType<'background'> =
  'background_accent_3';

type FrequencyScreenProps =
  TicketAssistantScreenProps<'TicketAssistant_FrequencyScreen'>;

export const TicketAssistant_FrequencyScreen = ({
  navigation,
}: FrequencyScreenProps) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {data, updateData} = useTicketAssistantState();
  const [sliderValue, setSliderValue] = useState(data.frequency);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      updateData({...data, frequency: sliderValue});
    });
    return () => {
      unsubscribe();
    };
  }, [navigation, data, sliderValue, updateData]);

  // Create an array of every second number from 1 to 14
  const numbers = Array.from({length: 8}, (_, i) => i * 2);
  numbers.shift();
  const numbersAsStrings = numbers.map((number) => number.toString());
  // Add a + on the last number
  numbersAsStrings[numbersAsStrings.length - 1] = '14+';

  const a11yContext = useAccessibilityContext();

  const resultString = t(
    sliderValue === 14
      ? TicketAssistantTexts.frequency.resultMoreThan14
      : TicketAssistantTexts.frequency.result({value: sliderValue}),
  );

  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <DashboardBackground width={'100%'} height={'100%'} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainView}>
          <ThemeText
            type={'body__primary--jumbo--bold'}
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
              <View style={styles.sliderContainer}>
                <SliderComponent
                  style={styles.slider}
                  maximumTrackTintColor={sliderColorMax}
                  minimumTrackTintColor={sliderColorMin}
                  maximumValue={14}
                  minimumValue={2}
                  step={1}
                  value={sliderValue}
                  tapToSeek={true}
                  thumbTintColor={sliderColorMin}
                  onValueChange={(value) => {
                    setSliderValue(value);
                  }}
                />
              </View>
              <ThemeText
                type={'body__secondary'}
                color={themeColor}
                style={styles.number}
              >
                {resultString}
              </ThemeText>
            </View>
          )}
        </View>
        {!a11yContext.isScreenReaderEnabled && (
          <View style={styles.bottomView}>
            <Button
              interactiveColor="interactive_0"
              onPress={() =>
                navigation.navigate('TicketAssistant_DurationScreen')
              }
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
    paddingVertical: theme.spacings.xSmall,
    paddingHorizontal: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    marginVertical: theme.spacings.medium,
  },
  slider: {
    width: '100%',
    alignSelf: 'center',
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
    paddingHorizontal: theme.spacings.medium,
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
  },
}));
