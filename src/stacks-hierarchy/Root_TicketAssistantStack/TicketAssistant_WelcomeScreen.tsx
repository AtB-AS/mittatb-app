import {ScrollView, useWindowDimensions, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {TicketSplash} from '@atb/assets/svg/color/images';
import React from 'react';
import {Button} from '@atb/components/button';
import {StaticColorByType} from '@atb/theme/colors';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {TICKET_ASSISTANT_CATEGORY_PICKER_SCREEN} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/Root_TicketAssistantStack';

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
  const focusRef = useFocusOnLoad(true, 200);

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
          interactiveColor="interactive_0"
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
    backgroundColor: theme.static.background[themeColor].background,
    alignContent: 'center',
  },
  mainView: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
  description: {
    marginTop: theme.spacings.medium,
    marginHorizontal: theme.spacings.xLarge,
    textAlign: 'center',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacings.large,
    marginHorizontal: theme.spacings.xLarge,
  },
  noticeText: {
    textAlign: 'left',
    flexShrink: 1,
  },
  icon: {
    marginRight: theme.spacings.small,
  },
  boatInfo: {
    marginTop: theme.spacings.medium,
    textAlign: 'center',
    marginHorizontal: theme.spacings.xLarge,
  },
  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
}));
