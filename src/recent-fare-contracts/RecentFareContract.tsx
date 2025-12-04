import React from 'react';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import RecentFareContractsTexts from '@atb/translations/screens/subscreens/RecentFareContractsTexts';
import type {RecentFareContractType} from './types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Dimensions, View} from 'react-native';
import {
  FareProductTypeConfig,
  FareZone,
  getReferenceDataName,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {useHarborsQuery} from '@atb/queries';
import {TileWithButton} from '@atb/components/tile';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {
  FareContractFromTo,
  getTravellersIcon,
  getTravellersText,
} from '@atb/modules/fare-contracts';
import {FareContractDetailItem} from '@atb/modules/fare-contracts';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {useTicketAccessibilityLabel} from '@atb/modules/fare-contracts';
import {isDefined} from '@atb/utils/presence';

type RecentFareContractProps = {
  recentFareContract: RecentFareContractType;
  onSelect: (
    rfc: RecentFareContractType,
    fareProductTypeConfig: FareProductTypeConfig,
    harbors?: StopPlaceFragment[],
  ) => void;
  testID: string;
};

export const RecentFareContract = ({
  recentFareContract,
  onSelect,
  testID,
}: RecentFareContractProps) => {
  const {
    preassignedFareProduct,
    fromFareZone,
    toFareZone,
    userProfilesWithCount,
    baggageProductsWithCount,
    pointToPointValidity,
    direction,
  } = recentFareContract;
  const {language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const {width} = Dimensions.get('window');
  const interactiveColor = theme.color.interactive[2];

  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === recentFareContract.preassignedFareProduct.type,
  );

  const harborsQuery = useHarborsQuery(fareProductTypeConfig?.transportModes);

  const productName = getReferenceDataName(preassignedFareProduct, language);

  const travellersText = getTravellersText(
    userProfilesWithCount,
    baggageProductsWithCount,
    language,
  );

  const travellersIcon = getTravellersIcon(
    userProfilesWithCount,
    baggageProductsWithCount,
  );

  const ticketAccessibilityLabel = useTicketAccessibilityLabel(
    fareProductTypeConfig,
    userProfilesWithCount,
    baggageProductsWithCount,
    [fromFareZone, toFareZone].filter(isDefined) as FareZone[],
    pointToPointValidity?.fromPlace,
    pointToPointValidity?.toPlace,
    direction,
  );

  const accessibilityLabel = `${t(RecentFareContractsTexts.repeatPurchase.label)} ${productName} ${ticketAccessibilityLabel} `;

  if (!fareProductTypeConfig) return null;

  return (
    <TileWithButton
      buttonSvg={ArrowRight}
      accessibilityHint={t(RecentFareContractsTexts.repeatPurchase.a11yHint)}
      accessibilityLabel={accessibilityLabel}
      buttonText={t(RecentFareContractsTexts.repeatPurchase.label)}
      interactiveColor={interactiveColor}
      mode="spacious"
      onPress={() =>
        onSelect(recentFareContract, fareProductTypeConfig, harborsQuery.data)
      }
      style={{minWidth: width * 0.6}}
    >
      <View style={styles.productName} testID={testID + 'Title'}>
        <ThemeText
          typography="body__m__strong"
          color={interactiveColor.default}
        >
          {productName}
        </ThemeText>
      </View>

      <View style={styles.recentFareContractDetailItems}>
        <FareContractFromTo
          rfc={recentFareContract}
          backgroundColor={theme.color.background.neutral[0]}
          size="small"
        />

        <FareContractDetailItem
          icon={
            getTransportModeSvg(
              fareProductTypeConfig.transportModes[0].mode,
              fareProductTypeConfig.transportModes[0].subMode,
              false,
            ).svg
          }
          content={`${getTransportModeText(fareProductTypeConfig.transportModes, t)}`}
          size="small"
        />

        <FareContractDetailItem
          icon={travellersIcon}
          content={travellersText}
          size="small"
          style={{maxWidth: width * 0.6}}
        />
      </View>
    </TileWithButton>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  travelModeWrapper: {
    flexShrink: 1,
    marginBottom: theme.spacing.medium,
  },
  productName: {
    marginBottom: theme.spacing.medium,
  },

  additionalCategories: {
    marginHorizontal: theme.spacing.small,
  },
  recentFareContractDetailItems: {
    flex: 1,
    gap: theme.spacing.small,
  },
}));
