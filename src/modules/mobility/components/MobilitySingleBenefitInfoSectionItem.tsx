import {View} from 'react-native';
import React from 'react';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {MapFilterType, useEnableFormFactorsInMapFilter} from '@atb/modules/map';
import type {FareProductBenefitType} from '../use-operator-benefits-for-fare-product';
import {BrandingImage} from './BrandingImage';
import {useMapFilterFormFactors} from './filter/use-map-filter-form-factors';

const LOGO_SIZE = 28;

type Props = SectionItemProps<{
  benefit: FareProductBenefitType;
  onNavigateToMap?: (initialFilters: MapFilterType) => void;
}>;

export const MobilitySingleBenefitInfoSectionItem = ({
  benefit,
  onNavigateToMap,
  ...props
}: Props) => {
  const {topContainer} = useSectionItem(props);
  const {t, language} = useTranslation();
  const {themeName} = useThemeContext();
  const styles = useStyles();
  const enableFormFactorsInMapFilter = useEnableFormFactorsInMapFilter();
  const mapFilterFormFactors = useMapFilterFormFactors();

  const title = getTextForLanguage(benefit.title, language);
  const description = getTextForLanguage(benefit.description, language);
  const logoUrl =
    themeName === 'dark'
      ? (benefit.brandAssets?.brandImageUrlDark ??
        benefit.brandAssets?.brandImageUrl)
      : benefit.brandAssets?.brandImageUrl;

  const handleNavigateToMap = () => {
    if (!onNavigateToMap) return;
    const updatedFilter = enableFormFactorsInMapFilter(mapFilterFormFactors);
    if (!updatedFilter) return;
    onNavigateToMap(updatedFilter);
  };

  return (
    <View style={[topContainer, styles.container]}>
      <View style={styles.row}>
        <View
          style={[styles.row, styles.flex]}
          accessible={true}
          accessibilityLabel={[title, benefit.operatorName, description].join(
            screenReaderPause,
          )}
        >
          <BrandingImage logoUrl={logoUrl} logoSize={LOGO_SIZE} />
          <View style={styles.flex}>
            {!!title && (
              <ThemeText typography="body__m__strong">{title}</ThemeText>
            )}
            {!!benefit.operatorName && (
              <ThemeText typography="body__s" type="secondary">
                {benefit.operatorName}
              </ThemeText>
            )}
          </View>
        </View>
        {!!onNavigateToMap && (
          <Button
            expanded={false}
            type="small"
            mode="tertiary"
            surfaceColor="neutral"
            text={t(MobilityTexts.showInMap)}
            rightIcon={{svg: ChevronRight}}
            onPress={handleNavigateToMap}
            accessibilityHint={t(MobilityTexts.showInMapA11yLabel)}
          />
        )}
      </View>
      {!!description && (
        <ThemeText
          typography="body__m"
          accessible={false}
          importantForAccessibility="no"
        >
          {description}
        </ThemeText>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {gap: theme.spacing.medium},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  flex: {flex: 1},
}));
