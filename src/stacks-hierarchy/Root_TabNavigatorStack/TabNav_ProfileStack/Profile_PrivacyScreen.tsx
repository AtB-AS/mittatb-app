import {
  HeaderSectionItem,
  LinkSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {StyleSheet, Theme} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {FullScreenHeader} from '@atb/components/screen-header';
import {Linking, View} from 'react-native';
import PrivacySettingsTexts from '@atb/translations/screens/subscreens/PrivacySettingsTexts';
import {Button} from '@atb/components/button';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {destructiveAlert} from './utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useSearchHistory} from '@atb/search-history';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';

export const Profile_PrivacyScreen = () => {
  const {t} = useTranslation();
  const {
    kettleInfo,
    onboardForBeacons,
    revokeBeacons,
    deleteCollectedData,
    isBeaconsSupported,
  } = useBeaconsState();
  const showBeaconsInfo = isBeaconsSupported;
  const {privacy_policy_url} = useRemoteConfig();
  const style = useStyle();
  const {clearHistory} = useSearchHistory();
  const [isCleaningCollectedData, setIsCleaningCollectedData] =
    React.useState<boolean>(false);
  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(ProfileTexts.sections.privacy.heading)}
        leftButton={{type: 'back'}}
      />
      <ScrollView>
        {showBeaconsInfo && (
          <Section withPadding withTopPadding>
            <HeaderSectionItem
              text={t(PrivacySettingsTexts.sections.consents.title)}
            />
            <ToggleSectionItem
              text={t(
                PrivacySettingsTexts.sections.consents.items.CollectTravelHabits
                  .title,
              )}
              subtext={t(
                PrivacySettingsTexts.sections.consents.items.CollectTravelHabits
                  .subText,
              )}
              value={kettleInfo?.isBeaconsOnboarded}
              onValueChange={async (checked) => {
                if (checked) {
                  onboardForBeacons();
                } else {
                  revokeBeacons();
                }
              }}
              testID="toggleCollectData"
            />
          </Section>
        )}
        <Section withPadding withTopPadding>
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.privacy.linkSectionItems.privacy.label,
            )}
            icon="external-link"
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.privacy.linkSectionItems.privacy.a11yHint,
              ),
            }}
            testID="privacyButton"
            onPress={async () => {
              await Linking.openURL(privacy_policy_url);
            }}
          />
        </Section>

        {showBeaconsInfo && kettleInfo?.privacyDashboardUrl && (
          <Section withPadding>
            <LinkSectionItem
              text={t(PrivacySettingsTexts.sections.items.controlPanel.title)}
              subtitle={t(
                PrivacySettingsTexts.sections.items.controlPanel.subTitle,
              )}
              icon="external-link"
              accessibility={{
                accessibilityHint: t(
                  PrivacySettingsTexts.sections.items.controlPanel.a11yHint,
                ),
              }}
              testID="privacyButton"
              onPress={async () => {
                await Linking.openURL(kettleInfo.privacyDashboardUrl!);
              }}
            />
          </Section>
        )}

        <Section withPadding withTopPadding>
          <Button
            leftIcon={{svg: Delete}}
            interactiveColor="interactive_destructive"
            text={t(
              ProfileTexts.sections.privacy.linkSectionItems.clearHistory.label,
            )}
            onPress={() =>
              destructiveAlert({
                alertTitleString: t(
                  ProfileTexts.sections.privacy.linkSectionItems.clearHistory
                    .confirmTitle,
                ),
                cancelAlertString: t(
                  ProfileTexts.sections.privacy.linkSectionItems.clearHistory
                    .alert.cancel,
                ),
                confirmAlertString: t(
                  ProfileTexts.sections.privacy.linkSectionItems.clearHistory
                    .alert.confirm,
                ),
                destructiveArrowFunction: async () => {
                  await clearHistory();
                },
              })
            }
            testID="deleteLocalSearchData"
          />
          {showBeaconsInfo && (
            <Button
              style={style.spacing}
              leftIcon={{svg: Delete}}
              interactiveColor="interactive_destructive"
              text={t(PrivacySettingsTexts.clearCollectedData.label)}
              loading={isCleaningCollectedData}
              disabled={isCleaningCollectedData}
              onPress={async () => {
                destructiveAlert({
                  alertTitleString: t(
                    PrivacySettingsTexts.clearCollectedData.confirmTitle,
                  ),
                  cancelAlertString: t(
                    PrivacySettingsTexts.clearCollectedData.alert.cancel,
                  ),
                  confirmAlertString: t(
                    PrivacySettingsTexts.clearCollectedData.alert.confirm,
                  ),
                  destructiveArrowFunction: async () => {
                    setIsCleaningCollectedData(true);
                    deleteCollectedData();
                    setIsCleaningCollectedData(false);
                  },
                });
              }}
              testID="deleteLocalSearchData"
            />
          )}
        </Section>
      </ScrollView>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  spacing: {
    marginTop: theme.spacings.small,
  },
}));
