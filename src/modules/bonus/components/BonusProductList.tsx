import React from 'react';
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
import {StyleSheet} from '@atb/theme';
import {getTransportModeAndSubMode} from '@atb/modules/mobility';
import {TransportationIconBox} from '@atb/components/icon-box';
import {ThemeIcon} from '@atb/components/theme-icon';
import {MapFilterType} from '@atb/modules/map';
import {useAnalyticsContext} from '@atb/modules/analytics';

type Props = {
  bonusProductGroups: BonusProductGroupType[];
  bonusProducts: BonusProductType[];
  onNavigateToMap?: (initialFilters: MapFilterType) => void;
};

export const BonusProductList = ({
  bonusProductGroups,
  bonusProducts,
  onNavigateToMap: _onNavigateToMap,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {mobilityOperators} = useFirestoreConfigurationContext();
  const analytics = useAnalyticsContext();

  return (
    <View style={styles.container}>
      {bonusProductGroups.map((group) => {
        const memberProducts = bonusProducts.filter(
          (bp) => bp.bonusProductGroupId === group.id,
        );
        const operatorNames = memberProducts
          .map(
            (bp) =>
              mobilityOperators?.find((op) => op.id === bp.operatorId)?.name ??
              bp.operatorId,
          )
          .join(', ');

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
                      undefined,
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
                      {operatorNames}
                    </ThemeText>
                  </View>
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
                  <ThemeText
                    isMarkdown={true}
                    typography="body__s"
                    type="secondary"
                  >
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
