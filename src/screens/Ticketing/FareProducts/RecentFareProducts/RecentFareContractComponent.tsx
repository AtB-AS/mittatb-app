import React from 'react';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import RecentFareContractsTexts from '@atb/translations/screens/subscreens/RecentFareContractsTexts';
import {RecentFareContract} from '../use-recent-fare-contracts';
import {StyleSheet, useTheme} from '@atb/theme';
import {Dimensions, TouchableOpacity, View, ViewStyle} from 'react-native';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {TransportationIcon} from '@atb/components/transportation-icon';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {FareProductTypeConfig} from '@atb/screens/Ticketing/FareContracts/utils';
import {TransportModeType} from '@atb/configuration/types';

type RecentFareContractProps = {
  recentFareContract: RecentFareContract;
  onSelect: (
    rfc: RecentFareContract,
    fareProductTypeConfig: FareProductTypeConfig,
  ) => void;
  testID: string;
};

export const FloatingLabel = ({
  text,
  additionalStyles,
  testID = '',
}: {
  text: string;
  additionalStyles?: ViewStyle;
  testID?: string;
}) => {
  const styles = useStyles();
  return (
    <View
      style={
        additionalStyles
          ? [styles.blueLabel, additionalStyles]
          : styles.blueLabel
      }
    >
      <ThemeText
        type="body__tertiary"
        color="background_accent_2"
        testID={testID}
      >
        {text}
      </ThemeText>
    </View>
  );
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

  type ModeNameProps = {
    modes: TransportModeType[];
    joinSymbol?: string;
  };

  const modeNames = ({modes, joinSymbol = '/'}: ModeNameProps) => {
    if (!modes) return null;
    if (modes.length > 2)
      return t(RecentFareContractsTexts.severalTransportModes);
    else
      return modes
        .map((tm) => t(FareContractTexts.transportMode(tm.mode)))
        .join(joinSymbol);
  };

  const returnAccessibilityLabel = () => {
    const modeInfo = `${getReferenceDataName(
      preassignedFareProduct,
      language,
    )}${t(RecentFareContractsTexts.a11yPreLabels.transportModes)} ${modeNames({
      modes: fareProductTypeConfig.transportModes,
      joinSymbol: t(RecentFareContractsTexts.a11yPreLabels.and),
    })}`;

    const travellerInfo = `${t(
      RecentFareContractsTexts.a11yPreLabels.travellers,
    )}: ${userProfilesWithCount
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

  const buttonColor = theme.interactive.interactive_0.default;

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
          {fareProductTypeConfig.transportModes.map(({mode, subMode}) => (
            <TransportationIcon
              mode={mode}
              subMode={subMode}
              key={mode + subMode}
              size="small"
            />
          ))}

          <ThemeText type="label__uppercase">
            {modeNames({modes: fareProductTypeConfig.transportModes})}
          </ThemeText>
        </View>

        <View style={styles.productName} testID={testID + 'Title'}>
          <ThemeText type="body__secondary--bold">
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
                    <FloatingLabel
                      key={u.id}
                      text={`${u.count} ${getReferenceDataName(u, language)}`}
                      additionalStyles={{
                        marginRight: theme.spacings.xSmall,
                      }}
                      testID={`${testID}Travellers${userProfilesWithCount.indexOf(
                        u,
                      )}`}
                    />
                  ))}
                {userProfilesWithCount.length > 2 && (
                  <>
                    {userProfilesWithCount.slice(0, 1).map((u) => (
                      <FloatingLabel
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
                  <FloatingLabel
                    text={`${fromZoneName}`}
                    testID={`${testID}Zone`}
                  />
                ) : (
                  <FloatingLabel
                    text={`${fromZoneName} - ${toZoneName}`}
                    testID={`${testID}Zones`}
                  />
                )}
              </View>
            )}
        </View>
      </View>
      <View
        style={[styles.buyButton, {backgroundColor: buttonColor.background}]}
        testID={testID + 'BuyButton'}
      >
        <ThemeText color={buttonColor}>
          {t(RecentFareContractsTexts.repeatPurchase.label)}
        </ThemeText>
        <ThemeIcon svg={ArrowRight} fill={buttonColor.text} />
      </View>
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginHorizontal: theme.spacings.small,
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    overflow: 'hidden',
  },
  upperPart: {
    padding: theme.spacings.xLarge,
    flexGrow: 1,
  },
  travelModeWrapper: {
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacings.medium,
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
  blueLabel: {
    marginVertical: theme.spacings.xSmall,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.xSmall,
    backgroundColor: theme.static.background.background_accent_2.background,
    borderRadius: theme.border.radius.regular,
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
