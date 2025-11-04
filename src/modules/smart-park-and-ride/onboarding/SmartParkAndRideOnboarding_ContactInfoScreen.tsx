import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';
import React from 'react';
import {
  OnboardingScreenComponent,
  useOnboardingCarouselNavigation,
} from '@atb/modules/onboarding';
import {ThemedContact} from '@atb/theme/ThemedAssets';
import {Close} from '@atb/assets/svg/mono-icons/actions';

import {Linking, View} from 'react-native';
import {sparOnboardingId} from './config';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {ThemeText} from '@atb/components/text';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';

export const SmartParkAndRideOnboarding_ContactInfoScreen = () => {
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  const {
    navigateToNextScreen,
    navigateToPreviousScreen,
    closeOnboardingCarousel,
  } = useOnboardingCarouselNavigation(
    sparOnboardingId,
    'SmartParkAndRideOnboarding_ContactInfoScreen',
  );

  return (
    <OnboardingScreenComponent
      illustration={<ThemedContact height={170} />}
      headerProps={{
        leftButton: {
          type: 'back',
          withIcon: true,
          onPress: navigateToPreviousScreen,
        },
        rightButton: {
          type: 'custom',
          text: t(SmartParkAndRideTexts.onboarding.contactInfo.close),
          withIcon: true,
          onPress: () => closeOnboardingCarousel('smartParkAndRide'),
        },
      }}
      title={t(SmartParkAndRideTexts.onboarding.contactInfo.title)}
      contentNode={<ContactInfoContent />}
      footerButton={{
        onPress: () => {
          analytics.logEvent(
            'Smart Park & Ride',
            'Onboarding contact info close clicked',
          );
          navigateToNextScreen();
        },
        text: t(SmartParkAndRideTexts.onboarding.contactInfo.buttonText),
        expanded: true,
        rightIcon: {svg: Close},
      }}
      testID="smartParkAndRideOnboardingContactInfo"
    />
  );
};

const ContactInfoContent = () => {
  const {t} = useTranslation();
  const style = useStyle();
  const {theme} = useThemeContext();

  const telephoneNumbers = {
    parking: '73 10 98 80',
    project: '74 17 40 00',
  };

  return (
    <View style={style.content}>
      <Section>
        <GenericSectionItem>
          <View>
            <View>
              <ThemeText typography="body__m__strong">
                {t(
                  SmartParkAndRideTexts.onboarding.contactInfo.parking.heading,
                )}
              </ThemeText>
              <ThemeText typography="body__s" color="secondary">
                {t(
                  SmartParkAndRideTexts.onboarding.contactInfo.parking
                    .subheading,
                )}
              </ThemeText>
            </View>
          </View>
        </GenericSectionItem>

        <GenericSectionItem>
          <PressableOpacity
            onPress={async () =>
              Linking.openURL(`tel:${telephoneNumbers['parking']}`)
            }
            accessibilityRole="link"
          >
            <ThemeText
              typography="body__m__underline"
              color={theme.color.interactive[0].default.background}
            >
              {t(
                SmartParkAndRideTexts.onboarding.contactInfo.telephone(
                  telephoneNumbers['parking'],
                ),
              )}
            </ThemeText>
          </PressableOpacity>
        </GenericSectionItem>
      </Section>

      <Section>
        <GenericSectionItem>
          <View>
            <View>
              <ThemeText typography="body__m__strong">
                {t(
                  SmartParkAndRideTexts.onboarding.contactInfo.project.heading,
                )}
              </ThemeText>
              <ThemeText typography="body__s" color="secondary">
                {t(
                  SmartParkAndRideTexts.onboarding.contactInfo.project
                    .subheading,
                )}
              </ThemeText>
            </View>
          </View>
        </GenericSectionItem>
        <GenericSectionItem>
          <PressableOpacity
            onPress={async () =>
              Linking.openURL(`tel:${telephoneNumbers['project']}`)
            }
            accessibilityRole="link"
          >
            <ThemeText
              typography="body__m__underline"
              color={theme.color.interactive[0].default.background}
            >
              {t(
                SmartParkAndRideTexts.onboarding.contactInfo.telephone(
                  telephoneNumbers['project'],
                ),
              )}
            </ThemeText>
          </PressableOpacity>
        </GenericSectionItem>
      </Section>

      <Section>
        <GenericSectionItem>
          <View>
            <View>
              <ThemeText typography="body__m__strong">
                {t(SmartParkAndRideTexts.onboarding.contactInfo.about.heading)}
              </ThemeText>
            </View>
          </View>
        </GenericSectionItem>
        <GenericSectionItem>
          <PressableOpacity
            onPress={async () => Linking.openURL('https://atb.no/kontakt')}
            accessibilityRole="link"
            style={style.linkItem}
          >
            <ThemeText
              typography="body__m__underline"
              color={theme.color.interactive[0].default.background}
            >
              {t(SmartParkAndRideTexts.onboarding.contactInfo.about.link)}
            </ThemeText>
            <ThemeIcon
              svg={ExternalLink}
              size="normal"
              color={theme.color.interactive[0].default.background}
            />
          </PressableOpacity>
        </GenericSectionItem>
      </Section>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    rowGap: theme.spacing.medium,
    marginTop: theme.spacing.medium,
  },
  linkItem: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    alignItems: 'center',
  },
}));
