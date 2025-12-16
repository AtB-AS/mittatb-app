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
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  useFirestoreConfigurationContext,
  ScooterConsentLineType,
} from '@atb/modules/configuration';
import {OnboardingScreenComponent} from '@atb/modules/onboarding';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {View} from 'react-native';
import {openInAppBrowser} from '@atb/modules/in-app-browser';
import {Ref} from 'react';

export type RulesScreenComponentProps = {
  onGiveConsent: (given: boolean) => void;
  focusRef: Ref<any>;
};

export const RulesScreenComponent = ({
  onGiveConsent,
  focusRef,
}: RulesScreenComponentProps) => {
  const {scooterConsentLines} = useFirestoreConfigurationContext();
  const {theme} = useThemeContext();
  const {t, language} = useTranslation();
  const {configurableLinks} = useFirestoreConfigurationContext();
  const mobilityTerms = configurableLinks?.mobilityTermsUrl;
  const analytics = useAnalyticsContext();

  const mobilityTermsUrl = getTextForLanguage(mobilityTerms, language);

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
        onPress: () => onGiveConsent(true),
        text: t(MobilityTexts.shmoRequirements.terms.buttonOne),
        expanded: true,
      }}
      secondaryFooterButton={{
        text: t(MobilityTexts.shmoRequirements.terms.buttonTwo),
        onPress: onOpenTerms,
        expanded: true,
        mode: 'secondary',
        backgroundColor: theme.color.background.neutral[0],
        rightIcon: {svg: ExternalLink},
      }}
      contentNode={<ListElement scooterConsentLines={scooterConsentLines} />}
      headerProps={{
        rightButton: {type: 'close'},
      }}
      focusRef={focusRef}
    />
  );
};

const ListElement = ({
  scooterConsentLines,
}: {
  scooterConsentLines?: ScooterConsentLineType[];
}) => {
  const {language} = useTranslation();
  const styles = useStyles();
  const getIcon = (iconName?: string) => {
    switch (iconName) {
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
      {scooterConsentLines?.map((line) => (
        <View style={styles.row} key={line.id}>
          <ThemeIcon svg={getIcon(line.illustration)} size="large" />

          <ThemeText style={styles.rowText} typography="body__m">
            {getTextForLanguage(line.description, language)}
          </ThemeText>
        </View>
      ))}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.medium,
    margin: theme.spacing.medium,
    marginBottom: theme.spacing.xLarge,
    paddingTop: theme.spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xLarge,
    backgroundColor: theme.color.background.neutral[0].background,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.xLarge,
    borderRadius: theme.border.radius.regular,
  },
  rowText: {
    flex: 1,
    flexWrap: 'wrap',
  },
}));
