import {LinkSectionItem, Section} from '@atb/components/sections';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {ProfileTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {Button} from '@atb/components/button';
import {Delete} from '@atb/assets/svg/mono-icons/actions';
import {destructiveAlert} from './utils';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useSearchHistoryContext} from '@atb/modules/search-history';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ProfileScreenProps} from './navigation-types';

type Props = ProfileScreenProps<'Profile_PrivacyScreen'>;

export const Profile_PrivacyScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const destructiveColor = theme.color.interactive.destructive;

  const {privacy_policy_url} = useRemoteConfigContext();
  const style = useStyle();
  const {clearHistory} = useSearchHistoryContext();

  const focusRef = useFocusOnLoad(navigation);

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(ProfileTexts.sections.privacy.heading),
        leftButton: {type: 'back'},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(ProfileTexts.sections.privacy.heading)}
        />
      )}
    >
      <View style={style.content}>
        <Section style={style.spacingTop}>
          <LinkSectionItem
            text={t(
              ProfileTexts.sections.privacy.linkSectionItems.privacy.label,
            )}
            rightIcon={{svg: ExternalLink}}
            accessibility={{
              accessibilityHint: t(
                ProfileTexts.sections.privacy.linkSectionItems.privacy.a11yHint,
              ),
              accessibilityRole: 'link',
            }}
            testID="privacyButton"
            onPress={async () => {
              await openInAppBrowser(privacy_policy_url, 'close');
            }}
          />
        </Section>

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
