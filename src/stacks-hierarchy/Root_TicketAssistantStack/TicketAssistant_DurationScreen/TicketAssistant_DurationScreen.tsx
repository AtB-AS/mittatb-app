import {ScrollView, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  getThemeColor,
  getInteractiveColor,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import React, {useCallback, useEffect, useState} from 'react';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {DurationPicker} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_DurationScreen/durationPicker';
import {daysInWeek} from '@atb/utils/date';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {TICKET_ASSISTANT_ZONE_PICKER_SCREEN} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/Root_TicketAssistantStack';
type DurationProps =
  TicketAssistantScreenProps<'TicketAssistant_DurationScreen'>;

export const TicketAssistant_DurationScreen = ({navigation}: DurationProps) => {
  const {inputParams, updateInputParams} = useTicketAssistantState();
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const themeColor = getThemeColor(theme);
  const interactiveColor = getInteractiveColor(theme);
  const focusRef = useFocusOnLoad();
  const [duration, setDuration] = useState(daysInWeek);

  const updateDuration = useCallback(() => {
    updateInputParams({duration: duration});
  }, [updateInputParams, duration]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      updateDuration();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, updateDuration]);

  const travelFrequency = inputParams.frequency ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <DashboardBackground width="100%" height="100%" />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainView}>
          <View ref={focusRef} accessible={true}>
            <ThemeText
              type="heading--big"
              style={styles.header}
              color={themeColor}
              accessibilityRole="header"
              accessibilityLabel={t(
                TicketAssistantTexts.duration.titleA11yLabel({
                  value: travelFrequency,
                }),
              )}
            >
              {t(TicketAssistantTexts.duration.title({value: travelFrequency}))}
            </ThemeText>
          </View>
          <DurationPicker setDuration={setDuration} duration={duration} />
        </View>

        <View style={styles.bottomView}>
          <Button
            interactiveColor={interactiveColor}
            onPress={() => {
              updateDuration();
              navigation.navigate(TICKET_ASSISTANT_ZONE_PICKER_SCREEN);
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
    backgroundColor: theme.color.background.accent[0].background,
    width: '100%',
  },
  mainView: {
    flex: 1,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xLarge,
    width: '100%',
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
}));
