import {ThemeText, screenReaderPause} from '@atb/components/text';
import {TileWithButton} from '@atb/components/tile';
import {StyleSheet} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
import {View, ViewStyle} from 'react-native';
import {BenefitImageAsset} from './BenefitImage';
import {FareProductBenefitType} from '../use-operator-benefits-for-fare-product';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Map} from '@atb/assets/svg/mono-icons/map';
import {MapFilterType, useEnableFormFactorsInMapFilter} from '@atb/modules/map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type BenefitCardProps = {
  interactiveColor: InteractiveColor;
  style?: ViewStyle;
  benefit: FareProductBenefitType;
  onNavigateToMap: (initialFilters: MapFilterType) => void;
};

export const BenefitTile = ({
  style,
  benefit,
  interactiveColor,
  onNavigateToMap,
}: BenefitCardProps): React.JSX.Element => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const title = t(
    MobilityTexts.vehicleName(benefit.formFactors[0] as FormFactor),
  );
  const description = getTextForLanguage(benefit.ticketDescription, language);

  const enableFormFactorsInMapFilter = useEnableFormFactorsInMapFilter();

  const onPress = () => {
    // Turn on the filter for the benefit's form factors, so the vehicles are
    // visible in the map even if the user has previously turned the filter off.
    const updatedFilter = enableFormFactorsInMapFilter(
      benefit.formFactors as FormFactor[],
    );
    if (!updatedFilter) return;
    onNavigateToMap(updatedFilter);
  };
  return (
    <View style={[styles.container, style]}>
      <TileWithButton
        buttonSvg={Map}
        accessibilityLabel={title + screenReaderPause + description}
        mode="compact"
        buttonText={t(MobilityTexts.showInMap)}
        interactiveColor={interactiveColor}
        style={styles.contentContainer}
        onPress={onPress}
        accessibilityHint={t(MobilityTexts.showInMapA11yLabel)}
      >
        <BenefitImageAsset
          formFactor={benefit.formFactors[0] as FormFactor}
          svgProps={{
            width: 28,
            height: 19,
            style: styles.image,
          }}
        />
        <ThemeText typography="heading__xs" color={interactiveColor.default}>
          {title}
        </ThemeText>
        <ThemeText
          typography="body__xs"
          type="secondary"
          style={styles.description}
        >
          {description}
        </ThemeText>
      </TileWithButton>
    </View>
  );
};

type BenefitCardsProps = Omit<BenefitCardProps, 'benefit'> & {
  benefits: FareProductBenefitType[];
  style?: ViewStyle;
};
export const BenefitTiles = ({
  benefits,
  style,
  ...props
}: BenefitCardsProps): React.JSX.Element => {
  const styles = useStyles();

  return (
    <View style={[styles.benefits, style]}>
      {benefits.map((benefit, i) => (
        <BenefitTile
          key={i}
          {...props}
          style={styles.benefitCard}
          benefit={benefit}
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
    marginBottom: theme.spacing.small,
  },
  description: {
    marginTop: theme.spacing.xSmall,
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
