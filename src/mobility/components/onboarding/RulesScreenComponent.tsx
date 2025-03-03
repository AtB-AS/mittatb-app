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
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {ScooterConsentLineType} from '@atb/configuration/types';
import {OnboardingScreenComponent} from '@atb/onboarding';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {View} from 'react-native';

export type RulesScreenComponentProps = {
  onGiveConsent: (given: boolean) => void;
};

export const RulesScreenComponent = ({
  onGiveConsent,
}: RulesScreenComponentProps) => {
  const {scooterConsentLines} = useFirestoreConfigurationContext();
  const {theme} = useThemeContext();
  const {t} = useTranslation();

  const onOpenTerms = () => {
    // TODO: Implement external page for terms
  };

  return (
    <OnboardingScreenComponent
      title={t(MobilityTexts.shmoRequirements.terms.title)}
      buttonText={t(MobilityTexts.shmoRequirements.terms.buttonOne)}
      buttonOnPress={() => onGiveConsent(true)}
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
        rightButton: {type: 'close', withIcon: true},
      }}
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

          <ThemeText style={styles.rowText} typography="body__primary">
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
