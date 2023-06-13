import {FullScreenHeader} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {StaticColorByType} from '@atb/theme/colors';
import {RootStackScreenProps} from '@atb/stacks-hierarchy/navigation-types';
import {
  findInspectable,
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
  const {afterEnabled} = route.params;

  const {token, remoteTokens, toggleToken} = useMobileTokenContextState();
  const inspectableToken = findInspectable(remoteTokens);
  const [selectedToken, setSelectedToken] = useState<RemoteToken | undefined>(
    inspectableToken,
  );
  const mobileTokens = remoteTokens?.filter(isMobileToken);

  const [saveState, setSaveState] = useState({
    saving: false,
    error: false,
  });

  const onSave = useCallback(async () => {
    if (selectedToken) {
      if (isInspectable(selectedToken) && afterEnabled) {
        navigation.navigate(afterEnabled.screen, afterEnabled.params as any);
        return;
      }
      setSaveState({saving: true, error: false});
      const success = await toggleToken(selectedToken.id);
      if (success && afterEnabled) {
        navigation.navigate(afterEnabled.screen, afterEnabled.params as any);
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
        <View accessible={true} accessibilityRole="header" ref={focusRef}>
          <ThemeText
            type={'body__primary--big'}
            style={styles.title}
            color={themeColor}
          >
            {'Billeten er ikke tilgjengelig på t:kort'}
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
        </View>

        {saveState.error && (
          <MessageBox
            type="error"
            message={t(TravelTokenTexts.toggleToken.errorMessage)}
            style={styles.errorMessageBox}
          />
        )}

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
    backgroundColor: theme.static.background[themeColor].background,
    flex: 1,
  },
  mainView: {
    padding: theme.spacings.large,
  },
  title: {
    textAlign: 'center',
    marginVertical: theme.spacings.medium,
  },
  selectDeviceSection: {
    marginBottom: theme.spacings.medium,
  },
  errorMessageBox: {
    marginBottom: theme.spacings.medium,
  },
}));
function toggleToken(id: string) {
  throw new Error('Function not implemented.');
}
