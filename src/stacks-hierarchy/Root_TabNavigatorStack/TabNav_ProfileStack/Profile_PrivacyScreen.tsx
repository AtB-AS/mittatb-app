import {
  LinkSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {StyleSheet, Theme} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Linking} from 'react-native';
import PrivacySettingsTexts from '@atb/translations/screens/subscreens/PrivacySettingsTexts';
import {Button} from '@atb/components/button';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {destructiveAlert} from './utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useSearchHistory} from '@atb/search-history';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading} from '@atb/components/content-heading';

export const Profile_PrivacyScreen = () => {
  const {t} = useTranslation();
  const {
    kettleInfo,
    onboardForBeacons,
    revokeBeacons,
    deleteCollectedData,
    isBeaconsSupported,
    getPrivacyDashboardUrl,
  } = useBeaconsState();
  const {privacy_policy_url} = useRemoteConfig();
  const style = useStyle();
  const {clearHistory} = useSearchHistory();
  const [isCleaningCollectedData, setIsCleaningCollectedData] =
    React.useState<boolean>(false);
  return (
    <FullScreenView
      headerProps={{
        title: t(ProfileTexts.sections.privacy.heading),
        leftButton: {type: 'back'},
      }}
    >
      <ScrollView contentContainerStyle={style.content}>
        {isBeaconsSupported && (
          <>
            <ContentHeading
              text={t(PrivacySettingsTexts.sections.consents.title)}
            />
            <Section>
              <ToggleSectionItem
                text={t(
                  PrivacySettingsTexts.sections.consents.items
                    .CollectTravelHabits.title,
                )}
                subtext={t(
                  PrivacySettingsTexts.sections.consents.items
                    .CollectTravelHabits.subText,
                )}
                value={kettleInfo?.isBeaconsOnboarded}
                onValueChange={async (checked) => {
                  if (checked) {
                    await onboardForBeacons();
                  } else {
                    await revokeBeacons();
                  }
                }}
                testID="toggleCollectData"
              />
            </Section>
          </>
        )}
        <Section style={isBeaconsSupported ? style.spacingTop : undefined}>
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

        {isBeaconsSupported && kettleInfo?.isBeaconsOnboarded && (
          <Section style={style.spacingTop}>
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
                const privacyDashboardUrl = await getPrivacyDashboardUrl();
                privacyDashboardUrl &&
                  (await Linking.openURL(privacyDashboardUrl));
              }}
            />
          </Section>
        )}

        <Section style={style.spacingTop}>
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
          {isBeaconsSupported && kettleInfo?.isBeaconsOnboarded && (
            <Button
              style={style.spacingTop}
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
                    await deleteCollectedData();
                    setIsCleaningCollectedData(false);
                  },
                });
              }}
              testID="deleteLocalSearchData"
            />
          )}
        </Section>
      </ScrollView>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    marginHorizontal: theme.spacings.medium,
    rowGap: theme.spacings.small,
  },
  spacingTop: {
    marginTop: theme.spacings.small,
  },
}));
