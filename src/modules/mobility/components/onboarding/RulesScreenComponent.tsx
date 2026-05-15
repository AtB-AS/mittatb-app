import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  RuleAlcohol,
  RuleHelmet,
  RuleTwoPeople,
} from '@atb/assets/svg/mono-icons/mobility';
import {
  ChevronRight,
  ExternalLink,
} from '@atb/assets/svg/mono-icons/navigation';
import {Youth} from '@atb/assets/svg/mono-icons/ticketing';
import {Bicycle} from '@atb/assets/svg/mono-icons/transportation';
import {Error} from '@atb/assets/svg/mono-icons/status';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  Section,
  GenericSectionItem,
  LinkSectionItem,
} from '@atb/components/sections';
import {
  useFirestoreConfigurationContext,
  ConsentLineType,
} from '@atb/modules/configuration';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {StyleSheet} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {View} from 'react-native';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {Ref} from 'react';
import {useMapContext} from '@atb/modules/map';

export type RulesScreenComponentProps = {
  focusRef: Ref<any>;
  formFactor?: FormFactor;
};

export const RulesScreenComponent = ({
  focusRef,
  formFactor,
}: RulesScreenComponentProps) => {
  const {scooterConsentLines, bicycleConsentLines, configurableLinks} =
    useFirestoreConfigurationContext();
  const {t, language} = useTranslation();
  const analytics = useAnalyticsContext();
  const {setGivenScooterConsent, setGivenBicycleConsent} = useMapContext();

  const {setGivenConsent, consentLines} = (() => {
    switch (formFactor) {
      case FormFactor.Bicycle:
        return {
          setGivenConsent: setGivenBicycleConsent,
          consentLines: bicycleConsentLines,
        };
      case FormFactor.Scooter:
      case FormFactor.ScooterStanding:
        return {
          setGivenConsent: setGivenScooterConsent,
          consentLines: scooterConsentLines,
        };
      default:
        return {
          setGivenConsent: setGivenScooterConsent,
          consentLines: scooterConsentLines,
        };
    }
  })();

  const mobilityTermsUrl = getTextForLanguage(
    configurableLinks?.mobilityTermsUrl,
    language,
  );

  const onOpenTerms = () => {
    if (mobilityTermsUrl) {
      openInAppBrowser(mobilityTermsUrl, 'close');
      analytics.logEvent('Mobility', 'Open terms');
    }
  };

  return (
    <OnboardingScreenComponent
      title={t(MobilityTexts.shmoRequirements.terms.title)}
      footerButton={{
        onPress: () => setGivenConsent(true),
        text: t(MobilityTexts.shmoRequirements.terms.buttonOne),
        expanded: true,
      }}
      contentNode={
        <ListElement
          consentLines={consentLines}
          privacyLinkText={t(MobilityTexts.shmoRequirements.terms.privacyLink)}
          onPrivacyLinkPress={onOpenTerms}
          showPrivacyLink={!!mobilityTermsUrl}
        />
      }
      headerProps={{
        rightButton: {type: 'cancel'},
      }}
      focusRef={focusRef}
    />
  );
};

const ListElement = ({
  consentLines,
  privacyLinkText,
  onPrivacyLinkPress,
  showPrivacyLink,
}: {
  consentLines?: ConsentLineType[];
  privacyLinkText: string;
  onPrivacyLinkPress: () => void;
  showPrivacyLink: boolean;
}) => {
  const {language} = useTranslation();
  const styles = useStyles();

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'bicycle':
        return Bicycle;
      case 'error':
        return Error;
      case 'rule-two-people':
        return RuleTwoPeople;
      case 'rule-alcohol':
        return RuleAlcohol;
      case 'rule-helmet':
        return RuleHelmet;
      case 'youth':
        return Youth;
      default:
        return ChevronRight;
    }
  };

  return (
    <View style={styles.container}>
      {consentLines && consentLines.length > 0 && (
        <Section>
          {consentLines.map((line) => (
            <GenericSectionItem key={line.id}>
              <View style={styles.ruleRow}>
                <ThemeIcon svg={getIcon(line.illustration)} size="large" />
                <ThemeText style={styles.ruleText} typography="body__m">
                  {getTextForLanguage(line.description, language)}
                </ThemeText>
              </View>
            </GenericSectionItem>
          ))}
        </Section>
      )}
      {showPrivacyLink && (
        <Section>
          <LinkSectionItem
            text={privacyLinkText}
            onPress={onPrivacyLinkPress}
            rightIcon={{svg: ExternalLink}}
          />
        </Section>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.medium,
    margin: theme.spacing.medium,
    marginBottom: theme.spacing.xLarge,
    paddingTop: theme.spacing.medium,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xLarge,
  },
  ruleText: {
    flex: 1,
    flexWrap: 'wrap',
  },
}));
