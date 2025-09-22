import React from 'react';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import RecentFareContractsTexts from '@atb/translations/screens/subscreens/RecentFareContractsTexts';
import type {RecentFareContractType} from './types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Dimensions, View} from 'react-native';
import {
  FareProductTypeConfig,
  getReferenceDataName,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {useHarborsQuery} from '@atb/queries';
import {TravelRightDirection} from '@atb-as/utils';
import {TileWithButton} from '@atb/components/tile';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {FareContractFromTo} from '@atb/modules/fare-contracts';
import {FareContractDetailItem} from '@atb/modules/fare-contracts';

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
    pointToPointValidity,
    direction,
  } = recentFareContract;
  const {language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const fromZoneName = fromFareZone?.name.value;
  const toZoneName = toFareZone?.name.value;
  const {width} = Dimensions.get('window');
  const interactiveColor = theme.color.interactive[2];

  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === recentFareContract.preassignedFareProduct.type,
  );

  const harborsQuery = useHarborsQuery(fareProductTypeConfig?.transportModes);

  const productName = getReferenceDataName(preassignedFareProduct, language);

  if (!fareProductTypeConfig) return null;
  const returnAccessibilityLabel = () => {
    const modeInfo = `${productName} ${t(
      RecentFareContractsTexts.a11yPreLabels.transportModes,
    )}${getTransportModeText(fareProductTypeConfig.transportModes, t)}`;

    const travellerInfo = `${t(
      RecentFareContractsTexts.a11yPreLabels.travellers,
    )}${userProfilesWithCount
      .map((u) => u.count + ' ' + getReferenceDataName(u, language))
      .join(', ')}`;

    if (fareProductTypeConfig.configuration.zoneSelectionMode === 'none') {
      return `${t(
        RecentFareContractsTexts.repeatPurchase.label,
      )} ${modeInfo} ${travellerInfo}`;
    }
    const zoneInfo =
      fromZoneName === toZoneName
        ? `${t(
            RecentFareContractsTexts.a11yPreLabels.zones.oneZone,
          )} ${fromZoneName}`
        : `${t(
            RecentFareContractsTexts.a11yPreLabels.zones.multipleZones,
          )} ${fromZoneName}, ${toZoneName}`;

    const harborInfo = () => {
      if (
        pointToPointValidity?.fromPlace &&
        pointToPointValidity?.toPlace &&
        direction
      ) {
        const fromName =
          harborsQuery.data?.find(
            (sp) => sp.id === pointToPointValidity.fromPlace,
          )?.name ?? '';
        const toName =
          harborsQuery.data?.find(
            (sp) => sp.id === pointToPointValidity.toPlace,
          )?.name ?? '';
        return direction === TravelRightDirection.Both
          ? t(
              RecentFareContractsTexts.a11yPreLabels.harbors.returnTrip(
                fromName,
                toName,
              ),
            )
          : t(
              RecentFareContractsTexts.a11yPreLabels.harbors.oneWayTrip(
                fromName,
                toName,
              ),
            );
      }
      return '';
    };
    const zoneOrHarborInfo =
      fromFareZone !== undefined ? zoneInfo : harborInfo();

    return `${t(
      RecentFareContractsTexts.repeatPurchase.label,
    )} ${modeInfo} ${travellerInfo} ${zoneOrHarborInfo}`;
  };

  const currentAccessibilityLabel = returnAccessibilityLabel();

  return (
    <TileWithButton
      buttonSvg={ArrowRight}
      accessibilityHint={t(RecentFareContractsTexts.repeatPurchase.a11yHint)}
      accessibilityLabel={currentAccessibilityLabel}
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
          typography="body__primary--bold"
          color={interactiveColor.default}
        >
          {productName}
        </ThemeText>
      </View>

      <View style={styles.recentFareContractDetailItems}>
        <FareContractFromTo
          rfc={recentFareContract}
          backgroundColor={theme.color.background.neutral[0]}
          mode="small"
        />

        <FareContractDetailItem
          content={[
            `${getTransportModeText(fareProductTypeConfig.transportModes, t)}`,
          ]}
        />

        {userProfilesWithCount.length <= 2 &&
          userProfilesWithCount.map((u) => (
            <FareContractDetailItem
              key={u.id}
              content={[`${u.count} ${getReferenceDataName(u, language)}`]}
            />
          ))}

        {userProfilesWithCount.length > 2 && (
          <>
            <FareContractDetailItem
              content={[
                `${userProfilesWithCount[0].count} ${getReferenceDataName(
                  userProfilesWithCount[0],
                  language,
                )}`,
              ]}
            />
            <ThemeText
              typography="body__tertiary"
              testID={`${testID}TravellersOthers`}
              color={interactiveColor.default}
              style={styles.additionalCategories}
            >
              + {userProfilesWithCount.slice(1).length}{' '}
              {t(RecentFareContractsTexts.titles.moreTravelers)}
            </ThemeText>
          </>
        )}
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
    rowGap: theme.spacing.xSmall,
  },
}));
