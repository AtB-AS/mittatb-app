import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {
  ActiveTokenRequiredTexts,
  TravelTokenTexts,
  useTranslation,
} from '@atb/translations';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {StaticColorByType} from '@atb/theme/colors';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {
  getDeviceName,
  isInspectable,
  isMobileToken,
} from '@atb/mobile-token/utils';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {RemoteToken} from '@atb/mobile-token/types';
import {RadioGroupSection, Section} from '@atb/components/sections';
import {MessageBox} from '@atb/components/message-box';
import {Button} from '@atb/components/button';
import MobileTokenOnboarding from '@atb/translations/screens/subscreens/MobileTokenOnboarding';
import Ticketing from '@atb/translations/screens/Ticketing';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

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

  const {token, remoteTokens, toggleToken} = useMobileTokenContextState();
  const [selectedToken, setSelectedToken] = useState<RemoteToken | undefined>();
  const mobileTokens = remoteTokens?.filter(isMobileToken);

  const [saveState, setSaveState] = useState({
    saving: false,
    error: false,
  });

  const onSave = useCallback(async () => {
    if (selectedToken) {
      if (isInspectable(selectedToken) && nextScreen) {
        navigation.navigate(nextScreen.screen, nextScreen.params as any);
        return;
      }
      setSaveState({saving: true, error: false});
      const success = await toggleToken(selectedToken.id, true);
      if (success && nextScreen) {
        navigation.navigate(nextScreen.screen, nextScreen.params as any);
      } else {
        setSaveState({saving: false, error: true});
      }
    }
  }, [toggleToken, selectedToken]);

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
              type={'body__primary--big'}
              color={themeColor}
              style={styles.text}
            >
              {t(ActiveTokenRequiredTexts.ticketNotAvailable)}
            </ThemeText>
            <ThemeText
              type={'body__primary--big--bold'}
              color={themeColor}
              style={styles.text}
            >
              {t(Ticketing.travelCardInformation.cardType)}
            </ThemeText>
          </View>
        </View>

        <ThemeText
          type={'body__primary'}
          color={themeColor}
          style={[styles.text, styles.textSpacing]}
        >
          {t(ActiveTokenRequiredTexts.switchToMobile)}
        </ThemeText>

        {mobileTokens?.length ? (
          <Section type="spacious" style={styles.selectDeviceSection}>
            <RadioGroupSection<RemoteToken>
              items={mobileTokens}
              keyExtractor={(rt) => rt.id}
              itemToText={(rt) =>
                (getDeviceName(rt) ||
                  t(TravelTokenTexts.toggleToken.unnamedDevice)) +
                (token?.tokenId === rt.id
                  ? t(
                      TravelTokenTexts.toggleToken.radioBox.phone.selection
                        .thisDeviceSuffix,
                    )
                  : '')
              }
              selected={selectedToken}
              onSelect={setSelectedToken}
              headerText={t(
                TravelTokenTexts.toggleToken.radioBox.phone.selection.heading,
              )}
            />
          </Section>
        ) : (
          <MessageBox
            type={'warning'}
            message={t(TravelTokenTexts.toggleToken.noMobileToken)}
            style={styles.errorMessageBox}
            isMarkdown={false}
          />
        )}

        {saveState.error && (
          <MessageBox
            type="error"
            message={t(TravelTokenTexts.toggleToken.errorMessage)}
            style={styles.errorMessageBox}
          />
        )}

        <ThemeText
          type={'body__secondary'}
          color={themeColor}
          style={[styles.text, styles.textSpacing]}
        >
          {t(ActiveTokenRequiredTexts.actionMessage)}
        </ThemeText>

        {saveState.saving ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            onPress={onSave}
            text={t(MobileTokenOnboarding.tCard.button)}
            interactiveColor="interactive_0"
            disabled={!selectedToken}
            testID="confirmSelectionButton"
          />
        )}
      </ScrollView>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
  mainView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacings.medium,
  },
  text: {
    textAlign: 'center',
  },
  textSpacing: {
    marginVertical: theme.spacings.small,
  },
  selectDeviceSection: {
    marginVertical: theme.spacings.medium,
  },
  errorMessageBox: {
    marginBottom: theme.spacings.medium,
  },
}));
