import {
  LinkSectionItem,
  MessageSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
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
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {useSearchHistoryContext} from '@atb/search-history';
import {
  useBeaconsContext,
  allowedPermissionsForBeacons,
} from '@atb/modules/beacons';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';

export const Profile_PrivacyScreen = () => {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const destructiveColor = theme.color.interactive.destructive;
  const {
    revokeBeacons,
    isConsentGranted,
    onboardForBeacons,
    isBeaconsSupported,
    deleteCollectedData,
    getPrivacyDashboardUrl,
  } = useBeaconsContext();

  const {privacy_policy_url} = useRemoteConfigContext();
  const style = useStyle();
  const {clearHistory} = useSearchHistoryContext();
  const {configurableLinks} = useFirestoreConfigurationContext();

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
              accessibilityRole: 'link',
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
                accessibilityRole: 'link',
              }}
              testID="controlPanelButton"
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
              text={t(
                PrivacySettingsTexts.sections.items.dataSharingButton.title,
              )}
              accessibility={{
                accessibilityHint: t(
                  PrivacySettingsTexts.sections.items.dataSharingButton
                    .a11yHint,
                ),
                accessibilityRole: 'link',
              }}
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
            expanded={true}
            leftIcon={{svg: Delete}}
            interactiveColor={destructiveColor}
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
            testID="deleteLocalSearchDataButton"
          />
          {isBeaconsSupported && (
            <Button
              expanded={true}
              style={style.spacingTop}
              leftIcon={{svg: Delete}}
              interactiveColor={destructiveColor}
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
              testID="deleteCollectedDataButton"
            />
          )}
        </Section>
      </View>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.small,
    rowGap: theme.spacing.small,
  },
  spacingTop: {
    marginTop: theme.spacing.small,
  },
}));
