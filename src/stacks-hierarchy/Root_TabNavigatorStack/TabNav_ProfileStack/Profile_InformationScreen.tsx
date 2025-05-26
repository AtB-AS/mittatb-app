import {LinkSectionItem, Section} from '@atb/components/sections';
import {StyleSheet, Theme} from '@atb/theme';
import {
  getTextForLanguage,
  ProfileTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {Linking, View} from 'react-native';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';

export const Profile_InformationScreen = () => {
  const style = useStyle();
  const {t, language} = useTranslation();

  const {configurableLinks} = useFirestoreConfigurationContext();
  const ticketingInfo = configurableLinks?.ticketingInfo;
  const termsInfo = configurableLinks?.termsInfo;
  const inspectionInfo = configurableLinks?.inspectionInfo;
  const refundInfo = configurableLinks?.refundInfo;
  const a11yStatement = configurableLinks?.appA11yStatement;
  const ticketingInfoUrl = getTextForLanguage(ticketingInfo, language);
  const termsInfoUrl = getTextForLanguage(termsInfo, language);
  const inspectionInfoUrl = getTextForLanguage(inspectionInfo, language);
  const refundInfoUrl = getTextForLanguage(refundInfo, language);
  const a11yStatementUrl = getTextForLanguage(a11yStatement, language);

  return (
    <FullScreenView
      headerProps={{
        title: t(ProfileTexts.sections.information.heading),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(ProfileTexts.sections.information.heading)}
        />
      )}
    >
      <View
        testID="profileInformationScrollView"
        importantForAccessibility="no"
        style={style.contentContainer}
      >
        <Section>
          {ticketingInfoUrl && (
            <LinkSectionItem
              icon={<ThemeIcon svg={ExternalLink} />}
              text={t(
                ProfileTexts.sections.information.linkSectionItems.ticketing
                  .label,
              )}
              testID="ticketingInfoButton"
              onPress={() => Linking.openURL(ticketingInfoUrl)}
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.information.linkSectionItems.ticketing
                    .a11yLabel,
                ),
                accessibilityRole: 'link',
              }}
            />
          )}
          {termsInfoUrl && (
            <LinkSectionItem
              icon={<ThemeIcon svg={ExternalLink} />}
              text={t(
                ProfileTexts.sections.information.linkSectionItems.terms.label,
              )}
              testID="termsInfoButton"
              onPress={() => Linking.openURL(termsInfoUrl)}
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.information.linkSectionItems.terms
                    .a11yLabel,
                ),
                accessibilityRole: 'link',
              }}
            />
          )}

          {inspectionInfoUrl && (
            <LinkSectionItem
              icon={<ThemeIcon svg={ExternalLink} />}
              text={t(
                ProfileTexts.sections.information.linkSectionItems.inspection
                  .label,
              )}
              testID="inspectionInfoButton"
              onPress={() => Linking.openURL(inspectionInfoUrl)}
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.information.linkSectionItems.inspection
                    .a11yLabel,
                ),
                accessibilityRole: 'link',
              }}
            />
          )}

          {refundInfoUrl && (
            <LinkSectionItem
              icon={<ThemeIcon svg={ExternalLink} />}
              text={t(
                ProfileTexts.sections.information.linkSectionItems.refund.label,
              )}
              testID="refundInfoButton"
              onPress={() => Linking.openURL(refundInfoUrl)}
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.information.linkSectionItems.refund
                    .a11yLabel,
                ),
                accessibilityRole: 'link',
              }}
            />
          )}
          {a11yStatementUrl && (
            <LinkSectionItem
              icon={<ThemeIcon svg={ExternalLink} />}
              text={t(
                ProfileTexts.sections.information.linkSectionItems
                  .accessibilityStatement.label,
              )}
              testID="a11yStatementButton"
              onPress={() => Linking.openURL(a11yStatementUrl)}
              accessibility={{
                accessibilityHint: t(
                  ProfileTexts.sections.information.linkSectionItems
                    .accessibilityStatement.a11yLabel,
                ),
                accessibilityRole: 'link',
              }}
            />
          )}
        </Section>
      </View>
    </FullScreenView>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  contentContainer: {
    rowGap: theme.spacing.small,
    margin: theme.spacing.medium,
  },
}));
