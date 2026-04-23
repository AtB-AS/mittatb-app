import React, {useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {BonusStarFill} from './BonusStarFill';
import {
  BonusProductType,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {
  BonusProgramTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';
import {getTrasportModeAndSubModeByFormFactorAndPropulsionType} from '@atb/modules/mobility';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {TransportationIconBox} from '@atb/components/icon-box';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {MapPin} from '@atb/assets/svg/mono-icons/tab-bar';
import {MapFilterType, useMapContext} from '@atb/modules/map';
import {useAnalyticsContext} from '@atb/modules/analytics';

const shouldShowMapButton = (bonusProduct: BonusProductType) =>
  bonusProduct.formFactors.some(
    (ff) => (ff as FormFactor) !== FormFactor.Other,
  );

type Props = {
  bonusProducts: BonusProductType[];
  onNavigateToMap?: (initialFilters: MapFilterType) => void;
};

export const BonusProductList = ({bonusProducts, onNavigateToMap}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {mobilityOperators} = useFirestoreConfigurationContext();
  const {mapFilter, setMapFilter} = useMapContext();
  const analytics = useAnalyticsContext();

  const handleNavigateToMap = useCallback(
    (bonusProduct: BonusProductType) => {
      if (!onNavigateToMap || !mapFilter?.mobility) return;
      const updatedMobility = {...mapFilter.mobility};
      bonusProduct.formFactors.forEach((ff) => {
        updatedMobility[ff] = {
          operators: updatedMobility[ff]?.operators ?? [],
          showAll: true,
        };
      });
      const updatedFilter = {...mapFilter, mobility: updatedMobility};
      setMapFilter(updatedFilter);
      onNavigateToMap(updatedFilter);
    },
    [onNavigateToMap, mapFilter, setMapFilter],
  );

  return (
    <View style={styles.container}>
      {bonusProducts.map((bonusProduct) => (
        <Pressable
          key={bonusProduct.id}
          onPress={() =>
            analytics.logEvent('Bonus', 'Bonus product pressed', {
              productId: bonusProduct.id,
            })
          }
          accessible={false}
          importantForAccessibility="no"
        >
          <Section>
            <GenericSectionItem>
              <View style={styles.horizontalContainer}>
                {(() => {
                  const {mode, subMode} =
                    getTrasportModeAndSubModeByFormFactorAndPropulsionType(
                      bonusProduct.formFactors[0] as FormFactor,
                    );
                  return (
                    <TransportationIconBox
                      mode={mode}
                      subMode={subMode}
                      rounded
                    />
                  );
                })()}
                <View style={{flex: 1}}>
                  <ThemeText typography="body__s__strong">
                    {bonusProduct.formFactors
                      .map((ff) =>
                        t(MobilityTexts.vehicleName(ff as FormFactor)),
                      )
                      .join(', ')}
                  </ThemeText>
                  <ThemeText typography="body__s" color="secondary">
                    {mobilityOperators?.find(
                      (op) => op.id === bonusProduct.operatorId,
                    )?.name ?? bonusProduct.operatorId}
                  </ThemeText>
                </View>
                {onNavigateToMap && shouldShowMapButton(bonusProduct) && (
                  <Pressable
                    onPress={() => {
                      analytics.logEvent(
                        'Bonus',
                        'Map button on bonus product clicked',
                        {
                          productId: bonusProduct.id,
                        },
                      );
                      handleNavigateToMap(bonusProduct);
                    }}
                    style={styles.mapButton}
                    accessibilityRole="button"
                    accessibilityLabel={t(
                      BonusProgramTexts.bonusProfile.mapButton.a11yLabel,
                    )}
                    accessibilityHint={t(
                      BonusProgramTexts.bonusProfile.mapButton.a11yHint,
                    )}
                  >
                    <ThemeIcon svg={MapPin} />
                    <ThemeIcon svg={ChevronRight} />
                  </Pressable>
                )}
              </View>
            </GenericSectionItem>
            <GenericSectionItem>
              <View style={styles.usePointsRow}>
                <ThemeText>{t(BonusProgramTexts.spend)}</ThemeText>
                <ThemeIcon svg={BonusStarFill} size="small" />
                <ThemeText>
                  {t(BonusProgramTexts.amountPoints(bonusProduct.price.amount))}
                </ThemeText>
              </View>
              <ThemeText
                isMarkdown={true}
                typography="body__s"
                color="secondary"
              >
                {getTextForLanguage(
                  bonusProduct.productDescription.description,
                  language,
                ) ?? ''}
              </ThemeText>
            </GenericSectionItem>
          </Section>
        </Pressable>
      ))}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    gap: theme.spacing.medium,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.medium,
  },
  usePointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
    marginBottom: theme.spacing.small,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
}));
