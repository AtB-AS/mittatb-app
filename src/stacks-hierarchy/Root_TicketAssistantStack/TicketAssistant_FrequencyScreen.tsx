import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {SliderComponent} from '@atb/components/slider';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import React, {useContext} from 'react';
import {Button} from '@atb/components/button';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {StaticColorByType} from '@atb/theme/colors';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import TicketAssistantContext from './TicketAssistantContext';

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
  // Create an array of every second number from 1 to 14
  const numbers = Array.from({length: 8}, (_, i) => i * 2);
  const contextValue = useContext(TicketAssistantContext);

  if (!contextValue) throw new Error('Context is undefined!');

  const {data, updateData} = contextValue;
  function updateFrequency(value: number) {
    const newData = {...data, frequency: value};
    updateData(newData);
    console.log('Context Data \n' + JSON.stringify(newData, null, 2));
  }

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
            accessibilityLabel={t(TicketAssistantTexts.welcome.titleA11yLabel)}
          >
            {t(TicketAssistantTexts.frequency.title)}
          </ThemeText>
          <ThemeText
            color={themeColor}
            type={'body__secondary'}
            style={styles.description}
          >
            {t(TicketAssistantTexts.frequency.description)}
          </ThemeText>
          <View style={styles.horizontalLine}>
            {numbers.map((number) => {
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
              minimumValue={0}
              step={1}
              tapToSeek={true}
              thumbTintColor={sliderColorMin}
              onValueChange={(value) => {
                updateFrequency(value);
              }}
            />
          </View>
          <ThemeText
            type={'body__secondary'}
            color={themeColor}
            style={styles.number}
          >
            {t(TicketAssistantTexts.frequency.result({value: data.frequency}))}
          </ThemeText>
        </View>

        <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={() =>
              navigation.navigate('TicketAssistant_CategoryPickerScreen')
            }
            text={t(TicketAssistantTexts.frequency.mainButton)}
            testID="nextButton"
          />
        </View>
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
    paddingVertical: theme.spacings.xSmall,
    paddingHorizontal: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.static.background[themeColor].text,
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
  numberContainer: {
    width: 30,
    alignContent: 'center',
  },
  number: {
    width: '100%',
    textAlign: 'center',
  },
}));
