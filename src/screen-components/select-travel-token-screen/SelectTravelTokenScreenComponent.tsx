import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {RadioBox} from '@atb/components/radio';
import {
  Token,
  useMobileTokenContext,
  useToggleTokenMutation,
} from '@atb/modules/mobile-token';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {dictionary, TravelTokenTexts, useTranslation} from '@atb/translations';
import {animateNextChange} from '@atb/utils/animation';
import React, {Ref, useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RadioGroupSection} from '@atb/components/sections';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {getDeviceNameWithUnitInfo} from './utils';
import {TokenToggleInfo} from './TokenToggleInfo';
import {useTokenToggleDetailsQuery} from '@atb/modules/mobile-token';
import {useOnboardingContext} from '@atb/modules/onboarding';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FullScreenView} from '@atb/components/screen-view';
import {Loading} from '@atb/components/loading';

type Props = {onAfterSave: () => void; focusRef: Ref<any>; isFocused: boolean};

export const SelectTravelTokenScreenComponent = ({
  onAfterSave,
  focusRef,
  isFocused,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  const {disable_travelcard} = useRemoteConfigContext();
  const {completeOnboardingSection} = useOnboardingContext();

  const {tokens} = useMobileTokenContext();
  const toggleMutation = useToggleTokenMutation();
  const {data, isLoading} = useTokenToggleDetailsQuery(isFocused);
  const toggleLimit = data?.toggleLimit ?? 0;
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
      });
    }
  }, [selectedToken, toggleMutation, onAfterSave]);

  const travelCardToken = tokens?.find((t) => t.type === 'travel-card');
  const mobileTokens = tokens?.filter((t) => t.type === 'mobile');
  const title = disable_travelcard
    ? t(TravelTokenTexts.toggleToken.titleWithoutTravelcard)
    : t(TravelTokenTexts.toggleToken.title);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title,
        rightButton: {type: 'cancel'},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={title} />
      )}
      testID="selectTravelTokenView"
    >
      <View style={styles.container}>
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
              icon={
                <ThemedTokenTravelCard height={100} style={{maxWidth: 100}} />
              }
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
            icon={<ThemedTokenPhone height={100} style={{maxWidth: 100}} />}
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
            testID="noTravelcardWarning"
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
          <TokenToggleInfo
            textColor={theme.color.background.accent[0]}
            toggleLimit={toggleLimit}
            isLoading={isLoading}
          />
        )}
        {toggleMutation.isPending ? (
          <Loading size="large" />
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
      </View>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => {
  const {bottom: safeAreaBottomInset} = useSafeAreaInsets();
  return {
    container: {
      paddingBottom: safeAreaBottomInset,
      margin: theme.spacing.medium,
      gap: theme.spacing.medium,
    },
    radioArea: {
      flexDirection: 'row',
      gap: theme.spacing.medium,
    },
  };
});
