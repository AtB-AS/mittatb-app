import {StyleSheet, Theme} from '@atb/theme';
import React, {useCallback, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator, View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParams} from '..';
import Button from '@atb/components/button';
import * as Sections from '@atb/components/sections';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {TravelToken} from '@atb/mobile-token/types';
import {animateNextChange} from '@atb/utils/animation';
import MessageBox from '@atb/components/message-box';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import RadioBox from '@atb/components/radio-icon/radio-box';
import {
  TravelTokenCard,
  TravelTokenPhone,
} from '@atb/assets/svg/color/illustrations';

type RouteName = 'SelectTravelToken';

type Props = {
  navigation: StackNavigationProp<ProfileStackParams, RouteName>;
};

export default function SelectTravelTokenScreen({navigation}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();

  const {toggleTravelToken, travelTokens} = useMobileTokenContextState();
  const inspectableToken = travelTokens?.find((t) => t.inspectable);

  const [selectedType, setSelectedType] = useState(inspectableToken?.type);

  const [selectedToken, setSelectedToken] = useState<TravelToken | undefined>(
    inspectableToken,
  );

  const [saveState, setSaveState] = useState({
    saving: false,
    error: false,
  });

  const onSave = useCallback(async () => {
    if (selectedToken?.id === inspectableToken?.id) {
      navigation.goBack();
    } else if (selectedToken) {
      setSaveState({saving: true, error: false});
      const success = await toggleTravelToken?.(selectedToken.id);
      if (success) {
        navigation.goBack();
      } else {
        setSaveState({saving: false, error: true});
      }
    }
  }, [toggleTravelToken, selectedToken]);

  const travelCardToken = travelTokens?.find((t) => t.type === 'travelCard');
  const activatedMobileTokens = travelTokens
    ?.filter((t) => t.type === 'mobile')
    ?.filter((t) => t.activated);

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
            icon={<TravelTokenCard />}
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
            icon={<TravelTokenPhone />}
            type="spacious"
            onPress={() => {
              if (selectedToken?.type !== 'mobile') {
                animateNextChange();
                setSelectedType('mobile');
                setSelectedToken(activatedMobileTokens?.[0]);
              }
            }}
            testID="selectMobile"
          />
        </View>

        {selectedType === 'travelCard' && !travelCardToken && (
          <MessageBox
            type={'warning'}
            message={t(TravelTokenTexts.toggleToken.noTravelCard)}
            containerStyle={styles.errorMessageBox}
            isMarkdown={true}
          />
        )}

        {selectedType === 'mobile' && !activatedMobileTokens?.length && (
          <MessageBox
            type={'warning'}
            message={t(TravelTokenTexts.toggleToken.noMobileToken)}
            containerStyle={styles.errorMessageBox}
            isMarkdown={false}
          />
        )}

        {selectedToken?.type === 'mobile' && activatedMobileTokens?.length && (
          <Sections.Section type="spacious" style={styles.selectDeviceSection}>
            <Sections.RadioSection<TravelToken>
              items={activatedMobileTokens}
              keyExtractor={(tt) => tt.id}
              itemToText={(tt) =>
                (tt.name || t(TravelTokenTexts.toggleToken.unnamedDevice)) +
                (tt.isThisDevice
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
            containerStyle={styles.errorMessageBox}
          />
        )}

        {saveState.saving ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button
            onPress={onSave}
            text={t(TravelTokenTexts.toggleToken.saveButton)}
            color="primary_2"
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
    backgroundColor: theme.colors.background_accent.backgroundColor,
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
  activeTicketHeader: {
    marginBottom: theme.spacings.medium,
  },
  selectDeviceSection: {
    marginBottom: theme.spacings.medium,
  },
  errorMessageBox: {
    marginBottom: theme.spacings.medium,
  },
}));
