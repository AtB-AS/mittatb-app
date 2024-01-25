import {
  LinkSectionItem,
  MessageSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {StyleSheet, Theme} from '@atb/theme';
import {
  ProfileTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import PrivacySettingsTexts from '@atb/translations/screens/subscreens/PrivacySettingsTexts';
import {Button} from '@atb/components/button';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {destructiveAlert} from './utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useSearchHistory} from '@atb/search-history';
import {useBeaconsState} from '@atb/beacons/BeaconsContext';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {allowedPermissionsForBeacons} from '@atb/beacons/permissions';
import {useFirestoreConfiguration} from '@atb/configuration';

export const Profile_PrivacyScreen = () => {
  const {t, language} = useTranslation();
  const {
    revokeBeacons,
    isConsentGranted,
    onboardForBeacons,
    isBeaconsSupported,
    deleteCollectedData,
    getPrivacyDashboardUrl,
  } = useBeaconsState();

  const {privacy_policy_url} = useRemoteConfig();
  const style = useStyle();
  const {clearHistory} = useSearchHistory();
  const {configurableLinks} = useFirestoreConfiguration();

  const [isCleaningCollectedData, setIsCleaningCollectedData] =
    React.useState<boolean>(false);

  const [hasPermissionsForBeacons, setHasPermissionsForBeacons] =
    useState(false);

  const dataSharingInfoUrl = getTextForLanguage(
    configurableLinks?.dataSharingInfo,
    language,
  );

  const updatePermissions = useCallback(() => {
    allowedPermissionsForBeacons().then((permissions) => {
      const hasSomePermissions = permissions.length > 0;
      setHasPermissionsForBeacons(hasSomePermissions);
    });
  }, []);
  useEffect(() => updatePermissions(), [updatePermissions]);

  return (
    <FullScreenView
      headerProps={{
        title: t(ProfileTexts.sections.privacy.heading),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(ProfileTexts.sections.privacy.heading)}
        />
      )}
    >
      <View style={style.content}>
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
                value={isConsentGranted}
                onValueChange={async (checked) => {
                  checked
                    ? await onboardForBeacons(true)
                    : await revokeBeacons();
                  updatePermissions();
                }}
                testID="toggleCollectData"
              />
              {isConsentGranted && !hasPermissionsForBeacons && (
                <MessageSectionItem
                  messageType="info"
                  title={t(
                    ProfileTexts.sections.privacy.linkSectionItems
                      .permissionRequired.title,
                  )}
                  message={t(
                    ProfileTexts.sections.privacy.linkSectionItems
                      .permissionRequired.message,
                  )}
                  onPressConfig={{
                    text: t(
                      ProfileTexts.sections.privacy.linkSectionItems
                        .permissionRequired.action,
                    ),
                    action: () => Linking.openSettings(),
                  }}
                />
              )}
            </Section>
          </>
        )}
        <Section style={style.spacingTop}>
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

        {isBeaconsSupported && (
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

        {isBeaconsSupported && isConsentGranted && dataSharingInfoUrl && (
          <Section style={style.spacingTop}>
            <LinkSectionItem
              text={t(PrivacySettingsTexts.sections.items.dataSharingButton)}
              icon="external-link"
              testID="dataSharingInfoButton"
              onPress={async () => {
                Linking.openURL(dataSharingInfoUrl);
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
          {isBeaconsSupported && (
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
      </View>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    marginHorizontal: theme.spacings.medium,
    marginTop: theme.spacings.small,
    rowGap: theme.spacings.small,
  },
  spacingTop: {
    marginTop: theme.spacings.small,
  },
}));
