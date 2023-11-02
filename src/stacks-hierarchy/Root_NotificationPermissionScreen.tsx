import {ScrollView, useWindowDimensions, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import React from 'react';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {StyleSheet} from '@atb/theme';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {SafeAreaView} from 'react-native-safe-area-context';
import NotificationPermissionTexts from '@atb/translations/screens/NotificationPermission';
import {PushNotification} from '@atb/assets/svg/color/images';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {useAppState} from '@atb/AppContext';

type Props = RootStackScreenProps<'Root_NotificationPermissionScreen'>;

export const Root_NotificationPermissionScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad(true, 200);

  const {completeNotificationPermissionOnboarding} = useAppState();

  const {width: windowWidth} = useWindowDimensions();

  const handleButtonPress = () => {
    // TODO: add permission logic
    completeNotificationPermissionOnboarding();
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainView} ref={focusRef} accessible={true}>
          <PushNotification width={windowWidth} />

          <View style={styles.textView}>
            <ThemeText
              type="heading--big"
              style={styles.header}
              color={themeColor}
              accessibilityRole="header"
              accessibilityLabel={t(NotificationPermissionTexts.title)}
            >
              {t(NotificationPermissionTexts.title)}
            </ThemeText>

            <ThemeText
              style={styles.description}
              type="body__primary"
              color={themeColor}
            >
              {t(NotificationPermissionTexts.description)}
            </ThemeText>
          </View>
        </View>

        <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={handleButtonPress}
            text={t(NotificationPermissionTexts.button)}
            testID="nextButton"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
    alignContent: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    alignContent: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacings.large,
  },
  mainView: {
    justifyContent: 'center',
    gap: theme.spacings.large,
  },
  textView: {
    gap: theme.spacings.medium,
    marginHorizontal: theme.spacings.xLarge,
  },
  header: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },

  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
}));
