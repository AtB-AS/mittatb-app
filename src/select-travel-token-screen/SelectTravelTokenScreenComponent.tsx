import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RadioBox} from '@atb/components/radio';
import {FullScreenHeader} from '@atb/components/screen-header';
import {
  Token,
  useMobileTokenContext,
  useToggleTokenMutation,
} from '@atb/mobile-token';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {dictionary, TravelTokenTexts, useTranslation} from '@atb/translations';
import {animateNextChange} from '@atb/utils/animation';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioGroupSection} from '@atb/components/sections';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {getDeviceNameWithUnitInfo} from './utils';
import {TokenToggleInfo} from '@atb/token-toggle-info';
import {useTokenToggleDetailsQuery} from '@atb/mobile-token/use-token-toggle-details';
import {useOnboardingContext} from '@atb/onboarding';
import {ContentHeading} from '@atb/components/heading';

type Props = {onAfterSave: () => void};

export const SelectTravelTokenScreenComponent = ({onAfterSave}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  const {disable_travelcard} = useRemoteConfigContext();
  const {completeOnboardingSection} = useOnboardingContext();

  const {tokens} = useMobileTokenContext();
  const toggleMutation = useToggleTokenMutation();
  const {data} = useTokenToggleDetailsQuery();
  const inspectableToken = tokens.find((t) => t.isInspectable);

  const [selectedType, setSelectedType] = useState<Token['type']>(
    inspectableToken?.type || 'mobile',
  );

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    inspectableToken,
  );

  useEffect(() => {
    // Whenever a user enters this screen, the onboarding is done.
    // This useEffect is needed for when onboarding was skipped because of
    // already being on your own device, but then changed to another device
    completeOnboardingSection(
      disable_travelcard ? 'mobileTokenWithoutTravelcard' : 'mobileToken',
    );
  }, [disable_travelcard, completeOnboardingSection]);

  useEffect(() => {
    if (toggleMutation.isSuccess) onAfterSave();
  }, [toggleMutation.isSuccess, onAfterSave]);

  const onSave = useCallback(async () => {
    if (selectedToken) {
      if (selectedToken.isInspectable) {
        onAfterSave();
        return;
      }
      toggleMutation.mutate({
        tokenId: selectedToken.id,
        bypassRestrictions: false,
      });
    }
  }, [selectedToken, toggleMutation, onAfterSave]);

  const travelCardToken = tokens?.find((t) => t.type === 'travel-card');
  const mobileTokens = tokens?.filter((t) => t.type === 'mobile');

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={
          disable_travelcard
            ? t(TravelTokenTexts.toggleToken.titleWithoutTravelcard)
            : t(TravelTokenTexts.toggleToken.title)
        }
        leftButton={{type: 'close'}}
      />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        testID="selectTokenScrollView"
      >
        <View style={styles.radioArea}>
          {!disable_travelcard && (
            <RadioBox
              title={t(TravelTokenTexts.toggleToken.radioBox.tCard.title)}
              description={t(
                TravelTokenTexts.toggleToken.radioBox.tCard.description,
              )}
              a11yLabel={t(
                TravelTokenTexts.toggleToken.radioBox.tCard.a11yLabel,
              )}
              a11yHint={t(TravelTokenTexts.toggleToken.radioBox.tCard.a11yHint)}
              disabled={false}
              selected={selectedType === 'travel-card'}
              icon={<ThemedTokenTravelCard />}
              type="spacious"
              onPress={() => {
                animateNextChange();
                setSelectedType('travel-card');
                setSelectedToken(travelCardToken);
              }}
              testID="selectTravelcard"
              interactiveColor={theme.color.interactive[2]}
            />
          )}
          <RadioBox
            title={t(TravelTokenTexts.toggleToken.radioBox.phone.title)}
            description={t(
              TravelTokenTexts.toggleToken.radioBox.phone.description,
            )}
            a11yLabel={t(TravelTokenTexts.toggleToken.radioBox.phone.a11yLabel)}
            a11yHint={t(TravelTokenTexts.toggleToken.radioBox.phone.a11yHint)}
            disabled={false}
            selected={selectedType === 'mobile'}
            icon={<ThemedTokenPhone />}
            type="spacious"
            onPress={() => {
              if (selectedToken?.type !== 'mobile') {
                animateNextChange();
                setSelectedType('mobile');
                setSelectedToken(mobileTokens?.[0]);
              }
            }}
            testID="selectMobile"
          />
        </View>
        {selectedType === 'travel-card' && !travelCardToken && (
          <MessageInfoBox
            type="warning"
            message={t(TravelTokenTexts.toggleToken.noTravelCard)}
            isMarkdown={true}
          />
        )}
        {selectedType === 'mobile' && !mobileTokens?.length && (
          <MessageInfoBox
            type="warning"
            message={t(TravelTokenTexts.toggleToken.noMobileToken)}
            isMarkdown={false}
          />
        )}
        {selectedType === 'mobile' && mobileTokens?.length ? (
          <>
            <ContentHeading
              text={t(
                TravelTokenTexts.toggleToken.radioBox.phone.selection.heading,
              )}
            />
            <RadioGroupSection<Token>
              items={mobileTokens}
              keyExtractor={(token) => token.id}
              itemToText={(token) => getDeviceNameWithUnitInfo(t, token)}
              selected={selectedToken}
              onSelect={setSelectedToken}
            />
          </>
        ) : null}
        {toggleMutation.isError && (
          <MessageInfoBox
            type="error"
            message={t(dictionary.genericErrorMsg)}
          />
        )}
        {data?.toggleLimit !== undefined && (
          <TokenToggleInfo textColor={theme.color.background.accent[0]} />
        )}
        {toggleMutation.isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            expanded={true}
            onPress={onSave}
            text={t(TravelTokenTexts.toggleToken.saveButton)}
            interactiveColor={theme.color.interactive[0]}
            disabled={!selectedToken || (data?.toggleLimit ?? 0) < 1}
            testID="confirmSelectionButton"
          />
        )}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.color.background.accent[0].background,
    flex: 1,
  },
  scrollView: {
    padding: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
  radioArea: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
}));
