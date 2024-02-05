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
import {MobilityMapFilterType, useUserMapFilters} from '@atb/components/map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type BenefitCardProps = {
  interactiveColor: InteractiveColor;
  style?: ViewStyle;
  benefit: FareProductBenefitType;
  onNavigateToMap?: (initialMobilityFilter: MobilityMapFilterType) => void;
};

export const BenefitTile = ({
  style,
  benefit,
  onNavigateToMap,
}: BenefitCardProps): JSX.Element => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const title = t(
    MobilityTexts.formFactor(benefit.formFactors[0] as FormFactor),
  );
  const description = getTextForLanguage(benefit.ticketDescription, language);

  const {getMapFilter, setMapFilter} = useUserMapFilters();

  const onPress = onNavigateToMap
    ? async () => {
        const filter = await getMapFilter();
        const formFactor = benefit.formFactors[0] as FormFactor;
        const selection = filter.mobility[formFactor]?.showAll
          ? {
              operators: [],
              showAll: true,
            }
          : {
              operators: [benefit.operatorId],
              showAll: false,
            };

        const mobilityFilters: MobilityMapFilterType = {
          ...filter.mobility,
          [formFactor]: selection,
        };

        // TODO: Picked up by bottom sheet?
        await setMapFilter({...filter, mobility: mobilityFilters});

        // TODO: Picked up by map screen?
        onNavigateToMap(mobilityFilters);
      }
    : undefined;

  return (
    <View style={[styles.container, style]}>
      <TileWithButton
        buttonSvg={Map}
        accessibilityLabel={title + screenReaderPause + description}
        mode="compact"
        buttonText="Se i kart"
        interactiveColor="interactive_2"
        style={styles.contentContainer}
        onPress={onPress}
      >
        <BenefitImageAsset
          formFactor={benefit.formFactors[0] as FormFactor}
          svgProps={{
            width: 28,
            height: 19,
            style: styles.image,
          }}
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
  benefits: FareProductBenefitType[];
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
