import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText, screenReaderPause} from '@atb/components/text';
import {TileWithButton} from '@atb/components/tile';
import {StyleSheet} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
import {View, ViewStyle} from 'react-native';
import {BenefitImageAsset} from './BenefitImage';
import {FormFactorTicketDescriptionPair} from '../use-operator-benefits-for-fare-product';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';

type BenefitCardProps = {
  interactiveColor: InteractiveColor;
  style?: ViewStyle;
  benefit: FormFactorTicketDescriptionPair;
};

export const BenefitTile = ({
  style,
  benefit,
}: BenefitCardProps): JSX.Element => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const title = t(MobilityTexts.formFactor(benefit.formFactor));
  const description = getTextForLanguage(benefit.ticketDescription, language);
  return (
    <View style={[styles.container, style]}>
      <TileWithButton
        buttonSvg={ExternalLink}
        accessibilityLabel={title + screenReaderPause + description}
        mode="compact"
        buttonText="Aktiver"
        interactiveColor="interactive_2"
        style={styles.contentContainer}
      >
        <BenefitImageAsset
          formFactor={benefit.formFactor}
          width={28}
          height={19}
          style={styles.image}
        />
        <ThemeText type="body__tertiary--bold">{title}</ThemeText>
        <ThemeText
          type="body__tertiary"
          color="secondary"
          style={styles.description}
        >
          {description}
        </ThemeText>
      </TileWithButton>
    </View>
  );
};

type BenefitCardsProps = Omit<BenefitCardProps, 'benefit'> & {
  benefits: FormFactorTicketDescriptionPair[];
  style?: ViewStyle;
};
export const BenefitTiles = ({
  benefits,
  style,
  ...props
}: BenefitCardsProps): JSX.Element => {
  const styles = useStyles();

  return (
    <View style={[styles.benefits, style]}>
      {benefits.map((benefit, i) => (
        <BenefitTile
          {...props}
          style={styles.benefitCard}
          benefit={benefit}
          key={i}
        />
      ))}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    justifyContent: 'space-between',
  },
  contentContainer: {
    flexGrow: 1,
  },
  image: {
    marginBottom: theme.spacings.small,
  },
  description: {
    marginTop: theme.spacings.xSmall,
  },
  benefits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  benefitCard: {
    // Fits two cards on a row, and fills the whole width if there's only one.
    width: '40%',
    flexGrow: 1,
  },
}));
