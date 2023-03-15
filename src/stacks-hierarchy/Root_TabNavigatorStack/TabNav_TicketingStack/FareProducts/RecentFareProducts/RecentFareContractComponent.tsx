import React from 'react';
import {ThemeText} from '@atb/components/text';
import {useTranslation} from '@atb/translations';
import RecentFareContractsTexts from '@atb/translations/screens/subscreens/RecentFareContractsTexts';
import {RecentFareContract} from '../use-recent-fare-contracts';
import {StyleSheet, useTheme} from '@atb/theme';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {FareProductTypeConfig} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import {InfoChip} from '@atb/components/info-chip';
import {InteractiveColor} from '@atb/theme/colors';
import {
  getTransportModeText,
  TransportMode,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/Component/TransportMode';

type RecentFareContractProps = {
  recentFareContract: RecentFareContract;
  onSelect: (
    rfc: RecentFareContract,
    fareProductTypeConfig: FareProductTypeConfig,
  ) => void;
  testID: string;
};

const interactiveColorName: InteractiveColor = 'interactive_2';

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
  } = recentFareContract;
  const {language} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const fromZoneName = fromTariffZone?.name.value;
  const toZoneName = toTariffZone?.name.value;
  const {width} = Dimensions.get('window');

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

    const zoneInfo = `${
      fromZoneName === toZoneName
        ? `${t(
            RecentFareContractsTexts.a11yPreLabels.zones.oneZone,
          )} ${fromZoneName}`
        : `${t(
            RecentFareContractsTexts.a11yPreLabels.zones.multipleZones,
          )} ${fromZoneName}, ${toZoneName}`
    }`;

    return `${t(
      RecentFareContractsTexts.repeatPurchase.label,
    )} ${modeInfo} ${travellerInfo} ${zoneInfo}`;
  };

  const currentAccessibilityLabel = returnAccessibilityLabel();

  const interactiveColor = theme.interactive[interactiveColorName];

  return (
    <TouchableOpacity
      style={styles.container}
      accessible={true}
      onPress={() => onSelect(recentFareContract, fareProductTypeConfig)}
      accessibilityLabel={currentAccessibilityLabel}
      accessibilityHint={t(RecentFareContractsTexts.repeatPurchase.a11yHint)}
      testID={testID}
    >
      <View style={[styles.upperPart, {minWidth: width * 0.6}]}>
        <View style={styles.travelModeWrapper}>
          <TransportMode
            iconSize={'small'}
            modes={fareProductTypeConfig.transportModes}
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

        <View style={styles.horizontalFlex}>
          <View>
            <View>
              <ThemeText type="label__uppercase" color="secondary">
                {t(RecentFareContractsTexts.titles.travellers)}
              </ThemeText>
              <View style={styles.travellersTileWrapper}>
                {userProfilesWithCount.length <= 2 &&
                  userProfilesWithCount.map((u) => (
                    <InfoChip
                      interactiveColor={interactiveColorName}
                      key={u.id}
                      text={`${u.count} ${getReferenceDataName(u, language)}`}
                      style={[styles.infoChip, styles.infoChip_travellers]}
                      testID={`${testID}Travellers${userProfilesWithCount.indexOf(
                        u,
                      )}`}
                    />
                  ))}
                {userProfilesWithCount.length > 2 && (
                  <>
                    {userProfilesWithCount.slice(0, 1).map((u) => (
                      <InfoChip
                        interactiveColor={interactiveColorName}
                        style={styles.infoChip}
                        text={`${u.count} ${getReferenceDataName(u, language)}`}
                        testID={`${testID}Travellers${userProfilesWithCount.indexOf(
                          u,
                        )}`}
                      />
                    ))}
                    <View style={styles.additionalCategories}>
                      <ThemeText
                        type="body__tertiary"
                        testID={`${testID}TravellersOthers`}
                        color={interactiveColor.default}
                      >
                        + {userProfilesWithCount.slice(1).length}{' '}
                        {t(RecentFareContractsTexts.titles.moreTravelers)}
                      </ThemeText>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
          {fareProductTypeConfig.configuration.zoneSelectionMode !== 'none' &&
            fromZoneName &&
            toZoneName && (
              <View>
                <ThemeText type="label__uppercase" color="secondary">
                  {t(RecentFareContractsTexts.titles.zone)}
                </ThemeText>
                {fromZoneName === toZoneName ? (
                  <InfoChip
                    interactiveColor={interactiveColorName}
                    style={styles.infoChip}
                    text={`${fromZoneName}`}
                    testID={`${testID}Zone`}
                  />
                ) : (
                  <InfoChip
                    interactiveColor={interactiveColorName}
                    style={styles.infoChip}
                    text={`${fromZoneName} - ${toZoneName}`}
                    testID={`${testID}Zones`}
                  />
                )}
              </View>
            )}
        </View>
      </View>
      <View
        style={[
          styles.buyButton,
          {backgroundColor: interactiveColor.outline.background},
        ]}
        testID={testID + 'BuyButton'}
      >
        <ThemeText color={interactiveColor.outline}>
          {t(RecentFareContractsTexts.repeatPurchase.label)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} fill={interactiveColor.outline.text} />
      </View>
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginHorizontal: theme.spacings.small,
    backgroundColor: theme.interactive[interactiveColorName].default.background,
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  upperPart: {
    padding: theme.spacings.xLarge,
    flexGrow: 1,
  },
  travelModeWrapper: {
    flexShrink: 1,
    marginBottom: theme.spacings.medium,
  },
  transportationIcon: {
    marginRight: theme.spacings.xSmall,
  },
  productName: {
    marginBottom: theme.spacings.medium,
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
  infoChip: {
    marginVertical: theme.spacings.xSmall,
  },
  infoChip_travellers: {
    marginRight: theme.spacings.xSmall,
  },
  additionalCategories: {
    marginHorizontal: theme.spacings.small,
    marginVertical: theme.spacings.xSmall,
  },
  buyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacings.xLarge,
    paddingVertical: theme.spacings.medium,
  },
}));
