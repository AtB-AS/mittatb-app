import React from 'react';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import RecentFareContractsTexts from '@atb/translations/screens/subscreens/RecentFareContractsTexts';
import {RecentFareContract} from '../../types';
import {StyleSheet, useTheme} from '@atb/theme';
import {Dimensions, View} from 'react-native';
import {
  FareProductTypeConfig,
  getReferenceDataName,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {
  getTransportModeText,
  TransportModes,
} from '@atb/components/transportation-modes';
import {FareContractHarborStopPlaces} from '@atb/fare-contracts';
import {useHarborsQuery} from '@atb/queries';
import {TravelRightDirection} from '@atb/ticketing';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {TileWithButton} from '@atb/components/tile';

type RecentFareContractProps = {
  recentFareContract: RecentFareContract;
  onSelect: (
    rfc: RecentFareContract,
    fareProductTypeConfig: FareProductTypeConfig,
  ) => void;
  testID: string;
};

export const RecentFareContractComponent = ({
  recentFareContract,
  onSelect,
  testID,
}: RecentFareContractProps) => {
  const {
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
    pointToPointValidity,
    direction,
  } = recentFareContract;
  const {language} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const fromZoneName = fromTariffZone?.name.value;
  const toZoneName = toTariffZone?.name.value;
  const {width} = Dimensions.get('window');
  const interactiveColor = theme.color.interactive[2];

  const harborsQuery = useHarborsQuery();

  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === recentFareContract.preassignedFareProduct.type,
  );

  if (!fareProductTypeConfig) return null;
  const returnAccessibilityLabel = () => {
    const modeInfo = `${getReferenceDataName(
      preassignedFareProduct,
      language,
    )} ${t(
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
      fromTariffZone !== undefined ? zoneInfo : harborInfo();

    return `${t(
      RecentFareContractsTexts.repeatPurchase.label,
    )} ${modeInfo} ${travellerInfo} ${zoneOrHarborInfo}`;
  };

  const currentAccessibilityLabel = returnAccessibilityLabel();

  const showTwoWayIcon = direction === TravelRightDirection.Both;

  return (
    <TileWithButton
      buttonSvg={ArrowRight}
      accessibilityHint={t(RecentFareContractsTexts.repeatPurchase.a11yHint)}
      accessibilityLabel={currentAccessibilityLabel}
      buttonText={t(RecentFareContractsTexts.repeatPurchase.label)}
      interactiveColor={interactiveColor}
      mode="spacious"
      onPress={() => onSelect(recentFareContract, fareProductTypeConfig)}
      style={{minWidth: width * 0.6}}
    >
      <View style={styles.travelModeWrapper}>
        <TransportModes
          iconSize="xSmall"
          modes={fareProductTypeConfig.transportModes}
          style={{flex: 2}}
        />
      </View>

      <View style={styles.productName} testID={testID + 'Title'}>
        <ThemeText
          type="body__secondary--bold"
          color={interactiveColor.default}
        >
          {getReferenceDataName(preassignedFareProduct, language)}
        </ThemeText>
      </View>

      {direction !== undefined && pointToPointValidity && (
        <View style={styles.harbors}>
          <FareContractHarborStopPlaces
            showTwoWayIcon={showTwoWayIcon}
            fromStopPlaceId={pointToPointValidity?.fromPlace}
            toStopPlaceId={pointToPointValidity?.toPlace}
          />
        </View>
      )}

      <View style={styles.horizontalFlex}>
        <View style={styles.detailContainer}>
          <ThemeText type="label__uppercase" color="secondary">
            {t(RecentFareContractsTexts.titles.travellers)}
          </ThemeText>
          {userProfilesWithCount.length <= 2 &&
            userProfilesWithCount.map((u) => (
              <BorderedInfoBox
                backgroundColor={interactiveColor.default}
                type="small"
                key={u.id}
                text={`${u.count} ${getReferenceDataName(u, language)}`}
                style={styles.infoChip_travellers}
                testID={`${testID}Travellers${userProfilesWithCount.indexOf(
                  u,
                )}`}
              />
            ))}
          {userProfilesWithCount.length > 2 && (
            <>
              {userProfilesWithCount.slice(0, 1).map((u) => (
                <BorderedInfoBox
                  key={u.id}
                  type="small"
                  backgroundColor={interactiveColor.default}
                  text={`${u.count} ${getReferenceDataName(u, language)}`}
                  testID={`${testID}Travellers${userProfilesWithCount.indexOf(
                    u,
                  )}`}
                />
              ))}
              <ThemeText
                type="body__tertiary"
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
        {fareProductTypeConfig.configuration.zoneSelectionMode !== 'none' &&
          fromZoneName &&
          toZoneName && (
            <View style={styles.detailContainer}>
              <ThemeText type="label__uppercase" color="secondary">
                {t(RecentFareContractsTexts.titles.zone)}
              </ThemeText>
              {fromZoneName === toZoneName ? (
                <BorderedInfoBox
                  backgroundColor={interactiveColor.default}
                  type="small"
                  text={`${fromZoneName}`}
                  testID={`${testID}Zone`}
                />
              ) : (
                <BorderedInfoBox
                  backgroundColor={interactiveColor.default}
                  type="small"
                  text={`${fromZoneName} - ${toZoneName}`}
                  testID={`${testID}Zones`}
                />
              )}
            </View>
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
  travellersTileWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  horizontalFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailContainer: {
    rowGap: theme.spacing.xSmall,
  },
  infoChip_travellers: {
    marginRight: theme.spacing.xSmall,
  },
  additionalCategories: {
    marginHorizontal: theme.spacing.small,
  },
  harbors: {
    marginBottom: theme.spacing.medium,
  },
}));
