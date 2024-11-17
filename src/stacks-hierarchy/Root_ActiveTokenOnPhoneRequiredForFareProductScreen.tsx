import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {
  ActiveTokenRequiredTexts, dictionary,
  TravelTokenTexts,
  useTranslation,
} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {Token, useMobileTokenContextState} from '@atb/mobile-token';
import {RadioGroupSection} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import MobileTokenOnboarding from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import {getDeviceNameWithUnitInfo} from '@atb/select-travel-token-screen/utils';
import {useToggleTokenMutation} from '@atb/mobile-token';

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

type Props =
  RootStackScreenProps<'Root_ActiveTokenOnPhoneRequiredForFareProductScreen'>;

export const Root_ActiveTokenOnPhoneRequiredForFareProductScreen = ({
  navigation,
  route,
}: Props) => {
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const focusRef = useFocusOnLoad();
  const {nextScreen} = route.params;

  const {tokens} = useMobileTokenContextState();
  const toggleMutation = useToggleTokenMutation();
  const [selectedToken, setSelectedToken] = useState<Token>();
  const mobileTokens = tokens.filter((t) => t.type === 'mobile');

  const {theme} = useTheme();
  const themeColor = getThemeColor(theme);

  useEffect(() => {
    if (toggleMutation.isSuccess) {
      navigation.navigate(nextScreen.screen, nextScreen.params as any);
    }
  }, [navigation, toggleMutation.isSuccess, nextScreen]);

  const onSave = useCallback(async () => {
    if (selectedToken) {
      if (selectedToken.isInspectable) {
        navigation.navigate(nextScreen.screen, nextScreen.params as any);
        return;
      }
      toggleMutation.mutate({
        tokenId: selectedToken.id,
        bypassRestrictions: true,
      });
    }
  }, [toggleMutation, selectedToken, nextScreen, navigation]);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        leftButton={{type: 'cancel'}}
        setFocusOnLoad={false}
        color={themeColor}
      />
      <ScrollView centerContent={true} contentContainerStyle={styles.mainView}>
        <View
          accessible={true}
          accessibilityRole="header"
          ref={!selectedToken ? focusRef : undefined}
        >
          <View style={styles.textSpacing}>
            <ThemeText
              type="body__primary--big"
              color={themeColor}
              style={styles.text}
            >
              {t(ActiveTokenRequiredTexts.ticketNotAvailable)}
            </ThemeText>
            <ThemeText
              type="body__primary--big--bold"
              color={themeColor}
              style={styles.text}
            >
              {t(ActiveTokenRequiredTexts.travelCard)}
            </ThemeText>
          </View>
        </View>

        <ThemeText
          type="body__primary"
          color={themeColor}
          style={[styles.text, styles.textSpacing]}
        >
          {t(ActiveTokenRequiredTexts.switchToMobile)}
        </ThemeText>

        {mobileTokens?.length ? (
          <RadioGroupSection<Token>
            type="spacious"
            style={styles.selectDeviceSection}
            items={mobileTokens}
            keyExtractor={(token) => token.id}
            itemToText={(token) => getDeviceNameWithUnitInfo(t, token)}
            selected={selectedToken}
            onSelect={setSelectedToken}
            headerText={t(
              TravelTokenTexts.toggleToken.radioBox.phone.selection.heading,
            )}
          />
        ) : (
          <MessageInfoBox
            type="warning"
            message={t(TravelTokenTexts.toggleToken.noMobileToken)}
            style={styles.errorMessageBox}
            isMarkdown={false}
          />
        )}

        {toggleMutation.isError && (
          <MessageInfoBox
            type="error"
            message={t(dictionary.genericErrorMsg)}
            style={styles.errorMessageBox}
          />
        )}

        <ThemeText
          type="body__secondary"
          color={themeColor}
          style={[styles.text, styles.textSpacing]}
        >
          {t(ActiveTokenRequiredTexts.actionMessage)}
        </ThemeText>
        {toggleMutation.isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            onPress={onSave}
            text={t(MobileTokenOnboarding.tCard.button)}
            interactiveColor={theme.color.interactive[0]}
            disabled={!selectedToken}
            testID="confirmSelectionButton"
            style={styles.buttonStyle}
          />
        )}
      </ScrollView>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: getThemeColor(theme).background,
  },
  mainView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.medium,
  },
  text: {
    textAlign: 'center',
  },
  textSpacing: {
    marginVertical: theme.spacing.small,
  },
  selectDeviceSection: {
    marginVertical: theme.spacing.medium,
  },
  errorMessageBox: {
    marginBottom: theme.spacing.medium,
  },
  buttonStyle: {
    paddingVertical: theme.spacing.medium,
  },
}));
