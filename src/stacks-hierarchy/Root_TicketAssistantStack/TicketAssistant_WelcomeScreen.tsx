import {ScrollView, useWindowDimensions, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {TicketSplash} from '@atb/assets/svg/color/images';
import React from 'react';
import {Button} from '@atb/components/button';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {TICKET_ASSISTANT_CATEGORY_PICKER_SCREEN} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/Root_TicketAssistantStack';
import {Theme} from '@atb/theme/colors';

export const getThemeColor = (theme: Theme) => theme.color.background.accent[0];
export const getInteractiveColor = (theme: Theme) => theme.color.interactive[0];

export type WelcomeScreenProps =
  TicketAssistantScreenProps<'TicketAssistant_WelcomeScreen'>;
export const TicketAssistant_WelcomeScreen = ({
  navigation,
}: WelcomeScreenProps) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const themeColor = getThemeColor(theme);
  const interactiveColor = getInteractiveColor(theme);
  const styles = useThemeStyles();
  const {width: windowWidth} = useWindowDimensions();
  const focusRef = useFocusOnLoad();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View ref={focusRef} accessible={true}>
        <ThemeText
          type="heading--big"
          style={styles.header}
          color={themeColor}
          accessibilityRole="header"
          accessibilityLabel={t(TicketAssistantTexts.welcome.titleA11yLabel)}
        >
          {t(TicketAssistantTexts.welcome.title)}
        </ThemeText>

        <ThemeText
          style={styles.description}
          type="body__primary"
          color={themeColor}
        >
          {t(TicketAssistantTexts.welcome.description)}
        </ThemeText>
      </View>

      <View style={styles.mainView}>
        <TicketSplash width={windowWidth} height={windowWidth / 2} />
      </View>
      <View style={styles.bottomView}>
        <Button
          interactiveColor={interactiveColor}
          onPress={() =>
            navigation.navigate(TICKET_ASSISTANT_CATEGORY_PICKER_SCREEN)
          }
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
    backgroundColor: getThemeColor(theme).background,
    alignContent: 'center',
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xLarge,
  },
  description: {
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.xLarge,
    textAlign: 'center',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.large,
    marginHorizontal: theme.spacing.xLarge,
  },
  noticeText: {
    textAlign: 'left',
    flexShrink: 1,
  },
  icon: {
    marginRight: theme.spacing.small,
  },
  boatInfo: {
    marginTop: theme.spacing.medium,
    textAlign: 'center',
    marginHorizontal: theme.spacing.xLarge,
  },
  bottomView: {
    paddingHorizontal: theme.spacing.xLarge,
    paddingBottom: theme.spacing.xLarge,
  },
}));
