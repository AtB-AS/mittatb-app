import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {View} from 'react-native';
import {Unlock, PricePerTime} from '@atb/assets/svg/mono-icons/mobility';
import {VehicleCardStat} from './VehicleCardStat';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {
  computeFreeMinuteCount,
  formatRatePerUnit,
  getFreeMinutes,
  getFreeUnlock,
} from '../utils';
import {formatNumberToString} from '@atb-as/utils';
import {PriceAdjustmentType} from '@atb-as/config-specs/lib/mobility';
import {getCurrencySymbol} from '@atb/translations/currency';
import {ShmoPricingPlan} from '@atb/api/types/mobility';
import SvgChevronRight from '@atb/assets/svg/mono-icons/navigation/ChevronRight';
import {useOperatorBenefit} from '../use-operator-benefit';
import {OperatorBenefit} from './OperatorBenefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type Props = {
  pricingPlan: ShmoPricingPlan;
  priceAdjustments?: PriceAdjustmentType[];
  systemId: string;
  onNavigatePricingDetails?: (
    pricingPlan: ShmoPricingPlan,
    priceAdjustments: PriceAdjustmentType[] | undefined,
  ) => void;
  operatorId: string | undefined;
  formFactor: FormFactor;
};

export const PriceDetailsCard = ({
  pricingPlan,
  priceAdjustments,
  systemId,
  onNavigatePricingDetails,
  operatorId,
  formFactor,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const ratePrUnit = formatRatePerUnit(pricingPlan, language);
  const freeUnlock = getFreeUnlock(priceAdjustments, systemId);
  const freeMinutes = getFreeMinutes(priceAdjustments, systemId);
  const {operatorBenefit} = useOperatorBenefit(operatorId);

  const unlockStat = freeUnlock
    ? t(ScooterTexts.free)
    : `${formatNumberToString(pricingPlan.price, language)} ${getCurrencySymbol(pricingPlan.currency)}`;

  const minutePriceStat =
    freeMinutes && pricingPlan.perMinPricing?.length
      ? `${formatNumberToString(
          computeFreeMinuteCount(freeMinutes, pricingPlan.perMinPricing),
          language,
        )} min ${t(ScooterTexts.free).toLocaleLowerCase(language)}`
      : ratePrUnit?.formattedRate;

  const minutePriceDescription = freeMinutes
    ? t(
        ScooterTexts.per.discount(
          ratePrUnit?.perUnit ?? '',
          ratePrUnit?.rate.toString() ?? '',
          pricingPlan.currency,
        ),
      )
    : t(ScooterTexts.per.unit(ratePrUnit?.perUnit ?? ''));

  return (
    <Section>
      <GenericSectionItem style={styles.sectionWrapper}>
        <View style={styles.content}>
          <VehicleCardStat
            icon={Unlock}
            stat={unlockStat}
            description={t(ScooterTexts.unlock)}
            hasPriceAdjustment={!!freeUnlock}
          />
          {minutePriceStat && (
            <VehicleCardStat
              icon={PricePerTime}
              stat={minutePriceStat}
              description={minutePriceDescription}
              hasPriceAdjustment={!!freeMinutes}
            />
          )}
        </View>
        {operatorBenefit && (
          <OperatorBenefit
            benefit={operatorBenefit}
            formFactor={formFactor}
            style={styles.operatorBenefit}
          />
        )}
      </GenericSectionItem>

      {onNavigatePricingDetails && (
        <LinkSectionItem
          rightIcon={{svg: SvgChevronRight}}
          text={t(MobilityTexts.pricingDetails.priceInfo)}
          onPress={() =>
            onNavigatePricingDetails(
              pricingPlan,
              priceAdjustments?.filter((adj) =>
                adj.systemIds.includes(systemId),
              ),
            )
          }
        />
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },
    sectionWrapper: {
      padding: theme.spacing.small,
    },
    operatorBenefit: {
      paddingVertical: theme.spacing.xSmall,
      paddingHorizontal: theme.spacing.medium,
    },
  };
});
