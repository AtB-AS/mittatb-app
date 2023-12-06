import {Button} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {RadioBox} from '@atb/components/radio';
import {FullScreenHeader} from '@atb/components/screen-header';
import {Token, useMobileTokenContextState} from '@atb/mobile-token';
import {StyleSheet, Theme} from '@atb/theme';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {
  filterActiveOrCanBeUsedFareContracts,
  isCarnetTravelRight,
  useTicketingState,
} from '@atb/ticketing';
import {
  getTextForLanguage,
  TravelTokenTexts,
  useTranslation,
} from '@atb/translations';
import {animateNextChange} from '@atb/utils/animation';
import {flatMap} from '@atb/utils/array';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioGroupSection, Section} from '@atb/components/sections';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {
  findReferenceDataById,
  isOfFareProductRef,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {useTimeContextState} from '@atb/time';
import {getDeviceNameWithUnitInfo} from './utils';
import {TokenToggleInfo} from '@atb/token-toggle-info';
import {useTokenToggleDetails} from '@atb/mobile-token/use-token-toggle-details';

type Props = {onAfterSave: () => void};

export const SelectTravelTokenScreenComponent = ({onAfterSave}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const {fareContracts} = useTicketingState();
  const {disable_travelcard} = useRemoteConfig();
  const {fareProductTypeConfigs, preassignedFareProducts} =
    useFirestoreConfiguration();

  const {tokens, toggleToken} = useMobileTokenContextState();
  const {toggleLimit} = useTokenToggleDetails(true);

  const {serverNow} = useTimeContextState();
  const inspectableToken = tokens.find((t) => t.isInspectable);

  const [selectedType, setSelectedType] = useState<Token['type']>(
    inspectableToken?.type || 'mobile',
  );

  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    inspectableToken,
  );

  const activeFareContracts = flatMap(
    filterActiveOrCanBeUsedFareContracts(fareContracts, serverNow),
    (i) => i.travelRights,
  );

  const hasActiveCarnetFareContract =
    activeFareContracts.some(isCarnetTravelRight);

  // Filter for unique travel rights config types
  const activeFareContractsTypes = activeFareContracts
    .filter(onlyUniquesBasedOnField('type'))
    .map((travelRight) => {
      const preassignedFareProduct = findReferenceDataById(
        preassignedFareProducts,
        isOfFareProductRef(travelRight) ? travelRight.fareProductRef : '',
      );

      return (
        preassignedFareProduct &&
        fareProductTypeConfigs.find(
          (c) => c.type === preassignedFareProduct.type,
        )
      );
    });

  const fareProductConfigWhichRequiresTokenOnMobile =
    activeFareContractsTypes.find(
      (fareProductTypeConfig) =>
        fareProductTypeConfig?.configuration.requiresTokenOnMobile === true,
    );

  const [saveState, setSaveState] = useState({
    saving: false,
    error: false,
  });

  const onSave = useCallback(async () => {
    if (selectedToken) {
      if (selectedToken.isInspectable) {
        onAfterSave();
        return;
      }
      setSaveState({saving: true, error: false});
      const success = await toggleToken(selectedToken.id, false);
      if (success) {
        onAfterSave();
      } else {
        setSaveState({saving: false, error: true});
      }
    }
  }, [selectedToken, toggleToken, onAfterSave]);

  const travelCardToken = tokens?.find((t) => t.type === 'travel-card');
  const mobileTokens = tokens?.filter((t) => t.type === 'mobile');

  // Shows an error message if switching to a t:card,
  // but the current inspectable token is in the mobile AND
  // requires mobile token
  const requiresTokenOnMobile =
    selectedType === 'travel-card' &&
    inspectableToken?.type === 'mobile' &&
    !!fareProductConfigWhichRequiresTokenOnMobile;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={
          disable_travelcard
            ? t(TravelTokenTexts.toggleToken.titleWithoutTravelcard)
            : t(TravelTokenTexts.toggleToken.title)
        }
        leftButton={{type: 'back'}}
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
              style={styles.leftRadioBox}
              testID="selectTravelcard"
              interactiveColor="interactive_2"
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
          <MessageBox
            type="warning"
            message={t(TravelTokenTexts.toggleToken.noTravelCard)}
            style={styles.errorMessageBox}
            isMarkdown={true}
          />
        )}

        {selectedType === 'mobile' && !mobileTokens?.length && (
          <MessageBox
            type="warning"
            message={t(TravelTokenTexts.toggleToken.noMobileToken)}
            style={styles.errorMessageBox}
            isMarkdown={false}
          />
        )}

        {/* Show warning if we have selected to switch to mobile, but the
            current inspectable token is travelCard AND we have active carnet
             fare contract */}
        {selectedType === 'mobile' &&
          inspectableToken?.type === 'travel-card' &&
          hasActiveCarnetFareContract && (
            <MessageBox
              type="warning"
              message={t(TravelTokenTexts.toggleToken.hasCarnet)}
              style={styles.errorMessageBox}
              isMarkdown={false}
            />
          )}

        {requiresTokenOnMobile && (
          <MessageBox
            type="error"
            title={t(
              TravelTokenTexts.toggleToken.notAllowedToUseTravelCardError.title,
            )}
            message={t(
              TravelTokenTexts.toggleToken.notAllowedToUseTravelCardError.message(
                getTextForLanguage(
                  fareProductConfigWhichRequiresTokenOnMobile.name,
                  language,
                ) ?? '',
              ),
            )}
            style={styles.errorMessageBox}
            isMarkdown={false}
          />
        )}
        {selectedType === 'mobile' && mobileTokens?.length ? (
          <Section type="spacious" style={styles.selectDeviceSection}>
            <RadioGroupSection<Token>
              items={mobileTokens}
              keyExtractor={(token) => token.id}
              itemToText={(token) => getDeviceNameWithUnitInfo(t, token)}
              selected={selectedToken}
              onSelect={setSelectedToken}
              headerText={t(
                TravelTokenTexts.toggleToken.radioBox.phone.selection.heading,
              )}
            />
          </Section>
        ) : null}

        {saveState.error && (
          <MessageBox
            type="error"
            message={t(TravelTokenTexts.toggleToken.errorMessage)}
            style={styles.errorMessageBox}
          />
        )}

        {toggleLimit !== undefined && (
          <TokenToggleInfo
            style={styles.tokenInfo}
            textColor="background_accent_0"
          />
        )}

        {saveState.saving ? (
          <ActivityIndicator size="large" />
        ) : (
          !requiresTokenOnMobile && (
            <Button
              onPress={onSave}
              text={t(TravelTokenTexts.toggleToken.saveButton)}
              interactiveColor="interactive_0"
              disabled={!selectedToken}
              testID="confirmSelectionButton"
            />
          )
        )}
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
    flex: 1,
  },
  tokenInfo: {
    flexDirection: 'row',
    marginTop: theme.spacings.small,
    marginBottom: theme.spacings.large,
  },
  scrollView: {
    padding: theme.spacings.medium,
  },
  radioArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacings.medium,
    alignContent: 'center',
  },
  leftRadioBox: {
    marginRight: theme.spacings.medium,
  },
  selectDeviceSection: {
    marginBottom: theme.spacings.medium,
  },
  errorMessageBox: {
    marginBottom: theme.spacings.medium,
  },
}));
