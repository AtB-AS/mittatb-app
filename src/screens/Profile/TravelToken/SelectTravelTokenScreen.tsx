import {Button} from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import {RadioBox} from '@atb/components/radio';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import * as Sections from '@atb/components/sections';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {RemoteToken} from '@atb/mobile-token/types';
import {
  findInspectable,
  getDeviceName,
  isInspectable,
  isMobileToken,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
import {RootStackScreenProps} from '@atb/navigation/types';
import {StyleSheet, Theme} from '@atb/theme';
import {ThemedTokenPhone, ThemedTokenTravelCard} from '@atb/theme/ThemedAssets';
import {
  filterActiveOrCanBeUsedFareContracts,
  isCarnetTravelRight,
  useTicketingState,
} from '@atb/ticketing';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {animateNextChange} from '@atb/utils/animation';
import {flatMap} from '@atb/utils/array';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileScreenProps} from '../types';

type Props =
  | ProfileScreenProps<'SelectTravelToken'>
  | RootStackScreenProps<'SelectTravelTokenRoot'>;

export default function SelectTravelTokenScreen({navigation}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();

  const {fareContracts} = useTicketingState();

  const {token, remoteTokens, toggleToken} = useMobileTokenContextState();
  const inspectableToken = findInspectable(remoteTokens);

  const [selectedType, setSelectedType] = useState<'mobile' | 'travelCard'>(
    isTravelCardToken(inspectableToken) ? 'travelCard' : 'mobile',
  );

  const [selectedToken, setSelectedToken] = useState<RemoteToken | undefined>(
    inspectableToken,
  );

  const hasActiveCarnetFareContract = flatMap(
    filterActiveOrCanBeUsedFareContracts(fareContracts),
    (i) => i.travelRights,
  ).some(isCarnetTravelRight);

  const [saveState, setSaveState] = useState({
    saving: false,
    error: false,
  });

  const onSave = useCallback(async () => {
    if (selectedToken) {
      if (isInspectable(selectedToken)) {
        navigation.goBack();
        return;
      }
      setSaveState({saving: true, error: false});
      const success = await toggleToken(selectedToken.id);
      if (success) {
        navigation.goBack();
      } else {
        setSaveState({saving: false, error: true});
      }
    }
  }, [toggleToken, selectedToken]);

  const travelCardToken = remoteTokens?.find(isTravelCardToken);
  const mobileTokens = remoteTokens?.filter(isMobileToken);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TravelTokenTexts.toggleToken.title)}
        leftButton={{type: 'back'}}
      />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        testID="selectTokenScrollView"
      >
        <View style={styles.radioArea}>
          <RadioBox
            title={t(TravelTokenTexts.toggleToken.radioBox.tCard.title)}
            description={t(
              TravelTokenTexts.toggleToken.radioBox.tCard.description,
            )}
            a11yLabel={t(TravelTokenTexts.toggleToken.radioBox.tCard.a11yLabel)}
            a11yHint={t(TravelTokenTexts.toggleToken.radioBox.tCard.a11yHint)}
            disabled={false}
            selected={selectedType === 'travelCard'}
            icon={<ThemedTokenTravelCard />}
            type="spacious"
            onPress={() => {
              animateNextChange();
              setSelectedType('travelCard');
              setSelectedToken(travelCardToken);
            }}
            style={styles.leftRadioBox}
            testID="selectTravelcard"
          />
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
              if (!isMobileToken(selectedToken)) {
                animateNextChange();
                setSelectedType('mobile');
                setSelectedToken(mobileTokens?.[0]);
              }
            }}
            testID="selectMobile"
          />
        </View>

        {selectedType === 'travelCard' && !travelCardToken && (
          <MessageBox
            type={'warning'}
            message={t(TravelTokenTexts.toggleToken.noTravelCard)}
            style={styles.errorMessageBox}
            isMarkdown={true}
          />
        )}

        {selectedType === 'mobile' && !mobileTokens?.length && (
          <MessageBox
            type={'warning'}
            message={t(TravelTokenTexts.toggleToken.noMobileToken)}
            style={styles.errorMessageBox}
            isMarkdown={false}
          />
        )}

        {/* Show warning if we have selected to switch to mobile, but the
            current inspectable token is travelCard AND we have active carnet
             fare contract */}
        {selectedType === 'mobile' &&
          isTravelCardToken(inspectableToken) &&
          hasActiveCarnetFareContract && (
            <MessageBox
              type={'warning'}
              message={t(TravelTokenTexts.toggleToken.hasCarnet)}
              style={styles.errorMessageBox}
              isMarkdown={false}
            />
          )}

        {selectedType === 'mobile' && mobileTokens?.length && (
          <Sections.Section type="spacious" style={styles.selectDeviceSection}>
            <Sections.RadioSection<RemoteToken>
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
          </Sections.Section>
        )}

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
            text={t(TravelTokenTexts.toggleToken.saveButton)}
            interactiveColor="interactive_0"
            disabled={!selectedToken}
            testID="confirmSelectionButton"
          />
        )}
      </ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_accent_0.background,
    flex: 1,
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
