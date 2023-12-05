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
import {useBeacons} from '@atb/beacons/use-beacons';
import {Button} from '@atb/components/button';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {destructiveAlert} from './utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useSearchHistory} from '@atb/search-history';

export const Profile_PrivacyScreen = () => {
  const {t} = useTranslation();
  const {
    kettleInfo,
    onboardForBeacons,
    revokeBeacons,
    deleteCollectedData,
    isBeaconsSupported,
  } = useBeacons();
  const {privacy_policy_url} = useRemoteConfig();
  const style = useStyle();
  const {clearHistory} = useSearchHistory();
  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(ProfileTexts.sections.privacy.heading)}
        leftButton={{type: 'back'}}
      />
      <ScrollView>
        {isBeaconsSupported && (
          <Section withPadding withTopPadding>
            <HeaderSectionItem
              text={t(PrivacySettingsTexts.sections.consents.title)}
            />
            <ToggleSectionItem
              text={t(
                PrivacySettingsTexts.sections.consents.items
                  .collectBusAndStopData.title,
              )}
              subtext={t(
                PrivacySettingsTexts.sections.consents.items
                  .collectBusAndStopData.subText,
              )}
              value={kettleInfo?.isBeaconsOnboarded}
              onValueChange={(checked) => {
                if (checked) {
                  onboardForBeacons();
                } else {
                  revokeBeacons();
                }
              }}
              testID="toggleCollectBusAndStopData"
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
        <Section withPadding>
          {isBeaconsSupported && (
            <LinkSectionItem
              text={t(
                PrivacySettingsTexts.sections.other.items.controlPanel.title,
              )}
              subtitle={t(
                PrivacySettingsTexts.sections.other.items.controlPanel.subTitle,
              )}
              icon="external-link"
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.privacy.linkSectionItems.privacy
                    .a11yHint,
                ),
              }}
              testID="privacyButton"
              onPress={async () => {
                kettleInfo?.privacyDashboardUrl &&
                  (await Linking.openURL(kettleInfo.privacyDashboardUrl));
              }}
            />
          )}
        </Section>

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
          {isBeaconsSupported && (
            <Button
              style={style.spacing}
              leftIcon={{svg: Delete}}
              interactiveColor="interactive_destructive"
              text={t(
                PrivacySettingsTexts.sections.other.items.deleteData.title,
              )}
              onPress={() => {
                deleteCollectedData();
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
