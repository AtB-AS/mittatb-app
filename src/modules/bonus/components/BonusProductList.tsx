import React, {useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {BonusStarFill} from './BonusStarFill';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {BonusProductGroupType, BonusProductType} from '@atb/modules/bonus';
import {
  BonusProgramTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';
import {getTransportModeAndSubMode} from '@atb/modules/mobility';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {TransportationIconBox} from '@atb/components/icon-box';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {MapPin} from '@atb/assets/svg/mono-icons/tab-bar';
import {MapFilterType, useMapContext} from '@atb/modules/map';
import {useAnalyticsContext} from '@atb/modules/analytics';

type Props = {
  bonusProductGroups: BonusProductGroupType[];
  bonusProducts: BonusProductType[];
  onNavigateToMap?: (initialFilters: MapFilterType) => void;
};

export const BonusProductList = ({
  bonusProductGroups,
  bonusProducts,
  onNavigateToMap,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {mobilityOperators} = useFirestoreConfigurationContext();
  const {mapFilter, setMapFilter} = useMapContext();
  const analytics = useAnalyticsContext();

  const handleNavigateToMap = useCallback(
    (formFactors: FormFactor[]) => {
      if (!onNavigateToMap || !mapFilter?.mobility) return;
      const updatedMobility = {...mapFilter.mobility};
      formFactors.forEach((ff) => {
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
      {bonusProductGroups.map((group) => {
        const memberProducts = bonusProducts.filter(
          (bp) => bp.bonusProductGroupId === group.id,
        );
        const formFactors = [
          ...new Set(memberProducts.flatMap((bp) => bp.formFactors)),
        ] as FormFactor[];
        const operatorNames = memberProducts
          .map(
            (bp) =>
              mobilityOperators?.find((op) => op.id === bp.operatorId)?.name ??
              bp.operatorId,
          )
          .join(', ');
        const showMapButton =
          !!onNavigateToMap &&
          formFactors.some((ff) => ff !== FormFactor.Other);

        return (
          <Pressable
            key={group.id}
            onPress={() =>
              analytics.logEvent('Bonus', 'Bonus product group pressed', {
                bonusProductGroupId: group.id,
              })
            }
            accessible={false}
            importantForAccessibility="no"
          >
            <Section>
              <GenericSectionItem>
                <View style={styles.horizontalContainer}>
                  {(() => {
                    const {mode, subMode} = getTransportModeAndSubMode(
                      formFactors[0],
                    );
                    return (
                      <TransportationIconBox
                        mode={mode}
                        subMode={subMode}
                        rounded
                      />
                    );
                  })()}
                  <View style={{flex: 1}} accessible={true}>
                    <ThemeText typography="body__s__strong">
                      {formFactors
                        .map((ff) => t(MobilityTexts.vehicleName(ff)))
                        .join(', ')}
                    </ThemeText>
                    <ThemeText typography="body__s" type="secondary">
                      {operatorNames}
                    </ThemeText>
                  </View>
                  {showMapButton && (
                    <Pressable
                      onPress={() => {
                        analytics.logEvent(
                          'Bonus',
                          'Map button on bonus product group clicked',
                          {
                            bonusProductGroupId: group.id,
                          },
                        );
                        handleNavigateToMap(formFactors);
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
                <View accessible={true}>
                  <View style={styles.usePointsRow}>
                    <ThemeText>{t(BonusProgramTexts.spend)}</ThemeText>
                    <ThemeIcon svg={BonusStarFill} size="small" />
                    <ThemeText>
                      {t(BonusProgramTexts.amountPoints(group.price.amount))}
                    </ThemeText>
                  </View>
                  <ThemeText isMarkdown={true} type="secondary">
                    {getTextForLanguage(group.description, language) ?? ''}
                  </ThemeText>
                </View>
              </GenericSectionItem>
            </Section>
          </Pressable>
        );
      })}
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
