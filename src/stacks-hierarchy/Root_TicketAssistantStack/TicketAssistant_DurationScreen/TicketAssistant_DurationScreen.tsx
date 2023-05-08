import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import React, {useEffect, useState} from 'react';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {DurationPicker} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_DurationScreen/durationPicker';
import {daysInWeek} from 'date-fns';
type DurationProps =
  TicketAssistantScreenProps<'TicketAssistant_DurationScreen'>;

export const TicketAssistant_DurationScreen = ({navigation}: DurationProps) => {
  const {inputParams, updateInputParams} = useTicketAssistantState();
  const styles = useThemeStyles();
  const {t} = useTranslation();

  const [duration, setDuration] = useState(daysInWeek);

  const updateDuration = () => {
    updateInputParams({duration: duration});
  };

  const unsubscribe = navigation.addListener('blur', () => {
    updateDuration();
  });

  useEffect(() => {
    return unsubscribe;
  }, [navigation]);

  const travelFrequency = inputParams.frequency ?? 0;

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
              TicketAssistantTexts.duration.titleA11yLabel({
                value: travelFrequency,
              }),
            )}
          >
            {t(TicketAssistantTexts.duration.title({value: travelFrequency}))}
          </ThemeText>
          <DurationPicker setDuration={setDuration} duration={duration} />
        </View>

        <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              updateDuration();
              navigation.navigate('TicketAssistant_ZonePickerScreen');
            }}
            text={t(TicketAssistantTexts.frequency.mainButton)}
            testID="nextButton"
            accessibilityHint={t(
              TicketAssistantTexts.duration.a11yNextPageHint,
            )}
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
    backgroundColor: theme.static.background.background_accent_0.background,
    width: '100%',
  },
  mainView: {
    flex: 1,
    paddingHorizontal: theme.spacings.large,
    paddingBottom: theme.spacings.xLarge,
    width: '100%',
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
}));
