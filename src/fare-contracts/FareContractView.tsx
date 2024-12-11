import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {
  getFareContractInfo,
  mapToUserProfilesWithCount,
  userProfileCountAndName,
} from '@atb/fare-contracts/utils';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ValidityHeader} from '@atb/fare-contracts/ValidityHeader';
import {ValidityLine} from '@atb/fare-contracts/ValidityLine';
import {MobilityBenefitsInfoSectionItem} from '@atb/mobility/components/MobilityBenefitsInfoSectionItem';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useAuthContext} from '@atb/auth';
import {useMobileTokenContext} from '@atb/mobile-token';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {CarnetFooter} from '@atb/fare-contracts/carnet/CarnetFooter';
import {
  isCanBeConsumedNowFareContract,
  FareContract,
  isCanBeActivatedNowFareContract,
  isSentOrReceivedFareContract,
} from '@atb/ticketing';
import {ConsumeCarnetSectionItem} from './components/ConsumeCarnetSectionItem';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ActivateNowSectionItem} from './components/ActivateNowSectionItem';
import {useFeatureTogglesContext} from '@atb/feature-toggles';
import React from 'react';
import {InspectionSymbol} from '@atb/fare-contracts/components/InspectionSymbol';
import {FareContractFromTo} from '@atb/fare-contracts/components/FareContractFromTo';
import {View} from 'react-native';
import {ProductName} from '@atb/fare-contracts/components/ProductName';
import {Description} from '@atb/fare-contracts/components/FareContractDescription';
import {FareContractDetail} from '@atb/fare-contracts/components/FareContractDetail';
import {getTransportModeText} from '@atb/components/transportation-modes';

type Props = {
  now: number;
  fareContract: FareContract;
  isStatic?: boolean;
  onPressDetails?: () => void;
  testID?: string;
};

export const FareContractView: React.FC<Props> = ({
  now,
  fareContract,
  isStatic,
  onPressDetails,
  testID,
}) => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {isInspectable} = useMobileTokenContext();
  const {isActivateTicketNowEnabled} = useFeatureTogglesContext();

  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();

  const {
    isCarnetFareContract,
    travelRights,
    validityStatus,
    validFrom,
    validTo,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = getFareContractInfo(now, fareContract, currentUserId);

  const isSentOrReceived = isSentOrReceivedFareContract(fareContract);
  const isSent =
    isSentOrReceived && fareContract.customerAccountId !== currentUserId;

  const firstTravelRight = travelRights[0];

  const {benefits} = useOperatorBenefitsForFareProduct(
    firstTravelRight.fareProductRef,
  );

  const shouldShowBundlingInfo =
    benefits && benefits.length > 0 && validityStatus === 'valid';

  const {userProfiles, preassignedFareProducts} =
    useFirestoreConfigurationContext();

  const userProfilesWithCount = mapToUserProfilesWithCount(
    travelRights.map((tr) => tr.userProfileRef),
    userProfiles,
  );

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );

  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );

  //TODO: Rydd og strukturer dette inn i logiske komponenter
  return (
    <Section testID={testID}>
      <GenericSectionItem
        style={{
          paddingVertical: 0,
        }}
      >
        <ValidityLine
          status={validityStatus}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
          fareProductType={preassignedFareProduct?.type}
          animate={!isStatic}
        />
        <View
          style={{
            paddingVertical: theme.spacing.large,
            paddingHorizontal: theme.spacing.medium,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
            rowGap: theme.spacing.small,
          }}
        >
          <ProductName fc={fareContract} />
          <ValidityHeader
            status={validityStatus}
            now={now}
            createdDate={fareContract.created.getTime()}
            validFrom={validFrom}
            validTo={validTo}
          />
          <Description fc={fareContract} />
        </View>
      </GenericSectionItem>
      <GenericSectionItem style={styles.detailContainer}>
        <View style={styles.detailTextContainer}>
          <FareContractFromTo
            fc={fareContract}
            backgroundColor={theme.color.background.neutral[0]}
            mode="small"
          />
          {!!fareProductTypeConfig?.transportModes && (
            <FareContractDetail
              content={[
                getTransportModeText(fareProductTypeConfig.transportModes, t),
              ]}
            />
          )}

          <FareContractDetail
            content={userProfilesWithCount.map((u) =>
              userProfileCountAndName(u, language),
            )}
          />
        </View>
        <InspectionSymbol
          preassignedFareProduct={preassignedFareProduct}
          sentTicket={validityStatus === 'sent'}
        />
      </GenericSectionItem>
      {isCarnetFareContract && (
        <GenericSectionItem>
          <CarnetFooter
            active={validityStatus === 'valid'}
            maximumNumberOfAccesses={maximumNumberOfAccesses!}
            numberOfUsedAccesses={numberOfUsedAccesses!}
          />
        </GenericSectionItem>
      )}
      {shouldShowBundlingInfo && (
        <MobilityBenefitsInfoSectionItem benefits={benefits} />
      )}
      {isActivateTicketNowEnabled &&
        isCanBeActivatedNowFareContract(fareContract, now, currentUserId) && (
          <ActivateNowSectionItem fareContractId={fareContract.id} />
        )}
      {!isStatic && (
        <LinkSectionItem
          text={t(
            validityStatus === 'valid' && isInspectable
              ? FareContractTexts.detailsLink.valid
              : FareContractTexts.detailsLink.notValid,
          )}
          onPress={onPressDetails}
          testID={testID + 'Details'}
        />
      )}
      {isCanBeConsumedNowFareContract(fareContract, now, currentUserId) && (
        <ConsumeCarnetSectionItem fareContractId={fareContract.id} />
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
    alignItems: 'center',
    columnGap: theme.spacing.small,
  },
  detailTextContainer: {
    rowGap: theme.spacing.xSmall,
  },
}));
